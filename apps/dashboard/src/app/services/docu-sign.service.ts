import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DocuSignService {
  apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
    window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'docu-sign/';
  constructor(private http: HttpClient) { }

  createContract(createContractData) {
    return this.http.post(this.apiUrl + 'create-contract', createContractData);
  }

  getdocuSign(params) {
    return this.http.get(this.apiUrl + 'sign/' + params);
  }

  docuSignByDocument(email) {
    return this.http.get(this.apiUrl + 'signed-by/' + email);
  }
}
