import { Test, TestingModule } from '@nestjs/testing';
import { DynamicRateController } from './dynamic-rate.controller';
import { DynamicRateService } from './dynamic-rate.service';
class mockDynamicRateService {}
describe('DynamicRate Controller', () => {
  let controller: DynamicRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicRateController],
      providers: [
        {
          provide: DynamicRateService,
          useClass: mockDynamicRateService,
        },
      ],
    }).compile();

    controller = await module.resolve<DynamicRateController>(
      DynamicRateController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
