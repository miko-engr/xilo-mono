import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Answer } from '../../models';

@Component({
  selector: 'app-question-phone-number-field',
  templateUrl: './question-phone-number-field.component.html',
  styleUrls: ['./question-phone-number-field.component.scss']
})
export class QuestionPhoneNumberFieldComponent implements OnInit {
  @Input() properties: Answer;
  @Input() currentForm: FormGroup;
  @Input() isInvalid: boolean;
  public phoneNumber = '';
  public teleNumber = '';

  constructor() {}

  ngOnInit(): void {}
}
