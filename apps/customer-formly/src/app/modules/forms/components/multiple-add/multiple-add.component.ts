import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multiple-add',
  templateUrl: './multiple-add.component.html',
  styleUrls: ['./multiple-add.component.scss']
})
export class MultipleAddComponent implements OnInit {
  @Input() properties: Answer;
  @Input() currentForm: FormGroup;

  @Output() changeQuestion: EventEmitter<string> = new EventEmitter();
  @Output() addNewItem: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  handleChangeQuestionClick() {
    this.changeQuestion.emit('next');
  }
  handleAddNewClick() {
    this.addNewItem.emit(this.properties.objectName);
  }
}
