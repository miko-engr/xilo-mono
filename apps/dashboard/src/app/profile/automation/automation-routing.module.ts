import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { AutomationComponent } from "./automation.component";
import { AutomationEmailsComponent } from './emails/emails.component';
import { AutomationTextsComponent } from './texts/texts.component';
import { AutomationFlowsComponent } from './flows/flows.component';
import { AutomationFlowsListComponent } from './flows/list/list.component';
import { AutomationFlowsAddComponent } from './flows/add/add.component';
import { AutomationFlowsEditComponent } from './flows/edit/edit.component';
import { AutomationTaskComponent } from './task/task.component';


const automationRoutes: Routes = [
    { path: '', component: AutomationComponent, children: [
        { path: '', redirectTo: 'flows', pathMatch: 'full',},
        { path: 'flows', component: AutomationFlowsComponent, children: [
            { path: '', component: AutomationFlowsListComponent,  pathMatch: 'full',},
            { path: 'add',  component: AutomationFlowsAddComponent},
            { path: 'edit/:id',  component: AutomationFlowsEditComponent}
        ]},
        {path: 'emails', component: AutomationEmailsComponent},
        {path: 'texts', component: AutomationTextsComponent},
        {path: 'tasks', component: AutomationTaskComponent},
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(automationRoutes)
    ],
    exports: [RouterModule]
})
export class AutomationRoutingModule {}
