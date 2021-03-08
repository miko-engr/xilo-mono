import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  HostBinding,
  ViewChild,
} from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { Company, SummaryItem, Client } from '../../models';
import { FormGroup } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CompanyService } from '../../../../../app/modules/layout/services/company.service';
import { PageAnimationStateTypes } from './page.interface';
import {
  CustomerFormMetadata,
  FormStatus,
  FormView,
  FormViewService,
  IndexSummary,
} from '@xilo-mono/form-contracts';
import {
  CustomerFormFacade,
  FormViewerComponent,
} from '@xilo-mono/form-viewer';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  animations: [
    trigger('PageAnimation', [
      state('unloaded', style({ opacity: 0, transform: 'translateY(120px)' })),
      state('loaded', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('unloaded => loaded', animate('500ms ease-out')),
    ]),
    trigger('SummaryAnimation', [
      state('none', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('loaded', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('none => loaded', animate('250ms ease-out')),
    ]),
  ],
})
export class PageComponent implements OnInit, OnDestroy {
  @HostBinding('class') className = 'container';
  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number } }) {
    this.width = event.target.innerWidth;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler = () => {
    if (this.queryParams.clientId && this.pageName !== 'thank-you') {
      this.updateFormStatus('Exited');
    }
  };

  @ViewChild(FormViewerComponent) formViewer: FormViewerComponent;

  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  params: Params = Object.assign({}, this.route.snapshot.params);
  loaded = false;
  currentPageNumber: number;
  pageName = this.params.page;
  width = window.innerWidth;
  company: Company;
  client: Client = new Client();
  pageAnimationState: PageAnimationStateTypes = 'unloaded';
  summaryAnimationState: 'loaded' | 'none' = 'none';
  formModel = {};
  sectionIndex: number;
  questionIndex: number;
  subsectionIndex: number;
  formOptions = {
    formState: {
      questionnum: 0,
      sectionnum: 0,
      subsection: 0,
    },
  };
  form = new FormGroup({});
  fields: any[] = [];
  formView: FormView;
  firstQuestionLoaded = false;
  animationInProgress$: Observable<boolean>;
  metadata: CustomerFormMetadata;

  submissionLoaded = false;

  mobileSummaryOpened = false;
  get isMobile() {
    return this.width <= 767;
  }

  private ngUnsubscriber: Subject<any> = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    public formViewService: FormViewService,
    private customerFormFacade: CustomerFormFacade
  ) {}

  ngOnInit() {
    this.params = Object.assign({}, this.route.snapshot.params);
    this.animationInProgress$ = this.customerFormFacade.animationInProgress$;
    this.formView = this.formViewService.formView;
    this.setMetadata();
    this.loadForm();
    this.loadSubmission();
    this.customerFormFacade.loadState$
      .pipe(takeUntil(this.ngUnsubscriber))
      .subscribe((loadState) => {
        if (loadState.form && !this.loaded) {
          this.formLoaded();
        }
        if (loadState.form && loadState.submission && !this.submissionLoaded) {
          this.setIndexes();
          this.subscribeToSectionsLoaded();

          this.submissionLoaded = true;
        }
      });
    // this.setForm();
  }

  setMetadata() {
    this.metadata = {
      companyId: this.queryParams.companyId,
      clientId: this.queryParams.clientId,
      agentId: this.queryParams.agentId,
      submissionId: this.queryParams.submissionId,
    };
    this.customerFormFacade.setMetadata(this.metadata);
  }

  loadForm() {
    this.customerFormFacade.loadForm(this.queryParams.formId);
  }

  formLoaded() {
    this.fields = this.formViewService.formView.components;
    this.formView = this.formViewService.formView;
    this.loaded = true;
    setTimeout(() => {
      this.pageAnimationState = 'loaded';
      this.summaryAnimationState = 'loaded';
    }, 500);
  }

  loadSubmission() {
    if (this.queryParams.submissionId) {
      this.customerFormFacade.loadSubmission(this.queryParams.submissionId);
    } else {
      this.customerFormFacade.newCustomerSubmission(this.queryParams.companyId);
    }
  }

  setIndexes() {
    this.questionIndex = +this.queryParams.question || 0;
    this.sectionIndex = +this.queryParams.section || 0;
    this.subsectionIndex = +this.queryParams.subsection || 0;
    this.queryParams.question = this.questionIndex;
    this.queryParams.section = this.sectionIndex;
    this.queryParams.subsection = this.subsectionIndex;
  }

  subscribeToSectionsLoaded() {
    const sections = this.fields[0].fieldGroup.length || 0;
    this.formViewService.sectionLoaded$
      .pipe(takeWhile((loaded) => loaded <= sections))
      .subscribe((loaded) => {
        if (loaded === sections) {
          this.loadAnswers();
        }
      });
  }

  loadAnswers() {
    if (this.formViewService.submission?.responses?.length > 0) {
      const lastIndex = this.formViewService.submission.responses.length - 1;
      const response = this.formViewService.submission?.responses[lastIndex];
      this.formViewService.form.patchValue(response);
    }
    this.customerFormFacade.validateProgress({
      sectionIndex: this.sectionIndex,
      questionIndex: this.questionIndex,
      subsectionIndex: this.subsectionIndex,
    });
    this.firstQuestionLoaded = true;
    this.subscribeToIndexChanges();
    this.subscribeToMetadataChanges();
  }

  subscribeToIndexChanges() {
    this.customerFormFacade.indexSummary$
      .pipe(takeUntil(this.ngUnsubscriber))
      .subscribe(({ sectionIndex, questionIndex, subsectionIndex }) => {
        const indexesChanged = this.indexesChanged({
          sectionIndex,
          subsectionIndex,
          questionIndex,
        });
        if (indexesChanged) {
          this.sectionIndex = sectionIndex;
          this.questionIndex = questionIndex;
          this.subsectionIndex = subsectionIndex;
          this.queryParams = {
            ...this.queryParams,
            section: sectionIndex,
            question: questionIndex,
            subsection: subsectionIndex,
          };
          if (this.firstQuestionLoaded) {
            this.refreshRoute();
            const triggerAnimation =
              this.sectionIndex !== sectionIndex ||
              this.subsectionIndex !== subsectionIndex;
            if (triggerAnimation) {
              this.triggerPageAnimation();
            }
          }
        }
      });
  }

  indexesChanged(indexes: IndexSummary) {
    return (
      indexes.sectionIndex !== this.sectionIndex ||
      indexes.subsectionIndex !== this.subsectionIndex ||
      indexes.questionIndex !== this.questionIndex
    );
  }

  subscribeToMetadataChanges() {
    this.customerFormFacade.metadata$
      .pipe(takeUntil(this.ngUnsubscriber))
      .subscribe((metadata) => {
        if (this.metadataChanged(metadata)) {
          this.metadata = metadata;
          const updatedQueryParams = {
            companyId: metadata.companyId,
            clientId: metadata.clientId,
            submissionId: metadata.submissionId,
            agentId: metadata.agentId,
          };
          this.queryParams = {
            ...this.queryParams,
            ...updatedQueryParams,
          };
          if (this.firstQuestionLoaded) {
            this.refreshRoute();
          }
        }
      });
  }

  metadataChanged(newMetadata: CustomerFormMetadata) {
    if (this.metadata) {
      return !Object.keys(this.metadata)
        .map((key) => this.metadata[key] === newMetadata[key])
        .reduce((a, b) => a && b, true);
    } else {
      return true;
    }
  }

  refreshRoute() {
    this.router.navigate([], {
      queryParams: {
        ...this.queryParams,
      },
    });
  }

  triggerPageAnimation() {
    this.pageAnimationState = 'unloaded';
    setTimeout(() => {
      this.pageAnimationState = 'loaded';
    }, 50);
  }

  onNextForm() {
    const currentPage = this.fields[0].fieldGroup[this.sectionIndex];
    if (currentPage.formControl) {
      currentPage.formControl.markAsTouched();
    }
    if (this.isLastQuestion()) {
      this.formViewer?.onSubmit();
    } else {
      this.customerFormFacade.next();
    }
  }

  onFormCompleted() {
    const params = {
      formId: this.queryParams.formId,
      companyId: this.queryParams.companyId,
      formType: 'customer-form',
    };
    this.router.navigate(['form', 'thank-you'], { queryParams: params });
  }

  currentSection() {
    if (this.fields[0].fieldGroup && this.sectionIndex >= 0) {
      return this.fields[0].fieldGroup[this.sectionIndex];
    } else {
      return null;
    }
  }

  currentQuestion() {
    const currentSection = this.currentSection();
    if (currentSection) {
      return currentSection.fieldArray
        ? currentSection.fieldArray?.fieldGroup[this.questionIndex]
        : currentSection.fieldGroup[this.questionIndex];
    } else {
      return null;
    }
  }

  currentQuestionValid() {
    const currentSection = this.currentSection();
    const currentQuestion = this.currentQuestion();
    if (currentSection && currentQuestion) {
      if (this.isRepeatableSection()) {
        const subsection =
          currentSection.formControl?.controls[this.subsectionIndex];
        if (subsection) {
          const question = subsection.controls[currentQuestion.key];
          return question?.valid;
        }
      } else {
        const question =
          currentSection.formControl?.controls[currentQuestion.key];
        return question?.valid;
      }
    }
    return false;
  }

  currentSectionValid() {
    const currentSection = this.currentSection();
    if (currentSection) {
      return currentSection.formControl?.valid;
    }
    return false;
  }

  currentSectionQuestionCount() {
    const currentSection = this.currentSection();
    if (currentSection) {
      return currentSection?.fieldArray
        ? currentSection?.fieldArray.fieldGroup?.length
        : currentSection?.fieldGroup?.length;
    }
  }

  nextButtonEnabled() {
    if (this.isLastQuestion()) {
      return this.form.valid;
    }
    if (this.isLastQuestionInSection()) {
      return this.currentSectionValid();
    } else {
      return this.currentQuestionValid();
    }
  }

  currentSectionTemplateOptions() {
    const currentSection = this.currentSection();
    if (currentSection) {
      return currentSection.fieldArray
        ? currentSection.fieldArray?.templateOptions
        : currentSection.fieldGroup?.templateOptions;
    }
    return null;
  }

  isLastQuestionInSection() {
    return this.questionIndex === this.currentSectionQuestionCount() - 1;
  }

  onAlert(obj: { type: string; message: string }) {
    if (obj.type === 'success') {
      // this.toastService.showSuccess(obj.message);
    }
  }

  isLastQuestion() {
    return (
      this.sectionIndex === this.fields[0].fieldGroup.length - 1 &&
      this.isLastQuestionInSection()
    );
  }

  showAddAnother() {
    return this.isLastQuestionInSection() && this.isRepeatableSection();
  }

  isRepeatableSection() {
    const templateOptions = this.currentSectionTemplateOptions();
    if (templateOptions) {
      return templateOptions.hasRepeatButtons;
    } else {
      return false;
    }
  }

  activePageValid() {
    const currentSection = this.currentSection();
    if (currentSection) {
      return currentSection.formControl?.valid;
    }
    return false;
  }

  getRepeatLabel(plural = false) {
    if (this.isRepeatableSection()) {
      const templateOptions = this.currentSectionTemplateOptions();
      if (templateOptions) {
        return `${templateOptions?.label}${plural ? 's' : ''}`;
      }
    }
    return null;
  }

  addRepeatSection() {
    const currentSection = this.currentSection();
    if (currentSection) {
      currentSection.templateOptions.onAdd();
      this.customerFormFacade.addRepeatSection(currentSection.key);
    }
  }

  handleDeleteMultipleItemTrigger(summaryItem: SummaryItem) {
    // add delete logic here
  }

  setHideExpressions(fields: FormlyFieldConfig[]) {
    if (fields && fields.length > 0) {
      fields.forEach((field) => {
        field.hideExpression = this.formViewService.hideExpression;
        if (field.fieldArray) {
          this.setHideExpressions(field.fieldArray.fieldGroup);
        } else {
          this.setHideExpressions(field.fieldGroup);
        }
      });
    }
  }

  toggleMobileSummary() {
    this.mobileSummaryOpened = !this.mobileSummaryOpened;
  }

  updateFormStatus(formStatus: FormStatus) {
    this.customerFormFacade.updateFormStatus(formStatus);
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
