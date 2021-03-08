import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AddIntegrationDropdownComponent,
  IntegrationsLayoutComponent,
  QuestionDropdownComponent,
  QuestionSearchBoxComponent,
  VendorInputFieldComponent,
  VendorIntegrationMappingFieldsComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: IntegrationsLayoutComponent,
    children: [
      { path: 'searchbox', component: QuestionSearchBoxComponent, outlet: 'questionSearchBox' },
      { path: 'dropdown', component: QuestionDropdownComponent, outlet: 'questionDropdown' },
      // { path: 'tree', component: QuestionTreeComponent, outlet: 'questionTree' },
      {
        path: 'add-integration-dropdown',
        component: AddIntegrationDropdownComponent,
        outlet: 'addIntegrationDropdown'
      },
      {
        path: 'vendor-integration-mapping-fields',
        component: VendorIntegrationMappingFieldsComponent,
        outlet: 'companyInfo',
        children: [
          { path: 'vendor-input-field', component: VendorInputFieldComponent, outlet: 'inputField' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsManagerRoutingModule {
}
