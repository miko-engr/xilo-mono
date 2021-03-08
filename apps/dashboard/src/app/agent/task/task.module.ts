import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxLoadingModule
} from 'ngx-loading';
import { SharedModule } from '../../shared/shared.module';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TaskTableComponent } from './task-table/task-table.component';

@NgModule({
    declarations: [
        TaskComponent,
        TaskTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxLoadingModule,
        TaskRoutingModule,
        SharedModule
    ]
})
export class TaskModule {}
