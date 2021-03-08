import { Component, Input, OnInit } from '@angular/core';
import { VendorSchemaService } from '../../services/vendorSchema.service';
import { IntegrationMapping } from '../../models/integrationMapping.model';
import { ToastService } from '../../../../../services/toast.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { VendorIntegrationMappingService } from '../../services/vendorIntegrationMapping.service';

@Component({
  selector: 'vendor-integration-mapping-fields',
  templateUrl: './vendor-integration-mapping-fields.component.html',
  styleUrls: ['./vendor-integration-mapping-fields.component.scss']
})
export class VendorIntegrationMappingFieldsComponent implements OnInit {
  @Input() form = null;
  @Input() formFields;
  enable = true;

  company: { logo: string, name: string, description: string };
  fields: any[] = [];

  // TODO: remove once done with debugging
  showVendorSchema: boolean = false;
  showVendorIntegrationMapping: boolean = false;
  showFields: boolean = false;
  fieldGroups: any[];
  integrationMappings: IntegrationMapping[] = [];
  integrationMappingSubscription: Subscription;
  
  constructor(
    private toastService: ToastService,
    private vendorIntegrationMappingService: VendorIntegrationMappingService, 
    private vendorSchemaService: VendorSchemaService
    ) {
  }

  ngOnInit(): void {
    this.getVendorCompanyData();
    this.integrationMappingSubscription = this.vendorIntegrationMappingService.integrationMapping$
    .subscribe((integrationMapping) => {
      if (integrationMapping) {
        const imIndex = this.integrationMappings.findIndex(im => im.id === integrationMapping.id);
        if (imIndex > -1) {
          this.integrationMappings[imIndex] = integrationMapping;
        } else {
          this.integrationMappings.push(integrationMapping);
        }
      }
    }, error => {
      console.log(error);
    })
    // this.convertVendorSchemaToFormFields();
  }

  ngOnDestroy() {
    this.integrationMappingSubscription.unsubscribe();
  }

  getVendorCompanyData() {
    this.vendorSchemaService.getIntegrationMappingsAndVendorSchema()
    .subscribe((integrationMappings: IntegrationMapping[]) => {
      this.integrationMappings = integrationMappings;
      // if (this.integrationMappings.length === 0) {
      //   this.vendorIntegrationMappingService.createIntegrationMapping()
      //   .subscribe(integrationMapping => {
      //   }, error => {
      //     console.log(error);
      //   })
      // }
    }, error => {
      this.toastService.showError('Issue retrieving vendors');
    })
    // this.company = this.vendorSchemaService.getCompanyData();
  }
}
