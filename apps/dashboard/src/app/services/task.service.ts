import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';
import { map } from 'rxjs/internal/operators/map';
import 'rxjs/Rx';

@Injectable()
export class TaskService {
    // tslint:disable-next-line: max-line-length
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'task';

    constructor(
        private http: HttpClient
        ) {}


    createTask(task: Task) {
        return this.http.post(`${this.apiUrl}/create`, task);
    }

    upsertTask(task: Task) {
        return this.http.patch(`${this.apiUrl}/upsert`, task);
    }

    deleteTasks(tasks: number[]) {
        return this.http.patch(`${this.apiUrl}/delete`, {taskIds: tasks});
    }

    getCompanyTasks() {
        return this.http.get(`${this.apiUrl}/company`);
    }

    getAgentTasks() {
        return this.http.get(`${this.apiUrl}/agent`)
        .pipe(map(response => {
            return response['obj'].map(task => {
                task.scheduledDate = new Date(task.scheduledDate.toLocaleString());
                return task;
            });
        }));
    }

    getAgentsTasksBy(paramsObj: any){
        const { limit, offset, type, date } = paramsObj;
        let params = new HttpParams();
        if (limit) { params = params.set('limit', limit); }
        if (offset) { params = params.set('offset', offset); }
        if (type) { params = params.set('type', type); }
        if (date) { params = params.set('date', date); }
        return this.http.get(this.apiUrl + `/agent/tables`, { params }).pipe(
            map(res => res)
        );
    }

    getTaskById(task: Task) {
        const taskId = task.id ? task.id : null;
        return this.http.get(`${this.apiUrl}/id/${taskId}`);
    }

}
