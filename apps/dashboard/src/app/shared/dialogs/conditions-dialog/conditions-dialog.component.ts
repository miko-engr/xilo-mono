import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AnswerService } from '../../../services/answer.service';
import { LogService } from '../../../services/log.service';
import { CompanyService } from '../../../services/company.service';
import { ConditionService } from '../../../services/condition.service';
import { Condition } from '../../../models/condition.model';

@Component({
    selector: 'app-conditions-dialog',
    templateUrl: './conditions-dialog.component.html',
    styleUrls: ['./conditions-dialog.component.css'],
  })
  export class ConditionsDialogComponent implements OnInit {
    conditions = [];
    operators = [
      { title: 'Equals', sign: '=' },
      { title: 'Does Not Equal', sign: '!=' },
      { title: 'Is Greater Than', sign: '>' },
      { title: 'Is Less Than', sign: '<' },
      { title: 'Contains', sign: '+' },
      { title: 'Does Not Contain', sign: '!+' },
    ];
    clientKeys = [];
    driverKeys = [];
    homeKeys = [];
    businessKeys = [];
    locationKeys = [];
    incidentKeys = [];
    recreationalVehicleKeys = [];
    policyKeys = [];
    vehicleKeys = [];
    keys = [];
    keysRetrieved = false;

    searchValue = '';

    options = null;

    constructor(
        private answerService: AnswerService,
        private companyService: CompanyService,
        private conditionService: ConditionService,
        private logService: LogService,
        public dialogRef: MatDialogRef<ConditionsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.getKeys();
      this.conditions = this.data.conditions || [];
    }

    addCondition() {
      this.conditions.push(
        {
          title: null,
          operator: null,
          key: null,
          object: null,
          value: null
        }
      );
      this.logService.success('Blank condition added successfully');
    }

    async deleteCondition(condition: Condition, i: any) {
      if (confirm('Are you sure you want to remove this condition')) {
        if (condition.id) {
          await this.conditionService.delete(condition);
          this.conditions.splice(i, 1);
          this.logService.success('Condition removed successfully');
        } else {
          this.conditions.splice(i, 1);
          this.logService.success('Condition removed successfully');
        }
      }
    }

    async getAnswerOptions(key: string, object: string) {
      this.options = await this.answerService.getAnswerOptions(this.data.companyId, object, key);
    }

    async getKeys() {
      try {
          this.keys = await this.companyService.getArrayOfKeysAsync();
          this.clientKeys = this.keys.filter(key => key.type === 'client')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.driverKeys = this.keys.filter(key => key.type === 'drivers')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.vehicleKeys = this.keys.filter(key => key.type === 'vehicles')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.businessKeys = this.keys.filter(key => key.type === 'business')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.homeKeys = this.keys.filter(key => key.type === 'homes')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.locationKeys = this.keys.filter(key => key.type === 'locations')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.incidentKeys = this.keys.filter(key => key.type === 'incidents')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.recreationalVehicleKeys = this.keys.filter(key => key.type === 'recreationalVehicles')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.policyKeys = this.keys.filter(key => key.type === 'policies')
          .map(key => ({ key: key['pair']['key'], value: key.pair.value }));
          this.keysRetrieved = true;
      } catch(error) {
          this.logService.console(error, false);
      }
  }

    returnOperatorTitle(op: string) {
      if (op) {
        const operatorIndex = this.operators.findIndex(item => item.sign === op);
        return this.operators[operatorIndex].title;
      } else {
        return '';
      }
    }

    returnObject(obj: string) {
        if (obj === 'drivers') {
            return this.driverKeys;
        } else if (obj === 'vehicles') {
            return this.vehicleKeys;
        } else if (obj === 'homes') {
            return this.homeKeys;
        } else if (obj === 'client') {
            return this.clientKeys;
        }  else if (obj === 'business') {
            return this.businessKeys;
        }  else if (obj === 'locations') {
            return this.locationKeys;
        }  else if (obj === 'incidents') {
          return this.incidentKeys;
        } else if (obj === 'recreationalVehicles') {
            return this.recreationalVehicleKeys;
        } else if (obj === 'policies') {
          return this.policyKeys;
        } else {
            return [];
        }
    }

    reuseLastCondition(condition: Condition) {
      if (condition) {
        delete condition.id;
        this.conditions.push(condition);
      }
    }

    returnLabel(key: string, object: string) {
      const item = this.returnObject(object).filter(rKey => rKey.key === key);
      if (item[0]) {
        return item[0].value;
      } else {
        return key;
      }
    }

    saveConditions() {
      if (confirm('Are you sure you want to save these changes?')) {
        this.dialogRef.close(this.conditions);
      }
    }

  }
