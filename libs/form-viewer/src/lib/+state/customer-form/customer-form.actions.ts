import { createAction, props } from '@ngrx/store';
import {
  CustomerFormMetadata,
  FormStatus,
  IndexSummary,
  Submission,
} from '@xilo-mono/form-contracts';

const setFields = createAction(
  '[Customer Form] Set fields',
  props<{ fields: any[] }>()
);

const animationStart = createAction('[Customer Form] Animation start');
const animationDone = createAction('[Customer Form] Animation done');

const setSectionAndQuestion = createAction(
  '[Customer Form] Set section and question',
  props<{ section: number; question: number; subsection: number }>()
);

const goToSection = createAction(
  '[Customer Form] Go to section',
  props<{ section: number }>()
);
const setSection = createAction(
  '[Customer Form] Set section',
  props<{ section: number }>()
);
const goToQuestion = createAction(
  '[Customer Form] Go to question',
  props<{ question: number }>()
);
const setQuestion = createAction(
  '[Customer Form] Set question',
  props<{ question: number }>()
);
const next = createAction('[Customer Form] Next');
const previous = createAction('[Customer Form] Previous');
const nextQuestion = createAction(
  '[Customer Form] Next question',
  props<IndexSummary>()
);
const previousQuestion = createAction(
  '[Customer Form] Previous question',
  props<IndexSummary>()
);
const nextSection = createAction(
  '[Customer Form] Next section',
  props<IndexSummary>()
);
const previousSection = createAction(
  '[Customer Form] Previous section',
  props<IndexSummary>()
);
const addRepeatSection = createAction(
  '[Customer Form] Add repeat section',
  props<{ key: string }>()
);
const removeRepeatSection = createAction(
  '[Customer Form] Remove repeat section',
  props<{ key: string }>()
);
const setQuestionAndSubsection = createAction(
  '[Customer Form] Set question and subsection',
  props<{ question: number; subsection: number }>()
);
const setPreviewMode = createAction(
  '[Customer Forms] Set preview mode',
  props<{ preview: boolean }>()
);
const validateProgress = createAction(
  '[Customer Forms] Validate progress',
  props<IndexSummary>()
);
const newCustomerSubmission = createAction(
  '[Customer Forms] New customer submission',
  props<{ companyId: string | number }>()
);
const newCustomerSubmissionCreated = createAction(
  '[Customer Forms] New customer submission created',
  props<{ submission: Submission }>()
);
const newCustomerSubmissionError = createAction(
  '[Customer Forms] New customer submission error',
  props<{ error: any }>()
);
const setMetadata = createAction(
  '[Customer Forms] Set metadata',
  props<{ metadata: CustomerFormMetadata }>()
);
const loadForm = createAction(
  '[Customer Forms] Load form',
  props<{ formId: string }>()
);
const formLoaded = createAction(
  '[Customer Forms] Form loaded',
  props<{ key: string; version: number }>()
);
const formLoadError = createAction(
  '[Customer Forms] Form load error',
  props<{ error: any }>()
);
const loadSubmission = createAction(
  '[Customer Forms] Load submission',
  props<{ submissionId: string | number }>()
);
const submissionLoaded = createAction(
  '[Customer Form] Submission loaded',
  props<{ submission: Submission }>()
);
const submissionLoadError = createAction(
  '[Customer Forms] Submission load error',
  props<{ error: any }>()
);
const updateSubmission = createAction('[Customer Forms] Update submission');

const updateFormStatus = createAction(
  '[Customer Forms] Update form status',
  props<{ formStatus: FormStatus }>()
);
const formStatusUpdated = createAction(
  '[Customer Forms] Form status updated',
  props<{ formStatus: FormStatus }>()
);
const formStatusUpdateError = createAction(
  '[Customer Forms] Form status update error',
  props<{ error: any }>()
);

export const CustomerFormActions = {
  setFields,
  animationStart,
  animationDone,
  setSectionAndQuestion,
  goToSection,
  setSection,
  goToQuestion,
  setQuestion,
  nextQuestion,
  previousQuestion,
  nextSection,
  previousSection,
  addRepeatSection,
  removeRepeatSection,
  setQuestionAndSubsection,
  setPreviewMode,
  next,
  previous,
  validateProgress,
  newCustomerSubmission,
  newCustomerSubmissionCreated,
  newCustomerSubmissionError,
  setMetadata,
  loadForm,
  formLoaded,
  formLoadError,
  loadSubmission,
  submissionLoaded,
  submissionLoadError,
  updateSubmission,
  updateFormStatus,
  formStatusUpdated,
  formStatusUpdateError,
};
