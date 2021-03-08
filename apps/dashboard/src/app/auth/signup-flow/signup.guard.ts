import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CompanyService } from '../../services/company.service';

@Injectable()
export class SignupGuard implements CanActivate {
  constructor(private router: Router, 
    private companyService: CompanyService) {}
  isPaymentSuccess = false;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (localStorage.getItem('token') && localStorage.getItem('userId')) {
      if(state.url.includes('payment') && !state.url.includes('success')) {
        this.companyService.get().subscribe((result: any) => {
         result.obj.subscriptionId ? this.isPaymentSuccess = true : this.isPaymentSuccess = false;
         if(this.isPaymentSuccess) {
           this.router.navigate(['auth/signup-flow/payment/success']);
           return false;
         } else {
           return true;
         }
      })
    }
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
