import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { FileService } from './file.service';
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.fileService.listOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() fileBody: any) {
    return this.fileService.update(id, fileBody);
  }
  @Post()
  create(@Body() fileBody: any) {
    return this.fileService.create(fileBody);
  }
  @Post('csv')
  createCSVFile(@Body() clientIds: number[]) {
    return this.fileService.createCSVFile(clientIds);
  }
  @Delete(':id')
  deleteFile(@Param('id') id: number) {
    return this.fileService.deleteFile(id);
  }
}
