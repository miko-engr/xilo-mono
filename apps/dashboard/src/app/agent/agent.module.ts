import {NgModule} from "@angular/core";
import {AgentProfileComponent} from './profile/profile.component';
import { AgentComponent } from './agent.component';
import { AgentRoutingModule } from './agent-routing.module';
import {CommonModule} from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { NgxLoadingModule
 } from "ngx-loading";
import { FilterPipeModule } from "ngx-filter-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { LoaderModalService } from '../services/loader-modal.service';


@NgModule({
    declarations:[
        AgentProfileComponent,
        AgentComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
        AgentRoutingModule,
        FilterPipeModule,
        NgxPaginationModule,
        SharedModule,
        NgxLoadingModule,
    ],
    providers: [
        LoaderModalService
    ]
})

export class AgentModule { }