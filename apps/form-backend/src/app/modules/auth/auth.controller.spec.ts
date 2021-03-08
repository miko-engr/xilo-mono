import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NotificationsService } from '../notifications/notifications.service';
class mockAuthService {}
class mockNotificationsService {}
describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: mockAuthService,
        },
        {
          provide: NotificationsService,
          useClass: mockNotificationsService,
        },
      ],
    }).compile();

    controller = await module.resolve<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
