import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';
import { LogService } from './log.service';
import { map } from 'rxjs/operators';
import { Integration } from '../models/integration.model';

@Injectable()
export class IntegrationService {
  // tslint:disable-next-line: max-line-length
  apiUrl = `${environment.apiUrl}integration`;
  integrationUrl = `${environment.apiUrl}integration-mapping`;
  rawApiUrl = environment.apiUrl;
  apiAnswerUrl = `${environment.apiUrl}answer`;
  answers;
  client: Client;
  fileString = ``;

  constructor(private logService: LogService, private http: HttpClient) {}

  // V2 Integration Logic
  integrateWithSubmissions(params: {
    formId: string;
    clientId: string;
    isTest?: boolean;
  }) {
    const query = params.isTest ? '?test=true' : '';
    return this.http
      .post(`${this.integrationUrl}/integration-mapping-submission${query}`, params)
      .pipe(
        map((data) => {
          return data['obj'];
        })
      );
  }

  // V2 Integration Logic
  createIntegration(integration: Integration) {
    return this.http
      .post(`${this.rawApiUrl}v2-integration/create`, integration)
      .pipe(
        map((data) => {
          return data['obj'];
        })
      );
  }

  updateIntegration(integration: Integration) {
    return this.http.put(`${this.rawApiUrl}v2-integration/update`, integration);
  }

  removeIntegration(id: any) {
    return this.http.delete(`${this.rawApiUrl}v2-integration/remove/${id}`);
  }

  // OLD INTEGRATION LOGIC
  createQQContact(client: Client) {
    return this.http
      .put(`${this.rawApiUrl}qqc/contact/${client.id}`, {})
      .pipe(
        map((res) => {
          return res['obj'];
        })
      )
      .toPromise();
  }

  createQQPolicyJSON(client: Client) {
    if (!client) {
      return this.logService.console({ success: false }, true);
    }

    const data = {
      CustomerId: client.qqContactId,
      PolicyType: 'S',
      Term: 'A',
      // LobId: 48,
      PolicyNumber: 'N/A',
    };
    return data;
  }

  createQQTaskJSON(client: Client) {
    if (!client) {
      return this.logService.console({ success: false }, true);
    }

    const data = {
      Subject: `Follow Up With ${client.firstName} ${client.lastName}`,
      Description: 'Reach out on their auto policy',
      StartDate: this.returnNewDate(new Date(), 0),
      DueDate: this.returnNewDate(new Date(), 1),
      Status: 'A',
    };
    return data;
  }

  createQQQuoteJSON(client: Client) {
    if (!client) {
      return this.logService.console({ success: false }, true);
    }

    const data = {
      QuoteStatus: 'A',
      QuoteSubStatus: 'B',
      PolicyID: client.qqPolicyId,
    };
    return data;
  }

  /* Infusionsoft */

  getInfusionsoftTags(companyId: any) {
    return this.http
      .get(`${this.rawApiUrl}infusionsoft/list-tags/${companyId}`)
      .pipe(map((result) => result['obj']));
  }

  /*
    EZLYNX
    */

  createEZLynxContact(client: Client, formType: string) {
    const type: string =
      formType === 'auto'
        ? 'Auto'
        : formType === 'home'
        ? 'Home'
        : formType.includes('form')
        ? 'form'
        : formType;
    const path = 'contact';
    return this.http.put(
      `${this.apiUrl}/ezlynx/${path}/${client.id}/${type}`,
      {}
    );
  }

  createWealthboxContact(client: Client) {
    const apiUri = this.apiUrl.replace('integration', '');
    return this.http.post(`${apiUri}wealthbox/createContact/${client.id}`, {});
  }

  createWealthboxTask(client: Client) {
    const apiUri = this.apiUrl.replace('integration', '');
    return this.http.post(`${apiUri}wealthbox/createTask/${client.id}`, {});
  }

  createRicochetContact(client: Client) {
    const apiUri = this.apiUrl.replace('integration', '');
    return this.http.post(`${apiUri}ricochet/upsert/${client.id}`, {});
  }

  returnNewDate(date: Date, daysAfter: number) {
    const newDate = new Date(date);
    const dd = newDate.getDate() + daysAfter;
    const mm = newDate.getMonth() + 1;
    const y = newDate.getFullYear();

    return y + '-' + mm + '-' + dd;
  }

  getAnswers(formType?: string) {
    const obj = {
      isAuto: formType === 'auto' ? true : false,
      isHome: formType === 'home' ? true : false,
    };
    return this.http.patch(`${this.apiAnswerUrl}/company/form`, obj);
  }

  createTurboraterContact(client: Client, formType: string) {
    const type: string = formType === 'auto' ? 'Auto' : 'Home';
    return this.http.put(
      `${this.apiUrl}/turborater/contact/${client.id}/${type}`,
      {}
    );
  }

  createQuoteRushContact(client: Client, type: string) {
    return this.http.get(
      `${this.rawApiUrl}quote-rush/upsert/${type}/${client.id}`
    );
  }

  createCabrilloContact(client: Client, formType: string) {
    const type: string = formType === 'auto' ? 'Auto' : 'Home';
    return this.http.put(
      `${this.apiUrl}/cabrillo/contact/${client.id}/${type}`,
      {}
    );
  }

  createNowCerts(client: Client) {
    return this.http.put(`${this.apiUrl}/nowCerts/contact/${client.id}`, {});
  }

  createAppulate(appulateData) {
    return this.http.put(`${this.apiUrl}/appulate/contact`, appulateData);
  }

  createAMS360Contact(client: Client) {
    const newUrl = this.apiUrl.replace('/integration', '');
    return this.http
      .put(`${newUrl}/ams360/update-customer/${client.id}`, {})
      .pipe(map((result) => result))
      .toPromise();
  }

  updateAMSDetails() {
    const newUrl = this.apiUrl.replace('/integration', '');
    return this.http
      .get(`${newUrl}/ams360/update-details/`)
      .pipe(map((result) => result))
      .toPromise();
  }

  createCommercialEzlynxContact(client: Client, type: string) {
    return this.http.put(
      `${this.apiUrl}/commercial-ezlynx/contact/${client.id}/${type}`,
      {}
    );
  }

  // PARTNER XE
  createPartnerXEFile(clientIds: any) {
    const body = { clientIds: clientIds };
    const newUrl = this.apiUrl.replace('integration', '');
    return this.http
      .post(`${newUrl}/partner-xe/create-clients/client`, body)
      .pipe(map((result) => result['obj']))
      .toPromise();
  }

  removeIntegrations(formId: string) {
    return this.http.delete(`${this.apiUrl}/remove/${formId}`);
  }
}
