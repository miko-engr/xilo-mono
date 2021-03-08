import { createAction, props } from '@ngrx/store';
import { PaymentDetails } from '../../../models/payment.model';

/*
    Payment Detail Actions
*/
export const getPaymentDetails = createAction('[accountDetails] get paymentDetails');

export const loadPaymentDetails = createAction(
  '[accountDetails] load paymentDetails',
  props<{ payment: PaymentDetails }>()
);

export const addPaymentDetails = createAction(
  '[accountDetails] add paymentDetails',
  props<{ payment: PaymentDetails }>()
);

export const deletePaymentDetails = createAction(
  '[accountDetails] delete paymentDetails',
  props<{ payment: PaymentDetails }>()
);

export const errorPaymentDetails = createAction(
  '[accountDetails] error paymentDetails',
  props<{ message: string }>()
);