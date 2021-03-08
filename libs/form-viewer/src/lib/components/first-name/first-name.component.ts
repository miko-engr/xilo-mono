import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SubmissionService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-form-viewer-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: [
    '../../form-viewer.component.scss',
    './first-name.component.scss',
  ],
})
export class CustomFirstNameComponent extends FieldType {
  isInvalid = false;
  errorMessage = false;

  constructor(private submissionService: SubmissionService) {
    super();
  }

  updateMetadata(event: any) {
    this.submissionService.onUpdateMetadata(
      {
        key: 'firstName',
        value: event.target.value,
      },
      this.field
    );
  }

  getError() {
    return 'Invalid response';
  }
}
