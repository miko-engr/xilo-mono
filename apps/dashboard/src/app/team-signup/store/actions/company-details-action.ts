import { createAction, props } from '@ngrx/store';
import { ContractCompany } from '../../models/account-details.model';

/*
    Company Detail Actions
*/
export const getCompanyDetails = createAction('[accountDetails] get companyDetails');

export const loadCompanyDetails = createAction(
  '[accountDetails] load companyDetails',
  props<{ company: ContractCompany }>()
);

export const addCompanyDetails = createAction(
  '[accountDetails] add companyDetails',
  props<{ company: ContractCompany }>()
);

export const deleteCompanyDetails = createAction(
  '[accountDetails] delete companyDetails',
  props<{ company: ContractCompany }>()
);

export const errorCompanyDetails = createAction(
  '[accountDetails] error companyDetails',
  props<{ message: string }>()
);