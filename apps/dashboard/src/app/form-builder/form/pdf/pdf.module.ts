import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { MomentModule } from 'ngx-moment';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TreeModule } from '@circlon/angular-tree-component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { UiSwitchModule } from 'ngx-ui-switch';
// import { EffectsModule } from '@ngrx/effects';
//import { StoreModule } from '@ngrx/store';
import { PdfMapperLayout } from './pages';
import { PdfRoutingModule } from './pdf-routing.module';
import {
  PdfQuestionSearchBoxComponent,
  PdfQuestionDropdownComponent,
  PdfQuestionTreeComponent,
  AddPdfDropdownComponent,
  PdfCompanyInfoComponent,
  PdfInputFieldComponent,
} from './components';
import { PdfMapperModule } from '@xilo-mono/pdf-mapper';
import { FormTreeModule } from '@xilo-mono/form-tree';

/**
 * Module to manage form creation workflows
 */
@NgModule({
  imports: [
    CommonModule,
    NgxUIModule,
    MomentModule,
    HttpClientModule,
    PdfRoutingModule,
    BsDropdownModule.forRoot(),
    TreeModule,
    AccordionModule.forRoot(),
    UiSwitchModule,
    PdfMapperModule,
    FormTreeModule,
    /*
    StoreModule.forFeature(
      fromTemplateState.templateLibStateFeatureKey,
      fromTemplateState.reducers
    ),
    EffectsModule.forFeature([TemplateLibEffects]),
    */
  ],
  declarations: [
    PdfMapperLayout,
    PdfQuestionSearchBoxComponent,
    PdfQuestionDropdownComponent,
    PdfQuestionTreeComponent,
    AddPdfDropdownComponent,
    PdfCompanyInfoComponent,
    PdfInputFieldComponent,
  ],
  exports: [],
})
export class PdfModule {}
