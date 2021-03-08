import { IFormFieldBase } from './form-field-base';
import { InputFieldType } from '../common';

/**
 * Basic text input field
 */
export interface ITextInputField extends IFormFieldBase {
  fieldType: InputFieldType.TEXT;
  /**
   * Actual value of field
   */
  fieldVal: string;
}
