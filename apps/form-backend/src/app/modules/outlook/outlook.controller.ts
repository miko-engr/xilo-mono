import { Controller, Get } from '@nestjs/common';
import { OutlookService } from './outlook.service';
@Controller('outlook')
export class OutlookController {
  constructor(private readonly outlookService: OutlookService) {}
  @Get('auth/url')
  getOutLookAuthUrl() {
    return this.outlookService.getOutLookAuthUrl();
  }
  @Get('auth')
  handleAuthGrant() {
    return this.outlookService.handleAuthGrant();
  }
}
