import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Question } from "../models/question.model";
import { Observable } from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";

@Injectable()
export class QuestionService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'question';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
  window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  //delete a Question
  delete(question: Question) {
    return this.http.delete(this.apiUrl + '/' + question.pageQuestionId +  '/' + question.id);
  }

  // Get one Question
  get(question?: Question) {
      const questionId = question ? '/' + question.pageQuestionId + '/' + question.id : '';
      return this.http.get(this.apiUrl + questionId);
  }

  // Get all Company Questions
  getByCompany(page?: Question) {
      return this.http.get(this.apiUrl + '/company/' + page.id);
  }

  // Update a Question
  patch(question: Question) {
    return this.http.patch(`${this.apiUrl}/${question.id}`, question);
  }

  // Get Question Templates
  async getQuestionsTemplates() {
    return this.http.get(`${this.apiUrl}/templates/all/dashboard`)
    .pipe(map(result =>
        result['obj']
    )).toPromise();
  }

  // Update a Question
  patchAsync(question: Question) {
    return this.http.patch(`${this.apiUrl}/${question.id}`, question)
    .pipe(map(result =>
        result['obj']
    )).toPromise();
  }

  // Create a new Question
  post(question: Question) {
      return this.http.post(this.apiUrl, question);
  }

  // Create a new Question
  postAsync(question: Question) {
      return this.http.post(this.apiUrl, question)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

    // Duplicate a Question
    duplicate(question: Question) {
      return this.http.post(this.apiUrl +'/duplicate', question);
    }

    // Get all Auto Form Page Questions
    getByCompanyAndAutoForm(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/' + companyId)
      .pipe(map(result =>
        result['obj']
      ));
    }

    // Get all Auto Form Page Questions
    getByCompanyAndCommercialForm(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/commercial/' + companyId)
      .pipe(map(result =>
        result['obj']
      ));
    }

    // Get all Auto Form Page Non Client Questions
    getByCompanyAndAutoFormNonClientOnly(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/non-client/' + companyId)
      .pipe(map(result =>
        result['obj']
      ));
    }

    // Get all Home Form Page Questions
    getByCompanyAndHomeForm(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/' + companyId)
      .pipe(map(result =>
        result['obj']
      ));
    }

    // Get all Insurance Page Questions
    getByCompanyAndAutoFormInsurance(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/insurance/' + companyId)
    .pipe(map(result =>
        result['obj']
    ));
    }

    // Get all Insurance Page Questions
    getByCompanyAndHomeFormInsurance(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/insurance/' + companyId)
    .pipe(map(result =>
        result['obj']
    ));
    }

    // Get all Page Questions With Conditions
    getByCompanyAndAutoFormConditions(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/conditions/' + companyId)
      .pipe(map(result =>
        result['obj']
      ));
    }

    // Get all Page Questions With Conditions
    getByCompanyAndHomeFormConditions(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/conditions/' + companyId)
      .pipe(map(result =>
        result['obj']
      ));
    }

    bulkUpdate(questions?: any) {
      return this.http.patch(this.apiUrl + '/bulk/update', questions)
    }

}
