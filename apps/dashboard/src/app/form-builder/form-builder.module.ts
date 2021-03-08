import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilderMainComponent } from './form-builder.component';
import { MomentModule } from 'ngx-moment';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { FormBuilderSideNavComponent } from './side-nav/side-nav.component';
import { FormBuilderNavComponent } from './nav/nav.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormViewerModule } from '@xilo-mono/form-viewer';
import { FormEditorModule } from './form/form-editor/form-editor.module';
import { PdfModule } from './form/pdf';
import { IntegrationsManagerModule } from './form/integrations-manager';
import { SharedModule } from '../shared/shared.module';
import { VendorSchemaService } from './form/integrations-manager/services/vendorSchema.service';
import { VendorIntegrationMappingService } from './form/integrations-manager/services/vendorIntegrationMapping.service';
import { FormBuilderSettingsComponent } from './form/settings/settings.component';
import { SharedDirectiveModule } from '../shared/shared-directives.module';

@NgModule({
  declarations: [
    FormBuilderMainComponent,
    FormBuilderSideNavComponent,
    FormBuilderNavComponent,
    FormBuilderSettingsComponent,
  ],
  imports: [
    CommonModule,
    MomentModule,
    FormsModule,
    FormEditorModule,
    IntegrationsManagerModule,
    PdfModule,
    MatMenuModule,
    NgxUIModule,
    FormBuilderRoutingModule,
    IntegrationsManagerModule,
    PdfModule,
    SharedModule,
    NgbTooltipModule,
    FormViewerModule,
    SharedDirectiveModule
  ],
  providers: [
    AlertConfig,
    VendorSchemaService,
    VendorIntegrationMappingService,
  ],
  bootstrap: [FormBuilderMainComponent],
})
export class FormBuilderMainModule {}
