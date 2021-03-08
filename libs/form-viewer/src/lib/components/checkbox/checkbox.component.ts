import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-viewer-check-box',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CustomCheckboxComponent extends FieldType implements OnInit {
  ngOnInit() {
    if (!this.formControl.value) {
      this.formControl.setValue(false);
    }
  }
}
