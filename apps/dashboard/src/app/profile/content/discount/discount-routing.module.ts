import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { ContentDiscountComponent } from "./discount.component"
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DiscountHomeComponent } from './discount-home/discount-home.component';

const discountRoutes: Routes = [
    { path: '', component: ContentDiscountComponent, children: [
        { path: '', redirectTo: 'discount-home', pathMatch: 'full',},
        { path: 'discount-home', component: DiscountHomeComponent},
        { path: 'add', component: AddComponent},
        { path: 'edit/:id', component: EditComponent},
    ]}
]

@NgModule({
    imports: [
        RouterModule.forChild(discountRoutes)
    ],
    exports: [RouterModule]
})
export class DiscountRoutingModule {}