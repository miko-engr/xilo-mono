import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Page } from "../models/page.model";
import { Form } from "../models/form.model";
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class PageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'page';

  constructor(private http: HttpClient) {}

  //delete a Page
  delete(page: Page) {
    return this.http.delete(this.apiUrl + '/' + page.formPageId +  '/' + page.id);
  }

  // Get one Page
  get(page?: Page) {
      const pageId = page ? '/' + page.formPageId + '/' + page.id : '';
    return this.http.get(this.apiUrl + pageId);
  }

  
  // Get Page Templates
  async getPagesTemplates() {
    return this.http.get(`${this.apiUrl}/templates/all/dashboard`)
    .pipe(map(result =>
        result['obj']
    )).toPromise();
  }

  // Get all Company Pages
  getByCompany(form?: Form) {
    return this.http.get(this.apiUrl + '/company/' + form.id);
  }

  // Update a Page
  patch(page: Page) {
        return this.http.patch(this.apiUrl + '/' + page.formPageId + '/' + page.id, page);
  }

  // Create a new Page
  post(page: Page) {
      return this.http.post(this.apiUrl, page);
  }

  // Duplicate a Page
  duplicate(page: Page) {
      return this.http.post(this.apiUrl +'/duplicate', page);
  }

}
