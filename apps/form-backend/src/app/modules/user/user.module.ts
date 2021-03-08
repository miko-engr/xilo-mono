import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agents } from '../agent/agent.entity';
import { Companies } from '../company/company.entity';
import { Users } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Agents, Companies])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
