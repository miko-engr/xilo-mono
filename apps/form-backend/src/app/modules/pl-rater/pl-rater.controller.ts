import { Controller, Get, Param, Post } from '@nestjs/common';
import { PlRaterService } from './pl-rater.service';
@Controller('pl-rater')
export class PlRaterController {
  constructor(private readonly plRaterService: PlRaterService) {}

  @Get('al3/:clientId/:type')
  createAL3File(
    @Param('clientId') clientId: number,
    @Param('type') type: string
  ) {
    return this.plRaterService.createAL3File(clientId, type);
  }
  @Get('groups/:type')
  getAL3Groups(@Param('type') type: string) {
    return this.plRaterService.getAL3Groups(type);
  }
  @Get('elements/:group')
  getAL3Elements(@Param('group') group: string) {
    return this.plRaterService.getAL3Elements(group);
  }
  @Post('defaults/:type/:formId')
  setDefaults(@Param('formId') formId: number, @Param('type') type: string) {
    return this.plRaterService.setDefaults(formId, type);
  }
}
