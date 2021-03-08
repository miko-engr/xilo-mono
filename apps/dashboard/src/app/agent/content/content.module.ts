import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxLoadingModule
} from 'ngx-loading';
import { SharedModule } from '../../shared/shared.module';
import { AgentContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { ContentFormsComponent } from './forms/form.component';
import { ContentFormsListComponent } from './forms/form-list/form-list.component';


@NgModule({
    declarations: [
        ContentComponent,
        ContentFormsComponent,
        ContentFormsListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxLoadingModule,
        AgentContentRoutingModule,
        SharedModule
    ]
})
export class AgentFormModule {}
