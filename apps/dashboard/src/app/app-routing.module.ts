import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {UnknownComponent} from './unknown.component';
import {AuthGuard} from './guards/auth.guard';
import { FeatureFlagCanActivateGuard } from './guards/featureFlagCanActivate.guard';
import { FeatureFlagCanLoadGuard } from './guards/featureFlagCanLoad.guard';
import { AuthCanLoadGuard } from './guards/authCanLoad.guard';

const appRoutes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full'},
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
    { path: 'agent', loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule)},
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),  canActivate: [AuthGuard]},
    { path: 'team-signup', loadChildren: () => import('./team-signup/team-signup.module').then(m => m.TeamSignupModule)},
    { 
        path: 'support', 
        canLoad: [AuthCanLoadGuard],
        canActivate: [AuthGuard],
        loadChildren: () => import('./support/support.module').then(m => m.SupportModule)
    },
    { 
        path: 'form-builder', 
        canLoad: [AuthCanLoadGuard, FeatureFlagCanLoadGuard],
        canActivate: [AuthGuard, FeatureFlagCanActivateGuard],
        data: { flags: 'formBuilder' },
        loadChildren: () => import('./form-builder/form-builder.module').then(m => m.FormBuilderMainModule)
    },
    { 
        path: 'new-form', 
        canLoad: [AuthCanLoadGuard, FeatureFlagCanLoadGuard],
        canActivate: [AuthGuard, FeatureFlagCanActivateGuard],
        data: { flags: 'formBuilder' },
        loadChildren: () => import('./form-wizard/form-wizard.module').then(m => m.FormWizardModule)
    },
    { path: 'unknown', component: UnknownComponent, pathMatch: 'full'},
    { path: '**', redirectTo: 'unknown'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules, anchorScrolling: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
