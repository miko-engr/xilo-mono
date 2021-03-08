import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SignupComponent} from './signup/signup.component';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {NgxLoadingModule
} from 'ngx-loading';
import {ResetUserPasswordComponent} from './reset-password/user/reset-password/reset-password.component';
import { SharedModule } from '../shared/shared.module';
import {AgentLoginComponent} from './agent-login/agent-login.component';
import { ResetAgentPasswordComponent } from './reset-password/agent/reset-password/reset-password.component';
import { RequestResetUserPasswordComponent } from './reset-password/user/request-reset-password/request-reset-password.component';
import { RequestResetAgentPasswordComponent } from './reset-password/agent/request-reset-password/request-reset-password.component';


@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
        AgentLoginComponent,
        ResetUserPasswordComponent,
        ResetAgentPasswordComponent,
        RequestResetUserPasswordComponent,
        RequestResetAgentPasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        NgxLoadingModule
,
        SharedModule
    ]
})
export class AuthModule {}
