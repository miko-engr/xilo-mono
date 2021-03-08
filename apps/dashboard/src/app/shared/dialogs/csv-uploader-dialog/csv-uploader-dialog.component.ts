import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { CompanyService } from '../../../services/company.service';
import { Papa } from 'ngx-papaparse';

@Component({
    selector: 'app-csv-uploader-dialog',
    templateUrl: './csv-uploader-dialog.component.html',
    styleUrls: ['./csv-uploader-dialog.component.css'],
  })
  export class CSVUploaderDialogComponent implements OnInit {
    clientKeys = [];
    driverKeys = [];
    homeKeys = [];
    businessKeys = [];
    locationKeys = [];
    vehicleKeys = [];
    incidentKeys = [];
    recreationalVehicleKeys = [];
    policyKeys = [];
    keys = [];
    keysRetrieved = false;

    searchValue = '';
    objectNames = {};
    searchValues = {};
    mapKey = null;
    csvIsValid = false;
    rows = [];
    tableArray = [];

    constructor(
        private companyService: CompanyService,
        private logService: LogService,
        public dialogRef: MatDialogRef<CSVUploaderDialogComponent>,
        private papa: Papa,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.getKeys();
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

  changeListener(files: FileList) {
    if (files && files.length > 0) {
       const file: File = files.item(0);
         const reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
            const csv = reader.result;
            const results = this.papa.parse(csv as string, { header: false });
            if (results !== null && results !== undefined && results.data !== null &&
              results.data !== undefined && results.data.length > 0 && results.errors.length === 0) {
              // PERFORM OPERATIONS ON PARSED CSV
              const csvTableHeader = results.data[0];

              for (let i = 0; i < csvTableHeader.length; i++) {
                this.rows.push({csvHeader: csvTableHeader[i]});
                if (!csvTableHeader[i + 1]) {
                  this.csvIsValid = true;
                }
              }
              this.tableArray = [...results.data.slice(1, results.data.length)];

              // for (let i = 0; i < csvTableData.length; i++) {
              //   const row = csvTableData[i];
              //   if (row.length === rows.length) {
              //     for (let j = 0; j < row.length; j++) {
              //       const item = row[j];
              //       rows[j]['xiloKey'] = item;
              //     }
              //   }
              // }
              // console.log(csvTableData);

            } else {
              for (let i = 0; i < results.errors.length; i++) {
                console.log( 'Error Parsing CSV File: ',results.errors[i].message);
              }
            }
         };
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
        } else if (obj === 'business') {
            return this.businessKeys;
        } else if (obj === 'locations') {
            return this.locationKeys;
        } else if (obj === 'incidents') {
          return this.incidentKeys;
        }  else if (obj === 'recreationalVehicles') {
          return this.recreationalVehicleKeys;
        } else if (obj === 'policies') {
          return this.policyKeys;
        } else {
            return [];
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

    selectKey(index: any, event) {
      if (event && event.option && event.option.value) {
        this.searchValues[index] = event.option.value;
      }
    }

    saveSettings() {
      if (confirm('Are you sure you want to upload these clients?')) {
        const dataArray = [];

        if (this.tableArray.length > 1) {
          for (let i = 0; i < this.tableArray.length; i++) {
            const data = [];
            const tableRows = this.tableArray[i];
            for (let j = 0; j < this.rows.length; j++) {
              data.push({});
              data[j]['key'] = this.searchValue[j];
              data[j]['object'] = this.objectNames[j];
              data[j]['value'] = tableRows[j];
              if (!this.rows[j+1]) {
                dataArray.push(data);
              }
            }
            if (!this.tableArray[i+1]) {
              this.dialogRef.close(dataArray);
            }
          }
        } else if (this.tableArray.length === 1) {
          const data = [];
          for (let j = 0; j < this.rows.length; j++) {
            data.push({});
            data[j]['key'] = this.searchValue[j];
            data[j]['object'] = this.objectNames[j];
            data[j]['value'] = this.tableArray[0][j];
            if (!this.rows[j+1]) {
              dataArray.push(data);
            }
          }
          setTimeout(() => {
            this.dialogRef.close(dataArray);
          }, 1000);
        }
      }
    }

  }
