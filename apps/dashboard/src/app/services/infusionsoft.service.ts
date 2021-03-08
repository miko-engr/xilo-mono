import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class InfusionsoftService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'infusionsoft/';

    constructor(private http: HttpClient) { }

    /*
    *
    * infusionsoft APIs
    *  
    */

    getAuthUrl() {
    return this.http.get(this.apiUrl + 'auth/url');
    }

    authorizeInfusionsoft(code) {
        return this.http.get(this.apiUrl + `auth?code=${code}`);
    }

    addContact(clientId, companyId) {
        return this.http.put(this.apiUrl + `upsert/${clientId}/${companyId}`, {});
    }

    validateToken(companyId) {
        return this.http.get(this.apiUrl + `validate-token/${companyId}`)
    }
}
