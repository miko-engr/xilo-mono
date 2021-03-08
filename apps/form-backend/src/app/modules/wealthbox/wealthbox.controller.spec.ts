import { Test, TestingModule } from '@nestjs/testing';
import { WealthboxController } from './wealthbox.controller';
import { WealthboxService } from './wealthbox.service';

class mockWealthboxService {}
describe('Wealthbox Controller', () => {
  let controller: WealthboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WealthboxController],
      providers: [
        {
          provide: WealthboxService,
          useClass: mockWealthboxService,
        }
      ]
    }).compile();

    controller = await module.resolve<WealthboxController>(WealthboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
