import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {Router, Params, ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {PosthogService} from "../../services/posthog.service";
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    disableLogin = false;
    loading = false;
    isAgent = false;
    user = new User(null, null, null);
    pwd_clicked = false;
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private posthogService: PosthogService,
        private toastService: ToastService,
    ) {}

    ngOnInit() {
        this.checkLoggedIn();
    }

    checkLoggedIn() {
        this.authService.checkTokenExpiration()
            .subscribe(token => {
                if (token['status'] === false) {
                    localStorage.clear();
                } else {
                    if (localStorage.getItem('userId')) {
                        this.router.navigate(['/profile/prospects']);
                    } else if (localStorage.getItem('agentId')) {
                        this.router.navigate(['/agent/clients-table']);
                    }
                }
            }, error => {
            });
    }

    login() {
        this.loading = true;
        this.disableLogin = true;
        if (this.user.username &&  this.user.password ) {
                this.authService.login(this.user)
                    .subscribe(user => {
                        this.loading = false;
                        this.user = user['obj'];
                        // if (user['isCustomer']) {
                        localStorage.setItem('isCustomer', 'true');
                        localStorage.setItem('subId', user['subscriptionId']);
                        localStorage.setItem('token', user['token']);
                        this.disableLogin = false;
                        this.posthogService.captureEvent('login');
                      if (user['userId']) {
                            localStorage.setItem('userId', user['userId']);
                            if (this.queryParams.redirectUrl) {
                                this.router.navigate([this.queryParams.redirectUrl]);
                            } else {
                                return this.router.navigate(['/profile/prospects']);
                            }
                        } else if (user['agentId']) {
                            localStorage.setItem('agent.user', user['obj']);
                            if (this.queryParams.redirectUrl) {
                                this.router.navigate([this.queryParams.redirectUrl]);
                            } else {
                                return this.router.navigate(['/agent/clients']);
                            }
                        }
                    }, error => {
                        this.loading = false;
                        this.disableLogin = false;
                        console.log(error);
                        this.toastService.showError(error.error.error.message);
                    });
        } else {
            this.loading = false;
            this.disableLogin = false;
            this.toastService.showError('Please fill in both email and password');
        }
    }

    change_border(){
        if(this.pwd_clicked === true){
            return "solid 1px #7c7fff";
        } else if(this.pwd_clicked === false) {
            return "solid 1px #cccccc";
        }
    }
}
