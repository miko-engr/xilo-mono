import { Module } from '@nestjs/common';
import { AppulateController } from './appulate.controller';
import { AppulateService } from './appulate.service';
import { AppulateHelper } from './appulate.helper';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pdfs } from '../pdf/pdfs.entity';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { Vehicles } from '../../entities/Vehicles';
import { Drivers } from '../driver/drivers.entity';
import { Businesses } from '../business/businesses.entity';
import { Homes } from '../home/homes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pdfs,
      Clients,
      Companies,
      Vehicles,
      Drivers,
      Businesses,
      Homes,
    ]),
  ],
  controllers: [AppulateController],
  providers: [AppulateService, AppulateHelper],
})
export class AppulateModule {}
