import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Answer } from '../models/answer.model';
import { Question } from '../models/question.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class AnswerService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'answer';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';


  constructor(private http: HttpClient) {}

  // delete a Answer
  delete(answer: Answer) {
    return this.http.delete(this.apiUrl + '/' + answer.questionAnswerId +  '/' + answer.id);
  }

  // Get one Answer
  async getAnswerTemplates(obj: string, search: string, templateType: string, companyId?: string) {
      const type = templateType ? `?type=${templateType}` : '';
      const idQuery = companyId ? `${type !== '' ? '&' : '?'}companyId=${companyId}` : '';
      return this.http.get(`${this.apiUrl}/templates/all/dashboard/${search}/${obj + type + idQuery}`)
      .pipe(map(result =>
        result['obj']
      )).toPromise();

  }

  // Get Answers by Integrations
  getByIntegrations(integrationIds: any[]) {
      const ids = integrationIds.join(',');
      return this.http.get(`${this.apiUrl}/integration/list/${ids}`)
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Get one Answer
  get(answer?: Answer) {
      const answerId = answer ? '/' + answer.questionAnswerId + '/' + answer.id : '';
      return this.http.get(this.apiUrl + answerId);
  }

    // Get Answers
    getAnswersByForm(formType?: string) {
        const obj = {
            isAuto: formType === 'auto' ? true : false,
            isHome: formType === 'home' ? true : false
        };
        return this.http.patch(`${this.apiUrl}/company/form`, obj);
    }

    // Get Answers by form Id
    getAnswersByFormId(formId: any) {
        return this.http.get(`${this.apiUrl}/company/form/${formId}`);
    }

  // Get all Company Answers
  getByCompanyAndQuestion(question?: Question) {
    return this.http.get(this.apiUrl + '/company/question/' + question.id);
  }

    getByCompanyAndCommercialForm(companyId?: any): Observable<Answer[]> {
        return this.http.get(this.newClientUrl + '/answers/commercial/all/' + companyId)
        .pipe(map(result =>
            result['obj']
        ));
    }

  // Get all Company Answers
  getByCompanyAndForm(formId: any) {
      return this.http.get(`${this.apiUrl}/company/form/${formId}`);
  }

  // Update a Answer
  patch(answer: Answer) {
        return this.http.patch(this.apiUrl + '/' + answer.questionAnswerId + '/' + answer.id, answer);
  }

  // Update a Answer
  patchAsync(answer: Answer) {
      const obj = {answer: answer};
      return this.http.patch(this.apiUrl + '/' + answer.questionAnswerId + '/' + answer.id, obj)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

  // Update answers list
  updateList(answers: Answer[]) {
      const obj = {updatedAnswer: answers};
      return this.http.patch(`${this.apiUrl}/form/update/list`, obj);
  }

  // Delete answers list
  deleteList(answers: Answer[]) {
      const obj = {deletedAnswer: answers};
      return this.http.patch(`${this.apiUrl}/form/delete/list`, obj);
  }

  // Get answer options
  getAnswerOptions(companyId: any, objectName: any, key: string) {
      return this.http.get(`${this.apiUrl}/options/${companyId}/${objectName}/${key}`)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

  // Create a new Answer
  post(answer: Answer) {
    return this.http.post(this.apiUrl, answer);
  }

  // Create a new Answer
  postAsync(answer: Answer) {
      const obj = {answer: answer};
      return this.http.post(this.apiUrl, obj)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

  // Create a new Answer
  showEncryption(model: string, key: string, id: any) {
      const obj = {
        dataName: key
      };
      return this.http.post(`${this.apiUrl}/decrypt/${model}/${id}`, obj)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }


  updateAnswers() {
        return this.http.post(`${this.apiUrl}/answers`, {});
  }

  // Duplicate a Answer
  duplicate(answer: Answer) {
    return this.http.post(this.apiUrl + '/duplicate', answer);
}

}
