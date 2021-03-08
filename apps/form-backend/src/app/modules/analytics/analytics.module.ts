import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agents } from '../agent/agent.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Clients } from '../client/client.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Agents, Lifecycles, Clients])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
