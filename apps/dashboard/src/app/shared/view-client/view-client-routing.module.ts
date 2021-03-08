import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientViewComponent } from './view-client.component';
import { AutoComponent } from './auto/auto.component';
import { ClientComponent } from './client/client.component';
import { ClientValidationComponent } from './validations/validations.component';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { DocumentsComponent } from './documents/documents.component';
import { FlowComponent } from './flow/flow.component';
import { ClientCommercialComponent } from './commercial/commercial.component';
import { RateComponent } from './rates/rates.component';
import { FormSubmissionsComponent } from './form-submissions/form-submissions.component';
import { FormSubmissionsGuard } from '../../guards/form-submissions.guard';


const clientViewRoutes: Routes = [
  {
    path: '', component: ClientViewComponent, children: [
      { path: '', redirectTo: 'client', pathMatch: 'full' },
      { path: 'client', component: ClientComponent, data: { some_data: true } },
      { path: 'validations', component: ClientValidationComponent },
      { path: 'submissions', component: FormSubmissionsComponent },
      { path: 'auto', component: AutoComponent },
      { path: 'commercial', component: ClientCommercialComponent },
      { path: 'home', component: HomeComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'flow', component: FlowComponent },
      { path: 'rates', component: RateComponent },
      { path: 'forms', component: RateComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(clientViewRoutes)
  ],
  exports: [RouterModule]
})

export class ClientViewRoutingModule {
}
