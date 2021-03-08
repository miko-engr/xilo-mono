import { Test, TestingModule } from '@nestjs/testing';
import { DynamicRaterController } from './dynamic-rater.controller';
import { DynamicRaterService } from './dynamic-rater.service';
class mockDynamicRaterService {}
describe('DynamicRater Controller', () => {
  let controller: DynamicRaterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicRaterController],
      providers: [
        {
          provide: DynamicRaterService,
          useClass: mockDynamicRaterService,
        },
      ],
    }).compile();

    controller = await module.resolve<DynamicRaterController>(
      DynamicRaterController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
