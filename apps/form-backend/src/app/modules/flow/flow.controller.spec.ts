import { Test, TestingModule } from '@nestjs/testing';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';
class mockFlowService {}
describe('Flow Controller', () => {
  let controller: FlowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowController],
      providers: [
        {
          provide: FlowService,
          useClass: mockFlowService,
        },
      ],
    }).compile();

    controller = module.get<FlowController>(FlowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
