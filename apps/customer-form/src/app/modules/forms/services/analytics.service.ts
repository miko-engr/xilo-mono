import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BASE_URL} from "../../../constants";

@Injectable()
export class AnalyticsService {
    apiUrl: string = BASE_URL + 'analyticsv2';

    constructor(private http: HttpClient) {}

    recordFormAnalytic(params: any, formData: any) {
        let reqOptions = null;
        if (params !==  '/new') {
            const token: string = localStorage.getItem('token');
            const newHeader = {
                'x-access-token': token
            };
            reqOptions = {
                headers: new HttpHeaders(newHeader)
            };
            return this.http.post(this.apiUrl + '/record-form-analytics' + params, formData, reqOptions);
        } else {
            return this.http.post(this.apiUrl + '/record-form-analytics' + params, formData);
        }
    }

}
