import { Controller, Post } from '@nestjs/common';
import { RicochetService } from './ricochet.service';
@Controller('ricochet')
export class RicochetController {
  constructor(private readonly ricochetService: RicochetService) {}
  @Post('upsert/:clientId')
  createContact() {
    return this.ricochetService.createContact();
  }
}
