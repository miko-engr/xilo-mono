import { Component, OnInit } from '@angular/core';
import { Payment, SubscribeObj } from '../../../../models/payment.model';
import { Router } from '@angular/router';
import { StripeService } from '../../../../services/stripe.service';
import { UserService } from '../../../../services/user.service';
import { Company } from '../../../../models/company.model';
import { LoaderModalService } from '../../../../services/loader-modal.service';
import { ToastService } from '../../../../services/toast.service';


@Component({
  selector: 'app-signup-flow-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss']
})
export class SignupFlowPaymentConfirmationComponent implements OnInit {
  isLoading = false;
  payment: Payment = new Payment();
  company: Company = new Company();
  subscribeObj: SubscribeObj = new SubscribeObj()

  constructor(
    private router: Router,
    private stripeService: StripeService,
    private userService: UserService,
    private loaderService: LoaderModalService,
    private toastService:ToastService
  ) {
    this.getUserInfo();
  }

  ngOnInit() {
  }

  onSubmit() {
    this.isLoading = true;
    this.loaderService.openModalLoader('');
    const data = {
      email: this.payment.email,
      name: this.company.name,
      plans: [{ "plan": this.company.payment.planId }],
      coupon: this.company.payment.discountCoupanCode,
      amount: this.company.payment.setupFees
    }
    this.stripeService.startSubscription(data)
    .subscribe(resp => {
      this.loaderService.closeModal();
      this.toastService.showSuccess('Subscription started');
      setTimeout(() => {
        this.router.navigate(['auth/signup-flow/payment/success']);
      }, 1000);
    }, error => {
      this.loaderService.closeModal();
      this.toastService.showError('There was an issue starting your subscription');
      this.isLoading = false;
    });
  }

  getUserInfo() {
    this.userService.get()
    .subscribe((userInfo: any) => {
      this.payment.name = (!userInfo.obj.firstName ? userInfo.obj.username : userInfo.obj.firstName);
      this.payment.email = userInfo.obj.username;
      this.company = userInfo.obj.company;
      if (!(
        this.company && 
        this.company.payment && 
        this.company.payment.last4
      )) {
        this.router.navigate(['/auth/signup-flow/company-info']);
      }
    }, error => {
      this.toastService.showError(error.error.error.message);
    })
  }

}
