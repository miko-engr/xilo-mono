import { Test, TestingModule } from '@nestjs/testing';
import { ParameterController } from './parameter.controller';
import { ParameterService } from './parameter.service';
class mockParameterService {}
describe('Parameter Controller', () => {
  let controller: ParameterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParameterController],
      providers: [
        {
          provide: ParameterService,
          useClass: mockParameterService,
        },
      ],
    }).compile();

    controller = await module.resolve<ParameterController>(ParameterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
