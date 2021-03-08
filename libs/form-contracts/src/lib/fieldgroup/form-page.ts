import { GroupType, IFormEntityBase } from '../common';
import { IFieldGroupBase } from './field-group-base';


/**
 * Single page within a form
 */
export interface IFormPage extends IFieldGroupBase{
    groupType: GroupType.PAGE
}