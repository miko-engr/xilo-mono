import { Controller, Get, Post } from '@nestjs/common';
import { PartnerXeService } from './partner-xe.service';
@Controller('partner-xe')
export class PartnerXeController {
  constructor(private readonly partnerXeService: PartnerXeService) {}
  @Post('create-clients/:type')
  createFile() {
    return this.partnerXeService.createFile();
  }
}
