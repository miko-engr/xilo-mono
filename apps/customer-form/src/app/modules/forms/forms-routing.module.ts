import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './components/page/page.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'thank-you',
    loadChildren: () =>
      import('./modules/thank-you/thank-you.module').then(m => m.ThankYouModule)
  },
  {
    path: 'list-all-forms',
    loadChildren: () =>
      import('./modules/list-all-forms/list-all-forms.module').then(
        m => m.ListAllFormsModule
      )
  },
  {
    path: ':page',
    component: PageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
