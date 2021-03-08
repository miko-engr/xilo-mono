import { Module } from '@nestjs/common';
import { LifecycleAnalyticsService } from './lifecycle-analytics.service';
import { LifecycleAnalyticsController } from './lifecycle-analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';
import { Clients } from '../client/client.entity';
import { LifecycleAnalytics } from './LifecycleAnalytics.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { EzlynxModule } from '../ezlynx/ezlynx.module';
import { Ams360Module } from '../ams360/ams360.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Companies,
      Clients,
      Lifecycles,
      LifecycleAnalytics
    ]),
    EzlynxModule,
    Ams360Module
  ],
  providers: [LifecycleAnalyticsService],
  controllers: [LifecycleAnalyticsController]
})
export class LifecycleAnalyticsModule {}
