import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AnalyticsV2Service } from "../../../services/analyticsv2.service";
import { AlertControllerService } from '../../../services/alert.service';

declare var google: any;

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css', '../analyticsv2.component.css']
})
export class HeatmapComponent implements OnInit {
  @ViewChild('heatmap', { static: true }) gmapElement: any;
  @Input('period') period: any;
  map;
  geocoder = new google.maps.Geocoder();
  heatmapData = new google.maps.MVCArray();
  lifecycleId = null;
  lifecycleList: [];

  constructor(private analyticsV2Service: AnalyticsV2Service,
    private alertService: AlertControllerService) { }

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(39.809734, -98.555620),
      zoom: 3.0,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    let heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatmapData,
      radius: 14,
      gradient: [
        'rgba(254, 97,0,0)',
        'rgba(254, 97,0,1)',
        'rgba(237, 89,30,1)',
        'rgba(219, 82,43,1)',
        'rgba(202, 75,51,1)',
        'rgba(185, 68,56,1)',
        'rgba(169, 61,60,1)',
        'rgba(152, 55,63,1)',
        'rgba(136, 48,65,1)',
        'rgba(120, 42,67,1)',
        'rgba(104, 35,68,1)',
        'rgba(88, 29,69,1)',
        'rgba(71, 22,72,1)',
        'rgba(52, 16,78,1)',
        'rgba(0, 5,102,1)'
      ]
    });
    heatmap.setMap(this.map);
    this.getPoints(this.period);
  }

  async getPoints(period: string) {
    try {
      const header: any = await this.analyticsV2Service.getCompanyLifeCycleName();
      this.lifecycleList = header;
      if  (this.lifecycleList.length > 0) {
        this.fetchLifecycleData(period, header[0].id);
      }
    } catch (error) {
      if(error?.error?.errorType !== 6) this.alertService.error(`Error to get lifecycle header name`);
    }
  }

  async fetchLifecycleData(period, id = null) {
    try {
      this.period = period;
      this.lifecycleId = id;
      this.heatmapData.clear();
      const response: any = await this.analyticsV2Service.getCompanyClientLatLong(period, id);
      for (let item of response) {
        if (!isNaN(item.client.latitude) && !isNaN(item.client.longitude)) {
          this.heatmapData.push(new google.maps.LatLng(item.client.latitude, item.client.longitude));
        }
      }
    } catch(error) {
      if(error?.error?.errorType !== 6) this.alertService.error(`Error to get client's lat-long`);
    }
  }

}
