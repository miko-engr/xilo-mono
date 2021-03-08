import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ContractDetails } from '../models/account-details.model';
import { ToastService } from '../../services/toast.service';
import { PaymentDetails } from '../../models/payment.model';
import { StripeService } from '../../services/stripe.service';
import { LoaderModalService } from '../../services/loader-modal.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AddPaymentPlanModalComponent } from '../add-payment-plan-modal/add-payment-plan-modal';

@Component({
    selector: 'app-team-signup-payment-details',
    templateUrl: './payment-details.component.html',
    styleUrls: ['../team-signup.component.scss']
})
export class TeamSignupPaymentDetailsComponent implements OnInit {
    @Output() next: EventEmitter<number> = new EventEmitter();
    @Input() payment: PaymentDetails;
    @Input() contract: ContractDetails;
    dialogRef: MatDialogRef<any>;
    paymentImplementionFees = [0, 500, 1000, 1500];
    addCard = false;

    constructor(
        private dialog: MatDialog,
        private loaderModalService: LoaderModalService,
        private stripeService: StripeService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        console.log(this.contract)
        this.getPlanAndDiscountCoupon();
    }

    addCardDetails(
        paymentObject: { 
            last4: string, 
            exp_month: string, 
            exp_year: string 
        }
    ) {
        this.payment.last4 = paymentObject.last4;
        this.payment.exp_month = paymentObject.exp_month;
        this.payment.exp_year = paymentObject.exp_year;        
    }

    makeCopy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    onNext() {
        const selectedPlanAmount = (Number(this.payment.setupFees) / 100);
        this.contract.implementationFees = selectedPlanAmount.toString();
        this.contract.discount = this.getDiscounts(this.payment.discountCoupanCode);
        this.contract.payment = this.payment;
        this.contract.interval = this.payment.interval;
        this.next.emit(3);
    }

    /* This function return all discount coupan */
    getDiscountCoupon() {
        try {
            this.stripeService.getDiscount().subscribe((res: any) => {
                this.payment.discounts = res.obj.products.data;
            }, error => {
                console.log(error);
                this.loaderModalService.closeModal();
                this.toastService.showError('Issue retrieving discount');
            });
        } catch (e) {
            console.log(e);
            this.loaderModalService.closeModal();
            this.toastService.showError('Issue retrieving discount')
        }
    }

    getDiscounts(id) {
        try {
          let discount = 0;
          if (this.payment && this.payment.discounts && this.payment.discounts.length) {
            this.payment.discounts.filter((item) => {
              if (item.id === id) {
                discount = item.percent_off;
              }
            });
          }
          return discount.toString();
        } catch (e) {
          console.log(e);
          this.loaderModalService.closeModal();
          this.toastService.showError('Issue retrieving discount')
        }
    }

    /* This function return all payment plans */
    getPlans() {
        try {
            this.stripeService.getPlans().subscribe((res: any) => {
                this.payment.paymentPlans = res;
            }, error => {
                console.log(error);
                this.loaderModalService.closeModal();
                this.toastService.showError('Issue retrieving stripe plans')
            });
        } catch (e) {
            console.log(e);
            this.loaderModalService.closeModal();
            this.toastService.showError('Issue retrieving stripe plans')
        }
    }

    showSubscriptionAmount(event) {
        const selectedPlan = this.payment.paymentPlans.find((plan) => plan.id === event.id);
        const selectedPlanAmount = (selectedPlan.amount / 100);
        this.payment.subscriptionAmount = selectedPlanAmount;
        this.payment.amount = selectedPlan.amount;
        this.payment.interval = selectedPlan.interval;
        this.contract.subscriptionFees = this.payment.subscriptionAmount;
    }

    showDiscount(event) {
        if(!event.value) {
            this.payment.percent_off = 0;
        } else {
            const selectedPlan = this.payment.discounts.find((oneDiscount) => oneDiscount.id === event.value);
            this.payment.percent_off = selectedPlan.percent_off;
        }
    }

    addPlan() {
        const dialogRef = this.dialog.open(AddPaymentPlanModalComponent, {
            width: '30rem',
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getPlans();
        });
    }

    getPlanAndDiscountCoupon() {
        this.getPlans();
        this.getDiscountCoupon();
    }
    
}