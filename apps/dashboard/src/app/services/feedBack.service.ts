import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { FeedBack } from "../models/feedBack";
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class FeedBackService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
    window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'feedback';

  constructor(private http: HttpClient) { }

  // Create a new feedback
  post(feedBack: FeedBack) {
    return this.http.post(this.apiUrl, feedBack);
  }

  //delete a feedback
  delete(feedBackId: number) {
    return this.http.delete(this.apiUrl + '/' + feedBackId);
  }

  // Update a feedback
  patch(feedBack: FeedBack) {
    return this.http.patch(this.apiUrl + `/${feedBack.id}`, feedBack);
  }

  getListByTypeAndId(feedBackType: string, id: number) {
    return this.http.get(this.apiUrl + `/${feedBackType}` + `/${id}`);
  }

}
