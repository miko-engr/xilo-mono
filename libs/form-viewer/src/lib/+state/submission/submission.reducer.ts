import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as SubmissionActions from './submission.actions';
import { Submission, Note } from '@xilo-mono/form-contracts';

export const SUBMISSION_FEATURE_KEY = 'submissionState';

export interface State {
  submission: Submission,
  loaded: boolean; // has the Submission been loaded
  note?: Note,
  error?: string | null; // last none error (if any)
}

export interface SubmissionPartialState {
  readonly [SUBMISSION_FEATURE_KEY]: State;
}

// export const submissionAdapter: EntityAdapter<Submission> = createEntityAdapter<
//   Submission
// >();

export const initialState: State = {
  // set initial required properties
  submission: {},
  loaded: false,
};

const submissionReducer = createReducer(
  initialState,
  /*
    Load Submission
  */
  on(SubmissionActions.loadSubmission, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(SubmissionActions.loadSubmissionSuccess, (state, { submission, note }) => ({ 
    ...state,
    submission: {
      ...state.submission,
      ...submission
    },
    note: {
      ...state.note,
      ...note
    },
    loaded: true 
  })),
  on(SubmissionActions.loadSubmissionFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  /*
    Create Submission
  */
  on(SubmissionActions.createSubmission, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(SubmissionActions.createSubmissionSuccess, (state, { submission }) => ({ 
    ...state,
    submission: {
      ...state.submission,
      ...submission
    },
    loaded: true 
  })),
  on(SubmissionActions.createSubmissionFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  /*
    Update Submission
  */
  on(SubmissionActions.updateSubmission, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(SubmissionActions.updateSubmissionSuccess, (state, { submission }) => ({ 
    ...state,
    submission: {
      ...state.submission,
      ...submission
    },
    loaded: true 
  })),
  on(SubmissionActions.updateSubmissionFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return submissionReducer(state, action);
}
