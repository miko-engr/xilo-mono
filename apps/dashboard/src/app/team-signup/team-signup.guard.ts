import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class TeamSignupGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
    if (token && userType && userType === 'xilo_employee') {
      return true;
    } else {
      localStorage.clear();
      this.router.navigate(['/team-signup']);
      return false;
    }
  }
}
