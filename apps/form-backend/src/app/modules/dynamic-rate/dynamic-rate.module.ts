import { Module } from '@nestjs/common';
import { DynamicRateController } from './dynamic-rate.controller';
import { DynamicRateService } from './dynamic-rate.service';
import { DynamicRates } from './dynamic-rates.entity';
import { Users } from '../user/user.entity';
import { Companies } from '../company/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Users, Companies, DynamicRates])],
  controllers: [DynamicRateController],
  providers: [DynamicRateService],
  exports: [DynamicRateService],
})
export class DynamicRateModule {}
