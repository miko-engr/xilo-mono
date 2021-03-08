import { Module } from '@nestjs/common';
import { CoverageController } from './coverage.controller';
import { CoverageService } from './coverage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coverages } from './coverages.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Coverages])],
  controllers: [CoverageController],
  providers: [CoverageService],
})
export class CoverageModule {}
