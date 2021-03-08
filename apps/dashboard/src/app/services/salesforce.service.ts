import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Client } from "../models/client.model";

@Injectable()
export class SalesforceService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl));

    constructor(private http: HttpClient) { }

    addSalesforceAccount(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/add-account/' + client.id, client);
    }

}
