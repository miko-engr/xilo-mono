import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAgentDto } from './dto/create-agent-dto';
import { Agent } from './interface/agent.interface';
import { createDbConnection } from '../../helpers/db.helper';
import { getConnection, Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Agents } from './agent.entity';
import { Companies } from '../company/company.entity';
import { Forms } from '../form/forms.entity';
import { Clients } from './../client/client.entity';
import { REQUEST } from '@nestjs/core';
import { HttpException } from '@nestjs/common';

describe('Agent Controller', () => {
  let agentController: AgentController;
  let agentService: AgentService;
  let agentRepository: Repository<Agents>;
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
  let agentBody = {
    agentFormId: null,
    agentIds: [],
    betterAgencyUsername: null,
    canSeeAgentsOnly: false,
    canSeeAllClients: true,
    canSeeTagsOnly: false,
    companyAgentId: 1,
    createdAt: '2020-04-07T04:12:53.028Z',
    email: 'team@xilo.io',
    executiveCode: null,
    firstName: null,
    id: 1,
    isPrimaryAgent: true,
    lastAssignmentDate: '2020-04-11T03:53:15.980Z',
    lastName: null,
    lineOfBusiness: null,
    name: null,
    notificationJson: {
      endpoint:
        'https://fcm.googleapis.com/fcm/send/ew7hF6HrgSw:APA91bHumbQPd6C1TNgXtyN0BMKfX0HnPn2IJu9dHIpQTPXGH1mAyVevWq_ZCMb6BxCCrC8c96nNrQjaqFn9AqZUKh__Qw_EFWY1eHB36SX37zT1E3-1ocwEJBDs-C7G_W-TQ0C5Ogac',
      expirationTime: null,
      keys: {
        auth: 'oLLYiaWMiShglPOiL0wh_Q',
        p256dh:
          'BLJPdGsXEBxKW7YwIQkNGM4YTNVrfKtn6EJvUG7YjGXLkbC1XI7zp2A07wCuRrsMnNprK77gsxOHhuUIX2mlukE',
      },
    },
    phone: null,
    producerCode: null,
    resetPasswordLink: null,
    settings: {
      hideOnBusinessName: false,
      hideOnEmail: false,
      hideOnFirstName: false,
      hideOnFullAddress: false,
      hideOnLastName: false,
      hideOnPhone: false,
      name: 'forprospects',
    },
    tags: null,
    updatedAt: '2020-07-24T09:55:30.269Z',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createDbConnection(),
        TypeOrmModule.forFeature([Agents, Companies, Clients, Forms]),
      ],
      controllers: [AgentController],
      providers: [
        AgentService,
        NotificationsService,
        {
          provide: REQUEST,
          useValue: request,
        },
      ],
    }).compile();

    agentController = await module.resolve<AgentController>(AgentController);
    agentService = await module.resolve<AgentService>(AgentService);
    agentRepository = module.get(getRepositoryToken(Agents));
  });
  afterAll(async () => {
    getConnection().close();
  });
  it('should be defined', () => {
    expect(agentController).toBeDefined();
  });
  describe('list', () => {
    it('should return an array of agents', async () => {
      const existingAgentslist = await agentRepository.find({
        where: {
          companyAgentId: request.body.decoded_user.user.companyUserId,
        },
      });
      const result = await agentService.list();
      expect(result.obj.length).toEqual(existingAgentslist.length);
    });
  });
  describe('listByCompanyForAgent', () => {
    it('should return an array of agents', async () => {
      const existingAgentslist = await agentRepository.find({
        where: {
          companyAgentId: request.body.decoded_user.agent.companyAgentId,
        },
      });
      const result = await agentService.listByCompanyForAgent();
      expect(result.obj.length).toEqual(existingAgentslist.length);
    });
  });
  describe('listByCompanyForUser', () => {
    it('should return an array of agents', async () => {
      const existingAgentslist = await agentRepository.find({
        where: {
          companyAgentId: request.body.decoded_user.user.companyUserId,
        },
      });
      const result = await agentService.listByCompanyForUser();
      expect(result.obj.length).toEqual(existingAgentslist.length);
    });
  });
  describe('listById', () => {
    it('should return agent by id', async () => {
      try {
        const result = await agentService.listById(agentBody.id);
        expect(result.obj.id).toEqual(agentBody.id);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('No agent found');
      }
    });
  });
  describe('listOne', () => {
    it('should return agent', async () => {
      try {
        const result = await agentService.listOne(agentBody.id);
        jest
          .spyOn(agentService, 'listOne')
          .mockImplementation(async () => result);
        expect(result.obj['id']).toEqual(agentBody.id);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('No agent found');
      }
    });
  });
  describe('listOneByAgent', () => {
    it('should return agent', async () => {
      try {
        const result = await agentService.listOneByAgent();
        expect(result.obj.id).toEqual(request.body.decoded_user.agent.id);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('No agent found');
      }
    });
  });
  describe('listClients', () => {
    it('should return an array of clients', async () => {
      try {
        const result = await agentService.listClients();
        expect(result.obj.length).toBeDefined();
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBeDefined();
      }
    });
  });
  describe('listAllClients', () => {
    it('should return an array of clients', async () => {
      const result = await agentService.listAllClients();
      jest
        .spyOn(agentService, 'listAllClients')
        .mockImplementation(async () => result);
      expect(await agentController.listAllClients()).toBe(result);
    });
  });
  describe('listUserForAgent', () => {
    it('should return agent', async () => {
      const result = await agentService.listUserForAgent();
      jest
        .spyOn(agentService, 'listUserForAgent')
        .mockImplementation(async () => result);
      expect(await agentController.listUserForAgent()).toBe(result);
    });
  });
  describe('signup', () => {
    it('should signup and return agent', async () => {
      const agentBody: CreateAgentDto = {
        name: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: '',
      };
      const result = await agentService.signup(agentBody);
      jest.spyOn(agentService, 'signup').mockImplementation(async () => result);
      expect(await agentController.signup(agentBody)).toBe(result);
    });
  });
  describe('updateNotification', () => {
    it('should update agent', async () => {
      const agentBody: Agent = {
        id: 1,
        name: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: '',
        agentForm: {},
        formAgent: {},
        clients: [],
        lifecycleAnalytics: [],
        notes: [],
        tasks: [],
        tasks2: [],
        company: {},
      };
      const result = await agentService.updateNotification(agentBody);
      jest
        .spyOn(agentService, 'updateNotification')
        .mockImplementation(async () => result);
      expect(await agentController.updateNotification(agentBody)).toBe(result);
    });
  });
  describe('update', () => {
    it('should update agent by id', async () => {
      const agentBody: Agent = {
        id: 1,
        name: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: '',
        agentForm: {},
        formAgent: {},
        clients: [],
        lifecycleAnalytics: [],
        notes: [],
        tasks: [],
        tasks2: [],
        company: {},
      };
      const result = await agentService.update(agentBody.id, agentBody);
      jest.spyOn(agentService, 'update').mockImplementation(async () => result);
      expect(await agentController.update(agentBody.id, agentBody)).toBe(
        result
      );
    });
  });
  describe('deleteAgent', () => {
    it('should delete agent by id', async () => {
      const id = 1;
      const result = await agentService.deleteAgent(id);
      jest
        .spyOn(agentService, 'deleteAgent')
        .mockImplementation(async () => result);
      expect(await agentController.deleteAgent(id)).toBe(result);
    });
  });
  describe('updateSettings', () => {
    it('should update settings of agent', async () => {
      const settings = {};
      const result = await agentService.updateSettings(settings);
      jest
        .spyOn(agentService, 'updateSettings')
        .mockImplementation(async () => result);
      expect(await agentController.updateSettings(settings)).toBe(result);
    });
  });

});
