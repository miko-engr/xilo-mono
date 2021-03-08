import { Action, createReducer, on } from '@ngrx/store';
import { CustomerFormMetadata, FormStatus } from '@xilo-mono/form-contracts';
import { CustomerFormActions } from './customer-form.actions';

export type QuestionGroupAnimationState =
  | 'unloaded'
  | 'moveup'
  | 'movedown'
  | 'appear';

export type SectionAnimationState = 'unloaded' | 'loaded';

export interface SectionSummary {
  key: string;
  questions: number;
  isRepeatable: number;
  repeatInstances?: number;
}

export const CUSTOMER_FORM_FEATURE_KEY = 'customerFormState';

export interface State {
  fields: SectionSummary[];
  sectionIndex: number;
  questionIndex: number;
  subsectionIndex: number;
  questionAnimation: QuestionGroupAnimationState;
  sectionAnimation: SectionAnimationState;
  animationInProgress: boolean;
  error?: any;
  sectionProgress: number;
  questionProgress: number;
  subsectionProgress: number;
  preview: boolean;
  metadata?: CustomerFormMetadata;
  loadState: CustomerFormLoadState;
  formStatus?: FormStatus;
}

export interface CustomerFormLoadState {
  form: boolean;
  submission: boolean;
}

export interface CustomerFormPartialState {
  readonly [CUSTOMER_FORM_FEATURE_KEY]: State;
}

export const initialState: State = {
  // set initial required properties
  fields: [],
  sectionIndex: 0,
  subsectionIndex: 0,
  questionIndex: 0,
  questionAnimation: 'unloaded',
  sectionAnimation: 'unloaded',
  animationInProgress: false,
  sectionProgress: 0,
  questionProgress: 0,
  subsectionProgress: 0,
  preview: false,
  loadState: {
    form: false,
    submission: false,
  },
};

const valueWithinRange = (value, min, max) => {
  if (value >= min) {
    if (value <= max) {
      return value;
    } else {
      return max;
    }
  } else {
    return min;
  }
};

const customerFormReducer = createReducer<State>(
  initialState,
  on(CustomerFormActions.setMetadata, (state, { metadata }) => {
    return {
      ...state,
      metadata: {
        ...state.metadata,
        ...metadata,
      },
    };
  }),
  on(CustomerFormActions.formLoaded, (state, { key, version }) => {
    return {
      ...state,
      loadState: {
        ...state.loadState,
        form: true,
      },
      metadata: {
        ...state.metadata,
        formId: key,
        formVersion: version,
      },
    };
  }),
  on(
    CustomerFormActions.submissionLoaded,
    CustomerFormActions.newCustomerSubmissionCreated,
    (state, { submission }) => {
      const submissionId = submission.id;
      return {
        ...state,
        loadState: {
          ...state.loadState,
          submission: true,
        },
        metadata: {
          ...state.metadata,
          submissionId,
          ...submission.metadata,
        },
      };
    }
  ),
  on(CustomerFormActions.formStatusUpdated, (state, { formStatus }) => {
    return {
      ...state,
      formStatus,
    };
  }),
  on(CustomerFormActions.setFields, (state, { fields }) => ({
    ...state,
    fields,
  })),
  on(CustomerFormActions.animationStart, (state) => ({
    ...state,
    animationInProgress: true,
  })),
  on(CustomerFormActions.animationDone, (state) => ({
    ...state,
    animationInProgress: false,
  })),
  on(
    CustomerFormActions.setSectionAndQuestion,
    (state, { section, question, subsection }) => {
      const sectionIndex = valueWithinRange(
        section,
        0,
        state.fields.length - 1
      );
      const activeSectionSummary = state.fields[sectionIndex];
      const questionIndex = valueWithinRange(
        question,
        0,
        activeSectionSummary.questions - 1
      );
      let subsectionIndex = 0;
      if (activeSectionSummary?.isRepeatable) {
        subsectionIndex = valueWithinRange(
          subsection,
          0,
          activeSectionSummary.repeatInstances - 1 || 0
        );
      }
      const sectionProgress = Math.max(sectionIndex, state.sectionProgress);
      let questionProgress = state.questionProgress;
      if (
        sectionIndex > state.sectionProgress ||
        (sectionIndex === state.sectionProgress &&
          subsectionIndex > state.subsectionProgress)
      ) {
        questionProgress = questionIndex;
      } else if (sectionIndex === state.sectionProgress) {
        questionProgress = Math.max(questionIndex, state.questionProgress);
      }
      let subsectionProgress = state.subsectionProgress;
      if (sectionIndex > state.sectionProgress) {
        subsectionProgress = subsectionIndex;
      } else if (sectionIndex === state.sectionProgress) {
        subsectionProgress = Math.max(
          subsectionIndex,
          state.subsectionProgress
        );
      }
      return {
        ...state,
        questionIndex,
        sectionIndex,
        subsectionIndex,
        sectionProgress,
        questionProgress,
        subsectionProgress,
        questionAnimation: 'appear',
        sectionAnimation: 'loaded',
      };
    }
  ),
  on(CustomerFormActions.goToSection, (state) => ({
    ...state,
    questionAnimation: 'unloaded',
  })),
  on(CustomerFormActions.setSection, (state, { section }) => {
    const sectionProgress = Math.max(section, state.sectionProgress);
    const questionProgress =
      section > state.sectionProgress ? 0 : state.questionProgress;
    const subsectionProgress =
      section > state.sectionProgress ? 0 : state.subsectionProgress;
    return {
      ...state,
      sectionIndex: section,
      sectionProgress,
      questionProgress,
      subsectionProgress,
    };
  }),
  on(CustomerFormActions.goToQuestion, (state, { question }) => {
    const questionAnimation =
      question < state.questionIndex
        ? 'movedown'
        : question > state.questionIndex
        ? 'moveup'
        : 'appear';
    return {
      ...state,
      questionAnimation,
    };
  }),
  on(CustomerFormActions.setQuestion, (state, { question }) => {
    const questionProgress =
      state.sectionIndex === state.sectionProgress
        ? Math.max(question, state.questionProgress)
        : state.questionProgress;
    return {
      ...state,
      questionIndex: question,
      questionAnimation: 'appear',
      questionProgress,
    };
  }),
  on(CustomerFormActions.nextQuestion, (state) => ({
    ...state,
    questionAnimation: 'moveup',
  })),
  on(CustomerFormActions.previousQuestion, (state) => ({
    ...state,
    questionAnimation: 'movedown',
  })),
  on(
    CustomerFormActions.nextSection,
    CustomerFormActions.previousSection,
    (state) => ({
      ...state,
      sectionAnimation: 'unloaded',
    })
  ),
  on(CustomerFormActions.addRepeatSection, (state, { key }) => {
    const fields = [...state.fields].map((field) => ({
      ...field,
      repeatInstances:
        field.key === key ? field.repeatInstances + 1 : field.repeatInstances,
    }));
    return {
      ...state,
      fields,
      sectionAnimation: 'unloaded',
    };
  }),
  on(CustomerFormActions.removeRepeatSection, (state, { key }) => {
    const fields = [...state.fields].map((field) => ({
      ...field,
      repeatInstances:
        field.key === key ? field.repeatInstances - 1 : field.repeatInstances,
    }));
    return {
      ...state,
      fields,
    };
  }),
  on(
    CustomerFormActions.setQuestionAndSubsection,
    (state, { question, subsection }) => {
      const section = state.fields[state.sectionIndex];
      const subsectionIndex = section.isRepeatable
        ? valueWithinRange(subsection, 0, section.repeatInstances - 1 || 0)
        : 0;
      const questionIndex = valueWithinRange(
        question,
        0,
        section.questions - 1
      );
      const questionProgress =
        state.sectionIndex === state.sectionProgress
          ? subsection > state.subsectionProgress
            ? question
            : Math.max(question, state.questionProgress)
          : state.questionProgress;
      const subsectionProgress =
        state.sectionIndex === state.sectionProgress
          ? Math.max(subsection, state.subsectionProgress)
          : state.subsectionProgress;
      return {
        ...state,
        questionIndex,
        subsectionIndex,
        questionProgress,
        subsectionProgress,
        sectionAnimation: 'loaded',
      };
    }
  ),
  on(CustomerFormActions.setPreviewMode, (state, { preview }) => {
    return {
      ...state,
      preview,
      questionAnimation: preview ? 'appear' : state.questionAnimation,
    };
  }),
  on(
    CustomerFormActions.newCustomerSubmissionCreated,
    (state, { submission }) => {
      return {
        ...state,
        metadata: {
          ...state.metadata,
          ...submission.metadata,
        },
      };
    }
  )
);

export function reducer(state: State | undefined, action: Action) {
  return customerFormReducer(state, action);
}
