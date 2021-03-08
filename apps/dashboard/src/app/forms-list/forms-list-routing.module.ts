import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FormsListComponent } from './forms-list.component';

const formsListRoutes: Routes = [
    { path: '', component: FormsListComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(formsListRoutes)
    ],
    exports: [RouterModule]
})
export class FormsListRoutingModule {
}
