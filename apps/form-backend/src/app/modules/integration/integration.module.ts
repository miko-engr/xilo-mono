import { Module } from '@nestjs/common';
import { IntegrationController } from './integration.controller';
import { Ams360Module } from '../ams360/ams360.module';
import { IntegrationService } from './integration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import { Forms } from '../form/forms.entity';
import { Integrations } from './Integrations.entity';
import { EzlynxService } from '../ezlynx/ezlynx.service';
import { InfusionsoftService } from '../infusionsoft/infusionsoft.service';
import { QqCatalystService } from '../qq-catalyst/qq-catalyst.service';
import { QuoteRushService } from '../quote-rush/quote-rush.service';
import { EzlynxModule } from '../ezlynx/ezlynx.module';
import { InfusionsoftModule } from '../infusionsoft/infusionsoft.module';
import { QqCatalystModule } from '../qq-catalyst/qq-catalyst.module';
import { QuoteRushModule } from '../quote-rush/quote-rush.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Integrations,
      Clients,
      Forms,
    ]),
    EzlynxModule,
    Ams360Module,
    InfusionsoftModule,
    QqCatalystModule,
    QuoteRushModule
    ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule { }
