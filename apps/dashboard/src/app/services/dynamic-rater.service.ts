import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { DynamicRater } from "../models/dynamic-rater.model";

@Injectable()
export class DynamicRaterService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'dynamic-rater';

  constructor(private http: HttpClient) {}

  //delete a dynamicRater
  delete(dynamicRater: DynamicRater) {
    return this.http.delete(this.apiUrl + '/' + dynamicRater.id);
  }

  // Duplicate a DynamicRater
  duplicate(dynamicRater: DynamicRater) {
    return this.http.post(this.apiUrl + '/duplicate', dynamicRater);
  }

//   // Get one dynamicRater
//   get(dynamicRater?: DynamicRater) {
//       const token: string = localStorage.getItem('token')
//           ? '?token=' + localStorage.getItem('token')
//           : '';
//       const dynamicRaterId = dynamicRater ? '/' + dynamicRater.id : '';
//       return this.http.get(this.apiUrl + dynamicRaterId + token);
//   }

  // Get all Company dynamicRaters
  getByCompany() {
    return this.http.get(this.apiUrl + '/get-by-company');
  }

  // Update a dynamicRater
  patch(dynamicRater: DynamicRater) {
        return this.http.patch(this.apiUrl + '/' + dynamicRater.id, dynamicRater);
  }

  // Create a new dynamicRater
  post(dynamicRater: DynamicRater) {
    return this.http.post(this.apiUrl, dynamicRater);
  }

  // Create a new dynamicRater
  postByTemplate(dynamicRater: DynamicRater) {
      return this.http.post(this.apiUrl + '/template', dynamicRater);
  }

  // Create a new dynamicRater
  postByDefault() {
    return this.http.post(this.apiUrl + '/default', {});
  }

}
