import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTreeComponent } from './form-tree.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { NgxUIModule } from '@swimlane/ngx-ui';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BlockDialogComponent } from './block-dialog/block-dialog.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { TreeQuestionComponent } from './tree-question/tree-question.component';

@NgModule({
  declarations: [
    FormTreeComponent,
    BlockDialogComponent,
    TreeQuestionComponent
  ],
  imports: [
    CommonModule,
    NgxUIModule,
    TreeModule,
    DragDropModule,
    TabsModule.forRoot(),
    MatDialogModule
  ],
  entryComponents: [
    BlockDialogComponent
  ],
  exports: [
    FormTreeComponent,
  ],
})
export class FormTreeModule {}
