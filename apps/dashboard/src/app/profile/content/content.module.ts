import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxLoadingModule
} from 'ngx-loading';
import { SharedModule } from '../../shared/shared.module';
import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { ContentFormsComponent } from './forms/form.component';
import { ContentRaterComponent } from './rater/rater.component';
import { ContentFormsListComponent } from './forms/form-list/form-list.component';
import { ngfModule } from 'angular-file';
import { ViewFormComponent } from './forms/view-form/view-form.component';

@NgModule({
    declarations: [
        ContentComponent,
        ContentFormsComponent,
        ContentRaterComponent,
        ContentFormsListComponent,
        ViewFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        NgxLoadingModule,
        ngfModule,
        ContentRoutingModule
    ]
})
export class ContentModule {}
