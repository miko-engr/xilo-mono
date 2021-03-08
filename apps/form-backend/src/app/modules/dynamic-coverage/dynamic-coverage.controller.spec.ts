import { Test, TestingModule } from '@nestjs/testing';
import { DynamicCoverageController } from './dynamic-coverage.controller';
import { DynamicCoverageService } from './dynamic-coverage.service';
class mockDynamicCoverageService {}
describe('DynamicCoverage Controller', () => {
  let controller: DynamicCoverageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicCoverageController],
      providers: [
        {
          provide: DynamicCoverageService,
          useClass: mockDynamicCoverageService,
        },
      ],
    }).compile();

    controller = await module.resolve<DynamicCoverageController>(
      DynamicCoverageController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
