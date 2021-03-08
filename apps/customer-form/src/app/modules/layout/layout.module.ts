import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { CompanyService } from './services/company.service';
import { FormBuilderService } from '@xilo-mono/form-contracts';

@NgModule({
  declarations: [HeaderComponent, LayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, HttpClientModule],
  providers: [CompanyService, FormBuilderService]
})
export class LayoutModule {}
