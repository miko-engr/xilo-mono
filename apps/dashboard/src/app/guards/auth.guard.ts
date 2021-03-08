import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AlertControllerService} from "../services/alert.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private alertService: AlertControllerService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token') !== null) {
      return true;
    } else {
        this.alertService.warn('You must be logged in to access this page');
      this.router.navigate(['auth/login']);
    }
  }
}
