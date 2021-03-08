import { Test, TestingModule } from '@nestjs/testing';
import { ZillowController } from './zillow.controller';
import { ZillowService } from './zillow.service';

describe('Zillow Controller', () => {
  let controller: ZillowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZillowController],
      providers: [ZillowService]
    }).compile();

    controller = await module.resolve<ZillowController>(ZillowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
