import {
  Controller,
  Put,
  Req
} from '@nestjs/common';
import { NowCertsService } from './now-certs.service';
import { Request } from 'express';

@Controller('now-certs')
export class NowCertsController {
  constructor(private readonly nowCertsService: NowCertsService) { }

  @Put('/upsert/:clientId')
  create(@Req() req: Request) {
    return this.nowCertsService.createContact(req);
  }
}
