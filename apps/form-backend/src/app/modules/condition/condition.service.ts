import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Companies } from '../company/company.entity';
import { CreateConditionDto } from './dto/create-condition.dto';
import { Condition } from './interface/condtion.interface';
import { Conditions } from './conditions.entity';
@Injectable({ scope: Scope.REQUEST })
export class ConditionService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Conditions)
    private conditionsRepository: Repository<Conditions>
  ) {}
  async upsertMany(conditions: CreateConditionDto[]) {
    try {
      const decoded = this.request.body.decodedUser;

      const company = await this.companyRepository.findOne({
        where: { id: decoded.user.companyUserId },
      });

      if (!conditions) {
        throw new HttpException(
          'Error upserting conditions. No condition found',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!company) {
        throw new HttpException(
          'Error upserting conditions. No company found with token',
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedConditions = await Promise.all(
        conditions.map(async (condition) => {
          try {
            condition.companyConditionId = company.id;
            const updatedCondition = await this.conditionsRepository.save(
              condition
            );
            condition.id = updatedCondition.id;
            return updatedCondition;
          } catch (error) {}
        })
      );

      return {
        title: 'Conditions upserted successfully',
        obj: updatedConditions,
      };
    } catch (error) {
      throw new HttpException(
        'Error upserting conditions',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async delete(id: number) {
    try {
      const condition = await this.conditionsRepository.findOne({
        where: { id: id },
      });

      if (!condition) {
        throw new HttpException(
          'Error deleting condition. No condition found',
          HttpStatus.BAD_REQUEST
        );
      }

      const deleteCondition = await this.conditionsRepository.delete(condition);
      if (deleteCondition.affected === 0) {
        throw new HttpException(
          'Condition not deleted!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Condition deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Error deleting condition. Method failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
