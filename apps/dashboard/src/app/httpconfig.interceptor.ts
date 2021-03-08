import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import moment from 'moment';

@Injectable() export class HttpConfigInterceptor implements HttpInterceptor {

    isTokenMatched: boolean = false
    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    refreshToken() {
        this.authService.refreshToken().subscribe(response => localStorage.setItem('token', response['token']));
        this.isTokenMatched = false;
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token: string = localStorage.getItem('token');
        const isInternalRequest = request.url.indexOf(environment.devApiUrl) !== -1 || request.url.indexOf(environment.apiUrl) !== -1 || request.url.indexOf(environment.stagingApiUrl) !== -1
        if (token && isInternalRequest) {
            const helper = new JwtHelperService();
            const decoded = helper.decodeToken(token);
            const currentTime = moment().toISOString();
            const tokenExpireTime = moment(decoded.exp, "X").subtract(5, 'm').toISOString();
            if (!this.isTokenMatched) {
                this.isTokenMatched = moment(currentTime).isSameOrAfter(tokenExpireTime)
                if (this.isTokenMatched) {
                    this.refreshToken();
                }
            }

            request = request.clone({
                setHeaders: {
                    'x-access-token': token,
                }
            });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error.message ? error.error.message : '',
                    status: error.status
                };
                if ((data['status'] && (+data['status'] === 401 || +data['status'] === 403)) || this.authService.isTokenExpired()) {
                    localStorage.clear();
                    if (this.router.url.toString().includes('agent')) {
                        this.router.navigate(['/auth/agent-login']);
                    } else if (this.router.url.toString().includes('team-signup')) {
                        this.router.navigate(['/team-signup']);
                    } else {
                        this.router.navigate(['/']);
                    }
                }
                console.log('ERROR >>> ', error);
                return throwError(error);
            }));
    }

}
