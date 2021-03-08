import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BusinessComponent} from './business.component';
import {CompanyComponent} from "./company/company.component";
import {BrandingComponent} from "./branding/branding.component";
import {ApiComponent} from "./api/api.component";
import { OutlookVerifyComponent } from './outlook-verify/outlook-verify.component';

const businessRoutes: Routes = [
  { path: '', component: BusinessComponent, children: [
    { path: '', redirectTo: 'company', pathMatch: 'full',},
    { path: 'company', component: CompanyComponent},
    { path: 'branding', component: BrandingComponent},
    { path: 'api', component: ApiComponent},
    { path: 'settings', loadChildren: () => import('../../shared/settings/settings.module').then(m => m.SettingsModule)},
    { path: 'api/outlook', component: OutlookVerifyComponent},
  ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(businessRoutes)
    ],
    exports: [RouterModule]
})
export class BusinessRoutingModule {}
