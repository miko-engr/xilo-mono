import { Test, TestingModule } from '@nestjs/testing';
import { AppliedController } from './applied.controller';
import { AppliedService } from './applied.service';
class mockAppliedService {}
describe('Applied Controller', () => {
  let controller: AppliedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppliedController],
      providers: [
        {
          provide: AppliedService,
          useClass: mockAppliedService,
        },
      ],
    }).compile();

    controller = await module.resolve<AppliedController>(AppliedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
