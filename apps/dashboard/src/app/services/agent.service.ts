import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Agent } from "../models/agent.model";


@Injectable()
export class AgentService {
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'agent';

    constructor(private http: HttpClient) {}


    get() {
      return this.http.get<Agent>(this.apiUrl + '/self/list-one');
    }

    // Delete an agent
    delete(agent) {
        return this.http.delete(this.apiUrl + '/delete/' + agent.id);
    }

    getById(agent: Agent) {
        const agentId = agent.id ? '/' + agent.id : '';
        return this.http.get(this.apiUrl + '/user/list' + agentId);
    }

    getByCompanyForAgent() {
        return this.http.get(this.apiUrl + '/company/agent');
    }

    getByCompanyForUser() {
        return this.http.get(this.apiUrl + '/company/user');
    }

    // Get agents associated with user
    getLifecycles() {
        return this.http.get(this.apiUrl + '/lifecycles/all');
    }

    getClients() {
        return this.http.get(this.apiUrl + '/clients/all');
    }

    getUsersClients() {
        return this.http.get(this.apiUrl + '/user/clients');
    }

    getUserAgents() {
        return this.http.get(this.apiUrl);
    }

    // Update an agent
    patch(agent: Agent) {
        const agentId = agent.id ? '/' + agent.id : '';
        if (agent.id) {
            return this.http.patch(this.apiUrl + agentId, agent);
        }
    }

    // Update agent notification settings
    updateNotification(agent: Agent) {
        return this.http.post(`${this.apiUrl}/update/notifications`, agent);
    }

    // Create a new agent
    post(agent: Agent) {
        return this.http.post(this.apiUrl, agent);
    }

    updateClientSetting(data: any) {
        return this.http.post(this.apiUrl + '/update/settings', data);
    }
}
