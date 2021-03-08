import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgxLoadingModule
} from "ngx-loading";
import { SharedModule } from "../../shared/shared.module";
import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationEmailsComponent } from './emails/emails.component';
import { AutomationTextsComponent } from './texts/texts.component';
import { AutomationComponent } from './automation.component';
import { AutomationFlowsComponent } from './flows/flows.component';
import { AutomationFlowsListComponent } from './flows/list/list.component';
import { AutomationFlowsAddComponent } from './flows/add/add.component';
import { AutomationFlowsEditComponent } from './flows/edit/edit.component';
import { AutomationTaskComponent } from './task/task.component';


@NgModule({
    declarations: [
        AutomationComponent,
        AutomationFlowsComponent,
        AutomationFlowsListComponent,
        AutomationFlowsAddComponent,
        AutomationFlowsEditComponent,
        AutomationTextsComponent,
        AutomationEmailsComponent,
        AutomationTaskComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxLoadingModule,
        AutomationRoutingModule,
        SharedModule
    ]
})
export class AutomationModule {}
