import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-viewer-text',
  templateUrl: './text.component.html',
  styleUrls: ['../../form-viewer.component.scss', './text.component.scss'],
})
export class CustomTextComponent extends FieldType {
  isInvalid = false;
  errorMessage = false;

  getError() {
    return 'Invalid response';
  }
}
