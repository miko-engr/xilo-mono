import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { CustomerFormFacade } from '../../../+state/customer-form/customer-form.facade';

@Component({
  selector: 'xilo-mono-form-viewer-customer-repeat',
  templateUrl: './customer-repeat.component.html',
})
export class CustomerRepeatTypeComponent extends FieldArrayType
  implements OnInit {
  subsection = 0;

  constructor(private customerFormFacade: CustomerFormFacade) {
    super();
  }

  ngOnInit() {
    if (this.field.fieldGroup && this.field.fieldGroup.length === 0) {
      setTimeout(() => {
        this.add();
      }, 200);
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
    this.customerFormFacade.subsectionIndex$.subscribe((index) => {
      this.subsection = index;
    });
  }
}
