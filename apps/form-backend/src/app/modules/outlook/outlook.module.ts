import { Module } from '@nestjs/common';
import { OutlookService } from './outlook.service';
import { OutlookController } from './outlook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Companies])],
  providers: [OutlookService],
  controllers: [OutlookController],
})
export class OutlookModule {}
