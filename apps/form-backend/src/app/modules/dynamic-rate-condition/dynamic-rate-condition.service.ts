import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicRateConditions } from './dynamic-rate-condition.entity';
import { Companies } from '../company/company.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DynamicRateConditionDto } from './dto/dynamic-rate-condition.dto';
import { DynamicRateCondition } from './interface/dynamic-rate-condition.interface';

@Injectable({ scope: Scope.REQUEST })
export class DynamicRateConditionService {
  constructor(
    @InjectRepository(DynamicRateConditions)
    private dynamicRateConditionRepository: Repository<DynamicRateConditions>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @Inject(REQUEST) private request: Request
  ) {}

  async list() {
    try {
      const raters = await this.companiesRepository
        .createQueryBuilder('companies')
        .leftJoinAndSelect(
          'companies.dynamicRateConditions',
          'dynamicRateConditions'
        )
        .leftJoinAndSelect('companies.coverages', 'coverages')
        .leftJoinAndSelect('companies.parameters', 'parameters')
        .getMany();

      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }

      return raters;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const companyId =
        typeof decoded.client !== 'undefined' && decoded.client
          ? decoded.client.companyClientId
          : decoded.user.companyUserId;
      const raters = await this.companiesRepository
        .createQueryBuilder('companies')
        .where(companyId)
        .leftJoinAndSelect(
          'companies.dynamicRateConditions',
          'dynamicRateConditions'
        )
        .leftJoinAndSelect('companies.coverages', 'coverages')
        .leftJoinAndSelect('companies.parameters', 'parameters')
        .getMany();

      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return raters;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async listOne(id: number) {
    try {
      const dynamicRateCondition = await this.dynamicRateConditionRepository
        .createQueryBuilder('dynamicRateCondition')
        .where({
          id: id,
          companyDynamicRateConditionId: this.request.body.decodedUser.user
            .companyUserId,
        })
        .getOne();
      if (!dynamicRateCondition) {
        throw new HttpException(
          'No dynamicRateCondition found',
          HttpStatus.BAD_REQUEST
        );
      }
      return dynamicRateCondition;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async listByCompanyAndForm() {
    try {
      const decoded = this.request.body.decodedUser;
      const companyId =
        typeof decoded.client !== 'undefined' && decoded.client
          ? decoded.client.companyClientId
          : decoded.user.companyUserId;

      const raters = await this.companiesRepository
        .createQueryBuilder('companies')
        .where({ id: companyId })
        .leftJoinAndSelect(
          'companies.dynamicRateConditions',
          'dynamicRateConditions'
        )
        .leftJoinAndSelect('companies.coverages', 'coverages')
        .leftJoinAndSelect('companies.parameters', 'parameters')
        .getMany();
      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return raters;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async create(
    dynamicRateConditionDto: DynamicRateConditionDto
  ): Promise<DynamicRateCondition> {
    try {
      const dynamicRateCondition = this.dynamicRateConditionRepository.save(
        dynamicRateConditionDto
      );

      if (!dynamicRateCondition) {
        throw new HttpException(
          'Error creating Condition',
          HttpStatus.BAD_REQUEST
        );
      }
      return dynamicRateCondition;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: number): Promise<DynamicRateCondition> {
    try {
      const decoded = this.request.body.decodedUser;
      const exsitingDynamicRateConditionObj = await this.dynamicRateConditionRepository.findOne(
        {
          where: {
            id: id,
            companyDynamicRateConditionId: decoded.user.companyUserId,
          },
        }
      );

      if (!exsitingDynamicRateConditionObj) {
        throw new HttpException(
          'Error finding Dynamic Rate',
          HttpStatus.BAD_REQUEST
        );
      }
      let dynamicRateConditionObj;
      dynamicRateConditionObj.operator =
        this.request.body.operator !== null &&
        typeof this.request.body.operator !== 'undefined'
          ? this.request.body.operator
          : exsitingDynamicRateConditionObj.operator;
      dynamicRateConditionObj.value =
        this.request.body.value !== null &&
        typeof this.request.body.value !== 'undefined'
          ? this.request.body.value
          : exsitingDynamicRateConditionObj.value;
      dynamicRateConditionObj.valueRange =
        this.request.body.valueRange !== null &&
        typeof this.request.body.valueRange !== 'undefined'
          ? this.request.body.valueRange
          : exsitingDynamicRateConditionObj.valueRange;
      dynamicRateConditionObj.multiplier =
        this.request.body.multiplier !== null &&
        typeof this.request.body.multiplier !== 'undefined'
          ? this.request.body.multiplier
          : exsitingDynamicRateConditionObj.multiplier;
      dynamicRateConditionObj.increase =
        this.request.body.increase !== null &&
        typeof this.request.body.increase !== 'undefined'
          ? this.request.body.increase
          : exsitingDynamicRateConditionObj.increase;
      dynamicRateConditionObj.change =
        this.request.body.change !== null &&
        typeof this.request.body.change !== 'undefined'
          ? this.request.body.change
          : exsitingDynamicRateConditionObj.change;
      dynamicRateConditionObj.answers =
        this.request.body.answerDynamicRateConditionId !== null &&
        typeof this.request.body.answerDynamicRateConditionId !== 'undefined'
          ? this.request.body.answerDynamicRateConditionId
          : exsitingDynamicRateConditionObj.answers;

      const updated: DynamicRateConditionDto = Object.assign(
        exsitingDynamicRateConditionObj,
        dynamicRateConditionObj
      );
      const updatedDynamicRateCondition = await this.dynamicRateConditionRepository.save(
        updated
      );

      if (!updatedDynamicRateCondition) {
        throw new HttpException(
          'Error updating Dynamic Rate',
          HttpStatus.BAD_REQUEST
        );
      }
      return updatedDynamicRateCondition;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteRateCondition(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const exsitingDynamicRateCondition = await this.dynamicRateConditionRepository.findOne(
        {
          where: {
            id: id,
            companyDynamicRateConditionId: decoded.user.companyUserId,
          },
        }
      );
      if (!exsitingDynamicRateCondition) {
        throw new HttpException(
          'Error finding Dynamic Rate',
          HttpStatus.BAD_REQUEST
        );
      }
      const DeleteDynamicRateCondition = await this.dynamicRateConditionRepository.delete(
        id
      );
      if (!DeleteDynamicRateCondition) {
        throw new HttpException(
          'There was an error removing dynamicRateCondition',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'DynamicRateCondition removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async duplicate(dynamicRateConditionDto: DynamicRateConditionDto) {
    try {
      const dynamicRateConditionResponse = await this.dynamicRateConditionRepository.save(
        this.dynamicRateConditionRepository.create({
          ...dynamicRateConditionDto,
        })
      );

      if (!dynamicRateConditionResponse) {
        throw new HttpException(
          'Error creating dynamicRateCondition',
          HttpStatus.BAD_REQUEST
        );
      }
      return dynamicRateConditionResponse;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
