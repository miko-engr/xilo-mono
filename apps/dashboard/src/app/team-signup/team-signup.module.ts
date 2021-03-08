import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamSignupComponent } from './team-signup.component';
import { TeamSignupRoutingModule } from './team-signup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { TeamSignupValidationModalComponent } from './team-signup-validation-modal/team-signup-validation-modal.component';
import { TeamSignupService } from '../services/team-signup.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { AddPaymentPlanModalComponent } from './add-payment-plan-modal/add-payment-plan-modal';
import { ResendInvitationComponent } from './resend-invitation/resend-invitation.component';
import { TeamSignupGuard } from './team-signup.guard';
import { MatIconModule } from '@angular/material/icon';
import { LoaderModalService } from '../services/loader-modal.service';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { TeamSignupReducer } from './store/reducers/team-signup-reducers';
import { TeamSignupContractDetailsEffect } from './store/effects/contract-details-effect';
import { TeamSignupContractDetailsComponent } from './contract-details/contract-details.component';
import { metaReducers } from './store/reducers/meta-reducers';
import { TeamSignupCompanyDetailsComponent } from './company-details/company-details.component';
import { TeamSignupCompanyDetailsEffect } from './store/effects/company-details-effect';
import { TeamSignupPaymentDetailsComponent } from './payment-details/payment-details.component';
import { TeamSignupPaymentDetailsEffect } from './store/effects/payment-details-effect';
import { TeamSignupAccountDetailsEffect } from './store/effects/account-details-effect';
import { TeamSignupFormSelectionComponent } from './form-selection/form-selection.component';
import { TeamSignupIntegrationSelectionComponent } from './integration-selection/integration-selection.component';
import { StripeTokenComponent } from './stripe/stripe.component';
import { StripePaymentButtonComponent } from './stripe/payment-button/payment-button.component';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [
    TeamSignupComponent,
    TeamSignupFormSelectionComponent,
    TeamSignupContractDetailsComponent,
    TeamSignupCompanyDetailsComponent,
    TeamSignupValidationModalComponent,
    TeamSignupPaymentDetailsComponent,
    TeamSignupIntegrationSelectionComponent,
    AddPaymentPlanModalComponent,
    ResendInvitationComponent,
    StripeTokenComponent,
    StripePaymentButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    TeamSignupRoutingModule,
    MatDialogModule,
    ColorPickerModule,
    GooglePlaceModule,
    MatIconModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    StoreModule.forFeature(
      'accountDetails',
      TeamSignupReducer,
      { metaReducers }
    ),
    EffectsModule.forFeature([
        TeamSignupAccountDetailsEffect,
        TeamSignupContractDetailsEffect,
        TeamSignupCompanyDetailsEffect,
        TeamSignupPaymentDetailsEffect
      ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    NgxStripeModule
  ],
  providers: [
    TeamSignupService,
    TeamSignupGuard,
    LoaderModalService
  ],
  entryComponents: [
    TeamSignupValidationModalComponent,
  ]
})
export class TeamSignupModule { }
