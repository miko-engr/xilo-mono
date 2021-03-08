import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}
  @Post()
  create(@Body() bodyObj: CreateBusinessDto) {
    return this.businessService.create(bodyObj);
  }
  @Patch('upsert')
  upsert(@Body() bodyObj: CreateBusinessDto) {
    return this.businessService.upsert(bodyObj);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.businessService.delete(id);
  }

  @Get()
  listByCompany() {
    return this.businessService.listByCompany();
  }
  @Get(':id')
  listOneById(@Param('id') id: number) {
    return this.businessService.listOneById(id);
  }
}
