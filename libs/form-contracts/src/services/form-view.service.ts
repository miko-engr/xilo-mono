import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FormView, Note, Submission } from '../models';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { forkJoin, iif, of } from 'rxjs';

export class FormState {
  valid: boolean;
  hideSections?: string[];
}

export interface IndexSummary {
  sectionIndex: number;
  subsectionIndex: number;
  questionIndex: number;
}

export type QuestionGroupAnimationState =
  | 'unloaded'
  | 'moveup'
  | 'movedown'
  | 'appear';

@Injectable()
export class FormViewService {
  apiUrl = `${environment.apiUrl}form-view`;
  formState = new BehaviorSubject<FormState>({
    valid: true,
  });
  questionGroupState = new BehaviorSubject<FormState>({
    valid: true,
  });
  note = null;
  noteLoaded = new BehaviorSubject<boolean>(false);
  submitForm = new BehaviorSubject<boolean>(false);
  nextForm = new BehaviorSubject<boolean>(false);
  nextFormSection = new BehaviorSubject<number>(null);
  openBlockDialog = new BehaviorSubject<boolean>(false);
  scrollState = new BehaviorSubject<string>(null);
  loadState = new BehaviorSubject<string>(null);
  rebuildForm = new BehaviorSubject<boolean>(null);
  dataSource = new BehaviorSubject<any>({});
  activeState = new BehaviorSubject<string>(null);
  data = this.dataSource.asObservable();
  sectionLoaded$ = new BehaviorSubject<number>(0);
  private sectionsLoaded = 0;

  formView: FormView;
  fields: FormlyFieldConfig[] = [];
  model: any;
  form = new FormGroup({});
  submission: Submission;
  responseIndex = 0;

  constructor(private http: HttpClient) {}

  changeFormState(formState: FormState) {
    this.formState.next(formState);
  }

  changeQuestionGroupState(formState: FormState) {
    this.questionGroupState.next(formState);
  }

  changeNoteState(hasLoaded: boolean) {
    this.noteLoaded.next(hasLoaded);
  }

  changeRebuildForm(rebuild: boolean) {
    this.rebuildForm.next(rebuild);
  }

  scrollIntoView(key: string) {
    this.scrollState.next(key);
  }

  changeLoadState(state: string) {
    this.loadState.next(state);
  }

  onSubmitForm(submit: boolean) {
    this.submitForm.next(submit);
  }

  onNextForm(next: boolean) {
    this.nextForm.next(next);
  }

  onNextFormBySection(section: number) {
    this.nextFormSection.next(section);
  }

  onOpenBlockDialog(open: boolean) {
    this.openBlockDialog.next(open);
  }

  changeSectionActiveView(key: any) {
    this.activeState.next(key);
  }

  setNote(note: Note) {
    this.note = note;
  }

  getNote() {
    return this.note;
  }

  create(formData: any) {
    return this.http
      .post(`${this.apiUrl}/create`, formData)
      .pipe(map((result) => result['obj']));
  }

  duplicate(formData: any) {
    return this.http
      .post(`${this.apiUrl}/duplicate`, formData)
      .pipe(map((result) => result['obj']));
  }

  update(formData: any) {
    return this.http
      .put(`${this.apiUrl}/update`, formData)
      .pipe(map((result) => result['obj']));
  }

  getForm(id: string | number) {
    if (id) {
      return this.http
        .get(`${this.apiUrl}/list-one/${id}`)
        .pipe(map((result) => result['obj']));
    }
    return this.http
      .get('/assets/data/customer-form-data.json')
      .pipe(map((result) => result['obj']));
  }

  getTemplates() {
    return this.http.get(`${this.apiUrl}/list-templates`).pipe(
      switchMap((result: FormView[]) => {
        return iif(
          () => !result.length || result.length === 0,
          forkJoin([
            this.http
              .get('/assets/data/intake-form-data.json')
              .pipe(map((result) => result['obj'])),
            this.http
              .get('/assets/data/customer-form-data.json')
              .pipe(map((result) => result['obj'])),
          ]),
          of(result)
        );
      })
    );
    // return this.http.get(`${this.apiUrl}/list-templates`)
    // .pipe(
    //     switchMap((result: FormView[]) =>
    //        iif(() => !result.length || result.length === 0),
    //        this.getForm(),

    //     )));
    /*
map((result: FormView[]) => {
            if (result.length && result.length === 0) {
                return this.http.get('/assets/data/intake-form-data.json')
            } else {
                return result;
            }
        }
        */
  }

  // getForm(id: string | number) {
  //     return this.http.get(`${this.apiUrl}/list-one/${id}`)
  //     .pipe(map(result =>
  //         result['obj']
  //     ));
  // }

  getFormByFormId(id: string | number) {
    return this.http
      .get(`${this.apiUrl}/list-one-by-form/${id}`)
      .pipe(map((result) => result['obj']));
  }

  getFormsByCompany() {
    return this.http
      .get(`${this.apiUrl}/list-all-by-company`)
      .pipe(map((result) => result['obj']));
  }

  delete(id: string | number) {
    return this.http
      .delete(`${this.apiUrl}/delete/${id}`)
      .pipe(map((result) => result['obj']));
  }

  sectionLoaded() {
    this.sectionsLoaded++;
    this.sectionLoaded$.next(this.sectionsLoaded);
  }

  getSection(sectionIndex: number) {
    if (this.fields) {
      return this.fields[sectionIndex];
    } else {
      return null;
    }
  }

  isRepeatSection(section: FormlyFieldConfig) {
    return section.fieldArray && section.fieldArray?.fieldGroup?.length > 0;
  }

  hasRepeatAnswers(section: FormlyFieldConfig) {
    return section.fieldArray && section.fieldGroup?.length > 1;
  }

  getQuestionsForSection(sectionIndex: number) {
    const section = this.getSection(sectionIndex);
    if (section) {
      return section.fieldArray
        ? section.fieldArray.fieldGroup
        : section.fieldGroup;
    } else {
      return null;
    }
  }

  getQuestion(sectionIndex: number, questionIndex: number) {
    const questions = this.getQuestionsForSection(sectionIndex);
    if (questions) {
      return questions[questionIndex];
    } else {
      return null;
    }
  }

  getPrevious(current: IndexSummary) {
    let previous = this.getPreviousIndexes(current);
    while (this.isHidden(previous)) {
      previous = this.getPreviousIndexes(previous);
      if (previous.sectionIndex < 0) {
        previous = { sectionIndex: 0, subsectionIndex: 0, questionIndex: 0 };
        break;
      }
    }
    return previous;
  }

  getPreviousIndexes(current: IndexSummary) {
    let previous: IndexSummary = {
      sectionIndex: 0,
      subsectionIndex: 0,
      questionIndex: 0,
    };
    const section = this.getSection(current.sectionIndex);
    if (section) {
      let hasRepeatAnswers = this.hasRepeatAnswers(section);
      const questions = this.getQuestionsForSection(current.sectionIndex);
      if (hasRepeatAnswers && current.subsectionIndex > 0) {
        if (current.questionIndex === 0) {
          previous = {
            sectionIndex: current.sectionIndex,
            subsectionIndex: current.subsectionIndex - 1,
            questionIndex: questions.length - 1,
          };
        } else {
          previous = {
            sectionIndex: current.sectionIndex,
            subsectionIndex: current.subsectionIndex,
            questionIndex: current.questionIndex - 1,
          };
        }
      } else {
        if (current.questionIndex === 0) {
          const previousSection = this.getSection(current.sectionIndex - 1);
          const previousQuestions = this.getQuestionsForSection(
            current.sectionIndex - 1
          );
          const previousHasRepeatAnswers = this.hasRepeatAnswers(
            previousSection
          );
          previous = {
            sectionIndex: current.sectionIndex - 1,
            subsectionIndex: previousHasRepeatAnswers
              ? previousSection.fieldGroup.length - 1
              : 0,
            questionIndex: previousQuestions.length - 1,
          };
        } else {
          previous = {
            sectionIndex: current.sectionIndex,
            subsectionIndex: current.subsectionIndex,
            questionIndex: current.questionIndex - 1,
          };
        }
      }
    }
    return previous;
  }

  getNext(current: IndexSummary) {
    let next = this.getNextIndexes(current);
    while (this.isHidden(next)) {
      next = this.getNextIndexes(next);
      if (next.sectionIndex >= this.fields?.length) {
        next = {
          sectionIndex: 0,
          subsectionIndex: 0,
          questionIndex: 0,
        };
        break;
      }
    }
    return next;
  }

  getNextIndexes(current: IndexSummary) {
    let next: IndexSummary = {
      sectionIndex: 0,
      subsectionIndex: 0,
      questionIndex: 0,
    };
    const section = this.getSection(current.sectionIndex);
    if (section) {
      let hasRepeatAnswers =
        section?.fieldArray && section?.fieldGroup?.length > 1;
      const questions = this.getQuestionsForSection(current.sectionIndex);
      if (questions) {
        if (
          hasRepeatAnswers &&
          current.subsectionIndex < section.fieldGroup?.length - 1
        ) {
          next =
            current.questionIndex < questions.length - 1
              ? {
                  sectionIndex: current.sectionIndex,
                  subsectionIndex: current.subsectionIndex,
                  questionIndex: current.questionIndex + 1,
                }
              : {
                  sectionIndex: current.sectionIndex,
                  subsectionIndex: current.subsectionIndex + 1,
                  questionIndex: 0,
                };
        } else {
          next =
            current.questionIndex < questions.length - 1
              ? {
                  sectionIndex: current.sectionIndex,
                  subsectionIndex: current.subsectionIndex,
                  questionIndex: current.questionIndex + 1,
                }
              : {
                  sectionIndex: current.sectionIndex + 1,
                  subsectionIndex: 0,
                  questionIndex: 0,
                };
        }
      }
    }
    return next;
  }

  isHidden(summary: IndexSummary) {
    const section = this.getSection(summary.sectionIndex);
    if (section) {
      const sectionHidden = section.templateOptions.hidden;
      if (sectionHidden) {
        return true;
      } else if (summary.questionIndex >= 0) {
        const question = this.getQuestion(
          summary.sectionIndex,
          summary.questionIndex
        );
        if (question && typeof question.hideExpression === 'function') {
          return question.hideExpression(this.model, summary, question);
        } else {
          return question.templateOptions?.hidden;
        }
      }
    }
    return false;
  }

  hideExpression(model: any, formState: any, field: FormlyFieldConfig) {
    if (field?.templateOptions?.query) {
      field.templateOptions.hidden = true;
      return true;
    } else {
      field.templateOptions.hidden = false;
      return false;
    }
  }

  getProgress(): IndexSummary {
    let sectionIndex = 0;
    let subsectionIndex = 0;
    let questionIndex = 0;
    while (sectionIndex < this.fields.length) {
      if (!this.isHidden({ sectionIndex, subsectionIndex, questionIndex })) {
        const section = this.getSection(sectionIndex);
        if (this.isRepeatSection(section)) {
          while (
            subsectionIndex === 0 ||
            subsectionIndex < section.fieldGroup.length
          ) {
            const questions = this.getQuestionsForSection(sectionIndex);
            while (questionIndex < questions.length) {
              if (
                !this.isHidden({ sectionIndex, questionIndex, subsectionIndex })
              ) {
                const question = questions[questionIndex];
                const control = this.getControl(
                  section.key as string,
                  question.key as string,
                  subsectionIndex
                );
                if (!control.valid) {
                  return { sectionIndex, subsectionIndex, questionIndex };
                }
              }
              questionIndex++;
            }
            subsectionIndex++;
            questionIndex = 0;
          }
        } else {
          subsectionIndex = 0;
          const questions = this.getQuestionsForSection(sectionIndex);
          while (questionIndex < questions.length) {
            const question = questions[questionIndex];
            const control = this.getControl(
              section.key as string,
              question.key as string
            );
            if (!control.valid) {
              return { sectionIndex, subsectionIndex, questionIndex };
            }
            questionIndex++;
          }
        }
      }
      sectionIndex++;
      subsectionIndex = 0;
      questionIndex = 0;
    }
    return { sectionIndex, subsectionIndex, questionIndex };
  }

  getControl(
    sectionKey: string,
    questionKey: string,
    subsectionIndex?: number
  ) {
    const sectionControl = this.form.controls[sectionKey];
    if (sectionControl) {
      if (subsectionIndex >= 0) {
        const subsectionControl = (<FormGroup>sectionControl).controls[
          subsectionIndex
        ];
        const questionControl = (<FormGroup>subsectionControl).controls[
          questionKey
        ];
        return questionControl;
      } else {
        const questionControl = (<FormGroup>sectionControl).controls[
          questionKey
        ];
        return questionControl;
      }
    }
    return sectionControl;
  }

  getFieldIndex(field: FormlyFieldConfig) {
    if (isNaN(+field.key)) {
      return this.fields.findIndex((section) => section.key === field.key);
    } else {
      return this.fields.findIndex(
        (section) =>
          section.fieldArray?.fieldGroup[0].key === field.fieldGroup[0].key
      );
    }
  }
}
