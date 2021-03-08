import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-viewer-intake-form',
  template: `
  <div 
      *ngFor="let step of field.fieldGroup; let index = index; let last = last;">
      <formly-field [field]="step"></formly-field>
  </div>
`,
})

export class FormIntakeTypeComponent extends FieldType {
  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup.every(f => this.isValid(f));
  }
}
