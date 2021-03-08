import { Module } from '@nestjs/common';
import { LifecycleEmailService } from './lifecycle-email.service';
import { LifecycleEmailController } from './lifecycle-email.controller';
import { EmailModule } from '../email/email.module';
import { PdfModule } from '../pdf/pdf.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import { Forms } from '../form/forms.entity';
import { Agents } from '../agent/agent.entity';
import { Companies } from '../company/company.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clients, Forms, Agents, Companies]),
    EmailModule,
    PdfModule,
    NotificationsModule,
  ],
  providers: [LifecycleEmailService],
  controllers: [LifecycleEmailController],
  exports: [LifecycleEmailService],
})
export class LifecycleEmailModule {}
