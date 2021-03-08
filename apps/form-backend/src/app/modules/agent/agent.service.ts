import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { Agents } from './agent.entity';
import { Agent } from './interface/agent.interface';
import { CreateAgentDto } from './dto/create-agent-dto';
import { Companies } from '../company/company.entity';
import { Forms } from '../form/forms.entity';
import { Clients } from './../client/client.entity';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable({ scope: Scope.REQUEST })
export class AgentService {
  constructor(
    @InjectRepository(Agents) private agentRepository: Repository<Agents>,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Forms) private formRepository: Repository<Forms>,
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request,
    private notificationService: NotificationsService
  ) {}

  async signup(AgentBody: CreateAgentDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companyRepository.findOne({
        where: { id: decoded.user.companyUserId },
      });
      if (!company) {
        throw new HttpException(
          {
            message: 'Cannot find company',
            errorType: 1,
            data: 'company',
            error: 'Try another account',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      AgentBody.password =
        AgentBody.password === null
          ? null
          : bcrypt.hashSync(AgentBody.password, 10);
      const agent = await this.agentRepository.save({
        email: (AgentBody.email).toLowerCase(),
        password: AgentBody.password,
        firstName: AgentBody.firstName,
        lastName: AgentBody.lastName,
        companyAgentId: decoded.user.companyUserId,
        isPrimaryAgent: (typeof AgentBody.isPrimaryAgent !== 'undefined' && AgentBody.isPrimaryAgent !== null && AgentBody.isPrimaryAgent !== false),
        lineOfBusiness: AgentBody.lineOfBusiness,
        createdAt: AgentBody.createdAt,
        updatedAt: AgentBody.updatedAt
      });
      if (!agent) {
        throw new HttpException(
          'There was an error signing up!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Agent signed up successfully',
        obj: agent,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteAgent(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const agent = await this.agentRepository.findOne({
        where: { companyAgentId: decoded.companyId, id: id },
      });

      if (!agent) {
        throw new HttpException(
          'Error deleting agent. No agent found',
          HttpStatus.BAD_REQUEST
        );
      }

      const data = await this.agentRepository.remove(agent);
      if (!data) {
        throw new HttpException(
          'Error deleting agent. Method failed',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Agent deleted successfully',
        obj: {},
      };
    } catch (error) {
      throw new HttpException(
        'Error deleting agent. Method failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async list() {
    try {
      const decoded = this.request.body.decodedUser;
      const agents = await this.agentRepository.find({
        where: { companyAgentId: decoded.user.companyUserId },
      });

      if (!agents) {
        throw new HttpException(
          'There was an error retrieving affiliates',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Agents retrieved successfully',
        obj: agents,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyForAgent() {
    try {
      const decoded = this.request.body.decodedUser;
      const agents = await this.agentRepository.find({
        where: {
          companyAgentId: decoded.agent.companyAgentId,
        },
      });
      if (!agents) {
        throw new HttpException('No agents found', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Agents retrieved successfully',
        obj: agents,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listIdByEmail(agentEmail: string) {
    try {
      const agent = await this.agentRepository.findOne({
        where: { email: agentEmail },
      });
      if (!agent || !agent.id) {
        return {
          title: 'No agent found',
          id: null,
        };
      }
      return {
        title: 'Agent found',
        id: agent.id,
      };
    } catch (error) {
      throw new HttpException(
        'Error finding agent. Method failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async listByCompanyForUser() {
    try {
      const decoded = this.request.body.decodedUser;
      const agents = await this.agentRepository.find({
        where: {
          companyAgentId: decoded.user.companyUserId,
        },
      });
      if (!agents) {
        throw new HttpException('No agents found', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Agents retrieved successfully',
        obj: agents,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listById(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const agent = await this.agentRepository.findOne({
        where: { id: id , companyAgentId: decoded.user.companyUserId },
      });
      if (!agent) {
        throw new HttpException('No agent found', HttpStatus.BAD_REQUEST);
      }
      delete agent.password;
      return {
        message: 'Agent retrieved successfully',
        obj: agent,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByEmail(email: string) {
    try {
      const agent = await this.agentRepository.findOne({
        where: { email: email },
        select: ['id'],
      });
      if (!agent) {
        throw new HttpException('No agent found', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Agent found successfully',
        obj: agent,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByOldestAssignmentDate(formId: number) {
    try {
      const form = await this.formRepository.findOne({
        where: { id: formId },
        select: ['id', 'roundRobinAgents'],
      });

      if (
        !form ||
        !form.roundRobinAgents ||
        (form.roundRobinAgents.length && form.roundRobinAgents.length === 0)
      ) {
        return {
          title: 'No round robin agents found',
          obj: { id: null },
        };
      }

      const agents = await this.agentRepository.find({
        where: {
          id: form.roundRobinAgents,
        },
        select: ['id', 'lastAssignmentDate', 'firstName'],
        order: {
          lastAssignmentDate: 'ASC',
          firstName: 'ASC',
        },
      });

      if (!agents || (agents.length && agents.length === 0)) {
        return {
          title: 'No round robin agent found',
          obj: { id: null },
        };
      }
      agents[0].lastAssignmentDate = new Date();
      await this.agentRepository.save(agents[0]);

      return {
        title: 'Agent found successfully',
        obj: agents[0],
      };
    } catch (error) {
      throw new HttpException(
        'No round robin agents found',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async listByCompany(companyId: number) {
    try {
      const company = await this.companyRepository.findOne({
        where: { companyId: companyId },
        select: ['id', 'companyId'],
      });

      if (!company) {
        throw new HttpException(
          'Error finding agents. No company',
          HttpStatus.BAD_REQUEST
        );
      }

      const agents = await this.agentRepository.find({
        where: { companyAgentId: company.id, isPrimaryAgent: true },
        select: ['id', 'email', 'firstName', 'lastName', 'createdAt'],
        order: {
          createdAt: 'ASC',
        },
      });

      return {
        title: 'Agents found successfully',
        obj: agents,
      };
    } catch (error) {
      throw new HttpException(
        'Error listing agents. Method failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async listOne(id: number) {
    try {
      const agent = await this.agentRepository.findOne({ where: { id } });
      if (!agent) {
        throw new HttpException('No agent found', HttpStatus.BAD_REQUEST);
        // return {
        //   title: 'No agent found',
        //   obj: { id: null },
        // };
      }
      const company = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect(
          'company.clientAgentId',
          'clients',
          'clients.id = :id',
          { id: agent.id }
        )
        .getOne();
      if (!company) {
        throw new HttpException('No agent found', HttpStatus.BAD_REQUEST);
        // return {
        //   title: 'No agent was found',
        //   errorType: 1,
        //   data: 'agent',
        // };
      }
      const agentObj = {};
      Object.assign({}, agent, company);
      return {
        message: 'Agent retrieved successfully',
        obj: agentObj,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOneByAgent() {
    try {
      const decoded = this.request.body.decodedUser;
      const agent = await this.agentRepository.findOne({
        where: {
          id: decoded.agent.id,
        },
      });
      if (!agent) {
        throw new HttpException('No agent found', HttpStatus.BAD_REQUEST);
      }
      const agentObj = await this.agentRepository.findOne({
        where: { id: agent.id },
        join: {
          alias: 'agent',
          leftJoinAndSelect: {
            company: 'agent.companies',
            lifecycles: 'company.Lifecycles',
            clients: 'lifecycles.clients',
          },
        },
      });
      if (!agentObj) {
        throw new HttpException('No agent found', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Agent retrieved successfully',
        obj: agentObj,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listClients() {
    try {
      const decoded = this.request.body.decodedUser;
      const clients = await this.clientRepository.find({
        where: {
          clientAgentId: decoded.agent.id,
        },
        join: {
          alias: 'client',
          leftJoinAndSelect: {
            clientLifcycle: 'client.clientLifcycle',
            drivers: 'client.drivers',
            vehicles: 'drivers.vehicles',
          },
        },
      });
      return {
        message: 'Clients retrieved successfully',
        obj: clients,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listAllClients() {
    try {
      const decoded = this.request.body.decodedUser;
      const agent = await this.agentRepository.findOne({
        where: { id: decoded.agent.id },
      });
      if (!agent) {
        throw new HttpException(
          'There was an error retrieving the agent',
          HttpStatus.BAD_REQUEST
        );
      }
      const clients = await this.clientRepository.find({
        where: { companyClientId: agent.companyAgentId },
        join: {
          alias: 'client',
          leftJoinAndSelect: {
            clientLifcycle: 'client.clientLifcycle',
            drivers: 'client.drivers',
            vehicles: 'drivers.vehicles',
          },
        },
      });
      if (!clients) {
        throw new HttpException(
          'There was an error retrieving the clients',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Clients retrieved successfully',
        obj: clients,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listUserForAgent() {
    try {
      const decoded = this.request.body.decodedUser;
      const agent = await this.agentRepository
        .createQueryBuilder('agent')
        .leftJoinAndSelect('company', 'agent.company')
        .leftJoinAndSelect('lifecycles', 'company.lifecycles')
        .leftJoinAndSelect('agents', 'company.agents')
        .orderBy({
          'company.id': 'ASC',
          'lifecycles.id': 'ASC',
        })
        .where({ id: decoded.agent.id })
        .getOne();
      if (!agent) {
        throw new HttpException(
          'There was an error retrieving Agent',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Lifecycles retrieved successfully',
        obj: agent,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, updateAgentBody: Agent) {
    try {
      const decoded = this.request.body.decodedUser;
      const password = updateAgentBody.password;
      const agent = await this.agentRepository.findOne({
        where: {
          id: id,
          companyAgentId: decoded.user.companyUserId,
        },
      });

      if (!agent) {
        throw new HttpException(
          'Error updating agent. No agent found',
          HttpStatus.BAD_REQUEST
        );
      }

      if (password && password !== '') {
        agent.password = bcrypt.hashSync(password, 10);
        await this.agentRepository.save(agent);
      }

      delete updateAgentBody.password;

      const updatedAgent = await this.agentRepository.save({
        ...agent,
        ...updateAgentBody,
      });

      const profile = {
        recipient: agent.email,
        profile: {
          email: agent.email,
        },
      };
      if (updatedAgent.phone) {
        profile.profile['phone'] = updatedAgent.phone;
      }

      const courierResp = await this.notificationService.updateCourierProfile(
        profile
      );

      return {
        title: 'Agent updated successfully',
      };
    } catch (error) {
      throw new HttpException('Error updating agent', HttpStatus.BAD_REQUEST);
    }
  }
  async updateNotification(updateAgentBody: Agent) {
    try {
      const decoded = this.request.body.decodedUser;
      const agent = await this.agentRepository.findOne({
        where: {
          id: updateAgentBody.id,
          companyAgentId: decoded.agent.companyAgentId,
        },
      });
      if (!agent) {
        throw new HttpException(
          'Error updating agent. No agent found',
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedAgent = await this.agentRepository.save({
        ...agent,
        ...updateAgentBody,
      });
      if (!updatedAgent) {
        throw new HttpException(
          'Error updating agent.',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Agent updated successfully',
      };
    } catch (error) {
      throw new HttpException('Error updating agent', HttpStatus.BAD_REQUEST);
    }
  }
  async updateSettings(settingsObj: object) {
    try {
      const decoded = this.request.body.decodedUser;
      const { settings }: any = settingsObj
      const agent = await this.agentRepository.findOne({
        where: { id: decoded.agent.id },
      });
      if (!agent) {
        throw new HttpException(
          'Error updating agent. No agent found',
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedAgent = await this.agentRepository.save({
        ...agent,
        ...{ settings: settings }
      })

      return {
        message: 'agent settings updated',
        obj: updatedAgent,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
