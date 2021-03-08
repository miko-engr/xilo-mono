import { Component, Inject } from '@angular/core';
import { FormComponents } from './block-dialog.types';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 } from 'uuid';

@Component({
  selector: 'xilo-mono-form-tree-block-dialog',
  templateUrl: './block-dialog.html',
  styleUrls: ['./block-dialog.scss'],
})
export class BlockDialogComponent {
  activeTab = 1;
  tabs = [];

  public get isIntakeForm() {
    return this.data?.formType === 'intake-form';
  }

  constructor(
    public dialogRef: MatDialogRef<BlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.isSection) {
      this.activeTab = 0;
    } else if (this.data.isQuestionGroup) {
      this.activeTab = 2;
    } else {
      this.activeTab = 1;
    }
    if (this.data?.formType === 'customer-form') {
      this.tabs = new FormComponents().getCustomerComponents;
    } else {
      this.tabs = new FormComponents().getIntakeComponents;
    }
  }

  onTabItemClicked(item, tab) {
    this.dialogRef.close({
      item,
      tab,
      questionGroupIndex: this.data.questionGroupIndex,
      questionIndex: this.data.questionIndex,
      sectionIndex: this.data.sectionIndex,
    });
  }

  createRepeatSection() {
    return {
      key: v4(),
      type: this.isIntakeForm ? 'intake-repeat' : 'customer-repeat',
      label: 'Repeat Section',
      fieldArray: {
        type: this.isIntakeForm ? 'intake-section' : 'customer-section',
        wrappers: this.isIntakeForm
          ? ['section-panel']
          : ['customer-section-panel'],
        fieldGroup: [
          this.isIntakeForm
            ? this.createBlankInput()
            : this.createBlankQuestionGroup(),
        ],
        templateOptions: {
          label: 'Repeat Section',
          hasRepeatButtons: true,
        },
      },
      templateOptions: {
        label: 'Repeat Section',
        subIndex: 0,
      },
    };
  }

  createBlankSection() {
    return {
      key: v4(),
      type: this.isIntakeForm ? 'intake-section' : 'customer-section',
      wrappers: this.isIntakeForm
        ? ['section-panel']
        : ['customer-section-panel'],
      fieldGroup: [
        this.isIntakeForm
          ? this.createBlankInput()
          : this.createBlankQuestionGroup(),
      ],
      templateOptions: {
        label: 'Section',
      },
    };
  }

  createBlankQuestionGroup() {
    return {
      type: 'question-group',
      wrappers: ['question-panel'],
      key: v4(),
      templateOptions: {
        label: 'Please add your question here',
      },
      fieldGroup: [this.createBlankInput()],
    };
  }

  createBlankInput() {
    return {
      key: v4(),
      type: 'input',
      templateOptions: {
        label: 'Text Field',
        className: this.isIntakeForm ? 'intake-input' : 'xilo-input',
        placeholder: 'Text Field',
      },
    };
  }
}
