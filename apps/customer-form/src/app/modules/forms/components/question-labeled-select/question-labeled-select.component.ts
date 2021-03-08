import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../models';
import { FormGroup } from '@angular/forms';
import { OptionGroup } from '../../models/option-groups.model';

@Component({
  selector: 'app-question-labeled-select',
  templateUrl: './question-labeled-select.component.html',
  styleUrls: ['./question-labeled-select.component.scss']
})
export class QuestionLabeledSelectComponent implements OnInit {
  @Input() properties: Answer;
  @Input() currentForm: FormGroup;
  @Output() changeQuestion: EventEmitter<string> = new EventEmitter();
  labeledSelectOptions: OptionGroup[];
  public selectOptionList: Array<string> = [];
  constructor() {}

  ngOnInit(): void {
    this.labeledSelectOptions = this.properties.labeledSelectOptions;
    if (this.properties.isMultipleSelect) {
      this.selectOptionList =
        this.currentForm.get(this.properties.answerId).value || [];
      this.currentForm
        .get(this.properties.answerId)
        .valueChanges.subscribe(value => {
          this.selectOptionList = value || [];
        });
    }
  }

  getValue(): string {
    return this.currentForm.get(this.properties.answerId).value;
  }

  handleOptionSelect(item) {
    if (!this.properties?.isMultipleSelect) {
      this.currentForm.patchValue({
        [this.properties.id]: item.value
      });
      this.currentForm.get(this.properties.answerId).markAsDirty();
      this.gotoNext();
    } else if (this.properties?.isMultipleSelect) {
      if (!this.selectOptionList.includes(item.value)) {
        this.selectOptionList.push(item.value);
      } else {
        if (this.selectOptionList.includes(item.value)) {
          this.selectOptionList.splice(
            this.selectOptionList.indexOf(item.value),
            1
          );
        }
      }
      this.currentForm.patchValue({
        [this.properties.id]: this.selectOptionList
      });
      this.currentForm.get(this.properties.answerId).markAsDirty();
    }
  }

  handleInputChange(target) {
    if (target.value) {
      this.labeledSelectOptions = this.properties.labeledSelectOptions.filter(
        op => op.label.toLowerCase().indexOf(target.value.toLowerCase()) > -1
      );
    } else {
      this.labeledSelectOptions = [...this.properties.labeledSelectOptions];
    }
  }

  isSelectedOption(data): boolean {
    return this.selectOptionList.includes(data);
  }

  gotoNext() {
    setTimeout(() => {
      this.changeQuestion.emit('next');
    }, 500);
  }

  handleTooltipClick($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  formatLSO(labeledSelectOptions) {
    return JSON.parse(labeledSelectOptions);
  }
}
