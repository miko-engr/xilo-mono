import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from "@angular/common/http";


@Injectable()
export class ResetPasswordService {
  apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'reset-password/';

  constructor(private http: HttpClient) { }

  verifyToken(token: string, type: string) {
    const verifyUrl = `${this.apiUrl + (type === 'agent' ? 'verify-agent' : 'verify-user')}?token=${token}`;
    return this.http.get(verifyUrl);
  }

  updatePassword(token: string, obj: any, type: string) {
    const updateUrl = `${this.apiUrl + (type === 'agent' ? 'update-agent' : 'update-user')}?token=${token}`;
    return this.http.post(updateUrl, obj);
  }

}
