import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/customer-formly/src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    const isInternalRequest =
      request.url.includes(environment.apiUrl) ||
      request.url.includes(environment.localApiUrl);
    if (token && isInternalRequest) {
      request = request.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }
    return next.handle(request).pipe(
      tap((response: HttpResponse<any>) => {
        const token = response?.body?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      })
    );
  }
}
