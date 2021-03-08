import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../../../../services/log.service';
import { PageService } from '../../../../services/page.service';
import { QuestionService } from '../../../../services/question.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Form } from '../../../../models/form.model';
import { Answer } from '../../../../models/answer.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Question } from '../../../../models/question.model';
import { AnswerPickerDialog } from '../../../../shared/dialogs/answer-picker-dialog/answer-picker-dialog.component';
import { DialogImagePicker } from '../../../../shared/dialogs/image-picker-dialog/image-picker-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../models/company.model';
import { AnswerSettingsDialogComponent } from '../../../../shared/dialogs/answer-settings-dialog/answer-settings-dialog.component';
import { QuestionSettingsDialogComponent } from '../../../../shared/dialogs/question-settings-dialog/question-settings-dialog.component';
import { AnswerService } from '../../../../services/answer.service';
import { Condition } from '../../../../models/condition.model';
import { ConditionService } from '../../../../services/condition.service';
import { ConditionsDialogComponent } from '../../../../shared/dialogs/conditions-dialog/conditions-dialog.component';
import { IntegrationValidatorService } from '../../../../services/integration-validator.service';
import { Page } from '../../../../models/page.model';


@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  loading = false;
  company: Company;
  form: Form;
  isEditFormTitle = false;
  isEditPageTitle = false;
  panelOpenState = false;
  formRetrieved = false;
  pageIndex = 0;
  questionIndex = 0;
  selectedQuestion = {};
  contextMenuPosition = { x: '0px', y: '0px' };
  contextMenu: MatMenuTrigger = null;
  showContextMenu = false;
  hasCopiedObject = false;
  copiedObject: any;
  lastCondition: Condition;
  validationsActive = false;
  questionsNavOpen = true;
  settingsNavOpen = false;
  selectedAnswer = null;
  collapseLevel = 'section';
  selectedPageIndex = null;
  selectedQuestionId = null;
  selectedAnswerId = null;


  deletedPages = [];
  deletedAnswers = [];
  deletedQuestions = [];

  integrationsList = [];

  @ViewChild('accordion') accordion: MatAccordion;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

  constructor(
    private answerService: AnswerService,
    private conditionService: ConditionService,
    private companyService: CompanyService,
    private formService: FormService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private logService: LogService,
    private pageService: PageService,
    private router: Router,
    private questionService: QuestionService,
    private validatorService: IntegrationValidatorService
  ) { }

  ngOnInit(): void {
    this.getForm();
    this.getCompany();
  }

  filterIntegrations() {
    if (this.selectedAnswer.integrations) {
      this.selectedAnswer.integrations.filter(int => {
        return int.formIntegrationId === this.form.id && int;
      });
    }
  }

  validateAnswer(answer: Answer, type: string) {
    this.validatorService.validateAnswer(answer.id, type, 'EZLYNX')
    .subscribe(data => {
      this.logService.success('EZ Validated');
    }, error => {
      this.logService.console(error, false);
    });
  }

  displayFn(obj?: any): string | undefined {
    return obj ? obj.label : undefined;
  }

  validationIsFalse(type: string, question: Question, answer?: Answer, page?: Page) {
    if (type === 'page') {
      return page.questions.some(q => q.answers.some(ans =>
                                (ans.validations && ans.validations.some(val =>
                                  (val.vendor === 'EZLYNX' && !val.isValid)))));
    } else if (type === 'question' && question.answers && question.answers.some) {
      return question.answers.some(ans => (ans.validations && ans.validations.some(val => (val.vendor === 'EZLYNX' && !val.isValid))));
    } else if (answer && answer.validations && answer.validations.some) {
      return answer.validations.some(val => (val.vendor === 'EZLYNX' && !val.isValid));
    }
  }

  validationMessage(answer: Answer) {
    if (answer && answer.validations && answer.validations.some(val => val.vendor === 'EZLYNX') &&
        answer.validations.filter(val => val.vendor === 'EZLYNX')[0] &&
        answer.validations.filter(val => val.vendor === 'EZLYNX')[0].messages) {
      return answer.validations.filter(val => val.vendor === 'EZLYNX')[0].messages.join('.....');
    } else {
      return 'Not Valid';
    }
  }

  hasIntegration(vendor: string) {
    return ((this.form && this.form.integrations) && (this.form.integrations.length > 0
                && this.form.integrations.includes(vendor)));
  }

  async cleanObject(type: string, obj: any) {
    const newObj = this.createCopy(obj);
    if (type === 'Pages') {
      delete newObj.id;
      newObj.companyPageId = this.form.companyFormId;
      if (newObj.questions) {
        newObj.questions = newObj.questions.map(q => {
          delete q.id;
          q.companyQuestionId = this.form.companyFormId;
          if (q.answers) {
            q.answers = q.answers.map(a => {
              delete a.id;
              a.companyAnswerId = this.form.companyFormId;
              if (a.answerConditions) {
                a.answerConditions = a.answerConditions.map(cond => {
                  delete cond.id;
                  delete cond.answerConditionId;
                  cond.companyConditionId = this.form.companyFormId;
                  return cond;
                });
              }
              if (a.integrations) {
                a.integrations = a.integrations.map(int => {
                  delete int.id;
                  delete int.answerIntegrationId;
                  int.formIntegrationId = this.form.companyFormId;
                  return int;
                });
              }
              return a;
            });
          }
          if (q.questionConditions) {
            q.questionConditions = q.questionConditions.map(cond => {
              delete cond.id;
              delete cond.questionConditionId;
              cond.companyConditionId = this.form.companyFormId;
              return cond;
            });
          }
          return q;
        });
      }
      if (newObj.conditions) {
        newObj.conditions = newObj.conditions.map(cond => {
          delete cond.id;
          delete cond.pageConditionId;
          cond.companyConditionId = this.form.companyFormId;
          return cond;
        });
      }
    } else if (type === 'Questions') {
        delete newObj.id;
        newObj.companyQuestionId = this.form.companyFormId;
        newObj.answers = newObj.answers.map(a => {
          delete a.id;
          a.companyAnswerId = this.form.companyFormId;
          if (a.answerConditions) {
            a.answerConditions = a.answerConditions.map(cond => {
              delete cond.id;
              delete cond.answerConditionId;
              cond.companyConditionId = this.form.companyFormId;
              return cond;
            });
            a.integrations = a.integrations.map(int => {
              delete int.id;
              delete int.answerIntegrationId;
              int.formIntegrationId = this.form.companyFormId;
              return int;
            });
          }
          return a;
        });
        if (newObj.questionConditions) {
          newObj.questionConditions = newObj.questionConditions.map(cond => {
            delete cond.id;
            delete cond.questionConditionId;
            cond.companyConditionId = this.form.companyFormId;
            return cond;
          });
        }
    } else if (type === 'Answers') {
      delete newObj.id;
      newObj.companyAnswerId = this.form.companyFormId;
      if (newObj.answerConditions) {
        newObj.answerConditions = newObj.answerConditions.map(cond => {
          delete cond.id;
          delete cond.answerConditionId;
          cond.companyConditionId = this.form.companyFormId;
          return cond;
        });
      }
      if (newObj.integrations) {
        newObj.integrations = newObj.integrations.map(int => {
          delete int.id;
          delete int.answerIntegrationId;
          int.formIntegrationId = this.form.companyFormId;
          return int;
        });
      }
    }
    return newObj;
  }

  createCopy(orig) {
    return JSON.parse(JSON.stringify(orig));
  }

  async copyObject(eventObj: any) {
    const type = eventObj.type;
    const obj = eventObj.obj;
    const newObj = await this.cleanObject(type, obj);
    this.copiedObject = {};
    this.copiedObject['type'] = type;
    this.copiedObject['obj'] = newObj;
    this.hasCopiedObject = true;
    this.showContextMenu = false;
    localStorage.setItem('copiedObject', JSON.stringify(this.copiedObject));
    this.logService.success('Copied');
  }


  deleteObject(type: string, pageIndex: any, questionIndex: any, answerIndex: any, id: any) {
    if (type === 'page') {
      this.deletedPages.push(id);
      this.form.pages.splice(+pageIndex, 1);
    } else if (type === 'question') {
      this.deletedQuestions.push(id);
      this.form.pages[pageIndex].questions.splice(+questionIndex, 1);
    } else if (type === 'answer') {
      this.deletedAnswers.push(id);
      this.form.pages[pageIndex].questions[questionIndex].answers.splice(+answerIndex, 1);
    }
  }

  removeCopiedObject() {
    this.hasCopiedObject = false;
    this.showContextMenu = false;
    this.copiedObject = null;
    localStorage.removeItem('copiedObject');
    this.logService.success('Cleared');
  }

  async pasteObject(eventObj: any) {
    if (this.copiedObject['type'] && eventObj['type']) {
      const pageIndex = eventObj.pageIndex;
      const questionIndex = eventObj.questionIndex;
      const type = this.copiedObject['type'];
      const obj = this.copiedObject['obj'];
      await this.addObject(type, pageIndex, questionIndex, true, obj);
      this.hasCopiedObject = false;
      this.showContextMenu = false;
      this.copiedObject = null;
      localStorage.removeItem('copiedObject');
      this.logService.success('Pasted');
    }
  }

  async addObject(type: string, pageIndex: any, questionIndex: any, isDuplicate?: boolean, obj?: any) {
    const newType = type === 'page' ? 'Pages' :
                          type === 'question' ? 'Questions' :
                          type === 'answer' ? 'Answers' : null;
    let newObj = {};
    if (isDuplicate) {
      newObj = await this.cleanObject(newType, obj);
    }
    if (type === 'page') {
      if (!isDuplicate) {
        newObj = { title: '', questions: [], companyPageId: this.form.companyFormId, formPageId: this.form.id };
      }
      this.form.pages.push(newObj);
    } else if (type === 'question') {
      if (!this.form.pages[pageIndex].id) {
        this.logService.warn('You must save the new page before adding a question');
      } else {
        newObj = isDuplicate ? newObj : {
          headerText: '',
          companyQuestionId: this.form.companyFormId,
          formQuestionId: this.form.id,
          pageQuestionId: +this.form.pages[pageIndex].id,
          answers: []
        };
        this.form.pages[pageIndex].questions.push(newObj);
      }
    } else if (type === 'answer') {
      if (!this.form.pages[pageIndex].questions[questionIndex].id) {
        this.logService.warn('You must save the new question before adding an answer');
      } else {
        newObj = isDuplicate ? newObj : {
          placeholderText: '',
          displayValue: '',
          companyAnswerId: this.form.companyFormId,
          formAnswerId: this.form.id,
          pageAnswerId: +this.form.pages[pageIndex].id,
          questionAnswerId: +this.form.pages[pageIndex].questions[questionIndex].id
        };
        this.form.pages[pageIndex].questions[questionIndex].answers.push(newObj);
      }
    }
  }

  getCompany() {
    this.companyService.get()
    .subscribe(data => {
      this.company = data['obj'];
    }, error => {
      this.logService.console(error, false);
    })
  }


  getForm() {
    this.loading = true;
    const formId = this.route.snapshot.params.id;
    this.formService.getById(formId).subscribe(res => {
      this.form = res;
      this.getIntegrationsList();
      const newPages = res.pages.map(page => ({...page, isPanelOpen: false}));
      this.form.pages = newPages;
      this.selectedPageIndex = 0;
      this.selectedQuestion = this.form.pages[0].questions[0];
      this.selectedQuestionId = this.selectedQuestion['id'];
      this.selectedAnswer = this.form.pages[0].questions[0].answers[0];
      this.selectedAnswerId = this.selectedAnswer.id;
      this.formRetrieved = true;
      this.loading = false;
      this.contextMenu = this.triggers.last;
    }, error => {
      this.loading = false;
      this.logService.console(error, true);
    });
  }

  elementIsActive(type: string, id: string) {
    if (this[`selected${type}Id`] === id) {
      return true;
    } else if (this.collapseLevel === 'question') {
      return false;
    } else if (this.collapseLevel === 'answer') {
      if (type === 'Question') {
        return true;
      } else if (type === 'Answer') {
        return false;
      }
    }
    return false;
  }

  openEditPagePanel(index) {
    this.selectedPageIndex = index;
  }

  toggleQuestionPanel(id: number, pageIndex: any) {
    this.selectedQuestionId = id;
    this.selectedPageIndex = pageIndex;
  }

  toggleAnswerPanel(id: number, pageIndex: any, questionIndex: any) {
    this.selectedAnswerId = id;
    this.selectedPageIndex = pageIndex;
    this.selectedQuestionId = `${pageIndex}-${questionIndex}`;
  }

  toggleEditQuestionText(type: string) {
    this.form.pages[this.pageIndex].questions[this.questionIndex][type] =
      !this.form.pages[this.pageIndex].questions[this.questionIndex][type];
  }

  /*This is used for update page title */
  editPageTitle(pageIndex) {
    this.form.pages[pageIndex].isEditPageTitle = false;
    this.pageService.patch(this.form.pages[pageIndex]).subscribe(async (updatedPage: any) => {
      await this.getForm();
    }, error => {
      this.logService.console(error, false);
    });
  }

  /*This is used for update form title */
  editFormTitle() {
    this.isEditFormTitle = !this.isEditFormTitle;
    this.formService.patch(this.form).subscribe(async (updatedForm: any) => {
      await this.getForm();
    }, error => {
      this.logService.console(error, false);
    });
  }

  dropPage(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  dropQuestion(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
        transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        event.container.data.forEach((item, i) => {
        });
    } else if (event.previousIndex !== event.currentIndex) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
    }
  }

  toggleCollapseFormView() {
    if (this.collapseLevel === 'section') {
      this.collapseLevel = 'question';
    } else if (this.collapseLevel === 'question') {
      this.collapseLevel = 'answer';
    } else if (this.collapseLevel === 'answer') {
      this.collapseLevel = 'section';
    }
  }

  /*This is used for delete question */
  deleteQuestion(question) {
    this.questionService.delete(question).subscribe(async (deletedQuestion: any) => {
      await this.getForm();
    }, error => {
      this.logService.console(error, false);
    });
  }

  changeQuestionPreview(pageIndex, index) {
    this.pageIndex = pageIndex;
    this.questionIndex = index;
    this.selectedQuestion = this.form.pages[this.pageIndex].questions[this.questionIndex];
  }

  next(pageIndex, questionIndex) {
    this.form.pages[pageIndex].questions[questionIndex].panelIsOpen = false;
    const qLength = this.form.pages[pageIndex].questions.length;
    const pLength = this.form.pages.length;
    if ((questionIndex === qLength - 1) && ((pageIndex + 1) !== (pLength))) {
      this.pageIndex = pageIndex + 1;
      this.questionIndex = 0;
    } else if ((questionIndex === qLength - 1) && (pageIndex + 1) === (pLength)) {
      return this.logService.warn('You are at the last page');
    } else {
      this.questionIndex = questionIndex + 1;
    }
    this.form.pages[this.pageIndex].questions[this.questionIndex].panelIsOpen = true;
    this.selectedQuestion = this.form.pages[this.pageIndex].questions[this.questionIndex];
  }

  previous(pageIndex, questionIndex) {
    this.form.pages[pageIndex].questions[questionIndex].panelIsOpen = false;
    const pLength = this.form.pages.length;
    if (questionIndex === 0 && pLength > 0) {
      this.pageIndex = pageIndex - 1;
      const previousQuestionLength = this.form.pages[this.pageIndex].questions.length;
      this.questionIndex = (previousQuestionLength !== 0 ? (previousQuestionLength - 1) : 0);
    } else if (questionIndex === 0 && pLength === 0) {
      return this.logService.warn('You are at the first page');
    } else {
      this.questionIndex = questionIndex - 1;
    }
    this.form.pages[this.pageIndex].questions[this.questionIndex].panelIsOpen = true;
    this.selectedQuestion = this.form.pages[this.pageIndex].questions[this.questionIndex];
  }

  returnId(answer: Answer, prefix?: string) {
    if (answer && answer.objectName && answer.propertyKey) {
      return `${prefix ? prefix : ''}${answer.objectName}-${answer.propertyKey}`;
    }
  }

  returnToForms() {
    this.router.navigate(['/profile/forms/list']);
  }

  reset(form) {
    form.reset();
    form.submitted = false;
  }

  onContextMenu(event: MouseEvent, obj) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'obj': obj };
    this.contextMenu.menu.focusFirstItem('mouse');
    if (localStorage.getItem('copiedObject')) {
      this.copiedObject = JSON.parse(localStorage.getItem('copiedObject'));
      this.hasCopiedObject = true;
    }
    this.contextMenu.openMenu();
  }

  onClickedOutside(type: string, pageIndex: any, questionIndex: any) {
    if (type === 'page') {
      if (this.form.pages[pageIndex].panelIsOpen) {
        this.form.pages[pageIndex].panelIsOpen = false;
      }
    } else if (type === 'question') {
      if (this.form.pages[pageIndex].questions[questionIndex].panelIsOpen) {
        this.form.pages[pageIndex].questions[questionIndex].panelIsOpen = false;
      }
    }
  }

  returnArray(array) {
    return (array && array.length && array.length > 0) ? array : null;
  }

  async updateForm() {
    if (confirm('Are you sure you want to make these updates?')) {
      try {
        this.loading = true;
        const deletedPages = this.returnArray(this.deletedPages);
        const deletedQuestions = this.returnArray(this.deletedQuestions);
        const deletedAnswers = this.returnArray(this.deletedAnswers);
        for (let i = 0; i < this.form.pages.length; i++) {
          const page = this.form.pages[i];
          page.position = i;
          if (i === 0) {
            page.isStartPage = true;
          } else {
            page.isStartPage = false;
          }
          page.companyPageId = this.form.companyFormId;
          page.formPageId = this.form.id;
          if (!page.title) {
            page.title = 'New Page';
          }
          page.routePath = page.title ? page.title.toLowerCase().replace(' ', '-') : null;
          for (let j = 0; j < page.questions.length; j++) {
            const question = page.questions[j];
            question.position = j;
            question.companyQuestionId = this.form.companyFormId;
            question.pageQuestionId = +page.id;
            question.formQuestionId = this.form.id;
            for (let k = 0; k < question.answers.length; k++) {
              const answer = question.answers[k];
              answer.position = k;
              answer.companyAnswerId = this.form.companyFormId;
              answer.pageAnswerId = +page.id;
              answer.questionAnswerId = +question.id;
              answer.formAnswerId = this.form.id;
            }
          }
        }
        const data = {
          form: this.form,
          deletedPages: deletedPages,
          deletedQuestions: deletedQuestions,
          deletedAnswers: deletedAnswers
        };
        const results = await this.formService.bulkUpdate(data);
        this.logService.success('Form updated successfully');
        this.getForm();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.logService.console(error, true);
      }
    }
  }

  openAnswerSettings(answer: Answer) {
    this.selectedAnswer = answer;
    this.filterIntegrations();
    this.settingsNavOpen = true;
  }

  async openQuestionSettingsDialog(question: Question) {
    const dialogRef = this.dialog.open(QuestionSettingsDialogComponent, {
        width: '60rem',
        panelClass: 'dialog',
        data: {question: question, company: this.company}
    });

    dialogRef.afterClosed().subscribe(async(result) => {
        if (result && result.id) {
            await this.questionService.patchAsync(result);
            this.logService.success('Question updated successfully');
        }
    });
  }

  getIntegrationsList() {
    this.integrationsList = this.form.integrations ? [...this.form.integrations] : [];
    if (this.company.hasHawksoftIntegration) {
      this.integrationsList.push('HAWKSOFT');
    }
  }

  async openConditionsDialog(type: string, obj: any) {
    const conditionKey = type === 'page' ? 'conditions' : type === 'question' ? 'questionConditions' : 'answerConditions';
    const dialogRef = this.dialog.open(ConditionsDialogComponent, {
      width: '60rem',
      panelClass: 'dialog',
      data: { conditions: obj[conditionKey],
              companyId: this.form.companyFormId,
              lastCondition: this.lastCondition ? this.lastCondition : null
            }
    });
    dialogRef.afterClosed().subscribe(async(results) => {
      if (results && results.length && results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            const condition = results[i];
            condition.companyConditionId = this.form.companyFormId;
            condition[`${type}ConditionId`] = obj.id;
            this.lastCondition = this.createCopy(condition);
            delete this.lastCondition.id;
            delete this.lastCondition[`${type}ConditionId`];
        }
        const updatedConditions = await this.conditionService.upsert(results);
        obj[conditionKey] = await updatedConditions;
        this.logService.success('Conditions updated successfully');
      }
    });
  }


  async openTemlatesPickerDialog(type: string, pageIndex: any, questionIndex: any) {
    const dialogRef = this.dialog.open(AnswerPickerDialog, {
      width: '60rem',
      data: { type: type }
    });
    dialogRef.afterClosed().subscribe(async(result) => {
      if (result) {
          delete result.id;
          const newType = type === 'Pages' ? 'page' :
                          type === 'Questions' ? 'question' :
                          type === 'Answers' ? 'answer' : null;
          const newObj = await this.cleanObject(type, result);
          await this.addObject(newType, pageIndex, questionIndex, true, newObj);
      }
    });
  }


  openImagePickerDialog(question: Question, answer: Answer, type: string,
                      pageIndex: any, questionIndex: any, answerIndex: any) {
    const dialogRef = this.dialog.open(DialogImagePicker, {
        width: '60rem',
        data: {
            brandColor: this.company.brandColor,
            type: type,
            obj: type === 'question' ? question : answer
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result && result.imageUrl) {
            this.form.pages[pageIndex].questions[questionIndex].imageUrl = result.imageUrl;
            this.form.pages[pageIndex].questions[questionIndex].imageIsSVG = false;
          } else if (type === 'question') {
            this.form.pages[pageIndex].questions[questionIndex].image = result;
            this.form.pages[pageIndex].questions[questionIndex].imageIsSVG = true;
          } else if (type === 'answer') {
            this.form.pages[pageIndex].questions[questionIndex].answers[answerIndex].icon = result;
          }
        } else if (result === false) {
          if (type === 'question') {
            this.form.pages[pageIndex].questions[questionIndex].image = null;
            this.form.pages[pageIndex].questions[questionIndex].imageUrl = null;
          } else if (type === 'answer') {
            this.form.pages[pageIndex].questions[questionIndex].answers[answerIndex].icon = null;
          }
        }
    });
  }

  navIsOpen(type: string) {
    if (type === 'questions' && !this.questionsNavOpen) {
      return 'inactive-questions-bar';
    } else if ((type === 'questions-text') && !this.questionsNavOpen) {
      return 'inactive-text';
    } else if ((type === 'settings-text') && !this.settingsNavOpen) {
      return 'inactive-text';
    } else if (type === 'settings' && !this.settingsNavOpen) {
      return 'inactive-settings-bar';
    }
  }

  styleImage(question: Question) {
    return {'background': `url('${question.imageUrl}')`,'background-position': 'center', 'background-size': 'cover'}
  }

  imageType(question: Question) {
    if (question.imageIsSVG && question.image) {
      return 'svg';
    } else if (!question.imageIsSVG && question.imageUrl) {
      return 'image';
    } else {
      return 'new';
    }
  }

}
