import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CompanyService } from '../services/company.service';
import { FeatureFlags } from '../shared/enums/featureFlags.enum';

@Injectable()
export class FormSubmissionsGuard implements CanActivate {
  constructor(
    private companyService: CompanyService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.companyService.hasFlags(FeatureFlags.FORM_SUBMISSIONS).then((isFormSubmissionTabActive) => {
      return isFormSubmissionTabActive;
    }).catch((err) => {
      console.error(`There was an error attempting to retrieve Feature Flag: ${FeatureFlags.FORM_SUBMISSIONS}`, err);
      return false;
    });

  }
}
