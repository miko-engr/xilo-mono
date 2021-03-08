import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthCanLoadGuard implements CanLoad {
  constructor(
      private router: Router,
      private toastService: ToastService
    ) {
  }

  canLoad(route: Route): boolean {
    if (localStorage.getItem('token') !== null) {
        return true;
      } else {
          this.toastService.showWarn('You must be logged in to access this page');
          this.router.navigate(['auth/login']);
      }
  }
}
