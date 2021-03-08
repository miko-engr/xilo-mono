import { Component, OnInit, Inject } from '@angular/core';
import { CompanyService } from '../../../../services/company.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorService } from '../../../../services/vendor.service';
import { FormService } from '../../../../services/form.service';
import { Form } from '../../../../models/form.model';
import { LogService } from '../../../../services/log.service';
import { AMS360Service } from '../../../../services/ams360.service';

@Component({
  selector: 'app-api-settings-modal',
  templateUrl: './api-settings-modal.component.html',
  styleUrls: ['../../business.component.css']
})
export class ApiSettingsModalComponent implements OnInit {
  vendor = {vendorName: null, username: null, password: null, accessToken: null, 
            completed: false, state: null, carrier: null, agency: null};
  settings = {
    pipedriveUrl: '',
    pipedriveToken: '',
    pipedrivePipeline: '',
    pipedriveStage: '',
  }
  forms: Form[] = [];
  activeForms: Form[] = [];
  selectedFormId: number = null;
  changesMade = false;
  amsSettings = {
    divisions: [],
    branches: [],
    groups: [],
    departments: [],
    executives: [],
    reps: []
  };
  amsDetailsLoaded = false;

  constructor(
    private ams360Service: AMS360Service,
    private companyService: CompanyService,
    public dialogRef: MatDialogRef<ApiSettingsModalComponent>,
    private logService: LogService,
    private formService: FormService,
    private vendorService: VendorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data) {
      this.vendor.vendorName = this.data.settings.vendorName ? this.data.settings.vendorName :
                                this.data.vendorName ? this.data.vendorName :
                                this.data.name ? this.data.name.toUpperCase() : null;
      if (this.data.name === "Infusionsoft") {
        if (this.data.isAuthorized && this.data.isValidToken) {
            this.data.settings.fields[0].label = 'Authorized';
        } 
        if (this.data.isAuthorized && !this.data.isValidToken) {
            this.data.settings.fields[0].label = 'Re-Authorize';
        }
      }
    }
  }

  ngOnInit() {
    if (this.data && this.data.key && this.data.settings) {
      this.setSettingsData(this.data);
      if (this.data.settings.vendorName === 'AMS360') {
        this.setAmsSettings();
      }
       if (this.data.settings.vendorName) {
        this.vendorService.getVendorByCompanyId(this.vendor.vendorName, null).subscribe((result: any) => {
          this.vendor.username = result.username;
          this.vendor.agency = result.agency;
        }, error => this.logService.console(error))
      }
    }
    this.formService.getFormOnlyByCompany()
    .subscribe(res => {
      this.forms = res;
      this.activeForms = this.createCopy(this.forms).filter(f => {
        return (f.integrations && f.integrations.length > 0 &&
                f.integrations.includes(this.vendor.vendorName));
      });
    }, error => {
      this.logService.console(error);
    });
  }

  trackChanges() {
    this.changesMade = true;
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
          this.logService.console(error, true);
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
          this.logService.console(error, true);
        });
      }
    }
  }

  setSettingsData(data) {
    if (data.key === 'pipedriveIntegration') {
      this.settings = data.settings;
    }
  }

  setAmsSettings() {
    this.ams360Service.getAms360Details()
    .subscribe(data => {
      this.amsSettings.divisions = data['divisions'];
      this.amsSettings.branches = data['branches'];
      this.amsSettings.groups = data['groups'];
      this.amsSettings.departments = data['departments'];
      this.amsSettings.executives = data['executives'];
      this.amsSettings.reps = data['reps'];
      this.amsDetailsLoaded = true;
    }, error => {
      this.logService.console(error, false);
    });
  }

  routeTo(url: string) {
    window.location.href = url;
  }

  close() {
    this.dialogRef.close('data')
  }

  disconnect() {
    this.data.values = false;
    this.close();
    this.companyService.integrateService(this.data);
  }

  updateCompany() {
    this.companyService.patch(this.data.company)
    .subscribe(data => {
    }, error => {
      this.logService.console(error, true);
    })
  }

  saveApi() {
    this.close();
    if (this.changesMade) {
      if (this.data.name === 'Pipedrive' && (this.data.values === true || this.data.values === 'true')) {
        this.companyService.integrateService(this.data);
      } else if (this.data.name === 'Facebook' && (this.vendor.accessToken)) {
        this.data.values = this.vendor.accessToken;
        this.companyService.integrateService(this.data);
      } else {
        if (this.vendor.vendorName) {
          this.vendor.completed = true;
          this.vendorService.updateVendorData(this.vendor);
        }
      }
    }
  }
}
