import { Module } from '@nestjs/common';
import { CityDistanceController } from './city-distance.controller';
import { CityDistanceService } from './city-distance.service';

@Module({
  controllers: [CityDistanceController],
  providers: [CityDistanceService]
})
export class CityDistanceModule {}
