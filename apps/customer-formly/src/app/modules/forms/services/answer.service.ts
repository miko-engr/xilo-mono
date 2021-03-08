import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../models';
import { NEW_CLIENT_URL } from '../../../../app/constants';
import { map } from 'rxjs/operators';

@Injectable()
export class AnswerService {
  constructor(private http: HttpClient) {}

  // Get Answers
  getAnswersByFormAsync(companyId?: string, formId?: any) {
    return this.http
      .get<Answer[]>(`${NEW_CLIENT_URL}/answers/form/${formId}/${companyId}`)
      .pipe(map(result => result['obj']))
      .toPromise();
  }
}
