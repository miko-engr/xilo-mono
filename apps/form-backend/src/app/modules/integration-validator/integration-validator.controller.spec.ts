import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationValidatorController } from './integration-validator.controller';
import { FormService } from '../form/form.service';
import { ClientService } from '../client/client.service';

class mockFormService {}
class MockClientService {}
describe('IntegrationValidator Controller', () => {
  let controller: IntegrationValidatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationValidatorController],
      providers: [
        {
          provide: FormService,
          useClass: mockFormService,
        },
        {
          provide: ClientService,
          useClass: MockClientService
        }
      ],
    }).compile();

    controller = await module.resolve<IntegrationValidatorController>(
      IntegrationValidatorController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
