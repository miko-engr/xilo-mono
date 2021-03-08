import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { DynamicCoverage } from "../models/dynamic-coverage.model";

@Injectable()
export class DynamicCoverageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'dynamic-coverage';

  constructor(private http: HttpClient) {}

  //delete a dynamicCoverage
  delete(dynamicCoverage: DynamicCoverage) {
    return this.http.delete(this.apiUrl + '/' + dynamicCoverage.id);
  }

  // Duplicate a DynamicCoverage
  duplicate(dynamicCoverage: DynamicCoverage) {
    return this.http.post(this.apiUrl + '/duplicate', dynamicCoverage);
  }

  // Get one dynamicCoverage
  get(dynamicCoverage?: DynamicCoverage) {
      const dynamicCoverageId = dynamicCoverage ? '/' + dynamicCoverage.id : '';
      return this.http.get(this.apiUrl + dynamicCoverageId);
  }

  // Get all Company dynamicCoverages
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a dynamicCoverage
  patch(dynamicCoverage: DynamicCoverage) {
        return this.http.patch(this.apiUrl + '/' + dynamicCoverage.id, dynamicCoverage);
  }

  // Create a new dynamicCoverage
  post(dynamicCoverage: DynamicCoverage) {
    return this.http.post(this.apiUrl, dynamicCoverage);
  }

  // Create a new dynamicCoverage
  postByTemplate(dynamicCoverage: DynamicCoverage) {
      return this.http.post(this.apiUrl + '/template', dynamicCoverage);
  }

  // Create a new dynamicCoverage
  postByDefault() {
    return this.http.post(this.apiUrl + '/default', {});
  }

}
