import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Agents } from '../agent/agent.entity';
import { Companies } from '../company/company.entity';
import { User } from './user.entity';
import { createDbConnection } from '../../helpers/db.helper';
import { getConnection, Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { HttpException } from '@nestjs/common';

describe('User Controller', () => {
  let controller: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;

  let request = {
    body: {
      decoded_user: {
        user: { id: 1, username: 'team@xilo.io', companyUserId: 1 },
        agent: {
          id: 1,
          companyAgentId: 1,
        },
        companyId: 1,
      },
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createDbConnection(),
        TypeOrmModule.forFeature([Agents, Companies, User]),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: REQUEST,
          useValue: request,
        },
      ],
    }).compile();

    controller = await module.resolve<UserController>(UserController);
    userService = await module.resolve<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('list', () => {
    it('should return an array of users', async () => {
      const result = await userService.list();
      jest.spyOn(userService, 'list').mockImplementation(async () => result);
      expect(await controller.list()).toBe(result);
    });
  });
  describe('listOne', () => {
    it('should return user', async () => {
      const result = await userService.listOne();
      jest.spyOn(userService, 'listOne').mockImplementation(async () => result);
      expect(await controller.listOne()).toBe(result);
    });
  });
  describe('listById', () => {
    it('should return user by id', async () => {
      const id = 1;
      const result = await userService.listById(id);
      jest
        .spyOn(userService, 'listById')
        .mockImplementation(async () => result);
      expect(await controller.listById(id)).toBe(result);
    });
  });
  describe('listByCompany', () => {
    it('should return an array of users', async () => {
      const result = await userService.listByCompany();
      jest
        .spyOn(userService, 'listByCompany')
        .mockImplementation(async () => result);
      expect(await controller.listByCompany()).toBe(result);
    });
  });
  describe('updatePlatformManagerId', () => {
    it('should return an updated company', async () => {
      const result = await userService.updatePlatformManagerId();
      jest
        .spyOn(userService, 'updatePlatformManagerId')
        .mockImplementation(async () => result);
      expect(await controller.updatePlatformManagerId()).toBe(result);
    });
  });
  describe('update', () => {
    it('should update and return user', async () => {
      const userBody: CreateUserDto = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        resetPasswordLink: '',
        xanatekProducerId: '',
        xanatekCsrId: '',
        settings: {},
        showReport: false,
        sendReport: false,
        isAdmin: false,
        companyUserId: 1,
        companyNoteId: 1,
      };
      const result = await userService.update(userBody.id, userBody);
      jest.spyOn(userService, 'update').mockImplementation(async () => result);
      expect(await controller.update(userBody.id, userBody)).toBe(result);
    });
  });
  describe('updateUser', () => {
    it('should update and return user', async () => {
      const userBody: CreateUserDto = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        resetPasswordLink: '',
        xanatekProducerId: '',
        xanatekCsrId: '',
        settings: {},
        showReport: false,
        sendReport: false,
        isAdmin: false,
        companyUserId: 1,
        companyNoteId: 1,
      };
      const result = await userService.updateUser(userBody.id, userBody);
      jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(async () => result);
      expect(await controller.updateUser(userBody.id, userBody)).toBe(result);
    });
  });
  describe('create', () => {
    it('should create and return user', async () => {
      const userBody: CreateUserDto = {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        resetPasswordLink: '',
        xanatekProducerId: '',
        xanatekCsrId: '',
        settings: {},
        showReport: false,
        sendReport: false,
        isAdmin: false,
        companyUserId: 1,
        companyNoteId: 1,
      };
      const result = await userService.create(userBody);
      jest.spyOn(userService, 'create').mockImplementation(async () => result);
      expect(await controller.create(userBody)).toBe(result);
    });
  });
  describe('destroy', () => {
    it('should delete user by id', async () => {
      const id = 1;
      const result = await userService.destroy(id);
      jest.spyOn(userService, 'destroy').mockImplementation(async () => result);
      expect(await controller.destroy(id)).toBe(result);
    });
  });
  describe('updateSettings', () => {
    it('should update user settings and return updated user', async () => {
      const result = await userService.updateSettings();
      jest
        .spyOn(userService, 'updateSettings')
        .mockImplementation(async () => result);
      expect(await controller.updateSettings()).toBe(result);
    });
  });
  describe('sendInvitationEmail', () => {
    it('should send invite email', async () => {
      const result = await userService.sendInvitationEmail();
      jest
        .spyOn(userService, 'sendInvitationEmail')
        .mockImplementation(async () => result);
      expect(await controller.sendInvitationEmail()).toBe(result);
    });
  });
});
