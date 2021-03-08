import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountDetailsService } from '../../account-details.service';
import { getCompanyDetails, addCompanyDetails, deleteCompanyDetails } from '../actions/company-details-action';

@Injectable()
export class TeamSignupCompanyDetailsEffect {
    /*
        Company Details
    */
    loadCompanyDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getCompanyDetails),
          switchMap(action => {
            const accountDetailsLoaded = this.accountDetailsService.getAccountDetails();
            return of({ 
              type: '[accountDetails] load companyDetails', company: accountDetailsLoaded.company 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error companyDetails', message: error 
          }))
        )
    );
  
    addCompanyDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(addCompanyDetails),
          switchMap(action => {
            this.accountDetailsService.addCompanyDetails(action.company);
            const companyDetailsLoaded = this.accountDetailsService.getCompanyDetails();
            return of({ 
              type: '[accountDetails] load companyDetails', company: companyDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error companyDetails', message: error 
          }))
        )
    );

    deleteCompanyDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(deleteCompanyDetails),
          switchMap(action => {
            this.accountDetailsService.deleteCompanyDetails();
            const companyDetailsLoaded = this.accountDetailsService.getCompanyDetails();
            return of({ 
              type: '[accountDetails] load companyDetails', company: companyDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error companyDetails', message: error 
          }))
        )
    );

    constructor(
        private actions$: Actions, 
        private accountDetailsService: AccountDetailsService
    ) {}
}