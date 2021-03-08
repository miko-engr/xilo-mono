import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {uniqBy} from 'lodash';

@Component({
    selector: 'app-template-picker-dialog',
    templateUrl: './template-picker-dialog.component.html',
    styleUrls: ['./template-picker-dialog.component.css'],
  })
  export class DialogTemplatePicker {
    templates = [];
    csvUpload = false;
    csv = null;

    constructor(
        public dialogRef: MatDialogRef<DialogTemplatePicker>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.createTemplateArray();
    }

    createTemplateArray() {
      this.templates = this.data.templates;
      this.templates = uniqBy(this.templates, 'title');
    }

    openLink(data: any) {
      this.dialogRef.close(data);
    }

    uploadCsv() {
      if (this.csv) {
        this.openLink({isCsv: true, csv: this.csv});
      }
    }

    storeTemplate(i: number) {
      if (confirm('Are you sure you want to use this template?')) {
        let template = this.templates[i];
        this.openLink(template);
      }
    }

  }