import { cloneDeep } from 'lodash';

export const flattenFormQuestions = (fields: any[]) => {
  let flattenedForm = [];
  if (fields && fields.length > 0) {
    flattenedForm = fields.reduce(function iter(r, a) {
      if (Array.isArray(a.fieldGroup)) {
        return a.fieldGroup.reduce(iter, r);
      }
      r = {
        ...r,
        [a.key]: {
          ...a,
        },
      };
      return r;
    }, {});
  }
  return flattenedForm;
};

export const flattenFormSections = (fields: any[]) => {
  let flattenedForm = [];
  const fieldCopy = cloneDeep(fields);
  if (fieldCopy && fieldCopy.length > 0) {
    flattenedForm = fieldCopy.reduce(function iter(r, a) {
      if (a.type !== 'section' && a.type !== 'intake-section') {
        if (a.type === 'intake-repeat') {
          if (a.fieldGroup[0]) {
            a.fieldGroup[0].key = a.key;
          }
        }
        return a.fieldGroup.reduce(iter, r);
      }
      r.push(a);
      return r;
    }, []);
  }
  return flattenedForm;
};

export const getArrayOfSectionQuestions = (fields: any[]) => {
  const sectionQuestions = {};
  for (const field of fields) {
    const questions = field.fieldArray
      ? flattenFormQuestions(field.fieldArray.fieldGroup)
      : flattenFormQuestions(field.fieldGroup);
    if (
      !sectionQuestions[field.key] ||
      sectionQuestions[field.key].length === 0
    ) {
      sectionQuestions[field.key] = [];
    }
    for (const key in questions) {
      if (questions[key]) {
        sectionQuestions[field.key].push(questions[key]);
      }
    }
  }

  return sectionQuestions;
};

export const getArrayOfSectionsAndFlatQuestions = (fields: any[]) => {
  const sectionQuestions = [];
  for (const field of fields) {
    const questions = field.fieldArray
      ? flattenFormQuestions(field.fieldArray.fieldGroup)
      : flattenFormQuestions(field.fieldGroup);
    for (const key in questions) {
      if (questions[key]) {
        questions[key]['sectionLabel'] = field.templateOptions.label;
        questions[key]['sectionKey'] = field.key;
        questions[key] = {
          ...questions[key],
          ...questions[key].templateOptions
        }
        delete questions[key].templateOptions;
        sectionQuestions.push(questions[key]);
      }
    }
  }

  return sectionQuestions;
};
