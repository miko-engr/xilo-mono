import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Input } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { Form } from '../../../../models/form.model';
import { LogService } from '../../../../services/log.service';
import { FormService } from '../../../../services/form.service';
import { Answer } from '../../../../models/answer.model';
import { AnswerService } from '../../../../services/answer.service';
import { Condition } from '../../../../models/condition.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { Company } from '../../../../models/company.model';
import { MatDialog } from '@angular/material/dialog';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { AnswerSettingsDialogComponent } from '../../../../shared/dialogs/answer-settings-dialog/answer-settings-dialog.component';

@Component({
    selector: 'app-view-form',
    templateUrl: './view-form.component.html',
    styleUrls: ['./view-form.component.css'],
  })
  export class ViewFormComponent implements OnInit {
    company: Company;
    form: Form;
    copiedObject: any;

    params: Params = Object.assign({}, this.route.snapshot.params);

    answers: Answer[] = [];
    selectedPage = [];
    selectedQuestion = [];
    selectedAnswer = [];
    updatedAnswers = [];
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
    answersRetrieved = false;
    formRetrieved = false;
    companyRetrieved = false;
    error = false;

    @ViewChild('iframe') iframe: ElementRef;

    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    contextMenuPosition = { x: '0px', y: '0px' };
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
      private route: ActivatedRoute,
      private answerService: AnswerService,
      private companyService: CompanyService,
      public dialog: MatDialog,
      private formService: FormService,
      private logService: LogService,
      private router: Router
    ) {}

    ngOnInit() {
      this.getAnswers();
      this.loading = true;
    }

    add(event: MatChipInputEvent, answer: Answer): void {
      const input = event.input;
      const value = event.value;

      // Add our option
      if ((value || '').trim()) {
        answer.options.push(value.trim());
        if (this.updatedAnswers.some(ans => ans.id === answer.id)) {
          const index = this.updatedAnswers.findIndex(ans => answer.id === ans.id);
          this.updatedAnswers[index].options = answer.options;
        } else {
          this.updatedAnswers.push({id: answer.id, options: answer.options});
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }

    remove(option: string, answer: Answer): void {
      const index = answer.options.indexOf(option);

      if (index >= 0) {
        answer.options.splice(index, 1);
        if (this.updatedAnswers.some(ans => ans.id === answer.id)) {
          const ansIndex = this.updatedAnswers.findIndex(ans => answer.id === ans.id);
          this.updatedAnswers[ansIndex].options = answer.options;
        } else {
          this.updatedAnswers.push({id: answer.id, options: answer.options});
        }
      }
    }

    getCompany() {
      this.companyService.get()
      .subscribe(data => {
        this.company = data['obj'];
        this.companyRetrieved = true;
        this.contextMenu = this.triggers.last;
        this.loading = false;
      }, error => {
        this.logService.console(error, true);
      });
    }

    getAnswers() {
      if (!this.params.id) {
        this.logService.warn('You must select a form to edit');
        return this.router.navigate(['/profile/forms']);
      }
      this.answerService.getAnswersByFormId(this.params.id)
      .subscribe(data => {
        this.answers = data['obj'];
        this.answersRetrieved = true;
        this.getCompany();
        this.loading = false;
      }, error => {
        this.logService.console(error, true);
        this.loading = false;
        this.error = true;
      });
    }

    deleteObject(index: any, id: any) {
      this.selectedAnswer.push(id);
      this.answers.splice(+index, 1);
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    openLink() {
      this.router.navigate([`/profile/forms/edit/${this.params.id}`]);
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

    hasUpdate() {
      return (this.updatedAnswers.length > 0 || this.selectedAnswer.length > 0);
    }


    updateForm() {
      if (this.updatedAnswers.length > 0) {
        this.loading = true;
        this.answerService.updateList(this.updatedAnswers)
        .subscribe(data => {
          this.loading = false;
          this.logService.success('Fields deleted');
          this.updatedAnswers = [];
        }, error => {
          this.logService.console(error, true);
          this.loading = false;
        });
      }
      if (this.selectedAnswer.length > 0) {
        this.loading = true;
        this.answerService.deleteList(this.selectedAnswer)
        .subscribe(data => {
          this.loading = false;
          this.logService.success('Field updated');
          this.selectedAnswer = [];
        }, error => {
          this.logService.console(error, true);
          this.loading = false;
        });
      }
    }

    async openAnswerSettingsDialog(answer: Answer) {
      const dialogRef = this.dialog.open(AnswerSettingsDialogComponent, {
          width: '60rem',
          panelClass: 'dialog',
          data: {answer: answer}
      });

      dialogRef.afterClosed().subscribe(async(result) => {
          if (result && result.id) {
              await this.answerService.patchAsync(result);
              this.logService.success('Answer updated successfully');
          }
      });
    }

  }
