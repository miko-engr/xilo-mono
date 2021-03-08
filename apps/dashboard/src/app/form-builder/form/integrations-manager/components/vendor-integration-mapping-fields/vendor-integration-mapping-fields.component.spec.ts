import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorIntegrationMappingFieldsComponent } from './vendor-integration-mapping-fields.component';
import { AccordionConfig, AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MockComponent } from 'ng-mocks';
import { QuestionSearchBoxComponent } from '../question-search-box';
import { VendorInputFieldComponent } from '../vendor-input-field';
import { VendorSchemaService } from '../../services/vendorSchema.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('VendorIntegrationMappingFieldsComponent', () => {

  let component: VendorIntegrationMappingFieldsComponent;
  let fixture: ComponentFixture<VendorIntegrationMappingFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AccordionModule, NgxUIModule, UiSwitchModule, HttpClientTestingModule, NoopAnimationsModule],
      declarations: [
        VendorIntegrationMappingFieldsComponent,
        MockComponent(QuestionSearchBoxComponent),
        MockComponent(VendorInputFieldComponent)
      ],
      providers: [
        VendorSchemaService,
        AccordionConfig
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorIntegrationMappingFieldsComponent);
    component = fixture.componentInstance;

    component.company = {
      name: 'TEST NAME',
      logo: 'TEST LOGO',
      description: 'TEST DESCRIPTION'
    };

    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });

});
