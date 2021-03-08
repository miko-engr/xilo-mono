import {Component, OnInit, OnDestroy, HostListener} from "@angular/core";
import {Router} from "@angular/router";
import { CompanyService } from "../services/company.service";
import { AgentService } from '../services/agent.service';
import { Agent } from '../models/agent.model';
import { LogService } from '../services/log.service';
import { Intercom } from 'ng-intercom';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { TaskDialogComponent } from '../shared/dialogs/task-dialog/task-dialog.component';
import { Task } from '../models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { MessagesCreateDialogComponent } from '../shared/dialogs/messages-create-dialog/messages-create-dialog.component';
import {PosthogService} from "../services/posthog.service";
import { NgxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';

@Component({
    selector: 'app-agent',
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.css']
})

export class AgentComponent implements OnInit, OnDestroy {
   readonly VAPID_PUBLIC_KEY = environment.VAPIDPUBLICKEY;
   menuActive = false;
   agent = new Agent;
   company;
   actionMenuActive = false;
   inMenu = false;

   @HostListener('mousedown') onMouseDown() {
        if (this.actionMenuActive && !this.inMenu) {
            this.hitActionMenu('deactivate');
        }
    }

    constructor(
        private agentService: AgentService,
        private authService: AuthService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private logService: LogService,
        private intercom: Intercom,
        private ngxZendeskWebwidgetService: NgxZendeskWebwidgetService,
        private taskService: TaskService,
        private router: Router,
        private posthogService: PosthogService
    ) { }

    ngOnInit() {
        this.checkToken();
    }

    ngOnDestroy() {
        if (environment.production) {
            this.intercom.shutdown();
        }
    }

    checkToken() {
        if (this.authService.isTokenExpired()) {
            localStorage.clear();
            this.logService.warn('Please Login Again');
            this.router.navigate(['/']);
          } else {
            this.getActive();
          }
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

    launchIntercom() {
       if (environment.production) {
        this.intercom.boot({
            app_id: 'umjri2q3',
            email: this.agent.email,
            created_at: this.agent.createdAt,
            phone: this.company.contactNumber,
            name: `${this.agent.firstName} ${this.agent.lastName}`,
            hide_default_launcher: true,
            // Supports all optional configuration.
            widget: {
              "activator": "#intercom"
            }
        });;
       }
    }

    launchZendesk() {
        this.ngxZendeskWebwidgetService.zE('webWidget', 'identify', {
            name: `${this.agent.firstName} ${this.agent.lastName}`,
            email: this.agent.email,
          });
         
          this.ngxZendeskWebwidgetService.zE('webWidget', 'prefill', {
              name: {
              value: `${this.agent.firstName} ${this.agent.lastName}`,
              readOnly: true
            },
            email: {
              value: this.agent.email,
              readOnly: true
            }
          });
         
          this.ngxZendeskWebwidgetService.zE('webWidget', 'show');
    }

    launchWootrics(email: string) {
       if (environment.production) {
        // (<any>window)['wootric_survey_immediately'] = true;
        const createdAtDate = Math.floor(new Date(this.agent.createdAt).getTime() / 1000);
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
            const createdAtDate = Math.floor(new Date(this.agent.createdAt).getTime() / 1000);
            (<any>window)['delighted'].survey({
                email: this.agent.email,
                name: `${this.agent.firstName} ${this.agent.lastName}`,
                createdAt: createdAtDate,
                properties: {
                    companyId: this.company.id,
                    type: 'agent',
                    agencyName: this.company.name
                }
            });         
        }
     }

    launchPostHogs(email: string, id: number, createdAtDate: any) {
      this.posthogService.registerUser(email, id, createdAtDate, this.company);
    }

    getActive() {
        this.companyService.getByAgent()
            .subscribe(company => {
                this.company = company['obj'];
                this.agentService.get()
                    .subscribe(agent => {
                        this.agent = agent['obj'];
                        // if (!this.agent.notificationJson) {
                        //     this.subscribeToNotifs();
                        // } else {
                        //     this.subscribeToClick();
                        // }
                        if (this.agent.email || !this.agent.email.includes('dmin')) {
                            this.launchWootrics(this.agent.email);
                            this.launchIntercom();
                            this.launchZendesk();
                            this.launchPostHogs(this.agent.email, this.agent.id, this.agent.createdAt);
                            this.launchDelighted();
                        }
                    }, error => {
                        this.logService.console(error, true);
                    });
            }, error => {
                this.logService.console(error, true);
            })
    }

    // subscribeToNotifs() {
    //       this.swPush.requestSubscription({
    //           serverPublicKey: this.VAPID_PUBLIC_KEY
    //       })
    //       .then(sub => {
    //         this.agent.notificationJson = sub;
    //         this.agentService.updateNotification(this.agent)
    //         .subscribe(res => console.log(res),
    //         error => console.log(error));
    //       })
    //       .catch(err => console.log(err));
    // }

    // subscribeToClick() {
    //     this.swPush.notificationClicks.subscribe( arg => {
    //           console.log(
    //             'Action: ' + arg.action,
    //             'Notification data: ' + arg.notification.data,
    //             'Notification data.url: ' + arg.notification.data.url,
    //             'Notification data.body: ' + arg.notification.body,
    //           );
    //           if (arg && arg.notification && arg.notification.data && arg.notification.data.url) {
    //               window.open(arg.notification.data.url, '_blank');
    //           }
    //        });
    // }

    logout() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn() {
        return localStorage.getItem('token');
    }

    styleMenu() {
        if (this.menuActive) {
            return {'transform': 'rotate(0)', 'right': '25px'}
        }
    }

    styleActionMenu() {
        if (this.actionMenuActive) {
            return { 'display': 'inline-block' }
        } else {
            return { 'display': 'none' };
        }
    }

    toggelLeftPanel() {
        if(this.menuActive == false){
            this.menuActive = true;
        }
        else{
            this.menuActive = false;
        }
    }

    toggelLeftPanelFromTab() {
        if(this.menuActive == true){
            this.menuActive = false;
        }
    }

    async openTaskDialog() {
        if (!this.company || !this.company.hasTasks) {
            this.logService.warn('You do not have access to tasks');
            return;
        }
        const dialogRef = this.dialog.open(TaskDialogComponent, {
            width: '60rem',
            panelClass: 'dialog',
            data: {agent: this.agent}
        });
        dialogRef.afterClosed().subscribe(async(results) => {
            if (results) {
                const task: Task = results;
                task.agentTaskId = this.agent.id;
                task.companyTaskId = this.agent.companyAgentId;
                this.taskService.createTask(task)
                .subscribe(newTask => {
                    this.logService.success('New task created');
                }, error => {
                    this.logService.console(error, true);
                });
            }
        });
    }

    async openMessagesDialog(type: string) {
        if (!this.company || !this.company.hasSalesAutomation) {
            this.logService.warn('You do not have access to messages');
            return;
        }
        const dialogRef = this.dialog.open(MessagesCreateDialogComponent, {
            width: '60rem',
            panelClass: 'dialog',
            data: {agent: this.agent, company: this.company, type: type}
        });
        dialogRef.afterClosed().subscribe(async(results) => {
            this.actionMenuActive = false;
        });
    }

    returnPage() {
        const url = this.router.url;
        if (url.includes('task')) {
            return 'Tasks';
        } else if (url.includes('message')) {
            return 'Messages';
        } else if (url.includes('form')) {
            return 'Forms';
        } else if (url.includes('client')) {
            return 'Prospects';
        } else if (url.includes('settings/prospects')) {
            return 'Settings';
        } else {
            return 'Home'
        }
    }

    externalRouteTo(url: string) {
        window.open(url, '_blank');
    }
}
