export interface Agent {
  id: number;
  name?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  companyAgentId?: number;
  isPrimaryAgent?: boolean;
  firstName?: string;
  lastName?: string;
  lineOfBusiness?: string;
  canSeeAllClients?: boolean;
  resetPasswordLink?: string;
  tags?: string[];
  canSeeTagsOnly?: boolean;
  producerCode?: string;
  executiveCode?: string;
  agentIds?: number[];
  canSeeAgentsOnly?: boolean;
  notificationJson?: object;
  phone?: string;
  settings?: object;
  lastAssignmentDate?: Date;
  betterAgencyUsername?: string;
  agentForm: object; // TODO should be replaced to Forms interface
  formAgent: object; // TODO should be replaced to Forms interface
  clients: object[]; // TODO should be replaced to Clients interface
  lifecycleAnalytics: object[]; // TODO should be replaced to LifecycleAnalytics interface
  notes: object[]; // TODO should be replaced to Notes interface
  tasks: object[]; // TODO should be replaced to Tasks interface
  tasks2: object[]; // TODO should be replaced to Tasks interface
  company: object; // TODO should be replaced to Company interface
}
