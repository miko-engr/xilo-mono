import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsV2Component } from './analyticsv2.component';
import { V2AnalyticsRoutingModule } from "./analyticsv2-routing.module";
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ClientChartComponent } from './client-chart/client-chart.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { LifecycleChartComponent } from './lifecycle-chart/lifecycle-chart.component';
import { FormAnalyticsComponent } from './form-analytics/form-analytics.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AnalyticsV2Component,
    ClientChartComponent,
    HeatmapComponent,
    LifecycleChartComponent,
    FormAnalyticsComponent],
  imports: [
    CommonModule,
    V2AnalyticsRoutingModule,
    Ng2GoogleChartsModule,
    SharedModule
  ]
})
export class AnalyticsV2Module { }