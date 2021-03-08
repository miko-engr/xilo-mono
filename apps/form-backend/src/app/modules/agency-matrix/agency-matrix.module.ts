import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyMatrixService } from './agency-matrix.service';
import { AgencyMatrixController } from './agency-matrix.controller';
import { Clients } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [AgencyMatrixService],
  controllers: [AgencyMatrixController],
})
export class AgencyMatrixModule {}
