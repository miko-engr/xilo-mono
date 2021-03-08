import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SubmissionService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-form-viewer-last-name',
  templateUrl: './last-name.component.html',
  styleUrls: ['../../form-viewer.component.scss', './last-name.component.scss'],
})
export class CustomLastNameComponent extends FieldType {
  isInvalid = false;
  errorMessage = false;

  constructor(private submissionService: SubmissionService) {
    super();
  }

  updateMetadata(event: any) {
    this.submissionService.onUpdateMetadata(
      {
        key: 'lastName',
        value: event.target.value,
      },
      this.field
    );
  }

  getError() {
    return 'Invalid response';
  }
}
