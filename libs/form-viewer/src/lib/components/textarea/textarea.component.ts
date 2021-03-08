import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-viewer-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['../../form-viewer.component.scss', './textarea.component.scss']
})

export class CustomTextareaComponent extends FieldType {
  isInvalid = false;
  errorMessage = false;
  
  getError() {
    return 'Invalid response';
  }

}
