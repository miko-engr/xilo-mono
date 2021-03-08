import { Controller, Get, Put, Param, Req, Res } from '@nestjs/common';
import { Ams360Service } from './ams360.service';
import { Request, Response } from 'express';
@Controller('ams360')
export class Ams360Controller {
  constructor(private readonly ams360Service: Ams360Service) {}

  @Get('/create-files/:clientId/:type')
  createFile(@Param('clientId') clientId: number, @Param('type') type: string) {
    return this.ams360Service.createFile(clientId, type);
  }

  @Put('/update-customer/:clientId')
  createContact(@Req() req: Request, @Res() res: Response) {
    return this.ams360Service.createContact(req, res);
  }

  @Get('list-details')
  listDetails() {
    return this.ams360Service.listDetails();
  }
}
