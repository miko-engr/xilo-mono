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
import { environment } from '../../environments/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('token');
    const isInternalRequest =
      request.url.indexOf(environment.devApiUrl) !== -1 ||
      request.url.indexOf(environment.apiUrl) !== -1 ||
      request.url.indexOf(environment.stagingApiUrl) !== -1 ||
      request.url.indexOf(environment.localApiUrl) !== -1;
    if (token && isInternalRequest) {
      request = request.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // client-side error
          if (!environment.production) {
            return throwError(error);
          }
        } else {
          // server-side error
          return throwError(error);
        }
      })
    );
  }
}
