// tslint:disable
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, OnChanges } from '@angular/core';
import { Company } from '../../../models/company.model';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from '../../../services/company.service';
import { LoaderModalService } from '../../../services/loader-modal.service';
import { Form } from '../../../models/form.model';
import { LogService } from '../../../services/log.service';
import { FormService } from '../../../services/form.service';
import { VendorService } from '../../../services/vendor.service';
import { PipedriveService } from '../../../services/pipedrive.service';
import { activeFormsCopy } from '../../../utils/utils';
import { Apis } from '../../../utils/apis-list';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-integrated-apis',
  templateUrl: './integrated-apis.component.html',
  styleUrls: ['../company-info/company-info.component.scss']
})
export class IntegratedApisComponent implements OnInit, OnChanges {
  @Output() onUpdated = new EventEmitter<any>();
  @Input() integratedApis: Company;
  @Input() action: string;
  company = new Company;
  apiList: any[] = [];
  preSelectedApisList: any[] = [];
  preSelectedSearchApisList: any[] = [];
  currentApi = null;
  searchText = null;
  apiServiceList: any[] = [];
  vendor = { carrier: null, vendorName: null, state: null, username: null, password: null, accessToken: null, completed: false };
  settings = {
    pipedrive: {
      pipedriveUrl: '',
      pipedriveToken: '',
      pipedrivePipeline: '',
      pipedriveStage: '',
    },
  }
  forms: Form[] = [];
  activeForms: Form[] = [];
  selectedFormId: number = null;
  constructor(
    private dialog: MatDialog,
    private companyService: CompanyService,
    private loaderModalService: LoaderModalService,
    private formService: FormService,
    private logService: LogService,
    private vendorService: VendorService,
    private pipedriveService: PipedriveService,
    private toastService: ToastService,
    private dialogRef: MatDialog 
  ) { }

  ngOnInit(): void {
    this.company = this.integratedApis;
    this.getPreselectedApsList();
    this.formService.getFormOnlyByCompany()
      .subscribe(res => {
        this.forms = res;
        this.activeForms = activeFormsCopy(this.forms, this.vendor)
      }, error => {
        this.logService.console(error);
      });
  }

  ngOnChanges(): void {
    if (this.action === 'updateApis') {
      this.onUpdated.emit(this.company);
    }
  }

  createCopy(orig) {
    return JSON.parse(JSON.stringify(orig));
  }

  setActiveForm(formId: number) {
    const filteredForms = this.forms.filter(f => +f.id === +formId);
    if (filteredForms && filteredForms.length > 0) {
      const form = filteredForms[0];

      if (form && (!form.integrations || !form.integrations.includes(this.vendor.vendorName))) {
        if (form.integrations && form.integrations.length > 0) {
          form.integrations.push(this.vendor.vendorName);
        } else {
          form.integrations = [this.vendor.vendorName];
        }
        this.formService.patch(form)
          .subscribe(res => {
            this.activeForms.push(form);
          }, error => {
            this.toastService.showError(error.error.error.message);
          });
      }
    }
  }

  removeActiveForm(form: Form) {
    if (form.integrations && form.integrations.length > 0) {
      const index = form.integrations.findIndex(v => v === this.vendor.vendorName);
      if (index > -1) {
        form.integrations.splice(index, 1);
        this.formService.patch(form)
          .subscribe(res => {
            const formIndex = this.activeForms.findIndex(f => f.title === form.title);
            if (formIndex > -1) {
              this.activeForms.splice(formIndex, 1);
            }
          }, error => {
            this.toastService.showError(error.error.error.message);
          });
      }
    }
  }

  getPreselectedApsList() {
    this.companyService.getPreselectedIntegrations()
    .subscribe((integrations: string[]) => {
      if (integrations && integrations.length) {
        const apisList = new Apis().prepareApisList(this.company);
        this.preSelectedApisList = apisList.filter((item) => {
          let matched = false;
          integrations.filter((itemj) => {
            if (item.key === itemj) {
              matched = true;
            }
          })
          if (matched) {
            return item;
          }
        });
      }
    }, error => {
      this.logService.console(error);
    })
  }

  async prepareApiIntegration() {
    await this.getPreselectedApsList();
    this.apiServiceList = this.apiList;
  }
 
  async updateCompany(updatePipedrive: boolean) {
    this.loaderModalService.openModalLoader(`${this.currentApi.name}.`);
    this.companyService.patch(this.company)
      .subscribe(updatedCompany => {
        this.prepareApiIntegration();
        if (updatePipedrive && this.company.pipedriveToken) {
          this.updatePipedrive();
        }
        this.loaderModalService.closeModal();
      }, error => {
        this.loaderModalService.closeModal();
      });
  }

  async updatePipedrive() {
    if (this.company.pipedrivePipeline) {
      const data = await this.pipedriveService.getPipedrivePipelines(this.company.pipedriveToken);
    }
    if (this.company.pipedriveStage) {
      const data = await this.pipedriveService.getPipedriveStages(this.company.pipedriveToken);
    }
  }

  connect(template, data) {
    this.currentApi = data;
    // if ((data.settings && data.settings.fields && data.settings.fields.length) || (data.name && data.name == 'Pipedrive')) {
    //   this.vendor.vendorName = this.currentApi.settings.vendorName ? this.currentApi.settings.vendorName :
    //                             this.currentApi.vendorName ? this.currentApi.vendorName :
    //                             this.currentApi.name ? this.currentApi.name.toUpperCase() : null;
    //   const dialogRef = this.dialog.open(template, { panelClass: 'callAPIDialog' });
    //   dialogRef.afterClosed().subscribe(result => {
    //     this.currentApi = '';
    //   });
    // } else {
      this.connectApi(true);
    // }
  }

  openSettings(template, data) {
    this.currentApi = data;
    if ((data.settings && data.settings.fields && data.settings.fields.length) || (data.name && data.name == 'Pipedrive')) {
      this.vendor.vendorName = this.currentApi.settings.vendorName ? this.currentApi.settings.vendorName :
                                this.currentApi.vendorName ? this.currentApi.vendorName :
                                this.currentApi.name ? this.currentApi.name.toUpperCase() : null;
      const dialogRef = this.dialog.open(template, { panelClass: 'callAPIDialog' });
      dialogRef.afterClosed().subscribe(result => {
        this.currentApi = '';
      });
    }
  }

  disconnectApi(data) {
    this.currentApi = data;
    this.connectApi(false);
  }

  connectApi(status: Boolean) {
    this.company[this.currentApi.key] = status;
    this.updateCompany(false);
  }

  saveApiIntegrations() {
    this.dialogRef.closeAll();
    if (this.currentApi.name === 'Pipedrive') {
      this.currentApi.values = true;
      this.integrate(this.currentApi)
    } else if (this.currentApi.name === 'Facebook' && (this.vendor.accessToken)) {
      this.currentApi.values = true;
      this.integrate(this.currentApi)
    } else {
      if (this.vendor.vendorName) {
        this.vendor.completed = true;
        this.upsertVendor(this.vendor);
      }
    }
  }

  search() {
    if (this.searchText) {
      this.apiServiceList = this.returnSearchedApis(this.apiList);
      this.preSelectedSearchApisList = this.returnSearchedApis(this.preSelectedApisList);
    } else {
      this.apiServiceList = this.apiList;
      this.preSelectedSearchApisList = this.preSelectedApisList;
    }
  }

  returnSearchedApis(list: any[] = []) {
    const searchList = list.filter(item => item.name && item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
    return searchList;
  }

  async upsertVendor(vendor: any) {
    if (typeof vendor !== 'undefined' && vendor.completed) {
      this.vendor = vendor;
      if (this.vendor.vendorName === 'RATER') {
        this.vendor.vendorName = this.vendor.carrier.toUpperCase() || '';
      } else {
        this.vendor.vendorName = this.vendor.vendorName.toUpperCase() || '';
      }
      this.vendorService.upsertVendor(vendor)
        .subscribe(async (data: any) => {
          this.toastService.showSuccess('Credentials Added Successfully');
          this.vendor = { carrier: null, vendorName: null, username: null, state: null, password: null, accessToken: null, completed: false };
          if (data.status === 'create' && vendor.vendorName === 'TURBORATER') {
            this.company.turboraterIntegrationId = data.newVendorID;
          }
          if (vendor.vendorName === 'QUOTERUSH' && data.status === 'create') {
            this.company.quoteRushIntegrationId = data.newVendorID;
          }
          if (vendor.vendorName === 'CABRILLO' && data.status === 'create') {
            this.company.cabrilloIntegrationId = data.newVendorID;
          }
        }, error => {
          this.toastService.showError(error.error.error.message);
        });
    }
  }

  integrate(res: any) {
    this.company[res.key] = res.values;
    if (res.name === 'Pipedrive' && (res.values === true || res.values === 'true')) {
      for (const key in res.settings) {
        this.company[key] = res.settings[key];
      }
    }
    this.updateCompany(res.name === 'Pipedrive');
  }

}