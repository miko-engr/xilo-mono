import { createReducer, on } from '@ngrx/store';
import { v4 } from 'uuid';
import {
  drop,
  addQuestion,
  addQuestionGroup,
  addSection,
  deleteNode,
  updateQuestion,
  loadForm,
} from '../actions';

import { dummyForm, fieldTypes } from './dummy-form-submission-data';


function convertFormTemplateToFormTreeFieldSections(res): {} {
  let formData = {};
  // TODO: add type once finalized
  function extractSectionDataFromFieldGroup(fieldGroups): any {
    return fieldGroups.map((fieldGroup) => {
      let children = [];
      if(fieldGroup.type === 'select') {
        fieldGroup.templateOptions.options.forEach((option) => {
          children.push({
            key: v4(),
            name: option.label,
            value: option.value,
            componentType: 'question',
            type: 'select',
          });
        });
        
        return {
          key: fieldGroup.key,
          name: fieldGroup.templateOptions.label,
          value: fieldGroup.templateOptions.label,
          componentType: 'questionGroup',
          type: fieldGroup.type,
          children,
        };
      } else if(fieldGroup.type === 'input') {
        return {
          key: fieldGroup.key,
          name: fieldGroup.templateOptions.label,
          value: fieldGroup.templateOptions.label,
          componentType: 'question',
          type: fieldGroup.type,
          templateOptions: fieldGroup.templateOptions,
        };
      }
    });
  }

  // 1st component should have property type === "form"
  // There may be many components in the future...
  const form = res.obj[0];

  formData = form.fieldGroup.map((fieldGroup) => {
    // TODO: these types should be in an enum somewhere
    if (fieldGroup.type === 'section') {
      const nodes = extractSectionDataFromFieldGroup(fieldGroup.fieldGroup);

      return {
        id: fieldGroup.key,
        title: fieldGroup.templateOptions.label,
        children: nodes,
        type: fieldGroup.type,
        componentType: 'section',
      };
    } else if (fieldGroup.type === 'repeat') {
      const nodes = extractSectionDataFromFieldGroup(fieldGroup.fieldArray.fieldGroup);
      
      return {
        id: fieldGroup.key,
        title: fieldGroup.templateOptions.label,
        children: nodes,
        type: fieldGroup.fieldArray.type,
        componentType: 'section'
      };
    } else {
      return {
        id: null,
      };
    }
  });
  return formData;
}

const nodes = convertFormTemplateToFormTreeFieldSections(dummyForm);

export const initialState = {
  nodes,
  fieldTypes,
};

const _treeReducer = createReducer(initialState,
  on(drop, state => state),
  on(loadForm, (state, action) => ({ ...state, nodes: action.nodes })),
  on(addQuestion, (state, updatedValue) => ({ nodes: updatedValue })),
  on(updateQuestion, (state, updatedValue) => ({ nodes: updatedValue })),
  on(addQuestionGroup, (state, updatedValue) => ({ nodes: updatedValue })),
  on(addSection, (state, updatedValue) => ({ nodes: updatedValue })),
  on(deleteNode, (state, updatedValue) => ({ nodes: updatedValue }))
);

export function treeReducers(state, action) {
  return _treeReducer(state, action);
}

export const selectForm = (state: any) => state['treeReducers'].nodes;
