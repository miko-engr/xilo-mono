import { createSelector } from '@ngrx/store';
import { getFormViewerState } from '..';

const getCustomerFormState = createSelector(
  getFormViewerState,
  (state) => state.customerFormState
);

const getQuestionAnimation = createSelector(
  getCustomerFormState,
  (state) => state.questionAnimation
);
const getAnimationInProgress = createSelector(
  getCustomerFormState,
  (state) => state.animationInProgress
);
const getQuestionIndex = createSelector(
  getCustomerFormState,
  (state) => state.questionIndex
);
const getSectionIndex = createSelector(
  getCustomerFormState,
  (state) => state.sectionIndex
);
const getSectionAnimation = createSelector(
  getCustomerFormState,
  (state) => state.sectionAnimation
);
const getFields = createSelector(getCustomerFormState, (state) => state.fields);
const getSubsection = createSelector(
  getCustomerFormState,
  (state) => state.subsectionIndex
);
const getProgressSummary = createSelector(getCustomerFormState, (state) => ({
  sectionIndex: state.sectionProgress,
  questionIndex: state.questionProgress,
  subsectionIndex: state.subsectionProgress,
}));
const getIndexSummary = createSelector(getCustomerFormState, (state) => ({
  sectionIndex: state.sectionIndex,
  subsectionIndex: state.subsectionIndex,
  questionIndex: state.questionIndex,
}));
const getCurrentSection = createSelector(
  getCustomerFormState,
  (state) => state.fields[state.sectionIndex]
);
const getIsLastQuestionInSection = createSelector(
  getCustomerFormState,
  (state) => {
    const currentSection = state.fields[state.sectionIndex];
    return state.questionIndex === currentSection?.questions - 1;
  }
);
const getMetadata = createSelector(
  getCustomerFormState,
  (state) => state.metadata
);
const getLoadState = createSelector(
  getCustomerFormState,
  (state) => state.loadState
);
const getFormStatus = createSelector(
  getCustomerFormState,
  (state) => state.formStatus
);

export const customerFormQuery = {
  getQuestionAnimation,
  getAnimationInProgress,
  getQuestionIndex,
  getSectionIndex,
  getFields,
  getSectionAnimation,
  getSubsection,
  getProgressSummary,
  getIndexSummary,
  getCurrentSection,
  getIsLastQuestionInSection,
  getMetadata,
  getLoadState,
  getFormStatus,
};
