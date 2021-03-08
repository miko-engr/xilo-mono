import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
