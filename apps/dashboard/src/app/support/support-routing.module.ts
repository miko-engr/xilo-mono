import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { SupportComponent } from './support.component';

const supportRoutes: Routes = [
    {
        path: '',
        children: [
          {
            path: '',
            component: SupportComponent
          }
        ]
      },
];

@NgModule({
    imports: [
        RouterModule.forChild(supportRoutes)
    ],
    exports: [RouterModule]
})
export class SupportRoutingModule {
}
