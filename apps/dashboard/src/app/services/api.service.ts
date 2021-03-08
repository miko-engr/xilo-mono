import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Client } from "../models/client.model";
import { Vehicle } from "../models/vehicle.model";
import { Driver } from "../models/driver.model";

@Injectable()
export class ApiService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'api/';
    newapiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl));

    constructor(private http: HttpClient) { }

    /*
    *
    * Klaviyo Integrations
    *  
    */
    // Create a new agent
    kaviyoTrack(key: string, event: string, customerProperties: Object) {
        const body = {
            token: key,
            event: event,
            customer_properties: customerProperties
        };
        // const objJsonStr = JSON.stringify(body);
        // // const data = Buffer.from(objJsonStr).toString("base64");
        // // const reqBody = {
        // //     data: data
        // // };
        // return this.http.post(this.apiUrl + 'klaviyo-track', reqBody);
    }

    /*
    *
    * Pipedrive Integrations
    *  
    */

    // Create new Deal in Pipedrive
    createPipedriveDeal(pipedriveApi: string, deal: Object) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipedrive/add-deal' + token, deal);
    }

    // Create new Note in Pipedrive
    createPipedriveNote(pipedriveApi: string, note: Object) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipedrive/add-note' + token, note);
    }

    // Create new Person in Pipedrive
    createPipedrivePerson(pipedriveApi: string, person: Object) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipedrive/add-person' + token, person);
    }

    // Gets deals from Pipedrive
    getPipedriveDeals(pipedriveApi: string) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipedrive/deals' + token, {});
    }

    // Gets Pipelines from pipedrive
    getPipedrivePipelines(pipedriveApi: string) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipedrive/pipelines' + token, {});
    }

    // Gets stages from pipedrive
    getPipedriveStages(pipedriveApi: string) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipedrive/stages' + token, {});
    }

    // Create new note in Pipedrive
    updatePipedriveNote(pipedriveApi: string, noteId: string, note: Object) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipedrive/update-note/' + noteId + token, note);
    }

    /*
    *
    * Google APIs
    *  
    */

    getGoogleAuthUrl() {
        return this.http.get(this.newapiUrl + 'google/auth/url');
    }

    authorizeGoogle(code) {
        return this.http.get(this.newapiUrl + 'google/auth' + `?code=${code}`);
    }

    getOutlookAuthUrl() {
        return this.http.get(this.newapiUrl + 'outlook/auth/url');
    }

    authorizeoutlook(code) {
        return this.http.get(this.newapiUrl + 'outlook/auth' + `?code=${code}`);
    }

    getAdwordsCampaigns() {
        return this.http.get(this.apiUrl + 'adwords/campaigns');
    }

    getAnalyticsReports() {
        return this.http.get(this.apiUrl + 'analytics/report');
    }

    getAnalyticsReportsHeatmap(body) {
        return this.http.post(this.apiUrl + 'analytics/report/heatmap', body);
    }

    getLandingPages(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/landing-pages?startDate=${startDate}&endDate=${endDate}`);
    }

    getCTAs(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/ctas?startDate=${startDate}&endDate=${endDate}`);
    }

    getEventsSessionsByMedium(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/events-sessions/medium?startDate=${startDate}&endDate=${endDate}`);
    }

    getSessionsByLPMedium(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/sessions/landing-page/medium?startDate=${startDate}&endDate=${endDate}`);
    }

    getEventsByCTAMedium(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/events/cta/medium?startDate=${startDate}&endDate=${endDate}`);
    }

    getFunnelByDate(startDate: string, endDate: string, year: string, month?: string, day?:string) {
        startDate = '2017-01-01';
        endDate = 'today';
        return this.http.get(this.apiUrl + `/analytics/report/funnel/${year}?startDate=${startDate}&endDate=${endDate}`);
    }
}
