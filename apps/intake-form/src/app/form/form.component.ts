import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { LoaderModalService } from '../services/loader-modal/loader-modal.service';
import { FormView } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-intake-form-view',
  template: `
  <div class="container">
    <xilo-mono-form-viewer
      [fields]="fields"
      [form]="form"
      [formView]="formView"
      [options]="formOptions"
      (showAlert)="onAlert($event)"
      (isLoading)="onLoading($event)"
    ></xilo-mono-form-viewer>
  </div>
  `,
  styleUrls: ['./form.component.scss'],
})
export class IntakeFormViewComponent implements OnInit {
    @Input() fields: any[];
    @Input() form: FormGroup;
    @Input() formView: FormView;

    formOptions = {
      formState: {
        questionnum: 0,
        sectionnum: 0,
        subindex: 0
      }
    }
    constructor(
      private loaderModalService: LoaderModalService,
      private toastService: ToastService
    ) {}

    ngOnInit() {}

    onAlert(obj: {type: string; message: string}) {
      if (obj.type === 'success') {
        this.toastService.showSuccess(obj.message);
      }
    }

    onLoading(loading: boolean) {
      if (loading) {
        this.loaderModalService.openModalLoader('');
      } else {
        this.loaderModalService.closeModal();
      }
    }

}
