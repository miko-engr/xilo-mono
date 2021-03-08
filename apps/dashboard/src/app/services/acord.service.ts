
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';
import { map } from 'rxjs/operators';

@Injectable()
export class AcordService {
    // tslint:disable-next-line: max-line-length
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'acord';

    constructor(
        private http: HttpClient
        ) {}


    createXMLFile(client: Client) {
        return this.http.get(`${this.apiUrl}/xml/${client.id}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    createAL3File(client: Client, type: string) {
        return this.http.get(`${this.apiUrl}/al3/${client.id}/${type}`)
        .pipe(map(result =>
            result['obj']
        ));
    }

}
