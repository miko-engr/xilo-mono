import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { RecreationalVehicleService } from './recreational-vehicle.service';
import { CreateRecreationalVehicleDto } from './dto/create-recreational-vehicles.dto';
@Controller('recreational-vehicle')
export class RecreationalVehicleController {
  constructor(
    private readonly recreationalVehicleService: RecreationalVehicleService
  ) {}
  @Post('create')
  create(@Body() bodyObj: CreateRecreationalVehicleDto) {
    return this.recreationalVehicleService.create(bodyObj);
  }

  @Patch('upsert')
  upsert(@Body() bodyObj: CreateRecreationalVehicleDto) {
    return this.recreationalVehicleService.upsert(bodyObj);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.recreationalVehicleService.delete(id);
  }

  @Get('list/company')
  listByCompany() {
    return this.recreationalVehicleService.listByCompany();
  }

  @Get('list/id/:id')
  listOneById(@Param('id') id: number) {
    return this.recreationalVehicleService.listOneById(id);
  }
}
