import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AlertControllerService} from "../../services/alert.service";
import { Agent } from '../../models/agent.model';
import {environment} from "../../../environments/environment";
import {PosthogService} from "../../services/posthog.service";

@Component({
    selector: 'app-login',
    templateUrl: './agent-login.component.html',
    styleUrls: ['./agent-login.component.css']
})
export class AgentLoginComponent implements OnInit {
    disableLogin = false;
    loading = false;
    user = new User(null, null, null);
    showDialog = false;
    pwd_clicked = false;

    constructor(
        private alertService: AlertControllerService,
        private authService: AuthService,
        private router: Router,
        private posthogService: PosthogService
    ) {}

    ngOnInit() {
        this.checkLoggedIn();
    }

    checkLoggedIn() {
        if (localStorage.getItem('userId') !== null) {
            this.router.navigate(['/profile/business']);
        } else if (localStorage.getItem('platformManagerId') !== null) {
            this.router.navigate(['/platform-manager']);
        } else if (localStorage.getItem('agentId') !== null) {
            this.router.navigate(['/agent/clients-table']);
        }
    }

    login() {
        this.loading = true;
        this.disableLogin = true;
        if (this.user.username && this.user.password) {
            let newAgent = new Agent(null, null,null, null, null, false, false, this.user.username, this.user.password);
            this.authService.loginAsAgent(newAgent)
                .subscribe(agent => {
                    this.loading = false;
                    let thisAgent = agent['obj'];
                    localStorage.setItem('isCustomer', 'true');
                    localStorage.setItem('token', agent['token']);
                    this.disableLogin = false;
                    localStorage.setItem('agentId', agent['agentId']);
                    this.posthogService.captureEvent('login');
                    //return this.router.navigate(['/agent/kanban']);
                    return this.router.navigate(['/agent/clients-table']);
                }, error => {
                    this.loading = false;

                    this.disableLogin = false;
                    this.alertService.serverError(error.error.errorType, error.error.data);
                })
        } else {
            this.loading = false;
            this.disableLogin = false;
            return this.alertService.warn('Please fill in both email and password');
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
