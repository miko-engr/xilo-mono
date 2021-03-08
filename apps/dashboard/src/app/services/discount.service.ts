import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {Discount} from "../models/discount.model";

@Injectable()
export class DiscountService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'discount';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  //delete a discount
  delete(discount: Discount) {
    return this.http.delete(this.apiUrl + '/' + discount.id);
  }

  // Get one discount
  get(discount?: Discount) {
      const discountId = discount ? '/' + discount.id : '';
    return this.http.get(this.apiUrl + discountId);
  }

  // Get one Discount
  getById(id) {
      return this.http.get(this.newClientUrl + `/discount/${id}`);
  }

  // Update a discount
  patch(discount: Discount) {
        return this.http.patch(this.apiUrl + `/${discount.id}`, discount);
  }

  // Create a new discount
  post(discount: Discount) {
    return this.http.post(this.apiUrl, discount);
  }

  // Create default discounts
  postDefault(forms) {
      const body = {
          forms: forms
      };
    return this.http.post(this.apiUrl + '/default', body);
  }

}
