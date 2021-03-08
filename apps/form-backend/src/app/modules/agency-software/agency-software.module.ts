import { Module } from '@nestjs/common';
import { AgencySoftwareController } from './agency-software.controller';
import { AgencySoftwareService } from './agency-software.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  controllers: [AgencySoftwareController],
  providers: [AgencySoftwareService],
})
export class AgencySoftwareModule {}
