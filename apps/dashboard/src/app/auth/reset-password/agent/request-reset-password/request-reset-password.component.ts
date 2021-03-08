import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {AlertControllerService} from "../../../../services/alert.service";
import {AuthService} from "../../../../services/auth.service";
import {EmailService} from "../../../../services/email.service";
import { Agent } from '../../../../models/agent.model';
import { ToastService } from '../../../../services/toast.service';


@Component ({
    selector: 'app-request-reset-agent-password',
    templateUrl: './request-reset-password.component.html',
    styleUrls: ['./request-reset-password.component.css'],
    providers: [EmailService]
})

export class RequestResetAgentPasswordComponent implements OnInit {
    agent = new Agent();
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
        if (this.agent.email != undefined) {
            this.authService.resetAgentPassword(this.agent)
                .subscribe(data =>{
                        this.loading = false;
                        this.toastService.showSuccess('Password Reset Email Sent');
                        return this.router.navigate(['/auth/agent-login']);
                    },
                    error => {
                        this.loading = false;
                        this.toastService.showSuccess(error.error.error.message);
                    });
        }
    };
}

