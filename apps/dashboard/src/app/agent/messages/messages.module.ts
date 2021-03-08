import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxLoadingModule
} from 'ngx-loading';
import { SharedModule } from '../../shared/shared.module';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { MessagesTableComponent } from './messages-table/messages-table.component';

@NgModule({
    declarations: [
        MessagesComponent,
        MessagesTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxLoadingModule,
        MessagesRoutingModule,
        SharedModule
    ]
})
export class MessagesModule {}
