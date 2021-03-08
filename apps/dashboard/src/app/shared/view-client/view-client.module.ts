import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientViewComponent } from './view-client.component';
import { AutoComponent } from './auto/auto.component';
import { ClientComponent } from './client/client.component';
import { ClientValidationComponent } from './validations/validations.component';
import { HomeComponent } from './home/home.component';
import { ClientCommercialComponent } from './commercial/commercial.component';
import { NotesComponent } from './notes/notes.component';
import { DocumentsComponent } from './documents/documents.component';
import { ClientViewRoutingModule } from './view-client-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { FlowComponent } from './flow/flow.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RateComponent } from './rates/rates.component';
import { FormSubmissionsComponent } from './form-submissions/form-submissions.component';
import { SharedDirectiveModule } from '../shared-directives.module';
import { VendorIntegrationMappingService } from '../../form-builder/form/integrations-manager/services/vendorIntegrationMapping.service';

@NgModule({
  declarations: [
    ClientViewComponent,
    AutoComponent,
    ClientComponent,
    HomeComponent,
    ClientCommercialComponent,
    NotesComponent,
    DocumentsComponent,
    FlowComponent,
    RateComponent,
    FormSubmissionsComponent,
    ClientValidationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClientViewRoutingModule,
    NgxLoadingModule,
    RouterModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    SharedDirectiveModule
  ],
  providers: [
    VendorIntegrationMappingService
  ],
  exports: [
    ClientViewComponent
  ]
})

export class ClientViewModule {
}
