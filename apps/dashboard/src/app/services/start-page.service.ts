import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { StartPage } from "../models/start-page";

@Injectable()
export class StartPageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'start-page';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  //delete a StartPage
  delete(startPage: StartPage) {
    return this.http.delete(this.apiUrl + '/' + startPage.id);
  }

  // Get one StartPage
  get(startPage?: StartPage) {
      const startPageId = startPage ? '/' + startPage.id : '';
      return this.http.get(this.apiUrl + startPageId);
  }

  // Get one StartPage
  getById(id) {
      return this.http.get(this.newClientUrl + `/start-page/${id}`);
  }

  // Update a StartPage
  patch(startPage: StartPage) {
        return this.http.patch(this.apiUrl + `/${startPage.id}`, startPage);
  }

  // Create a new StartPage
  post(startPage: StartPage) {
      return this.http.post(this.apiUrl, startPage);
  }

}
