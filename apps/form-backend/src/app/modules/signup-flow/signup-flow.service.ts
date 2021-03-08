import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
import { Agents } from '../agent/agent.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';

@Injectable({ scope: Scope.REQUEST })
export class SignupFlowService {
  constructor(
    @InjectRepository(Users)
    private UserRepository: Repository<Users>,
    @InjectRepository(Agents)
    private agentsRepository: Repository<Agents>,
    @Inject(REQUEST) private request: Request
  ) {}
  async createPassword(bodyObj: any) {
    try {
      const emailCredential = bodyObj.email.toLowerCase();
      const passwordCredential = bodyObj.password;
      const { isAgent, isEmployeeInvited } = bodyObj;
      const agent = await this.agentsRepository.findOne({
        where: { email: emailCredential },
      });
      const user = await this.UserRepository.findOne({
        where: { username: emailCredential },
      });
      const passwordHash = bcrypt.hashSync(bodyObj.password);
      if (!agent && !user) {
        throw new HttpException('user not found!', HttpStatus.BAD_REQUEST);
      }
      if (isAgent) {
        const isPasswordExist = passwordCredential && agent && agent.password;
        if (isPasswordExist) {
          throw new HttpException(
            'Password already created',
            HttpStatus.BAD_REQUEST
          );
        }
        const updatedAgent = await this.agentsRepository.save({
          ...agent,
          ...{ password: passwordHash },
        });
      }
      if (!isAgent && !isEmployeeInvited) {
        const isPasswordExist = passwordCredential && user && user.password;
        if (isPasswordExist) {
          throw new HttpException(
            'Password already created',
            HttpStatus.BAD_REQUEST
          );
        }
        const updatedUser = await this.UserRepository.save({
          ...user,
          ...{ password: passwordHash },
        });
      }
      if (!isAgent && isEmployeeInvited) {
        const isPasswordExist = passwordCredential && user && user.password;
        if (isPasswordExist) {
          throw new HttpException(
            'Password already created',
            HttpStatus.BAD_REQUEST
          );
        }
        const updatedAgent = await this.agentsRepository.save({
          ...agent,
          ...{ password: passwordHash },
        });
        const updatedUser = await this.UserRepository.save({
          ...user,
          ...{ password: passwordHash },
        });
      }
      return {
        message: 'password created sucessfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
