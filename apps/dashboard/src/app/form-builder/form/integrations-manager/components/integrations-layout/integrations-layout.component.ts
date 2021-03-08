import { Component, OnInit } from '@angular/core';
import { VendorIntegrationMappingService } from '../../services/vendorIntegrationMapping.service';
import { ActivatedRoute } from '@angular/router';
import { FormViewService } from '@xilo-mono/form-contracts';
import { getArrayOfSectionsAndFlatQuestions } from '@xilo-mono/form-helper';

@Component({
  selector: 'xilo-integrations-manager',
  templateUrl: './integrations-layout.component.html',
  styleUrls: ['./integrations-layout.component.scss']
})
export class IntegrationsLayoutComponent implements OnInit {
  form;
  formFields = [];

  constructor(
    private route: ActivatedRoute,
    private formViewService: FormViewService,
    private vendorIntegrationMappingService: VendorIntegrationMappingService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const formId = params.id;
      // this.getIntegrationMapping(formId);
      this.getFormById(formId);
    });
  }

  onSendJson(event: any) {
    console.log('Event: ', event);
  }

  private getFormById(formId: string): void {
    if (!formId) return;
    this.formViewService.getForm(formId)
      .subscribe((successResponse) => {
        this.form = successResponse;
        this.formFields = getArrayOfSectionsAndFlatQuestions(this.form.components[0].fieldGroup);
      }, (errorResponse) => {
        console.log(errorResponse);
      });
  }

  // deleteIntegrationMapping() {
  //   this.vendorIntegrationMappingService.deleteIntegrationMapping()
  //     .subscribe((res) => {
  //       console.log('Delete Integration Mapping SUCCESS', res);
  //     }, (err) => {
  //       console.error(err);
  //     });
  // }
}
