import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Clients } from './client.entity';
import { Companies } from '../company/company.entity';
import { Businesses } from "../business/businesses.entity";
import { Agents } from "../agent/agent.entity";
import { LifecycleAnalytics } from '../lifecycle-analytics/LifecycleAnalytics.entity';
import { Flows } from '../flow/flows.entity';
import { Emails } from '../email/emails.entity';
import { TextMessages } from '../text-messages/TextMessages.entity';
import { Documents } from '../../entities/Documents';
import { Homes } from '../home/homes.entity';
import { Users } from '../user/user.entity';
import { FlowModule } from '../flow/flow.module';
import { Lifecycles } from '../lifecycle/lifecycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Clients,
    Companies,
    Businesses,
    Agents,
    Flows,
    Emails,
    TextMessages,
    Documents,
    Homes,
    LifecycleAnalytics,
    Users,
    Lifecycles
  ]),
  FlowModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
