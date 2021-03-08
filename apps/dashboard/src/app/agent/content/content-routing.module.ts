import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ContentComponent } from './content.component';
import { ContentFormsComponent } from './forms/form.component';
import { ContentFormsListComponent } from './forms/form-list/form-list.component';

const contentRoutes: Routes = [
    { path: '', component: ContentComponent, children: [
        { path: '', component: ContentFormsComponent, children: [
            {path: '', component: ContentFormsListComponent},
        ]},
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(contentRoutes)
    ],
    exports: [RouterModule]
})
export class AgentContentRoutingModule {}
