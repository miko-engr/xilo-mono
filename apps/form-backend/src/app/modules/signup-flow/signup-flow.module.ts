import { Module } from '@nestjs/common';
import { SignupFlowController } from './signup-flow.controller';
import { SignupFlowService } from './signup-flow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
import { Agents } from '../agent/agent.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Users, Agents])],
  controllers: [SignupFlowController],
  providers: [SignupFlowService],
})
export class SignupFlowModule {}
