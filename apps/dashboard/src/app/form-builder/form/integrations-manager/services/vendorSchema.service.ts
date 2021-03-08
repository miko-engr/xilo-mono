import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { IntegrationMapping } from '../models/integrationMapping.model';
import { IntegrationMappingResponse } from '../models/integrationMappingResponse.model';


@Injectable()
export class VendorSchemaService {
  formId;

  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
    window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'integration-mapping';

  vendorSchemaUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
    window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'vendor-schema';

  constructor(private httpClient: HttpClient,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe((params: Params) => {
      const formId = params.id;
      this.formId = formId;
    });
  }

  getIntegrationMappingsAndVendorSchema(): Observable<IntegrationMapping[]> {
    const params = this.getRequestParams(this.formId);
    const reqOptions = this.getRequestOptions(params);

    return this.httpClient.get(`${this.apiUrl}/list-by-form`, reqOptions)
      .pipe(map((response: {integrationMappings: IntegrationMapping[]}) => {
        return response.integrationMappings;
      }));
  }

  getVendorsList(): Observable<any[]> {
    const reqOptions = this.getRequestOptions();
    return this.httpClient.get(`${this.vendorSchemaUrl}/list-all-active`, reqOptions)
      .pipe(map((response: {vendors: any[]}) => {
        return response.vendors;
      }));
  }

  getCompanyData(): { logo: string, name: string, description: string } {
    return {
      name: 'EZLynx',
      logo: 'assets/icons/svg/ezlynx-logo.svg',
      description: 'Auto Insurance'
    };
  }

  private getRequestOptions(params = null) {
    const token: string = localStorage.getItem('token');
    const accessTokenHeader = {
      'x-access-token': token
    };

    return {
      headers: new HttpHeaders(accessTokenHeader),
      params
    };
  }

  private getRequestParams(formId) {
    let params = new HttpParams();
    params = params.append('formId', formId);
    return params;
  }
}
