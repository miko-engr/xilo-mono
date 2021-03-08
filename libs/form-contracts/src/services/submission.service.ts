import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { FormStatus, Submission } from '../models';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  apiUrl = `${environment.apiUrl}submission`;
  formViewUrl = `${environment.apiUrl}form-view`;
  updateMetadata = new BehaviorSubject<any>({});
  metadata = {};

  constructor(private http: HttpClient) {}

  onUpdateMetadata(updateObj: object, field: FormlyFieldConfig) {
    const parentKey = field.parent?.key;
    if (parentKey !== undefined && (isNaN(+parentKey) || +parentKey === 0)) {
      this.updateMetadata.next(updateObj);
    }
  }

  createSubmission(submission: Submission) {
    return this.http
      .post(`${this.apiUrl}/create`, submission)
      .pipe(map((result) => result['obj']));
  }

  updateSubmission(submission: Submission) {
    return this.http
      .patch(`${this.apiUrl}/update`, submission)
      .pipe(map((result) => result['obj']));
  }

  getSubmission(id: string | number): Observable<Submission> {
    return this.http
      .get(`${this.apiUrl}/list-one/${id}`)
      .pipe(map((result) => result['obj']));
  }

  getSubmissionByClient(id: string | number) {
    return this.http
      .get(`${this.apiUrl}/list-clients/${id}`)
      .pipe(map((result) => result['obj']));
  }

  getFormViewBySubmission(id: string | number) {
    return this.http
      .get(`${this.formViewUrl}/list-one/${id}`)
      .pipe(map((result) => result['obj']));
  }

  isClientHasAnySubmissions(id: string | number) {
    return this.http
      .get(`${this.apiUrl}/has-submissions/${id}`)
      .pipe(map((result) => result['obj']));
  }

  getFormAndSubmissionById(id: string | number) {
    return this.getSubmissionByClient(id).pipe(
      mergeMap((res) => {
        return combineLatest(
          of(res),
          this.getFormViewBySubmission(res[0].metadata.formId)
        );
      }),
      map(([submissions, formView]) => {
        return {
          submissions: submissions,
          formView: formView,
        };
      }),
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

  newCustomerSubmission(companyId: string | number) {
    const submission: Submission = {
      metadata: {
        companyId,
      },
    };
    return this.http
      .post(`${this.apiUrl}/new-customer`, submission)
      .pipe(map((result) => result['obj']));
  }

  updateFormStatus(clientId: string | number, formStatus: FormStatus) {
    const url = `${this.apiUrl}/form-status/${clientId}`;
    return this.http.put(url, { formStatus });
  }
}
