import {Injectable, EventEmitter, Output} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Company } from "../models/company.model";
import { map } from 'rxjs/internal/operators/map';
import { coerceArray } from '@angular/cdk/coercion';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class CompanyService {
    @Output() integrate = new EventEmitter<any>();
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'company';
    company: Company;
    private companySource: BehaviorSubject<Company> = new BehaviorSubject(null); 
    companyData = this.companySource.asObservable();
    constructor(
        private http: HttpClient,
        private router: Router
        ) {}

    get() {
        const userId = localStorage.getItem('userId');
        return this.http.get(this.apiUrl + '/profile/' + userId)
        .pipe(map(result =>{
            this.company = result['obj'];
            return result
        }));
    }

    getPreselectedIntegrations() {
        return this.http.get(`${this.apiUrl}/integrations`)
        .pipe(map(res => {
            return res['obj']
        }));
    }

    getKeysAsync(key: string, type: string) {
        return this.http.get(`${this.apiUrl}/keys/${type}/${key}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    getArrayOfKeysAsync() {
        return this.http.get(`${this.apiUrl}/array/keys`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    getActive() {
        return this.http.post(this.apiUrl + '/active', {});
    }

    getByCompanyId(companyId) {
        return this.http.get(this.apiUrl + '/' + companyId)
        .pipe(map(result =>{
            this.company = result['obj'];
            return result
        }));
    }

    getByAgent() {
        return this.http.get(this.apiUrl + '/get/agent')
        .pipe(map(result =>{
            this.company = result['obj'];
            return result
        }));
    }

    patch(user) {
        const userId = localStorage.getItem('userId');
        return this.http.patch(this.apiUrl + '/' + userId, user);
    }

    updateBrandColor(color: string) {
        const brand = {
            brandColor: color
        };
        return this.http.patch(this.apiUrl + '/brand-color/change', brand);
    }

    postCustomer(passedToken) {
        const stripeToken = {
            passedToken
        };
        return this.http.post(this.apiUrl + `/create-customer`, stripeToken);
    }

    patchCustomer(passedToken) {
        const stripeToken = {
            passedToken
        };
        return this.http.post(this.apiUrl + '/edit-customer', stripeToken);
    }

    removePlatformManager(company: Company) {
        return this.http.patch(this.apiUrl + '/platform-manager/' + company.id, company);
    }

    integrateService(data) {
        this.integrate.emit(data);
    }

    async hasFlags(flags: string | string[], shouldRedirect: boolean = true): Promise<boolean> {
        const userId = localStorage.getItem('userId');
        const company = await this.http.get(this.apiUrl + '/profile/' + userId)
        .pipe(map(result =>{
            return result['obj'];
        })).toPromise();
        const hasFlags = company.features ?
            coerceArray(flags).every(feat => Object.keys(company.features).includes(feat)) :
            false;
        if (!hasFlags && shouldRedirect) {
            return this.router.navigate(['/auth/login']);
        }
        return hasFlags;
    }

    sendCompanyData(data: Company){
        this.companySource.next(data);
    }
}
