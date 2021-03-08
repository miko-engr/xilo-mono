import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';
import { map } from 'rxjs/operators';

@Injectable()
export class XanatekService {
    // tslint:disable-next-line: max-line-length
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'xanatek';

    constructor(
        private http: HttpClient
        ) {}


    createFile(client: Client, formType: string) {
        return this.http.get(`${this.apiUrl}/${formType}/${client.id}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

}
