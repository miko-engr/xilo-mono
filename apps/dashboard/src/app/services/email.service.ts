import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Email } from "../models/email.model";
import { map } from 'rxjs/operators';
// import { Socket } from 'ngx-socket-io';

@Injectable()
export class EmailService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
    window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'email';
    refactorApiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
    window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'email-refactor';
    // getEmails = this.socket.fromEvent<any>('emails');
    // getEmail = this.socket.fromEvent<any>('email');

  constructor(
      private http: HttpClient,
    //   private socket: Socket,
      ) {}

  //delete a email
  delete(email: Email) {
    return this.http.delete(this.apiUrl + '/' + email.id);
  }

  // Get one email or by company
  get(email?: Email) {
      const emailId = email ? '/' + email.id : '';
      return this.http.get(this.apiUrl + emailId);
  }

  // Update a email
  patch(email: Email) {
      return this.http.patch(this.apiUrl + '/edit/' + email.id, email);
  }

  // Update a email async
  patchAsync(email: Email) {
      return this.http.patch(this.apiUrl + '/edit/' + email.id, email)
      .pipe(map(resp => resp['obj'])).toPromise();
  }

  // Create a new email
  post(email: Email) {
      return this.http.post(`${this.apiUrl}/send-email`, email);
  }

  // Schedule email
  scheduleEmail(email: Email) {
      return this.http.post(`${this.apiUrl}/add`, email);
  }
    

    contactRequest(company, client) {
        const body = {
            company,
            client
        };
        return this.http.post(this.apiUrl + '/request', body);
    }

    emailClient(company,client) {
        const body = {
            company,
            client
        };
        return this.http.post(this.apiUrl + '/client', body);
    }

    sendEmail(email) {
      return this.http.post(this.refactorApiUrl, email);
    }

    postOld(company, client) {
        const body = {
            company,
            client
        };
        return this.http.post(this.apiUrl, body);
    }

}
