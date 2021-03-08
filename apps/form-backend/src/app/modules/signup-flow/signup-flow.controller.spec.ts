import { Test, TestingModule } from '@nestjs/testing';
import { SignupFlowController } from './signup-flow.controller';
import { SignupFlowService } from './signup-flow.service';
class mockSignupFlowService {}
describe('SignupFlow Controller', () => {
  let controller: SignupFlowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupFlowController],
      providers: [
        {
          provide: SignupFlowService,
          useClass: mockSignupFlowService,
        },
      ],
    }).compile();

    controller = await module.resolve<SignupFlowController>(
      SignupFlowController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
