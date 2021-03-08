import {
  Controller,
  Patch,
  Param,
  Body,
  Delete,
  Post,
  Put,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
  @Patch('fix/vehicle')
  updateVehicle() {
    return this.driverService.updateVehicle();
  }
  @Patch('fix/driver')
  updateDrivers() {
    return this.driverService.updateDrivers();
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() bodyObj: CreateDriverDto) {
    return this.driverService.update(id, bodyObj);
  }
  @Delete(':id')
  deleteDriver(@Param('id') id: number) {
    return this.driverService.deleteDriver(id);
  }
  @Delete(':clientId/:driverId')
  companyDeleteDriver(
    @Param('clientId') clientId: number,
    @Param('driverId') driverId: number
  ) {
    return this.driverService.companyDeleteDriver(clientId, driverId);
  }
  @Post()
  create(@Body() bodyObj: CreateDriverDto) {
    return this.driverService.create(bodyObj);
  }
  @Put()
  upsert(@Body() bodyObj: CreateDriverDto) {
    return this.driverService.upsert(bodyObj);
  }
}
