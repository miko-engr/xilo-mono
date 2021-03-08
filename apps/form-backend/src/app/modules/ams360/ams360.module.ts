import { Module } from '@nestjs/common';
import { Ams360Controller } from './ams360.controller';
import { Ams360Service } from './ams360.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { Drivers } from '../driver/drivers.entity';
import { Homes } from '../home/homes.entity';
import { Businesses } from '../business/businesses.entity';
import { Agents } from '../agent/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients, Companies, Drivers, Homes, Businesses, Agents])],
  controllers: [Ams360Controller],
  providers: [Ams360Service],
  exports: [Ams360Service]
})
export class Ams360Module {}
