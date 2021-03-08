import { Test, TestingModule } from '@nestjs/testing';
import { Analyticsv2Controller } from './analyticsv2.controller';
import { Analyticsv2Service } from './analyticsv2.service';
class mockAnalyticsv2Service {}
describe('Analyticsv2 Controller', () => {
  let controller: Analyticsv2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Analyticsv2Controller],
      providers: [
        {
          provide: Analyticsv2Service,
          useClass: mockAnalyticsv2Service,
        },
      ],
    }).compile();

    controller = await module.resolve<Analyticsv2Controller>(
      Analyticsv2Controller
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
