import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsV2Service } from "../../../services/analyticsv2.service";
import { AlertControllerService } from '../../../services/alert.service';

@Component({
  selector: 'app-client-chart',
  templateUrl: './client-chart.component.html',
  styleUrls: ['./client-chart.component.css', '../analyticsv2.component.css']
})
export class ClientChartComponent implements OnInit {
  @Input('attribute') attribute: any;
  @Input('period') period: any = "months";

  load = false;
  pressed = "months";
  clientChart = {};

  constructor(private analyticsV2Service: AnalyticsV2Service,
    private alertService: AlertControllerService) { }

  ngOnInit() {
    this.fetchClientChartData(this.attribute, this.period);
  }

  async fetchClientChartData(attribute: any, period: string) {
    try {
      this.pressed = period;
      let header: any = await this.analyticsV2Service.getChartHeaders(attribute.column);
      header = ["", ...header];
      const updateChart = {
        chartType: attribute.type,
        dataTable: this.analyticsV2Service.defaultTableValue(attribute.column, period, attribute.type, header),
        options: {
          'legend': 'left',
          'left': 20,
          'top': 0,
          'fontSize': 14,
          'padding': 0,
          'width': '100%',
          'height': '100%',
          'chartArea': {            
            'width': "80%"
          }
        },
      };

      const response: any = await this.analyticsV2Service.clientChart(attribute.column, attribute.type, period);

      if (attribute.type === 'PieChart') {
        const field = attribute.column === 'birthDate' ? 'range' : attribute.column;
        updateChart.dataTable = [['', ''], ...response.map((item: any) => [item[field], parseInt(item.count)])];
        this.clientChart = updateChart;

      } else if (attribute.column === 'birthDate') {
        updateChart.dataTable = response.reduce((acc, cv: any) => {
          const i = acc.findIndex((item: any) => item[0] === cv.range);
          acc[i][1] = acc[i][1] + parseInt(cv.count);
          return acc;
        }, updateChart.dataTable);
        this.clientChart = updateChart;

      } else {
        const self = this;
        updateChart.dataTable = response.reduce((acc, cv: any) => {
          const interval: any = self.analyticsV2Service.getInterval(period, cv.period);
          const i = acc.findIndex((item) => item[0] === interval);
          const j = header.findIndex(item => item === cv[attribute.column]);
          acc[i][j] = acc[i][j] + parseInt(cv.count);
          return acc;
        }, updateChart.dataTable);
        this.clientChart = updateChart;
      }
      this.load = true;
    } catch (error) {
      this.load = false;
      if(error?.error?.errorType !== 6) this.alertService.error(`Error to get ${attribute.column} data`);
    }
  }
}
