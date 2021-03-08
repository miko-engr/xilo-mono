import { IFormEntityBase } from '../common';
import { IFieldGroupBase } from '../fieldgroup/field-group-base';

/**
 * Outermost form container object
 */
export interface IFormContainer extends IFormEntityBase {
  /**
   * User-defined tags
   */
  tags: string[];
  /**
   * Groups within form
   */
  contents: IFieldGroupBase[];
  /**
   * ID of form owner
   */
  owner: string;
}
