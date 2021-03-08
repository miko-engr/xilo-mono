import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
describe('Notifications Controller', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService],
    }).compile();

    controller = await module.resolve<NotificationsController>(
      NotificationsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
