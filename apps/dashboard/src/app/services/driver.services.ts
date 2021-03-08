import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Driver } from "../models/driver.model";


@Injectable()
export class DriverService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'driver';

    constructor(private http: HttpClient) {}

    createDriver(driver: Driver) {
        return this.http.post(this.apiUrl, driver);
    }

    companyDeleteDriver(driver: Driver) {
        const clientId = driver.driverId ? driver.driverId : '';
        const driverId = driver.id ? driver.id : '';
        return this.http.delete(this.apiUrl + '/' + clientId + '/' + driverId);
    }

    deleteDriver(driver: Driver) {
        return this.http.delete(this.apiUrl + '/' + driver.id);
    }

    updateDriver(driver: Driver) {
        return this.http.patch(this.apiUrl + '/' + driver.id, driver);
    }

    fixVehicle() {
        return this.http.patch(this.apiUrl + '/fix/vehicle', {});
    }

    fixDriver() {
        return this.http.patch(this.apiUrl + '/fix/driver', {});
    }


}
