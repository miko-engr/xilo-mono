import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class NotificationService {
  apiUrl = `${environment.apiUrl}lifecycle-email`;
  note = null;

  constructor(private http: HttpClient) {}

  sendNotification(params: {
    clientId: any;
    formId: any;
    version: any;
    agentId?: any;
    attachPdf?: boolean;
    submissionId?: any;
  }) {
    const {
      clientId,
      formId,
      version,
      agentId,
      attachPdf,
      submissionId,
    } = params;
    const ids = [
      { clientId },
      { formId },
      { version },
      { agentId },
      { attachPdf },
      { submissionId },
    ];
    let query = '';
    for (let i = 0; i < ids.length; i++) {
      const param = ids[i];
      const paramId = Object.keys(param)[0];
      if (param[paramId] !== null) {
        const operator = query.length === 0 ? '?' : '&';
        query += `${operator}${paramId}=${param[paramId]}`;
      }
    }
    return this.http.post(`${this.apiUrl}/v2-email${query}`, {});
  }
}
