import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ContentComponent } from './content.component';
import { ContentFormsComponent } from './forms/form.component';
import { ContentRaterComponent } from './rater/rater.component';
import { ContentFormsListComponent } from './forms/form-list/form-list.component';
import { MassEditComponent } from '../../shared/dialogs/mass-edit-dialog/mass-edit.component';
import { ViewFormComponent } from './forms/view-form/view-form.component';
import { FormBuilderComponent } from './forms/form-builder/form-builder.component';

const contentRoutes: Routes = [
    { path: '', component: ContentComponent, children: [
        { path: '',  component: ContentFormsComponent, children: [
            {path: 'list', component: ContentFormsListComponent},
        ]},
        {path: 'pdfs', loadChildren: () => import('./pdfs/pdf.module').then(m => m.PdfModule)},
        {path: 'view/:id', component: ViewFormComponent},
        {path: 'edit/:id', component: MassEditComponent},
        {path: 'discounts', loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule)},
        {path: 'rater', component: ContentRaterComponent},
    ]},
];

@NgModule({
    imports: [
        RouterModule.forChild(contentRoutes)
    ],
    exports: [RouterModule]
})
export class ContentRoutingModule {}
