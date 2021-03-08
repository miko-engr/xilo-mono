import { Test, TestingModule } from '@nestjs/testing';
import { AppImageController } from './app-image.controller';
import { AppImageService } from './app-image.service';
class mockAppImageService {}
describe('AppImage Controller', () => {
  let controller: AppImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppImageController],
      providers: [
        {
          provide: AppImageService,
          useClass: mockAppImageService,
        },
      ],
    }).compile();

    controller = await module.resolve<AppImageController>(AppImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
