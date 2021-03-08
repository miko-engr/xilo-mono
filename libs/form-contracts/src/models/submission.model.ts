import { Note } from './note.model';

export class Submission {
  constructor(
    public id?: string | number,
    public metadata?: CustomerFormMetadata | Object,
    public responses?: Object[],
    public note?: Note
  ) {}
}

export interface CustomerFormMetadata {
  clientId?: string | number;
  agentId?: string | number;
  companyId?: string | number;
  submissionId?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  formId?: string;
  formVersion?: number;
}
