import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsListComponent } from './forms-list.component';
import { FormsListRoutingModule } from './forms-list-routing.module';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    FormsListComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsListRoutingModule,
    MatMenuModule
  ],
})

export class FormsListModule {
  
}
