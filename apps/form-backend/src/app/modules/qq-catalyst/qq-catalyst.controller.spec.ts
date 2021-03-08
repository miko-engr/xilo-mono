import { Test, TestingModule } from '@nestjs/testing';
import { QqCatalystController } from './qq-catalyst.controller';
import { QqCatalystService } from './qq-catalyst.service';
class mockQqCatalystService {}
describe('QqCatalyst Controller', () => {
  let controller: QqCatalystController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QqCatalystController],
      providers: [
        {
          provide: QqCatalystService,
          useClass: mockQqCatalystService,
        },
      ],
    }).compile();

    controller = await module.resolve<QqCatalystController>(
      QqCatalystController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
