import { Module } from '@nestjs/common';
import { PipedriveController } from './pipedrive.controller';
import { PipedriveService } from './pipedrive.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';
import { Clients } from '../client/client.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Companies, Clients])],
  controllers: [PipedriveController],
  providers: [PipedriveService],
})
export class PipedriveModule {}
