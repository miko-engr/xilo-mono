import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Form } from '../../../models/form.model';
import { LogService } from '../../../services/log.service';
import { IntegrationValidatorService } from '../../../services/integration-validator.service';
import { Client } from '../../../models/client.model';

@Component({
    selector: 'app-integration-validator-dialog',
    templateUrl: './validator-dialog.component.html',
    styleUrls: ['./validator-dialog.component.css'],
  })
  export class IntegrationValidatorDialogComponent implements OnInit {
    reportPassed = false;
    reportFailed = false;
    loading = false;
    reportData = null;

    constructor(
        public dialogRef: MatDialogRef<IntegrationValidatorDialogComponent>,
        private logService: LogService,
        private validatorService: IntegrationValidatorService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      if (this.data.method === 'fields') {
        this.getFormFieldReport(this.data.form);
      } else if (this.data.reportType === 'form') {
        this.getFormReport(this.data.form);
      } else {
        this.getClientReport(this.data.client);
      }
    }

    getFormReport(form: Form) {
      this.loading = true;
      this.validatorService.validateForm(form.id, this.data.type, this.data.vendor, this.data.company.hasV2Integrations)
      .subscribe(data => {
        this.loading = false;
        if (data['valid']) {
          this.reportPassed = true;
        } else {
          this.reportData = data['obj'];
          this.reportFailed = true;
        }
      }, error => {
        this.logService.console(error, true);
        this.loading = false;
        this.dialogRef.close();
      });
    }

    getFormFieldReport(form: Form) {
      console.log('Hit');
      this.loading = true;
      this.validatorService.validateFormFields(form.id, this.data.type, this.data.vendor)
      .subscribe(data => {
        this.loading = false;
        if (data['valid']) {
          this.reportPassed = true;
        } else {
          this.reportData = data['obj'];
          this.reportFailed = true;
        }
      }, error => {
        this.logService.console(error, true);
        this.loading = false;
        this.dialogRef.close();
      });
    }

    getClientReport(client: Client) {
      this.loading = true;
      this.validatorService.validateClient(client.id, this.data.type, this.data.vendor)
      .subscribe(data => {
        this.loading = false;
        if (data['valid']) {
          this.reportPassed = true;
        } else {
          this.reportData = data['obj'];
          this.reportFailed = true;
        }
      }, error => {
        this.logService.console(error, true);
        this.loading = false;
        this.dialogRef.close();
      });
    }

    closeDialog() {
      this.dialogRef.close(this.reportData);
    }

  }
