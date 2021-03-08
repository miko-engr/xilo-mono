import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable()
export class CarrierService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'carrier';

    constructor(private http: HttpClient) {}

    post(carrier) {
        return this.http.post(this.apiUrl, carrier);
    }

    get(params?) {
        const carrierId = params.id ? '/' + params.id : '';
        return this.http.get(this.apiUrl + carrierId);
    }

    patch(carrier) {
        const carrierId = carrier.id ? '/' + carrier.id : '';
        if (carrier.id) {
            return this.http.patch(this.apiUrl + carrierId, carrier);
        }
    }

    delete(carrier) {
        return this.http.delete(this.apiUrl + '/' + carrier.id);
    }



}
