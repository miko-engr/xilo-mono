import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProspectsSettingsComponent } from './prospects-settings/prospects-settings.component';
import { SharedModule } from '../shared.module';
import { FormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    ProspectsSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    ProspectsSettingsComponent
  ]
})
export class SettingsModule { }
