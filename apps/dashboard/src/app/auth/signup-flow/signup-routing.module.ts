import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { SignupHeaderComponent } from './signup-header/signup-header.component';
import { ContractComponent } from './contract/contract.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { SignupGuard } from './signup.guard';
import { SignupSuccessComponent } from './signup-success/signup-success.component';
const signUpRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-password',
        component: CreatePasswordComponent
      },
      {
        path: '',
        component: SignupHeaderComponent,
        canActivate: [ SignupGuard ],
        children: [
          {
            path: 'contract',
            component: ContractComponent
          },
          {
            path: 'payment',
            loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
          },
          {
            path: 'company-info',
            component: CompanyInfoComponent,
          },
          {
            path: 'success',
            component: SignupSuccessComponent,
          }
        ]
      },
      {
        path: '',
        redirectTo: 'create-password',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(signUpRoutes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
