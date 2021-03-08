import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
import { Agents } from '../agent/agent.entity';
import { Companies } from '../company/company.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { FormModule } from '../form/form.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Agents, Companies, Lifecycles]),
    NotificationsModule,
    FormModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
