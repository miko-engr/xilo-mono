import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsV2Service } from '../../../services/analyticsv2.service';
import { AlertControllerService } from '../../../services/alert.service';
import moment from 'moment';

@Component({
  selector: 'app-lifecycle-chart',
  templateUrl: './lifecycle-chart.component.html',
  styleUrls: ['./lifecycle-chart.component.css', '../analyticsv2.component.css']
})
export class LifecycleChartComponent implements OnInit {
  @Input('attribute') attribute: any;
  @Input('period') period: any = 'months';

  load = false;
  sectionPressed = 'months';
  lifecycleChart = {};
  noData = false;
  btnList = [];
  periodPressed = '';

  constructor(private analyticsV2Service: AnalyticsV2Service,
    private alertService: AlertControllerService) { }

  ngOnInit() {
    this.fetchLifecycleChartDataSectionWise(this.attribute, this.period);
  }

  async fetchLifecycleChartDataSectionWise(attribute: string, period: string) {
    if (attribute === 'agent') {
      this.btnList = this.getBtnOptions(period);
      this.periodPressed = this.btnList[this.btnList.length - 1].name
      this.fetchLifecycleChartData(attribute, period, this.btnList[this.btnList.length - 1].value);
    } else {
      this.fetchLifecycleChartData(attribute, period);
    }    
  }

  async fetchLifecycleChartDataPeriodWise(attribute: string, pressed: string, item: any) {
    this.periodPressed = item.name;
    this.fetchLifecycleChartData(attribute, pressed, item.value);
  }

  async fetchLifecycleChartData(attribute: string, period: string, value = null) {
    try {
      this.sectionPressed = period;
      let header: any = await this.analyticsV2Service.getCompanyLifeCycleName();
      header = ['', ...header.map((item: any) => item.name)];
     
      const updateChart = {
        chartType: this.getChartType(attribute),
        dataTable: this.defaultTableValue(attribute, period, header),
        options: {
          'legend': 'left',
          'width': 'auto',
          'left': 20,
          'top': 0,
          'fontSize': 14,
          'padding': 0,
        },
      };

      const response: any = await this.analyticsV2Service.getLifeCylceAnalytics(attribute, period, value);
        if (attribute === 'company') {
          const self = this;
          updateChart.dataTable = response.reduce((acc, cv: any) => {
            const interval: any = self.analyticsV2Service.getInterval(period, cv.period);
            const i = acc.findIndex((item) => item[0] === interval);
            const j = header.findIndex(item => item === cv.lifecycle.name);
            if (i < 0 || j < 0) {
                return acc;
            }
            acc[i][j] = acc[i][j] + parseInt(cv.count);
            return acc;
          }, updateChart.dataTable);

          this.lifecycleChart = updateChart;
        } else if (attribute === 'agent') {
          this.noData = response.length === 0;
          // combine lifecylce data (lead, quated, etc.) for every agent
          const agentLifeCycledata = response.reduce((acc, cv) => {
            const index = acc.findIndex((item) => cv.agent.id === item.id);
            if (index === -1) {
                 acc.push({
                   id: cv.agent.id,
                   agent: `${cv.agent.firstName} ${cv.agent.lastName}`,
                   agentData: [{
                     count: cv.count,
                     name: cv.lifecycle.name
                   }]
                 });
            } else {
                acc[index].agentData.push({
                     count: cv.count,
                     name: cv.lifecycle.name
                   });
            }
            return acc;
          }, []);
          // set data for every agent in chart-data-table
          updateChart.dataTable = agentLifeCycledata.reduce((acc, cv: any) => {
            let temp: any = [cv.agent, ...acc[0].map(() => 0)];
            temp.pop();
            temp = cv.agentData.reduce((childAcc, item) => {
              const i = acc[0].findIndex((h) => h === item.name);
              childAcc[i] = childAcc[i] + parseInt(item.count);
              return childAcc;
            }, temp);
            acc.push(temp);
            return acc;
          }, updateChart.dataTable);

          this.lifecycleChart = updateChart;
        }
        this.load = true;
    } catch (error) {
      this.load = false;
      this.noData = true;
      if(error?.error?.errorType !== 6) this.alertService.error(`Error to get ${attribute} data`);
    }
  }

  getChartTitle(attribute: string) {
    switch (attribute) {
      case 'agent':
        return 'Agent Productivity';
      case 'company':
        return 'Lifecycles';
      default:
         return 'Unknown';
    }
  }

  getChartType(attribute: string) {
    switch (attribute) {
      case 'agent':
        return 'Bar';
      case 'company':
        return 'Bar';
    }
  }

  defaultTableValue(attribute: string, period: string, header: Array<string>) {
    switch (attribute) {
      case 'company':
        return this.analyticsV2Service.generateDefaultData(header, period);
      case 'agent':
        return [header];
    }
  }

  getBtnOptions(period: string) {
    const reference = this.analyticsV2Service.getReference(period);
    const limit = this.analyticsV2Service.getLimit(period);
    const btnList = [];
    const d = new Date()
    const timezone = d.getTimezoneOffset();
    const isotime =  moment(Date.now()).utcOffset(timezone).toISOString();
    for (let i = limit - 1; i >= 0; i--) {
      btnList.push({name: reference(isotime, i), value: this.getValue(isotime, i, period)})
    }
    return btnList;
  }

  getValue(date: string, desc: number, period: string) {
    const li = date.lastIndexOf('.');
    const s2 = date.substring(0, li);
    const d = new Date(s2);
    const timezone: number = d.getTimezoneOffset();
    switch (period) {
      case 'days': 
        return {
          startDate:  moment(date).subtract(desc-1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utcOffset(timezone).toISOString(),
          endDate:  moment(date).subtract(desc-1, 'days').set({ hour: 24, minute: 0, second: 0, millisecond: 0 }).utcOffset(timezone).toISOString() 
        }
      case 'weeks':
        return {
          startDate:  moment(date).subtract(desc, 'weeks').startOf('isoWeek').isoWeekday(1).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utcOffset(timezone).toISOString(),
          endDate:  moment(date).subtract(desc-1, 'weeks').endOf('isoWeek').isoWeekday(1).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utcOffset(timezone).toISOString()
        }
      case 'months':
        return {
          startDate:  moment(date).subtract(desc, 'month').startOf('month').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utcOffset(timezone).toISOString(),
          endDate:  moment(date).subtract(desc, 'month').endOf('month').set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).utcOffset(timezone).toISOString()
        }
      case 'years':
        return {
          startDate:  moment(date).subtract(desc, 'year').startOf('year').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utcOffset(timezone).toISOString(),
          endDate:  moment(date).subtract(desc, 'year').endOf('year').set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).utcOffset(timezone).toISOString()
        }
    }
  }

}
