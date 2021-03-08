import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { MomentModule } from 'ngx-moment';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TreeModule } from '@circlon/angular-tree-component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { UiSwitchModule } from 'ngx-ui-switch';
import { IntegrationsLayoutComponent } from './components';
import { IntegrationsManagerRoutingModule } from './integrations-manager-routing.module';

import {
  AddIntegrationDropdownComponent,
  QuestionDropdownComponent,
  QuestionSearchBoxComponent,
  VendorFieldGroupComponent,
  VendorInputFieldComponent,
  VendorIntegrationMappingFieldsComponent
} from './components';
import { FormTreeModule } from '@xilo-mono/form-tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { QueryBuilderModule } from 'angular2-query-builder';

/**
 * Module to manage form creation workflows
 */
@NgModule({
  imports: [
    CommonModule,
    NgxUIModule,
    MomentModule,
    HttpClientModule,
    FormsModule,
    IntegrationsManagerRoutingModule,
    BsDropdownModule.forRoot(),
    TreeModule,
    AccordionModule.forRoot(),
    UiSwitchModule,
    FormTreeModule,
    DragDropModule,
    SharedModule,
    QueryBuilderModule,
  ],
  declarations: [
    IntegrationsLayoutComponent,
    QuestionSearchBoxComponent,
    QuestionDropdownComponent,
    AddIntegrationDropdownComponent,
    VendorIntegrationMappingFieldsComponent,
    VendorInputFieldComponent,
    VendorFieldGroupComponent
  ],
  exports: []
})
export class IntegrationsManagerModule {
}
