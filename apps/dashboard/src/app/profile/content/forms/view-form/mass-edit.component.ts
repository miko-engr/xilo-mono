import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Input } from '@angular/core';
import { Form } from '../../../../models/form.model';
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { LogService } from '../../../../services/log.service';
import { FormService } from '../../../../services/form.service';
import { Answer } from '../../../../models/answer.model';
import { AnswerService } from '../../../../services/answer.service';
import { ConditionService } from '../../../../services/condition.service';
import { Condition } from '../../../../models/condition.model';
import { Question } from '../../../../models/question.model';
import { QuestionService } from '../../../../services/question.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Page } from '../../../../models/page.model';
import { Company } from '../../../../models/company.model';
import { MatDialog } from '@angular/material/dialog';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { AnswerSettingsDialogComponent } from '../../../../shared/dialogs/answer-settings-dialog/answer-settings-dialog.component';
import { QuestionSettingsDialogComponent } from '../../../../shared/dialogs/question-settings-dialog/question-settings-dialog.component';
import { ConditionsDialogComponent } from '../../../../shared/dialogs/conditions-dialog/conditions-dialog.component';
import { AnswerPickerDialog } from '../../../../shared/dialogs/answer-picker-dialog/answer-picker-dialog.component';
import { DialogImagePicker } from '../../../../shared/dialogs/image-picker-dialog/image-picker-dialog.component';

@Component({
    selector: 'app-mass-edit',
    templateUrl: './mass-edit.component.html',
    styleUrls: ['./mass-edit.component.css'],
  })
  export class MassEditComponent implements OnInit {
    company: Company;
    form: Form;
    copiedObject: any;

    params: Params = Object.assign({}, this.route.snapshot.params);

    selectedPage = [];
    selectedQuestion = [];
    selectedAnswer = [];
    loading = false;
    lastCondition: Condition;
    showContextMenu = false;
    hasCopiedObject = false;
    formUrl = null;
    pageUrl = null;
    previewOpen = true;
    pWidth = '30';
    eWidth = '65';
    contextMenu: MatMenuTrigger = null;
    formRetrieved = false;
    companyRetrieved = false;
    error = false;

    @ViewChild('iframe') iframe: ElementRef;

    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    contextMenuPosition = { x: '0px', y: '0px' };

    constructor(
      private route: ActivatedRoute,
      private answerService: AnswerService,
      private companyService: CompanyService,
      private conditionService: ConditionService,
      public dialog: MatDialog,
      private formService: FormService,
      private logService: LogService,
      private questionService: QuestionService,
      private router: Router
    ) {}

    ngOnInit() {
      this.getForm();
      this.loading = true;
    }

    getCompany() {
      this.companyService.get()
      .subscribe(data => {
        this.company = data['obj'];
        this.companyRetrieved = true;
        this.formUrl = this.returnFormUrl({routePath: 'start'});
        this.iframe.nativeElement.setAttribute('src', this.formUrl);
        this.contextMenu = this.triggers.last;
        this.loading = false;
      }, error => {
        this.logService.console(error, true);
      });
    }

    getForm() {
      if (!this.params.id) {
        this.logService.warn('You must select a form to edit');
        return this.router.navigate(['/profile/forms']);
      }
      this.formService.getById(this.params.id)
      .subscribe(rForm => {
        this.form = rForm;
        this.getCompany();
        this.formRetrieved = true;
      }, error => {
        this.logService.console(error, true);
        this.loading = false;
        this.error = true;
      });
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

    test(stuff) {
      stuff.stopImmediatePropagation();
    }


    moveObject(type: string, increase: number, pageIndex: any, questionIndex: any, answerIndex: any) {
      const pageMax = this.form.pages.length - 1;
      if ((+pageMax === +pageIndex && increase === 1) ||
           +pageIndex === 0 && increase === -1) {
             this.logService.warn('You cannot move this any further');
           } else {
             if (type === 'page') {
               const newIndex = +pageIndex + increase;
               moveItemInArray(this.form.pages, pageIndex, newIndex);
             } else if (type === 'question') {
               const questionMax = this.form.pages[pageIndex].questions.length - 1;
               if ((+questionMax === +questionIndex && increase === 1) ||
               (+questionIndex === 0 && increase === -1)) {
                 const oldQuestions = this.form.pages[+pageIndex].questions;
                 const newQuestions = this.form.pages[+pageIndex + increase].questions;
                 const newIndex = increase === 1 ? 0 : newQuestions.length;
                    transferArrayItem(oldQuestions,
                      newQuestions,
                      questionIndex,
                      newIndex);
                  } else {
                    const newIndex = +questionIndex + increase;
                    moveItemInArray(this.form.pages[pageIndex].questions, questionIndex, newIndex);
                  }
             } else if (type === 'answer') {
              const questionMax = this.form.pages[pageIndex].questions.length - 1;
              const answerMax = this.form.pages[pageIndex].questions[questionIndex].answers.length - 1;
              if ((+answerMax === +answerIndex && increase === 1) ||
              (+answerIndex === 0 && increase === -1)) {
                  if ((+questionMax === +questionIndex && increase === 1) ||
                  (+questionIndex === 0 && increase === -1)) {
                    const newQuestions = this.form.pages[+pageIndex + increase].questions;
                    const newQuestionIndex = increase === 1 ? 0 : newQuestions.length - 1;
                    const oldAnswers = this.form.pages[+pageIndex].questions[+questionIndex].answers;
                    const newAnswers = this.form.pages[+pageIndex + increase].questions[newQuestionIndex].answers;
                    const newAnswerIndex = increase === 1 ? 0 : newAnswers.length;
                      transferArrayItem(oldAnswers,
                        newAnswers,
                        answerIndex,
                        newAnswerIndex);
                  } else {
                    const oldAnswers = this.form.pages[+pageIndex].questions[questionIndex].answers;
                    const newAnswers = this.form.pages[+pageIndex].questions[+questionIndex + increase].answers;
                    const newIndex = increase === 1 ? 0 : newAnswers.length;
                      transferArrayItem(oldAnswers,
                        newAnswers,
                        answerIndex,
                        newIndex);
                    }
                 } else {
                   const newIndex = +answerIndex + increase;
                   moveItemInArray(this.form.pages[pageIndex].questions[questionIndex].answers, answerIndex, newIndex);
                }
              }
           }
    }

    deleteObject(type: string, pageIndex: any, questionIndex: any, answerIndex: any, id: any) {
      if (type === 'page') {
        this.selectedPage.push(id);
        this.form.pages.splice(+pageIndex, 1);
      } else if (type === 'question') {
        this.selectedQuestion.push(id);
        this.form.pages[pageIndex].questions.splice(+questionIndex, 1);
      } else if (type === 'answer') {
        this.selectedAnswer.push(id);
        this.form.pages[pageIndex].questions[questionIndex].answers.splice(+answerIndex, 1);
      }
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
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

    openLink() {
      this.router.navigate(['/profile/forms']);
    }

    routeView() {
      this.router.navigate([`/profile/forms/view/${this.params.id}`]);
    }

    resetForm() {
      this.loading = true;
      this.formService.getById(this.form.id)
      .subscribe(rForm => {
        this.form = rForm;
        this.loading = false;
      }, error => {
        this.logService.console(error, true);
        this.loading = false;
      });
    }

    returnArray(array) {
      return (array && array.length && array.length > 0) ? array : null;
    }

    returnAnswerType(answer: Answer) {
      if (answer.isInput) {
        return 'short text field';
      } else if (answer.isDatePicker) {
        return 'date picker';
      } else if (answer.isSelect) {
        return 'select menu';
      } else if (answer.isTextarea) {
        return 'paragraph field';
      } else if (answer.isButton) {
        return 'answer button';
      } else if (answer.isCard) {
        return 'answer card';
      } else if (answer.isSecureDocumentUpload) {
        return 'document upload button';
      } else if ((answer.isAddLocation || answer.isAddDriver || answer.isAddHome || answer.isAddVehicle)) {
        return 'add multiple button';
      } else if (answer.isSpacer) {
        return 'spacer';
      } else if (answer.isText) {
        return 'plain text';
      } else if (answer.isCheckbox) {
        return 'checkbox';
      } else {
        return 'field';
      }
    }

    async updateForm() {
      if (confirm('Are you sure you want to make these updates?')) {
        try {
          this.loading = true;
          const deletedPages = this.returnArray(this.selectedPage);
          const deletedQuestions = this.returnArray(this.selectedQuestion);
          const deletedAnswers = this.returnArray(this.selectedAnswer);
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
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.logService.console(error, true);
        }
      }
    }

  returnFormUrl(page: Page) {
      this.pageUrl = page.routePath;
      let url = '';
      const env = (<any>window.location.href);
      if (env && env.includes('dashboard.xilo.io')) {
        url += 'https://app.xilo.io/';
      } else if (env && env.includes('develop')) {
        url += 'https://xilo-dev-forms.herokuapp.com/';
      } else if (env && env.includes('staging')) {
        url += 'https://xilo-staging-forms.herokuapp.com/';
      } else if (env && env.includes('localhost')) {
        url += 'http://localhost:4200/';
      }
      url += 'client-app/';
      if (this.form.isSimpleForm) {
        url += `simple/page/${this.returnPageUrl(page)}?companyId=${this.company.companyId}`;
      } else {
        url += `form/page/${this.returnPageUrl(page)}?companyId=${this.company.companyId}`;
      }
      url += `&formId=${this.form.id}`;
      return url;
  }

  returnPageUrl(page: Page) {
    if (page.routePath) {
      return page.routePath;
    } else {
      return 'start';
    }
  }

  routePreview(page: Page) {
    if (page.routePath) {
      this.formUrl = this.returnFormUrl(page);
      this.iframe.nativeElement.setAttribute('src', this.formUrl);
      this.previewOpen = true;
    } else {
      this.logService.warn('You must save this page first before you can preview it');
    }
  }

  closePreview() {
    this.previewOpen = false;
    this.pWidth = '0';
    this.eWidth = '100';
  }

  openPreview() {
    this.previewOpen = true;
    this.pWidth = '30';
    this.eWidth = '65';
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
    }
    return newObj;
  }

  async openAnswerSettingsDialog(answer: Answer, question: Question) {
    const dialogRef = this.dialog.open(AnswerSettingsDialogComponent, {
        width: '60rem',
        panelClass: 'dialog',
        data: {answer: answer, question: Question}
    });

    dialogRef.afterClosed().subscribe(async(result) => {
        if (result && result.id) {
            await this.answerService.patchAsync(result);
            this.logService.success('Answer updated successfully');
        }
    });
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
          if (type === 'question') {
            this.form.pages[pageIndex].questions[questionIndex].image = result;
          } else if (type === 'answer') {
            this.form.pages[pageIndex].questions[questionIndex].answers[answerIndex].icon = result;
          }
        } else if (result === false) {
          if (type === 'question') {
            this.form.pages[pageIndex].questions[questionIndex].image = null;
          } else if (type === 'answer') {
            this.form.pages[pageIndex].questions[questionIndex].answers[answerIndex].icon = null;
          }
        }
    });
  }

  }
