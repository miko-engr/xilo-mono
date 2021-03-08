import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { Agent } from '../../../models/agent.model';
import { Client } from '../../../models/client.model';
import { TextMessageService } from '../../../services/text-message.service';
import { TextMessage } from '../../../models/text-message.model';
import { Company } from '../../../models/company.model';
import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';

@Component({
    selector: 'app-messages-list-dialog',
    templateUrl: './messages-list-dialog.component.html',
    styleUrls: ['./messages-list-dialog.component.css'],
  })
  export class MessagesListDialogComponent implements OnInit {
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
    subject = null;

    constructor(
        private emailService: EmailService,
        private logService: LogService,
        private textMessageService: TextMessageService,
        public dialogRef: MatDialogRef<MessagesListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.messages = this.data.messages;
      this.origMessages = this.createCopy(this.messages);
      this.client = this.data.client;
      this.agent = this.data.agent;
      this.company = this.data.company;
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    filter(filterString: string) {
      if (filterString === '' || !filterString) {
        this.messages = this.createCopy(this.origMessages);
        return;
      }
      filterString = filterString.toLowerCase();
      this.messages = this.origMessages.filter(m => {
        m.body = m.body ? m.body.toLowerCase() : '';
        return m.body.includes(filterString);
      });
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

    truncatedText(input: string) {
      if (input && input.length > 50) {
          return input.substring(0, 50) + '...';
      } else {
          return input;
      }
    }

    selectMessage(message: any) {
      const messageId = this.returnMessageId(message);
      if (this.selectedMessageId === messageId) {
        this.selectedMessageId = null;
      } else {
        this.selectedMessageId = messageId;
      }
    }

    isSelected(message: any) {
      return (this.selectedMessageId === this.returnMessageId(message));
    }

    returnMessageId(message: any) {
      return message.to ? `text-${message.id}` : `email-${message.id}`;
    }

    sendMessage() {
      if (this.body) {
        if (this.editorType === 'text') {
          const newText: TextMessage = {
            isSentNow: true,
            status: 'Replied',
            companyTextMessageId: this.company.id,
            clientTextMessageId: +this.client.id,
            body: this.body,
            to: this.client.phone,
            scheduledDate: new Date()
          };
          this.textMessageService.scheduleText(newText)
          .subscribe(data => {
            const createdText = data['obj'];
            newText['id'] = createdText['id'];
            this.messages.push(newText);
            this.logService.success('Text sent');
            this.resetEditor();
          }, error => {
            this.logService.console(error, true);
          });
        }
        if (this.editorType === 'email') {
          const newEmail: Email = {
            isSentNow: true,
            status: 'Replied',
            companyEmailId: this.company.id,
            clientEmailId: +this.client.id,
            body: this.body,
            subject: this.subject,
            recipient: this.client.email,
            sender: this.agent.email,
            scheduledDate: new Date()
          };
          this.emailService.scheduleEmail(newEmail)
          .subscribe(data => {
            const createdEmail = data['obj'];
            newEmail['id'] = createdEmail['id'];
            this.messages.push(newEmail);
            this.logService.success('Text sent');
            this.resetEditor();
          }, error => {
            this.logService.console(error, true);
          });
        }
      } else {
        this.logService.warn('You must add a message before sending');
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

    styleEditor() {
      if (this.editorActive && this.editorType === 'email') {
        return { height: '15rem', transform: 'translateY(-15px)'};
      } else if (!this.editorActive) {
        return { height: '2rem', transform: 'translateY(30px)' };
      }
    }

    styleRow(message: any) {
      if (message.fromClient) {
        return { 'justify-content': 'flex-start' };
      } else {
        return { 'justify-content': 'flex-end' };
      }
    }

    styleMessage(message: any) {
      const styleObj = {};
      if (message.fromClient) {
        styleObj['background'] = '#f0f0f0';
        styleObj['color'] = '#000';
      } else if (!message.fromClient) {
        styleObj['background'] = '#0066FF';
        styleObj['color'] = '#fff';
      }
      if (this.isSelected(message)) {
        styleObj['max-width'] = '50rem';
      } else {
        styleObj['max-width'] = '25rem';
      }
      return styleObj;
    }

    styleEditorTypeTab(type: string) {
      if (type === this.editorType) {
        return { background: '#7c7fff' };
      } else {
        return { background: '#ccc' };
      }
    }

    switchEditorType(type: string) {
      this.editorType = type;
    }

    closeDialog() {
      this.dialogRef.close();
    }

  }
