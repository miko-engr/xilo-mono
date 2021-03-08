import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NEW_CLIENT_URL } from '../../../../app/constants';
import { map } from 'rxjs/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { Company } from '../../forms/models';

@Injectable()
export class CompanyService {
  companyDetailsSource = new BehaviorSubject<Company>({});
  companyDetails = this.companyDetailsSource.asObservable();
  constructor(private http: HttpClient) {}

  getCompanyDetailsById(companyId) {
    return this.http.get(`${NEW_CLIENT_URL}/company/${companyId}`).pipe(
      map((res: { message: string; obj: Company }) => {
        this.companyDetailsSource.next(res.obj);
      })
    );
  }
}
