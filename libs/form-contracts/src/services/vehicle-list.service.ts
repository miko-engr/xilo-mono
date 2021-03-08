import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BASE_URL } from '../constants';


@Injectable()
export class VehicleListService {
  VEHICLE_LIST_URL = `${BASE_URL}vehicle-list`;
  constructor(private http: HttpClient) {}

  /* EZLYNX */
  getEZYears() {
    return this.http
      .get(`${this.VEHICLE_LIST_URL}/ezlynx/years`)
      .pipe(map((result: { body }) => result.body));
  }

  getEZMakes(year: string) {
    return this.http
      .get(`${this.VEHICLE_LIST_URL}/ezlynx/makes/${year}`)
      .pipe(map((result: { body }) => result.body));
  }

  getEZModels(year: string, make: string) {
    return this.http
      .get(`${this.VEHICLE_LIST_URL}/ezlynx/models/${year}/${make}`)
      .pipe(map((result: { body }) => result.body));
  }

  getEZSubModels(year: string, make: string, model: string) {
    return this.http
      .get(`${this.VEHICLE_LIST_URL}/ezlynx/sub-models/${year}/${make}/${model}`)
      .pipe(map((result: { body }) => result.body));
  }

  getEZVehicleByVin(vin: string) {
    return this.http
      .get(`${this.VEHICLE_LIST_URL}/ezlynx/vin/${vin}`)
      .pipe(map((result: { body }) => result.body));
  }
}
