import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FormWizardComponent } from './form-wizard.component';

const formWizardRoutes: Routes = [
    { path: '', component: FormWizardComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(formWizardRoutes)
    ],
    exports: [RouterModule]
})
export class FormWizardRoutingModule {
}
