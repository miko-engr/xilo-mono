import { Controller, Get, Req, Res } from '@nestjs/common';
import { QuoteRushService } from './quote-rush.service';
import { Request, Response } from 'express';

@Controller('quote-rush')
export class QuoteRushController {
  constructor(private readonly quoterushService: QuoteRushService) {}

  @Get('upsert/:type/:clientId')
  createContact(@Req() req: Request, @Res() res: Response) {
    return this.quoterushService.createContact(req, res);
  }
}
