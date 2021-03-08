import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { PlatformManager } from "../models/platform-manager.model";
import { User } from "../models/user.model";

@Injectable()
export class PlatformManagerService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'platform-manager';

    constructor(private http: HttpClient) {}

    addAgency(user: User) {
        return this.http.post(this.apiUrl + '/agency', user);
    }

    delete(platformManager: PlatformManager) {
        return this.http.delete(this.apiUrl);
    }

    getById() {
        return this.http.get(this.apiUrl);
    }

    getLifecycleAnalytics() {
        return this.http.get(this.apiUrl + '/lifecycle-analytics');
    }

    patch(platformManager: PlatformManager) {
        return this.http.patch(this.apiUrl, platformManager);
    }

    post(platformManager: PlatformManager) {
        return this.http.post(this.apiUrl, platformManager); 
    }

}
