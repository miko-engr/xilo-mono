import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Drivers } from './drivers.entity';
import { Vehicles } from '../../entities/Vehicles';
import { Answers } from '../../entities/Answers';
import { Companies } from '../company/company.entity';
import { Clients } from '../client/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([Drivers, Vehicles, Answers, Companies, Clients]),
  ],
  providers: [DriverService],
  controllers: [DriverController],
  exports: [DriverService],
})
export class DriverModule {}
