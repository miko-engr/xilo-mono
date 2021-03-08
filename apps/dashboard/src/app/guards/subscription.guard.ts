import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "../services/user.service";
import {AlertControllerService} from "../services/alert.service";

@Injectable()
export class SubscriptionGuard implements CanActivate {
    state = false;
    constructor(
        private alertService: AlertControllerService,
        private router: Router,
        private userService: UserService
    ) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (localStorage.getItem('token') !== null &&
            localStorage.getItem('isCustomer') === 'true') {
            this.userService.getActive()
                .subscribe(state => {
                    this.state = state['status'];
                    if (this.state === false) {
                        this.alertService.warn('You must have an active subscription to see clients');
                        this.router.navigate(['profile/payment']);
                    }
                }, error => {
                    
                    if(error?.error?.errorType !== 6) this.alertService.error('You must have an active subscription');
                    return false;
                });
            return true;
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
