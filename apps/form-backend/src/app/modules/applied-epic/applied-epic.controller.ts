import { Controller, Get, Param } from '@nestjs/common';
import { AppliedEpicService } from './applied-epic.service';
@Controller('applied-epic')
export class AppliedEpicController {
  constructor(private readonly appliedEpicService: AppliedEpicService) {}
  @Get(':type/:clientId')
  createFile(@Param('type') type: string, @Param('clientId') clientId: number) {
    return this.appliedEpicService.createFile(clientId, type);
  }
}
