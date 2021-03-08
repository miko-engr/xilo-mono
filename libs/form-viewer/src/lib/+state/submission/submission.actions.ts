import { createAction, props } from '@ngrx/store';
import { Submission, Note } from '@xilo-mono/form-contracts';
import { Params } from '@angular/router';

/*
  Load Submission Actions
*/
export const loadSubmission = createAction(
  '[Submission] Load Submission',
  props<{ id: string | number }>()
);

export const loadSubmissionSuccess = createAction(
  '[Submission] Load Submission Success',
  props<{
    submission: Submission;
    note?: Note;
  }>()
);

export const loadSubmissionFailure = createAction(
  '[Submission] Load Submission Failure',
  props<{ error: any }>()
);

/*
  Create Submission Actions
*/
export const createSubmission = createAction(
  '[Submission] Create Submission',
  props<{ submission: Submission; params?: Params }>()
);

export const createSubmissionSuccess = createAction(
  '[Submission] Create Submission Success',
  props<{ submission: Submission; res: any }>()
);

export const createSubmissionFailure = createAction(
  '[Submission] Create Submission Failure',
  props<{ error: any }>()
);

/*
  Update Submission Actions
*/
export const updateSubmission = createAction(
  '[Submission] Update Submission',
  props<{ submission: Submission }>()
);

export const updateSubmissionSuccess = createAction(
  '[Submission] Update Submission Success',
  props<{ submission: Submission }>()
);

export const updateSubmissionFailure = createAction(
  '[Submission] Update Submission Failure',
  props<{ error: any }>()
);

export const completeForm = createAction('[Submission] Complete form');
export const formCompleted = createAction('[Submission] Form Completed');
export const completeFormError = createAction(
  '[Submission] Complete form error',
  props<{ error: any }>()
);
