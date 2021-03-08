import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWizardComponent } from './form-wizard.component';
import { FormWizardRoutingModule } from './form-wizard-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { FormWizardNavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from '../shared/shared-directives.module';

@NgModule({
  declarations: [
    FormWizardComponent,
    FormWizardNavComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormWizardRoutingModule,
    MatMenuModule,
    SharedDirectiveModule
  ],
})

export class FormWizardModule {
  
}
