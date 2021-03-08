import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PosthogService } from '@xilo-mono/form-contracts';
import { environment } from '../../../../../environments/environment';
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
  @Input() company;
  @Input() form;
  public phoneNumber = '';
  public teleNumber = '';

  constructor(
    private posthogService: PosthogService
  ) {}

  ngOnInit(): void {}

  onPhoneAdded() {
    setTimeout(() => {
      if (!this.isInvalid && environment.production) {
        this.posthogService.captureEvent('Submission', {
          company_id: this.company.id,
          company_name: this.company.name,
          event_type: 'Form',
          form_id: this.form.id,
          form_title: this.form.title
        });
      }
    }, 500);
  }

}
