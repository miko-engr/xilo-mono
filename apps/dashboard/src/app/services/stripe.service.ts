import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StripeService {

  apiUrl = environment.apiUrl + 'stripe/';

  constructor(private http: HttpClient) { }

  setupIntentApi() {
    return this.http.get<[object]>(this.apiUrl + 'setup-intent');
  }

  paymentMethodApi(paymentmethod: any): Observable<any> {
    return this.http.post<[any]>(this.apiUrl + 'customer/payment-methods/create', { paymentMethodId: paymentmethod });
  }

  createCustomer(payment): Observable<any> {
    return this.http.post<[any]>(this.apiUrl + 'customer', payment);
  }

  checkCustomerExist(email?: string): Observable<any> {
    const url = email ?  `customer/check-exists/${email}` : 'customer/exist';
    return this.http.get<[any]>(this.apiUrl + url);
  }

  createSubsciption(payment) {
    return this.http.post<[any]>(this.apiUrl + 'subscription', payment);
  }

  generateInvice(payment) {
    return this.http.post<[any]>(this.apiUrl + 'invoice/immediate', payment);
  }

  createPlans(payment) {
    return this.http.post<[any]>(this.apiUrl + 'plans', payment);
  }

  getPlans() {
      return this.http.get<[any]>(this.apiUrl + 'plans')
        .pipe(map((res) => {
          const data = res['obj'].plans.data
          for (let plan of data) {
            if (plan.amount || plan.amount === 0) {
              const nickname = plan.nickname ? `${plan.nickname} ` : '';
              plan['title'] = `${nickname}$${plan.amount / 100} (${plan.interval}ly)`;
            }
          }
          return data;
        }));
  }

  getDiscount() {
    return this.http.get<[any]>(this.apiUrl + 'coupons');
  }

  getPlanByPlanId(planId) {
    return this.http.get<[any]>(this.apiUrl + `plans/${planId}`);
  }

  addPayment(data: {email: string, name: string, pToken: string}) {
    return this.http.post(`${this.apiUrl}customer-add-payment`, data);
  }

  startSubscription(data: {
    email: string, 
    name: string, 
    plans: object, 
    coupon: string,
    amount: string
  }) {
    return this.http.post(`${this.apiUrl}customer-start-subscription`, data);
  }

}
