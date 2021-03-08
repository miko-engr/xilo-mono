import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Client } from '../models/client.model';
import { map } from 'rxjs/operators';
import { UpdateClientObj } from '../models/update-client.model';
import { FilterParams } from '../models/filterParams.model';


@Injectable()
export class ClientService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'client';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    getAllClients() {
        return this.http.get(this.apiUrl + '/all/clients');
    }

    generateQueryString(filterParams: FilterParams) {
        let filterQuery = `?createdAt=${filterParams.createdAt}`;
        for (const key in filterParams) {
            if (filterParams[key] && key !== 'createdAt' && key !== 'tags') {
                filterQuery += `&${key}=${filterParams[key]}`;
            } else if (key === 'tags' && filterParams.tags) {
                filterQuery += `&tags=${filterParams.tags.join(',')}`;
            }
        }
        return filterQuery;
    }

    getClientsBy(filterParams: FilterParams, page: any) {
        Object.keys(filterParams).forEach(key => {
            if (filterParams[key] === 'null' || undefined) {
                delete filterParams[key]
            }
        })
        const filterQuery = this.generateQueryString(filterParams);
        return this.http.get(`${this.apiUrl}/filter/date/10/${page + filterQuery}`);
    }

    countClients(filterParams: FilterParams, lifecycleId?: string, date?: string) {
        Object.keys(filterParams).forEach(key => {
            if (filterParams[key] === 'null' || undefined) {
                delete filterParams[key]
            }
        })
        if (date) {
            filterParams.createdAt = date;
        }
        let filterQuery = this.generateQueryString(filterParams);
        if (lifecycleId) {
            filterQuery += `&clientLifecycleId=${lifecycleId}`;
        }
        return this.http.get(`${this.apiUrl}/filter/count${filterQuery}`)
        .pipe(map( res => res['count']));
    }

    createToken(client: Client) {
        const body = {
            id: client.id
        };
        return this.http.post(`${this.apiUrl}/generate-token`, body)
        .pipe(map(res => {
            return res['obj']
        }));
    }

    deleteByAgent(client: Client) {
        const id = client.id ? client.id : '';
        return this.http.delete(this.apiUrl + '/agent/' + id);
    }

    deleteByUser(client: Client) {
        const id = client.id ? client.id : '';
        return this.http.delete(this.apiUrl + '/user/' + id);
    }

    deleteProspects(clients: number[]) {
        return this.http.patch(`${this.apiUrl}/delete/multiple/prospects`, {clientIds: clients});
    }

    deleteDownload(fileName: string) {
        const body = {
            fileName: fileName
        };
        return this.http.post(this.apiUrl + '/delete-download', body);
    }

    download(client: Client) {
        const body = {
            client
        };
        return this.http.post(this.apiUrl + '/download', body);
    }

    post(client: Client) {
        return this.http.post(this.newClientUrl, client);
    }

    get() {
        return this.http.get(this.apiUrl);
    }

    getClient(client: Client) {
        return this.http.get(this.apiUrl + `/${client.id}`);
    }

    getClientsWithMessages() {
        return this.http.get(this.apiUrl + `/sales-automation/clients/`)
        .pipe(map(resp => {
            return resp['obj'];
        }));
    }

    getClientByAgent(client: Client) {
        return this.http.get(this.apiUrl + '/agent/' + client.id);
    }

    getClientByParams(client: Client, params: string) {
        return this.http.get(`${this.apiUrl}/params/${client.id}/${params}`)
        .pipe(map(res => {
            return res['obj'];
        }));
    }

    getClientByUser(client: Client) {
        return this.http.get(this.apiUrl + '/user/' + client.id);
    }

    getCurrentClient(client: Client) {
        return this.http.get(this.apiUrl + '/' + client.id);
    }

    getCompanyClientsByUser() {
        return this.http.get(this.apiUrl + '/profile/user');
    }

    getCompanyClientsByAgent() {
        return this.http.get(this.apiUrl + '/profile/agent');
    }

    patch(client: Client) {
        return this.http.patch(this.apiUrl, client);
    }

    companyPatch(client: Client) {
        const id = client.id ? '/' + client.id : '';
        return this.http.patch(this.apiUrl + '/company' + id, client);
    }

    agentPatchClient(client) {
        return this.http.patch(this.apiUrl + '/agent', client);
    }

    updateClientAgent(client) {
        return this.http.patch(this.apiUrl + '/update-client-agent', client).toPromise();
    }

    updateClientData(client) {
        return this.http.patch(this.apiUrl + '/viewChildClient', client);
    }

    getSignedDocumentUrl(id: String) {
        return this.http.get(this.apiUrl + '/signed-document-url/' + id);
    }

    getClientFlows(client) {
        return this.http.get(this.apiUrl + '/getClientFlows/' + client.id);
    }

    addToFlow(body) {
        return this.http.post(this.apiUrl + '/addToFlow', body);
    }

    removeFromFlow(clientId) {
        return this.http.delete(this.apiUrl + '/removeFromFlow/' + clientId);
    }

    objectName(objectModel: string) {
        return objectModel === 'Client' ? 'client' : objectModel === 'Driver' ? 'drivers' : 
            objectModel === 'Vehicle' ? 'vehicles' : objectModel === 'Home' ? 'homes' : 
            objectModel === 'Location' ? 'locations' : objectModel === 'Incident' ? 'incidents' : 
            objectModel === 'Policy' ? 'policies' :
            objectModel === 'RecreationalVehicle' ? 'recreationalVehicles' :
            objectModel === 'Business' ? 'business' : null;
    }

    upsertAll(objs: any, companyId: any) {
        return this.http.patch(`${this.newClientUrl}/upsert/all/${companyId}`, objs);
    }
}
