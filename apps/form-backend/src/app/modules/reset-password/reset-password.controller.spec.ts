import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordController } from './reset-password.controller';
import { AuthService } from '../auth/auth.service';
class mockAuthService {}
describe('ResetPassword Controller', () => {
  let controller: ResetPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordController],
      providers: [
        {
          provide: AuthService,
          useClass: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<ResetPasswordController>(ResetPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
