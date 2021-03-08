import { IFormFieldBase } from './form-field-base';
import { InputFieldType } from '../common';

/**
 * Basic numeric input field
 */
export interface INumericInputField extends IFormFieldBase {
  fieldType: InputFieldType.NUMERIC;
  /**
   * Actual value of field
   */
  fieldVal: number;
}
