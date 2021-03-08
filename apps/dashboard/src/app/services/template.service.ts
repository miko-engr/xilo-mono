import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Template } from "../models/template.model";
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class TemplateService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'template';

  constructor(private http: HttpClient) {}

  //delete a template
  delete(template: Template) {
    return this.http.delete(this.apiUrl + '/' + template.id);
  }

  // Get one template or by company
  get(template?: Template) {
      const templateId = template ? '/' + template.id : '';
      return this.http.get(this.apiUrl + templateId);
  }

  getByCompany(type?: string): Observable<Template[]>  {
    return this.http.get(`${this.apiUrl}/type/${type}`)
    .pipe(map(result =>
        result['obj']
    ));
  }

  getAllTemplate(type?: string) {
    return this.http.get(`${this.apiUrl}/company/${type}`);
    // .pipe(map(result =>
    //     result['obj']
    // ));
  }

  // Update a template
  patch(template: Template) {
        return this.http.patch(this.apiUrl + '/edit/' + template.id, template);
  }

  // Create a new template
  post(template: Template) {
      return this.http.post(this.apiUrl, template);
  }

}
