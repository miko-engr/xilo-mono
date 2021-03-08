import { IIntegrationMappingResponse } from '../interfaces/IIntegrationMappingResponse';
import { IIntegrationMapping } from '../interfaces/IIntegrationMapping';
import { IVendorMapping } from '../interfaces/IVendorMapping';

export class IntegrationMapping implements IIntegrationMapping {
  createdAt: Date;
  formId: number;
  id: number;
  jsonMapping: IVendorMapping[];
  vendorId: number;
  updatedAt: Date;
}
