import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { ConditionController } from './condition.controller';
import { Companies } from '../company/company.entity';
import { Conditions } from './conditions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Conditions, Companies])],
  providers: [ConditionService],
  controllers: [ConditionController],
})
export class ConditionModule {}
