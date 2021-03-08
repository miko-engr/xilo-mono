import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { DynamicRate } from "../models/dynamic-rate.model";

@Injectable()
export class DynamicRateService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'dynamic-rate';

  constructor(private http: HttpClient) {}

  //delete a dynamicRate
  delete(dynamicRate: DynamicRate) {
    return this.http.delete(this.apiUrl + '/' + dynamicRate.id);
  }

  // Duplicate a DynamicRate
  duplicate(dynamicRate: DynamicRate) {
    return this.http.post(this.apiUrl + '/duplicate', dynamicRate);
  }

  // Get one dynamicRate
  get(dynamicRate?: DynamicRate) {
      const dynamicRateId = dynamicRate ? '/' + dynamicRate.id : '';
      return this.http.get(this.apiUrl + dynamicRateId);
  }

  // Get all Company dynamicRates
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a dynamicRate
  patch(dynamicRate: DynamicRate) {
        return this.http.patch(this.apiUrl + '/' + dynamicRate.id, dynamicRate);
  }

  // Create a new dynamicRate
  post(dynamicRate: DynamicRate) {
    return this.http.post(this.apiUrl, dynamicRate);
  }

  // Create a new dynamicRate
  postByTemplate(dynamicRate: DynamicRate) {
      return this.http.post(this.apiUrl + '/template', dynamicRate);
  }

  // Create a new dynamicRate
  postByDefault() {
      return this.http.post(this.apiUrl + '/default', {});
  }

}
