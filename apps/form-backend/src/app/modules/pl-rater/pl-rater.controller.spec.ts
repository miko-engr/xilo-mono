import { Test, TestingModule } from '@nestjs/testing';
import { PlRaterController } from './pl-rater.controller';
import { PlRaterService } from './pl-rater.service';
class mockPlRaterService {}
describe('PlRater Controller', () => {
  let controller: PlRaterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlRaterController],
      providers: [
        {
          provide: PlRaterService,
          useClass: mockPlRaterService,
        },
      ],
    }).compile();

    controller = await module.resolve<PlRaterController>(PlRaterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
