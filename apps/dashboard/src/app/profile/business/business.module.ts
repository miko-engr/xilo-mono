import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {BusinessRoutingModule} from "./business-routing.module";
import {BusinessComponent} from "./business.component";
import {NgxLoadingModule
} from "ngx-loading";
import {ngfModule} from "angular-file";
import {NgxPaginationModule} from "ngx-pagination";
import {FilterPipeModule} from "ngx-filter-pipe";
import { SharedModule } from "../../shared/shared.module";
import { CompanyComponent } from './company/company.component';
import { BrandingComponent } from './branding/branding.component';
import { ApiComponent } from './api/api.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { IntegrationsComponent } from './api/integrations/integrations.component';
import { AllServicesModalComponent } from './api/all-services-modal/all-services-modal.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ApiSettingsModalComponent } from './api/api-settings-modal/api-settings-modal.component';
import { OutlookVerifyComponent } from './outlook-verify/outlook-verify.component';
@NgModule({
  declarations: [
    BusinessComponent,
    CompanyComponent,
    BrandingComponent,
    ApiComponent,
    IntegrationsComponent,
    AllServicesModalComponent,
    ApiSettingsModalComponent,
    OutlookVerifyComponent,
  ],
  imports: [
      CommonModule,
      FilterPipeModule,
      FormsModule,
      NgxLoadingModule
,
      ngfModule,
      NgxPaginationModule,
      BusinessRoutingModule,
      ReactiveFormsModule,
      SharedModule,
      ColorPickerModule,
      GooglePlaceModule,
  ],
  entryComponents: [
    AllServicesModalComponent,
    ApiSettingsModalComponent
  ]
})

export class BusinessModule {}
