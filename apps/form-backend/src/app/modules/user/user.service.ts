import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agents } from '../agent/agent.entity';
import { Companies } from '../company/company.entity';
import { Users } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { sendInvitationMail } from '../../helpers/email.helper';
@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Agents)
    private agentsRepository: Repository<Agents>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @Inject(REQUEST) private request: Request
  ) {}
  async destroy(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
      });
      if (!user) {
        throw new HttpException(
          'There was an error retrieving users',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedUser = await this.userRepository.delete(user);
      if (deletedUser.affected === 0) {
        throw new HttpException(
          'There was an error deleting the user',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async create(userBody: CreateUserDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository.findOne({
        where: {
          username: userBody.username,
        },
      });
      if (user) {
        throw new HttpException(
          'There was an error retrieving users. User already exists',
          HttpStatus.BAD_REQUEST
        );
      }
      const newUser = await this.userRepository.save({
        username: userBody.username.toLowerCase(),
        name: userBody.name,
        firstName: userBody.firstName,
        lastName: userBody.lastName,
        password:
          userBody.password === null
            ? null
            : bcrypt.hashSync(userBody.password, 10),
        isAdmin: userBody.isAdmin !== null ? userBody.isAdmin : false,
        companyUserId: decoded.user.companyUserId,
        createdAt: userBody.createdAt,
        updatedAt: userBody.updatedAt,
      });
      if (!newUser) {
        throw new HttpException(
          'There was an error creating the user',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'New user created successfully',
        obj: newUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async list() {
    try {
      const users = await this.userRepository.find();
      if (!users) {
        throw new HttpException(
          'There was an error retrieving users',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Users retrieved successfully',
        obj: users,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listById(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository.findOne({
        where: {
          id: id,
          companyUserId: decoded.user.companyUserId,
        },
      });
      delete user.password;
      if (!user) {
        throw new HttpException(
          'There was an error retrieving User',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'User retrieved successfully',
        obj: user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne() {
    try {
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where({ id: decoded.user.id })
        .leftJoinAndSelect('user.company', 'company')
        .leftJoinAndSelect('company.agents', 'agent')
        .leftJoinAndSelect('company.Lifecycles', 'lifecycles')
        .getOne();
      if (!user) {
        throw new HttpException(
          'There was an error retrieving User',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'User retrieved successfully',
        obj: user,
      };
    } catch (error) {
      console.log('error', error)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const users = await this.userRepository.find({
        where: {
          companyUserId: decoded.user.companyUserId,
        },
      });
      if (!users) {
        throw new HttpException('No users found', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Users retrieved successfully',
        obj: users,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, userBody: CreateUserDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new HttpException('Error finding user', HttpStatus.BAD_REQUEST);
      }
      const updatedUser = await this.userRepository.save({
        ...user,
        ...{
          username: userBody.username
            ? userBody.username.toLowerCase()
            : user.username.toLowerCase(),
          name: userBody.name ? userBody.name : user.name,
          firstName: userBody.firstName ? userBody.firstName : user.firstName,
          lastName: userBody.lastName ? userBody.lastName : user.lastName,
          password:
            userBody.password === null
              ? null
              : bcrypt.hashSync(userBody.password, 10),
          isAdmin: userBody.isAdmin !== null ? userBody.isAdmin : null,
          sendReport: userBody.sendReport === true,
        },
      });
      if (!updatedUser) {
        throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'User updated successfully',
        obj: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateUser(id: number, userBody: CreateUserDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository.findOne({
        where: {
          companyUserId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!user) {
        throw new HttpException('Error finding user', HttpStatus.BAD_REQUEST);
      }
      const updatedUser = await this.userRepository.save({
        ...user,
        ...{
          username: userBody.username
            ? userBody.username.toLowerCase()
            : user.username.toLowerCase(),
          name: userBody.name ? userBody.name : user.name,
          firstName: userBody.firstName ? userBody.firstName : user.firstName,
          lastName: userBody.lastName ? userBody.lastName : user.lastName,
          password:
            typeof userBody.password !== 'undefined' &&
            userBody.password !== null &&
            userBody.password !== ''
              ? bcrypt.hashSync(userBody.password, 10)
              : user.password,
          isAdmin: userBody.isAdmin !== null ? userBody.isAdmin : null,
        },
      });
      if (!updatedUser) {
        throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'User updated successfully',
        obj: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updatePlatformManagerId() {
    try {
      const decoded = this.request.body.decodedUser;
      const platformDecoded = jwt.decode(
        this.request.query.platformToken as string
      );

      const user = await this.userRepository.findOne({
        where: {
          id: decoded.user.id,
        },
      });
      if (!user) {
        throw new HttpException('No user found', HttpStatus.BAD_REQUEST);
      }
      const company = await this.companiesRepository.findOne({
        where: {
          id: user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const updatedCompany = await this.companiesRepository.save({
        ...company,
        ...{
          platformManagerCompanyId: platformDecoded['platformManager'].id,
        },
      });
      if (!updatedCompany) {
        throw new HttpException(
          'Error updating company',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Platform Manager Added Successfully',
        obj: updatedCompany,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async verify() {
    try {
      // const platformDecoded = jwt.decode(this.request.query.platformToken );
      // don't have PlatformManager entity
      // return model.PlatformManager.findOne({
      //   where: {
      //     id: platformDecoded.platformManager.id,
      //   },
      // }).then((platformManager) => {
      //   if (req.query.platformToken !== platformManager.addAgencyLink) {
      //     return res.status(401).json({
      //       title: 'Platform Manager Link Did Not Match',
      //       status: false,
      //       data: 'platform manager',
      //       error: 'This user is not authorized to access this page',
      //     });
      //   }
      //   return res.status(200).json({
      //     message: 'Users Platform Manager link matches',
      //     status: true,
      //   });
      // }).catch(error => res.status(400).json({
      //   title: 'Error retrieving platform manager',
      //   errorType: 1,
      //   data: 'platform manager',
      //   error: error.stack,
      // }));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateSettings() {
    try {
      const { settings } = this.request.body;
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository.findOne({
        where: { id: decoded.user.id },
      });
      if (!user) {
        throw new HttpException(
          'Error updating user. No user found',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedUser = await this.userRepository.save({
        ...user,
        ...{ settings: settings },
      });
      return {
        message: 'User settings updated',
        obj: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async sendInvitationEmail() {
    try {
      const { email, userType, url, firstName, lastName } = this.request.body;
      const decoded = this.request.body.decodedUser;
      if (!email) {
        throw new HttpException('Email not found', HttpStatus.BAD_REQUEST);
      }
      const emailInfo = {
        userType: userType,
        customerFullName: `${firstName} ${lastName}`,
      };
      const subject = 'Account create invitation link';
      if (userType === 'admin') {
        const userData = {
          username: email,
          companyUserId: decoded.user.companyUserId,
          firstName,
          lastName,
        };
        const eUser = await this.userRepository.findOne({
          where: { username: email },
        });
        if (eUser && eUser.password) {
          throw new HttpException(
            'Invitation already sent',
            HttpStatus.BAD_REQUEST
          );
        }
        if (eUser && !eUser.password) {
          throw new HttpException(
            'Invitation already sent',
            HttpStatus.BAD_REQUEST
          );
        }
        const admin = await this.userRepository.save(userData);
        if (!admin) {
          throw new HttpException(
            'Error creating user',
            HttpStatus.BAD_REQUEST
          );
        }
        const token = await jwt.sign(
          {
            user: {
              id: admin.id,
              username: email,
              companyUserId: decoded.user.companyUserId,
              sendBy: 'member',
              userType,
            },
          },
          'secret',
          { expiresIn: '48h' }
        );
        const invitedEmail = encodeURIComponent(email);
        const createPasswordLink = `${url}auth/signup-flow/create-password?email=${invitedEmail}&invited=true&token=${token}`;
        emailInfo['createPasswordLink'] = createPasswordLink;
        const data = await sendInvitationMail(email, subject, emailInfo);
        return {
          message: 'Email sent sucessfully to Admin!',
          data,
        };
      } else {
        const agentData = {
          email: email,
          companyAgentId: decoded.user.companyUserId,
          firstName,
          lastName,
        };
        const eAdmin = await this.agentsRepository.findOne({
          where: { email: email },
        });
        if (eAdmin && eAdmin.password) {
          throw new HttpException(
            'Invitation already sent',
            HttpStatus.BAD_REQUEST
          );
        }
        if (eAdmin && !eAdmin.password) {
          throw new HttpException(
            'Invitation already sent',
            HttpStatus.BAD_REQUEST
          );
        }
        const agent = await this.agentsRepository.save(agentData);
        if (!agent) {
          throw new HttpException(
            'Error creating agent',
            HttpStatus.BAD_REQUEST
          );
        }
        const token = await jwt.sign(
          {
            user: {
              id: agent.id,
              username: email,
              companyUserId: decoded.user.companyUserId,
              sendBy: 'member',
              userType,
            },
          },
          'secret',
          { expiresIn: '48h' }
        );
        const invitedEmail = encodeURIComponent(email);
        const createPasswordLink = `${url}auth/signup-flow/create-password?email=${invitedEmail}&invited=true&token=${token}`;
        emailInfo['createPasswordLink'] = createPasswordLink;
        const data = await sendInvitationMail(email, subject, emailInfo);
        return {
          message: 'Email sent sucessfully to agent!',
          data,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
