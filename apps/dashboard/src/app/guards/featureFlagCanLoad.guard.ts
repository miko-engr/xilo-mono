import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';

@Injectable({ providedIn: 'root' })
export class FeatureFlagCanLoadGuard implements CanLoad {
  constructor(
      private companyService: CompanyService,
      private router: Router
    ) {
  }

  async canLoad(route: Route): Promise<boolean> {
    return await this.companyService.hasFlags(route.data.flags);
  }
}