import { Test, TestingModule } from '@nestjs/testing';
import { LifecycleAnalyticsController } from './lifecycle-analytics.controller';
import { LifecycleAnalyticsService } from './lifecycle-analytics.service';
class mockLifecycleAnalyticsService {}
describe('LifecycleAnalytics Controller', () => {
  let controller: LifecycleAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifecycleAnalyticsController],
      providers: [
        {
          provide: LifecycleAnalyticsService,
          useClass: mockLifecycleAnalyticsService,
        },
      ],
    }).compile();

    controller = await module.resolve<LifecycleAnalyticsController>(
      LifecycleAnalyticsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
