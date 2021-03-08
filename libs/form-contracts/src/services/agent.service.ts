import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class AgentService {
    NEW_CLIENT_URL = `${environment.apiUrl}new/client`;

    constructor(private http: HttpClient) {}

    getAgentIdByEmail(agent: string) {
        const body = { agent: agent };
        return this.http
        .post(`${this.NEW_CLIENT_URL}/agent/email`, body)
        .pipe(map(result => result['id']))
    }
    getAgentByRoundRobin(formId: any) {
        return this.http
        .get(`${this.NEW_CLIENT_URL}/agent/round-robin/${formId}`)
        .pipe(map(result => result['obj']))
    }
}
