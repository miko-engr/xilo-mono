import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { NgxLoadingModule
 } from 'ngx-loading';
import { ClientViewModule } from './view-client/view-client.module';
import { FormsModule } from '@angular/forms';
import { ClientTableComponent } from './client-table/client-table.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {ngfModule} from 'angular-file';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {DragDropModule} from '@angular/cdk/drag-drop';

// import {MomentDateAdapter} from '@angular/material-moment-adapter';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_FORMATS
  } from '@angular/material-moment-adapter';
import {MatChipsModule} from '@angular/material/chips';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AlertModule } from 'ngx-alerts';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { DialogImagePicker } from './dialogs/image-picker-dialog/image-picker-dialog.component';
import { DialogTemplatePicker } from './dialogs/template-picker-dialog/template-picker-dialog.component';
import {MatListModule} from '@angular/material/list';
import { AgePipe } from './pipes/age.pipe';
import {MatSliderModule} from '@angular/material/slider';
import { VendorDialog } from './dialogs/vendor/vendor.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AnswerPickerDialog } from './dialogs/answer-picker-dialog/answer-picker-dialog.component';
import { MassEditComponent } from './dialogs/mass-edit-dialog/mass-edit.component';
import { ConditionsDialogComponent } from './dialogs/conditions-dialog/conditions-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AnswerSettingsDialogComponent } from './dialogs/answer-settings-dialog/answer-settings-dialog.component';
import { TaskDialogComponent } from './dialogs/task-dialog/task-dialog.component';
import { MessagesListDialogComponent } from './dialogs/messages-list-dialog/messages-list-dialog.component';
import { MessagesCreateDialogComponent } from './dialogs/messages-create-dialog/messages-create-dialog.component';
import { NotesCreateDialogComponent } from './dialogs/notes-create-dialog/notes-create-dialog.component';
import { CSVUploaderDialogComponent } from './dialogs/csv-uploader-dialog/csv-uploader-dialog.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { QuestionSettingsDialogComponent } from './dialogs/question-settings-dialog/question-settings-dialog.component';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IntegrationValidatorDialogComponent } from './dialogs/integration-validator/validator-dialog.component';
import { IconSnackBarComponent } from '../icon-snack-bar/icon-snack-bar.component';
import { NgxMaskModule } from 'ngx-mask';
import { AnswerSettingsComponent } from '../profile/content/forms/form-builder/answer-settings/answer-settings-dialog/answer-settings.component';
import { TransformReponseDialogComponent } from './dialogs/transform-response-dialog/transform-response-dialog.component';
import { ValidationDialogComponent } from './dialogs/validation-dialog/validation-dialog.component';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonRendererComponent } from './dialogs/validation-dialog/grid-components/ag-btn-renderer.component';
import { SharedDirectiveModule } from './shared-directives.module';
import { VendorFieldsSettingsDialogComponent } from './dialogs/vendor-field-settings-dialog/vendor-field-settings-dialog.component';
import { ConditionalValueDialogComponent } from './dialogs/conditional-value-dialog/conditional-value-dialog.component';
import { QueryBuilderModule } from 'angular2-query-builder';

@NgModule({
    declarations: [
        ClientTableComponent,
        ClientTableComponent,
        DialogImagePicker,
        DialogTemplatePicker,
        AnswerPickerDialog,
        MassEditComponent,
        AgePipe,
        ConditionalValueDialogComponent,
        VendorDialog,
        ConditionsDialogComponent,
        AnswerSettingsDialogComponent,
        QuestionSettingsDialogComponent,
        TaskDialogComponent,
        IntegrationValidatorDialogComponent,
        MessagesListDialogComponent,
        MessagesCreateDialogComponent,
        NotesCreateDialogComponent,
        CSVUploaderDialogComponent,
        IconSnackBarComponent,
        AnswerSettingsComponent,
        TransformReponseDialogComponent,
        ValidationDialogComponent,
        ButtonRendererComponent,
        VendorFieldsSettingsDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FilterPipeModule,
        NgxLoadingModule,
        ngfModule,
        NgxPaginationModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatTableModule,
        MatPaginatorModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatCardModule,
        MatDialogModule,
        MatTooltipModule,
        MatBottomSheetModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        NgSelectModule,
        MatCheckboxModule,
        ClientViewModule,
        AlertModule,
        DragDropModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatListModule,
        MatSliderModule,
        MatButtonToggleModule,
        NgxExtendedPdfViewerModule,
        Ng2SearchPipeModule,
        MatExpansionModule,
        MatGridListModule,
        NgxMaskModule.forRoot(),
        AgGridModule.withComponents([ButtonRendererComponent]),
        SharedDirectiveModule,
        QueryBuilderModule
    ],
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ],
    entryComponents: [
        DialogImagePicker,
        DialogTemplatePicker,
        AnswerPickerDialog,
        MassEditComponent,
        VendorDialog,
        ConditionsDialogComponent,
        AnswerSettingsDialogComponent,
        QuestionSettingsDialogComponent,
        ConditionalValueDialogComponent,
        TaskDialogComponent,
        IntegrationValidatorDialogComponent,
        MessagesListDialogComponent,
        MessagesCreateDialogComponent,
        NotesCreateDialogComponent,
        CSVUploaderDialogComponent,
        IconSnackBarComponent,
        TransformReponseDialogComponent,
        ValidationDialogComponent,
        VendorFieldsSettingsDialogComponent
    ],
    exports: [
        CommonModule,
        FilterPipeModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatTableModule,
        MatPaginatorModule,
        NgxPaginationModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatCardModule,
        MatChipsModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatBottomSheetModule,
        NgSelectModule,
        ClientViewModule,
        MatCheckboxModule,
        DragDropModule,
        MatSlideToggleModule,
        MatMenuModule,
        DialogImagePicker,
        DialogTemplatePicker,
        AnswerPickerDialog,
        MassEditComponent,
        VendorDialog,
        MatListModule,
        AgePipe,
        MatSliderModule,
        MatButtonToggleModule,
        NgxExtendedPdfViewerModule,
        Ng2SearchPipeModule,
        ConditionsDialogComponent,
        MatExpansionModule,
        AnswerSettingsDialogComponent,
        QuestionSettingsDialogComponent,
        TaskDialogComponent,
        IntegrationValidatorDialogComponent,
        MessagesListDialogComponent,
        MessagesCreateDialogComponent,
        NotesCreateDialogComponent,
        CSVUploaderDialogComponent,
        MatGridListModule,
        FormsModule,
        IconSnackBarComponent,
        AnswerSettingsComponent,
        TransformReponseDialogComponent,
        ValidationDialogComponent,
        AgGridModule,
        SharedDirectiveModule,
        VendorFieldsSettingsDialogComponent,
        ConditionalValueDialogComponent
    ]
})

export class SharedModule {}

