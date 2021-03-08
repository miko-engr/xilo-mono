import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agents } from './agent.entity';
import { Companies } from '../company/company.entity';
import { Forms } from '../form/forms.entity';
import { Clients } from '../client/client.entity';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Agents, Companies, Forms, Clients]),
    NotificationsModule,
  ],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
