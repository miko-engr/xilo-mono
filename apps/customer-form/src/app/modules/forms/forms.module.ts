import { SERVICES } from './services/index';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import { FormsRoutingModule } from './forms-routing.module';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgSelectModule } from '@ng-select/ng-select';

import { QuestionTextboxComponent } from './components/question-textbox/question-textbox.component';
import { QuestionDropdownComponent } from './components/question-dropdown/question-dropdown.component';
import { SummaryComponent } from './components/summary/summary.component';
import { QuestionLabeledSelectComponent } from './components/question-labeled-select/question-labeled-select.component';
import { QuestionDateFieldComponent } from './components/question-date-field/question-date-field.component';
import { FinishPageComponent } from './components/finish-page/finish-page.component';
import { ValueInterpolatePipe } from './pipes/value-interpolate.pipe';
import { QuestionEmailFieldComponent } from './components/question-email-field/question-email-field.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import {
  EducationalDropdownComponent
} from './components/question-educational-dropdown/educational-dropdown.component';
import {
  QuestionPhoneNumberFieldComponent
} from './components/question-phone-number-field/question-phone-number-field.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { OpinionScaleComponent } from './components/opinion-scale/opinion-scale.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AlertIconComponent } from './components/icons/alert-icon/alert-icon.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { MultipleAddComponent } from './components/multiple-add/multiple-add.component';
import { SharedModule } from '../shared/shared.module';
import { QuestionAddFileComponent } from './components/question-add-file/question-add-file.component';
import { ngfModule } from 'angular-file';
import { FormViewerModule } from '@xilo-mono/form-viewer';
import { FormContractModule } from '@xilo-mono/form-contracts';
import { QuestionTextareaComponent } from './components/question-textarea/question-textarea.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    PageComponent,
    DynamicFormComponent,
    QuestionTextboxComponent,
    QuestionTextareaComponent,
    QuestionDropdownComponent,
    SummaryComponent,
    QuestionLabeledSelectComponent,
    QuestionDateFieldComponent,
    FinishPageComponent,
    ValueInterpolatePipe,
    QuestionEmailFieldComponent,
    EducationalDropdownComponent,
    QuestionPhoneNumberFieldComponent,
    OpinionScaleComponent,
    QuestionAddFileComponent,
    AlertIconComponent,
    ErrorMessageComponent,
    MultipleAddComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskModule.forRoot(options),
    TooltipModule,
    GooglePlaceModule,
    NgSelectModule,
    ngfModule,
    FormContractModule,
    FormViewerModule
  ],
  providers: [...SERVICES, DatePipe]
})
export class FormModule {}
