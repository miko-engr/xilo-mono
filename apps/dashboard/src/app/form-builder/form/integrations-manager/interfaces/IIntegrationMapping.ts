import {IVendorMapping} from './IVendorMapping';

export class IIntegrationMapping {
  id: number
  formId: number
  jsonMapping: IVendorMapping[] = [];
  vendorId: number;
  createdAt: Date
  updatedAt: Date
}
