import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormViewService } from '@xilo-mono/form-contracts';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { CompanyService } from '../services/company.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss'],
})
export class FormsListComponent implements OnInit {
  forms$: Observable<any>;

  constructor(
    private formViewService: FormViewService,
    private router: Router,
    private toastService: ToastService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.forms$ = this.formViewService.getFormsByCompany();
  }

  makeCopy(obj: Object) {
    return JSON.parse(JSON.stringify(obj));
  }

  routeToEdit(form: any) {
    if (!(form && form.metadata && form.metadata.key)) {
      return this.toastService.showWarn(
        'Had issue with form. Please contact support'
      );
    }
    this.router.navigate([`/form-builder/form-editor`], {
      queryParams: { id: form.metadata.key },
    });
  }

  routeToFormWizard() {
    this.router.navigate(['/new-form']);
  }

  duplicate(formData: any) {
    this.formViewService.duplicate(formData).subscribe(
      (newFormData) => {
        this.forms$ = this.formViewService.getFormsByCompany();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  delete(id: string | number) {
    this.formViewService.delete(id).subscribe(
      (result) => {
        this.forms$ = this.formViewService.getFormsByCompany();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openForm(form:any) {
    const companyId = this.companyService.company?.companyId || 769677;

    this.formViewService.getForm(form.metadata.key).subscribe(
      (form) => {
        let formType = 'intake-form';
        if (form.components[0].type === 'intake-form') {
          formType = 'intake-form';
        } else {
          formType = 'customer-form';
        }
        const domain =
          formType === 'intake-form'
            ? environment.intakeFormUrl
            : environment.customerFormUrl;
        window.open(`${domain}/form?companyId=${companyId}&formId=${form.metadata.key}`, '_blank');
      },
      (error) => {
        const domain = environment.intakeFormUrl;
        window.open(`${domain}/form?companyId=${companyId}&formId=${form.metadata.key}`, '_blank');
      }
    );
  }
}
