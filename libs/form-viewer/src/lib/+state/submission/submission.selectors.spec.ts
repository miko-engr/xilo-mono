import { Submission } from '@xilo-mono/form-contracts';
import { State, initialState } from './submission.reducer';
import * as SubmissionSelectors from './submission.selectors';

describe('Submission Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getSubmissionId = (it) => it['id'];
  const createSubmission = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as Submission);

  let state;

  beforeEach(() => {
    state = {
      id: 1,
      ...initialState,
      error: ERROR_MSG,
      loaded: true,
    };
  });

  describe('Submission Selectors', () => {
    // it('getAllSubmission() should return the list of Submission', () => {
    //   const results = SubmissionSelectors.getAllSubmission(state);
    //   const selId = getSubmissionId(results[1]);

    //   expect(results.length).toBe(3);
    //   expect(selId).toBe('PRODUCT-BBB');
    // });

    // it('getSelected() should return the selected Entity', () => {
    //   const result = SubmissionSelectors.getSelected(state);
    //   const selId = getSubmissionId(result);

    //   expect(selId).toBe('PRODUCT-BBB');
    // });

    it("getSubmissionLoaded() should return the current 'loaded' status", () => {
      const result = SubmissionSelectors.getSubmissionLoaded(state);

      expect(result).toBe(true);
    });

    it("getSubmissionError() should return the current 'error' state", () => {
      const result = SubmissionSelectors.getSubmissionError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
