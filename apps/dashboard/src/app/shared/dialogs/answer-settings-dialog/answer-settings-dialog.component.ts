import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { AnswerService } from '../../../services/answer.service';
import { LogService } from '../../../services/log.service';
import { CompanyService } from '../../../services/company.service';
import { Answer } from '../../../models/answer.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Integration } from '../../../models/integration.model';
import { IntegrationService } from '../../../services/integration.service';
import { fields as ezAutoFields } from '../../../utils/validation/ezlynx/auto-fields';

export interface Key {
  key: string;
  label: string;
  processLevel?: string;
  subLevel?: string;
}

export interface KeyGroup {
  type: string;
  keys: Key[];
}


@Component({
    selector: 'app-answer-settings-dialog',
    templateUrl: './answer-settings-dialog.component.html',
    styleUrls: ['./answer-settings-dialog.component.css'],
  })
  export class AnswerSettingsDialogComponent implements OnInit {
    keysRetrieved = false;
    answer: Answer;
    rKeys;
    keyGroups: KeyGroup[] = [
      { type: 'client', keys: [] },
      { type: 'drivers', keys: [] },
      { type: 'vehicles', keys: [] },
      { type: 'homes', keys: [] },
      { type: 'business', keys: [] },
      { type: 'company', keys: [] },
      { type: 'locations', keys: [] },
      { type: 'policies', keys: [] },
      { type: 'incidents', keys: [] },
      { type: 'recreationalVehicles', keys: [] },
    ];

    ezAutoGroup = ezAutoFields;

    showAdvancedSettings = false;

    searchValue = '';
    integrationSearchValue = '';

    options = null;
    selectedOptionIndex = null;
    newOption = null;
    selectedIntegrations = [];
    selectedIntegration = null;

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        if (this.newOption || this.selectedOptionIndex) {
          this.addOption(this.selectedOptionIndex ? null : this.newOption, this.answer);
        }
      }
    }

    constructor(
        private answerService: AnswerService,
        private companyService: CompanyService,
        private integrationService: IntegrationService,
        private logService: LogService,
        public dialogRef: MatDialogRef<AnswerSettingsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.getKeys();
      this.answer = this.data.answer;
      this.filterIntegrations();
    }

    filterIntegrations() {
      if (this.answer.integrations) {
        this.answer.integrations = this.answer.integrations.map(int => {
          return int.formIntegrationId === this.data.form.id && int;
        });
        console.log(this.answer.integrations)
      }
    }

    setIntegrations(newIntegration) {
      if (newIntegration) {
        const newInt = new Integration();
        newInt.vendorName = newIntegration;
        if (!this.answer.integrations) {
          this.answer.integrations = [];
        }
        this.answer.integrations.push(newInt);
        this.selectedIntegration = null;
      }
    }

    setIntegrationLevels(group: string, index: any) {
      if (group === 'Applicant') {
        this.answer.integrations[index].processLevel = '1';
      } else if (group === 'PriorPolicyInfo') {
        this.answer.integrations[index].processLevel = '2';
      } else if (group === 'PolicyInfo') {
        this.answer.integrations[index].processLevel = '3';
      } else if (group === 'Drivers') {
        this.answer.integrations[index].processLevel = '4';
      } else if (group === 'Vehicles') {
        this.answer.integrations[index].processLevel = '5';
      } else if (group === 'VehiclesUse') {
        this.answer.integrations[index].processLevel = '6';
      } else if (group === 'Coverages') {
        this.answer.integrations[index].processLevel = '7';
      }
    }

    setIntegrationFields(event: any, index: any) {
      this.answer.integrations[index].element = event.option.value.key;
      this.answer.integrations[index].group = event.option.value.type;
      this.answer.integrations[index].subLevel = event.option.value.subLevel;
      this.answer.integrations[index].processLevel = event.option.value.processLevel;
      this.answer.integrations[index].xiloObject = this.answer.objectName;
      this.answer.integrations[index].xiloKey = this.answer.propertyKey;
      this.answer.integrations[index].value = this.answer.defaultValue;
      this.answer.integrations[index].formIntegrationId = this.data.form.id;
      this.answer.integrations[index].answerIntegrationId = +this.answer.id;
      this.integrationSearchValue = '';
      this.updateIntegration(this.answer.integrations[index], index);
    }

    removeIntegration(index: any) {
      this.integrationService.removeIntegration(this.answer.integrations[index].id)
      .subscribe(data => {
        this.answer.integrations.splice(index, 1);
      }, error => {
        this.logService.console(error, true);
      });
    }

    setFields(event: any) {
      this.searchValue = '';
      this.answer.propertyKey = event.option.value.key;
      this.answer.objectName = event.option.value.type;
      if (this.answer.propertyKey === 'fullAddress') {
        this.answer.isAddressSearch = true;
        if (this.answer.objectName === 'homes') {
          this.answer.getHomeData = true;
        }
      } else if (this.answer.propertyKey === 'phone' && this.answer.objectName === 'client') {
        this.answer.fireNewLead = true;
      }
    }

    async getAnswerOptions(key: string, object: string) {
      this.options = await this.answerService.getAnswerOptions(this.data.companyId, object, key);
    }

    async getKeys() {
      try {
          this.rKeys = await this.companyService.getKeysAsync('all', 'all');
          this.keyGroups[0].keys = Object.keys(this.rKeys['client']).map(key => ({ key: key, label: this.rKeys['client'][key] }));
          this.keyGroups[1].keys = Object.keys(this.rKeys['drivers']).map(key => ({ key: key, label: this.rKeys['drivers'][key] }));
          this.keyGroups[2].keys = Object.keys(this.rKeys['vehicles']).map(key => ({ key: key, label: this.rKeys['vehicles'][key] }));
          this.keyGroups[3].keys = Object.keys(this.rKeys['homes']).map(key => ({ key: key, label: this.rKeys['homes'][key] }));
          this.keyGroups[4].keys = Object.keys(this.rKeys['business']).map(key => ({ key: key, label: this.rKeys['business'][key] }));
          this.keyGroups[5].keys = Object.keys(this.rKeys['company']).map(key => ({ key: key, label: this.rKeys['company'][key] }));
          this.keyGroups[6].keys = Object.keys(this.rKeys['locations']).map(key => ({ key: key, label: this.rKeys['locations'][key] }));
          this.keyGroups[7].keys = Object.keys(this.rKeys['policies']).map(key => ({ key: key, label: this.rKeys['policies'][key] }));
          this.keyGroups[8].keys = Object.keys(this.rKeys['recreationalVehicles']).map(key => ({ key: key, label: this.rKeys['recreationalVehicles'][key] }));
          this.keyGroups[9].keys = Object.keys(this.rKeys['incidents']).map(key => ({ key: key, label: this.rKeys['incidents'][key] }));
          this.keysRetrieved = true;
      } catch(error) {
          this.logService.console(error, false);
      }
  }

    returnObject(obj: string) {
        if (obj === 'drivers') {
            return this.keyGroups[1].keys;
        } else if (obj === 'vehicles') {
            return this.keyGroups[2].keys;
        } else if (obj === 'homes') {
            return this.keyGroups[3].keys;
        } else if (obj === 'client') {
            return this.keyGroups[0].keys;
        } else if (obj === 'business') {
            return this.keyGroups[4].keys;
        } else if (obj === 'locations') {
            return this.keyGroups[6].keys;
        } else if (obj === 'incidents') {
          return this.keyGroups[9].keys;
        }  else if (obj === 'recreationalVehicles') {
          return this.keyGroups[8].keys;
        } else if (obj === 'policies') {
            return this.keyGroups[7].keys;
        } else {
            return [];
        }
    }

    returnObjectLabel(obj: string) {
        if (obj === 'drivers') {
            return 'Driver';
        } else if (obj === 'vehicles') {
            return 'Vehicle';
        } else if (obj === 'homes') {
            return 'Home';
        } else if (obj === 'client') {
            return 'Client';
        } else if (obj === 'business') {
            return 'Business';
        } else if (obj === 'locations') {
            return 'Location';
        } else if (obj === 'incidents') {
          return 'Incident';
        }  else if (obj === 'recreationalVehicles') {
          return 'Recreational Vehicle';
        } else if (obj === 'policies') {
            return 'Policy';
        } else {
            return [];
        }
    }

    returnLabel(key: string, object: string) {
      const item = this.returnObject(object).filter(rKey => rKey.key === key);
      if (item[0]) {
        return item[0].label;
      } else {
        return key;
      }
    }

    todayIsChecked() {
      return (this.answer && this.answer.startDate === 'today');
    }

    toggleStartDate(event) {
      if (event === true) {
        this.answer.startDate = 'today';
      } else {
        this.answer.startDate = null;
      }
    }

    returnType(answer: Answer) {
        if (answer.isInput) {
          return 'isInput';
        } else if (answer.isDatePicker) {
          return 'isDatePicker';
        } else if (answer.isSelect) {
          return 'isSelect';
        } else if (answer.isAutocomplete) {
          return 'isAutocomplete';
        } else if (answer.isTextarea) {
          return 'isTextarea';
        } else if (answer.isButton) {
          return 'isButton';
        } else if (answer.isCard) {
          return 'isCard';
        } else if (answer.isSecureDocumentUpload) {
          return 'isSecureDocumentUpload';
        } else if (answer.isAddDriver) {
          return 'isAddDriver';
        } else if (answer.isAddVehicle) {
          return 'isAddVehicle';
        } else if (answer.isAddLocation) {
          return 'isAddLocation';
        } else if (answer.isAddHome) {
          return 'isAddHome';
        } else if (answer.isAddIncident) {
          return 'isAddIncident';
        } else if (answer.isAddRecreationalVehicle) {
          return 'isAddReceationalVehicle';
        } else if (answer.isAddPolicy) {
          return 'isAddPolicy';
        } else if (answer.isSpacer) {
          return 'isSpacer';
        } else if (answer.isText) {
          return 'isText';
        } else if (answer.isCheckbox) {
          return 'isCheckbox';
        } else if (answer.isURL) {
          return 'isURL';
        }
    }

    addOption(option: string, answer: Answer, addMultiple?: boolean, addToTop?: boolean) {
      if (option === null) {
        this.selectedOptionIndex = null;
        this.newOption = null;
      } else {
        if (!(answer.options && answer.options.length > 0)) {
          answer['options'] = [];
        }
        if (addMultiple) {
          const newOptions = option.split(',');
          answer.options.push(...newOptions);
        } else if (addToTop) {
          answer.options.unshift(option);
        } else {
          answer.options.push(option);
        }
        this.newOption = null;
      }
    }

    moveOption(answer, increase) {
      const max = answer.options.length;
      if ((+this.selectedOptionIndex + +increase > max) || (+this.selectedOptionIndex + +increase < 0)) {
        this.logService.warn('You cannot move the option any further')
      } else {
        moveItemInArray(answer.options, this.selectedOptionIndex, +this.selectedOptionIndex + increase);
        this.selectedOptionIndex = +this.selectedOptionIndex + +increase;
      }
    }

    deleteOption(answer) {
      answer.options.splice(+this.selectedOptionIndex, 1);
      this.selectedOptionIndex = null;
      this.newOption = null;
    }

    deleteAllOptions(answer: Answer) {
      if (confirm('Are you sure you want to delete all options?')) {
        answer.options = [];
        this.selectedOptionIndex =  null;
        this.newOption = null;
      }
    }

    setType(event: any) {
      this.answer[this.returnType(this.answer)] = false;
      this.answer[event] = true;
    }

    conditionsAreTrue(type: string) {
      if (type === 'addMultiple') {
        return (this.answer.isAddDriver || this.answer.isAddHome || this.answer.isAddLocation ||
                this.answer.isAddVehicle || this.answer.isAddIncident || this.answer.isAddRecreationalVehicle
                || this.answer.isAddPolicy);
      }
    }

    updateIntegration(integration: Integration, index: any) {
      if (integration.id) {
        this.integrationService.updateIntegration(integration)
        .subscribe(data => {
        }, error => {
          this.logService.console(error, true);
        });
      } else {
        this.integrationService.createIntegration(integration)
        .subscribe(id => {
          this.answer.integrations[index].id = id;
        }, error => {
          this.logService.console(error, true);
        });
      }
    }

    isMultiple(obj: string) {
      return ['drivers', 'vehicles', 'incidents'].includes(obj);
    }

    saveSettings() {
      if (confirm('Are you sure you want to save these changes?')) {
        this.dialogRef.close(this.answer);
      }
    }

    hasFilterByState() {
      return (this.answer.filters && (this.answer.filters.length > 0));
    }

    setFilterByState() {
      if (this.hasFilterByState()) {
        this.answer.filters = [];
      } else {
        this.answer.filters = ['state'];
      }
    }

  }
