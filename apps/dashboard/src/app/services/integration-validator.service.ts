import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class IntegrationValidatorService {
    // tslint:disable-next-line: max-line-length
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'integration-validator';

  constructor(
    private http: HttpClient
    ) {}

  // Validate a form
  validateForm(formId: any, type: string, vendor: string, v2?: boolean) {
    console.log(v2);
    return this.http.get(`${this.apiUrl}/${v2 ? 'v2/' : ''}form/${formId}/${type}/${vendor}`);
  }

  // Validate a form field
  validateFormFields(formId: any, type: string, vendor: string) {
    return this.http.get(`${this.apiUrl}/form/fields/${formId}/${type}/${vendor}`);
  }

  // Validate a answer
  validateAnswer(answerId: any, type: string, vendor: string) {
    return this.http.get(`${this.apiUrl}/form/${answerId}/${type}/${vendor}?method=fields`);
  }

  // Validate a client
  validateClient(clientId: any, type: string, vendor: string) {
    return this.http.get(`${this.apiUrl}/client/${clientId}/${type}/${vendor}`);
  }

}
