import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Company } from '../models/company.model';
import { Client } from '../models/client.model';
import { Form } from '../models/form.model';

@Injectable()
export class LifecycleEmailService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) +
    'lifecycle-email';

  constructor(private http: HttpClient) {}

  sendEmail(client: Client, company: Company) {
      return this.http.post(`${this.apiUrl}/${client.id}/${company.id}/assigned`, {}).toPromise();
  }

}
