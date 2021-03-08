import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../../services/toast.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { VendorIntegrationMappingService } from '../../services/vendorIntegrationMapping.service';
import { VendorSchemaService } from '../../services/vendorSchema.service';

@Component({
  selector: 'app-form-builder-component-add-integration-dropdown',
  templateUrl: './add-integration-dropdown.component.html',
  styleUrls: ['./add-integration-dropdown.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class AddIntegrationDropdownComponent implements OnInit {
  vendors$ = this.vendorSchemaService.getVendorsList();

  constructor(
    private integrationMappingService: VendorIntegrationMappingService,
    private toastService: ToastService,
    private vendorSchemaService: VendorSchemaService
  ) {}

  ngOnInit(): void {}

  addVendor(vendor: any) {
    this.integrationMappingService.createIntegrationMapping(vendor.id).subscribe(
      (res) => {
        console.log(res);
        this.toastService.showSuccess(`${vendor.name} added`);
      },
      (error) => {
        this.toastService.showError('Trouble adding vendor');
        console.log(error);
      }
    );
  }
}
