import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';

@Injectable({ providedIn: 'root' })
export class FeatureFlagCanActivateGuard implements CanActivate {
  constructor(
    private companyService: CompanyService,
    private router: Router
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return await this.companyService.hasFlags(route.data.flags);
  }
}