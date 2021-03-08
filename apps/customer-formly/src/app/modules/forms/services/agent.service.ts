import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Form, Client } from '../models';
import { NEW_CLIENT_URL } from '../../../../app/constants';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

interface UpsertResponse {
  token?: string;
  responses: { objModel: string; id: string }[];
}

@Injectable()
export class AgentService {
  constructor(private http: HttpClient) {}

  getAgentIdByEmail(agent: string) {
    const body = { agent: agent };
    return this.http
      .post(`${NEW_CLIENT_URL}/agent/email`, body)
      .pipe(map(result => result['id']))
      .toPromise();
  }
  getAgentByRoundRobin(formId: any) {
    return this.http
      .get(`${NEW_CLIENT_URL}/agent/round-robin/${formId}`)
      .pipe(map(result => result['obj']))
      .toPromise();
  }
}
