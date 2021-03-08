import { Module } from '@nestjs/common';
import { DynamicRateConditionController } from './dynamic-rate-condition.controller';
import { DynamicRateConditionService } from './dynamic-rate-condition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicRateConditions } from './dynamic-rate-condition.entity';
import { Coverages } from '../coverage/coverages.entity';
import { Parameters } from '../parameter/Parameters.entity';
import { Companies } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicRateConditions, Companies, Coverages, Parameters])],
  controllers: [DynamicRateConditionController],
  providers: [DynamicRateConditionService]
})
export class DynamicRateConditionModule {}
