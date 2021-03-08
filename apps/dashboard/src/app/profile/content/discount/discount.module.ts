import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {DiscountRoutingModule} from "./discount-routing.module";
import {ContentDiscountComponent} from "./discount.component"
import {NgxLoadingModule} from "ngx-loading";
import {ngfModule} from "angular-file";
import {FilterPipeModule} from "ngx-filter-pipe";
import { SharedModule } from "../../../shared/shared.module";
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DiscountHomeComponent } from './discount-home/discount-home.component';

@NgModule ({
    declarations: [
        ContentDiscountComponent,
        AddComponent,
        EditComponent,
        DiscountHomeComponent
    ],
    imports: [
        CommonModule,
        FilterPipeModule,
        FormsModule,
        NgxLoadingModule,
        ngfModule,
        NgxPaginationModule,
        DiscountRoutingModule,
        ReactiveFormsModule,
        SharedModule

    ]
})

export class DiscountModule {}