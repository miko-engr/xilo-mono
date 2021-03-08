import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Vehicle } from "../models/vehicle.model";
import { Driver } from "../models/driver.model";


@Injectable()
export class VehicleService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'vehicle';

    constructor(private http: HttpClient) {}

    createVehicle(vehicle: Vehicle) {
        return this.http.post(this.apiUrl, vehicle);
    }

    deleteVehicle(vehicle: Vehicle) {
        return this.http.delete(this.apiUrl + '/remove/' + vehicle.id);
    }

    companyDeleteVehicle(vehicle: Vehicle, driver: Driver) {
        const clientId = driver.driverId ? driver.driverId : '';
        const driverId = driver.id ? driver.id : '';
        const vehicleId = vehicle.id ? vehicle.id : '';
        return this.http.delete(this.apiUrl + '/' + clientId + '/' + driverId + '/' + vehicleId);
    }

    updateVehicle(vehicle: Vehicle) {
        return this.http.patch(this.apiUrl + '/' + vehicle.id, vehicle);
    }


}
