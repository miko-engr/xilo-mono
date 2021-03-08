import { Submission } from '@xilo-mono/form-contracts';
import * as SubmissionActions from './submission.actions';
import { State, initialState, reducer } from './submission.reducer';

describe('Submission Reducer', () => {
  const createSubmission = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as Submission);

  beforeEach(() => {});

  describe('valid Submission actions', () => {
    it('loadSubmissionSuccess should return set the list of known Submission', () => {
      const submission = new Submission();
      const action = SubmissionActions.loadSubmissionSuccess({ submission });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result['id']).toBe(1);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
