import { IIntegrationMappingResponse } from '../interfaces/IIntegrationMappingResponse';
import { IIntegrationMapping } from '../interfaces/IIntegrationMapping';

export class IntegrationMappingResponse implements IIntegrationMappingResponse{
  message: string;
  obj: number;
  integrationMapping?: IIntegrationMapping
}
