import { Test, TestingModule } from '@nestjs/testing';
import { OutlookController } from './outlook.controller';
import { OutlookService } from './outlook.service';
class mockOutlookService {}
describe('Outlook Controller', () => {
  let controller: OutlookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutlookController],
      providers: [
        {
          provide: OutlookService,
          useClass: mockOutlookService,
        },
      ],
    }).compile();

    controller = module.get<OutlookController>(OutlookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
