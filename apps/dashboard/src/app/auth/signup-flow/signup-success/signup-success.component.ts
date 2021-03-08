import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['../company-info/company-info.component.scss'],
  providers: [Location]
})
export class SignupSuccessComponent implements OnInit {
  constructor(
    private router: Router,
    private location: LocationStrategy
  ) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
   }

  ngOnInit(): void {
  }

  goToDashboard() {
    this.router.navigate(['/profile/prospects'], { queryParams: 
      { 
        createdAt: '30',
        tour: 'onboard_and_table' 
      } 
    });
  }


}
