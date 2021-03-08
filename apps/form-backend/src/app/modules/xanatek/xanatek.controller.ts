import { Controller, Get, Param } from '@nestjs/common';
import { XanatekService } from './xanatek.service';
@Controller('xanatek')
export class XanatekController {
  constructor(private readonly xanatekService: XanatekService) {}
  @Get(':type/:clientId')
  createFile(@Param('clientId') clientId: number) {
    return this.xanatekService.createFile(clientId);
  }
}
