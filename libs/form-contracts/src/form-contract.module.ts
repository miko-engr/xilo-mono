import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IconSnackBarComponent } from './templates/icon-snack-bar/icon-snack-bar.component';

@NgModule({
  declarations: [
    IconSnackBarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: []
})
export class FormContractModule {}
