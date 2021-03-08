import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ResetPasswordService} from "../../../../services/reset-password.service";
import { Agent } from '../../../../models/agent.model';
import { ToastService } from '../../../../services/toast.service';

@Component ({
    selector: 'app-reset-agent-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})

export class ResetAgentPasswordComponent implements OnInit {
    token: string;
    passwordConfirmation: string = '';
    agent = new Agent();
    loading = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private resetPasswordService: ResetPasswordService,
        private router: Router,
        private toastService: ToastService
    ) { }

    ngOnInit(){
        this.activatedRoute.queryParams
            .subscribe(params => {
                this.token = params['token'];
            }, error => {
                this.toastService.showError('We could not verify your reset link');
            });

        this.resetPasswordService.verifyToken(this.token, 'agent')
            .subscribe(successMessage =>{
            }, error => {
                
                return this.router.navigate(['/auth/login']);
            });
    }

    resetPassword() {
        this.loading = true;
        if (this.agent.password === null || this.passwordConfirmation === '') {
            this.loading = false;
            return this.toastService.showWarn('Please fill in password and re-confirm password');
        }

        if (this.agent.password === this.passwordConfirmation) {
            this.resetPasswordService.updatePassword(this.token, this.agent, 'agent')
                .subscribe(params => {
                    this.loading = false;
                    this.toastService.showSuccess('Password Reset Succesful');
                    return this.router.navigate(['/auth/agent-login']);
                }, error => {
                    this.loading = false;
                    
                    this.toastService.showError(error.error.error.message);
                })
        }
        else {
            this.loading = false;
            return this.toastService.showWarn('Your passwords did not match');
        }
    }

}
