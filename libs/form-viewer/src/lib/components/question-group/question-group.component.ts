import { Component, DoCheck } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { FormViewService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-form-viewer-question-group',
  templateUrl: './question-group.component.html',
  styleUrls: ['./question-group.component.scss'],
})
export class QuestionGroupTypeComponent extends FieldType implements DoCheck {
  constructor(private formViewService: FormViewService) {
    super();
  }

  ngDoCheck() {
    this.formViewService.changeQuestionGroupState({
      valid: this.formControl?.valid,
    });
  }
}
