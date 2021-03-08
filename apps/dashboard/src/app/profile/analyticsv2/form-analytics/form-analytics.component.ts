import { Component, OnInit } from '@angular/core';
import { AnalyticsV2Service } from '../../../services/analyticsv2.service';
import { AlertControllerService } from '../../../services/alert.service';

@Component({
  selector: 'app-form-analytics',
  templateUrl: './form-analytics.component.html',
  styleUrls: ['./form-analytics.component.css', '../analyticsv2.component.css']
})
export class FormAnalyticsComponent implements OnInit {
  noData = true;
  dropDown = [];
  pressed = null;
  formChart = { };
  sectionPressed = '30days';
  fromDate = null;
  toDate = null;

  constructor(private analyticsV2Service: AnalyticsV2Service,
    private alertService: AlertControllerService) { }

  ngOnInit() {
    this.fetchFormAnalyticsData('30days');
  }

  filterDate(date) {
    this.sectionPressed = date;
    if (!this.fromDate || !this.toDate) return
    this.fetchFormAnalyticsData('dateRange')
  }

  async fetchFormAnalyticsData(id = null) {
    try {
      this.sectionPressed = id;
      const updateChart = {
        chartType: 'AreaChart',
        dataTable: [['', '']],
        options: {
          'legend': 'left',
          'width': 'auto',
          'left': 20,
          'top': 0,
          'fontSize': 14,
          'padding': 0,
          'isStacked': true,
          'hAxis': {
            'title': ''
          },
          'vAxis': {'minValue': 0}
        },
      };
      this.pressed = id;
      const header: any = await this.analyticsV2Service.getFormAnalyticFormHeader();
      if (header.length) {
        this.noData = false;
        this.dropDown = [{ title: 'All', id: null }, ...header];
        if (this.fromDate && this.toDate) {
          id = `${id}?fromDate=${this.fromDate}&toDate=${this.toDate}`;
        }
        const response: any = await this.analyticsV2Service.getFormAnalyticData(id);
        if (response.length === 0) {
          this.noData = true;
        } else {
         updateChart.dataTable = [['', 'step value'], ...response.map((item) => [item.event, parseInt(item.count)])];
         this.formChart = updateChart;
        }
      } else {
        this.noData = true;
      }
    } catch (error) {
      if(error?.error?.errorType !== 6) this.alertService.error('Error to get formAnalytics data.');
    }
  }

}
