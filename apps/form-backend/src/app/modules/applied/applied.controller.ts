import { Controller, Get, Param } from '@nestjs/common';
import { AppliedService } from './applied.service';
@Controller('applied')
export class AppliedController {
  constructor(private readonly appliedService: AppliedService) {}

  @Get(':clientId')
  createFile(@Param('clientId') clientId: number) {
    return this.appliedService.createFile(clientId);
  }
}
