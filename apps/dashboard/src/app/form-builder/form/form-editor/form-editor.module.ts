import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { MomentModule } from 'ngx-moment';
import { FormEditorRoutingModule } from './form-editor-routing.module';
import { FormViewerModule } from '@xilo-mono/form-viewer';
import { FormContractModule, NotificationService, CompanyService, AgentService, NoteService, ToastService, VehicleService } from '@xilo-mono/form-contracts';
import { QueryBuilderModule } from '@xilo-mono/query-builder';
import { FormTreeModule } from '@xilo-mono/form-tree';
import { ConditionSettingComponent } from './components/condition-setting/condition-setting.component';
import { FormTreeComponent } from './components/form-tree/form-tree.component';
import { QuestionSettingComponent } from './components/question-setting/question-setting.component';
import { FormEditorLayout } from './form-editor-layout/form-editor-layout.component';
import { LoaderModalService } from '../../../services/loader-modal.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SharedDirectiveModule } from '../../../shared/shared-directives.module';

/**
 * Module to manage form creation workflows
 */
@NgModule({
  imports: [
    CommonModule,
    NgxUIModule,
    MomentModule,
    HttpClientModule,
    FormEditorRoutingModule,
    FormViewerModule,
    FormContractModule,
    QueryBuilderModule,
    FormTreeModule,
    FormContractModule,
    DragDropModule,
    SharedDirectiveModule
  ],
  declarations: [
    FormEditorLayout,
    FormTreeComponent,
    QuestionSettingComponent,
    ConditionSettingComponent,
  ],
  exports: [],
  providers: [
    CompanyService,
    AgentService,
    NoteService,
    ToastService,
    VehicleService,
    LoaderModalService,
    NotificationService
  ]
})
export class FormEditorModule {}
