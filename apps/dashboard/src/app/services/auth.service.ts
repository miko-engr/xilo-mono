import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { User } from '../models/user.model';
import { Agent } from '../models/agent.model';
import { PlatformManager } from '../models/platform-manager.model';
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable()
export class AuthService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'auth/';

    constructor(private http: HttpClient) {}

    post(user: User) {
        return this.http.post(this.apiUrl + 'signup', user);
    }

    getToken(): string {
        return localStorage.getItem('token');
    }

    isTokenExpired(token?: string): boolean {
        if (!token) { token = this.getToken(); }
        if (!token) { return true; }

        const helper = new JwtHelperService();

        return helper.isTokenExpired(token);
    }

    checkTokenExpiration() {
        return this.http.get(this.apiUrl + 'expire-check');
    }

    signupAsPlatformManager(platformManager: PlatformManager) {
        return this.http.post(this.apiUrl + 'signup/platform-manager', platformManager);
    }

    login(user: User) {
        return this.http.post(this.apiUrl + 'login-user', user);
    }

    loginAsAgent(agent: Agent) {
        return this.http.post(this.apiUrl + 'login-agent', agent);
    }

    loginAsPlatformManager(platformManager: PlatformManager) {
        return this.http.post(this.apiUrl + 'login/platform-manager', platformManager);
    }

    resetUserPassword(user: User) {
        return this.http.post(this.apiUrl + 'reset-user', user);
    }

    resetAgentPassword(agent: Agent) {
        return this.http.post(this.apiUrl + 'reset-agent', agent);
    }

    refreshToken() {
        return this.http.get(this.apiUrl + 'refreshToken');
    }

}
