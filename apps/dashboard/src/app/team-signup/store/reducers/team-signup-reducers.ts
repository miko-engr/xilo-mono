import { on, createReducer } from '@ngrx/store';
import { AccountDetails } from '../../models/account-details.model';
import { loadContractDetails, errorContractDetails } from '../actions/contract-details-action';
import { loadCompanyDetails } from '../actions/company-details-action';
import { loadPaymentDetails } from '../actions/payment-details-action';
import { PaymentDetails } from '../../../models/payment.model';
import { loadAccountDetails } from '../actions/account-details-action';

export interface AccountDetailsState extends AccountDetails {
  accountDetailsError: string;
}

export const initialState: AccountDetailsState = {
    company: {}, 
    contract: {}, 
    payment: new PaymentDetails(), 
    selectedApis: [], 
    selectedForms: [],
    accountDetailsError: ''
};

export const TeamSignupReducer = createReducer(
    initialState,
    on(loadAccountDetails, (state, action) => ({
      ...state,
      ...state['accountDetails'],
      ...action.accountDetails
    })),
    on(loadContractDetails, (state, action) => ({
      ...state,
        ...state['accountDetails'],
        contract: action.contract
    })),
    on(loadCompanyDetails, (state, action) => ({
      ...state,
        ...state['accountDetails'],
        company: action.company
    })),
    on(loadPaymentDetails, (state, action) => ({
      ...state,
        ...state['accountDetails'],
        payment: action.payment
    })),
    on(errorContractDetails, (state, action) => ({
      ...state,
      error: action.message
    }))
);

export const selectAccountDetails = (state: AccountDetailsState) => state['accountDetails'];
export const selectContractDetails = (state: AccountDetailsState) => state['accountDetails'].contract;
export const selectCompanyDetails = (state: AccountDetailsState) => state['accountDetails'].company;
export const selectPaymentDetails = (state: AccountDetailsState) => state['accountDetails'].payment;

export const selectError = (state: AccountDetailsState) => state.accountDetailsError;

