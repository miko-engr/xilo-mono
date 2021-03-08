import { Test, TestingModule } from '@nestjs/testing';
import { AgencySoftwareController } from './agency-software.controller';
import { AgencySoftwareService } from './agency-software.service';
class mockAgencySoftwareService {}
describe('AgencySoftware Controller', () => {
  let controller: AgencySoftwareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencySoftwareController],
      providers: [
        {
          provide: AgencySoftwareService,
          useClass: mockAgencySoftwareService,
        },
      ],
    }).compile();

    controller = await module.resolve<AgencySoftwareController>(
      AgencySoftwareController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
