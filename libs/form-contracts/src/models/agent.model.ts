export class Agent {
  constructor(
    public id?: number,
    public name?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public password?: string,
    public companyAgentId?: number,
    public agentLifecycleAnalyticId?: number,
    public lastAssignmentDate?: Date,
    public clientAgentId?: string
  ) {}
}
