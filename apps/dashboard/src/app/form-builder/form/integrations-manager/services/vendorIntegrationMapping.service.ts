import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import _ from 'lodash';
import { IVendorMapping } from '../interfaces/IVendorMapping';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IntegrationMappingResponse } from '../models/integrationMappingResponse.model';
import { IIntegrationMapping } from '../interfaces/IIntegrationMapping';

@Injectable()
export class VendorIntegrationMappingService {
  // integrationMapping: IIntegrationMapping;
  vendorName: string;
  formId: string;
  group: string;

  apiUrl: string =
    (window.location.hostname.includes('xilo-dev')
      ? environment.devApiUrl
      : window.location.hostname.includes('xilo-staging')
      ? environment.stagingApiUrl
      : environment.apiUrl) + 'integration-mapping';

  rawUrl: string = window.location.hostname.includes('xilo-dev')
    ? environment.devApiUrl
    : window.location.hostname.includes('xilo-staging')
    ? environment.stagingApiUrl
    : environment.apiUrl;

  public integrationMapping$: BehaviorSubject<
    IIntegrationMapping
  > = new BehaviorSubject<IIntegrationMapping>(null);

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: Params) => {
      const formId = params.id;
      this.formId = formId;
    });
  }

  addMapping(
    vendorMapping: IVendorMapping,
    integrationMapping: IIntegrationMapping
  ) {
    const { vendorPath } = vendorMapping;

    // Check for duplicates
    // If found, replace
    if (
      integrationMapping &&
      integrationMapping.jsonMapping &&
      _.find(integrationMapping.jsonMapping, { vendorPath })
    ) {
      // @ts-ignore
      const index = _.findIndex(integrationMapping.jsonMapping, { vendorPath });
      integrationMapping.jsonMapping.splice(index, 1, vendorMapping);
    } else {
      integrationMapping.jsonMapping.push(vendorMapping);
    }

    this.updateIntegrationMapping(integrationMapping).subscribe();
  }

  removeMapping(
    vendorMapping: IVendorMapping,
    integrationMapping: IIntegrationMapping
  ) {
    const { vendorPath } = vendorMapping;

    const index = _.findIndex(integrationMapping.jsonMapping, { vendorPath });
    integrationMapping.jsonMapping.splice(index, 1);

    this.updateIntegrationMapping(integrationMapping).subscribe();
  }

  createIntegrationMapping(vendorId: number) {
    const reqOptions = this.getRequestOptions();

    return this.httpClient
      .post(
        this.apiUrl,
        { jsonMapping: [], formId: this.formId, vendorId },
        reqOptions
      )
      .pipe(
        map((response: IntegrationMappingResponse) => {
          if (response.obj !== null && response.integrationMapping !== null) {
            this.integrationMapping$.next(response.integrationMapping);
            // this.integrationMapping = response.integrationMapping;
          }
          return response;
        })
      );
  }

  updateIntegrationMapping(integrationMapping: IIntegrationMapping) {
    const params = this.getRequestParams(integrationMapping.formId);
    const reqOptions = this.getRequestOptions(params);
    // this.integrationMapping$.next(integrationMapping);
    return this.httpClient.put(
      `${this.apiUrl}/${integrationMapping.id}`,
      { jsonMapping: integrationMapping.jsonMapping },
      reqOptions
    );
  }

  resetIntegrationMapping(integrationMapping: IIntegrationMapping) {
    const params = this.getRequestParams(integrationMapping.formId);
    const reqOptions = this.getRequestOptions(params);

    return this.httpClient
      .put(
        `${this.apiUrl}/${integrationMapping.id}`,
        { jsonMapping: [] },
        reqOptions
      )
      .pipe(
        map(() => {
          integrationMapping.jsonMapping = [];
          // this.integrationMapping$.next(integrationMapping);

          return integrationMapping;
        })
      );
  }

  deleteIntegrationMapping(integrationMapping: IIntegrationMapping) {
    const reqOptions = this.getRequestOptions();

    return this.httpClient.delete(
      `${this.apiUrl}/${integrationMapping.id}`,
      reqOptions
    );
  }

  createSubmissionWithFormAndMapping({ formId, clientId }) {
    const params = this.apiUrl.includes('localhost') ? '?test=true' : '';
    return this.httpClient.post(
      `${this.apiUrl}/integration-mapping-submission${params}`,
      {
        formId,
        clientId
      }
    );
  }

  private getRequestOptions(params = null) {
    const token: string = localStorage.getItem('token');
    const accessTokenHeader = {
      'x-access-token': token,
    };

    return {
      headers: new HttpHeaders(accessTokenHeader),
      params,
    };
  }

  private getRequestParams(formId) {
    let params = new HttpParams();
    params = params.append('formId', formId);
    return params;
  }
}
