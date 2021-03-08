import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { Agent } from '../../../models/agent.model';
import { Client } from '../../../models/client.model';
import { TextMessageService } from '../../../services/text-message.service';
import { TextMessage } from '../../../models/text-message.model';
import { Company } from '../../../models/company.model';
import { ClientService } from '../../../services/client.service';
import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';

@Component({
    selector: 'app-messages-create-dialog',
    templateUrl: './messages-create-dialog.component.html',
    styleUrls: ['./messages-create-dialog.component.css'],
  })
  export class MessagesCreateDialogComponent implements OnInit {
    @ViewChild('editor', { static: true }) editorElement: ElementRef;

    agent: Agent;
    client: Client;
    company: Company;
    messages: any[] = [];
    origMessages: any[] = [];
    bodyFilter = '';
    editorActive = false;
    selectedMessageId = null;
    editorType = 'email';
    body = null;
    messageType = null;
    scheduleDate = new Date();
    sendNow = true;
    ENTER_KEYCODE = 13;
    subject = null;
    to = null;
    origClients: Client[] = [];
    clients: Client[] = [];
    dateFilter = '30';
    loading = false;
    clientsRetrieved = false;

    // @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    //   if (event.keyCode === this.ENTER_KEYCODE) {
    //       this.sendMessage();
    //   }
    // }

    constructor(
        private clientService: ClientService,
        private emailService: EmailService,
        private logService: LogService,
        private textMessageService: TextMessageService,
        public dialogRef: MatDialogRef<MessagesCreateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.agent = this.data.agent;
      this.company = this.data.company;
      this.messageType = this.data.type;
      this.getClients();
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    getClients(newDateFilter?: any) {
      const params = {};
      if (!this.agent.canSeeAllClients) {
        params['agentId'] = this.agent.id;
      }
      if (newDateFilter) {
        params['dateRange'] = newDateFilter;
      } else {
        params['dateRange'] = this.dateFilter;
      }
      this.clientService.getClientsBy(params, 'all')
          .subscribe(clients => {
              this.to = '';
              this.clients = clients['obj'];
              this.origClients = this.createCopy(this.clients);
              this.clientsRetrieved = true;
              this.loading = false;
          }, error => {
              this.loading = false;
              this.logService.console(error, false);
          });
    }

    filter(name: string) {
      if (name === '' || !name) {
        this.clients = this.createCopy(this.origClients);
        return;
      }
      name = name.toLowerCase();
      this.clients = this.origClients.filter(client => {
        return this.nameExists(client, name);
      });
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

    assignClient(client: Client) {
      this.client = client;
      this.to = '';
    }

    removeClient() {
      this.client = null;
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

    returnNameFirstLetter() {
      const name = this.returnName(this.client);
      return name ? name.charAt(0) : '?';
    }

    sendMessage() {
      if (confirm('Are you sure you want to send this message?')) {
        if (this.body) {
          if (this.messageType === 'text') {
            const newText: TextMessage = {
              isSentNow: this.sendNow,
              status: 'Replied',
              companyTextMessageId: this.company.id,
              clientTextMessageId: +this.client.id,
              body: this.body,
              to: this.client.phone,
              scheduledDate: this.scheduleDate
            };
            this.textMessageService.scheduleText(newText)
            .subscribe(data => {
              this.logService.success('Text sent');
              this.dialogRef.close();
            }, error => {
              this.logService.console(error, true);
            });
          }
          if (this.messageType === 'email') {
            const newEmail: Email = {
              isSentNow: this.sendNow,
              status: 'Replied',
              companyEmailId: this.company.id,
              clientEmailId: +this.client.id,
              body: this.body,
              subject: this.subject,
              recipient: this.client.email,
              sender: this.agent.email,
              scheduledDate: this.scheduleDate
            };
            this.emailService.scheduleEmail(newEmail)
            .subscribe(data => {
              this.logService.success('Text sent');
              this.dialogRef.close();
            }, error => {
              this.logService.console(error, true);
            });
          }
        } else {
          this.logService.warn('You must add a message before sending');
        }
      }
    }

    setEditorReply(message: any) {
      if (message.to) {
        this.editorType = 'text';
        this.editorElement.nativeElement.focus();
      } else {
        this.editorType = 'email';
        this.editorElement.nativeElement.focus();
      }
    }

    resetEditor() {
      this.editorActive = false;
      this.body = null;
    }

    styleEditorTypeTab(type: string) {
      if (type === this.messageType) {
        return { background: '#7c7fff' };
      } else {
        return { background: '#ccc' };
      }
    }

    switchEditorType(type: string) {
      this.messageType = type;
    }

    closeDialog() {
      this.dialogRef.close();
    }

    styleMenu() {
      if (this.to && this.to !== '') {
        return { display: 'block' }
      }
    }

  }
