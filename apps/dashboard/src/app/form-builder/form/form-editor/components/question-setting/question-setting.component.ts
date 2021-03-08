import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { fieldGroups } from './question-fields';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DialogImagePicker } from '../../../../../shared/dialogs/image-picker-dialog/image-picker-dialog.component';

@Component({
  selector: 'app-form-builder-component-question-setting',
  templateUrl: './question-setting.html',
  styleUrls: ['./question-setting.scss'],
})
export class QuestionSettingComponent implements OnInit {
  fieldGroups = fieldGroups;
  selectedValue: any = {};
  @Input() selectedField: any;
  @Input() company: any;
  @Output() closeSettings = new EventEmitter();
  @Output() refreshPreview = new EventEmitter();
  newOption = {
    label: null,
    value: null,
  };
  selectedOption = {
    label: null,
    value: null,
  };
  isAddingOptions = false;
  showOptionValues = false;
  showOptions = false;
  editMultipleOptions = false;
  showMultipleOptionsEditor = false;
  multipleOptionsText = '';

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === 'Enter' && this.showOptions) {
      this.addOption();
    }
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  onClose() {
    this.resetSettings();
    this.closeSettings.emit();
  }

  resetSettings() {
    this.isAddingOptions = false;
    this.showOptionValues = false;
    this.showOptions = false;
    this.newOption = {
      label: null,
      value: null,
    };
    this.selectedOption = {
      label: null,
      value: null,
    };
    this.multipleOptionsText = '';
  }

  deleteOption(index) {
    if (index > -1) {
      this.selectedOption = {
        label: null,
        value: null,
      };
      this.selectedField.templateOptions.options.splice(index, 1);
    }
  }

  changeOption(value: string, i) {
    if (!this.showOptionValues) {
      this.selectedField.templateOptions.options[i].value = value;
    }
  }

  addOption() {
    if (this.newOption.label && this.newOption.label !== '') {
      this.selectedField.templateOptions.options.push({
        label: this.newOption.label,
        value: this.newOption.label,
      });
      const index = this.selectedField.templateOptions.options.length - 1;
      this.selectedOption = this.selectedField.templateOptions.options[index];
      this.newOption = {
        label: null,
        value: null,
      };
    }
  }

  createMultipleOptionsText() {
    this.showMultipleOptionsEditor = !this.showMultipleOptionsEditor;
    if (
      this.showMultipleOptionsEditor &&
      this.selectedField.templateOptions.options &&
      this.multipleOptionsText === ''
    ) {
      for (let option of this.selectedField.templateOptions.options) {
        this.multipleOptionsText += `${option.value}\n`;
      }
    } else if (!this.showMultipleOptionsEditor) {
      this.convertMultipleOptionTextToOptions();
    }
  }

  convertMultipleOptionTextToOptions() {
    if (this.multipleOptionsText !== '') {
      const options = this.multipleOptionsText.split(/\r?\n/);
      this.selectedField.templateOptions.options = options.map(opt => ({ label: opt.trim(), value: opt.trim() }))
    }
  }

  showField(field: any) {
    let type = this.selectedField.type;
    if (type === 'input' && this.selectedField.templateOptions.type) {
      type = this.selectedField.templateOptions.type;
    }
    if (field?.include?.length === 0 || field?.include?.includes(type)) {
      return true;
    } else {
      return false;
    }
  }

  hideField(field: any) {
    let type = this.selectedField.type;
    if (type === 'input' && this.selectedField.templateOptions.type) {
      type = this.selectedField.templateOptions.type;
    }
    if (field?.exclude?.includes(type)) {
      return true;
    } else {
      return false;
    }
  }

  returnTitle() {
    if (
      this.selectedField.type.includes('intake') ||
      this.selectedField.type.includes('customer-section')
    ) {
      return 'Section Settings';
    } else if (this.selectedField.type.includes('question-group')) {
      return 'Question Group Settings';
    } else {
      return 'Question Settings';
    }
  }

  changeField(key: string, value: string) {
    if (key === 'label' || key === 'text') {
      this.selectedField.templateOptions.placeholder = value;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selectedField.templateOptions.options,
      event.previousIndex,
      event.currentIndex
    );
  }

  onRefreshPreview() {
    this.refreshPreview.emit();
  }

  openImagePickerDialog() {
    const dialogRef = this.dialog.open(DialogImagePicker, {
      width: '60rem',
      data: {
        brandColor: this.company.brandColor,
        type: 'question',
        obj: 'question',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedField.templateOptions.icon = result;
      } else if (result === false) {
        this.selectedField.templateOptions.icon = null;
      }
    });
  }

  imageType() {
    // if (question.imageIsSVG && question.image) {
    //   return 'svg';
    // } else if (!question.imageIsSVG && question.imageUrl) {
    //   return 'image';
    // } else {
    //   return 'new';
    // }
  }
}
