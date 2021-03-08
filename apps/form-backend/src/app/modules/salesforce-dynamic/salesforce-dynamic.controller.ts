import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SalesforceDynamicService } from './salesforce-dynamic.service';
@Controller('salesforce-dynamic')
export class SalesforceDynamicController {
  constructor(
    private readonly salesforceDynamicService: SalesforceDynamicService
  ) {}
  @Get()
  handleGetReq() {
    return this.salesforceDynamicService.handleGetReq();
  }
  @Post()
  handlePostReq() {
    return this.salesforceDynamicService.handlePostReq();
  }
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('fileName'))
  addPdfForm(@UploadedFile() file) {
    return this.salesforceDynamicService.uploadFile(file);
  }
}
