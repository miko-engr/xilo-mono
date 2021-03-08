import { Test, TestingModule } from '@nestjs/testing';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';
class mockConditionService {}
describe('Condition Controller', () => {
  let controller: ConditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionController],
      providers: [
        {
          provide: ConditionService,
          useClass: mockConditionService,
        },
      ],
    }).compile();

    controller = await module.resolve<ConditionController>(ConditionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
