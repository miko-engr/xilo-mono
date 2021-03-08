import { TestBed } from '@angular/core/testing';

import { SignupGuard } from './signup.guard';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { SignupHeaderComponent } from './signup-header/signup-header.component';
import { ContractComponent } from './contract/contract.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { BrandInfoComponent } from './brand-info/brand-info.component';
import { IntegratedApisComponent } from './integrated-apis/integrated-apis.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { FormsComponent } from './forms/forms.component';
import { LoaderModalComponent } from './loader-modal/loader-modal.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SignupRoutingModule } from './signup-routing.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { ColorPickerModule } from 'ngx-color-picker';
import { PaymentModule } from './payment/payment.module';
import { NgxMaskModule } from 'ngx-mask';
import { SignupFlowService } from '../../services/signup-flow.service';
import { DocuSignService } from '../../services/docu-sign.service';
import { LoaderModalService } from '../../services/loader-modal.service';
import { TeamSignupService } from '../../services/team-signup.service';

describe.skip('SignupGuard', () => {
  let guard: SignupGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
      providers: [
        SignupFlowService,
        DocuSignService,
        SignupGuard,
        LoaderModalService,
        TeamSignupService,
      ]
    });
    guard = TestBed.inject(SignupGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
