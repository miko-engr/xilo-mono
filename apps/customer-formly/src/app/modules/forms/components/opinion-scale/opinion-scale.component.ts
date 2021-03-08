import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Answer } from '../../models/answer.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-opinion-scale',
  templateUrl: './opinion-scale.component.html',
  styleUrls: ['./opinion-scale.component.scss']
})
export class OpinionScaleComponent implements OnInit {
  @Input() properties: Answer;
  @Input() currentForm: FormGroup;

  @Output() changeQuestion: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  isSelectedOpinon(option): boolean {
    return option === this.currentForm.get(this.properties.answerId).value;
  }

  handleOptionSelected(value) {
    this.currentForm.patchValue({ [this.properties.id]: value });
    this.currentForm.get(this.properties.answerId).markAsDirty();

    this.changeQuestion.emit('next');
  }
}
