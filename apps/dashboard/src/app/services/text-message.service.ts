import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TextMessage } from '../models/text-message.model';
import { map } from 'rxjs/operators';
// import { Socket } from 'ngx-socket-io';

@Injectable()
export class TextMessageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'text-message';
  // getTexts = this.socket.fromEvent<any>('texts');
  // getText = this.socket.fromEvent<any>('text');

  constructor(
    // private socket: Socket,
    private http: HttpClient
    ) {}

  // delete a textMessage
  delete(textMessage: TextMessage) {
    return this.http.delete(this.apiUrl + '/' + textMessage.id);
  }

  // Get one textMessage or by company
  get(textMessage?: TextMessage) {
      const textMessageId = textMessage ? '/' + textMessage.id : '';
      return this.http.get(this.apiUrl + textMessageId);
  }

  // Update a textMessage
  patch(textMessage: TextMessage) {
        return this.http.patch(this.apiUrl + '/edit/' + textMessage.id, textMessage);
  }

  // Update a textMessage async
  patchAsync(textMessage: TextMessage) {
      return this.http.patch(this.apiUrl + '/edit/' + textMessage.id, textMessage)
      .pipe(map(resp => resp['obj'])).toPromise();
  }

  // Create a new textMessage
  post(textMessage: TextMessage) {
      return this.http.post(this.apiUrl, textMessage);
  }

  // Schedule a new textMessage
  scheduleText(textMessage: TextMessage) {
      return this.http.post(this.apiUrl, textMessage);
  }

}
