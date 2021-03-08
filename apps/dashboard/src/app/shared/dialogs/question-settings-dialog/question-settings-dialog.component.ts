import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DialogImagePicker } from '../image-picker-dialog/image-picker-dialog.component';
import { Question } from '../../../models/question.model';
import { Company } from '../../../models/company.model';

@Component({
    selector: 'app-question-settings-dialog',
    templateUrl: './question-settings-dialog.component.html',
    styleUrls: ['./question-settings-dialog.component.css'],
  })
  export class QuestionSettingsDialogComponent implements OnInit {
    question: Question;
    company: Company;

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<QuestionSettingsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.question = this.data.question;
      this.company = this.data.company;
    }

    saveSettings() {
      if (confirm('Are you sure you want to save these changes?')) {
        this.dialogRef.close(this.question);
      }
    }

    openImagePickerDialog() {
      const dialogRef = this.dialog.open(DialogImagePicker, {
          width: '60rem',
          data: {
              brandColor: this.data.company.brandColor,
              type: 'question',
              obj: this.question
          }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.question.image = result;
          } else if (result === false) {
              this.question.image = null;
          }
      });
    }

  }
