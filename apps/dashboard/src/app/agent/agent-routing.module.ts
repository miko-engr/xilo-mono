import { AgentComponent } from './agent.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ClientTableComponent } from '../shared/client-table/client-table.component';


const AgentRoutes: Routes = [
        {path: '', component:AgentComponent, children: [
            { path: '', redirectTo: 'clients-table', pathMatch: 'full' },
            { path: 'forms',  loadChildren: () => import('./content/content.module').then(m => m.AgentFormModule) },
            { path: 'tasks',  loadChildren: () => import('./task/task.module').then(m => m.TaskModule) },
            { path: 'messages',  loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) },
            { path: 'business', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule)},
            { path: 'clients-table', children: [
                {path: '',  component: ClientTableComponent},
                {path: 'view/:id',  loadChildren: () => import('../shared/view-client/view-client.module').then(m => m.ClientViewModule)}
            ]},
        ]
    }];

@NgModule({
    imports: [
        RouterModule.forChild(AgentRoutes)
    ],
    exports: [RouterModule]
})

export class AgentRoutingModule{}
