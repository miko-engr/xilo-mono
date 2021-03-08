import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Condition } from '../models/condition.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ConditionService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'condition';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';


  constructor(private http: HttpClient) {}

  // Create a new Answer
  upsert(conditions: Condition[]) {
      const obj = {conditions: conditions};
      return this.http.patch(`${this.apiUrl}/upsert-many/`, obj)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

  delete(condition: Condition) {
      return this.http.delete(`${this.apiUrl}/delete/${condition.id}`)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

}
