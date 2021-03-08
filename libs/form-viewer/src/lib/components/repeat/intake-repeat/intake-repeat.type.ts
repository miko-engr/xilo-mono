import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-viewer-intake-repeat',
  templateUrl: './intake-repeat.type.html',
})
export class IntakeRepeatTypeComponent extends FieldArrayType
  implements OnInit {
  ngOnInit() {
    if (this.field.fieldGroup && this.field.fieldGroup.length === 0) {
      this.add();
    }
    this.field.templateOptions = {
      ...this.field.templateOptions,
      onAdd: () => {
        this.add();
      },
      onRemove: (index: number) => {
        this.remove(index);
      },
    };
  }
}
