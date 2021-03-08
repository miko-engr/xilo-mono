import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TeamSignupService {
  apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
  window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'team-signup/';
  constructor(private http: HttpClient) { }

  invite(data) {
    return this.http.post(this.apiUrl + 'invite', data);
  }

  validateInviteToken(token) {
    return this.http.get(this.apiUrl + 'validate-token?token=' + token);
  }

  resendLinkInvitation(data: { email: string }) {
    return this.http.post(this.apiUrl + 'resend-link-invitation', data);
  }

  loginAsEmployee(data) {
    return this.http.post(this.apiUrl + 'login-employee', data);
  }

}
