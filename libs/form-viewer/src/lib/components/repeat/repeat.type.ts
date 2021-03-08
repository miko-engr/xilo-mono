import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormViewService } from '@xilo-mono/form-contracts';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'xilo-mono-form-viewer-repeat',
  templateUrl: './repeat.type.html',
})
export class RepeatTypeComponent extends FieldArrayType implements OnInit {
  onSubmitSubscription: Subscription;

  constructor(
    private formViewService: FormViewService
  ) {
    super();
  }

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
        this.remove(index)
      }
    }
    this.onSubmitSubscription = this.formViewService.submitForm
    .subscribe(submit => {
      if (submit) {
        // this.field.fieldGroup.length = 0;
        // this.model.length = 0;
        // const formControl = <FormArray> this.field.formControl;
        // while (formControl.length !== 0) {
        //   formControl.removeAt(0);
        // }
      }
    });
  }
  
}