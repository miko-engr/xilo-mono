import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZapierController } from './zapier.controller';
import { ZapierService } from './zapier.service';
import { Companies } from '../company/company.entity'
import { Zapiersyncs } from './zapiersyncs.entity';
import { Clients } from '../client/client.entity';
import { FormAnalytics } from '../analyticsv2/FormAnalytics.entity';
import { Agents } from '../agent/agent.entity';
import { Forms } from '../form/forms.entity';
import { Answers } from '../../entities/Answers';
import { Lifecycles } from '../lifecycle/lifecycle.entity'


@Module({
  imports: [TypeOrmModule.forFeature([
    Companies,
    Zapiersyncs,
    Clients,
    FormAnalytics,
    Agents,
    Forms,
    Answers,
    Lifecycles
  ])],
  controllers: [ZapierController],
  providers: [ZapierService]
})
export class ZapierModule { }
