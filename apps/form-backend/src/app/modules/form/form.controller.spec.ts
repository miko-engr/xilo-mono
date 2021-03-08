import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from './form.service';
class mockFormService {}
describe('Form Controller', () => {
  let controller: FormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        {
          provide: FormService,
          useClass: mockFormService,
        },
      ],
    }).compile();

    controller = await module.resolve<FormController>(FormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
