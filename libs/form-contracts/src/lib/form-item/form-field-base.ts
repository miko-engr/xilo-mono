import { IIdentifiable, InputFieldType } from '../common'

/**
 * Form input field
 */
export interface IFormFieldBase extends IIdentifiable{
  /**
   * Discriminator for field type
   */
  fieldType: InputFieldType;
  /**
   * Whether required or not
   */
  isRequired: boolean;
  /**
   * Prompt text for field
   */
  promptText:string;
}


