import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AlertControllerService} from "../services/alert.service";

@Injectable()
export class PaymentGuard implements CanActivate {
  constructor(
      private alertService: AlertControllerService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token') !== null &&
    localStorage.getItem('isCustomer') === 'true') {
     return true
    } else {
      if (localStorage.getItem('token') === null) {
        this.alertService.warn('You must be logged in to access this page');
      } else if (localStorage.getItem('token') !== null &&
        localStorage.getItem('isCustomer') === 'false') {
          this.alertService.warn('You must activate your account');
        this.router.navigate(['profile/payment']);
      } else if (localStorage.getItem('isCustomer') === null) {
          this.alertService.warn('You must add a payment method to use xilo');
        this.router.navigate(['profile/payment']);
      }
    }
  }
}
