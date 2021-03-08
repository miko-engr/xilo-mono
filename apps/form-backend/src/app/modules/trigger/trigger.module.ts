import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriggerController } from './trigger.controller';
import { TriggerService } from './trigger.service';
import { Clients } from '../client/client.entity';
import { IntegrationModule } from '../integration/integration.module';
import { LifecycleEmailModule } from '../lifecycle-email/lifecycle-email.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clients]),
    IntegrationModule,
    LifecycleEmailModule,
    PdfModule,
  ],
  controllers: [TriggerController],
  providers: [TriggerService]
})
export class TriggerModule {}
