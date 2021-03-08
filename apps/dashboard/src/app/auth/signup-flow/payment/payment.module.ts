import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentRoutingModule } from './payment.routing.module';
import { SignupFlowPaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

@NgModule({
  declarations: [
    SignupFlowPaymentConfirmationComponent,
    PaymentSuccessComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule
  ]
})
export class PaymentModule { }
