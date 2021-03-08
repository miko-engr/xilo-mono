import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { CompanyService } from '../../../services/company.service';
import { fields as ezAutoFields } from '../../../utils/validation/ezlynx/auto-fields';
import { fields as ezHomeFields } from '../../../utils/validation/ezlynx/home-fields';
import { Transformation } from '../../../models/transformation.model';
import { Integration } from '../../../models/integration.model';
import { EZLynxService } from '../../../services/ezlynx.service';

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
    selector: 'app-transform-response-dialog',
    templateUrl: './transform-response-dialog.component.html',
    styleUrls: ['./transform-response-dialog.component.css'],
  })
  export class TransformReponseDialogComponent implements OnInit {
    keysRetrieved = false;
    transformation: Transformation;
    integration: Integration;
    rKeys;
    viewEZOptions = false;
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

    conditionOperators = [
      { title: 'Equals', sign: '=' },
      { title: 'Does Not Equal', sign: '!=' },
      { title: 'Is Greater Than', sign: '>' },
      { title: 'Is Less Than', sign: '<' },
      { title: 'Contains', sign: '+' },
      { title: 'Does Not Contain', sign: '!+' },
      { title: 'Is Empty', sign: '!' },
      { title: 'Is Not Empty', sign: '!!' },
    ]

    ezAutoGroup = ezAutoFields;
    ezHomeGroup = ezHomeFields;
    searchValue = '';
    searchConditionValue = '';
    ezKeyGroup = null;
    ezKeyGroupOptions = [];

    constructor(
        private companyService: CompanyService,
        private ezlynxService: EZLynxService,
        private logService: LogService,
        public dialogRef: MatDialogRef<TransformReponseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.getKeys();
      this.transformation = this.data.transformation;
      this.integration = this.data.integration;
      // this.transformation.conditionKey = this.integration.xiloKey;
      // this.transformation.conditionObject = this.integration.xiloObject;
      this.ezKeyGroup = this.returnEZKeyGroup(this.integration.element);
      console.log(this.ezKeyGroup);
      if (this.ezKeyGroup !== {}) {
        this.returnEZKeyGroupOptions();
      }
    }

    setFields(event: any) {
      this.searchValue = '';
      this.transformation.valueKey = event.option.value.key;
      this.transformation.valueObject = event.option.value.type;
    }

    setConditionFields(event: any) {
      this.searchConditionValue = '';
      this.transformation.conditionKey = event.option.value.key;
      this.transformation.conditionObject = event.option.value.type;
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
      } catch(error) {
          this.logService.console(error, false);
      }
  }

  displayFn(obj?: any): string | undefined {
    return obj ? obj.label : undefined;
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
      } else if (key) {
        return key;
      } else {
        return null;
      }
    }

    returnEZLabel(key: string) {
      if (this.integration.vendorName === 'EZLYNX') {
        const objects = this[`ez${this.integration.parentGroup}Group`].filter(gr => gr.type === this.integration.group);
        if (objects && objects.length > 0) {
          const item = objects[0].keys.filter(rKey => rKey.key === key);
          if (item[0]) {
            return item[0].label;
          } else if (key) {
            return key;
          } else {
            return 'field'
          }
        } else {
          return 'field';
        }
      } else {
        return key;
      }
    }

    returnEZKeyGroup(key: string) {
      if (this.integration.vendorName === 'EZLYNX') {
        const objects = this[`ez${this.integration.parentGroup}Group`].filter(gr => gr.type === this.integration.group);
        if (objects && objects.length > 0) {
          const item = objects[0].keys.filter(rKey => rKey.key === key);
          if (item[0]) {
            return item[0];
          } else {
            return {};
          }
        } else {
          return {};
        }
      } else {
        return { fieldType: 'text' };
      }
    }

    returnEZKeyGroupOptions() {
      if (this.ezKeyGroup.fieldType === 'select') {
        if (this.ezKeyGroup.options) {
          this.ezKeyGroupOptions = this.ezKeyGroup.options;
          return this.ezKeyGroup.options;
        } else {
          let field = this.ezKeyGroup.fieldKey ? this.ezKeyGroup.fieldKey : `${this.ezKeyGroup.key}Type`;
          if (field.includes('.')) {
            const fieldArray = field.split('.');
            if (fieldArray && fieldArray.length) {
              field = `${fieldArray[fieldArray.length - 1]}Type`;
            }
          }
          this.ezlynxService.getFieldOptions(this.integration.parentGroup, field)
          .subscribe(ezOptions => {
            if (ezOptions && ezOptions.enum) {
              this.ezKeyGroupOptions = ezOptions.enum;
              if (!this.transformation.newValue) {
                this.viewEZOptions = true;
              }
              return ezOptions.enum;
            }
          }, error => {
            this.logService.console(error, true);
          });
        }
      }
    }

    isMultiple(obj: string) {
      return ['drivers', 'vehicles', 'incidents'].includes(obj);
    }

    removeTransformation() {
      if (confirm('Are you sure you want to delete this?')) {
        this.dialogRef.close('delete');
      }
    }

    saveSettings() {
      if (confirm('Are you sure you want to save these changes?')) {
        this.dialogRef.close(this.transformation);
      }
    }

  }
