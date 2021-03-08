import { Module } from '@nestjs/common';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rates } from './Rates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rates])],
  controllers: [RateController],
  providers: [RateService]
})
export class RateModule {}
