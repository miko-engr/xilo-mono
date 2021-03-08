import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountDetailsService } from '../../account-details.service';
import { addPaymentDetails, deletePaymentDetails, getPaymentDetails } from '../actions/payment-details-action';

@Injectable()
export class TeamSignupPaymentDetailsEffect {
    /*
        Payment Details
    */
    loadPaymentDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getPaymentDetails),
          switchMap(action => {
            const accountDetailsLoaded = this.accountDetailsService.getAccountDetails();
            return of({ 
              type: '[accountDetails] load paymentDetails', payment: accountDetailsLoaded.payment 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error paymentDetails', message: error 
          }))
        )
    );
  
    addPaymentDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(addPaymentDetails),
          switchMap(action => {
            this.accountDetailsService.addPaymentDetails(action.payment);
            const paymentDetailsLoaded = this.accountDetailsService.getPaymentDetails();
            return of({ 
              type: '[accountDetails] load paymentDetails', payment: paymentDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error paymentDetails', message: error 
          }))
        )
    );

    deletePaymentDetails$ = createEffect(() =>
        this.actions$.pipe(
          ofType(deletePaymentDetails),
          switchMap(action => {
            this.accountDetailsService.deletePaymentDetails();
            const paymentDetailsLoaded = this.accountDetailsService.getPaymentDetails();
            return of({ 
              type: '[accountDetails] load paymentDetails', payment: paymentDetailsLoaded 
            });
          }),
          catchError(error => of({ 
            type: '[accountDetails] error paymentDetails', message: error 
          }))
        )
    );

    constructor(
        private actions$: Actions, 
        private accountDetailsService: AccountDetailsService
    ) {}
}