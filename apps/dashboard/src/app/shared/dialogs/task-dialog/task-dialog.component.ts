import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { Task } from '../../../models/task.model';
import { ClientService } from '../../../services/client.service';
import { Agent } from '../../../models/agent.model';
import { Client } from '../../../models/client.model';

@Component({
    selector: 'app-task-dialog',
    templateUrl: './task-dialog.component.html',
    styleUrls: ['./task-dialog.component.css'],
  })
  export class TaskDialogComponent implements OnInit {
    name = '';
    task: Task = new Task();
    dateFilter = '30';
    loading = false;
    clientsRetrieved = false;
    agent: Agent;
    origClients: Client[] = [];
    clients: Client[] = [];

    constructor(
        private clientService: ClientService,
        private logService: LogService,
        public dialogRef: MatDialogRef<TaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      this.agent = this.data.agent;
      this.getClients();
    }

    assignClient(client: Client) {
      this.task.clientTaskId = +client.id;
      this.task.client = client;
      this.name = '';
    }

    removeClient() {
      this.task.clientTaskId = null;
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    getClients(newDateFilter?: any) {
      this.loading = true;
      const params = {};
      if (!this.agent.canSeeAllClients) {
        params['agentId'] = this.agent.id;
      }
      if (newDateFilter) {
        params['dateRange'] = newDateFilter;
      } else {
        params['dateRange'] = this.dateFilter;
      }
      this.clientService.getClientsBy(params, 1)
          .subscribe(clients => {
              this.name = '';
              this.clients = clients['obj'];
              this.origClients = this.createCopy(this.clients);
              this.clientsRetrieved = true;
              this.loading = false;
          }, error => {
              this.loading = false;
              this.logService.console(error, false);
          });
    }

    saveTask() {
      if (this.taskIsIncomplete()) {
        this.logService.warn('You must complete required fields to continue');
        return;
      }
      if (confirm('Are you sure you want to save these changes?')) {
        this.task.scheduledDate = new Date(this.task.scheduledDate).toString();
        this.dialogRef.close(this.task);
      }
    }

    taskIsIncomplete() {
      return !(this.task.type && this.task.scheduledDate && this.task.clientTaskId);
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

    styleMenu() {
      if (this.name && this.name !== '') {
        return { display: 'block' }
      }
    }

  }
