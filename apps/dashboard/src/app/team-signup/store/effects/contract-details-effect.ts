import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AccountDetailsService } from '../../account-details.service';
import { addContractDetails, deleteContractDetails, getContractDetails } from '../actions/contract-details-action';
import { Action } from '@ngrx/store';

@Injectable()
export class TeamSignupContractDetailsEffect {
    /*
        Contract Details
    */
    loadContractDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getContractDetails),
          switchMap(action => {
            const accountDetailsLoaded = this.accountDetailsService.getAccountDetails();
            return of({ 
              type: '[accountDetails] load contractDetails', contract: accountDetailsLoaded.contract 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error contractDetails', message: error 
          }))
        )
    );
  
    addContractDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(addContractDetails),
          switchMap(action => {
            this.accountDetailsService.addContractDetails(action.contract);
            const contractDetailsLoaded = this.accountDetailsService.getContractDetails();
            return of({ 
              type: '[accountDetails] load contractDetails', contract: contractDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error contractDetails', message: error 
          }))
        )
    );

    deleteContractDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(deleteContractDetails),
          switchMap(action => {
            this.accountDetailsService.deleteContractDetails();
            const contractDetailsLoaded = this.accountDetailsService.getContractDetails();
            return of({ 
              type: '[accountDetails] load contractDetails', contract: contractDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error contractDetails', message: error 
          }))
        )
    );

    constructor(
        private actions$: Actions, 
        private accountDetailsService: AccountDetailsService
    ) {}
}