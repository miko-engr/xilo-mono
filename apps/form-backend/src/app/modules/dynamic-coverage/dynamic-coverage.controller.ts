import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';

import { DynamicCoverageService } from './dynamic-coverage.service';
import { CreateDynamicCoverageDto } from './dto/create-dynamic-coverage.dto';
@Controller('dynamic-coverage')
export class DynamicCoverageController {
  constructor(
    private readonly dynamicCoverageService: DynamicCoverageService
  ) {}
  @Get('company')
  listByCompany() {
    return this.dynamicCoverageService.listByCompany();
  }

  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.dynamicCoverageService.listOne(id);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dynamicCoverageBody: CreateDynamicCoverageDto
  ) {
    return this.dynamicCoverageService.update(id, dynamicCoverageBody);
  }

  @Post()
  create(@Body() dynamicCoverageBody: CreateDynamicCoverageDto) {
    return this.dynamicCoverageService.create(dynamicCoverageBody);
  }
  @Delete(':id')
  deleteDynamicCoverage(@Param('id') id: number) {
    return this.dynamicCoverageService.deleteDynamicCoverage(id);
  }
}
