import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TeamSignupValidationModalComponent } from './team-signup-validation-modal/team-signup-validation-modal.component';
import { TeamSignupService } from '../services/team-signup.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LoaderModalService } from '../services/loader-modal.service';
import { MatStepper } from '@angular/material/stepper';
import { ToastService } from '../services/toast.service';
import { AccountDetails } from './models/account-details.model';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { map } from 'rxjs/internal/operators/map';
import { AccountDetailsState, selectAccountDetails, selectError } from './store/reducers/team-signup-reducers';
import { Store, select } from '@ngrx/store';
import { getAccountDetails, addAccountDetails, deleteAccountDetails } from './store/actions/account-details-action';

@Component({
  selector: 'app-team-signup',
  templateUrl: './team-signup.component.html',
  styleUrls: ['./team-signup.component.scss']
})
export class TeamSignupComponent implements OnInit, OnDestroy, AfterViewInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild('stepper') stepper: MatStepper;
  dialogRef: MatDialogRef<any>;
  accountDetails: AccountDetails;
  accountDetails$: Observable<any>;
  accountDetailsSubscription: Subscription;
  error$: Observable<any>;
  resendEmail;

  constructor(
    private teamSignupService: TeamSignupService,
    private dialog: MatDialog,
    private router: Router,
    private loaderModalService: LoaderModalService,
    private route: ActivatedRoute,
    private store: Store<AccountDetailsState>,
    private toastService:ToastService,
    ) {
      const userType = localStorage.getItem('userType');
      const token = localStorage.getItem('token');
      if (!token || !userType || userType !== 'xilo_employee') {
        this.openPasswordModal();
        localStorage.clear();
      }
      this.store.dispatch(getAccountDetails());
      this.accountDetails$ = this.store.pipe(select(selectAccountDetails));
      this.error$ = this.store.pipe(select(selectError));
    }

  ngOnInit() {
    this.accountDetailsSubscription = this.accountDetails$
      .pipe(
          map(retAcctDetails => {
              this.accountDetails = this.makeCopy(retAcctDetails) || new AccountDetails();
          })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.dialog.openDialogs.length) {
      this.dialogRef.close();
    }
  }

  ngAfterViewInit() {
    const len = this.queryParams.step ? +this.queryParams.step : 0;
    for (let i = 0; i < len; i++) {
      this.stepper.next();
    }
  }

  resetData() {
    this.stepper.reset();
    this.router.navigate([], { queryParams: {} });
    this.store.dispatch(deleteAccountDetails({
      accountDetails: this.accountDetails
    }));
    this.router.navigate([], { queryParams: {} });
  }

  openPasswordModal() {
    this.dialogRef = this.dialog.open(TeamSignupValidationModalComponent, {
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe((results) => {
      const userType = localStorage.getItem('userType');
      const token = localStorage.getItem('token');
      if (userType && token) {
        // this.getPlanAndDiscountCoupon();
      }
    });
  }

  resendInvitation() {
    this.loaderModalService.openModalLoader('');
    this.teamSignupService.resendLinkInvitation(
      {
        email: this.resendEmail
      }
    )
      .subscribe(res => {
        this.loaderModalService.closeModal();
        this.toastService.showSuccess('Invitation resent');
      }, error => {
        this.loaderModalService.closeModal();
        this.toastService.showError(error.error.error.message);
      })
  }

  async sendInvitation() {
    this.loaderModalService.openModalLoader('');
    this.teamSignupService.invite(this.accountDetails.contract).subscribe(res => {
      this.loaderModalService.closeModal();
      this.toastService.showSuccess('Invited Agency successfully');
    }, error => {
      this.loaderModalService.closeModal();
      this.toastService.showError(error.error.error.message);
    });
  }

  onNextStep(step: number) {
    this.store.dispatch(addAccountDetails({
      accountDetails: this.accountDetails
    }));
    if (!this.queryParams.step) {
      this.queryParams.step = 0;
      this.router.navigate([], {queryParams: { step: 0 }} )
    }
    this.stepper.next();
    this.router.navigate([], { queryParams: { step: step } });
  }

  onUpdatePayment(data: {last4: string, exp_month: string, exp_year: string}) {
    this.accountDetails.contract.payment = {
      ...this.accountDetails.contract.payment,
      last4: data.last4,
      exp_month: data.exp_month,
      exp_year: data.exp_year,
    }
  }

  updateArray(type: string, list: Array<any>) {
    if (type === 'forms') {
      this.accountDetails.selectedForms = list.map(form => form.id);
      this.accountDetails.contract.forms = this.accountDetails.selectedForms;
    } else if (type === 'apis') {
      this.accountDetails.selectedApis = list.map(api => api.key);
      this.accountDetails.contract.integrations = this.accountDetails.selectedApis;
      this.accountDetails.company.preselectedIntegrations = this.accountDetails.selectedApis;
    }
  }

  makeCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  isLoggedIn() {
    return localStorage.getItem('token');
  }

  isAddingAgent() {
    return sessionStorage.getItem('accountDetails');
  }

}
