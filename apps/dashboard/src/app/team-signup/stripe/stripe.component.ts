import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { ToastService } from '../../services/toast.service';
import { StripeService as StripeXILOService } from '../../services/stripe.service';
import { LoaderModalService } from '../../services/loader-modal.service';

@Component({
  selector: 'app-stripe-create-token',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeTokenComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Output() addDetails: EventEmitter<{
    last4: string;
    exp_month: string;
    exp_year: string;
  }> = new EventEmitter();
  @Input() email: string;
  @Input() name: string;
  cardOptions: StripeCardElementOptions = {
    iconStyle: 'solid',
    style: {
      base: {
        padding: 5,
        iconColor: '#7c7fff',
        color: '#000',
        fontWeight: '400',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#fce883' },
        '::placeholder': { color: 'rgba(0,0,0,.3)' },
      },
      invalid: {
        iconColor: 'red',
        color: 'red',
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  stripeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loaderModalService: LoaderModalService,
    private stripeService: StripeService,
    private stripeXILOService: StripeXILOService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.stripeForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  createToken(): void {
    if (this.name && this.email) {
      this.loaderModalService.openModalLoader('');
      const name = this.stripeForm.get('name').value;
      this.stripeService
        .createToken(this.card.element, { name })
        .subscribe((result) => {
          if (result.token) {
            const data = {
              email: this.email,
              name: this.name,
              pToken: result.token.id,
            };
            this.stripeXILOService.addPayment(data).subscribe(
              (resp) => {
                const paymentMethod = resp['data'];
                console.log(resp, paymentMethod);
                this.addDetails.emit({
                  last4: paymentMethod.last4,
                  exp_month: paymentMethod.exp_month,
                  exp_year: paymentMethod.exp_year,
                });
                this.loaderModalService.closeModal();
                this.toastService.showSuccess('Card added');
              },
              (error) => {
                this.loaderModalService.closeModal();
                this.toastService.showError('Error adding card');
              }
            );
          } else if (result.error) {
            this.loaderModalService.closeModal();
            this.toastService.showError('Error adding card');
          }
        });
    } else {
      this.toastService.showWarn('You must add email and name first');
    }
  }
}
