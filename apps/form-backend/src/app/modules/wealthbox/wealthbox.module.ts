import { Module } from '@nestjs/common';
import { WealthboxController } from './wealthbox.controller';
import { WealthboxService } from './wealthbox.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';
import { Businesses } from '../business/businesses.entity';
import { Clients } from '../client/client.entity';
import { Vehicles } from '../../entities/Vehicles';
import { Drivers } from '../driver/drivers.entity';
import { Homes } from '../home/homes.entity';
import { Agents } from '../agent/agent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Clients,
      Companies,
      Businesses,
      Vehicles,
      Drivers,
      Homes,
      Agents,
    ]),
  ],
  controllers: [WealthboxController],
  providers: [WealthboxService],
})
export class WealthboxModule {}
