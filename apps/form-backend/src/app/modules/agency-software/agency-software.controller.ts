import { Controller, Body, Post } from '@nestjs/common';
import { AgencySoftwareService } from './agency-software.service';
@Controller('agency-software')
export class AgencySoftwareController {
  constructor(private readonly agencySoftwareService: AgencySoftwareService) {}
  @Post('')
  create(@Body('clientIds') clientIds: number[]) {
    return this.agencySoftwareService.createFile(clientIds);
  }
}
