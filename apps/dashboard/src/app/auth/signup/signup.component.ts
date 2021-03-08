import { Component, OnInit } from '@angular/core';

import {Email} from "../../models/email.model";
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AlertControllerService} from "../../services/alert.service";
import {EmailService} from "../../services/email.service";
import { PlatformManager } from '../../models/platform-manager.model';
import {Agent} from "../../models/agent.model";
import {Lifecycle} from "../../models/lifecycle.model";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [EmailService]
})
export class SignupComponent implements OnInit {
    disableSignup = false;
    loading = false;
    user = new User();
    lifecycle = new Lifecycle;
    agent = new Agent();
    isPlatformManager = false;
    passwordConfirmation: string = '';
    newEmail = {attachement: false, filename :null, clientXml: null, recipient: "Customer-success@xilo.io", html: null, subject: "You have new message from online visitor"}
    pwd_clicked = false;

    constructor(
        private alertService: AlertControllerService,
        private authService: AuthService,
        private emailService: EmailService,
        private router: Router
    ) {}

    ngOnInit() {
    }

    onSend() {
        if ( this.user.username !== null && this.user.password !== null && this.passwordConfirmation !== null) {
            this.emailService.sendEmail(this.newEmail)
                .subscribe(data => {
                        this.alertService.success("Signup Successful!", false);
                        this.newEmail.html = null;
                    },
                    error => {
                        
                        this.alertService.serverError(error.error.errorType, error.error.data);
                    });
            
            this.emailService.sendEmail({attachment: false, filename: null, clientXml: null, recipient: this.user.username,
                html: `<div style="padding-top:15px; width:100%; background:black">
                              <img style="height:35px; width:35px" src="https://s3-us-west-2.amazonaws.com/xilo/xilo_icon_only.png" alt="xilo">
                              <p style="color:#fdfdfd; display:inline-block;
                              margin-top: 8px; transform: translateY(-7px); font-size: 20px; font:Comfortaa">
                                Xilo
                              </p>
                            </div>
                            <div style="height: 500px">
                              <p style="text-align:center; margin-top: 30px; font-size:15px; font:Comfortaa">
                                Thank you for signing up with Xilo
                              </p>
                            </div>
                            <div style="background:lightgray; width:100%; ; text-align:center; padding-top:50px; padding-bottom: 50px">
                              &copy; 2018 All Rights Reserved Corza Technologies, Inc
                            </div>`,
                subject:"Thank you for visiting Xilo!"})
                .subscribe(data => {
                        this.alertService.success("Signup Successful", false);
                    },
                    error => {
                        
                        this.alertService.serverError(error.error.errorType, error.error.data);
                    });
        }
    }

    signup() {
        this.loading = true;
        this.disableSignup = true;
        if (this.user.username === null || this.user.password === null || 
            this.passwordConfirmation === '' || this.user.website === null || this.user.brandColor === null) {
            this.disableSignup = false;
            this.loading = false;
            return this.alertService.warn('Please fill in all information');
        } else if (this.user.password === this.passwordConfirmation) {
            this.authService.post(this.user)
                .subscribe(data => {
                    localStorage.setItem('token', data['token']);
                    localStorage.setItem('userId', data['userId']);
                    this.routeToProfile();
                }, error13 => {
                    if (error13.error.message === 'User already exists') {
                        return this.alertService.error('This account already exits. Please login or try another account!');
                    } else if (error13.status === 401) {
                        this.loading = false;
                        this.loading = false;
                        this.disableSignup = false;
                        this.alertService.serverError(error13.error.errorType, error13.error.data);
                    } else {
                        this.loading = false;
                        this.disableSignup = false;
                        this.alertService.serverError(error13.error.errorType, error13.error.data);
                    }
                    this.loading = false;
                });
        }
        else {
            this.disableSignup = false;
            this.loading = false;
            return this.alertService.error('Your passwords did not match');
        }
    }

    routeToProfile() {
        this.user.username = '';
        this.user.password = '';
        this.passwordConfirmation = '';
        this.router.navigate(['profile/business']);
        this.disableSignup = false;
        this.loading = false;
        this.alertService.success('Signup successful!', true);
    }

    change_border(){
        if(this.pwd_clicked === true){
            return "solid 1px #7c7fff";
        } else if(this.pwd_clicked === false) {
            return "solid 1px #cccccc";
        }
    }
}