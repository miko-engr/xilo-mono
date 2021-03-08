import { Test, TestingModule } from '@nestjs/testing';
import { AppulateController } from './appulate.controller';
import { AppulateService } from './appulate.service'

class MockAppulateService {}

describe('Appulate Controller', () => {
  let controller: AppulateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppulateController],
      providers: [
        {
          provide: AppulateService,
          useClass: MockAppulateService
        }
      ]
    }).compile();

    controller = await module.resolve<AppulateController>(AppulateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
