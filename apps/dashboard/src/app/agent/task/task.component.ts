import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../../shared/dialogs/task-dialog/task-dialog.component';
import { TaskService } from '../../services/task.service';
import { LogService } from '../../services/log.service';
import { AgentService } from '../../services/agent.service';
import { Agent } from '../../models/agent.model';
import { Task } from '../../models/task.model';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    agent: Agent;
    company: Company;

    constructor(
        private agentService: AgentService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private logService: LogService,
        private taskService: TaskService
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

}
