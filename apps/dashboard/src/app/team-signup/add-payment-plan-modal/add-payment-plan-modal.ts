import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentDetails } from '../../models/payment.model';
import { StripeService } from '../../services/stripe.service';
import { LogService } from '../../services/log.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'add-payment-plan-modal',
  templateUrl: './add-payment-plan-modal.html',
  styleUrls: ['../team-signup.component.scss']
})
export class AddPaymentPlanModalComponent {
  planType = [
    {key: 'Annual Plan', value: 'year'},
    {key: 'Monthly Plan', value: 'month'} ];
  payment = new PaymentDetails();
  paymentDetails: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPaymentPlanModalComponent>,
    public stripeService: StripeService,
    public logService: LogService,
    public toastService: ToastService
    ) { }

    ngOnInit() {
      this.paymentDetails = this.fb.group({
        interval: ['', [Validators.required]],
        productName: ['', [Validators.required]],
        amount: ['', [Validators.required]],
        nickname: ['']
      });
    }

    createPlan() {

      if(this.paymentDetails.invalid) {
        return false;
      }
      this.dialogRef.close();
      this.paymentDetails.value.nickname = this.paymentDetails.value.productName;
      this.paymentDetails.value.amount = (this.paymentDetails.value.amount * 100); /*Convert dollar into cent */
      this.stripeService.createPlans(this.paymentDetails.value).subscribe((res: any) => {
        this.toastService.showSuccess(res.title);
      }, error => {
        this.toastService.showError(error.error.error.message);
      });
    }

}
