import * as fromSubmission from './submission/submission.reducer';
import * as fromCustomerForm from './customer-form/customer-form.reducer';

import { combineReducers, createFeatureSelector } from '@ngrx/store';

export const FORM_VIEWER_FEATURE_KEY = 'formViewer';

export interface State {
  [fromSubmission.SUBMISSION_FEATURE_KEY]: fromSubmission.State;
  [fromCustomerForm.CUSTOMER_FORM_FEATURE_KEY]: fromCustomerForm.State;
}

export interface FormViewerPartialState {
  [FORM_VIEWER_FEATURE_KEY]: State;
}

export const reducers = combineReducers({
  [fromSubmission.SUBMISSION_FEATURE_KEY]: fromSubmission.reducer,
  [fromCustomerForm.CUSTOMER_FORM_FEATURE_KEY]: fromCustomerForm.reducer,
});

export const getFormViewerState = createFeatureSelector<
  FormViewerPartialState,
  State
>(FORM_VIEWER_FEATURE_KEY);
