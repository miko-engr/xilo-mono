import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { PdfService } from './pdf.service';
import { AuthGuard } from "../../guards/auth.guard"

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) { }

  @Post('form')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('fileName'))
  addPdfForm(@UploadedFile() file, @Body() body: CreatePdfDto) {
    return this.pdfService.addPdfForm(file, body);
  }
  @Get()
  @UseGuards(AuthGuard)
  getPdfList() {
    return this.pdfService.getPdfList();
  }
  @Get(':id')
  getFormFields(@Param('id') id: number) {
    return this.pdfService.getFormFields(id);
  }

  @Post('update-fields')
  updateFormFields(@Body() pdfBody: CreatePdfDto) {
    return this.pdfService.updateFormFields(pdfBody);
  }
  @Post('filled-form')
  filledForm() {
    return this.pdfService.filledForm();
  }

  @Post('generic-pdf')
  genericPdf() {
    return this.pdfService.genericPdf();
  }
  @Post('filled-form-default')
  fillDefault() {
    return this.pdfService.fillDefault();
  }

  @Delete(':id')
  removePdfForm(@Param('id') id: number) {
    return this.pdfService.removePdfForm(id);
  }
}
