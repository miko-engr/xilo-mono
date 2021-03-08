import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PdfMapperLayout } from './pages';

const routes: Routes = [
  {
    path: '',
    component: PdfMapperLayout,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfRoutingModule {}
