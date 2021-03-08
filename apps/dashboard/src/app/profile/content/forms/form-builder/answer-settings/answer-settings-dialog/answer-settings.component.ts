import { Component, OnInit, HostListener, Input } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer.service';
import { LogService } from '../../../../../../services/log.service';
import { CompanyService } from '../../../../../../services/company.service';
import { Answer } from '../../../../../../models/answer.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Integration } from '../../../../../../models/integration.model';
import { IntegrationService } from '../../../../../../services/integration.service';
import { fields as ezAutoFields } from '../../../../../../utils/validation/ezlynx/auto-fields';
import { fields as ezHomeFields } from '../../../../../../utils/validation/ezlynx/home-fields';
import { fields as qqFields } from '../../../../../../utils/validation/qq/fields';
import { TransformReponseDialogComponent } from '../../../../../../shared/dialogs/transform-response-dialog/transform-response-dialog.component';
import { Transformation } from '../../../../../../models/transformation.model';
import { MatDialog } from '@angular/material/dialog';
import { EZLynxService } from '../../../../../../services/ezlynx.service';
import { OptionGroup } from '../../../../../../models/option-group.model';
import { PLRaterService } from '../../../../../../services/pl-rater.service';
import { group as HawksoftSchemaGroup } from '@xilo-mono/integration-contracts';

export interface Key {
  key: string;
  label: string;
  processLevel?: string;
  subLevel?: string;
  al3Length?: string;
  parentProcessLevel?: string;
  iterative?: boolean;
  required?: boolean;
  sequence?: number;
  start?: string;
  fieldKey?;
  parentIndex?;
  lob?;
  al3Start?;
  classType?;
  dataType?;
  al3GroupLength?;
  parentGroup?;
  al3GroupName?;
  referenceId?;
}

export interface KeyGroup {
  type: string;
  keys: Key[];
}


@Component({
    selector: 'app-answer-settings',
    templateUrl: './answer-settings.component.html',
    styleUrls: ['./answer-settings.component.css'],
  })
  export class AnswerSettingsComponent implements OnInit {
    @Input() companyId;
    @Input() company;
    @Input() formId;
    @Input() integrations;
    @Input() answer;
    @Input() form;
    keysRetrieved = false;
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
    parentGroupKeys = [];
    section = 'integrations';

    ezAutoGroup = ezAutoFields;
    ezHomeGroup = ezHomeFields;
    qqFields = qqFields;

    plAutoGroupsRetrieved = false;
    plHomeGroupsRetrieved = false;

    plAutoGroup = [];
    plHomeGroup = [];

    showAdvancedSettings = false;
    overwriteSettings = false;
    setLabeledSelect = false;

    searchValue = '';
    integrationSearchValue = '';

    editIndex;
    options = null;
    selectedOptionIndex = null;
    newOption = null;
    newOptionGroup: OptionGroup = {
      label: null,
      value: null
    };
    selectedIntegrations = [];
    selectedIntegration = null;
    dateOptions = [{name: '--- Select option --- ', value: null}, {name: 'Days', value: 'day'}, {name: 'Weeks', value: 'week'}, {name: 'Months', value: 'month'}, {name: 'Years', value: 'year'}]

    fieldTypes = ['isInput', 'isSelect', 'isTextarea', 'isDatePicker', 'isButton', 'isVehicleVIN',
                  'isVehicleYear', 'isVehicleMakeModel', 'isAddressSearch', 'isConditional', 'isSpacer',
                  'isText', 'isVehicleMake', 'isVehicleModel', 'isVehicleBodyStyle', 'isSecureDocumentUpload',
                  'isMultipleSelect', 'isHiddenInput', 'isCard', 'isIndustry', 'isOccupation', 'isPasswordInput'];

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        if (this.newOptionGroup.value || this.newOption || this.selectedOptionIndex) {
          if (this.answer.hasLabeledSelectOptions) {
            this.addOption(this.selectedOptionIndex ? null : this.newOptionGroup, this.answer);
          } else {
            this.addOption(this.selectedOptionIndex ? null : this.newOption, this.answer);
          }
        }
      }
    }

    constructor(
        private answerService: AnswerService,
        private companyService: CompanyService,
        private ezlynxService: EZLynxService,
        private integrationService: IntegrationService,
        private logService: LogService,
        private plRaterService: PLRaterService,
        public dialog: MatDialog,
    ) {}

    ngOnInit() {
      this.getKeys();
      if (!this.company.hasV2Integrations) {
        this.changeSection('settings');
      }
    }

    changeSection(newType: string) {
      this.section = newType;
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
        this.editIndex = (this.answer.integrations.length - 1);
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

    setIntegrationAssociations(index: any) {
      this.answer.integrations[index].xiloObject = this.answer.objectName;
      this.answer.integrations[index].xiloKey = this.answer.propertyKey;
      this.answer.integrations[index].formIntegrationId = this.formId;
      this.answer.integrations[index].answerIntegrationId = +this.answer.id;
    }

    setIntegrationFields(event: any, index: any) {
      const kg = event.option.value;
      if (this.overwriteSettings) {
        this.setAnswerProperties(kg, index, this.answer.integrations[index]);
      }
      if (this.answer.integrations[index].vendorName === 'HAWKSOFT') {
        this.answer.integrations[index].referenceId = kg.key;
        this.answer.integrations[index].element = kg.label;
        this.answer.integrations[index].parentGroup = kg.type;
      } else {
        this.answer.integrations[index].element = kg.key;
        this.answer.integrations[index].group = kg.type;
        this.answer.integrations[index].subLevel = kg.subLevel;
        this.answer.integrations[index].processLevel = kg.processLevel;
        this.answer.integrations[index].arrayKey = kg.fieldKey;
        if (this.answer.integrations[index].vendorName === 'PLRATER') {
          this.answer.integrations[index].element = kg.label;
          this.answer.integrations[index].group = kg.group;
          this.answer.integrations[index].al3Length = kg.al3Length;
          this.answer.integrations[index].parentIndex = kg.parentIndex;
          this.answer.integrations[index].parentProcessLevel = kg.parentProcessLevel;
          this.answer.integrations[index].iterative = kg.iterative;
          this.answer.integrations[index].required = kg.required;
          this.answer.integrations[index].sequence = kg.sequence;
          this.answer.integrations[index].lob = kg.lob;
          this.answer.integrations[index].al3Start = kg.al3Start;
          this.answer.integrations[index].classType = kg.classType;
          this.answer.integrations[index].dataType = kg.dataType;
          this.answer.integrations[index].parentGroup = kg.parentGroup;
          this.answer.integrations[index].al3GroupLength = kg.al3GroupLength;
          this.answer.integrations[index].al3GroupName = kg.type;
          this.answer.integrations[index].referenceId = kg.referenceId;
          this.answer.integrations[index].isChild = kg.isChild;
        }
      }
      this.answer.integrations[index].xiloObject = this.answer.objectName;
      this.answer.integrations[index].xiloKey = this.answer.propertyKey;
      this.answer.integrations[index].formIntegrationId = this.formId;
      this.answer.integrations[index].answerIntegrationId = +this.answer.id;
      this.integrationSearchValue = '';
    }

    saveIntegration(index: any) {
      this.editIndex = null;
      this.updateIntegration(this.answer.integrations[index], index);
    }

    returnLobOptionValue(vendor: string, type: string) {
      if (vendor === 'PLRATER') {
        return type === 'Auto' ? 'AUTOP' : 'HOMEP';
      }
      return type;
    }

    setAnswerProperties(kGroup: any, index: any, int: Integration) {
      if (kGroup.xiloKey) {
        this.answer.propertyKey = kGroup.xiloKey;
      }
      if (kGroup.xiloObject) {
        this.answer.objectName = kGroup.xiloObject;
      }
      if (kGroup.index) {
        this.answer.integrations[index].index = kGroup.index;
      }
      if (kGroup.fieldType) {
        this.setFieldType(kGroup, kGroup.fieldType, int);
      }
      if (kGroup.required) {
        this.answer.isRequired = true;
      }
      if (kGroup.label) {
        this.setFieldPlaceholder(kGroup, kGroup.fieldType);
      }
      this.answer.width = '45';
      this.answer.style = 'standard';
    }

    duplicateIntegration(integration: Integration) {
      const duplicate = this.createCopy(integration);
      delete duplicate.id;
      this.answer.integrations.push(duplicate);
      this.updateIntegration(duplicate, (this.answer.integrations.length - 1));
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    removeIntegration(index: any) {
      this.integrationService.removeIntegration(this.answer.integrations[index].id)
      .subscribe(data => {
        this.answer.integrations.splice(index, 1);
      }, error => {
        this.logService.console(error, true);
      });
    }

    displayFn(obj?: any): string | undefined {
      return obj ? obj.label : undefined;
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
      this.options = await this.answerService.getAnswerOptions(this.companyId, object, key);
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
          this.keyGroups[9].keys = Object.keys(this.rKeys['recreationalVehicles']).map(key => ({ key: key, label: this.rKeys['recreationalVehicles'][key] }));
          this.keyGroups[8].keys = Object.keys(this.rKeys['incidents']).map(key => ({ key: key, label: this.rKeys['incidents'][key] }));
          this.keysRetrieved = true;
      } catch (error) {
          this.logService.console(error, false);
      }
  }

  async getParentGroupKeys(int: Integration, lob:string) {
    if (int.vendorName === 'EZLYNX') {
      if (lob === 'Auto') {
        this.parentGroupKeys = this.ezAutoGroup;
      } else if (lob === 'Home') {
        this.parentGroupKeys = this.ezHomeGroup;
      }
    } else if (int.vendorName === 'PLRATER') {
      if (lob === 'AUTOP') {
        this.parentGroupKeys = this.getPLRaterGroups('Auto');
      } else if (lob === 'HOMEP') {
        this.parentGroupKeys = this.getPLRaterGroups('Home');
      }
    } else if (int.vendorName === 'HAWKSOFT') {
      if (lob === 'Auto') {
        this.parentGroupKeys = await HawksoftSchemaGroup('auto');
      } else if (lob === 'Home') {
        this.parentGroupKeys = await HawksoftSchemaGroup('home');
      } else if (lob === 'Commercial') {
        this.parentGroupKeys = await HawksoftSchemaGroup('commercial');
      }
    }
  }

  getPLRaterGroups(type: string) {
    if (type === 'Auto') {
      if (!this.plAutoGroupsRetrieved) {
        this.plAutoGroupsRetrieved = true;
        this.plRaterService.getAL3Groups(type)
        .subscribe(data => {
          this.plAutoGroup = data;
          return this.plAutoGroup;
        }, error => {
          this.logService.console(error, true);
        });
      } else {
        return this.plAutoGroup;
      }
    } else if (type === 'Home') {
      if (!this.plHomeGroupsRetrieved) {
        this.plHomeGroupsRetrieved = true;
        this.plRaterService.getAL3Groups(type)
        .subscribe(data => {
          this.plHomeGroup = data;
          return this.plHomeGroup;
        }, error => {
          this.logService.console(error, true);
        });
      } else {
        return this.plHomeGroup;
      }
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
          return this.keyGroups[8].keys;
        }  else if (obj === 'recreationalVehicles') {
          return this.keyGroups[9].keys;
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

    isSimpleIntegration(vendor: string) {
      return ['QQ'].includes(vendor);
    }

    returnEZLabel(integration: Integration, key: string) {
      if (integration.vendorName === 'EZLYNX') {
        const objects = integration.parentGroup ?
          this[`ez${integration.parentGroup}Group`].filter(gr => gr.type === integration.group) : null;
        if (objects && objects.length > 0) {
          const item = objects[0].keys.filter(rKey => rKey.key === key);
          if (item[0]) {
            return item[0].label;
          } else if (key) {
            return key;
          } else {
            return 'field';
          }
        } else {
          return 'field';
        }
      } else {
        return key;
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
        if (answer.propertyKey === 'addMultiple') {
          return 'addMultiple';
        } else if (answer.isInput) {
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
        } else if (answer.hasLabeledSelectOptions) {
          return 'hasLabeledSelectOptions';
        } else if (answer.isScale) {
          return 'isScale';
        } else if (answer.isPhone) {
          return 'isPhone';
        } else if (answer.hasEducationalDropdown) {
          return 'hasEducationalDropdown';
        } else if (answer.isHiddenInput) {
          return 'isHiddenInput';
        } else if (answer.isURL) {
          return 'isURL';
        }
    }

    returnOptions(answer: Answer) {
      if (answer.isInput) {
        return ['propertyAssignment', 'showAdvancedSettings', 'validationType', 'defaultValue', 'placeholderText', 'isRequired'];
      } else if (answer.isDatePicker) {
        return ['propertyAssignment', 'defaultValue', 'placeholderText', 'isRequired'];
      } else if (answer.isSelect) {
        return ['propertyAssignment', 'showAdvancedSettings', 'defaultValue', 'isSelect', 'isRequired', 'placeholderText'];
      } else if (answer.isAutocomplete) {
        return ['propertyAssignment', 'placeholderText'];
      } else if (answer.isTextarea) {
        return ['propertyAssignment', 'defaultValue', 'secondaryPlaceholderText', 'isRequired'];
      } else if (answer.isButton) {
        return ['propertyAssignment', 'hasInformationIcon', 'defaultValue', 'displayValue', 'propertyValue'];
      } else if (answer.isCard) {
        return ['propertyAssignment', 'hasInformationIcon', 'defaultValue', 'headerText', 'placeholderText', 'propertyValue'];
      } else if (answer.isSecureDocumentUpload) {
        return ['placeholderText'];
      } else if (answer.isAddDriver) {
        return ['displayValue'];
      } else if (answer.isAddVehicle) {
        return ['displayValue'];
      } else if (answer.isAddLocation) {
        return ['displayValue'];
      } else if (answer.isAddHome) {
        return ['displayValue'];
      } else if (answer.isAddIncident) {
        return ['displayValue'];
      } else if (answer.isAddRecreationalVehicle) {
        return ['displayValue'];
      } else if (answer.isAddPolicy) {
        return ['displayValue'];
      } else if (answer.isSpacer) {
        return 'isSpacer';
      } else if (answer.isText) {
        return ['placeholderText'];
      } else if (answer.isCheckbox) {
        return ['propertyAssignment', 'defaultValue', 'placeholderText', 'propertyValue'];
      } else if (answer.hasLabeledSelectOptions) {
        return ['propertyAssignment', 'defaultValue', 'placeholderText', 'isRequired'];
      } else if (answer.isScale) {
        return ['propertyAssignment', 'defaultValue', 'isRequired'];
      } else if (answer.isPhone) {
        return ['propertyAssignment', 'defaultValue', 'placeholderText', 'isRequired'];
      } else if (answer.hasEducationalDropdown) {
        return ['hasEducationalDropdown', 'isRequired'];
      } else if (answer.isHiddenInput) {
        return ['defaultValue'];
      } else if(answer.isURL) {
        return ['propertyAssignment', 'defaultValue', 'placeholderText'];
      } else {
        return [];
      }
  }

    setFieldType(kGroup: any, fieldType: string, int: Integration) {
        this.resetFields();
        if (fieldType === 'text') {
          this.answer.isInput = true;
        } else if (fieldType === 'date') {
          this.answer.isDatePicker = true;
          this.answer.startDate = kGroup.startDate;
        } else if (fieldType === 'select') {
          this.answer.isSelect = true;
          if (kGroup.options) {
            this.answer.options = kGroup.options;
          } else {
            let field = kGroup.fieldKey ? kGroup.fieldKey : `${kGroup.key}Type`;
            if (field.includes('.')) {
              const fieldArray = field.split('.');
              if (fieldArray && fieldArray.length) {
                field = `${fieldArray[fieldArray.length - 1]}Type`;
              }
            }
            this.ezlynxService.getFieldOptions(int.parentGroup, field)
            .subscribe(ezOptions => {
              if (ezOptions && ezOptions.enum) {
                this.answer.options = ezOptions.enum;
              }
            }, error => {
              this.logService.console(error, true);
            });
          }
        } else if (fieldType.includes('selectassignment')) {
          this.answer.isSelect = true;
          this.answer.isSelectObject = true;
          if (fieldType.includes('vehicles')) {
            this.answer.selectObjectName = 'vehicles';
          } else if (fieldType.includes('drivers')) {
            this.answer.selectObjectName = 'drivers';
          } else if (fieldType.includes('agents')) {
            this.answer.selectObjectName = 'agents';
          }
        } else if (fieldType === 'number') {
          this.answer.isInput = true;
          this.answer.validationType = 'number';
        } else if (fieldType === 'occupation') {
          this.answer.isSelect = true;
          this.answer.isOccupation = true;
        } else if (fieldType === 'industry') {
          this.answer.isSelect = true;
          this.answer.isIndustry = true;
        } else if (fieldType === 'password') {
          this.answer.isInput = true;
          this.answer.isPasswordInput = true;
        } else if (fieldType === 'email') {
          this.answer.isInput = true;
          this.answer.validation = 'email';
        } else if (fieldType === 'address') {
          this.answer.isInput = true;
          this.answer.isAddressSearch = true;
        }
        if (kGroup.events) {
          this.setFieldEvents(kGroup.events);
        }
    }

    setFieldPlaceholder(kGroup: any, fieldType: string) {
        if (fieldType === 'text' && !this.answer.placeholderText) {
          this.answer.placeholderText = kGroup.label;
        } if (fieldType === 'textarea' && !this.answer.secondaryPlaceholderText) {
          this.answer.secondaryPlaceholderText = kGroup.label;
        }
    }

    setFieldEvents(events: any) {
      for (const event of events) {
        this.answer[event] = true;
      }
    }

    resetFields() {
      for (const field of this.fieldTypes) {
        this.answer[field] = false;
      }
    }

    addOption(option: any, answer: Answer, addMultiple?: boolean, addToTop?: boolean) {
      if (option === null) {
        this.selectedOptionIndex = null;
        this.newOption = null;
        this.newOptionGroup.label = null;
        this.newOptionGroup.value = null;
      } else {
        if (answer.hasLabeledSelectOptions) {
          if (!(answer.labeledSelectOptions && answer.labeledSelectOptions.length > 0)) {
            answer['labeledSelectOptions'] = [];
          }
          const aOptGr = this.createCopy(option);
          if (addToTop) {
            answer.labeledSelectOptions.unshift(aOptGr);
          } else {
            answer.labeledSelectOptions.push(aOptGr);
          }
          this.newOptionGroup.label = null;
          this.newOptionGroup.value = null;
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
    }

    moveItemInArray(increase) {
      const max = this.answer.labeledSelectOptions.length;
      const toIndex = (+this.selectedOptionIndex + +increase);
      if ((toIndex > max) || (toIndex < 0)) {
        this.logService.warn('You cannot move the option any further');
      } else {
          const element = this.answer.labeledSelectOptions[+this.selectedOptionIndex];
          this.answer.labeledSelectOptions.splice(+this.selectedOptionIndex, 1);
          this.answer.labeledSelectOptions.splice(toIndex, 0, element);
          this.selectedOptionIndex = toIndex;
      }
    }

    moveOption(answer, increase, type: string) {
      const max = type === 'labeledSelect' ? answer.labeledSelectOptions.length : answer.options.length;
      if ((+this.selectedOptionIndex + +increase > max) || (+this.selectedOptionIndex + +increase < 0)) {
        this.logService.warn('You cannot move the option any further');
      } else {
        if (type === 'labeledSelect') {
          moveItemInArray(this.answer.labeledSelectOptions, +this.selectedOptionIndex, +this.selectedOptionIndex + increase);
          this.selectedOptionIndex = +this.selectedOptionIndex + +increase;
        } else {
          moveItemInArray(answer.options, this.selectedOptionIndex, +this.selectedOptionIndex + increase);
          this.selectedOptionIndex = +this.selectedOptionIndex + +increase;
        }
      }
    }

    deleteOption(answer, type: string) {
      if (type === 'labeledSelect') {
        answer.labeledSelectOptions.splice(+this.selectedOptionIndex, 1);
      } else {
        answer.options.splice(+this.selectedOptionIndex, 1);
      }
      this.selectedOptionIndex = null;
      this.newOption = null;
    }

    migrateOptionsToLabeledSelect() {
      if (!this.answer.labeledSelectOptions || !this.answer.labeledSelectOptions.length || this.answer.labeledSelectOptions.length === 0) {
        this.answer.labeledSelectOptions = this.answer.options.map(opt => {
          return { label: opt, value: opt };
        });
      }
    }

    deleteAllOptions(answer: Answer) {
      if (confirm('Are you sure you want to delete all options?')) {
        answer.options = [];
        answer.labeledSelectOptions = [];
        this.selectedOptionIndex =  null;
        this.newOption = null;
      }
    }

    setType(event: any) {
      if (event === 'addMultiple') {
        this.answer[this.returnType(this.answer)] = false;
        this.answer.propertyKey = 'addMultiple';
      } else {
        this.answer[this.returnType(this.answer)] = false;
        this.answer[event] = true;
      }
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

    async saveSettings() {
      if (confirm('Are you sure you want to save these changes?')) {
        await this.answerService.patchAsync(this.answer);
        this.logService.success('Field updated successfully');
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

    sectionIsActive(sect: string) {
      if (sect === this.section) {
        return 'active-title';
      }
    }

    async openFieldTransformationDialog(integration: Integration) {
      if (!integration.transformation) {
        integration.transformation = new Transformation();
      }
      const dialogRef = this.dialog.open(TransformReponseDialogComponent, {
          width: '60rem',
          panelClass: 'dialog',
          data: {transformation: integration.transformation, integration: integration}
      });

      dialogRef.afterClosed().subscribe(async(result) => {
          if (result || result === 'delete') {
              integration.transformation = result === 'delete' ? null : result;
              this.integrationService.updateIntegration(integration)
              .subscribe(data => {
                this.logService.success('Transformation updated successfully');
              }, error => {
                this.logService.console(error, true);
              });
          }
      });
    }

  }
