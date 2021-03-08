import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {PaymentComponent} from './payment/payment.component';
import {ngfModule} from 'angular-file';
import {TeamComponent} from './team/team.component';
import {CarrierComponent} from './carrier/carrier.component';
import {TrackingComponent} from './tracking/tracking.component';
import {NgxLoadingModule
} from 'ngx-loading';
import {NgxPaginationModule} from 'ngx-pagination';
import {FilterPipeModule} from 'ngx-filter-pipe';
import { SharedModule } from '../shared/shared.module';
import { TeamUserComponent } from './team/users/user.component';
import { TeamAgentComponent } from './team/agents/agent.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { LifecyclesComponent } from './tracking/lifecycles/lifecycles.component';
import { TagsComponent } from './tracking/tags/tags.component';
import { FormBuilderComponent } from './content/forms/form-builder/form-builder.component';
import { PdfBuilderComponent } from './content/pdfs/pdf-builder/pdf-builder.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoaderModalService } from '../services/loader-modal.service';

@NgModule({
  declarations: [
    ProfileComponent,
    TeamComponent,
    TeamUserComponent,
    TeamAgentComponent,
    CarrierComponent,
    PaymentComponent,
    TrackingComponent,
    LifecyclesComponent,
    TagsComponent,
    FormBuilderComponent,
    PdfBuilderComponent
  ],
  imports: [
    CommonModule,
    FilterPipeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    ngfModule,
    NgxPaginationModule,
    ProfileRoutingModule,
    SharedModule,
    Ng2GoogleChartsModule,
    PdfViewerModule
  ],
  providers: [
    LoaderModalService
  ]
})
export class ProfileModule {}
