import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { TemplateService } from './template.service';
import { TemplateDto } from './dto/template.dto';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  create(@Body() bodyObj: TemplateDto) {
    return this.templateService.create(bodyObj);
  }

  @Patch('/edit/:id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() bodyObj: TemplateDto) {
    return this.templateService.update(id, bodyObj);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.templateService.delete(id);
  }

  @Get('/type/:type')
  @UseGuards(AuthGuard)
  listByCompany(@Param('type') type: string) {
    return this.templateService.listByCompany(type);
  }

  @Get('/company/:id')
  @UseGuards(AuthGuard)
  listByCompanyAllTemplate() {
    return this.templateService.listByCompanyAllTemplate();
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  listOneById(@Param('id') id: number) {
    return this.templateService.listOneById(id);
  }
}
