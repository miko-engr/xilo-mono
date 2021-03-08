import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import {Router} from '@angular/router';
import { Company } from '../models/company.model';
import { CompanyService } from '../services/company.service';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Intercom } from 'ng-intercom';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';
import { MatDialog } from '@angular/material/dialog';
import { CSVUploaderDialogComponent } from '../shared/dialogs/csv-uploader-dialog/csv-uploader-dialog.component';
import {PosthogService} from "../services/posthog.service";
import { NgxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    menuActive = false;
    company = new Company(null);
    user = new User(null);
    userRetrieved = false;
    actionMenuActive = false;
    inMenu = false;
    hasFormBuilder = false;

    @HostListener('mousedown') onMouseDown() {
        if (this.actionMenuActive && !this.inMenu) {
            this.hitActionMenu('deactivate');
        }
    }

    constructor(
        private logService: LogService,
        private authService: AuthService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private intercom: Intercom,
        private ngxZendeskWebwidgetService: NgxZendeskWebwidgetService,
        private posthogService: PosthogService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.checkToken();
        this.getCompany();
    }

    checkToken() {
        if (this.authService.isTokenExpired()) {
            localStorage.clear();
            this.logService.warn('Please Login Again');
            this.router.navigate(['/']);
          }
    }

    ngOnDestroy() {
        if (environment.production === true) {
            this.intercom.shutdown();
        }
    }

    routeToSupport() {
        this.router.navigate(['/support']);
    }

    hitActionMenu(type: string) {
        if (type === 'toggle') {
            this.actionMenuActive = !this.actionMenuActive;
        } else if (type === 'deactivate') {
            this.actionMenuActive = false;
        } else if (type === 'activate') {
            this.actionMenuActive = true;
        }
    }

    styleActionMenu() {
        if (this.actionMenuActive) {
            return { 'display': 'inline-block' };
        } else {
            return { 'display': 'none' };
        }
    }

    launchIntercom() {
        this.intercom.boot({
            app_id: 'umjri2q3',
            email: this.user.username,
            created_at: this.user.createdAt,
            phone: this.company.contactNumber,
            name: `${this.user.firstName} ${this.user.lastName}`,
            hide_default_launcher: true,
            // Supports all optional configuration.
            widget: {
              'activator': '#intercom'
            }
        });
       if (environment.production == true) {
       }
    }


    launchZendesk() {
        this.ngxZendeskWebwidgetService.zE('webWidget', 'identify', {
            name: `${this.user.firstName} ${this.user.lastName}`,
            email: this.user.username,
          });
         
          this.ngxZendeskWebwidgetService.zE('webWidget', 'prefill', {
              name: {
              value: `${this.user.firstName} ${this.user.lastName}`,
              readOnly: true
            },
            email: {
              value: this.user.username,
              readOnly: true
            }
          });
         
          this.ngxZendeskWebwidgetService.zE('webWidget', 'show');
    }

    launchWootrics(email: string) {
        if (environment.production) {
         // (<any>window)['wootric_survey_immediately'] = true;
         const createdAtDate = Math.floor(new Date(this.user.createdAt).getTime() / 1000);
         (<any>window)['wootricSettings'] = {
             email: email,
             created_at: createdAtDate,
             account_token: 'NPS-0488faa5' // This is your unique account token.
         };
         (<any>window)['wootric']('run');
        }
     }

    launchDelighted() {
        if (environment.production && (<any>window)['delighted']) {
            const createdAtDate = Math.floor(new Date(this.user.createdAt).getTime() / 1000);
            (<any>window)['delighted'].survey({
                email: this.user.username,
                name: `${this.user.firstName} ${this.user.lastName}`,
                createdAt: createdAtDate,
                properties: {
                    companyId: this.company.id,
                    type: 'admin',
                    agencyName: this.company.name
                }
            });         
        }
     }

     launchPostHogs(email: string, id: number, createdAtDate: any) {
         this.posthogService.registerUser(email, id, createdAtDate, this.company);
     }

    getCompany() {
        this.company = new Company(null);
        this.companyService.get()
            .subscribe(company => {
                this.company = company['obj'];
                this.companyService.sendCompanyData(this.company);
                this.getUser();
                if (this.company.features) {
                    const flagKeys = Object.keys(this.company.features);
                    this.hasFormBuilder = flagKeys.includes('formBuilder');
                }
            }, error =>  {
                if (error) {
                    localStorage.clear();
                    this.router.navigate(['/auth/login']);
                }
            });
    }

    getUser() {
        this.user = new User(null);
        this.userService.get()
            .subscribe(user => {
                this.user = user['obj'];
                if (this.user.username || !this.user.username.includes('dmin')) {
                    this.launchIntercom();
                    if (this.ngxZendeskWebwidgetService.zE) {
                        this.launchZendesk();
                    }
                    this.launchWootrics(this.user.username);
                    this.launchPostHogs(this.user.username, this.user.id, this.user.createdAt);
                    this.launchDelighted();
                }
                this.userRetrieved = true;
            }, error => {
            });
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn() {
        return localStorage.getItem('token');
    }

    styleMenu() {
        if (this.menuActive) {
            return {'transform': 'rotate(0)', 'right': '25px'};
        }
    }

    toggelLeftPanel() {
        if (this.menuActive == false) {
            this.menuActive = true;
        } else {
            this.menuActive = false;
        }
    }

    toggelLeftPanelFromTab() {
        if (this.menuActive == true) {
            this.menuActive = false;
        }
    }

    async openCSVDialog() {
        if (!this.company || !this.company.hasTasks) {
            this.logService.warn('You do not have access to tasks');
            return;
        }
        const dialogRef = this.dialog.open(CSVUploaderDialogComponent, {
            width: '60rem',
            panelClass: 'dialog',
            data: {}
        });
        dialogRef.afterClosed().subscribe(async(results) => {
            if (results) {
            }
        });
    }

    returnPage() {
        const url = this.router.url;
        if (url.includes('tracking')) {
            return 'Tracking';
        } else if (url.includes('business')) {
            return 'Settings';
        } else if (url.includes('form')) {
            return 'Forms';
        } else if (url.includes('prospect')) {
            return 'Prospects';
        } else if (url.includes('team')) {
            return 'Team';
        } else if (url.includes('analytics')) {
            return 'Analytics';
        } else {
            return 'Home';
        }
    }

    externalRouteTo(url: string) {
        window.open(url, '_blank');
    }
}
