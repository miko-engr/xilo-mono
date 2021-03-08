import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  providers: [Location]
})
export class PaymentSuccessComponent implements OnInit {

  constructor(
    private router: Router,
    private location: LocationStrategy,
  ) {
    history.pushState(null, null, window.location.href);  
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
   }

  ngOnInit(): void {
  }

  setupProfile() {
    this.router.navigate(['auth/signup-flow/company-info']);
  }

}
