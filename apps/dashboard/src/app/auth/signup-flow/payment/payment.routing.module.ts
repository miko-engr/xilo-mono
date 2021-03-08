import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { SignupFlowPaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

const paymentRoutes: Routes = [
    {
      path: '',
      component: SignupFlowPaymentConfirmationComponent 
    },
    { path: 'success', component: PaymentSuccessComponent },
]

@NgModule({
    imports: [
        RouterModule.forChild(paymentRoutes)
    ],
    exports: [RouterModule]
})

export class PaymentRoutingModule{}