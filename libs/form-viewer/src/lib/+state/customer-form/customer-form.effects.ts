import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {
  FormViewService,
  IndexSummary,
  SubmissionService,
} from '@xilo-mono/form-contracts';
import { EMPTY, of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { FormViewerPartialState } from '..';
import { CustomerFormActions } from './customer-form.actions';
import { customerFormQuery } from './customer-form.selectors';
import { cloneDeep } from 'lodash';
import { CustomerFormFacade } from './customer-form.facade';

@Injectable()
export class CustomerFormEffects {
  loadForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.loadForm),
      switchMap(({ formId }) => {
        return this.formViewService.getForm(formId).pipe(
          map((form) => {
            this.formViewService.fields = form.components[0].fieldGroup;
            this.formViewService.formView = form;
            const fields = cloneDeep(this.formViewService.fields);
            this.customerFormFacade.setFields(fields);
            const key = form.metadata?.key;
            const version = form.metadata?.version;
            return CustomerFormActions.formLoaded({ key, version });
          })
        );
      })
    )
  );

  loadSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.loadSubmission),
      concatMap(({ submissionId }) => {
        return this.submissionService.getSubmission(submissionId).pipe(
          map((submission) => {
            this.formViewService.submission = cloneDeep(submission);
            return CustomerFormActions.submissionLoaded({ submission });
          }),
          catchError((error) =>
            of(CustomerFormActions.submissionLoadError({ error }))
          )
        );
      })
    )
  );

  submissionLoadError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.submissionLoadError),
      withLatestFrom(this.store.pipe(select(customerFormQuery.getMetadata))),
      map(([_, { companyId }]) => {
        return CustomerFormActions.newCustomerSubmission({ companyId });
      })
    )
  );

  goToSection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.goToSection),
      withLatestFrom(this.store.pipe(select(customerFormQuery.getSubsection))),
      concatMap(([{ section }, subsection]) => {
        return of(
          CustomerFormActions.setSectionAndQuestion({
            section,
            question: 0,
            subsection,
          })
        ).pipe(delay(100));
      })
    )
  );

  goToQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.goToQuestion),
      concatMap(({ question }) => {
        return of(CustomerFormActions.setQuestion({ question })).pipe(
          delay(200)
        );
      })
    )
  );

  addRepeatSection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.addRepeatSection),
      withLatestFrom(
        this.store.pipe(select(customerFormQuery.getFields)),
        this.store.pipe(select(customerFormQuery.getSectionIndex))
      ),
      map(([_, fields, sectionIndex]) => {
        const section = fields[sectionIndex];
        const subsection = section.repeatInstances - 1 || 0;
        return CustomerFormActions.setQuestionAndSubsection({
          question: 0,
          subsection,
        });
      })
    )
  );

  next$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.previous),
      withLatestFrom(
        this.store.pipe(select(customerFormQuery.getIndexSummary))
      ),
      map(([_, current]) => {
        const previous: IndexSummary = this.formViewService.getPrevious(
          current
        );
        if (
          previous.sectionIndex !== current.sectionIndex ||
          previous.subsectionIndex !== current.subsectionIndex
        ) {
          return CustomerFormActions.previousSection(previous);
        } else {
          return CustomerFormActions.previousQuestion(previous);
        }
      })
    )
  );

  nextSection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.nextSection),
      switchMap(({ sectionIndex, subsectionIndex, questionIndex }) => {
        return of(
          CustomerFormActions.setSectionAndQuestion({
            section: sectionIndex,
            subsection: subsectionIndex,
            question: questionIndex,
          })
        );
      })
    )
  );

  nextQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.nextQuestion),
      switchMap(({ sectionIndex, subsectionIndex, questionIndex }) => {
        return of(
          CustomerFormActions.setQuestion({ question: questionIndex })
        ).pipe(delay(200));
      })
    )
  );

  previous$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.next),
      withLatestFrom(
        this.store.pipe(select(customerFormQuery.getIndexSummary))
      ),
      map(([_, current]) => {
        const next: IndexSummary = this.formViewService.getNext(current);
        if (
          next.sectionIndex !== current.sectionIndex ||
          next.subsectionIndex !== current.subsectionIndex
        ) {
          return CustomerFormActions.nextSection(next);
        } else {
          return CustomerFormActions.nextQuestion(next);
        }
      })
    )
  );

  previousSection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.previousSection),
      switchMap(({ sectionIndex, subsectionIndex, questionIndex }) => {
        return of(
          CustomerFormActions.setSectionAndQuestion({
            section: sectionIndex,
            subsection: subsectionIndex,
            question: questionIndex,
          })
        );
      })
    )
  );

  previousQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.previousQuestion),
      switchMap(({ sectionIndex, subsectionIndex, questionIndex }) => {
        return of(
          CustomerFormActions.setQuestion({ question: questionIndex })
        ).pipe(delay(200));
      })
    )
  );

  validateProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.validateProgress),
      map((current) => {
        const progress = this.formViewService.getProgress();
        if (this.compareIndexes(current, progress) <= 0) {
          return CustomerFormActions.setSectionAndQuestion({
            section: current.sectionIndex,
            question: current.questionIndex,
            subsection: current.subsectionIndex,
          });
        } else {
          return CustomerFormActions.setSectionAndQuestion({
            section: progress.sectionIndex,
            question: progress.questionIndex,
            subsection: progress.subsectionIndex,
          });
        }
      })
    )
  );

  createSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.newCustomerSubmission),
      concatMap(({ companyId }) => {
        return this.submissionService.newCustomerSubmission(companyId).pipe(
          map((submission) => {
            this.formViewService.submission = cloneDeep(submission);
            return CustomerFormActions.newCustomerSubmissionCreated({
              submission,
            });
          }),
          catchError((error) => {
            return of(
              CustomerFormActions.newCustomerSubmissionError({ error })
            );
          })
        );
      })
    )
  );

  updateSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.updateSubmission),
      withLatestFrom(this.store.pipe(select(customerFormQuery.getFormStatus))),
      concatMap(([_, formStatus]) => {
        if (formStatus !== 'Filling') {
          this.store.dispatch(
            CustomerFormActions.updateFormStatus({ formStatus: 'Filling' })
          );
        }
        const submission = this.formViewService.submission;
        const formValue = this.formViewService.form.value;
        if (submission.responses && submission.responses?.length > 0) {
          submission.responses[this.formViewService.responseIndex] = formValue;
        } else {
          submission.responses = [formValue];
        }
        if (this.submissionService.metadata && this.submissionService.metadata !== {}) {
          submission.metadata = {
            ...submission.metadata,
            ...this.submissionService.metadata
          }
        }
        return this.submissionService.updateSubmission(submission).pipe(
          map((updated) => {
            return CustomerFormActions.submissionLoaded({
              submission: updated,
            });
          })
        );
      })
    )
  );

  updateFormStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerFormActions.updateFormStatus),
      withLatestFrom(this.store.pipe(select(customerFormQuery.getMetadata))),
      concatMap(([{ formStatus }, { clientId }]) => {
        if (clientId) {
          return this.submissionService
            .updateFormStatus(clientId, formStatus)
            .pipe(
              map(() => {
                return CustomerFormActions.formStatusUpdated({ formStatus });
              }),
              catchError((error) =>
                of(CustomerFormActions.formStatusUpdateError({ error }))
              )
            );
        } else {
          const error = new Error('ClientId missing');
          return of(CustomerFormActions.formStatusUpdateError({ error }));
        }
      })
    )
  );

  compareIndexes(a: IndexSummary, b: IndexSummary) {
    const sectionDiff = a.sectionIndex - b.sectionIndex;
    if (sectionDiff === 0) {
      const subsectionDiff = a.subsectionIndex - b.subsectionIndex;
      if (subsectionDiff === 0) {
        return a.questionIndex - b.questionIndex;
      } else {
        return subsectionDiff;
      }
    } else {
      return sectionDiff;
    }
  }

  constructor(
    private actions$: Actions,
    private store: Store<FormViewerPartialState>,
    private formViewService: FormViewService,
    private submissionService: SubmissionService,
    private customerFormFacade: CustomerFormFacade
  ) {}
}
