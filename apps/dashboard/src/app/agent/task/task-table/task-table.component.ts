import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { Task } from '../../../models/task.model';
import { Client } from '../../../models/client.model';
import { TaskService } from '../../../services/task.service';
import { AgentService } from '../../../services/agent.service';
import { Agent } from '../../../models/agent.model';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Options } from '../../../models/options.model';


@Component({
    selector: 'app-task-table',
    templateUrl: './task-table.component.html',
    styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {
    name = '';
    loading = false;
    tasksRetrieved = false;
    pageIndex: number = 1;
    date = null;
    type = null;
    search: string;
    totalCount = 0;
    selection = [];
    tasks: Task[] = [];
    origTasks: Task[] = [];
    completedTasks: Task[] = [];
    types = [
        'Call', 'Email', 'Text', 'Work', 'Other'
    ]
    options: Options = new Options();

    constructor(
        private logService: LogService,
        private taskService: TaskService,
    ) { }

    ngOnInit() {
        this.getTaskList();
    }

    filter(type: string, event: string) {
        type === 'type' ? this.options.type = event : null;
        type === 'date' ? this.options.date = event : null;
        this.getTaskList();
    }

    getTaskList() {
        this.taskService.getAgentsTasksBy(this.options)
        .subscribe(tasks => {
            this.tasksRetrieved = true;
            this.tasks = tasks['obj'].rows;
            this.totalCount = tasks['obj'].count;
            this.loading = false;
        }, error => {
            this.loading = false;
            this.logService.console(error, false);
        });
    }

    pageChange(pageIndex) {
        this.options.offset = (pageIndex - 1) * 10 + 1;
        this.options.limit = '10';
        this.pageIndex = pageIndex
        this.getTaskList();
    }

    createCopy(orig) {
        return JSON.parse(JSON.stringify(orig));
    }

    completeTask(task: Task) {
        if (confirm('Are you sure you want to complete this task?')) {
            this.loading = true;
            const today = new Date().toLocaleString();
            const completeDay = new Date(today);
            task.completedDate = completeDay;
            task.isCompleted = true;
            this.taskService.upsertTask(task)
            .subscribe(data => {
                this.logService.success('Task updated');
                this.getTaskList();
                this.loading = false;
            }, error => {
                this.logService.console(error, true);
                this.loading = false;
            })
        }
    }

    deleteTasks() {
        if (confirm('Are you sure you want to delete these tasks')) {
            this.loading = true;
            if (this.selection && this.selection.length > 0) {
                this.taskService.deleteTasks(this.selection)
                .subscribe(data => {
                    this.logService.success('Tasks deleted');
                    this.getTaskList();
                    this.loading = false;
                }, error => {
                    this.logService.console(error, true);
                    this.loading = false;
                });
            }
        }
    }

    removeDeletedTasks() {
        for (let i = 0; i < this.selection.length; i++) {
            const id = this.selection[i];
            const index = this.origTasks.findIndex(task => +task.id === +id);
            if (index && index > -1) {
                this.origTasks.splice(index, 1);
            }
            if (!this.selection[i + 1]) {
                this.resetTasks();
                this.selection = [];
            }
        }
    }

    resetTasks() {
        this.tasks = this.createCopy(this.origTasks).filter(task => !task.isCompleted);
        this.name = '';
    }

    stylePriority(priority: string) {
        if (priority === 'Medium') {
            return { background: '#ffff00' }
        } else if (priority === 'High') {
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
        const numRows = this.tasks.length;
        return numSelected === numRows;
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Task, index?: string): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.isSelected(this.returnIndex(index)) ? 'deselect' : 'select'} row ${this.returnIndex(index) + 1}`;
    }

    isSelected(taskId: any) {
        return this.selection.includes(taskId);
    }

    async selectRow(taskId: any) {
        const exists = this.selection.includes(taskId);
        if (exists) {
          const fIndex = this.selection.findIndex(ic => +taskId === +ic);
          this.selection.splice(fIndex, 1);
        } else {
          this.selection.push(taskId);
        }
    }

    returnIndex(i: any) {
        if (+i >= 0)  {
            if (this.pageIndex > 1) {
              return ((this.pageIndex * 10) + +i )
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

    truncatedText(input: string) {
        if (input && input.length > 90) {
            return input.substring(0, 90) + '...';
        } else {
            return input;
        }
     }

     returnAnalytics(type: string, taskType?: string) {
         if (!(type === 'completedMonth' || type === 'completedToday') && 
            this.tasksRetrieved && this.origTasks && this.origTasks.length > 0) {
             if (type === 'total') {
                return this.origTasks.length;
             } else if (type === 'today') {
                 const todaysTasks = this.origTasks.filter(task => {
                     return (this.returnDueDays(task.scheduledDate).toLowerCase().includes('hour') ||
                            this.returnDueDays(task.scheduledDate).toLowerCase().includes('now'));
                 });
                 return todaysTasks.length;
             } else if (type === 'type') {
                 const typeTasks = this.origTasks.filter(task => {
                     return task.type === taskType;
                 });
                 return typeTasks.length;
             }
         } else if (!(type === 'completedMonth' || type === 'completedToday') &&
                this.tasksRetrieved && (this.origTasks && this.origTasks.length === 0)) {
                return '0';
         } else if ((type === 'completedMonth' || type === 'completedToday') &&
                    this.tasksRetrieved && this.completedTasks && this.completedTasks.length > 0) {
            if (type === 'completedMonth') {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const completedMonth = this.completedTasks.filter(task => {
                    const completeDate = new Date(task.completedDate);
                    return (completeDate >= firstDay && completeDate <= lastDay);
                });
                return completedMonth.length;
             } else if (type === 'completedToday') {
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                const end = new Date(start.getTime());
                end.setHours(23, 59, 59, 999);
                const completedToday = this.completedTasks.filter(task => {
                    const completeDate = new Date(task.completedDate);
                    return (completeDate >= start && completeDate <= end);
                });
                return completedToday.length;
             }
         } else if ((type === 'completedMonth' || type === 'completedToday') &&
                this.tasksRetrieved && this.completedTasks && this.completedTasks.length === 0) {
            return '0';
         } else {
             return 'XX';
         }
     }

}
