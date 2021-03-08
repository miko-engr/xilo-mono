import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/internal/operators/map';
import { retryWhen, concatMap, delay } from 'rxjs/operators';
import { iif, throwError, of } from 'rxjs';

@Injectable()
export class EZLynxService {
    apiUrl = `${environment.apiUrl}ezlynx`;
    i=0;

    constructor(private http: HttpClient) {}

    createApplicant(id: any, formType: string) {
        return this.http.get(`${this.apiUrl}/v2/upsert/${formType}/${id}`);
    }

    pollApplicant(id: any) {
        return this.http.get(`${this.apiUrl}/v2/poll/${id}`)
        .pipe(
            map((job) => {
              const status = job['status'];
              
              if (status && (status === 'completed' || status === 'failed')) {
                //error will be picked up by retryWhen
                return job;
              }
              this.i +=1;
              throw status;
            }), 
            retryWhen(errors =>
              errors.pipe(
                //log error message
                // tap((rate) => console.log(`Attempt ${this.i}`)),
                
                concatMap((e, i) => 
                    // Executes a conditional Observable depending on the rate
                    // of the first argument
                    iif(
                    () => i > 20,
                    // If the condition is true we throw the error (the last error)
                    throwError(e),
                    // Otherwise we pipe this back into our stream and delay the retry
                    of(e).pipe(delay(1000))
                    )
                ) 
              )
            )
        )
    }

    createSalesCenterApplicant(id: any) {
        return this.http.get(`${this.apiUrl}/upsert-personal-applicant/${id}`);
    }

    getFieldOptions(parentGroup: string, type: string) {
        return this.http.get(`${this.apiUrl}/v2/field/${parentGroup}/${type}`)
        .pipe(map(data => {
           return data['obj'];
        }));
    }

    setDefaultsToForm(formId: number, type: string) {
        return this.http.get(`${this.apiUrl}/v2/set-defaults/${formId}/${type}`);
    }

}
