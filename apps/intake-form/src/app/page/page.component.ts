import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CompanyService, FormViewService, FormView } from '@xilo-mono/form-contracts';
import { Theme, Company, AgentService } from '@xilo-mono/form-contracts';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'xilo-mono-intake-form-page',
  template: `
  <xilo-mono-intake-form-navbar 
    [companyDetails]="companyDetails"
    >
  </xilo-mono-intake-form-navbar>
  <div class="main">
    <div class="left">
      <xilo-mono-intake-form-view
        [fields]="fields"
        [form]="form"
        [formView]="formView"
      ></xilo-mono-intake-form-view>
    </div>
    <div class="right">
      <xilo-mono-intake-form-summary
        [fields]="fields"
      ></xilo-mono-intake-form-summary>
      <hr class="divider">
      <xilo-mono-intake-form-notes
        [companyDetails]="companyDetails"
      ></xilo-mono-intake-form-notes>
    </div>
  </div>
  `,
  styleUrls: ['./page.component.scss']
})
export class IntakeFormPageComponent implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  companyDetails: Company;
  agentId: number | string;
  fields: any[] = [];
  model = {};
  form = new FormGroup({});
  formView: FormView;

  constructor(
    private agentService: AgentService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private formViewService: FormViewService
  ) {}

  ngOnInit(): void {
    if (this.queryParams && this.queryParams.companyId) {
      this.getCompanyById(this.queryParams.companyId);
    }
    this.setTheme({
      'brand-color': '#6e71ff',
      'brand-color-light': '#6e71ff' + '33',
      'secondary-color': '#23d6c8',
      'hover-color': '#E5E5FB;',
      'secondary-color-light': '#23d6c8' + '33'
    });
    this.getForm();
    this.getAgent();
  }
  private setTheme(theme: Theme) {
    Object.keys(theme).forEach(k =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
  getForm() {
    this.formViewService.getForm(this.queryParams.formId)
    .subscribe(form => {
      this.fields = form.components;
      this.formView = form;
      // console.log(this.fields);
    }, error => {
      console.log(error);
    });
  }
  getAgent() {
    if (this.queryParams.agent) {
      this.agentService.getAgentIdByEmail(this.queryParams.agent)
      .subscribe(agent => {
        this.agentId = agent;
      }, error => {
        console.log(error);
      });
    }
  }
  getCompanyById(id) {
    this.companyService.getCompanyDetailsById(id).subscribe();

    this.companyService.companyDetails.subscribe((company: Company) => {
      this.companyDetails = company;
      this.setTheme({
        'brand-color': company.brandColor || '#6e71ff',
        'brand-color-light': (company.brandColor || '#6e71ff') + '33',
        'hover-color': company.brandColor || '#E5E5FB',
        'secondary-color': company.brandSecondaryColor || '#23d6c8',
        'secondary-color-light': company.brandSecondaryColor || '#23d6c8' + '33'
      });
    });
  }
  // mapFields(fields: FormlyFieldConfig[]) {
  //   return fields.map(f => {
  //     if (f.fieldGroup) {
  //       f.fieldGroup = this.mapFields(f.fieldGroup);
  //     } else if (f.fieldArray) {
  //       f.fieldArray.fieldGroup = this.mapFields(f.fieldArray.fieldGroup);
  //     }
  //     if (f.type === 'select') {
  //       console.log(f);
  //       if (f.templateOptions.tags) {
  //         switch (true) {
  //           case f.templateOptions.tags.vehicleYear:
  //             f.hooks = {
  //               onInit: field => {
  //                 console.log('Year Init: ', field)
  //                 const makeField = field.parent.fieldGroup.find(fd => 
  //                   fd.templateOptions.tags && fd.templateOptions.tags.vehicleMake
  //                 );
  //                 makeField.templateOptions.options = field.formControl.valueChanges.pipe(
  //                   startWith(field.formControl.value),
  //                   map(year => {
  //                     console.log(year);
  //                     return this.vehicleService.getMakes(year)
  //                   }),
  //                   tap(() => field.formControl.setValue(null))
  //                 )
  //                 console.log('Make: ', makeField);
  //               }
  //             }
  //             break;
  //           case f.templateOptions.tags.vehicleMake:
  //             // const year = fields.fieldGroup.find(fd => 
  //             //   fd.templateOptions.tags && 
  //             //   fd.templateOptions.tags.vehicleYear
  //             // );
  //             // if (year) {
  //             //   console.log('Year: ', year);
  //             // }
  //             // f.templateOptions.options = this.vehicleService.getMakes() || [];
  //             break;
  //           case f.templateOptions.tags.vehicleModel:
  //             // f.templateOptions.options = this.vehicleService.getModels('Jeep') || [];
  //             break;
  //           case f.templateOptions.tags.vehicleBodyStyle:
  //             // f.templateOptions.options = this.vehicleService.getBodyStyles('Cherokee') || [];
  //             break;
  //         }
  //       }
  //     }
  //     return f
  //   })
  // }
}
