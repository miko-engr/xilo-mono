import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getFormViewerState } from '..';
import {
  SUBMISSION_FEATURE_KEY,
  State,
  SubmissionPartialState,
} from './submission.reducer';

// Lookup the 'Submission' feature state managed by NgRx
export const getSubmissionState = createSelector(
  getFormViewerState,
  (state) => state.submissionState
);

// const { selectAll, selectEntities } = formViewAdapter.getSelectors();

export const getSubmissionLoaded = createSelector(
  getSubmissionState,
  (state: State) => state.loaded
);

export const getSubmissionError = createSelector(
  getSubmissionState,
  (state: State) => state.error
);

export const getSubmissionEntity = createSelector(
  getSubmissionState,
  (state: State) => state.submission
);

export const getSubmissionNote = createSelector(
  getSubmissionState,
  (state: State) => state.note
);
