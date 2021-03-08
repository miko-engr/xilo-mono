import { createAction, props } from '@ngrx/store';
export const drop = createAction('[Tree Component] Drop');

export const getForm = createAction('[Tree Component] Get Form', props<{id: string}>()) ;
export const loadForm = createAction('[Tree Component] Load Form', props<any>()) ;
export const addQuestion = createAction('[Tree Component] Add Question', props<any>());
export const updateQuestion = createAction('Tree Component] Update Question', props<any>());
export const addQuestionGroup = createAction('[Tree Component] Add Question Group', props<any>());
export const addSection = createAction('[Tree Component] Add Section', props<any>());
export const deleteNode = createAction('[Tree Component] Delete Node', props<any>());
