import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { ClientService } from '../../../services/client.service';
import { IValidation } from '../../../models/integration-validation.model';
import { ButtonRendererComponent } from './grid-components/ag-btn-renderer.component';
import { AnswerService } from '../../../services/answer.service';
import { Answer } from '../../../models/answer.model';
import { Client } from '../../../models/client.model';
import { UpdateClientObj } from '../../../models/update-client.model';
import { Company } from '../../../models/company.model';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
    selector: 'app-validation-dialog',
    templateUrl: './validation-dialog.component.html',
    styleUrls: ['./validation-dialog.component.css'],
  })
  export class ValidationDialogComponent implements OnInit {
    private gridApi;
    private gridColumnApi;
    loading = false;
    validations: IValidation[];
    validation: IValidation;
    frameworkComponents: any;
    view = 'table';
    answers: Answer[] = [];
    client: Client;
    company: Company;
    formFields: any[] = [];
    updateObjs: UpdateClientObj[] = [];
    isMultiple = ['drivers', 'vehicles', 'incidents', 'locations', 'homes'];
    columnDefs = [
      { headerName: 'Vendor', field: 'vendorName', cellStyle: { textAlign: 'left', }},
      { headerName: 'Details', field: 'error', cellStyle: { textAlign: 'left', maxWidth: '435px' } },
      { headerName: 'Line of Business', field: 'lob', cellStyle: { textAlign: 'left' }},
      { headerName: 'More Details', cellRenderer: 'buttonRenderer', cellRendererParams: 
        {
          onClick: this.onBtnClick.bind(this), label: 'Fix'
        },
        cellStyle: { textAlign: 'center' } },
    ];

    constructor(
        private clientService: ClientService,
        private answerService: AnswerService,
        private logService: LogService,
        private ngxXml2jsonService: NgxXml2jsonService,
        public dialogRef: MatDialogRef<ValidationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.frameworkComponents = {
        buttonRenderer: ButtonRendererComponent,
      }
    }

    ngOnInit() {
      this.validations = this.data.validations;
      this.company = this.data.company;
      this.getClient();
    }

    getClient() {
      this.clientService.getClient({id: this.data.clientId})
      .subscribe(clientObj => {
        this.client = clientObj['obj'];
      }, error => {
        this.logService.console(error, false);
      });
    }

    transformData() {
      for (let v of this.validations) {
        if (v.dataIn) {
          const parser = new DOMParser();
          const xml = parser.parseFromString(v.dataIn, 'text/xml');
          const dataObj = this.ngxXml2jsonService.xmlToJson(xml);
          let html = '';
          const iterate = (obj, parent?) => {
            Object.keys(obj).forEach(key => {
              if (typeof obj[key] === 'object') {
                iterate(obj[key], key)
              } else {
                html += `<li>${parent ? `${parent} > ` : ''}${key}: ${obj[key]}</li>`;
              }
            });
          };
          iterate(dataObj);
          if (dataObj['@attributes']) {
            delete dataObj['@attributes'];
          }
          v.dataIn = html;
        }
      }
    }

    onBtnClick(event) {
      this.loading = true;
      const row = event.rowData;
      this.validation = row;
      if (row.errorType === 'data' && (row.integrationIds && row.integrationIds.length && row.integrationIds.length > 0)) {
        this.getFields(row.integrationIds);
      } else if (row.errorType === 'data') {
        this.loading = false;
        this.view = 'data-card';
      } else if (row.errorType === 'credentials') {
        this.loading = false;
        this.view = 'credentials-card';
      } else {
        this.loading = false;
        this.view = 'general-card';
      }
    }

    returnToTable() {
      this.view = 'table';
      this.formFields = [];
    }

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll(true);
    }

    getFields(integrationIds: any[]) {
      this.answerService.getByIntegrations(integrationIds)
      .subscribe(ints => {
        this.answers = ints.map(int => {
          return int.answer;
        });
        this.generateFields(this.answers);
        this.loading = false;
        this.view = 'data';
      }, error => {
        this.loading = false;
        this.view = 'data';
        this.logService.console(error, false);
      });
    }

    generateFields(answers: Answer[]) {
      for (const ans of answers) {
        if (ans && this.isMultiple.includes(ans.objectName)) {
          if (this.client[ans.objectName] && this.client[ans.objectName].length && this.client[ans.objectName].length > 0) {
            for (let i = 0; i < this.client[ans.objectName].length; i++) {
              const oneField = { id: ans.id,
                index: i, label: `${ans.objectName} ${i + 1} ${ans.placeholderText}`, key: ans.propertyKey, object: ans.objectName
              };
              this.formFields.push(oneField);
            }
          } else {
            const oneField = { id: ans.id,
              index: 0, label: `${ans.objectName} 1 ${ans.placeholderText}`, key: ans.propertyKey, object: ans.objectName
            };
            this.formFields.push(oneField);
          }
        } else if (ans) {
          const oneField = { id: ans.id,
            index: 0, label: ans.placeholderText, key: ans.propertyKey, object: ans.objectName
          };
          this.formFields.push(oneField);
        }
      }
    }

    autoSizeAll(skipHeader) {
      const allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    returnDate(dateNumber: number) {
      if (dateNumber) {
        return new Date(dateNumber);
      } else {
        return new Date();
      }
    }

    objectModelName(objectName: string) {
      return objectName === 'client' ? 'Client' : objectName === 'drivers' ? 'Driver' :
          objectName === 'vehicles' ? 'Vehicle' : objectName === 'homes' ? 'Home' :
          objectName === 'locations' ? 'Location' : objectName === 'incidents' ? 'Incident' :
          objectName === 'recreationalVehicles' ? 'RecreationalVehicle' : objectName === 'policies' ? 'Policy' :
          objectName === 'business' ? 'Business' : null;
    }

    setObject(field: any, value: any) {
      value = value.target.value;
      if (value === '') {
        value = null;
      }
      const objectName = field.object;
      const key = field.key;
      const index = this.updateObjs.findIndex(obj => obj.objModel === this.objectModelName(objectName));
      if (index > -1) {
        this.updateObjs[index].object[key] = value;
      } else {
        let id = this.client.id;
        if (this.isMultiple.includes(objectName)) {
          id = this.client[objectName][field.index].id;
        }
        const updateObj = { objModel: this.objectModelName(objectName), object: { id: id } };
        updateObj.object[key] = value;
        this.updateObjs.push(updateObj);
      }
    }

    saveObj() {
      this.loading = true;
      this.clientService.upsertAll({ updates: this.updateObjs }, this.company.companyId)
      .subscribe(data => {
        this.logService.success('Updated');
        this.loading = false;
      }, error => {
        this.loading = false;
        this.logService.console(error, false);
      })
    }

    deleteObj() {
      this.loading = true;
      const validationIndex = this.validations.findIndex(val => val === this.validation);
      if (validationIndex > -1) {
        this.view = 'table';
        this.validation = null;
        this.validations.splice(validationIndex, 1);
        const updateVal = [{ objModel: 'Client', object: { id: this.client.id, validations: this.validations } }];
        this.clientService.upsertAll({ updates: updateVal }, this.company.companyId)
        .subscribe(data => {
          this.logService.success('Deleted successfully');
          this.loading = false;
        }, error => {
          this.loading = false;
          this.logService.console(error, false);
        })
      }
    }

    save() {
      if (confirm('Are you sure you want to save these changes?')) {
        this.dialogRef.close();
      }
    }

    returnObject(field) {
      if (this.isMultiple.includes(field.object)) {
        return this.client[field.object][field.index];
      } else if (field.object !== 'client') {
        return this.client[field.object];
      } else if (field.object === 'client') {
        return this.client;
      } else {
        return {};
      };
    }

    showCards(validation: IValidation) {
      if (validation && validation.error) {
        if (validation.error.toLowerCase().includes('co-applicant')) {
          return true;
        }
      }
      return false;
    }

  }
