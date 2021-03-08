import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private route: ActivatedRoute) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // client-side error
          if (!environment.production) {
            return throwError(error);
          }
        } else {
          if (error.status === 401 || error.status === 403) {
            try {
              localStorage.removeItem('token');
              let queryParams = { ...this.route.snapshot.queryParams };
              delete queryParams.clientId;
              delete queryParams.submissionId;
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: queryParams,
              });
            } catch (err) {
              console.log(err);
            }
          }
          // server-side error
          return throwError(error);
        }
      })
    );
  }
}
