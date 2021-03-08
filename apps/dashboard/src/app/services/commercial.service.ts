import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Commercial } from "../models/commercial";


@Injectable()
export class CommercialService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'commercial';

    constructor(private http: HttpClient) {}

    createCommercial(commercial: Commercial) {
        return this.http.post(((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client/commercial', commercial);
    }

    update(commercialClient: Commercial) {
        return this.http.patch(this.apiUrl + '/' + commercialClient.id, commercialClient);
    }




}
