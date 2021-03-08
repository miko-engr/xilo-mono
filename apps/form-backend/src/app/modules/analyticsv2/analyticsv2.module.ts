import { Module } from '@nestjs/common';
import { Analyticsv2Controller } from './analyticsv2.controller';
import { Analyticsv2Service } from './analyticsv2.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Companies } from '../company/company.entity';
import { Forms } from '../form/forms.entity';
import { Users } from '../user/user.entity';
import { Clients } from '../client/client.entity';
import { FormAnalytics } from './FormAnalytics.entity';
import { Agents } from '../agent/agent.entity';
import { LifecycleAnalytics } from '../lifecycle-analytics/LifecycleAnalytics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Lifecycles, FormAnalytics, Forms, Users, Clients, Agents, LifecycleAnalytics])],
  controllers: [Analyticsv2Controller],
  providers: [Analyticsv2Service]
})
export class Analyticsv2Module {}
