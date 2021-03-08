import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from '../../../../services/company.service';
import { ApiSettingsModalComponent } from '../api-settings-modal/api-settings-modal.component';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {
  @Input() integrationtype: any;
  @Input() data: any;
  @Input() company: any;
  @Output() prepareIntegration = new EventEmitter()

  constructor(
    private dialog: MatDialog,
    private companyService: CompanyService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  openSettings() {
    this.data.company = this.company;
    const dialogRef = this.dialog.open(ApiSettingsModalComponent, {
      width: '600px',
      panelClass: 'dialog',
      data: this.data,
    });
    dialogRef.afterClosed().subscribe((results) => {

    });
  }

  integrate() {
    this.data.values = true;
    this.companyService.integrateService(this.data);
  }

  disconnect() {
    this.data.values = false;
    this.companyService.integrateService(this.data);
  }

  deAuthorized(data: any) {
    if (data.name === 'Infusionsoft')  {

    }
    if (this.data.key === 'hasGoogleIntegration') {
      this.company.googleApiAccessToken = null;
      this.company.googleApiRefreshToken = null;
    }

    if (this.data.key === 'hasOutlookIntegration') {
      this.company.outlookAccessToken = null;
      this.company.outlookRefreshToken = null;
    }
    this.companyService.patch(this.company)
    .subscribe(updatedCompany => {
      this.alertService.success('Profile Updated Successfully');
      this.prepareIntegration.emit(data)
    }, error => {
        this.alertService.danger(error.error.errorType);
    });
  }

}
