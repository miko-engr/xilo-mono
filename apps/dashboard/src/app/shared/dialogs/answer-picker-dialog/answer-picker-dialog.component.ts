import { Component, Inject, OnInit } from '@angular/core';
import { AnswerService } from '../../../services/answer.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-answer-picker-dialog',
    templateUrl: './answer-picker-dialog.component.html',
    styleUrls: ['./answer-picker-dialog.component.css'],
  })
  export class AnswerPickerDialog implements OnInit {
    templates = [];
    searchString;
    selectedTemplate = null;
    templateType = null;
    selectedTemplateIndex = null;
    setCompanyId = false;
    companyId = '769677';

    constructor(
      private answerService: AnswerService,
        public dialogRef: MatDialogRef<AnswerPickerDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
    }

    async filterTemplate(string: any) {
      const type = this.data.type === 'Pages' ? 'Page' :
                      this.data.type === 'Questions' ? 'Question' :
                      this.data.type === 'Answers' ? 'Answer' : this.data.type;
      this.templates = await this.answerService.getAnswerTemplates(type, string, this.templateType, this.companyId);
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    openLink(data: any) {
      this.dialogRef.close(data);
    }

    async storeTemplate(template: any) {
      if (confirm('Are you sure you want to use this template?')) {
        this.openLink(template);
      }
    }

    needsType() {
      return (this.data.type === 'Answers');
    }

    templateName() {
      return this.data.type === 'Questions' ? 'headerText' :
                  this.data.type === 'Answers' ? 'placeholderText' : 'title';
    }

    returnAnswerType(answer: any) {
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
        return '';
      }
    }

    isAnswer(obj: any) {
      return this.returnAnswerType(obj) !== '';
    }

  }
