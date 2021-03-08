import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ResetPasswordService} from "../../../../services/reset-password.service";
import {User} from "../../../../models/user.model";
import { ToastService } from '../../../../services/toast.service';

@Component ({
    selector: 'app-reset--user-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})

export class ResetUserPasswordComponent implements OnInit {
    token: string;
    passwordConfirmation: string = '';
    user = new User();
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
                this.toastService.showError(error.error.error.message);
            });

        this.resetPasswordService.verifyToken(this.token, 'user')
            .subscribe(successMessage =>{
            }, error => {
                this.toastService.showError('We could not verify your reset link');
                return this.router.navigate(['/auth/login']);
            });
    }

    resetPassword() {
        this.loading = true;
        if (this.user.password === null || this.passwordConfirmation === '') {
            this.loading = false;
            return this.toastService.showWarn('Please fill in password and re-confirm password');
        }

        if (this.user.password === this.passwordConfirmation) {
            this.resetPasswordService.updatePassword(this.token, this.user, 'user')
                .subscribe(params => {
                    this.toastService.showSuccess('Password has been reset');
                    this.loading = false;
                    return this.router.navigate(['/auth/login']);
                }, error => {
                    
                    this.loading = false;
                    this.toastService.showError(error.error.error.message);
                })
        }
        else {
            this.loading = false;
            return this.toastService.showError('Your passwords did not match');
        }
    }

}
