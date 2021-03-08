import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SubmissionService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-form-viewer-phone-number',
  templateUrl: './phonenumber.component.html',
  styleUrls: [
    '../../form-viewer.component.scss',
    './phonenumber.component.scss',
  ],
})
export class PhoneNumberComponent extends FieldType {
  isInvalid = false;
  errorMessage = false;

  constructor(private submissionService: SubmissionService) {
    super();
  }

  updateMetadata(event: any) {
    this.submissionService.onUpdateMetadata(
      {
        key: 'phone',
        value: event.target.value,
      },
      this.field
    );
  }

  getError() {
    return 'This value should be 10 numbers.';
  }
}
