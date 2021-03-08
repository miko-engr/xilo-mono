import { Test, TestingModule } from '@nestjs/testing';
import { NewClientController } from './new-client.controller';
import { BusinessService } from '../business/business.service';
import { LocationService } from '../location/location.service';
import { IncidentService } from '../incident/incident.service';
import { RecreationalVehicleService } from '../recreational-vehicle/recreational-vehicle.service';
import { AgentService } from '../agent/agent.service';
import { ClientService } from '../client/client.service';
import { DriverService } from '../driver/driver.service';
import { HomeService } from '../home/home.service';
import { FormService } from '../form/form.service';
import { DynamicRateService } from '../dynamic-rate/dynamic-rate.service';
import { DynamicCoverageService } from '../dynamic-coverage/dynamic-coverage.service';
import { PageService } from '../page/page.service';
import { PdfService } from '../pdf/pdf.service';
import { CompanyService } from '../company/company.service';
import { EzlynxService } from '../ezlynx/ezlynx.service';
import { UsDotIntegrationService } from '../us-dot-integration/us-dot-integration.service';
class mockBusinessService {}
class mockLocationService {}
class mockIncidentService {}
class mockRecreationalVehicleService {}
class mockAgentService {}
class mockClientService {}
class mockDriverService {}
class mockHomeService {}
class mockFormService {}
class mockDynamicRateService {}
class mockDynamicCoverageService {}
class mockPageService {}
class mockPdfService {}
class mockCompanyService {}
class mockEzlynxService {}
class mockUsDotIntegrationService {}

describe('NewClient Controller', () => {
  let controller: NewClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewClientController],
      providers: [
        {
          provide: BusinessService,
          useClass: mockBusinessService,
        },
        {
          provide: LocationService,
          useClass: mockLocationService,
        },
        {
          provide: IncidentService,
          useClass: mockIncidentService,
        },
        {
          provide: RecreationalVehicleService,
          useClass: mockRecreationalVehicleService,
        },
        {
          provide: AgentService,
          useClass: mockAgentService,
        },
        {
          provide: ClientService,
          useClass: mockClientService,
        },
        {
          provide: DriverService,
          useClass: mockDriverService,
        },
        {
          provide: HomeService,
          useClass: mockHomeService,
        },
        {
          provide: FormService,
          useClass: mockFormService,
        },
        {
          provide: DynamicRateService,
          useClass: mockDynamicRateService,
        },
        {
          provide: DynamicCoverageService,
          useClass: mockDynamicCoverageService,
        },
        {
          provide: PageService,
          useClass: mockPageService,
        },
        {
          provide: PdfService,
          useClass: mockPdfService,
        },
        {
          provide: CompanyService,
          useClass: mockCompanyService,
        },
        {
          provide: EzlynxService,
          useClass: mockEzlynxService,
        },
        {
          provide: UsDotIntegrationService,
          useClass: mockUsDotIntegrationService,
        },
      ],
    }).compile();

    controller = module.get<NewClientController>(NewClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
