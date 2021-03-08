import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class VendorService {
  @Output() updateVender: EventEmitter<boolean> = new EventEmitter();
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'vendor';

  constructor(
      private http: HttpClient
    ) {}

  upsertVendor(vendor: any) {
    return this.http.patch(`${this.apiUrl}/upsert`, vendor);
  }

  getRateByclientId(id: string) {
    return this.http.get(`${this.apiUrl}/rate/` + id);
  }

  updateVendorData(data: any) {
    this.updateVender.emit(data);
  }

  getVendorByCompanyId(vendorName, agentId) {
    let url = `${this.apiUrl}/${vendorName}`;
    if (agentId) url += `?agentId=${agentId}`;
    return this.http.get(url)
  }
  

}
