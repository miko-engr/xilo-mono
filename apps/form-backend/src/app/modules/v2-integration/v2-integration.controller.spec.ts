import { Test, TestingModule } from '@nestjs/testing';
import { V2IntegrationController } from './v2-integration.controller';
import { V2IntegrationService } from './v2-integration.service';
import { IntegrationService } from '../integration/integration.service';

class mockIntegrationService {}
describe('V2Integration Controller', () => {
  let controller: V2IntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [V2IntegrationController],
      providers: [
        V2IntegrationService,
        {
          provide: IntegrationService,
          useClass: mockIntegrationService,
        },
      ],
    }).compile();

    controller = await module.resolve<V2IntegrationController>(
      V2IntegrationController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
