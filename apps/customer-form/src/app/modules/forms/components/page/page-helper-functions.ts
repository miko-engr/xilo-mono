import {
  Form,
  SummaryItem,
  Answer,
  Page,
  Client,
  Condition,
  AnswerItemInSummary
} from '../../models';
import { FormGroup, FormArray } from '@angular/forms';
import { DynamicFormControlService } from '../../services';
import { nth, capitalize } from '../../../../../app/common/helper';
import * as stringSimilarity from '../../../../common/string-similarity.utils';

// create the summary object
// we have the option to goto page with page number
// we have the option to goto quesiton with pagenumber and questionnumber
export function createSummaryObjectFromPages(pages: Page[]): SummaryItem[] {
  const summary: SummaryItem[] = [];
  pages.forEach((page, pageIndex) => {
    summary.push(createSummaryItemFromPageData(page, pageIndex));
  });
  return summary;
}

function getPageTitle(title) {
  return title === 'Accidents' ? 'Incidents' : title;
}
function createSummaryItemFromPageData(
  page: Page,
  pageIndex,
  isCreatedAtRunTime = false,
  subIndex = 0
): SummaryItem {
  let title = getPageTitle(page.title);
  if (isCreatedAtRunTime) {
    title =
      subIndex +
      1 +
      nth(subIndex + 1) +
      ' ' +
      getPageTitle(page.title).substring(
        0,
        getPageTitle(page.title).length - 1
      );
  }
  const summaryItem: SummaryItem = {
    isCreatedAtRunTime,
    pageIndex,
    subIndex,
    pageid: page.id,
    title: title,
    answers: [],
    pristine: true,
    valid: false,
    lastQuestionIndex: 0,
    hidden: false
  };
  page.questions.forEach((question, questionIndex) => {
    question.answers.forEach((answer: Answer, answerIndex: number) => {
      if (answer.propertyKey) {
        summaryItem.answers.push({
          questionIndex,
          id: answer.answerId,
          propertyKey: answer.propertyKey,
          answerIndex,
          answerValue: '',
          answerType: getAnswerType(answer),
          objectName: answer.objectName
        });
      }
      if (isMultipleAdd(answer)) {
        summaryItem.objectName = answer.objectName;
      }
    });
  });
  return summaryItem;
}

// check if it is a type of mutiple type answer
export function isMultipleAdd(answer: Answer) {
  return (
    answer.isAddDriver ||
    answer.isAddHome ||
    answer.isAddIncident ||
    answer.isAddLocation ||
    answer.isAddRecreationalVehicle ||
    answer.isAddVehicle ||
    answer.isAddPolicy
  );
}

// create a summaryitem from page data and insert at pageindex
export function createSummaryItemFromPageDataAndInsertAtIndex(
  summary: SummaryItem[],
  page: Page,
  pageIndex: number,
  subIndex: number
) {
  const startingIndexOfThisPage = summary.findIndex(
    summaryItem => summaryItem.pageIndex === pageIndex
  );
  // this summary item is created at run time so isCreatedAtRunTime
  // is true so that can have options like edit and delete
  if (!summary[startingIndexOfThisPage + subIndex - 1].isCreatedAtRunTime) {
    summary[startingIndexOfThisPage + subIndex - 1].isCreatedAtRunTime = true;
    summary[startingIndexOfThisPage + subIndex - 1].title =
      subIndex +
      nth(subIndex) +
      ' ' +
      getPageTitle(page.title).substring(
        0,
        getPageTitle(page.title).length - 1
      );
  }
  summary.splice(
    startingIndexOfThisPage + subIndex,
    0,
    createSummaryItemFromPageData(page, pageIndex, true, subIndex)
  );
}

// this is used to find and style accordingly
function getAnswerType(answer: Answer): string {
  if (answer.isDatePicker) {
    return 'date';
  }
  return 'text';
}
export function getFormControlByDetectingArray(form, index): FormGroup {
  // if this page form has length then it means it is a form array else form group
  if (form.length) {
    return form.controls[index];
  } else {
    return form;
  }
}
export const ObjectModelMap = {
  // these are modelnames
  client: 'Client',
  drivers: 'Driver',
  vehicles: 'Vehicle',
  homes: 'Home',
  locations: 'Location',
  incidents: 'Incident',
  recreationalVehicles: 'RecreationalVehicle',
  policies: 'Policy',
  business: 'Business',
  // these are objnames
  Client: 'client',
  Driver: 'drivers',
  Vehicle: 'vehicles',
  Home: 'homes',
  Location: 'locations',
  Incident: 'incidents',
  Policy: 'policies',
  RecreationalVehicle: 'recreationalVehicles',
  Business: 'business'
};

export function hasIntegration(vendor: string, formData: Form) {
  return (
    formData &&
    formData.integrations &&
    formData.integrations.length > 0 &&
    formData.integrations.includes(vendor)
  );
}

export function isMultipleObj(objectName) {
  return [
    'drivers',
    'vehicles',
    'homes',
    'locations',
    'incidents',
    'recreationalVehicles',
    'policies'
  ].includes(objectName);
}

export function getValueOfPropertyKeyFromClientData(
  client,
  propKey,
  objectName,
  subIndex = 0
) {
  if (isMultipleObj(objectName)) {
    const multipleItemsArray = client[objectName];
    if (multipleItemsArray) {
      const obj = multipleItemsArray[subIndex];
      if (obj) {
        const value = obj[propKey];
        if (value) {
          return value;
        }
      }
    }
  } else {
    if (objectName === 'client' && (client[propKey] || client[propKey] === 0)) {
      return client[propKey];
    } else if (client[objectName] && (client[objectName][propKey] || client[objectName][propKey] === 0)) {
      return client[objectName][propKey];
    }
  }
}

export function updateFormControlsFromClientData(
  client: Client,
  mainForm: FormGroup,
  formData: Form,
  DFCS: DynamicFormControlService,
  summary: SummaryItem[]
) {
  // first find all multiple objects and then duplicate if there are multiple items
  for (const key in client) {
    if (client.hasOwnProperty(key)) {
      if (isMultipleObj(key)) {
        const multipleobj = client[key];
        if (multipleobj.length > 1) {
          for (let index = 1; index < multipleobj.length; index++) {
            // const element = multipleobj[index];

            formData.pages.forEach((page, pageIndex) => {
              if (
                page.routePath === key ||
                (page.routePath === 'accidents' && key === 'incidents')
              ) {
                DFCS.createDuplicateFormOfPage(page);
                createSummaryItemFromPageDataAndInsertAtIndex(
                  summary,
                  page,
                  pageIndex,
                  index
                );
              }
            });
          }
          // create new form control
        }
      }
    }
  }

  updateFormAndSummaryWithClientData(mainForm, client, summary);
}
export function updateFormAndSummaryWithClientData(mainForm, client, summary) {
  // we loop through the mainform.controls object and pick pageforms
  //
  for (const pageid in mainForm.controls) {
    if (mainForm.controls.hasOwnProperty(pageid)) {
      const pageFormArray = mainForm.controls[pageid] as FormArray;
      // pageFormArray is a formarray type
      pageFormArray.controls.forEach((qsnFormGroup, subIndex) => {
        const questionFormGroup = qsnFormGroup as FormGroup;

        for (const questionId in questionFormGroup.controls) {
          if (questionFormGroup.controls.hasOwnProperty(questionId)) {
            const questionControl = questionFormGroup.controls[
              questionId
            ] as FormGroup;
            for (const answerId in questionControl.controls) {
              if (questionControl.controls.hasOwnProperty(answerId)) {
                const answerControl = questionControl.controls[
                  answerId
                ] as FormGroup;
                const propertyKey = (answerControl as any).propertyKey;
                const objectName = (answerControl as any).objectName;
                const value = getValueOfPropertyKeyFromClientData(
                  client,
                  propertyKey,
                  objectName,
                  subIndex
                );
                if (value || (propertyKey === 'addMultiple' && value)) {
                  answerControl.patchValue(value || '');
                  answerControl.markAsDirty();
                }
              }
            }
          }
        }
        updateSummaryObjectwithValuesFromQuestionForm(
          questionFormGroup.value,
          summary,
          +pageid,
          subIndex,
          questionFormGroup
        );
      });
    }
  }
}

function updateSummaryObjectwithValuesFromQuestionForm(
  currentFormValue,
  summary,
  pageid,
  subIndex,
  pageform
) {
  const summaryItemFound = summary.find(
    (summaryItem: SummaryItem) =>
      summaryItem.pageid === pageid && summaryItem.subIndex === subIndex
  );
  for (const questionId in currentFormValue) {
    if (currentFormValue.hasOwnProperty(questionId)) {
      const questionValue = currentFormValue[questionId];
      for (const answerId in questionValue) {
        if (questionValue.hasOwnProperty(answerId)) {
          const answerValue = questionValue[answerId];

          const answerItemFound = summaryItemFound.answers.find(
            (answerItem: AnswerItemInSummary) => answerItem.id === answerId
          );
          if (answerItemFound) {
            answerItemFound.answerValue = answerValue;
            summaryItemFound.lastQuestionIndex = answerItemFound.questionIndex;
          }
        }
      }
      summaryItemFound.pristine = pageform.pristine;
      summaryItemFound.valid = pageform.valid;
    }
  }
}
export function getValueofPropertyKeyFromForm(
  condition: { key?: string; object?: string; answerId?: string },
  mainForm,
  subIndex
): any {
  for (const pageid in mainForm.controls) {
    if (mainForm.controls.hasOwnProperty(pageid)) {
      const pageFormArray = mainForm.controls[pageid] as FormArray;
      // pageFormArray is a formarray type
      const maxLength = pageFormArray.controls.length;
      for (let index = 0; index < maxLength; index++) {
        const qsnFormGroup = pageFormArray.controls[index];
        if ((index !== subIndex) && maxLength > 1) {
          continue;
        }
        // }
        // for (const qsnFormGroup of pageFormArray.controls) {
        // const qsnFormGroup = pageFormArray.controls[];
        const questionFormGroup = qsnFormGroup as FormGroup;

        for (const questionId in questionFormGroup.controls) {
          if (questionFormGroup.controls.hasOwnProperty(questionId)) {
            const questionControl = questionFormGroup.controls[
              questionId
            ] as FormGroup;
            if (
              condition.answerId &&
              questionControl.controls[condition.answerId]
            ) {
              return questionControl.controls[condition.answerId].value;
            } else {
              for (const answerId in questionControl.controls) {
                if (questionControl.controls.hasOwnProperty(answerId)) {
                  const answerControl = questionControl.controls[
                    answerId
                  ] as FormGroup;

                  if (
                    (answerControl as any).propertyKey === condition.key &&
                    (answerControl as any).objectName === condition.object
                  ) {
                    return questionControl.controls[answerId].value;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
export function conditionsAreTrue(
  conditions: Condition[],
  mainForm,
  subIndex: number
) {
  if (conditions) {
    const conditionResponses = conditions.map(condition => {
      const value = getValueofPropertyKeyFromForm(
        condition,
        mainForm,
        subIndex
      );
      if (value) {
        if (condition.operator === '=') {
          return value === condition.value;
        } else if (condition.operator === '!=') {
          return value && value !== condition.value;
        } else if (condition.operator === '>') {
          return value > condition.value;
        } else if (condition.operator === '<') {
          return value < condition.value;
        } else if (condition.operator === '+') {
          return typeof value === 'string'
            ? value.toLowerCase().includes(condition.value.toLowerCase())
            : value.includes(condition.value);
        } else if (condition.operator === '!+') {
          return typeof value === 'string'
            ? !value.toLowerCase().includes(condition.value.toLowerCase())
            : !value.includes(condition.value);
        }
      } else {
        return false;
      }
    });
    return !conditionResponses.includes(false);
  } else {
    return true;
  }
}

export function removeSummaryItemAndUpdateSummaryObject(
  summaryItem: SummaryItem,
  summary: SummaryItem[]
) {
  //first remove that item by finding the index
  const summaryIndex = summary.findIndex(
    item =>
      item.pageIndex === summaryItem.pageIndex &&
      item.subIndex === summaryItem.subIndex
  );

  summary.splice(summaryIndex, 1);

  // find all elements with this pageid and update its subindex
  const summaryItemsWithSamePageId = summary.filter(
    item => item.pageid === summaryItem.pageid
  );
  if (summaryItemsWithSamePageId.length > 1) {
    summaryItemsWithSamePageId.forEach((item, index) => {
      const objName = summaryItemsWithSamePageId[index].title.split(' ')[1];

      item.subIndex = index;
      item.title =
        index +
        1 +
        nth(index + 1) +
        ' ' +
        objName.substring(0, item.title.length - 1);
    });
  } else {
    // "1st Driver" => "Driver"
    const objName = summaryItemsWithSamePageId[0].title.split(' ')[1];
    // "Driver" => "Drivers"
    summaryItemsWithSamePageId[0].title = capitalize(ObjectModelMap[objName]);
    summaryItemsWithSamePageId[0].isCreatedAtRunTime = false;
    summaryItemsWithSamePageId[0].subIndex = 0;
  }
}

export function onMatchProperties(
  answers: Answer[],
  value: string,
  key: string
) {
  value = value.toString();
  if (
    value &&
    key &&
    answers &&
    answers[0] &&
    answers.some(answer => answer.propertyKey === key)
  ) {
    let i = answers.findIndex(answer => answer.propertyKey === key);
    let answer = answers[i];
    if (answer.options && answer.options[0]) {
      return returnBestMatch(value, answer.options);
    } else {
      return value;
    }
  } else {
    return value;
  }
}
export function returnBestMatch(value?: string, array?: any) {
  if (
    typeof array != 'undefined' &&
    array &&
    array !== null &&
    array != [] &&
    array.length &&
    array.length !== 0
  ) {
    const bestString =
      array[stringSimilarity.findBestMatch(value, array).bestMatchIndex];
    return bestString;
  } else {
    return value;
  }
}
