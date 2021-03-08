import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { MessagesComponent } from './messages.component';
import { MessagesTableComponent } from './messages-table/messages-table.component';

const MessagesRoutes: Routes = [
    { path: '', component: MessagesComponent, children: [
        { path: '', component: MessagesTableComponent},
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(MessagesRoutes)
    ],
    exports: [RouterModule]
})
export class MessagesRoutingModule {}
