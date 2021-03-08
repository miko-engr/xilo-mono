import { Transformation } from './transformation.model';

export class Integration {
  constructor(
    public id?: string,
    public vendorName?: string,
    public parentGroup?: string,
    public group?: string,
    public element?: string,
    public processLevel?: string,
    public subLevel?: string,
    public xiloObject?: string,
    public xiloKey?: string,
    public value?: string,
    public index?: number,
    public transformation?: Transformation,
    public al3Length?: string,
    public parentIndex?: string,
    public parentProcessLevel?: string,
    public iterative?: boolean,
    public required?: boolean,
    public sequence?: number,
    public al3Start?: string,
    public lob?: string,
    public classType?: string,
    public dataType?: string,
    public al3GroupLength?: string,
    public al3GroupName?: string,
    public referenceId?: string,
    public isChild?: boolean,
    public formIntegrationId?: number,
    public answerIntegrationId?: number,
  ) {}
}