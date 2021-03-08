import { Test, TestingModule } from '@nestjs/testing';
import { DynamicRateConditionController } from './dynamic-rate-condition.controller';
import { DynamicRateConditionService } from './dynamic-rate-condition.service';
class mockDynamicRateConditionService {}
describe('DynamicRateCondition Controller', () => {
  let controller: DynamicRateConditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicRateConditionController],
      providers: [
        {
          provide: DynamicRateConditionService,
          useClass: mockDynamicRateConditionService,
        },
      ],
    }).compile();

    controller = await module.resolve<DynamicRateConditionController>(
      DynamicRateConditionController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
