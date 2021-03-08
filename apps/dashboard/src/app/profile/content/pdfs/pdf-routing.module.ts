import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { PdfComponent } from './pdf.component';
import { AddPdfComponent } from './add/add.component';
import { PdfHomeComponent } from './pdf-home/pdf-home.component';

const pdfRoutes: Routes = [
    { path: '', component: PdfComponent, children: [
        { path: '', redirectTo: 'pdf-home', pathMatch: 'full'},
        { path: 'pdf-home', component: PdfHomeComponent},
        { path: 'add', component: AddPdfComponent},
    ]}
];
@NgModule({
    imports: [
        RouterModule.forChild(pdfRoutes)
    ],
    exports: [RouterModule]
})
export class PdfRoutingModule {}