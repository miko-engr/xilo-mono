import { Test, TestingModule } from '@nestjs/testing';
import { TeamSignupController } from './team-signup.controller';
import { TeamSignupService } from './team-signup.service';
import { FormService } from '../form/form.service';

class mockTeamSignupService {}
class mockFormService {}
describe('TeamSignup Controller', () => {
  let controller: TeamSignupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamSignupController],
      providers: [
        {
          provide: TeamSignupService,
          useClass: mockTeamSignupService,
        },
        {
          provide: FormService,
          useClass: mockFormService,
        },
      ],
    }).compile();

    controller = await module.resolve<TeamSignupController>(
      TeamSignupController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
