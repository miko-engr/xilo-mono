import { Controller, Post } from '@nestjs/common';
import { ZillowService } from './zillow.service';
@Controller('zillow')
export class ZillowController {
  constructor(private readonly zillowService: ZillowService) {}
  @Post('get-deep-results')
  listZillowData() {
    return this.zillowService.listZillowData();
  }
}
