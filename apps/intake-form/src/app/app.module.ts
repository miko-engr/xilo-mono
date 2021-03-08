import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormViewerModule } from '@xilo-mono/form-viewer';
import { IntakeFormNavbarComponent } from './navbar/navbar.component';
import { IntakeFormPageComponent } from './page/page.component';
import { IntakeFormViewComponent } from './form/form.component';
import { 
  FormContractModule, 
  CompanyService, 
  FormViewService, 
  AgentService, 
  NoteService,
  NotificationService, 
  VehicleService,
  VehicleListService, 
} from '@xilo-mono/form-contracts';
import { AppRoutingModule } from './app-routing.module';
import { IntakeFormNotesComponent } from './notes/notes.component';
import { IntakeFormSummaryComponent } from './summary/summary.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService } from './services/toast.service';
import { LoaderModalService } from './services/loader-modal/loader-modal.service';
import { MatDialogModule } from '@angular/material/dialog';
import { LoaderModalComponent } from './services/loader-modal/loader-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    IntakeFormNavbarComponent,
    IntakeFormPageComponent,
    IntakeFormViewComponent,
    IntakeFormNotesComponent,
    IntakeFormSummaryComponent,
    LoaderModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormViewerModule,
    FormContractModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    MatSnackBarModule,
    MatDialogModule

  ],
  entryComponents: [
    LoaderModalComponent
  ],
  providers: [
    CompanyService,
    FormViewService,
    AgentService,
    NoteService,
    ToastService,
    VehicleService,
    LoaderModalService,
    NotificationService,
    VehicleListService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
