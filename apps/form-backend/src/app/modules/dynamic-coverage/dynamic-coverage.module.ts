import { Module } from '@nestjs/common';
import { DynamicCoverageController } from './dynamic-coverage.controller';
import { DynamicCoverageService } from './dynamic-coverage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicCoverages } from './dynamic-coverages.entity';
import { Companies } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicCoverages, Companies])],
  controllers: [DynamicCoverageController],
  providers: [DynamicCoverageService],
  exports: [DynamicCoverageService],
})
export class DynamicCoverageModule {}
