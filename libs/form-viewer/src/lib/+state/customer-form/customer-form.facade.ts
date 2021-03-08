import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  CustomerFormMetadata,
  FormStatus,
  IndexSummary,
  QuestionGroupAnimationState,
} from '@xilo-mono/form-contracts';
import { Observable } from 'rxjs';
import { FormViewerPartialState } from '..';
import { CustomerFormActions } from './customer-form.actions';
import { SectionAnimationState, SectionSummary } from './customer-form.reducer';
import { customerFormQuery } from './customer-form.selectors';

@Injectable()
export class CustomerFormFacade {
  questionIndex$: Observable<number> = this.store.pipe(
    select(customerFormQuery.getQuestionIndex)
  );
  sectionIndex$: Observable<number> = this.store.pipe(
    select(customerFormQuery.getSectionIndex)
  );
  questionAnimation$: Observable<QuestionGroupAnimationState> = this.store.pipe(
    select(customerFormQuery.getQuestionAnimation)
  );
  sectionAnimation$: Observable<SectionAnimationState> = this.store.pipe(
    select(customerFormQuery.getSectionAnimation)
  );
  animationInProgress$: Observable<boolean> = this.store.pipe(
    select(customerFormQuery.getAnimationInProgress)
  );
  fields$: Observable<any> = this.store.pipe(
    select(customerFormQuery.getFields)
  );
  subsectionIndex$ = this.store.pipe(select(customerFormQuery.getSubsection));
  progressSummary$: Observable<IndexSummary> = this.store.pipe(
    select(customerFormQuery.getProgressSummary)
  );
  indexSummary$: Observable<IndexSummary> = this.store.pipe(
    select(customerFormQuery.getIndexSummary)
  );
  currentSection$: Observable<any> = this.store.pipe(
    select(customerFormQuery.getCurrentSection)
  );
  isLastQuestionInSection$: Observable<boolean> = this.store.pipe(
    select(customerFormQuery.getIsLastQuestionInSection)
  );
  metadata$ = this.store.pipe(select(customerFormQuery.getMetadata));
  loadState$ = this.store.pipe(select(customerFormQuery.getLoadState));
  formStatus$ = this.store.pipe(select(customerFormQuery.getFormStatus));

  constructor(private store: Store<FormViewerPartialState>) {}

  loadForm(formId: string) {
    this.store.dispatch(CustomerFormActions.loadForm({ formId }));
  }

  setMetadata(metadata: CustomerFormMetadata) {
    this.store.dispatch(CustomerFormActions.setMetadata({ metadata }));
  }

  loadSubmission(submissionId: string | number) {
    this.store.dispatch(CustomerFormActions.loadSubmission({ submissionId }));
  }

  updateSubmission() {
    this.store.dispatch(CustomerFormActions.updateSubmission());
  }

  setFields(fields: any[]) {
    const sections = [];
    fields
      .filter((field) => !!field)
      .forEach((field) => {
        const section: SectionSummary = {
          key: field.key,
          questions: field.fieldArray
            ? field.fieldArray?.fieldGroup?.length
            : field.fieldGroup?.length,
          isRepeatable:
            field.fieldArray?.templateOptions?.hasRepeatButtons || false,
        };
        if (section.isRepeatable) {
          section.repeatInstances = 1;
        }
        sections.push(section);
      });
    this.store.dispatch(CustomerFormActions.setFields({ fields: sections }));
  }

  validateProgress(indexes: IndexSummary) {
    this.store.dispatch(CustomerFormActions.validateProgress(indexes));
  }

  animationStart() {
    this.store.dispatch(CustomerFormActions.animationStart());
  }

  animationDone() {
    this.store.dispatch(CustomerFormActions.animationDone());
  }

  next() {
    this.store.dispatch(CustomerFormActions.updateSubmission());
    this.store.dispatch(CustomerFormActions.next());
  }

  previous() {
    this.store.dispatch(CustomerFormActions.updateSubmission());
    this.store.dispatch(CustomerFormActions.previous());
  }

  goToQuestion(question: number) {
    this.store.dispatch(CustomerFormActions.goToQuestion({ question }));
  }

  setSectionAndQuestion(section: number, question: number, subsection = 0) {
    this.store.dispatch(
      CustomerFormActions.setSectionAndQuestion({
        section,
        question,
        subsection,
      })
    );
  }
  addRepeatSection(key: string) {
    this.store.dispatch(CustomerFormActions.addRepeatSection({ key }));
  }

  removeRepeatSection(key: string) {
    this.store.dispatch(CustomerFormActions.removeRepeatSection({ key }));
  }

  setPreviewMode(preview: boolean) {
    this.store.dispatch(CustomerFormActions.setPreviewMode({ preview }));
  }

  newCustomerSubmission(companyId: string) {
    this.store.dispatch(
      CustomerFormActions.newCustomerSubmission({ companyId })
    );
  }

  updateFormStatus(formStatus: FormStatus) {
    this.store.dispatch(CustomerFormActions.updateFormStatus({ formStatus }));
  }
}
