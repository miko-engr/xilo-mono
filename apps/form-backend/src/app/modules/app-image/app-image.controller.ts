import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { AppImageService } from './app-image.service';
import { CreateAppImageDto } from './dto/create-app-image.dto';
@Controller('app-image')
export class AppImageController {
  constructor(private readonly appImageService: AppImageService) {}
  @Get()
  list() {
    return this.appImageService.list();
  }
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.appImageService.listOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() appImageBody: CreateAppImageDto) {
    return this.appImageService.update(id, appImageBody);
  }
  @Post()
  create(@Body() appImageBody: CreateAppImageDto) {
    return this.appImageService.create(appImageBody);
  }
  @Post('bulk')
  bulkCreate() {
    return this.appImageService.bulkCreate();
  }
  @Delete(':id')
  deleteAppImage(@Param('id') id: number) {
    return this.appImageService.deleteAppImage(id);
  }
}
