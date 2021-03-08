import {Component, OnInit} from '@angular/core';
import {LogService} from '../../../services/log.service';
import { VendorService } from '../../../services/vendor.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['../view-client.component.css', '../../../profile/automation/automation.component.css']
})
export class RateComponent implements OnInit {

  clientId: string;
  loading = true;
  rates: any;
  ratesRetrieved = false;

  constructor(private router: Router,
              private logService: LogService,
              private vendorService: VendorService) {
  }

  ngOnInit() {
    this.getRoute();
  }

  getClientRates(id: string) {
    this.vendorService.getRateByclientId(id)
      .subscribe(rates => {
        this.rates = rates;
        this.ratesRetrieved = true;
        this.loading = false;
      }, error => {
        this.logService.console(error, true);
      });
  }

  getRoute() {
    const url = this.router.url;
    const urlArray = url.split('/');
    const urlDirect = urlArray[1];
    if (urlDirect === 'profile') {
      this.clientId = urlArray[4];
      this.getClientRates(this.clientId);
      this.loading = false;
    }
  }

}
