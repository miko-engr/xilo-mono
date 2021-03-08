import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { QueryBuilderModule as AngularQueryBuilderModule } from 'angular2-query-builder';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule, AngularQueryBuilderModule, FormsModule],
  declarations: [QueryBuilderComponent],
  exports: [QueryBuilderComponent],
})
export class QueryBuilderModule {}
