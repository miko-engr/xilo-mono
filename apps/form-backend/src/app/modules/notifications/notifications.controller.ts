import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post('trigger-courier')
  handleSendNotification(@Body() notificatioBody: any) {
    return this.notificationService.handleSendNotification(notificatioBody);
  }
  @Post('create-courier-profile')
  handlecreateCourierProfileIfNotExists(@Body() notificatioBody: any) {
    return this.notificationService.handlecreateCourierProfileIfNotExists(
      notificatioBody
    );
  }
  @Post('update-courier-profile')
  handleUpdateCourierProfile(@Body() notificatioBody: any) {
    return this.notificationService.handleUpdateCourierProfile(notificatioBody);
  }
}
