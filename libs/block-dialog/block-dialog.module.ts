import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxUIModule } from '@swimlane/ngx-ui';

import { BlockDialogComponent } from './block-dialog.component';

@NgModule({
  declarations: [
    BlockDialogComponent,
  ],
  imports: [
    CommonModule,
    NgxUIModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ],
  exports: [
    BlockDialogComponent,
  ],
})

export class BlockDialogModule {}

