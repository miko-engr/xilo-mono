import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { SubmissionEffects } from './submission.effects';
import * as SubmissionActions from './submission.actions';
import { Submission } from '@xilo-mono/form-contracts';

describe('SubmissionEffects', () => {
  let actions: Observable<any>;
  let effects: SubmissionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        SubmissionEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(SubmissionEffects);
  });

  describe('loadSubmission$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: SubmissionActions.loadSubmission({id: 1}) });
      const submission = new Submission(1);
      const expected = hot('-a-|', {
        a: SubmissionActions.loadSubmissionSuccess({ submission: submission }),
      });

      expect(effects.loadSubmission$).toBeObservable(expected);
    });
  });
  describe('createSubmission$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: SubmissionActions.createSubmission({ submission: {id: 1} }) });
      const submission = new Submission(1);
      const expected = hot('-a-|', {
        a: SubmissionActions.createSubmissionSuccess({ submission: submission }),
      });

      expect(effects.createSubmission$).toBeObservable(expected);
    });
  });
});
