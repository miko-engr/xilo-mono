import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnalyticsV2Component } from './analyticsv2.component';

const v2AnalyticsRoutes: Routes = [
  { path: '', component: AnalyticsV2Component }
];

@NgModule({
    imports: [
        RouterModule.forChild(v2AnalyticsRoutes)
    ],
    exports: [RouterModule]
})

export class V2AnalyticsRoutingModule {

}
