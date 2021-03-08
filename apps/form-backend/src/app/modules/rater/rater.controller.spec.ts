import { Test, TestingModule } from '@nestjs/testing';
import { RaterController } from './rater.controller';
import { RaterService } from './rater.service';
class mockRaterService {}
describe('Rater Controller', () => {
  let controller: RaterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaterController],
      providers: [
        {
          provide: RaterService,
          useClass: mockRaterService,
        },
      ],
    }).compile();

    controller = await module.resolve<RaterController>(RaterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
