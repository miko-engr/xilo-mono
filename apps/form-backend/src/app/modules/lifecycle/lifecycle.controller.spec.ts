import { Test, TestingModule } from '@nestjs/testing';
import { LifecycleController } from './lifecycle.controller';
import { LifecycleService } from './lifecycle.service';
class mockLifecycleService {}
describe('Lifecycle Controller', () => {
  let controller: LifecycleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifecycleController],
      providers: [
        {
          provide: LifecycleService,
          useClass: mockLifecycleService,
        },
      ],
    }).compile();

    controller = await module.resolve<LifecycleController>(LifecycleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
