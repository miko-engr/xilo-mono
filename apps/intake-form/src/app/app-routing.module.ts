import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntakeFormPageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'form'
  },
  {
    path: 'form',
    component: IntakeFormPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
