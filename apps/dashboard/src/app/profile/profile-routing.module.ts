import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './profile.component';
import {CarrierComponent} from './carrier/carrier.component';
import {TeamComponent} from './team/team.component';
import {TrackingComponent} from './tracking/tracking.component';
import { TeamUserComponent } from './team/users/user.component';
import { TeamAgentComponent } from './team/agents/agent.component';
import { ClientTableComponent } from '../shared/client-table/client-table.component';
import { LifecyclesComponent } from './tracking/lifecycles/lifecycles.component';
import { FormBuilderComponent } from './content/forms/form-builder/form-builder.component';
import { PdfBuilderComponent } from './content/pdfs/pdf-builder/pdf-builder.component';
import { AuthCanLoadGuard } from '../guards/authCanLoad.guard';
import { FeatureFlagCanLoadGuard } from '../guards/featureFlagCanLoad.guard';
import { AuthGuard } from '../guards/auth.guard';
import { FeatureFlagCanActivateGuard } from '../guards/featureFlagCanActivate.guard';

const profileRoutes: Routes = [
    { path: '', component: ProfileComponent, children: [
        { path: 'carriers', component: CarrierComponent},
        { path: 'team', component: TeamComponent, children: [
            { path: '', redirectTo: 'users', pathMatch: 'full'},
            { path: 'users', component: TeamUserComponent },
            { path: 'agents', component: TeamAgentComponent },
        ]},
        { 
            path: 'forms-list', 
            canLoad: [AuthCanLoadGuard, FeatureFlagCanLoadGuard],
            canActivate: [AuthGuard, FeatureFlagCanActivateGuard],
            data: { flags: 'formBuilder' },
            loadChildren: () => import('../forms-list/forms-list.module').then(m => m.FormsListModule)
        },
        { path: 'forms', loadChildren: () => import('./content/content.module').then(m => m.ContentModule) },
        { path: 'business', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule)},
        { path: 'prospects', children: [
            {path: '',  component: ClientTableComponent},
            {path: 'view/:id',  loadChildren: () => import('../shared/view-client/view-client.module').then(m => m.ClientViewModule)}
        ]},
        // { path: 'payment', component: PaymentComponent},
        { path: 'tracking', component: TrackingComponent, children: [
            { path: '', redirectTo: 'lifecycles', pathMatch: 'full'},
            { path: 'lifecycles', component: LifecyclesComponent },
        ]},
        { path: 'automation', loadChildren: () => import('./automation/automation.module').then(m => m.AutomationModule)},
        { path: 'analytics', loadChildren: () => import('./analyticsv2/analyticsv2.module').then(m => m.AnalyticsV2Module)},
    ]},
    {
        path: 'builder', children: [
            { path: 'pdf/:id', component: PdfBuilderComponent },
            { path: 'form/:id', component: FormBuilderComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(profileRoutes)
    ],
    exports: [RouterModule]
})
export class ProfileRoutingModule {
}
