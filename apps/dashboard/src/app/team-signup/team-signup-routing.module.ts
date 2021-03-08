import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamSignupComponent } from './team-signup.component';
import { ResendInvitationComponent } from './resend-invitation/resend-invitation.component';
import { TeamSignupGuard } from './team-signup.guard';
import { StripeTokenComponent } from './stripe/stripe.component';

const teamSignupRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TeamSignupComponent
      },
      {
        path: 'resend-invitation',
        canActivate: [ TeamSignupGuard ],
        component: ResendInvitationComponent
      },
      {
        path: 'stripe',
        component: StripeTokenComponent
      }
    ]
  },
];

@NgModule({
  imports: [
      RouterModule.forChild(teamSignupRoutes)
  ],
  exports: [RouterModule]
})
export class TeamSignupRoutingModule { }
