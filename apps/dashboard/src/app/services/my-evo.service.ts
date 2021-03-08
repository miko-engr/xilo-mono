import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class MyEvoService {
    // tslint:disable-next-line: max-line-length
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'my-evo';

    constructor(
        private http: HttpClient
        ) {}


    createFile(clientIds: any) {
        const body = { clientIds: clientIds };
        return this.http.post(`${this.apiUrl}`, body)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

}
