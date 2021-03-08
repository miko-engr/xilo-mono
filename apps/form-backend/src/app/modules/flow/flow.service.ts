import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository, Like, Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Flows } from './flows.entity';
import { CreateFlowDto } from './dto/create-flow.dto';
@Injectable({ scope: Scope.REQUEST })
export class FlowService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Flows) private flowsRepository: Repository<Flows>
  ) {}
  async create(bodyObj: CreateFlowDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const newFlow = await this.flowsRepository.save(bodyObj);
      if (!newFlow) {
        throw new HttpException('Error create Flow.', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'New Flow Created Successfully',
        obj: newFlow,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteFlow(id) {
    try {
      const decoded = this.request.body.decodedUser;
      const flow = await this.flowsRepository.findOne({
        where: {
          companyFlowId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!flow) {
        throw new HttpException('No flow found!', HttpStatus.BAD_REQUEST);
      }
      const deletedFlow = await this.flowsRepository.delete(flow);
      if (deletedFlow.affected === 0) {
        throw new HttpException('Error flow delete', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Flow removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findSearch(searchTitle: string) {
    try {
      const decoded = this.request.body.decodedUser;
      const flows = await this.flowsRepository.find({
        where: {
          title: Like(`%${searchTitle}%`),
          companyFlowId: decoded.user.companyUserId,
        },
      });
      if (!flows) {
        throw new HttpException('No flows found!', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Search records',
        obj: flows,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const flows = await this.flowsRepository.find({
        where: { companyFlowId: decoded.user.companyUserId },
      });
      if (!flows) {
        throw new HttpException('No flows found!', HttpStatus.BAD_REQUEST);
      }

      flows.sort(
        (a, b) =>
          +b.isEnabled - +a.isEnabled || +b.isNewClientFlow - +a.isNewClientFlow
      );
      return {
        title: 'Flows retrieved successfully',
        obj: flows,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listNewLeadFlowByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const flows = await this.flowsRepository.findOne({
        where: {
          companyFlowId: decoded.user.companyUserId,
          isNewClientFlow: true,
        },
      });
      if (!flows) {
        throw new HttpException('No flows found!', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Flows retrieved successfully',
        obj: flows,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const flow = await this.flowsRepository.findOne({
        where: {
          companyFlowId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!flow) {
        throw new HttpException('No flow found!', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Flow retrieved successfully',
        obj: flow,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, bodyObj: CreateFlowDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const flow = await this.flowsRepository.findOne({
        where: {
          companyFlowId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!flow) {
        throw new HttpException('No flow found!', HttpStatus.BAD_REQUEST);
      }
      const updatedFlow = await this.flowsRepository.save({
        ...flow,
        ...bodyObj,
      });
      if (!updatedFlow) {
        throw new HttpException('Error flow update!', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Flow retrieved successfully',
        obj: updatedFlow,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
