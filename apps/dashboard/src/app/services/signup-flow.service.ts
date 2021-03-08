import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable()
export class SignupFlowService {
  apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
  window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'signup-flow/';
  isChanged: Boolean = false;
  @Output() updateStep: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  signupFlow(user: User) {
    return this.http.post(this.apiUrl + 'signup', user);
  }

  createPassword(data: any) {
    return this.http.post(this.apiUrl + 'create-password', data);
  }

  updateCurrentStep(data) {
    this.updateStep.emit(data);
  }

  sendIntegrationActivationEmails(data) {
    return this.http.post(this.apiUrl + 'connected-integration-instruction-notifier', data)
  }

  sendNewUserInfoEmailsToXILOTeam(data) {
    return this.http.post(this.apiUrl + 'usersignup-info-notifier-to-xiloteam', data)
  }
}
