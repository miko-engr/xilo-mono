import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Injectable()
export class VehicleService {
    makes = [
        { value: 'Jeep', labe: 'Jeep' },
        { value: 'Toyota', labe: 'Toyota' },
        { value: 'Chevy', labe: 'Chevy' },
        { value: 'Lambo', labe: 'Lambo' }
    ]

    models = [
        { value: 'Cherokee', labe: 'Cherokee' },
        { value: 'Wrangler', labe: 'Wrangler' },
        { value: 'Grand Cherokee', labe: 'Grand Cherokee' },
        { value: 'Patriot', labe: 'Patriot' }
    ]

    bodyStyles = [
        { value: 'SUV', labe: 'SUV' },
        { value: 'Sedan', labe: 'Sedan' },
        { value: 'Station Wagon', labe: 'Station Wagon' },
        { value: 'Van', labe: 'Van' }
    ]
  constructor(private http: HttpClient) {}

  getMakes(year: string): Observable<any[]> {
    console.log('Year received: ', year);
    return of(this.makes);
  }

  getModels(type: string): Observable<any[]> {
    if (type === 'Jeep') {
      return of(this.models);
    } else return of ([]);
  }

  getBodyStyles(type: string): Observable<any[]> {
    if (type === 'Cherokee') {
      return of(this.bodyStyles);
    } else return of ([]);
  }
}
