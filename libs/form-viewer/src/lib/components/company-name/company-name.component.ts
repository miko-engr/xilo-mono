import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SubmissionService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-form-viewer-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: [
    '../../form-viewer.component.scss',
    './company-name.component.scss',
  ],
})
export class CustomCompanyNameComponent extends FieldType {
  isInvalid = false;
  errorMessage = false;

  constructor(private submissionService: SubmissionService) {
    super();
  }

  updateMetadata(event: any) {
    this.submissionService.onUpdateMetadata(
      {
        key: 'companyName',
        value: event.target.value,
      },
      this.field
    );
  }

  getError() {
    return 'Invalid response';
  }
}
