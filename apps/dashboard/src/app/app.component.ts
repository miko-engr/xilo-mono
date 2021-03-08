import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, Event as RouterEvent } from "@angular/router";
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `<ngx-alerts></ngx-alerts>
  <ngx-loading [show]="loading" [config]="{ backdropBorderRadius: '0',fullScreenBackdrop: true }"></ngx-loading>
  <router-outlet >
  </router-outlet>`,
  styles: []
})
export class AppComponent {
  loading = false;

  constructor(
    public router: Router,
    public authService: AuthService
  ) {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
           window['ga']('set', 'page', event.urlAfterRedirects);
           window['ga']('send', 'pageview');
          if (typeof window['hj'] != 'undefined' && environment.production) {
              window['hj']('stateChange', (event.urlAfterRedirects));
          }
          if (typeof (<any>window)['posthog'] != 'undefined' && environment.production) {
            (<any>window)['posthog'].capture('$pageview');
          }
        }
    });
  }

  ngOnInit() {
  }

  navigationInterceptor(event: RouterEvent): void {
      if (event instanceof NavigationStart) {
          this.loading = true;
      }
      if (event instanceof NavigationEnd) {
          this.loading = false;
      }
      // Set loading state to false in both of the below events to hide the spinner in case a request fails
      if (event instanceof NavigationCancel) {
          this.loading = false;
      }
      if (event instanceof NavigationError) {
          this.loading = false;
      }
  }
}
