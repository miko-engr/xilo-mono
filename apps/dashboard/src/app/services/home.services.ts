import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Home } from "../models/home.model";


@Injectable()
export class HomeService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'home';

    constructor(private http: HttpClient) {}

    createHome(home: Home) {
        return this.http.post(this.apiUrl + '/client', home);
    }

    update(homeClient: Home) {
        return this.http.patch(this.apiUrl + '/' + homeClient.id, homeClient);
    }




}
