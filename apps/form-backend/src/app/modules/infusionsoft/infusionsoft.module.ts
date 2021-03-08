import { Module } from '@nestjs/common';
import { InfusionsoftService } from './infusionsoft.service';
import { InfusionsoftController } from './infusionsoft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';
import { Clients } from '../client/client.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Companies,Clients])],
  providers: [InfusionsoftService],
  controllers: [InfusionsoftController],
  exports: [InfusionsoftService]
})
export class InfusionsoftModule {}
