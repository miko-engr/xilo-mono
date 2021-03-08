import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../../services/agent.service';
import { AlertControllerService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prospects-settings',
  templateUrl: './prospects-settings.component.html',
  styleUrls: ['./prospects-settings.component.css']
})
export class ProspectsSettingsComponent implements OnInit {
  isUnsaved: Boolean = false;
  loggedInAs: String = '';
  prospectsSetting = {
    name: 'forprospects',
    hideOnEmail: false,
    hideOnFirstName: false,
    hideOnLastName: false,
    hideOnPhone: false,
    hideOnFullAddress: false,
    hideOnBusinessName: false,
    showLeadSourceOnTable: false
  }
  currentStateSettings = {
    name: 'forprospects',
    hideOnEmail: false,
    hideOnFirstName: false,
    hideOnLastName: false,
    hideOnPhone: false,
    hideOnFullAddress: false,
    hideOnBusinessName: false,
    showLeadSourceOnTable: false
  }
  companyDataSubscription: Subscription;
  companyData;
  companyLoaded: boolean;
  settingsLoaded: boolean;
  constructor(
    private agentService: AgentService,
    private userSerice: UserService,
    private alertService: AlertControllerService,
    private companyService: CompanyService,
    private router: Router
  ) {
    if (this.router.url.includes('settings/user/prospects')) {
      this.loggedInAs = 'user';
    }
    if (this.router.url.includes('settings/agents/prospects')) {
      this.loggedInAs = 'agents';
    }
  }

  ngOnInit() {
    this.getCurrentSetting();
    this.companyDataSubscription = this.companyService.companyData.subscribe(data => {
      if (!data) return;
      this.companyData = data;
      this.currentStateSettings.showLeadSourceOnTable = this.companyData.showLeadSourceOnTable;
    })
  }

  ngOnDestroy() {
    this.companyDataSubscription.unsubscribe();
  }

  isUnsavedData() {
    let changed = false;
    for (var key in this.currentStateSettings) {
      if (this.currentStateSettings.hasOwnProperty(key)) {
        for (var obj in this.prospectsSetting) {
          if (this.prospectsSetting.hasOwnProperty(obj)) {
            if (key === obj) {
              if (this.currentStateSettings[key] !== this.prospectsSetting[obj]) {
                changed = true;
                break;
              }
            }
          }
        }
        if (changed) {
          break;
        }
      }
    }
    if (changed) {
      this.isUnsaved = true;
    } else {
      this.isUnsaved = false;
    }
  }

  getCurrentSetting() {
    if (this.loggedInAs && this.loggedInAs === 'agents') {
      this.agentService.get().subscribe((res: any) => {
        this.setCurrentSetting(res);
      }, error => {
        this.alertService.serverError(error.error.errorType, error.error.data);
      });
    } else if (this.loggedInAs && this.loggedInAs === 'user') {
      this.userSerice.get().subscribe((res: any) => {
        this.setCurrentSetting(res);
      }, error => {
        this.alertService.serverError(error.error.errorType, error.error.data);
      });
    }
  }

  updateProspectsSettings() {
    this.companyData.showLeadSourceOnTable = this.prospectsSetting.showLeadSourceOnTable;
    this.companyLoaded = false;
    this.companyService.patch(this.companyData)
      .subscribe(() => {
        this.currentStateSettings.showLeadSourceOnTable = this.prospectsSetting.showLeadSourceOnTable
        this.showAlert('companyLoaded', null);
      }, error => {
        this.showAlert('companyLoaded', error);
      });
    const prospectsSetting = Object.assign({}, this.prospectsSetting);
    delete prospectsSetting.showLeadSourceOnTable;
    const data = { settings: prospectsSetting };
    this.settingsLoaded = false;
    if (this.loggedInAs && this.loggedInAs === 'agents') {
      this.agentService.updateClientSetting(data).subscribe((res: any) => {
        this.setCurrentSetting(res);
        this.showAlert('settingsLoaded', null);
      }, error => {
        this.showAlert('settingsLoaded', error);
      });
    } else if (this.loggedInAs && this.loggedInAs === 'user') {
      this.userSerice.updateSetting(data).subscribe((res: any) => {
        this.setCurrentSetting(res);
        this.showAlert('settingsLoaded', null);
      }, error => {
        this.showAlert('settingsLoaded', error);
      });
    }
  }

  showAlert(key, error) {
    // Sets companyLoaded and settingsLoaded on getting response
    this[key] = !error ? true : false;
    if(error) {
      this.alertService.serverError(error.error.errorType, error.error.data);
      return;
    }
    if(this.companyLoaded && this.settingsLoaded) this.alertService.success('Settings Updated Successfully');
  }

  setCurrentSetting(res: any) {
    if (res && res.obj && res.obj.settings) {
      this.currentStateSettings = {...this.currentStateSettings, ...res.obj.settings};
      this.resetInputs();
    }
  }

  resetInputs() {
    this.prospectsSetting = JSON.parse(JSON.stringify(this.currentStateSettings));
    this.isUnsaved = false;
  }

  toggleNewFormBuilder(type: string) {
    if (!this.companyData.features) {
      this.companyData.features = {};
    }
    if (type === 'show') {
      this.companyData.features['formBuilder'] = true;
    } else if (type === 'hide') {
      delete this.companyData.features['formBuilder'];
    }
    this.companyService.patch(this.companyData)
      .subscribe(() => {
        window.location.reload();
      }, error => {
      });
  }

  hasNewFormBuilder() {
    return this.companyData.features && this.companyData.features['formBuilder'];
  }

  styleButton(type: string) {
    if (type === 'show' && this.hasNewFormBuilder()) {
      return { 'background': '#7c7fff', 'color': 'white' }
    } else if (type === 'hide' && !this.hasNewFormBuilder()) {
      return { 'background': '#7c7fff', 'color': 'white' }
    }
  }

}
