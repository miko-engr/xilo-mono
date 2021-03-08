import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Between } from 'typeorm';
import { Tasks } from './tasks.entity';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable({ scope: Scope.REQUEST })
export class TaskService {
  constructor(
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(bodyObj: CreateTasksDto) {
    try {
      const newTask = await this.tasksRepository.save(bodyObj);
      if (!newTask) {
        throw new HttpException('Error creating task', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'New task created successfully',
        obj: newTask.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async delete(ids: number[]) {
    try {
      const response = await this.tasksRepository.delete(ids);
      if (response.affected === 0) {
        throw new HttpException('Error deleting task', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Tasks deleted successfully',
        obj: response,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const task = await this.tasksRepository.findOne({
        where: {
          companyTaskId: decoded.user.companyUserId,
        },
      });

      if (!task) {
        throw new HttpException(
          'Error finding task. Task not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Task retrieved successfully',
        obj: task,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOneById(id: number) {
    try {
      const task = await this.tasksRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!task) {
        throw new HttpException(
          'Error finding task. Task not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Task retrieved successfully',
        obj: task,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByAgent() {
    try {
      const agent = this.request.body.decodedUser.agent;
      let tasks = await this.tasksRepository
        .createQueryBuilder('task')
        .where({ agentTaskId: agent.id })
        .leftJoinAndSelect('task.client', 'client')
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.business', 'business')
        .orderBy('scheduledDate', 'ASC')
        .addOrderBy('client.createdAt', 'ASC')
        .addOrderBy('drivers.createdAt', 'ASC')
        .getMany();

      if (!tasks) {
        throw new HttpException(
          'Error finding task. Task not found!',
          HttpStatus.BAD_REQUEST
        );
      }

      if (tasks.length && tasks.length > 0) {
        tasks = tasks.sort(
          (a, b) => +new Date(a.scheduledDate) - +new Date(b.scheduledDate)
        );
      }

      return {
        message: 'Tasks retrieved successfully',
        obj: tasks,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByAgentTable() {
    try {
      const decoded = this.request.body.decodedUser.agent;
      const params = this.request.query;
      const today = new Date();
      const limit = params.limit
        ? parseInt(params['limit'] as string, 10)
        : 100;
      const offset = params.offset
        ? parseInt(params['offset'] as string, 10)
        : 0;

      const daysAgoDate = new Date().setDate(
        today.getDate() - (params.date !== 'allTime' ? +params.date + 1 : 0)
      );
      const searchFilter: any = [{ agentTaskId: decoded.id }];
      if (params.date && params.date !== 'null' && params.date !== 'allTime') {
        searchFilter.push({
          createdAt: Between(new Date(daysAgoDate), new Date(today)),
        });
      }
      if (params.type && params.type !== 'all' && params.type !== 'null') {
        searchFilter.push({ type: params.type });
      }
      const tasksList = await this.tasksRepository
        .createQueryBuilder('task')
        .where(searchFilter)
        .leftJoinAndSelect('task.client', 'client')
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.business', 'business')
        .orderBy('scheduledDate', 'ASC')
        .addOrderBy('client.createdAt', 'ASC')
        .addOrderBy('drivers.createdAt', 'ASC')
        .getManyAndCount();
      if (!tasksList) {
        throw new HttpException(
          'Error finding task. Task not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Task found successfully',
        obj: tasksList,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async upsert(bodyObj: CreateTasksDto) {
    try {
      const task = await this.tasksRepository.save(bodyObj);
      return {
        title: 'Task upserted successfully',
        id: task.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
