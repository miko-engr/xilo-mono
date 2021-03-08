
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';
import { map } from 'rxjs/operators';

@Injectable()
export class PLRaterService {
    // tslint:disable-next-line: max-line-length
    apiUrl = `${environment.apiUrl}pl-rater`;

    constructor(
        private http: HttpClient
        ) {}

    createAL3File(client: Client, type: string) {
        return this.http.get(`${this.apiUrl}/al3/${client.id}/${type}`)
        .pipe(map(result =>
            result['obj']
        ));
    }

    getAL3Groups(type: string) {
        return this.http.get(`${this.apiUrl}/groups/${type}`)
        .pipe(map(result =>
            result['obj']
        ));
    }

    getAL3Elements(group: string) {
        return this.http.get(`${this.apiUrl}/elements/${group}`)
        .pipe(map(result =>
            result['obj']
        ));
    }

    setDefaultsToForm(formId: number, type: string) {
        return this.http.post(`${this.apiUrl}/defaults/${type}/${formId}`, {})
        .pipe(map(result =>
            result['obj']
        ));
    }

}
