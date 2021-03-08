import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAllFormsComponent } from './list-all-forms.component';

const routes: Routes = [
  {
    path: '',
    component: ListAllFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListAllFormsRoutingModule {}
