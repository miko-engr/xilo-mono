import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';

import { CoverageService } from './coverage.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
@Controller('coverage')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}
  @Get()
  listByCompany() {
    return this.coverageService.listByCompany();
  }
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.coverageService.listOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() coverageBody: CreateCoverageDto) {
    return this.coverageService.update(id, coverageBody);
  }
  @Post()
  create(@Body() covorageBody: CreateCoverageDto) {
    return this.coverageService.create(covorageBody);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.coverageService.deleteCoverage(id);
  }
}
