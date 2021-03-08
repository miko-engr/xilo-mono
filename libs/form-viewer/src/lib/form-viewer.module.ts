import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgGridModule } from 'ag-grid-angular';

import { FormViewerComponent } from './form-viewer.component';
import { RepeatTypeComponent } from './components/repeat/repeat.type';
import { CustomCheckboxComponent } from './components/checkbox/checkbox.component';
import { FormViewerQuestionPanelWrapperComponent } from './components/wrappers/question-wrapper/question-wrapper.component';
import { CustomSelectComponent } from './components/select/select.component';
import { CustomerFormTypeComponent } from './components/form/customer-form.component';
import { CustomerSectionTypeComponent } from './components/customer-section/customer-section.component';
import { QuestionGroupTypeComponent } from './components/question-group/question-group.component';
import { AddressComponent } from './components/address/address.component';
import { CustomInputComponent } from './components/input/input.component';
import { PhoneNumberComponent } from './components/phonenumber/phonenumber.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { IntakeSectionTypeComponent } from './components/intake-section/intake-section.component';
import { FormViewerSectionPanelWrapperComponent } from './components/wrappers/intake-section-wrapper/section-wrapper.component';
import { FormIntakeTypeComponent } from './components/form/intake-form.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SubmissionEffects } from './+state/submission/submission.effects';
import { metaReducers } from './+state/meta-reducers';
import { IntakeRepeatTypeComponent } from './components/repeat/intake-repeat/intake-repeat.type';
import { CustomTextareaComponent } from './components/textarea/textarea.component';
import { CustomTableComponent } from './components/table/table.component';
import { CustomRadioComponent } from './components/radio/radio.component';
import { CustomLastNameComponent } from './components/last-name/last-name.component';
import { CustomFirstNameComponent } from './components/first-name/first-name.component';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { CustomerRepeatTypeComponent } from './components/repeat/customer-repeat/customer-repeat.component';
import { CustomSelectboxComponent } from './components/selectbox/selectbox.component';
import { FormViewerCustomerSectionPanelWrapperComponent } from './components/wrappers/customer-section-wrapper/section-wrapper.component';
import { CustomTextComponent } from './components/text/text.component';
import { SafePipe } from './pipes/safe.pipe';
import { FORM_VIEWER_FEATURE_KEY, reducers } from './+state';
import { CustomerFormFacade } from './+state/customer-form/customer-form.facade';
import { CustomerFormEffects } from './+state/customer-form/customer-form.effects';
import { CustomCompanyNameComponent } from './components/company-name/company-name.component';

import { CustomGridComponent } from './components/grid/grid.component';
import { GridCellComponent } from './components/grid/cell.component';

import { CustomDataTableComponent } from './components/grid/datatable.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
export function minlengthValidationMessage(err, field) {
  return `Should have atleast ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

@NgModule({
  declarations: [
    FormViewerComponent,
    FormIntakeTypeComponent,
    RepeatTypeComponent,
    FormViewerSectionPanelWrapperComponent,
    CustomSelectComponent,
    CustomerFormTypeComponent,
    CustomerSectionTypeComponent,
    IntakeSectionTypeComponent,
    QuestionGroupTypeComponent,
    AddressComponent,
    CustomInputComponent,
    PhoneNumberComponent,
    IntakeRepeatTypeComponent,
    CustomTextareaComponent,
    CustomTableComponent,
    CustomRadioComponent,
    CustomCheckboxComponent,
    CustomFirstNameComponent,
    CustomCompanyNameComponent,
    CustomLastNameComponent,
    FormViewerCustomerSectionPanelWrapperComponent,
    FormViewerQuestionPanelWrapperComponent,
    CustomerRepeatTypeComponent,
    CustomerSectionTypeComponent,
    CustomSelectboxComponent,
    CustomTextComponent,
    SafePipe,
    CustomGridComponent,
    GridCellComponent,
    CustomDataTableComponent,
  ],
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgSelectModule,
    NgxMaskModule.forRoot(options),
    AgGridModule.withComponents([GridCellComponent]),
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [
        { name: 'repeat', component: RepeatTypeComponent },
        {
          name: 'intake-repeat',
          component: IntakeRepeatTypeComponent,
          defaultOptions: { defaultValue: [] },
        },
        {
          name: 'customer-repeat',
          component: CustomerRepeatTypeComponent,
          defaultOptions: { defaultValue: [] },
        },
        {
          name: 'customer-section',
          component: CustomerSectionTypeComponent,
          defaultOptions: { defaultValue: {} },
        },
        {
          name: 'intake-section',
          component: IntakeSectionTypeComponent,
          defaultOptions: { defaultValue: {} },
        },
        {
          name: 'customer-form',
          component: CustomerFormTypeComponent,
          defaultOptions: { defaultValue: {} },
        },
        {
          name: 'intake-form',
          component: FormIntakeTypeComponent,
          defaultOptions: { defaultValue: {} },
        },
        {
          name: 'question-group',
          component: QuestionGroupTypeComponent,
          defaultOptions: { defaultValue: {} },
        },
        {
          name: 'datatable',
          component: CustomDataTableComponent,
          defaultOptions: {
            templateOptions: {
              columnMode: 'force',
              rowHeight: 'auto',
              headerHeight: '40',
              footerHeight: '40',
              limit: '10',
              scrollbarH: 'true',
              reorderable: 'reorderable',
            },
          },
        },
        {
          name: 'grid',
          component: CustomGridComponent,
          defaultOptions: {
            templateOptions: {
              width: '100%',
              height: '400px',
            },
          },
        },

        { name: 'address', component: AddressComponent },
        { name: 'input', component: CustomInputComponent },
        { name: 'firstName', component: CustomFirstNameComponent },
        { name: 'companyName', component: CustomCompanyNameComponent },
        { name: 'lastName', component: CustomLastNameComponent },
        { name: 'select', component: CustomSelectComponent },
        { name: 'radio', component: CustomRadioComponent },
        { name: 'checkbox', component: CustomCheckboxComponent },
        { name: 'phonenumber', component: PhoneNumberComponent },
        { name: 'textarea', component: CustomTextareaComponent },
        { name: 'table', component: CustomTableComponent },
        { name: 'selectbox', component: CustomSelectboxComponent },
        { name: 'text', component: CustomTextComponent },
      ],
      wrappers: [
        {
          name: 'customer-section-panel',
          component: FormViewerCustomerSectionPanelWrapperComponent,
        },
        {
          name: 'question-panel',
          component: FormViewerQuestionPanelWrapperComponent,
        },
        {
          name: 'section-panel',
          component: FormViewerSectionPanelWrapperComponent,
        },
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minlength', message: minlengthValidationMessage },
        { name: 'maxlength', message: maxlengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
      ],
    }),
    FormlySelectModule,
    GooglePlaceModule,
    StoreModule.forFeature(FORM_VIEWER_FEATURE_KEY, reducers, { metaReducers }),
    EffectsModule.forFeature([SubmissionEffects, CustomerFormEffects]),
  ],
  providers: [CustomerFormFacade],
  exports: [FormViewerComponent],
})
export class FormViewerModule {}
