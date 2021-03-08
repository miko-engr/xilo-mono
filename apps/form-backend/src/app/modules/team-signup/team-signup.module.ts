import { Module } from '@nestjs/common';
import { TeamSignupService } from './team-signup.service';
import { TeamSignupController } from './team-signup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agents } from '../agent/agent.entity';
import { Companies } from '../company/company.entity';
import { FormModule } from '../form/form.module';
import { Users } from '../user/user.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Clients } from '../client/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Agents, Companies, Lifecycles, Clients]),
    FormModule
  ],
  providers: [TeamSignupService],
  controllers: [TeamSignupController]
})
export class TeamSignupModule {}
