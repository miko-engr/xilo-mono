import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { SharedModule } from '../shared/shared.module';
import { SupportRoutingModule } from './support-routing.module';
import { SupportCardComponent } from './cards/cards.component';

@NgModule({
  declarations: [
    SupportComponent,
    SupportCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SupportRoutingModule,
    SharedModule,
  ]
})
export class SupportModule {}
