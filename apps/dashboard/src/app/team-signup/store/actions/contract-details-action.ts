import { createAction, props } from '@ngrx/store';
import { ContractDetails } from '../../models/account-details.model';

/*
    Contract Detail Actions
*/
export const getContractDetails = createAction('[accountDetails] get contractDetails');

export const loadContractDetails = createAction(
  '[accountDetails] load contractDetails',
  props<{ contract: ContractDetails }>()
);

export const addContractDetails = createAction(
  '[accountDetails] add contractDetails',
  props<{ contract: ContractDetails }>()
);

export const deleteContractDetails = createAction(
  '[accountDetails] delete contractDetails',
  props<{ contract: ContractDetails }>()
);

export const errorContractDetails = createAction(
  '[accountDetails] error contractDetails',
  props<{ message: string }>()
);