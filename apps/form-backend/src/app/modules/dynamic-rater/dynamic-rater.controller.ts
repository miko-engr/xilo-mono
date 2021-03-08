import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Query,
  Delete,
} from '@nestjs/common';
import { DynamicRaterService } from './dynamic-rater.service';
import { CreateDynamicRaterDto } from './dto/create-dynamic-rater.dto';
@Controller('dynamic-rater')
export class DynamicRaterController {
  constructor(private readonly dynamicRaterService: DynamicRaterService) {}
  @Get()
  list() {
    return this.dynamicRaterService.list();
  }
  @Get('get-by-company')
  listByCompany() {
    return this.dynamicRaterService.listByCompany();
  }
  @Get('company/:id')
  listByCompanyAndForm(@Param('id') id: number) {
    return this.dynamicRaterService.listByCompanyAndForm(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dynamicRaterBody: CreateDynamicRaterDto
  ) {
    return this.dynamicRaterService.update(id, dynamicRaterBody);
  }

  @Post()
  create(@Body() dynamicRaterBody: CreateDynamicRaterDto) {
    return this.dynamicRaterService.create(dynamicRaterBody);
  }
  @Post('default/:id')
  createDefaultHomeRater(@Param('id') id: number) {
    return this.dynamicRaterService.createDefaultHomeRater(id);
  }

  @Post('duplicate')
  duplicate(
    @Query('token') token: string,
    @Body() dynamicRaterBody: CreateDynamicRaterDto
  ) {
    return this.dynamicRaterService.duplicate(token, dynamicRaterBody);
  }

  @Post('template')
  createByTemplate(@Body() dynamicRaterBody: CreateDynamicRaterDto) {
    return this.dynamicRaterService.createByTemplate(dynamicRaterBody);
  }
  @Post('default')
  createByDefault() {
    return this.dynamicRaterService.createByDefault();
  }
  @Delete(':id')
  deleteRater(@Param('id') id: number) {
    return this.dynamicRaterService.deleteRater(id);
  }
}
