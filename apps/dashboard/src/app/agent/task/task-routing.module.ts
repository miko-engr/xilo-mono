import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TaskComponent } from './task.component';
import { TaskTableComponent } from './task-table/task-table.component';

const TaskRoutes: Routes = [
    { path: '', component: TaskComponent, children: [
        { path: '', component: TaskTableComponent},
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(TaskRoutes)
    ],
    exports: [RouterModule]
})
export class TaskRoutingModule {}
