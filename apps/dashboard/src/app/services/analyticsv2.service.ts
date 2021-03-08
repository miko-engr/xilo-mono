import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { map } from 'rxjs/internal/operators/map';
import moment from 'moment';

@Injectable()
export class AnalyticsV2Service {
  apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'analyticsv2';

  constructor(private http: HttpClient) {}

    clientChart(attribute: string, chartType: string, period: string) {
        return this.http.get(`${this.apiUrl}/client-chart/${attribute}/${chartType}/${period}`).toPromise();
    }
    getAnalyticsPrefrence() {
        return this.http.get(this.apiUrl + '/analytics-prefrence');
    }

    getClientLifecycleAnalytics(dateRange: any, lifecycle: any) {
      let filterQuery = '';
      if (dateRange && dateRange !== 'null') {
          filterQuery += `?dateRange=${dateRange}&lifecycle=${lifecycle}`;
      } else if (lifecycle) {
        filterQuery += `?lifecycle=${lifecycle}`;
      }
      return this.http.get(this.apiUrl + '/get-lifecycle-analytics' + filterQuery)
      .pipe(map(results => {
        return results['obj']
      }));
    }

    getLifeCylceAnalytics(attribute: string, period: string, value: any) {
        let params;
        if (value) {
          params = `${attribute}/${period}/${value.startDate}/${value.endDate}`
        } else {
          params = `${attribute}/${period}`
        }  
        return this.http.get(`${this.apiUrl}/life-cycle-analytic-chart/${params}`).toPromise();

  }
  getChartHeaders(column: string) {
    return this.http.get(`${this.apiUrl}/client-chart-headers/${column}`).toPromise();
  }

  getFormAnalyticData(id) {
    if (id === null) {
      id = 'all';
    }
    return this.http.get(`${this.apiUrl}/form-analytic-chart/${id}`).toPromise();
  }

  getFormAnalyticFormHeader() {
    return this.http.get(`${this.apiUrl}/form-analytic-chart-header`).toPromise();
  }

  getCompanyLifeCycleName() {
    return this.http.get(`${this.apiUrl}/get-company-lifecycle-name`).toPromise();
  }

  getCompanyClientLatLong(period, id) {
    if (id === null) {
      id = 'all';
    }
    return this.http.get(`${this.apiUrl}/get-company-client-latlong/${period}/${id}`).toPromise();
  }
    
    
  defaultTableValue(attribute: string, period: string, chartType: string, header: Array<string>) {
      switch (true) {
        case (chartType === 'PieChart'):
          return [['', '']];
        case (attribute === 'birthDate'):
          return [['Age-range', 'count'],
          ['0-20', 0],
          ['21-30', 0],
          ['31-40', 0],
          ['41-50', 0],
          ['51+', 0]];
        default:
          return this.generateDefaultData(header, period);
    }
  }

  generateDefaultData(header: Array<string>, period: string) {
      const a = [header];
      const d = new Date()
      const timezone: number = d.getTimezoneOffset();
      const isotime =  moment(Date.now()).utcOffset(timezone).toISOString(); // for local-time zone
      const reference = this.getReference(period);

      for (let i = this.getLimit(period) - 1; i >= 0; i--) {
          const b = [];
          for (let j = 0; j < header.length; j++) {
            if (j === 0) {
              b.push(reference(isotime, i));
            } else {
              b.push(0);
            }
          }
          a.push(b);
      }

      return a;
  }

  getLimit(period: string) {
    switch (period) {
      case 'days':
        return 7;
      case 'weeks':
      case 'months':
      case 'years':
        return 4;
    }
  }

  getReference(period: string) {
    switch (period) {
      case 'days':
        return this.getDay;
      case 'weeks':
        return this.getWeek;
      case 'months':
        return this.getMonth;
      case 'years':
        return this.getYear;
    }
  }
  getDay(date: string, desc = 0) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const li = date.lastIndexOf('.');
    const s2 = date.substring(0, li);
    const d = new Date(s2);
    d.setDate(d.getDate() - desc);
    return days[d.getDay()];
  }

  getWeek(date: string, desc = 0) {
    const weeks = ['This week', 'Last week', '2 week ago', '3 week ago'];
    const li = date.lastIndexOf('.');
    const s2 = date.substring(0, li);
    const d1 = new Date(s2);
    const d2 = new Date();
    d1.setDate(d1.getDate() - desc * 7);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    // if (diffWeek > 3) {
    //   diffWeek =  3;
    // }
    return weeks[diffWeek];
  }

  getMonth(date: string, desc = 0) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const li = date.lastIndexOf('.');
    const s2 = date.substring(0, li);
    const d = new Date(s2);
    d.setMonth(d.getMonth() - desc);
    return months[d.getMonth()];
  }

  getYear(date: string, desc = 0) {
    const li = date.lastIndexOf('.');
    const s2 = date.substring(0, li);
    const d = new Date(s2);
    d.setFullYear(d.getFullYear() - desc);
    return d.getFullYear().toString();
  }

  getInterval(opt: string, date: string) {
    switch (opt) {
      case 'days':
        return this.getDay(date);
      case 'weeks':
        return this.getWeek(date);
      case 'months':
        return this.getMonth(date);
      case 'years':
        return this.getYear(date);
    }
  }
}
