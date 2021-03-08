import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Form } from '../models';
import { NEW_CLIENT_URL, BASE_URL } from '../../../../app/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isMultipleAdd } from '../components/page/page-helper-functions';

@Injectable()
export class FormService {
  constructor(private http: HttpClient) {}

  getById(companyId: number, formId: number): Observable<Form> {
    return this.http
      .get(`${NEW_CLIENT_URL}/form/id/${formId}/${companyId}`)
      .pipe(
        map((res: { message: string; obj: Form }) => {
          /**
           * answerId is parsed as string and stored again.
           * The formcontrols for the answer is accessed in so many places.
           * Key is string so we save as string
           */
          res.obj.pages.forEach(page => {
            page.questions.forEach(question => {
              question.answers.forEach(answer => {
                answer['answerId'] = answer.id.toString();
                if (isMultipleAdd(answer)) {
                  answer.propertyKey = 'addMultiple';
                }
              });
            });
          });
          return res.obj;
        })
      );
  }

  getFormListById(companyId: number): Observable<any> {
    return this.http.get(`${NEW_CLIENT_URL}/forms?companyId=${companyId}`).pipe(
      map((res: { message: string; obj: any }) => {
        return res.obj;
      })
    );
  }

}
