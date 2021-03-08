import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PdfRoutingModule} from './pdf-routing.module';
import {PdfComponent} from './pdf.component';
import {NgxLoadingModule} from 'ngx-loading';
import {ngfModule} from 'angular-file';
import {FilterPipeModule} from 'ngx-filter-pipe';
import { SharedModule } from '../../../shared/shared.module';
import { AddPdfComponent } from './add/add.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PdfHomeComponent } from './pdf-home/pdf-home.component';
import { EditPdfComponent } from './edit/edit.component';
import {PdfViewerModule} from "ng2-pdf-viewer";

@NgModule ({
    declarations: [
        PdfComponent,
        AddPdfComponent,
        EditPdfComponent,
        PdfHomeComponent
    ],
    imports: [
        CommonModule,
        FilterPipeModule,
        FormsModule,
        ReactiveFormsModule,
        NgxLoadingModule,
        ngfModule,
        NgxPaginationModule,
        PdfRoutingModule,
        SharedModule,
        PdfViewerModule
    ]
})

export class PdfModule {}
