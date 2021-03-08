import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DocuSignService } from './docu-sign.service';
@Controller('docu-sign')
export class DocuSignController {
  constructor(private readonly docuSignService: DocuSignService) {}
  @Post('create-contract')
  createContract(@Body('email') email: string) {
    return this.docuSignService.createContract(email);
  }
  @Get('sign/:encodedEmail/:redirectUri')
  docuSignDocument(
    @Param('encodedEmail') encodedEmail: string,
    @Param('redirectUri') redirectUri: string
  ) {
    return this.docuSignService.docuSignDocument(encodedEmail, redirectUri);
  }
  @Get('signed-by/:email')
  docuSignByDocument(@Param('email') email: string) {
    return this.docuSignService.docuSignByDocument(email);
  }
}
