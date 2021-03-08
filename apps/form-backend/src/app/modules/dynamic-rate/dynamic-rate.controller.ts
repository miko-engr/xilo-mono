import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { CreateDynamicRateDto } from './dto/create-dynamic-rate.dto';
import { DynamicRateService } from './dynamic-rate.service';
@Controller('dynamic-rate')
export class DynamicRateController {
  constructor(private readonly dynamicRateService: DynamicRateService) {}
  @Get('company')
  listByCompany() {
    return this.dynamicRateService.listByCompany();
  }
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.dynamicRateService.listOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dynamicRateBody: CreateDynamicRateDto
  ) {
    return this.dynamicRateService.update(id, dynamicRateBody);
  }
  @Post()
  create(@Body() dynamicRateBody: CreateDynamicRateDto) {
    return this.dynamicRateService.create(dynamicRateBody);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.dynamicRateService.deleteDynamicRate(id);
  }
}
