import { Component, OnInit } from '@angular/core';
import {AnalyticsV2Service} from '../../services/analyticsv2.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-analyticsv2',
  templateUrl: './analyticsv2.component.html',
  styleUrls: ['./analytics.component.css', './analyticsv2.component.css']
})
export class AnalyticsV2Component implements OnInit {
  load = false;
  clientAttributes = [];
  companyAttributes = [];
  period = "months";

  constructor(private analyticsV2Service: AnalyticsV2Service,
    private logService: LogService) { }

  ngOnInit() {
    this.analyticsV2Service.getAnalyticsPrefrence().subscribe((prefrenceData: any) => {
      this.clientAttributes = prefrenceData.analyticsPreferences.clientAttributes;
      this.companyAttributes = prefrenceData.analyticsPreferences.companyAttributes;
    }, err => {
      this.load = false;
      this.logService.console(err, true);
    });
  }
}
