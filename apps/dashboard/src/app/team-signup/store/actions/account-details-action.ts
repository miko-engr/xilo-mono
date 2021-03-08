import { createAction, props } from '@ngrx/store';
import { AccountDetails } from '../../models/account-details.model';

/*
    Account Details Actions
*/
export const getAccountDetails = createAction('[accountDetails] get accountDetails');

export const loadAccountDetails = createAction(
  '[accountDetails] load accountDetails',
  props<{ accountDetails: AccountDetails }>()
);

export const addAccountDetails = createAction(
  '[accountDetails] add accountDetails',
  props<{ accountDetails: AccountDetails }>()
);

export const deleteAccountDetails = createAction(
  '[accountDetails] delete accountDetails',
  props<{ accountDetails: AccountDetails }>()
);

export const errorAccountDetails = createAction(
  '[accountDetails] error accountDetails',
  props<{ message: string }>()
);