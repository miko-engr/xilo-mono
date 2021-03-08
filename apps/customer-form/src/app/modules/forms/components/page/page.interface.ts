import { Answer } from '../../models';

export type PageAnimationStateTypes = 'unloaded' | 'loaded';

export type AutocompleteAddressTriggerEvent = {
  answer: Answer;
  addressObj: any;
};

export type FormError = { message: string; type: 'error' | 'warning' | null };
