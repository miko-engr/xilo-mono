import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { User } from '../models/user.model';
import { PlatformManager } from '../models/platform-manager.model';


@Injectable()
export class UserService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'user';

    constructor(private http: HttpClient) {}

    delete(user: User) {
        const userId = user.id ? ('/' + user.id) : '';
        return this.http.delete(this.apiUrl + userId);
    }

    get() {
        const userId = localStorage.getItem('userId');
        return this.http.get(this.apiUrl + '/profile/' + userId);
    }

    getById(user: User) {
            const userId = user.id ? ('/' + user.id) : '';
            return this.http.get(this.apiUrl + '/profile/one' + userId);
    }

    getClients() {
        return this.http.get(this.apiUrl + '/clients/all');
    }

    getActive() {
        return this.http.post(this.apiUrl + '/active', {});
    }

    getByCompany() {
        return this.http.get(this.apiUrl + '/company');
    }

    getLifecycles() {
        return this.http.get(this.apiUrl + '/lifecycles/all');
    }

    patch(user) {
        const userId = localStorage.getItem('userId');
        return this.http.patch(this.apiUrl + '/' + userId, user);
    }

    patchUser(user: User) {
        const userId = user.id ? user.id : '';
        return this.http.patch(this.apiUrl + '/edit' + '/' + userId, user);
    }

    post(user: User) {
        return this.http.post(this.apiUrl, user);
    }

    verify(platformToken: string) {
            platformToken = platformToken
            ? '?platformToken=' + platformToken
            : '';
        return this.http.post(this.apiUrl + '/platform-manager' + platformToken, {});
    }

    updateSetting(data: any) {
        return this.http.post(this.apiUrl + '/update/settings', data);
    }

    sendInvitationEmail(data) {
        data['url'] = window.location.origin + '/';
        return this.http.post(this.apiUrl + '/sendInvitationEmail', data);
    }

}
