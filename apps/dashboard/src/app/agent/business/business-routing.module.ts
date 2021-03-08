import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessComponent } from './business.component';


const BusinessRoute: Routes = [
  {
    path: '', component: BusinessComponent,
    children: [
      { path: 'settings', loadChildren: () => import('../../shared/settings/settings.module').then(m => m.SettingsModule)},
      {
        path: '',
        redirectTo: 'settings',
        pathMatch: 'full',
      }
    ]
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(BusinessRoute),
  ],
  exports: [
    RouterModule
  ]
})
export class BusinessRoutingModule { }
