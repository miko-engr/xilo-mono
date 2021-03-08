import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { DynamicParameterService } from './dynamic-parameter.service';
import { CreateDynamicParameterDto } from './dto/create-dynamic-parameter.dto';
@Controller('dynamic-parameter')
export class DynamicParameterController {
  constructor(
    private readonly dynamicParameterService: DynamicParameterService
  ) {}
  @Get('company')
  listByCompany() {
    return this.dynamicParameterService.listByCompany();
  }

  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.dynamicParameterService.listOne(id);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dynamicParameterBody: CreateDynamicParameterDto
  ) {
    return this.dynamicParameterService.update(id, dynamicParameterBody);
  }

  @Post()
  create(@Body() dynamicParameterBody: CreateDynamicParameterDto) {
    return this.dynamicParameterService.create(dynamicParameterBody);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.dynamicParameterService.deleteDynamicParameter(id);
  }
}
