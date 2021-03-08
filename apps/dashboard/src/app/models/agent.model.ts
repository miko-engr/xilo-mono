import { Client } from "./client.model";
import { Company } from "./company.model";
import { LifecycleAnalytic } from "./lifecycle-analytic.model";

export class Agent {
  constructor(
    public id?: number,
    public name?: string,
    public firstName?: string,
    public lastName?: string,
    public lineOfBusiness?: string,
    public isPrimaryAgent?: boolean,
    public canSeeAllClients?: boolean,
    public email?: string,
    public password?: string,
    public tags?: string[],
    public canSeeTagsOnly?: boolean,
    public canSeeAgentsOnly?: boolean,
    public notificationJson?: object,
    public phone?: string,
    public companyAgentId?: number,
    public agentLifecycleAnalyticId?: number,
    public clientAgentId?: string,
    public agentIds?: number[],
    public agentFormId?: number,
    public company?: Company,
    public clients?: Client,
    public lifecycleAnalytics?: LifecycleAnalytic,
    public createdAt?: Date,
    public betterAgencyUsername?: string,
    public isActive?: boolean,
  ) {}
}
