import { Controller, Get, Param } from '@nestjs/common';
import { HawksoftService } from './hawksoft.service';
@Controller('hawksoft')
export class HawksoftController {
  constructor(private readonly hawksoftService: HawksoftService) {}

  @Get(':type/:clientId')
  createFile(@Param('clientId') clientId: number, @Param('type') type: string) {
    return this.hawksoftService.createFile(clientId, type);
  }
}
