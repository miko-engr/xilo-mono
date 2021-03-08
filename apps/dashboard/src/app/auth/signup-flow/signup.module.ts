import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignupRoutingModule} from './signup-routing.module';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { SignupHeaderComponent } from './signup-header/signup-header.component';
import { ContractComponent } from './contract/contract.component';
import { SharedModule } from '../../shared/shared.module';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { ColorPickerModule } from 'ngx-color-picker';
import { SignupGuard } from './signup.guard';
import { SignupFlowService } from '../../services/signup-flow.service';
import { DocuSignService } from '../../services/docu-sign.service';
import { BrandInfoComponent } from './brand-info/brand-info.component';
import { IntegratedApisComponent } from './integrated-apis/integrated-apis.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { FormsComponent } from './forms/forms.component';
import { LoaderModalComponent } from './loader-modal/loader-modal.component';
import { LoaderModalService } from '../../services/loader-modal.service';
import { PaymentModule } from './payment/payment.module';
import { TeamSignupService } from '../../services/team-signup.service';
import { NgxMaskModule } from 'ngx-mask';
import { SignupSuccessComponent } from './signup-success/signup-success.component';

@NgModule({
  declarations: [
    CreatePasswordComponent,
    SignupHeaderComponent,
    ContractComponent,
    CompanyInfoComponent,
    BrandInfoComponent,
    IntegratedApisComponent,
    TeamMembersComponent,
    FormsComponent,
    LoaderModalComponent,
    SignupSuccessComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SignupRoutingModule,
    GooglePlaceModule,
    MatRadioModule,
    MatDialogModule,
    ColorPickerModule,
    PaymentModule,
    NgxMaskModule.forRoot(),
  ],
  entryComponents: [
    LoaderModalComponent
  ],
  providers: [
    SignupFlowService,
    DocuSignService,
    SignupGuard,
    LoaderModalService,
    TeamSignupService,
  ]
})
export class SignupModule { }
