import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListAllFormsRoutingModule } from './list-all-forms-routing.module';
import { SharedModule } from '../../../../../app/modules/shared/shared.module';
import { ListAllFormsComponent } from './list-all-forms.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ListAllFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ListAllFormsRoutingModule
  ]
})
export class ListAllFormsModule {}
