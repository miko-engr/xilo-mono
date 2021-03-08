import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {ResetUserPasswordComponent} from './reset-password/user/reset-password/reset-password.component';
import {AgentLoginComponent} from './agent-login/agent-login.component';
import { RequestResetUserPasswordComponent } from './reset-password/user/request-reset-password/request-reset-password.component';
import { RequestResetAgentPasswordComponent } from './reset-password/agent/request-reset-password/request-reset-password.component';
import { ResetAgentPasswordComponent } from './reset-password/agent/reset-password/reset-password.component';

const authRoutes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'agent-login', component: AgentLoginComponent },
    { path: 'reset-user-password', component: RequestResetUserPasswordComponent},
    { path: 'reset-agent-password', component: RequestResetAgentPasswordComponent},
    { path: 'new-user-password', component: ResetUserPasswordComponent},
    { path: 'new-agent-password', component: ResetAgentPasswordComponent},
    { path: 'signup-flow', loadChildren: () => import('./signup-flow/signup.module').then(m => m.SignupModule)},
];

@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
