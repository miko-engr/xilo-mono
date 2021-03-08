import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormEditorLayout } from './form-editor-layout/form-editor-layout.component';

const routes: Routes = [
  {
    path: '',
    component: FormEditorLayout
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormEditorRoutingModule {}