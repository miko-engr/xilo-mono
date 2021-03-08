import { Test, TestingModule } from '@nestjs/testing';
import { DynamicParameterController } from './dynamic-parameter.controller';
import { DynamicParameterService } from './dynamic-parameter.service';
class mockDynamicParameterService {}
describe('DynamicParameter Controller', () => {
  let controller: DynamicParameterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicParameterController],
      providers: [
        {
          provide: DynamicParameterService,
          useClass: mockDynamicParameterService,
        },
      ],
    }).compile();

    controller = await module.resolve<DynamicParameterController>(
      DynamicParameterController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
