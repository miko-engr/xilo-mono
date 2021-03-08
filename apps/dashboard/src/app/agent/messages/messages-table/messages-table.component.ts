import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { TextMessage } from '../../../models/text-message.model';
import { Email } from '../../../models/email.model';
import { Client } from '../../../models/client.model';
import { AgentService } from '../../../services/agent.service';
import { Agent } from '../../../models/agent.model';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { Lifecycle } from '../../../models/lifecycle.model';
import { Company } from '../../../models/company.model';
import { MessagesListDialogComponent } from '../../../shared/dialogs/messages-list-dialog/messages-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../../services/client.service';
import { TextMessageService } from '../../../services/text-message.service';
import { EmailService } from '../../../services/email.service';
import { escapeRegExp } from '@angular/compiler/src/util';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-message-table',
    templateUrl: './messages-table.component.html',
    styleUrls: ['./messages-table.component.css']
})
export class MessagesTableComponent implements OnInit, OnDestroy {
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
    name = '';
    loading = false;
    lastMessageRetrieved = false;
    clientsRetrieved = false;
    p = 0;
    agent: Agent;
    company: Company;
    selection = [];
    dateFilter = 'allTime';
    typeFilter = 'all';
    statusFilter = 'all';
    lifecycleFilter = 'all';
    types = [
        'Email', 'Text'
    ];
    statuses = [
        'Read', 'Replied', 'Unread'
    ];
    clientLifecycles: Lifecycle[] = [];
    messages = [];
    origClients: Client[] = [];
    clients: Client[] = [];
    textAlert: Subscription;
    emailAlert: Subscription;

    constructor(
        private agentService: AgentService,
        private clientService: ClientService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private emailService: EmailService,
        private logService: LogService,
        private textMessageService: TextMessageService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.getAgent();
        this.getCompany();
        this.getLifecycles();
        this.syncMessages();
    }

    ngOnDestroy() {
        this.textAlert.unsubscribe();
        this.emailAlert.unsubscribe();
    }

    syncMessages() {
        // this.textAlert = this.textMessageService.getTexts
        // .subscribe(data => {
        //     if (data['status'] && data.status === true) {
        //         this.getClients();
        //     }
        // }, error => {
        //     this.logService.console(error);
        // });
        // this.emailAlert = this.emailService.getEmails
        // .subscribe(data => {
        //     if (data['status'] && data.status === true) {
        //         this.getClients();
        //     }
        // }, error => {
        //     this.logService.console(error);
        // });
    }

    createCopy(orig) {
        return JSON.parse(JSON.stringify(orig));
    }

    getCompany() {
        this.companyService.getByAgent()
        .subscribe(company => {
            this.company = company['obj'];
        }, error => {
            this.logService.console(error, true);
        });
    }

    getAgent() {
        this.loading = true;
        this.agentService.get()
        .subscribe(agent => {
            this.agent = agent['obj'];
            this.getClients();
        }, error => {
            this.loading = true;
            this.logService.console(error, true);
        });
    }

    getLifecycles() {
        this.agentService.getLifecycles()
            .subscribe(agent => {
                this.clientLifecycles = agent['obj'].company.lifecycles;
            }, error => {
                this.logService.console(error, true);
            });
    }

    getClients() {
        this.clientService.getClientsWithMessages()
        .subscribe(clients => {
            this.clients = clients;
            this.origClients = this.createCopy(this.clients).filter(client => {
                return ((client.emails && client.emails.length > 0) ||
                        (client.textMessages && client.textMessages.length > 0));
            });
            this.clients = this.clients.filter(client => {
                return ((client.emails && client.emails.length > 0) ||
                        (client.textMessages && client.textMessages.length > 0));
            });
            for (let i = 0; i < this.clients.length; i++) {
                const client = this.clients[i];
                const origClient = this.origClients[i];
                this.messages.push(...client.emails);
                this.messages.push(...client.textMessages);
                client.lastMessage = this.returnLastMessage(client);
                origClient.lastMessage = this.returnLastMessage(origClient);
                if (!this.clients[i+1]) {
                    this.lastMessageRetrieved = true;
                }
            }
            this.clients.sort((a, b) => {
                return (+(new Date(b.lastMessage['scheduledDate'])) - +(new Date(a.lastMessage['scheduledDate'])));
            });
            this.origClients.sort((a, b) => {
                return (+(new Date(a.lastMessage['scheduledDate'])) - +(new Date(a.lastMessage['scheduledDate'])));
            });
            if (this.queryParams && (this.queryParams['type'] || this.queryParams['date'])) {
                // this.filterByParams(null, null, this.queryParams);
            }
            if (this.queryParams['p']) {
                this.p = +this.queryParams['p'];
            }
            this.selection = [];
            this.clientsRetrieved = true;
            this.lastMessageRetrieved = true;
            this.loading = false;
        }, error => {
            this.logService.console(error, true);
            this.clientsRetrieved = true;
            this.loading = false;
        });
    }

    deleteMessage() {
        if (confirm('Are you sure you want to delete these clients')) {
            this.loading = true;
            // if (this.selection && this.selection.length > 0) {
            //     this.taskService.deleteTasks(this.selection)
            //     .subscribe(data => {
            //         this.logService.success('Tasks deleted');
            //         this.getTasks();
            //         this.loading = false;
            //     }, error => {
            //         this.logService.console(error, true);
            //         this.loading = false;
            //     });
            // }
        }
    }

    removeDeletedMessages() {
        for (let i = 0; i < this.selection.length; i++) {
            const id = this.selection[i];
            const index = this.origClients.findIndex(message => +message.id === +id);
            if (index && index > -1) {
                this.origClients.splice(index, 1);
            }
            if (!this.selection[i + 1]) {
                this.resetClients();
                this.selection = [];
            }
        }
    }

    filter(name: string) {
        if (!name || name === '') {
            this.clients = this.createCopy(this.origClients);
            // this.filterByParams(null, null, this.queryParams);
            return;
        }
        name = name.toLowerCase();
        this.clients = this.origClients.filter(client => {
          return this.nameExists(client, name);
        });
    }

    // filterByParams(paramType: string, value: string, params?: any) {
    //     if (params) {
    //         if (params['date']) {
    //             paramType = 'date';
    //             value = params['date'];
    //         } else if (params['type']) {
    //             paramType = 'type';
    //             value = params['type'];
    //         }
    //     }
    //     if (paramType === 'date' && value) {
    //         if (value === 'allTime') {
    //             this.resetTasks();
    //             return;
    //         }
    //         this.clients = this.createCopy(this.origClients);
    //         const today = new Date();
    //         const newDate = new Date();
    //         newDate.setDate(newDate.getDate() - +value);
    //         this.clients = this.origClients.filter(message => {
    //             const schedDate = new Date(message.scheduledDate);
    //             return (schedDate >= today && schedDate <= newDate);
    //         });
    //         this.dateFilter = value;
    //     } else if (paramType === 'type') {
    //         if (value === 'all') {
    //             this.resetTasks();
    //             return;
    //         }
    //         this.clients = this.origClients.filter(message => (message.type ? message.type.toLowerCase() === value.toLowerCase() : false));
    //         this.typeFilter = value;
    //     }
    // }

    resetClients() {
        this.clients = this.createCopy(this.origClients).filter(message => !message.isCompleted);
        this.name = '';
    }

    nameExists(client: Client, value: string) {
        const name = this.returnName(client) ? this.returnName(client).toLowerCase() : null;
        value = value ? value.toLowerCase() : null;
        if (name && value) {
          return (name.includes(value));
        } else {
          return false;
        }
    }

    setParams(type: string, value: string) {
        this.queryParams[type] = value;
        if (type === 'date') {
            delete this.queryParams['type'];
            this.dateFilter = 'allTime';
        } else if (type === 'type') {
            delete this.queryParams['date'];
            this.typeFilter = 'all';
        }
        if (type !== 'page') {
            // this.filterByParams(type, value);
        }
        this.router.navigate([], {relativeTo: this.route, queryParams: this.queryParams});
    }

    styleStatus(status: string) {
        if (status === 'Read') {
            return { background: '#ffff00' }
        } else if (status === 'Unread') {
            return { background: 'red', color: '#fff' };
        }
    }

    styleDueDate(dueDate: string) {
        if (dueDate.includes('ago')) {
            return { background: 'rgb(250,250,0, .25)' }
        }
    }

    isAllSelected() {
        const numSelected = this.selection.length;
        const numRows = this.clients.length;
        return numSelected === numRows;
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Client, index?: string): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.isSelected(this.returnIndex(index)) ? 'deselect' : 'select'} row ${this.returnIndex(index) + 1}`;
    }

    isSelected(clientId: any) {
        return this.selection.includes(clientId);
    }

    async selectRow(clientId: any) {
        const exists = this.selection.includes(clientId);
        if (exists) {
          const fIndex = this.selection.findIndex(ic => +clientId === +ic);
          this.selection.splice(fIndex, 1);
        } else {
          this.selection.push(clientId);
        }
    }

    returnIndex(i: any) {
        if (+i >= 0)  {
            if (this.p > 1) {
              return ((this.p * 10) + +i )
            } else {
                return +i;
            }
        } else {
            return null;
        }
    }

    returnName(client: Client) {
        if (client.business && client.business.entityName) {
            return client.business.entityName;
        } else if (client.firstName && client.lastName) {
            return `${client.firstName} ${client.lastName}`;
        } else if (client.fullName) {
            return `${client.fullName}`;
        } else if (client.firstName) {
            return `${client.firstName} --`;
        } else if (client.lastName) {
            return `-- ${client.lastName}`;
        } else if (client.drivers && client.drivers[0]) {
            const driver = client.drivers[0];
            if (driver.applicantGivenName && driver.applicantSurname) {
                return `${driver.applicantGivenName} ${driver.applicantSurname}`;
            } else if (driver.fullName) {
                return `${driver.fullName}`;
            } else if (driver.applicantGivenName) {
                return `${driver.applicantGivenName} --`;
            } else if (driver.applicantSurname) {
                return `-- ${driver.applicantSurname}`;
            }
        } else {
          return null;
        }
    }

    returnDueDays(schedDate: any) {
        const today = new Date();
        const scheduled = new Date(schedDate);
        const msInDay = 24 * 60 * 60 * 1000;
        if (Math.abs(+today - +scheduled) <= msInDay) {
            const diff = Math.round((+today - +scheduled) / 36e5);
            if (diff === 0) {
                return 'Due Now';
            }
            const message = (+today > +scheduled) ? 
                            `Due${diff === 0 ? '' : ` ${diff}`} ${this.returnHourString(diff)}${diff === 0 ? '' : ' ago'}` :
                            (+today < +scheduled) ? `Due in ${Math.abs(diff)} ${this.returnHourString(Math.abs(diff))}` : 'Due Today';
            return message;
        } else {
            scheduled.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diff = (+today - +scheduled) / msInDay;
            const message = (+today > +scheduled) ? `Due ${diff} ${this.returnDayString(diff)} ago` :
                            (+today < +scheduled) ? `Due in ${Math.abs(diff)} ${this.returnDayString(Math.abs(diff))}` : 'Due Today';
            return message;
        }
    }

    returnDayString(value) {
        if (value === 1) {
            return 'day';
        } else {
            return 'days';
        }
    }

    returnHourString(value) {
        if (value === 1) {
            return 'hour';
        } else if (value === 0) {
            return 'Now';
        } else {
            return 'hours';
        }
    }

    returnType(client: Client) {
        if ((client.textMessages && client.textMessages.length > 0) &&
            (client.emails && client.emails.length > 0)) {
                return 'Email, Text';
        } else if (client.textMessages && client.textMessages.length > 0) {
            return 'Text';
        } else if (client.emails && client.emails.length > 0) {
            return 'Email';
        } else {
            return 'XX';
        }
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    returnLastMessageData(client: Client, type: string) {
        if (this.lastMessageRetrieved) {
            if (type === 'status') {
                return client.lastMessage['status'] ? client.lastMessage['status'] : 'None';
            } else if (type === 'body' && client.lastMessage['body']) {
                return this.replaceAll(client.lastMessage['body'], '\n', '');
            } else if (type === 'sentDate') {
                return client.lastMessage['scheduledDate'];
            } else if (type === 'style-status') {
                return this.styleStatus(client.lastMessage['status']);
            } else {
                return '';
            }
        } else {
            if (type === 'style-status') {
                return {}
            }
            return 'XX';
        }
    }

    returnLastMessage(client: Client) {
        const messages = [];
        messages.push(...client.textMessages);
        messages.push(...client.emails);
        const mostRecentDate = new Date(Math.max.apply(null, messages.map( e => {
            return new Date(e.scheduledDate);
        })));
        const mostRecentObject = messages.filter( e => {
            const d = new Date( e.scheduledDate );
            return d.getTime() == mostRecentDate.getTime();
        })[0];
        return mostRecentObject;
    }

    truncatedText(input: string) {
        if (input && input.length > 90) {
            return input.substring(0, 90) + '...';
        } else {
            return input;
        }
     }

     returnAnalytics(type: string) {
         if (this.clientsRetrieved) {
            const copiedMessages = this.createCopy(this.messages);
            if (type === 'totalUnread') {
                const unreadMessages = copiedMessages.filter(m => {
                    return m.status === 'Unread';
                });
                return unreadMessages.length;
            } else if (type === 'unreadEmails') {
                const unreadEmails = copiedMessages.filter(m => {
                    return (m.recipient && m.status === 'Unread');
                });
                return unreadEmails.length;
            } else if (type === 'unreadTexts') {
                const unreadTexts = copiedMessages.filter(m => {
                    return (m.to && m.status === 'Unread');
                });
                return unreadTexts.length;
            } else if (type === 'totalConversations') {
                return this.origClients.length;
            } else if (type === 'totalSentMonth') {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const sentMonth = copiedMessages.filter(m => {
                    const sentDate = new Date(m.scheduledDate);
                    return (m.status === 'Replied' && (sentDate >= firstDay && sentDate <= lastDay));
                });
                return sentMonth.length;
             } else if (type === 'totalSentToday') {
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                const end = new Date(start.getTime());
                end.setHours(23, 59, 59, 999);
                const sentToday = copiedMessages.filter(m => {
                    const sentDate = new Date(m.scheduledDate);
                    return (m.status === 'Replied' && (sentDate >= start && sentDate <= end));
                });
                return sentToday.length;
             } else {
                 return '0';
             }
         } else {
             return 'XX';
         }
     }

     async openMessagesDialog(client: Client) {
        if (!this.company || !this.company.hasSalesAutomation) {
            this.logService.warn('You do not have access to tasks');
            return;
        }
        let clientMessages = [];
        clientMessages.push(...client.emails);
        clientMessages.push(...client.textMessages);
        clientMessages = clientMessages.sort((a, b) => {
            return (+(new Date(a.scheduledDate)) - +(new Date(b.scheduledDate)));
        });
        clientMessages.map(async(m) => {
            if (m.status === 'Unread') {
                m.status = 'Read';
                if (m.to) {
                    const data = await this.textMessageService.patchAsync(m);
                } else if (m.subject) {
                    const data = await this.emailService.patchAsync(m);
                }
            }
            return m;
        });
        const dialogRef = this.dialog.open(MessagesListDialogComponent, {
            width: '60rem',
            panelClass: ['dialog', 'hide-scroll-bar'],
            data: {agent: this.agent, messages: clientMessages, client: client, company: this.company }
        });
        dialogRef.afterClosed().subscribe(async(results) => {

        });
    }

}
