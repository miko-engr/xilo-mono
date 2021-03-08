import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { DynamicRateCondition } from "../models/dynamic-rate-condition.model";

@Injectable()
export class DynamicRateConditionService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'dynamic-rate-condition';

  constructor(private http: HttpClient) {}

  //delete a dynamicRateCondition
  delete(dynamicRateCondition: DynamicRateCondition) {
    return this.http.delete(this.apiUrl + '/' + dynamicRateCondition.id);
  }

  // Duplicate a DynamicRateCondition
  duplicate(dynamicRateCondition: DynamicRateCondition) {
    return this.http.post(this.apiUrl + '/duplicate', dynamicRateCondition);
  }

  // Get one dynamicRateCondition
  get(dynamicRateCondition?: DynamicRateCondition) {
      const dynamicRateConditionId = dynamicRateCondition ? '/' + dynamicRateCondition.id : '';
      return this.http.get(this.apiUrl + dynamicRateConditionId);
  }

  // Get all Company dynamicRateConditions
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a dynamicRateCondition
  patch(dynamicRateCondition: DynamicRateCondition) {
      return this.http.patch(this.apiUrl + '/' + dynamicRateCondition.id, dynamicRateCondition);
  }

  // Create a new dynamicRateCondition
  post(dynamicRateCondition: DynamicRateCondition) {
      return this.http.post(this.apiUrl, dynamicRateCondition);
  }

  // Create a new dynamicRateCondition
  postByTemplate(dynamicRateCondition: DynamicRateCondition) {
      return this.http.post(this.apiUrl + '/template', dynamicRateCondition);
  }

  // Create a new dynamicRateCondition
  postByDefault() {
    return this.http.post(this.apiUrl + '/default', {});
  }

}
