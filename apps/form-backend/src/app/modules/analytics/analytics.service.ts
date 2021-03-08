import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agents } from '../agent/agent.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Clients } from '../client/client.entity';
@Injectable({ scope: Scope.REQUEST })
export class AnalyticsService {
  constructor(
    @InjectRepository(Agents) private agentRepository: Repository<Agents>,
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Lifecycles)
    private LifecycleRepository: Repository<Lifecycles>
  ) {}
  async getClients() {
    try {
      const clients = await this.clientRepository.find({});
      if (!clients) {
        throw new HttpException(
          'There was an error retrieving clients',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Clients retrieved successfully',
        obj: clients,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAgents() {
    try {
      const agents = await this.agentRepository.find({});
      if (!agents) {
        throw new HttpException(
          'There was an error retrieving agents',
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
  async getLifecycles() {
    try {
      const lifecycles = await this.LifecycleRepository.find({});
      if (!lifecycles) {
        throw new HttpException(
          'There was an error retrieving lifecycles',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Lifecycles retrieved successfully',
        obj: lifecycles,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
