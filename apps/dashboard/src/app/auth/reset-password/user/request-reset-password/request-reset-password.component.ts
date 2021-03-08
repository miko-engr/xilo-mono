import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../../services/auth.service";
import {EmailService} from "../../../../services/email.service";
import { ToastService } from '../../../../services/toast.service';


@Component ({
    selector: 'app-request-reset-user-password',
    templateUrl: './request-reset-password.component.html',
    styleUrls: ['./request-reset-password.component.css'],
    providers: [EmailService]
})

export class RequestResetUserPasswordComponent implements OnInit {
    user = new User();
    ifResetting = false;
    loading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) {}

    ngOnInit() {
    }

    resetPassword() {
        this.loading = true;
        if (this.user.username != undefined) {
            this.authService.resetUserPassword(this.user)
                .subscribe(data =>{
                        this.loading = false;
                        this.toastService.showSuccess('Password Reset Email Sent');
                        return this.router.navigate(['/auth/login']);
                    },
                    error => {
                        this.loading = false;
                        this.toastService.showError(error.error.error.message);
                    });
        }
    };
}

