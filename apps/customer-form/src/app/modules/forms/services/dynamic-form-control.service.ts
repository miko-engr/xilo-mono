import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { Question, Page, SummaryItem, Answer } from '../models';
import {AddressValidator, InputTrimValidator} from '../../../../app/common/custom-validators';
import { ApplicationStateService } from './applicationState.service';

/**
 * We will be using angular reactive forms.
 * We have the mainFormGroup.
 * It contains a set of formArrays which are the pages.
 * The pages use the page.id as the control name.
 * There can be pages that will be duplicated so fromArray is used.(add driver/vehicle..)
 * The pageformgroup is the content of the array
 * PageFormGroup contains questions as its controls using questionid
 * QuestionFormGroup contains answers as its controls using answerid
 * The answer control keeps track of the propertyKey and the objectname
 */
@Injectable()
export class DynamicFormControlService {
  mainForm: FormGroup;

  constructor(
    private applicationStateService: ApplicationStateService,
    private fb: FormBuilder
    ) {}
  toFormGroup(pages: Page[]): FormGroup {
    const pageGroup: any = {};
    pages.forEach(page => {
      const questionGroup = this.createQuestionFormGroup(page.questions);
      pageGroup[page.id] = this.fb.array([questionGroup]);
    });
    this.mainForm = new FormGroup(pageGroup);
    return this.mainForm;
  }
  createQuestionFormGroup(questions: Question[]): FormGroup {
    const questionGroup: any = {};
    questions.forEach(question => {
      const answerGroup = {};
      question.answers.forEach(answer => {
        const answers = this.applicationStateService.getAnswers();
        if (!answers.some(ans => ans.id === answer.id)) {
          answers.push(answer);
          this.applicationStateService.setAnswers(answers);
        }
        const validators = [];
        if (answer.isRequired) {
          validators.push(Validators.required);
          if (answer.isInput) {
            validators.push(InputTrimValidator());
          }
          // if (answer.isAddressSearch) {
          //   validators.push(AddressValidator());
          // }
        }
        if (answer.isEmail) {
          validators.push(
            Validators.pattern(
              // tslint:disable-next-line:max-line-length
              '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/'
            )
          );
        }

        answerGroup[answer.id] = new FormControl(
          answer.defaultValue,
          validators
        );
        answerGroup[answer.id].objectName = answer.objectName;
        answerGroup[answer.id].propertyKey = answer.propertyKey;
        return answerGroup[answer.id];
      });
      if (Object.entries(answerGroup).length) {
        questionGroup[question.id] = this.fb.group(answerGroup);
      }
    });
    return this.fb.group(questionGroup);
  }

  /**
   *
   * @param page Add new driver, vehicle etc.. requires creating a new formgroup
   * and attatching to the page form array
   */
  createDuplicateFormOfPage(page: Page, objectName = '') {
    const pageForms = this.mainForm.get(page.id.toString()) as FormArray;
    const existingForm = pageForms.controls[0] as FormGroup;
    const newDuplicate = this.createQuestionFormGroup(
      page.questions
    ) as FormGroup;
    const currentFormValue = existingForm.value;
    page.questions.forEach(question => {
      question.answers.forEach((answer: Answer) => {
        if (answer.objectName === objectName) {
          delete currentFormValue[question.id.toString()][answer.answerId];
        }
      });
    });
    newDuplicate.patchValue(currentFormValue);
    // loop through this and erase values if objectname is current one
    pageForms.push(newDuplicate);
  }

  /**
   *
   * @param summaryItem Dynamically created objects can be deleted
   * we will remove it from the form array of the page
   */
  removePageFromMainForm(summaryItem: SummaryItem) {
    const pageForm = this.mainForm.controls[summaryItem.pageid] as FormArray;
    pageForm.removeAt(summaryItem.subIndex);
  }
}
