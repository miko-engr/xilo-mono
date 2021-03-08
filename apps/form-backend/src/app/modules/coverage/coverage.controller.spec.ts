import { Test, TestingModule } from '@nestjs/testing';
import { CoverageController } from './coverage.controller';
import { CoverageService } from './coverage.service';
class mockCoverageService {}
describe('Coverage Controller', () => {
  let controller: CoverageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoverageController],
      providers: [
        {
          provide: CoverageService,
          useClass: mockCoverageService,
        },
      ],
    }).compile();

    controller = await module.resolve<CoverageController>(CoverageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
