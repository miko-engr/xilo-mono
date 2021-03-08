import { Module } from '@nestjs/common';
import { RecreationalVehicleService } from './recreational-vehicle.service';
import { RecreationalVehicleController } from './recreational-vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecreationalVehicles } from './recreational-vehicles.entity';
@Module({
  imports: [TypeOrmModule.forFeature([RecreationalVehicles])],
  providers: [RecreationalVehicleService],
  controllers: [RecreationalVehicleController],
  exports: [RecreationalVehicleService],
})
export class RecreationalVehicleModule {}
