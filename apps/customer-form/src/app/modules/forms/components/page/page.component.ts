import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
  HostBinding,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
import {
  FormService,
  DynamicFormControlService,
  ClientService,
  AgentService,
  ApiService,
  AnswerService,
  ApplicationStateService, AnalyticsService
} from '../../services';
import { takeUntil, skip } from 'rxjs/operators';
import {
  Question,
  Page,
  Form,
  Company,
  SummaryItem,
  Client,
  Answer
} from '../../models';
import { FormGroup, FormArray } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import {
  createSummaryObjectFromPages,
  getFormControlByDetectingArray,
  createSummaryItemFromPageDataAndInsertAtIndex,
  hasIntegration,
  ObjectModelMap,
  isMultipleObj,
  updateFormControlsFromClientData,
  conditionsAreTrue,
  removeSummaryItemAndUpdateSummaryObject,
  isMultipleAdd,
  updateFormAndSummaryWithClientData,
  onMatchProperties
} from './page-helper-functions';
import { CompanyService } from '../../../../../app/modules/layout/services/company.service';
import { cloneDeep, findIndex } from 'lodash';
import { PageAnimationStateTypes } from './page.interface';
import { FormViewService, FormBuilderService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  animations: [
    trigger('PageAnimation', [
      state('unloaded', style({ opacity: 0, transform: 'translateY(120px)' })),
      state('loaded', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('unloaded => loaded', animate('500ms ease-out'))
    ]),
    trigger('SummaryAnimation', [
      state('none', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('loaded', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('none => loaded', animate('250ms ease-out'))
    ])
  ]
})
export class PageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private companyService: CompanyService,
    private DFCS: DynamicFormControlService,
    private cd: ChangeDetectorRef,
    private clientService: ClientService,
    private agentService: AgentService,
    private apiService: ApiService,
    private answerService: AnswerService,
    private applicationService: ApplicationStateService,
    private formAnalyticService: AnalyticsService,
    private formViewService: FormViewService,
    private formBuilderService: FormBuilderService
  ) {}

  public ngUnsubscriber: Subject<any> = new Subject<void>();
  @HostBinding('class') className = 'container';
  @ViewChild('pageSection') pageSection: ElementRef;
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  params: Params = Object.assign({}, this.route.snapshot.params);
  question: Question;
  pages: Page[];
  formData: Form;
  currentPage: Page;
  // main form is the form generated from the whole form data
  mainForm: FormGroup;
  // page form is the form for this page id
  pageForm: FormGroup;
  // current form is the form for this question which is a group of answers
  currentForm: FormGroup;
  summary: SummaryItem[];
  currentQuestionNumber = 0;
  loaded = false;
  currentPageNumber: number;
  pageName = this.params.page;
  isPrevIcon = false;
  isNextIcon = false;
  questionHovered: any = { flag: false, questionToBeDisplayed: '' };
  width = window.innerWidth;
  // if this page has multiple adding mechanism, then current index of current Item is kept here
  currentIndexOfMultipleItemInProgress = 0;
  company: Company;
  client: Client = new Client();
  pageSubscription: Subscription;
  pageAnimationState: PageAnimationStateTypes = 'unloaded';
  dataSaveInProgress: boolean;
  questionAnimationState: 'unloaded' | 'moveup' | 'appear' | 'movedown' =
    'unloaded';
  summaryAnimationState: 'loaded' | 'none' = 'none';
  answers: Answer[];
  questionsOfThisPage: Question[];
  queuedUpdates = [];
  form$: Observable<any>;
  formModel = {};
  formViewerForm;
  pageIndex = 0;
  questionIndex = 0;
  formView;
  formOptions = {
    formState: {
      questionnum: 0,
      sectionnum: 0,
      subindex: 0
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number } }) {
    this.width = event.target.innerWidth;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler = () => {
    if (this.client.id && this.company.id && this.pageName !== 'thank-you') {
      if (localStorage.getItem('formStatus') === 'Filling') {
        localStorage.setItem('formStatus', 'Exited');
        this.updateFormStatus('Exited');
      }
    }
  };

  ngOnInit() {
    this.params = Object.assign({}, this.route.snapshot.params);
    this.setForm();
    // this.form$.subscribe(fvForm => {
    //     this.formView = fvForm;
    //     this.formViewerForm = new FormArray(fvForm['components'].map(() => new FormGroup({})))
    // })
    this.route.queryParams.subscribe(queryParams => {
      // console.log(queryParams, this.formModel);
      this.queryParams = queryParams;
      const { questionnum, subindex } = queryParams;
      if (this.formData) {
        if (this.queryParams.clientId) {
          if (this.client.id) {
            this.setPageAndQuestionsAndAnswers({
              pagename: this.pageName,
              currentQuestionNumber: +questionnum || 0,
              subIndex: +subindex || 0
            });
          }
        } else {
          this.setPageAndQuestionsAndAnswers({
            pagename: 'start',
            currentQuestionNumber: this.pageName === 'start' ? (+questionnum || 0) : null,
            subIndex: this.pageName === 'start' ? (+subindex || 0) : null
          });
        }
      }
    });
    this.applicationService.addressAutocomplete.subscribe(selectedData => {
      if (selectedData) {
        this.handleAddressAutocompleted(selectedData);
      }
    });
  }

  get isMobile() {
    return this.width <= 767;
  }

  setForm() {
    if (this.queryParams.formId) {
      this.getForm();
    } else {
      this.routeTo(this.queryParams, 'list-all-forms');
    }
    if (this.queryParams.companyId) {
      this.companyService.companyDetails.subscribe((company: Company) => {
        this.company = company;
      });
    }
    // this.form$ = this.formTemplateService.getFormByFormId(this.queryParams.formId);
  }

  // gets the form with the value from the queryparams(companyId, formId)
  getForm() {
    // we are getting the data of form by id
    // the page is found from the route params
    // that pageroute is used to find the page from the form.page.routepath
    // the page data is available in question data
    this.formService
      .getById(this.queryParams.companyId, this.queryParams.formId)
      .subscribe(formDataResponse => {
        this.formData = formDataResponse;
        this.formBuilderService.setFormObs(formDataResponse);
        this.pages = cloneDeep(this.formData.pages);
        this.mainForm = this.DFCS.toFormGroup(this.pages);

        // create summary object from formdata after getting form
        this.summary = createSummaryObjectFromPages(this.pages);
        this.loaded = true;

        this.getClient();

        this.route.params.pipe(skip(1)).subscribe(({ page }) => {
          this.pageName = page;
          if (this.formData && !this.dataSaveInProgress) {
            if (this.queryParams.clientId || this.client.id) {
              this.setPageAndQuestionsAndAnswers({
                pagename: page,
                currentQuestionNumber: +this.queryParams.questionnum || 0,
                subIndex: +this.queryParams.subindex || 0
              });
            }
          }
        });
      });
  }

  getClient() {
    // 3. Client ID exists and token exists in the URL -> store token in local and assume existing client
    if (
      typeof this.queryParams.clientId !== 'undefined' &&
      this.queryParams.clientId &&
      typeof this.queryParams.token !== 'undefined' &&
      this.queryParams.token
    ) {
      localStorage.setItem('token', this.queryParams.token);
      localStorage.setItem('clientId', this.queryParams.clientId);
      const queryParams = {
        ...this.queryParams
      };
      delete queryParams['token'];
      this.routeTo(queryParams, this.params.page);
    }
    //  No client Id exists or no token exists -> New client
    if (!this.queryParams.clientId || !localStorage.getItem('token')) {
      localStorage.clear();
      const queryParams: any = {
        ...this.queryParams,
        companyId: this.queryParams.companyId,
        formId: this.queryParams.formId
      };
      delete queryParams['clientId'];
      if (this.queryParams.agent) {
        queryParams.agent = this.queryParams.agent;
      }
      this.queryParams = queryParams;
      this.routeTo(this.queryParams, 'start');
      this.recordFormAnalytics('Visited XILO')
    }
    this.client = new Client();
    // 6. No client Id exists and no token exists -> New client

    if (
      this.queryParams.clientId &&
      (localStorage.getItem('userId') ||
        localStorage.getItem('clientId') ||
        localStorage.getItem('agentId') ||
        localStorage.getItem('token'))
    ) {
      this.clientService
        .getById(this.queryParams.clientId)
        .subscribe(client => {
          this.client = client;
          // after getting details of client fill it in the formcontrols and
          updateFormControlsFromClientData(
            client,
            this.mainForm,
            this.formData,
            this.DFCS,
            this.summary
          );
          this.filterPages();

          this.loaded = true;
          this.summaryAnimationState = 'loaded';
          this.setPageAndQuestionsAndAnswers({
            pagename: this.pageName,
            currentQuestionNumber: +this.queryParams.questionnum || 0,
            subIndex: +this.queryParams.subindex || 0
          });
          // setTimeout(() => {
          // }, 500);
        });
    } else {
      this.loaded = true;
      this.summaryAnimationState = 'loaded';
      this.setPageAndQuestionsAndAnswers({
        pagename: 'start'
      });
    }
  }

  // set the page according to the param in the route :page
  setPageAndQuestionsAndAnswers({
    pagename,
    shouldChangeURL = true,
    currentQuestionNumber = 0,
    subIndex = 0
  }: {
    pagename: string;
    shouldChangeURL?: boolean;
    currentQuestionNumber?: number;
    subIndex?: number;
  }) {
    this.filterPages();
    this.applicationService.formErrorsSource.next(null);
    this.currentQuestionNumber = currentQuestionNumber;
    this.currentIndexOfMultipleItemInProgress = subIndex;
    // shouldChangeURL is false whene the page is initilaised, so all other cases we have to change the url also
    this.pageName = pagename;
    if (shouldChangeURL) {
      this.router.navigate(['/form', pagename], {
        queryParams: this.queryParams
      });
    }
    this.currentPage = cloneDeep(
      this.pages.find((page, index) => {
        if (page.routePath === pagename) {
          this.currentPageNumber = index;
          return true;
        }
      })
    );
    if (this.currentPage) {
      // create the full formgroup from the questions data of this page
      const form = this.mainForm.controls[this.currentPage.id];
      this.questionsOfThisPage = cloneDeep(this.currentPage.questions);

      this.pageForm = getFormControlByDetectingArray(
        form,
        this.currentIndexOfMultipleItemInProgress
      ) as FormGroup;

      if (!this.pageForm) {
        this.setPageAndQuestionsAndAnswers({ pagename: this.pageName });
      }
      // since we have the question number in the url we have to check if that goes wrong
      if (this.currentQuestionNumber >= this.currentPage.questions.length) {
        (this.currentQuestionNumber = 0),
          (this.currentIndexOfMultipleItemInProgress = 0);
      }
      this.setCurrentQuestionWithIndex(this.currentQuestionNumber);
      if (this.pageSubscription) {
        this.pageSubscription.unsubscribe();
      }
      this.pageSubscription = this.pageForm.statusChanges
        .pipe(takeUntil(this.ngUnsubscriber))
        .subscribe(status => {
          this.currentPage.questions = this.filterQuestions();
          if (status === 'VALID') {
            this.updateSummaryStatusValuesFromPageForm();
          }
        });
    } else if (this.pageName !== 'finish') {
      this.routeTo(this.queryParams, 'start');
    }
    setTimeout(() => {
      this.pageAnimationState = 'loaded';
    }, 500);
  }

  setCurrentQuestionWithIndex(questionNumber) {
    this.currentPage.questions = this.filterQuestions();

    if (this.currentPage.questions.length) {
      this.question = this.currentPage.questions[questionNumber];
      this.currentForm = this.pageForm.controls[this.question.id] as FormGroup;
      this.router.navigate([`/form/${this.pageName}`], {
        queryParams: {
          ...this.queryParams,
          questionnum: this.currentQuestionNumber,
          subindex: this.currentIndexOfMultipleItemInProgress
        }
      });

      // this.loaded = true;
      this.updateTheProgressBarIcons();
      setTimeout(() => {
        this.questionAnimationState = 'appear';
      }, 100);
      this.cd.markForCheck();
    }
  }

  filterPages() {
    this.pages.forEach((page: Page) => {
      if (page.conditions && page.conditions.length > 0) {
        if (
          conditionsAreTrue(
            page.conditions,
            this.mainForm,
            this.currentIndexOfMultipleItemInProgress
          )
        ) {
          page.hidden = true;
          this.summary.forEach(summaryItem => {
            if (summaryItem.pageid === page.id) {
              summaryItem.hidden = false;
            }
          });
          return true;
        } else {
          this.summary.forEach(summaryItem => {
            if (summaryItem.pageid === page.id) {
              summaryItem.hidden = true;
            }
          });
          return false;
        }
      }
      return true;
    });
  }

  filterQuestions() {
    const questions = this.questionsOfThisPage.filter(question => {
      return question.questionConditions && question.questionConditions.length
        ? conditionsAreTrue(
            question.questionConditions,
            this.mainForm,
            this.currentIndexOfMultipleItemInProgress
          )
        : true;
    });

    return questions;
  }
  // changing page can be done with pagenumber and 'next' 'prev' arguments
  handleChangePage(event: { page: number | string; subIndex?: number }) {
    const queryParams: any = {
      ...this.queryParams,
      hasReturnToFormSelectionPage: this.formData.hasReturnToFormSelectionPage
    };
    this.pageAnimationState = 'unloaded';
    this.filterPages();
    // if subindex is not present then find if it exixt for next or prev question
    if (typeof event.page === 'number') {
      this.setPageAndQuestionsAndAnswers({
        pagename: this.pages[event.page].routePath,
        subIndex: event.subIndex || 0
      });
    } else if (event.page === 'next') {
      const currentItemIndex = this.summary.findIndex(
        summaryItem =>
          summaryItem.pageIndex === this.currentPageNumber &&
          summaryItem.subIndex === this.currentIndexOfMultipleItemInProgress
      );
      if (currentItemIndex < this.summary.length - 1) {
        let nextItem;
        // ];
        for (
          let index = currentItemIndex;
          index < this.summary.length;
          index++
        ) {
          const summaryItem = this.summary[index + 1];

          if (summaryItem && !summaryItem.hidden) {
            nextItem = summaryItem;
            break;
          }
        }
        if (nextItem) {
          this.setPageAndQuestionsAndAnswers({
            pagename: this.pages[nextItem.pageIndex].routePath,
            subIndex: nextItem.subIndex
          });
        } else {
          this.routeTo(queryParams, 'thank-you');
        }
      } else if (this.isLastQuestion()) {
        this.routeTo(queryParams, 'thank-you');
      }
    } else if (event.page === 'prev') {
      if (this.currentPageNumber - 1 > -1) {
        let prevItem;
        const currentItemIndex = this.summary.findIndex(
          summaryItem =>
            summaryItem.pageIndex === this.currentPageNumber &&
            summaryItem.subIndex === this.currentIndexOfMultipleItemInProgress
        );
        // ];
        for (
          let index = currentItemIndex;
          index < this.summary.length;
          index--
        ) {
          const summaryItem = this.summary[index - 1];

          if (!summaryItem.hidden) {
            prevItem = summaryItem;
            break;
          }
        }

        this.setPageAndQuestionsAndAnswers({
          pagename: this.pages[prevItem.pageIndex].routePath,
          subIndex: prevItem.subIndex
        });
      }
    }
    if (this.isLastQuestion()) {
      this.recordFormAnalytics('Finished Form');
    }
  }

  handleChangeQuestion(event) {
    this.applicationService.formErrorsSource.next(null);
    this.updateSummaryWithValuesFromCurrentForm(
      this.currentForm.value,
      this.currentForm.valid
    );
    // this.loaded = false;
    if (typeof event === 'number') {
      this.currentQuestionNumber = event;
      this.setCurrentQuestionWithIndex(this.currentQuestionNumber);
    }

    if (event === 'next') {
      this.questionAnimationState = 'moveup';
      setTimeout(() => {
        if (
          this.currentQuestionNumber <
          this.currentPage.questions.length - 1
        ) {
          if (this.currentForm.valid) {
            this.currentQuestionNumber++;
            this.setCurrentQuestionWithIndex(this.currentQuestionNumber);
          } else {
            this.validateForm();
          }
        } else if (this.currentForm.valid) {
          this.handleChangePage({ page: 'next' });
        }
      }, 100);
    } else if (event === 'prev') {
      this.questionAnimationState = 'movedown';
      setTimeout(() => {
        if (this.currentQuestionNumber) {
          this.currentQuestionNumber--;
          this.setCurrentQuestionWithIndex(this.currentQuestionNumber);
        }
      }, 100);
    }
    if (this.pageSection) {
      this.pageSection.nativeElement.scrollTop = 0;
    }
  }

  // this is triggered from the summary component
  handleGotoQuestion(indexes: {
    pageIndex: number;
    subIndex: number;
    questionIndex: number;
  }) {
    this.setPageAndQuestionsAndAnswers({
      pagename: this.pages[indexes.pageIndex].routePath,
      subIndex: indexes.subIndex,
      currentQuestionNumber: indexes.questionIndex
    });
  }
  // this method is for the next button on the progress bar
  handleNextQuestionClick() {
    if (this.currentQuestionNumber < this.currentPage.questions.length - 1) {
      this.handleChangeQuestion('next');
    }
  }

  progressBarHover(i) {
    if (i < this.currentPage.questions.length) {
      if (
        this.pageForm.controls[this.currentPage.questions[i].id].status ===
        'VALID'
      ) {
        this.questionHovered = {
          flag: true,
          questionToBeDisplayed: this.currentPage.questions[i].headerText
        };
      }
    }
  }

  progressBarHoverOut() {
    this.questionHovered = {
      flag: false,
      questionToBeDisplayed: ''
    };
  }

  isValid(questionId): boolean {
    // checking if multiple add
    const question = this.currentPage.questions.find(
      qn => qn.id === questionId
    );
    const firstAnswer = question.answers[0];
    // if the page form is valid then show valid status to the multiple add bar
    if (firstAnswer) {
      if (isMultipleAdd(firstAnswer)) {
        return this.pageForm && this.pageForm.status === 'VALID';
      }
    }
    return (
      this.pageForm &&
      !this.pageForm.controls[questionId].pristine &&
      this.pageForm.controls[questionId].status === 'VALID'
    );
  }

  updateTheProgressBarIcons() {
    // check if there exists a next question
    if (this.currentPage.questions[this.currentQuestionNumber + 1]) {
      // if current question is valid, then show the next enabled icon
      const currentQuestionFormControl = this.pageForm.controls[
        this.currentPage.questions[this.currentQuestionNumber].id
      ];
      if (currentQuestionFormControl.valid) {
        this.isNextIcon = true;
      } else {
        this.isNextIcon = false;
      }
      // if current question is greater than 1 show prev enabled icon
      if (this.currentQuestionNumber > 0) {
        this.isPrevIcon = true;
      } else {
        this.isPrevIcon = false;
      }
    } else {
      this.isNextIcon = false;
    }
  }
  ishighlightedProgressItem(i) {
    return i <= this.currentQuestionNumber;
  }
  isAttended(questionIndex, questionId) {
    return (
      questionIndex > this.currentQuestionNumber && this.isValid(questionId)
    );
  }

  handleProgressItemClick(index, id) {
    if (this.isValid(id)) {
      this.currentQuestionNumber = index;
      this.setCurrentQuestionWithIndex(index);
    }
  }

  validateForm() {
    //
    // Object.keys(this[form].controls).forEach((field) => {
    //   const control: FormControl = this[form].get(field);
    //   control.markAsTouched({ onlySelf: true });
    // });
  }

  // we will update the server if only the currentform is valid
  updateSummaryWithValuesFromCurrentForm(currentFormValue, shouldUpdateServer) {
    const answersToPush = [];
    const currentPageId = this.currentPage.id;
    const summaryItemFound = this.summary.find(
      summaryItem =>
        summaryItem.pageid === currentPageId &&
        summaryItem.subIndex === this.currentIndexOfMultipleItemInProgress
    );
    for (const answerId in currentFormValue) {
      if (currentFormValue.hasOwnProperty(answerId)) {
        const answerValue = currentFormValue[answerId];
        const answerItemFound = summaryItemFound.answers.find(
          answerItem => answerItem.id === answerId
        );
        if (answerItemFound) {
          answerItemFound.answerValue = answerValue;
          if (shouldUpdateServer) {
            answersToPush.push(answerItemFound);
          }
          if (!this.pageForm.valid) {
            summaryItemFound.lastQuestionIndex = answerItemFound.questionIndex;
          }
        }
        if (!this.pageForm.valid) {
          summaryItemFound.pristine = false;
        }
      }
    }
    if (shouldUpdateServer) {
      localStorage.setItem('formStatus', 'Filling');
      const updates: {
        objModel: string;
        object: { id: string; [x: string]: string };
      }[] = [
        {
          objModel: 'Client',
          object: { id: this.client.id, formStatus: 'Filling' }
        }
      ];
      if (this.isLastQuestion()) {
        const ref = localStorage.getItem('ref');
        if (ref) updates[0].object['referredBy'] = ref;
      }
      for (const answer of answersToPush) {
        if (!answer.answerValue) {
          continue;
        }
        if (!this.client.companyClientId) {
          this.client.companyClientId = this.company.id;
        }
        const objModel = ObjectModelMap[answer.objectName];
        const objectName = answer.objectName;
        const foundObjectWithSameModel = updates.find(
          obj => obj.objModel === objModel
        );
        if (foundObjectWithSameModel) {
          foundObjectWithSameModel.object[answer.propertyKey] =
            answer.answerValue;
          if (isMultipleObj(objectName)) {
            if (
                !this.client[objectName][
                this.currentIndexOfMultipleItemInProgress
                ]
            ) {
              this.client[objectName][
                this.currentIndexOfMultipleItemInProgress
              ] = {};
            }
            this.client[objectName][
              this.currentIndexOfMultipleItemInProgress
            ][answer.propertyKey] = answer.answerValue;
          } else if (objectName == 'business') {
            this.client.business[answer.propertyKey] = answer.answerValue;
          } else if (objectName === 'client') {
            this.client[answer.propertyKey] = answer.answerValue;
          }
        } else {
          let id;
          if (isMultipleObj(objectName)) {
            const currentClientObj =
              this.client[objectName][
                this.currentIndexOfMultipleItemInProgress
              ] || {};
            if (currentClientObj === {}) {
              this.client[objectName][
                this.currentIndexOfMultipleItemInProgress
              ] = {}
            }
            id = this.client[objectName][
              this.currentIndexOfMultipleItemInProgress
            ]
              ? currentClientObj.id
              : undefined;
            currentClientObj[`client${objModel}Id`] = this.client.id;
            currentClientObj[`company${objModel}Id`] = this.company.id;
            if (
                !this.client[objectName][
                  this.currentIndexOfMultipleItemInProgress
                ]
            ) {
              this.client[objectName][
                this.currentIndexOfMultipleItemInProgress
              ] = {};
            }
            this.client[objectName][
              this.currentIndexOfMultipleItemInProgress
            ][answer.propertyKey] = answer.answerValue;
          } else {
            id =
              answer.objectName === 'client'
                ? this.client.id
                : this.client[answer.objectName].id;
          }
          const updateObject = {
            objModel,
            object: {
              id,
              [answer.propertyKey]: answer.answerValue,
              [`company${objModel}Id`]: this.company.id
            }
          };

          if (!id && objectName !== 'client') {
            updateObject.object[`client${objModel}Id`] = this.client.id;
            updateObject.object[`company${objModel}Id`] = this.company.id;
          }
          updates.push(updateObject);
        }
      }
      this.upsert(updates);
    }
  }
  async upsert(updates: any[]) {
    this.dataSaveInProgress = true;

    // we need a clientid to update every object
    if (!this.client.id) {
      const currentUpdateObj = updates[0].object;
      localStorage.setItem('formStatus', 'Filling');
      const updateObj: any = {
        updates: [
          {
            objModel: 'Client',
            object: {
              companyClientId: this.company.id,
              formStatus: 'Filling',
              ...currentUpdateObj
            }
          }
        ]
      };
      if (!this.client.clientAgentId) {
        if (
          this.formData.hasDefaultAssignedAgent &&
          this.formData &&
          this.formData.agentFormId &&
          this.formData.emailDefaultAgentOnly
        ) {
          this.client.clientAgentId = this.formData.agentFormId;
          updateObj.updates[0].object.clientAgentId = this.client.clientAgentId;
        } else if (this.formData.hasRoundRobinAssignment) {
          const agent = await this.agentService.getAgentByRoundRobin(
            this.formData.id
          );
          if (agent && agent.id) {
            this.client.clientAgentId = agent.id;
            updateObj.updates[0].object.clientAgentId = this.client.clientAgentId;
          }
        } else if (this.queryParams.agent) {
          const agent = await this.agentService.getAgentIdByEmail(
            this.queryParams.agent
          );
          if (agent) {
            this.client.clientAgentId = agent;
            updateObj.updates[0].object.clientAgentId = this.client.clientAgentId;
          }
        }
      }
      if (hasIntegration('INFUSIONSOFT', this.formData)) {
        if (this.queryParams.infusionsoftTagId) {
          this.client.infusionsoftTagId = this.queryParams.infusionsoftTagId;
          updateObj.updates[0].object.infusionsoftTagId = this.client.infusionsoftTagId;
        } else if (this.formData.infusionsoftTagId) {
          this.client.infusionsoftTagId = this.formData.infusionsoftTagId;
          updateObj.updates[0].object.infusionsoftTagId = this.client.infusionsoftTagId;
        }
        if (this.queryParams.infusionsoftContactId) {
          this.client.infusionsoftClientId = this.queryParams.infusionsoftContactId;
          updateObj.updates[0].object.infusionsoftClientId = this.client.infusionsoftClientId;
        }
      }
      if (hasIntegration('EZLYNX', this.formData) && !this.client.ezlynxId) {
        if (this.queryParams.ezlynxId) {
          this.client.ezlynxId = this.queryParams.ezlynxId;
          updateObj.updates[0].object.ezlynxId = this.client.ezlynxId;
        }
      }
      if (this.formData.id && !this.client.formClientId) {
        updateObj.updates[0].object.formClientId = this.formData.id;
      }
      this.clientService
        .upsertAll(updateObj, this.queryParams.companyId, true)
        .subscribe(data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('clientId', data.responses[0].id);
          this.client.id = data.responses[0].id;
          this.queryParams = Object.assign({}, this.queryParams, {
            clientId: this.client.id
          });
          this.recordFormAnalytics('Started Form');
          this.routeTo(this.queryParams, this.pageName);
          if (updates.length) {
            updates.forEach(update => {
              if (update.objModel === 'Client') {
                update.object.id = data.responses[0].id;
              }
            });
            if (this.queuedUpdates.length > 0) {
              updates.push(...this.queuedUpdates);
              this.queuedUpdates = [];
            }
            this.upsert(updates);
          }

          this.dataSaveInProgress = false;
        });
    } else {
      this.client.formStatus = 'Filling';
      if (this.queuedUpdates.length > 0) {
        updates.push(...this.queuedUpdates);
        this.queuedUpdates = [];
      }
      updates = this.mergeUpdates(updates);
      this.clientService
        .upsertAll({ updates }, this.queryParams.companyId)
        .subscribe(data => {
          updates.forEach((updateObj, index) => {
            if (!updateObj.object.id) {
              if (isMultipleObj(ObjectModelMap[updateObj.objModel])) {
                if (this.client[ObjectModelMap[updateObj.objModel]].length === 0) {
                  this.client[ObjectModelMap[updateObj.objModel]][
                    this.currentIndexOfMultipleItemInProgress
                  ] = {id: data.responses[index].id };
                } else if (!this.client[ObjectModelMap[updateObj.objModel]][
                    this.currentIndexOfMultipleItemInProgress
                  ].id) {
                  this.client[ObjectModelMap[updateObj.objModel]][
                    this.currentIndexOfMultipleItemInProgress
                  ].id = data.responses[index].id;
                }
              }
            }
          });
          this.dataSaveInProgress = false;
        });

      if (this.client.drivers.length > 0) {
        this.onTransferDriverInfo();
      }

    }
  }
  async onTransferDriverInfo() {
      const driver = this.client.drivers[0];
      let clientChangesMade = false;
      let updates = { objModel: 'Client', object: { id: this.client.id } };
      if (!
          this.returnExists(this.client.firstName) &&
          this.returnExists(driver.applicantGivenName)
          ) {
            updates.object['firstName'] = driver.applicantGivenName;
            this.client.firstName = updates.object['firstName'];
            clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.lastName) &&
          this.returnExists(driver.applicantSurname)
        ) {
          updates.object['lastName'] = driver.applicantSurname;
          this.client.lastName = updates.object['lastName'];
          clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.fullName) &&
          this.returnExists(this.client.firstName) &&
          this.returnExists(this.client.lastName)
        ) {
          updates.object['fullName'] = `${this.client.firstName} ${this.client.lastName}`;
          this.client.fullName = updates.object['fullName'];
          clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.maritalStatus) &&
          this.returnExists(driver.applicantMaritalStatusCd)
        ) {
          updates.object['maritalStatus'] = driver.applicantMaritalStatusCd;
          this.client.maritalStatus = updates.object['maritalStatus'];
          clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.gender) &&
          this.returnExists(driver.applicantGenderCd)
        ) {
          updates.object['gender'] = driver.applicantGenderCd;
          this.client.gender = updates.object['gender'];
          clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.birthDate) &&
          this.returnExists(driver.applicantBirthDt)
        ) {
          updates.object['birthDate'] = driver.applicantBirthDt;
          this.client.birthDate = updates.object['birthDate'];
          clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.occupation) &&
          this.returnExists(driver.applicantOccupationClassCd)
        ) {
          updates.object['occupation'] = driver.applicantOccupationClassCd;
          this.client.occupation = updates.object['occupation'];
          clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.industry) &&
          this.returnExists(driver.industry)
        ) {
          updates.object['industry'] = driver.industry;
          this.client.industry = updates.object['industry'];
          clientChangesMade = true;
      }
      if (!
          this.returnExists(this.client.educationLevel) &&
          this.returnExists(driver.educationLevel)
        ) {
          updates.object['educationLevel'] = driver.educationLevel;
          this.client.educationLevel = updates.object['educationLevel'];
          clientChangesMade = true;
      }
      if (clientChangesMade) {
        this.queuedUpdates.push(updates);
      }
  }
  mergeUpdates(updates: any[]) {
    const mUpdates = [];
    for (let update of updates) {
      const i = mUpdates.findIndex(upd => upd.objModel === update.objModel);
      if (i > -1) {
        mUpdates[i].object = { ...mUpdates[i].object, ...update.object };
      } else {
        mUpdates.push(update);
      }
    }
    return mUpdates;
  }
  recordFormAnalytics(eventName: string) {
    let formAnalyticsUID;
    formAnalyticsUID = localStorage.getItem('formAnalytics');
    if (!formAnalyticsUID) {
      formAnalyticsUID = this.create_UUID();
    }
    const formData = {
      eventName: eventName,
      formId: this.formData.id,
      companyId: this.company.id,
      formAnalyticsUID: formAnalyticsUID,
      page_url: document.location.href,
      referrer: document.referrer
    };

    const extn = localStorage.getItem('token') ? '' : '/new';
    this.formAnalyticService.recordFormAnalytic(extn, formData)
        .subscribe(data => {
          if (data && data['success']) {
            localStorage.setItem('formAnalytics', data['formAnalyticsUID']);
          }
        }, error => {
          console.log('Error with analytics', error);
        })
  }
  create_UUID() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  routeTo(queryParams: any, path: string) {
    this.router.navigate([`/form/${path}`], { queryParams });
  }
  updateSummaryStatusValuesFromPageForm() {
    const currentPageId = this.currentPage.id;

    const summaryItemFound = this.summary.find(
      summaryItem =>
        summaryItem.pageid === currentPageId &&
        summaryItem.subIndex === this.currentIndexOfMultipleItemInProgress
    );
    summaryItemFound.pristine = this.pageForm.pristine;
    summaryItemFound.valid = this.pageForm.valid;
  }

  handleCreateNewFormQuestionTrigger(objectName) {
    // when the user decides to add multiple item
    // we have to create another item in the mainform
    this.DFCS.createDuplicateFormOfPage(this.currentPage, objectName);

    // set the currentIndexOfMultipleItemInProgress as the last index in the list of item
    const newCurrentIndexOfMultipleItemInProgress =
      (this.mainForm.controls[this.currentPage.id] as FormArray).length - 1;

    // create this item in the summary object
    createSummaryItemFromPageDataAndInsertAtIndex(
      this.summary,
      this.currentPage,
      this.currentPageNumber,
      newCurrentIndexOfMultipleItemInProgress
    );

    // then we have to switch to the first question of this page and then
    this.setPageAndQuestionsAndAnswers({
      pagename: this.currentPage.routePath,
      currentQuestionNumber: 0,
      subIndex: newCurrentIndexOfMultipleItemInProgress
    });
    //
  }
  handleDeleteMultipleItemTrigger(summaryItem: SummaryItem) {
    this.deleteItemFromClientData(summaryItem);
  }

  deleteItemFromClientData(summaryItem: SummaryItem) {
    const model = ObjectModelMap[summaryItem.objectName];
    const obj = this.client[summaryItem.objectName][summaryItem.subIndex];

    if (this.currentPage.id === summaryItem.pageid) {
      if (+this.queryParams.subindex >= summaryItem.subIndex) {
        this.handleChangePage({ page: 'next' });
      }
    }
    this.DFCS.removePageFromMainForm(summaryItem);
    removeSummaryItemAndUpdateSummaryObject(summaryItem, this.summary);
    if (this.client[summaryItem.objectName].length > 1) {
      this.clientService
        .deleteByModel(obj.id, this.queryParams.companyId, model)
        .subscribe(
          () => {},
          error => {
            console.log('deleteItemFromClientData -> error', error);
          }
        );
    }
  }

  isNextButtonNeeded() {
    let isNeeded = false;
    if (
      this.currentPage &&
      this.currentPage.questions[this.currentQuestionNumber] &&
      this.currentPage.questions[this.currentQuestionNumber].answers.length ===
        1 &&
      this.currentPage.questions[this.currentQuestionNumber].answers[0]
        .isMultipleSelect
    ) {
      isNeeded = true;
    }
    return (
      (this.currentPage &&
        this.currentPage.questions[this.currentQuestionNumber] &&
        !!this.currentPage.questions[this.currentQuestionNumber]
          .nextButtonText) ||
      isNeeded
    );
  }

  isLastQuestion() {
    const currentSummaryIndex = this.summary.findIndex(
      summaryItem =>
        summaryItem.pageid === this.currentPage.id &&
        this.currentIndexOfMultipleItemInProgress === summaryItem.subIndex
    );
    return (
      this.summary.length === currentSummaryIndex + 1 &&
      this.currentQuestionNumber === this.currentPage.questions.length - 1
    );
  }

  updateFormStatus(status: string) {
    this.clientService
      .upsertAll(
        {
          updates: [
            {
              objModel: 'Client',
              object: { id: this.client.id, formStatus: status }
            }
          ]
        },
        this.queryParams.companyId,
        false
      )
      .subscribe();
  }

  async handleAddressAutocompleted(selectedData: {
    addressObj: any;
    answer: Answer;
  }) {
    this.applicationService.formErrorsSource.next({
      message: null,
      type: null
    });
    const answer = selectedData.answer;
    const objectName = answer.objectName;
    const address = selectedData.addressObj;

    const indexArray = address['address_components'].map(item => {
      return item.types[0];
    });

    const streetNumber = address['address_components'][
      indexArray.indexOf('street_number')
    ]
      ? address['address_components'][indexArray.indexOf('street_number')]
          .long_name
      : null;

    const streetName = address['address_components'][
      indexArray.indexOf('route')
    ]
      ? address['address_components'][indexArray.indexOf('route')].long_name
      : null;

    const streetAddress =
      streetNumber && streetName ? `${streetNumber} ${streetName}` : null;

    const city = address['address_components'][indexArray.indexOf('locality')]
      ? address['address_components'][indexArray.indexOf('locality')].long_name
      : null;

    const county = address['address_components'][
      indexArray.indexOf('administrative_area_level_2')
    ]
      ? address['address_components'][
          indexArray.indexOf('administrative_area_level_2')
        ].long_name
      : null;

    const state = address['address_components'][
      indexArray.indexOf('administrative_area_level_1')
    ]
      ? address['address_components'][
          indexArray.indexOf('administrative_area_level_1')
        ].short_name
      : null;

    const zipCode = address['address_components'][
      indexArray.indexOf('postal_code')
    ]
      ? address['address_components'][indexArray.indexOf('postal_code')]
          .long_name
      : null;

    let fullAddress = '';

    if (!(streetNumber && streetName && city && state && zipCode)) {
      this.currentForm.get(answer.answerId).reset();
      this.applicationService.formErrorsSource.next({
        message:
          'Invalid address. Please try again (if you added a unit number in the autocomplete try it with out it)',
        type: 'warning'
      });
      setTimeout(() => {
        this.applicationService.formErrorsSource.next(null);
      }, 3500);
      return;
    }
    if (
      objectName === 'client' &&
      answer.propertyKey === 'fullAddress' &&
      this.client.unitNumber
    ) {
      fullAddress = `${streetNumber} ${streetName}${
        this.client.unitNumber ? ` unit ${this.client.unitNumber}` : ''
      }, ${city}, ${state}, ${zipCode}`;
    } else if (objectName === 'homes' && answer.propertyKey === 'fullAddress') {
      const homeIndex = this.queryParams.subindex
        ? this.queryParams.subindex
        : 0;
      fullAddress = `${streetNumber} ${streetName}${
        this.client.homes[homeIndex] && this.client.homes[homeIndex].unitNumber
          ? ` unit ${this.client.homes[homeIndex].unitNumber}`
          : ''
      }, ${city}, ${state}, ${zipCode}`;
    } else {
      fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${zipCode}`;
    }

    if (answer.propertyKey && answer.propertyKey !== 'fullAddress') {
      this.currentForm.get(answer.answerId).setValue(fullAddress);
      const objModel = ObjectModelMap[answer.objectName];
      const updateObj = [
        {
          objModel,
          object: isMultipleObj(objectName)
            ? this.client[objectName]
            : objectName === 'client' ? this.client
            : this.client[objectName]
        }
      ];
      this.queuedUpdates.push(...updateObj);
      // await this.upsert(updateObj);
      return;
    }

    const homeObj = {
      streetNumber: streetNumber,
      streetName: streetName,
      streetAddress: streetAddress,
      city: city,
      county: county,
      state: state,
      zipCode: zipCode
    };
    if (objectName === 'drivers') {
      this.client.drivers[
        this.queryParams.subindex
      ].streetNumber = streetNumber;
      this.client.drivers[this.queryParams.subindex].streetName = streetName;
      this.client.drivers[this.queryParams.subindex].city = city;
      this.client.drivers[this.queryParams.subindex].state = state;
      this.client.drivers[this.queryParams.subindex].zipCode = zipCode;
      this.client.drivers[this.queryParams.subindex].fullAddress = fullAddress;
      const updateObj = [
        {
          objModel: 'Driver',
          object: this.client.drivers[this.queryParams.subindex]
        }
      ];
      this.queuedUpdates.push(...updateObj);
      // this.upsert(updateObj);
    } else if (objectName === 'vehicles') {
      this.client.vehicles[
        this.queryParams.subindex
      ].applicantAddrStreetNumber = streetNumber;
      this.client.vehicles[
        this.queryParams.subindex
      ].applicantAddrStreetName = streetName;
      this.client.vehicles[this.queryParams.subindex].applicantAddrCity = city;
      this.client.vehicles[this.queryParams.subindex].applicantStateCd = state;
      this.client.vehicles[
        this.queryParams.subindex
      ].applicantPostalCd = zipCode;
      this.client.vehicles[this.queryParams.subindex].fullAddress = fullAddress;
      const updateObj = [
        {
          objModel: 'Vehicle',
          object: this.client.vehicles[this.queryParams.subindex]
        }
      ];
      await this.upsert(updateObj);
    } else if (objectName === 'homes') {
      const homeIndex = this.queryParams.subindex
        ? this.queryParams.subindex
        : 0;
      if (
        this.client.homes[homeIndex] &&
        this.client.homes[homeIndex].unitNumber
      ) {
        homeObj['unitNumber'] = this.client.homes[homeIndex].unitNumber;
      }
      if (!this.client.homes[homeIndex]) {
        this.client.homes[homeIndex] = {};
      }
      this.client.homes[homeIndex].streetNumber = streetNumber;
      this.client.homes[homeIndex].streetName = streetName;
      this.client.homes[homeIndex].streetAddress = streetAddress;
      this.client.homes[homeIndex].city = city;
      this.client.homes[homeIndex].county = county;
      this.client.homes[homeIndex].state = state;
      this.client.homes[homeIndex].zipCode = zipCode;
      this.client.homes[homeIndex].fullAddress = fullAddress;
      const updateObj = [
        {
          objModel: 'Home',
          object: this.client.homes[this.queryParams.subindex]
        }
      ];
      if (answer && answer.getHomeData) {
        await this.triggerGetHomeData(answer, homeObj);
      } else {
        this.queuedUpdates.push(...updateObj);
        // await this.upsert(updateObj);
      }
    } else if (objectName === 'business') {
      this.client.business.streetNumber = streetNumber;
      this.client.business.streetName = streetName;
      this.client.business.streetAddress = streetAddress;
      this.client.business.city = city;
      this.client.business.state = state;
      this.client.business.zipCode = zipCode;
      this.client.business.fullAddress = fullAddress;
      const updateObj = [
        { objModel: 'Business', object: this.client.business }
      ];
      this.queuedUpdates.push(...updateObj);
      // await this.upsert(updateObj);
    } else if (objectName === 'locations') {
      const locationIndex = this.queryParams.subindex
        ? this.queryParams.subindex
        : 0;
      this.client.locations[
        locationIndex
      ].streetNumber = streetNumber;
      this.client.locations[locationIndex].streetName = streetName;
      this.client.locations[
        locationIndex
      ].streetAddress = streetAddress;
      this.client.locations[locationIndex].county = county;
      this.client.locations[locationIndex].city = city;
      this.client.locations[locationIndex].state = state;
      this.client.locations[locationIndex].zipCode = zipCode;
      this.client.locations[
        locationIndex
      ].fullAddress = fullAddress;
      const updateObj = [
        {
          objModel: 'Location',
          object: this.client.locations[this.queryParams.locations]
        }
      ];
      if (answer && answer.getHomeData) {
        await this.triggerGetHomeData(answer, homeObj);
      } else {
        this.queuedUpdates.push(...updateObj);
        // await this.upsert(updateObj);
      }
    } else if (objectName === 'client') {
      this.client.streetNumber = streetNumber;
      this.client.streetName = streetName;
      this.client.streetAddress = streetAddress;
      this.client.city = city;
      this.client.county = county;
      this.client.stateCd = state;
      this.client.postalCd = zipCode;
      this.client.fullAddress = fullAddress;
      const clientAddress = {
        id: this.client.id,
        streetNumber: streetNumber,
        streetName: streetName,
        streetAddress: streetAddress,
        city: city,
        county: county,
        stateCd: state,
        postalCd: zipCode,
        fullAddress: fullAddress
      };
      const updateObj = [{ objModel: 'Client', object: clientAddress }];
      this.queuedUpdates.push(...updateObj);
      // this.upsert(updateObj);
    }
  }

  async triggerGetHomeData(answer: Answer, homeObj: any) {
    if (answer && answer.getHomeData) {
      this.getHomeData(
        this.queryParams,
        homeObj,
        answer.objectName
      );
    }
  }

  getHomeData(
    queryParams: any,
    homeObj: any,
    objectName: string
  ) {
    const qp = {
      ...queryParams,
      formId: this.formData.id
    }
    this.apiService
      .getPropertyData(
        {
          streetNumber: homeObj.streetNumber,
          streetName: homeObj.streetName,
          unitNumber: homeObj.unitNumber,
          city: homeObj.city,
          state: homeObj.state,
          zipCode: homeObj.zipCode
        },
        this.applicationService.getAnswers()
      )
      .subscribe(
        async (data: {
          success: boolean;
          geoObject?:any;
          homeObject?: any
        }) => {          
          if (data && data.success === true) {
            if (this.client.homes[this.queryParams.subindex] && this.client.homes[this.queryParams.subindex].id) {
              data.homeObject['id'] = this.client.homes[this.queryParams.subindex].id;
            }
            if (objectName === 'locations') {
              const objs = [{ objModel: 'Location', object: data.homeObject }];
              updateFormAndSummaryWithClientData(
                this.mainForm,
                { locations: [data.homeObject] },
                this.summary
              );
              this.queuedUpdates.push(...objs);
              // await this.upsert(objs);
            } else {
              const objs = [{ 
                  objModel: 'Home', 
                  object: {
                    ...data.homeObject,
                    ...this.client.homes[this.queryParams.subindex]
                  } 
              }];
              updateFormAndSummaryWithClientData(
                this.mainForm,
                { homes: [data.homeObject] },
                this.summary
              );
              this.queuedUpdates.push(...objs);
              // await this.upsert(objs);
            }
          } else {
            const updateObj = [
              {
                objModel: 'Home',
                object: this.client.homes[this.queryParams.subindex]
              }
            ];
            this.queuedUpdates.push(...updateObj);
          }
          // this.setHomeData(queryParams, answers, data, objectName);
        },
        error => {
          console.log(error);
        }
      );
  }

  returnExists(value) {
    if (
      (typeof value != 'undefined' && value !== null && value !== '') ||
      value === false
    ) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscriber.next();
      this.ngUnsubscriber.complete();
    } catch (e) {
      // console.warn('ngOnDestroy', e);
    }
  }
}
