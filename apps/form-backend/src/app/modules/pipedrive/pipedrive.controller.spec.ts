import { Test, TestingModule } from '@nestjs/testing';
import { PipedriveController } from './pipedrive.controller';
import { PipedriveService } from './pipedrive.service';
class mockPipedriveService {}
describe('Pipedrive Controller', () => {
  let controller: PipedriveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipedriveController],
      providers: [
        {
          provide: PipedriveService,
          useClass: mockPipedriveService,
        },
      ],
    }).compile();

    controller = await module.resolve<PipedriveController>(PipedriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
