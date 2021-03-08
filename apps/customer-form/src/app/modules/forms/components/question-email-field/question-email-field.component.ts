import { Component, Input, OnInit } from '@angular/core';
import { PosthogService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'app-question-email-field',
  templateUrl: './question-email-field.component.html',
  styleUrls: ['./question-email-field.component.scss']
})
export class QuestionEmailFieldComponent implements OnInit {
  @Input() companyId;
  @Input() companyName;
  @Input() formId;
  @Input() formTitle;

  constructor(
    private posthogService: PosthogService
  ) {}

  ngOnInit(): void {}

  emailChanged(event) {
    // var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (!reg.test(event)) {
    //   return;
    // }
  }

  onEmailAdded(event: any) {
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(event)) {
      console.log('valid email');
      this.posthogService.captureEvent('Submission', {
        company_id: this.companyId,
        company_name: this.companyName,
        event_type: 'Form',
        form_id: this.formId,
        form_title: this.formTitle
      });
    } else {
      console.log('invalid email');
    }
  }

}
