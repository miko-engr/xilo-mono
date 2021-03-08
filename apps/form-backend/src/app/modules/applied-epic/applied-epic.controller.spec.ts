import { Test, TestingModule } from '@nestjs/testing';
import { AppliedEpicController } from './applied-epic.controller';
import { AppliedEpicService } from './applied-epic.service';
class mockAppliedEpicService {}
describe('AppliedEpic Controller', () => {
  let controller: AppliedEpicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppliedEpicController],
      providers: [
        {
          provide: AppliedEpicService,
          useClass: mockAppliedEpicService,
        },
      ],
    }).compile();

    controller = await module.resolve<AppliedEpicController>(
      AppliedEpicController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
