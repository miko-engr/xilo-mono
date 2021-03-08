import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderMainComponent } from './form-builder.component';
import { FormBuilderSettingsComponent } from './form/settings/settings.component';

const formBuilderRoutes: Routes = [
  {
    path: '',
    component: FormBuilderMainComponent,
    children: [
      { path: '', redirectTo: 'form-editor', pathMatch: 'full' },
      { path: 'settings', component: FormBuilderSettingsComponent },
      {
        path: 'form-editor',
        loadChildren: () =>
          import('./form/form-editor/form-editor.module').then(
            (m) => m.FormEditorModule
          ),
      },
      {
        path: 'pdf',
        loadChildren: () =>
          import('./form/pdf/pdf.module').then((m) => m.PdfModule),
      },
      {
        path: 'integrations',
        loadChildren: () =>
          import('./form/integrations-manager/integrations-manager.module').then(m => m.IntegrationsManagerModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formBuilderRoutes)],
  exports: [RouterModule],
})
export class FormBuilderRoutingModule {}
