import { Component, OnInit } from '@angular/core';
import { FieldType, FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-viewer-table',
  templateUrl: './table.type.html',
  styleUrls: ['../../assets/custom-theme.scss', './table.component.scss']
})

export class CustomTableComponent extends FieldArrayType implements OnInit {


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
        console.log(index);
        this.remove(index)
      }
    }
  }
}
