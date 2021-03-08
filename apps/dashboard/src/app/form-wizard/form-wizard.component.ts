import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormView, FormViewService } from '@xilo-mono/form-contracts';
import { CompanyService } from '../services/company.service';
import { v4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { newCustomerFormTemplate, newIntakeFormTemplate } from './templates';

@Component({
  selector: 'app-form-wizard',
  templateUrl: './form-wizard.component.html',
  styleUrls: ['./form-wizard.component.scss'],
})
export class FormWizardComponent implements OnInit {
  company;
  templateCategories = ['Recommended', 'Auto', 'Home', 'Bundle'];
  activeCategory = 'Recommended';
  search = '';
  templates = [];
  newCustomerFormTemplate = newCustomerFormTemplate;
  newIntakeFormTemplate = newIntakeFormTemplate;

  originTemplates = [];

  constructor(
    private companyService: CompanyService,
    private formViewService: FormViewService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.formViewService.getTemplates().subscribe(
      (templates: FormView[]) => {
        this.templates = templates;
        console.log(this.templates);
        this.templates.forEach((template) => {
          delete template.id;
          template.metadata.key = v4();
          template.metadata.version = 0;
          template.metadata.template = false;
          if (template.icon === 'auto') {
            this.http
              .get('assets/data/auto.txt', { responseType: 'text' })
              .subscribe((data) => {
                template.icon = data;
              });
          }
        });
        this.originTemplates = this.makeCopy(this.templates);
      },
      (error) => {
        console.log(error);
      }
    );
    this.getCompany();
  }

  getCompany() {
    this.companyService.get().subscribe(
      (res) => {
        this.company = res['obj'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  routeToFormsList() {
    this.router.navigate(['/profile/forms-list']);
  }

  filterTemplate(value: string) {
    if (value === '') {
      return (this.templates = this.makeCopy(this.originTemplates));
    }
    value = value ? value.toLowerCase() : '';

    this.templates = this.templates.filter((t) => {
      const title = t.title.toLowerCase();
      return title.includes(value);
    });
  }

  filterCategory(value: string) {
    this.activeCategory = value;
    if (value === 'Recommended') {
      return (this.templates = this.makeCopy(this.originTemplates));
    }

    this.templates = this.originTemplates.filter((t) => {
      const category = t.metadata.templateCategory;
      return category === value;
    });
  }

  categoryIsActive(value: string) {
    return value === this.activeCategory;
  }

  makeCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  formType(form: FormView) {
    if (form.components[0]['type'] === 'intake-form') {
      return 'Intake Form';
    } else {
      return 'Customer Form';
    }
  }

  createForm(template: any) {
    template.companyFormViewId = this.company.id;
    this.formViewService.create(template).subscribe(
      (resp) => {
        this.router.navigate([`/form-builder/form-editor`], {
          queryParams: { id: resp.key },
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
