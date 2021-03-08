import { Test, TestingModule } from '@nestjs/testing';
import { HubspotController } from './hubspot.controller';
import { HubspotService } from './hubspot.service';
class MockHubspotService {}
describe('Hubspot Controller', () => {
  let controller: HubspotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubspotController],
      providers: [
        {
          provide: HubspotService,
          useClass: MockHubspotService,
        },
      ],
    }).compile();

    controller = await module.resolve<HubspotController>(HubspotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
