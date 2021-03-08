import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { SubmissionService } from '@xilo-mono/form-contracts';
import * as SubmissionActions from './submission.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class SubmissionEffects {
  loadSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubmissionActions.loadSubmission),
      switchMap((action) => {
        return this.submissionService.getSubmission(action.id);
      }),
      switchMap((res) =>
        of(
          SubmissionActions.loadSubmissionSuccess({
            submission: res,
            note: res.note,
          })
        )
      ),
      catchError((e) =>
        of(SubmissionActions.loadSubmissionFailure({ error: e }))
      )
    )
  );

  createSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubmissionActions.createSubmission),
      mergeMap((action) =>
        this.submissionService.createSubmission(action.submission).pipe(
          map((res) => {
            return SubmissionActions.createSubmissionSuccess({
              submission: res.responses,
              res,
            });
          }),
          catchError((error) => {
            return of(SubmissionActions.createSubmissionFailure(error));
          })
        )
      )
    )
  );

  updateSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubmissionActions.updateSubmission),
      switchMap((action) =>
        this.submissionService.updateSubmission(action.submission)
      ),
      switchMap((res) =>
        of(SubmissionActions.updateSubmissionSuccess(res.responses))
      ),
      catchError((e) =>
        of(SubmissionActions.updateSubmissionFailure({ error: e }))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private submissionService: SubmissionService
  ) {}
}
