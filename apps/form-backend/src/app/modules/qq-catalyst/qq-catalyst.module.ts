import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QqCatalystHelper } from './helper/qq-catalyst.helper';
import { QqCatalystService } from './qq-catalyst.service';
import { QqCatalystController } from './qq-catalyst.controller';
import { Clients } from '../client/client.entity';
import { Homes } from '../home/homes.entity';
import { Businesses } from '../business/businesses.entity';
import { Drivers } from '../driver/drivers.entity';
import { Forms } from '../form/forms.entity';
import { Integrations } from '../integration/Integrations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Clients,
      Homes,
      Businesses,
      Drivers,
      Forms,
      Integrations,
    ]),
  ],
  providers: [QqCatalystService, QqCatalystHelper],
  controllers: [QqCatalystController],
  exports: [QqCatalystService],
})
export class QqCatalystModule {}
