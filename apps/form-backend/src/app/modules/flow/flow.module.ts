import { Module } from '@nestjs/common';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flows } from './flows.entity';
import { FlowHelper } from './helper/flow.helper';
import { TextMessages } from '../text-messages/TextMessages.entity';
import { Emails } from '../email/emails.entity';
import { Clients } from '../client/client.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    Flows, 
    TextMessages,
    Emails,
    Clients
  ])],
  controllers: [FlowController],
  providers: [FlowService, FlowHelper],
  exports: [FlowHelper]
})
export class FlowModule {}
