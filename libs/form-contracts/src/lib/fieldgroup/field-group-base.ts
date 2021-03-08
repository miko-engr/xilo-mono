import { GroupType, IFormEntityBase } from '../common';
import { IFormFieldBase } from '../form-item';

/**
 * Group of any kind of fields
 */
export interface IFieldGroupBase extends IFormEntityBase {
  /**
   * What kind of field group?
   */
  groupType: GroupType;
  /**
   * Array of fields contained within a group
   */
  groupContents: IFormFieldBase[];
}