import { Injectable, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form, Client } from '../models';
import { NEW_CLIENT_URL, BASE_URL } from '../../../../app/constants';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

interface UpsertResponse {
  token?: string;
  responses: { objModel: string; id: string }[];
}

@Injectable()
export class ClientService {
  constructor(private http: HttpClient) {}

  upsertAll(
    obj: any,
    companyId: any,
    newClient = false
  ): Observable<UpsertResponse> {
    const query = newClient ? `?newClient=${newClient.toString()}` : '';
    return this.http
      .patch(`${NEW_CLIENT_URL}/upsert/all/${companyId + query}`, obj)
      .pipe(
        map((result: UpsertResponse) => {
          return result;
        })
      );
  }

  getById(clientId: string): Observable<Client> {
    return this.http.get(`${NEW_CLIENT_URL}/client/${clientId}`).pipe(
      map((result: { obj: Client }) => {
        return result.obj;
      })
    );
  }

  deleteByModel(id: number, companyId: any, model: string) {
    return this.http.delete(
      `${NEW_CLIENT_URL}/delete/model/${id}/${companyId}/${model}`
    );
  }

  uploadDocument(clientId: any, formData: FormData) {
    const token: string = localStorage.getItem('token');
    const newHeader = {
      'x-access-token': token
    };
    const reqOptions = {
      headers: new HttpHeaders(newHeader)
    };
    formData.append('clientId', clientId);
    return this.http.post(
      `${BASE_URL}client/upload-document`, formData, reqOptions
    );
  }
}
