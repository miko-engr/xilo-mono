import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { LogService } from '../../../services/log.service';
import { FormViewService, FormBuilderService } from '@xilo-mono/form-contracts';
import { ToastService } from '../../../services/toast.service';
import { CompanyService } from '../../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogImagePicker } from '../../../shared/dialogs/image-picker-dialog/image-picker-dialog.component';

@Component({
  selector: 'app-xilo-form-builder-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class FormBuilderSettingsComponent implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  form;
  options;
  company;

  constructor(
    private companyService: CompanyService,
    public dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private formViewService: FormViewService,
    private logService: LogService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getForm();
    this.getCompany();
  }

  getForm() {
    this.formViewService.getForm(this.queryParams.id)
    .subscribe(form => {
      this.form = form;
      this.formBuilderService.setForm(this.form);
      this.formBuilderService.changeFormState(true);
    }, error => {
      this.logService.console(error);
    })
  }

  getCompany() {
    this.companyService.get()
    .subscribe(res => {
      this.company = res['obj'];
    }, error => {
      console.log(error);
    })
  }

  saveForm() {
    this.formViewService.update(this.form)
    .subscribe(result => {
        this.formBuilderService.setForm(this.form);
        this.formBuilderService.changeFormState(true);
        this.toastService.showSuccess('Form updated');
    }, error => {
        this.logService.console(error);
        this.toastService.showError('Issue updating form');
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogImagePicker, {
        width: '30rem',
        data: {
            brandColor: this.company.brandColor
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.form.icon = result;
            console.log(this.form);
        }
    });
  }

}
