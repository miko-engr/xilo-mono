import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { MessagesDialogComponent } from '../../shared/dialogs/messages-dialog/messages-dialog.component';
import { LogService } from '../../services/log.service';
import { AgentService } from '../../services/agent.service';
import { Agent } from '../../models/agent.model';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    agent: Agent;
    company: Company;

    constructor(
        private agentService: AgentService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private logService: LogService,
    ) { }

    ngOnInit() {
        this.getAgent();
        this.getCompany();
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
        this.agentService.get()
        .subscribe(agent => {
            this.agent = agent['obj'];
        }, error => {
            this.logService.console(error, true);
        });
    }

    async openMessagesDialog() {
        if (!this.company) {
            this.logService.warn('You do not have access to messagess');
            return;
        }
        // const dialogRef = this.dialog.open(MessagesDialogComponent, {
        //     width: '60rem',
        //     panelClass: 'dialog',
        //     data: {agent: this.agent}
        // });
        // dialogRef.afterClosed().subscribe(async(results) => {
        //     if (results) {
        //         const messages = results;
        //         messages.agentMessagesId = this.agent.id;
        //         messages.companyMessagesId = this.agent.companyAgentId;
        //         // this.messagesService.createMessages(messages)
        //         // .subscribe(newMessages => {
        //         //     this.logService.success('New messages created');
        //         // }, error => {
        //         //     this.logService.console(error, true);
        //         // });
        //     }
        // });
    }

}
