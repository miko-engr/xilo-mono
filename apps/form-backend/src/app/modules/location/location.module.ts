import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locations } from './location.entity';
import { Clients } from '../client/client.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Locations, Clients])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
