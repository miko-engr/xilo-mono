import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { NEW_CLIENT_URL } from '../constants';
import { Company } from '../models/company.model';

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
