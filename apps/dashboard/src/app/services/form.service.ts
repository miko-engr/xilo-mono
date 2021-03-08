import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Form } from '../models/form.model';
import { Company } from '../models/company.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class FormService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'form';

  constructor(private http: HttpClient) {}

  // delete a Form
  delete(form: Form) {
    return this.http.delete(this.apiUrl + '/' + form.id);
  }

  // Get one Form
  get(form?: Form) {
      const formId = form ? '/' + form.id : '';
      return this.http.get(this.apiUrl + formId);
  }

  // Get all Company Forms
  getByCompany(formsOnly: boolean) {
      return this.http.get(`${this.apiUrl}/company/v2${formsOnly ? '?formOnly=true' : ''}`);
  }

  // Get all Company Forms
  getFormOnlyByCompany() {
      return this.http.get(`${this.apiUrl}/company/form-only`)
      .pipe(map(res => {
        return res['obj'];
      }));
  }

  // Get all Company Forms pre-selected in signup
  getPreSelectedForms() {
      return this.http.get(`${this.apiUrl}/company/pre-selected`)
      .pipe(map(res => {
        const forms = res['obj'];
        for (let form of forms) {
          form.checked = false;
          form.isExisting = false;
        }
        return forms;
      }));
  }

   getByCompanyAsync() {
      return this.http.get(`${this.apiUrl}/company/v2`)
      .pipe(map(result => {
        const forms: Form[] = result['obj'];
        const retObj = { allForms: forms, simpleForms: [], customerForms: [] };
        retObj.simpleForms.push(...forms.filter(form => form.isSimpleForm));
        retObj.customerForms.push(...forms.filter(form => !form.isSimpleForm));
        return retObj;
      })).toPromise();
    }

  // Get by Id
  getById(formId: any) {
      return this.http.get(`${this.apiUrl}/dashboard/${formId}`)
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Get all Company Forms for user
  getByCompanyForUser(): Observable<Form[]> {
    return this.http.get(this.apiUrl + '/company/all')
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Get all Template Forms
  getAllTemplates() {
      return this.http.get(this.apiUrl + '/templates/all');
  }

  // Update a Form
  patch(form: Form) {
        return this.http.patch(this.apiUrl + '/' + form.id, form);
  }

  // Bulk update form
  bulkUpdate(body: any) {
        return this.http.patch(this.apiUrl + '/bulk/update', body)
        .pipe(map(obj => {
          return obj['pages'];
        })).toPromise();
  }

  // Create a new Form
  post(form: Form) {
      return this.http.post(this.apiUrl, form);
  }

  // Create a new Form
  createFormByCSV(csv: string) {
      const body = { csv: csv };
      return this.http.post(`${this.apiUrl}/default/v2/csv`, body);
  }

  // Duplicate a Form
  duplicate(form: Form) {
    return this.http.post(this.apiUrl + '/duplicate', form);
  }

  // Create a new Form
  createDefaults(company: Company) {
      return this.http.post(this.apiUrl + '/default', company);
  }

  // Create a new Form
  createHomeDefaults(company: Company) {
      return this.http.post(this.apiUrl + '/default-home', company);
  }

  // Get form by company id wise
 getDefaultForms() {
      return this.http.get(this.apiUrl + '/company/default' )
      .pipe(map(res => {
        return res['obj'];
      })).toPromise();
  }

  // Create selected form
  createSelectedForm(forms) {
    return this.http.post(this.apiUrl + '/duplicateForm', forms);
  }
}
