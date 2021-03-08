import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly authService: AuthService) {}
  @Get('verify-user')
  verifyUser(@Query('token') token: string) {
    return this.authService.verifyUser(token);
  }

  @Get('verify-agent')
  verifyAgent(@Query('token') token: string) {
    return this.authService.verifyAgent(token);
  }

  @Post('update-user')
  updateUserPassword(@Body() userBody: any) {
    return this.authService.updateUserPassword(userBody);
  }

  @Post('update-user')
  updateAgentPassword(@Body() userBody: any) {
    return this.authService.updateAgentPassword(userBody);
  }
}
