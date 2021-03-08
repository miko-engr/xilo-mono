import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProspectsSettingsComponent } from './prospects-settings/prospects-settings.component';


const settingsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        children: [
          {
            path: 'prospects',
            component: ProspectsSettingsComponent
          },
          {
            path: '',
            redirectTo: 'prospects',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'agents',
        children: [
          {
            path: 'prospects',
            component: ProspectsSettingsComponent
          },
          {
            path: '',
            redirectTo: 'prospects',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'agents',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
