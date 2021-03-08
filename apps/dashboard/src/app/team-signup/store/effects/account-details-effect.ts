import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountDetailsService } from '../../account-details.service';
import { addAccountDetails, deleteAccountDetails, getAccountDetails } from '../actions/account-details-action';

@Injectable()
export class TeamSignupAccountDetailsEffect {
    /*
        Account Details
    */
    loadAccountDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getAccountDetails),
          switchMap(action => {
            const accountDetailsLoaded = this.accountDetailsService.getAccountDetails();
            console.log('Loading Acct Details from Load: ', accountDetailsLoaded);
            return of({ 
              type: '[accountDetails] load accountDetails', accountDetails: accountDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error accountDetails', message: error 
          }))
        )
    );
  
    addAccountDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(addAccountDetails),
          switchMap(action => {
            console.log('Add details Action hit: ', action);
            this.accountDetailsService.addAccountDetails(action.accountDetails);
            const accountDetailsLoaded = this.accountDetailsService.getAccountDetails();
            console.log('Account details loaded: ', accountDetailsLoaded);
            return of({ 
              type: '[accountDetails] load accountDetails', accountDetails: accountDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error accountDetails', message: error 
          }))
        )
    );

    deleteAccountDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(deleteAccountDetails),
          switchMap(action => {
            this.accountDetailsService.deleteAccountDetails();
            const accountDetailsLoaded = this.accountDetailsService.getAccountDetails();
            return of({ 
              type: '[accountDetails] load accountDetails', accountDetails: accountDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error accountDetails', message: error 
          }))
        )
    );

    constructor(
        private actions$: Actions, 
        private accountDetailsService: AccountDetailsService
    ) {}
}