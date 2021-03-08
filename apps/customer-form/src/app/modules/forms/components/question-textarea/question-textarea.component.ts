import { Component, OnInit, Input } from '@angular/core';

import { Answer } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-question-textarea',
  templateUrl: './question-textarea.component.html',
  styleUrls: ['./question-textarea.component.scss'],
})
export class QuestionTextareaComponent implements OnInit {
  @Input() properties: Answer;
  @Input() currentForm: FormGroup;
  @Input() isInvalid: boolean;
  @Input() errorMessage: string;

  constructor() {}

  ngOnInit(): void {
  }

  handleChange($event) {
    const value = $event.target.value;
    this.currentForm.patchValue({ [this.properties.id]: value });
  }

}
