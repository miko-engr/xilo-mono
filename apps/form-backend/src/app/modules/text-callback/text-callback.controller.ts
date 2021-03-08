import {
  Controller,
  Put,
  Req,
  Res
} from '@nestjs/common';
import { TextCallbackService } from './text-callback.service';
import { Request, Response } from 'express';

@Controller('text-callback')
export class TextCallbackController {
  constructor(private readonly textCallbackService: TextCallbackService) { }

  @Put('/:companyId/message-listner')
  create(@Req() req: Request, @Res() res: Response) {
    return this.textCallbackService.messageListner(req, res);
  }
}
