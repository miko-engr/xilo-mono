import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormViewService,
  FormView,
  FormBuilderService,
} from '@xilo-mono/form-contracts';
import { LogService } from '../../services/log.service';
import { Company } from '../../models/company.model';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { PdfService } from '../../services/pdf.service';
import { environment } from '../../../environments/environment';
import { v4 } from 'uuid';
import { datatableType } from 'libs/form-viewer/src/lib/components/grid/datatable-formly.type';
import { gridType } from 'libs/form-viewer/src/lib/components/grid/grid-formly.type';

@Component({
  selector: 'app-form-builder-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class FormBuilderNavComponent implements OnInit, OnDestroy {
  @Input() company: Company;
  form: FormView;
  formStateSubscription: Subscription;
  pdfId = null;
  params = this.route.snapshot.queryParams || 2;
  formFieldsSubscription: Subscription;
  formFieldsData = null;

  constructor(
    private formViewService: FormViewService,
    private formBuilderService: FormBuilderService,
    private logService: LogService,
    private router: Router,
    private toastService: ToastService,
    private pdfService: PdfService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.formStateSubscription = this.formBuilderService.formStateChanged.subscribe(
      (hasChanged) => {
        if (hasChanged) {
          this.form = this.formBuilderService.getForm();
        }
      }
    );
    this.formFieldsSubscription = this.formBuilderService.formFieldsChanged.subscribe(
      (data) => {
        this.formFieldsData = Object.keys(data).length ? data : null;
      }
    );
  }

  ngOnDestroy() {
    this.formStateSubscription.unsubscribe();
    this.formFieldsSubscription.unsubscribe();
  }

  saveForm() {
    if (this.pageHasPath('pdf')) {
      return this.saveFormFields();
    }
    const form = this.formBuilderService.getForm();
    if (form.id) {
      if (!form.metadata) {
        form.metadata.version = 1;
        form.metadata.key = v4();
      }
      if (!form.metadata.version) {
        form.metadata.version = 1;
      } else {
        form.metadata.version += 1;
      }
      if (!form.metadata.key) {
        form.metadata.key = v4();
      }
      if (!form.metadata.type && form.components?.length > 0) {
        form.metadata.type = form.components[0].type;
      }
      delete form.id;
      if (form.components[0].type === 'intake-form') {
        form.components[0].fieldGroup.map((x) => {
          if (x.type === 'intake-section') {
            // this.addDatatableType(x);
            this.addGridType(x);
          } else {
            this.addGridType(x.fieldArray);
          }
        });
      }

      this.formViewService.create(form).subscribe(
        (result) => {
          form.id = result.id;
          this.formBuilderService.setForm(form);
          const successOptions = {
            duration: 10000,
            link: this.generateLink(form.metadata.key, form.components[0].type),
            linkName: 'View',
          };
          this.toastService.showSuccess(
            `Form version ${form.metadata.version} published`,
            successOptions
          );
        },
        (error) => {
          this.logService.console(error);
          this.toastService.showError('Issue publishing form');
        }
      );
    } else {
      if (!form.metadata) {
        form.metadata.version = 1;
        form.metadata.key = v4();
      }
      if (!form.metadata.version) {
        form.metadata.version = 1;
      } else {
        form.metadata.version += 1;
      }
      if (!form.metadata.key) {
        form.metadata.key = v4();
      }
      form.companyFormViewId = this.company.id;
      this.formViewService.create(form).subscribe(
        (result) => {
          form.id = result.id;
          this.formBuilderService.setForm(form);
          this.toastService.showSuccess('Form published');
        },
        (error) => {
          this.logService.console(error);
          this.toastService.showError('Issue publishing form');
        }
      );
    }
  }

  saveFormFields() {
    const { pdfId, formFields } = this.formFieldsData;
    const updatedFormFields = { pdfId: pdfId, fields: formFields };
    this.pdfService.updateFormField(updatedFormFields).subscribe(
      (data) => {
        this.toastService.showSuccess('PDF updated successfully');
      },
      (error) => {
        this.toastService.showError('Error updating PDF');
      }
    );
  }

  pageHasPath(path: string) {
    return window.location.href.includes(path);
  }

  saveBtnText() {
    if (this.pageHasPath('pdf')) {
      return 'Save PDF';
    } else {
      return 'Publish';
    }
  }

  generateLink(key: string, formType: string) {
    const domain =
      formType === 'intake-form'
        ? environment.intakeFormUrl
        : environment.customerFormUrl;
    return `${domain}/form?companyId=${this.company.companyId}&formId=${key}`;
  }

  routeToFormsList() {
    this.router.navigate([`/profile/forms-list`]);
  }

  addDatatableType(section) {
    section.fieldGroup = section.fieldGroup.filter(
      (x) => x.type !== 'datatable'
    );

    const key = v4();

    const qgData = section.fieldGroup.filter((x) => {
      if (x.type === 'question-group') {
        x.hide = true;
        return x;
      }
    });

    if (qgData && qgData.length > 0) {
      let column = [
        {
          name: 'Class',
          prop: 'classKey',
        },
      ];

      qgData[0].fieldGroup.forEach((x) => {
        column.push({
          name: x.templateOptions.label,
          prop: x.templateOptions.dataKey ? x.templateOptions.dataKey : x.key,
        });
      });

      let fieldGroup = [
        {
          type: 'text',
          key: 'classKey',
          templateOptions: {},
        },
      ];

      qgData[0].fieldGroup.forEach((x) => {
        delete x.templateOptions.label;
        fieldGroup.push({
          type: x.type,
          key: x.templateOptions.dataKey ? x.templateOptions.dataKey : x.key,
          templateOptions: x.templateOptions,
        });
      });

      const model = qgData.map((x) => {
        let ret: any[] = [];

        let item = [
          {
            [`${'classKey'}`]: x.templateOptions.label,
          },
        ];

        x.fieldGroup.forEach((y) => {
          item.push({
            [`${
              y.templateOptions.dataKey ? y.templateOptions.dataKey : y.key
            }`]: '',
          });
        });

        ret.push(Object.assign({}, ...item));

        return ret[0];
      });

      section.fieldGroup.push(datatableType(key, column, fieldGroup, model));
    }
  }

  addGridType(section) {
    section.fieldGroup = section.fieldGroup.filter((x) => x.type !== 'grid');

    const key = v4();

    const qgData = section.fieldGroup.filter((x) => {
      if (x.type === 'question-group') {
        x.hide = true;
        return x;
      }
    });

    if (qgData && qgData.length > 0) {
      let columnDefs = [
        {
          headerName: 'Class',
          field: 'classKey',
        },
      ];

      qgData[0].fieldGroup.forEach((x) => {
        columnDefs.push({
          headerName: x.templateOptions.label,
          field: x.templateOptions.dataKey ? x.templateOptions.dataKey : x.key,
        });
      });

      let fieldGroup = [
        {
          type: 'text',
          key: 'classKey',
          templateOptions: {},
        },
      ];

      qgData[0].fieldGroup.forEach((x) => {
        delete x.templateOptions.label;
        fieldGroup.push({
          type: x.type,
          key: x.templateOptions.dataKey ? x.templateOptions.dataKey : x.key,
          templateOptions: x.templateOptions,
        });
      });

      const model = qgData.map((x) => {
        let ret: any[] = [];

        let item = [
          {
            [`${'classKey'}`]: x.templateOptions.label,
          },
        ];

        x.fieldGroup.forEach((y) => {
          item.push({
            [`${
              y.templateOptions.dataKey ? y.templateOptions.dataKey : y.key
            }`]: '',
          });
        });

        ret.push(Object.assign({}, ...item));

        return ret[0];
      });

      section.fieldGroup.push(gridType(key, columnDefs, fieldGroup, model));
    }
  }
}
