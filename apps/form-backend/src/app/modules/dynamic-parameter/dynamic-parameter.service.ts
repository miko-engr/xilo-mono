import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DynamicParameters } from './dynamic-parameters.entity';
import { CreateDynamicParameterDto } from './dto/create-dynamic-parameter.dto';
@Injectable({ scope: Scope.REQUEST })
export class DynamicParameterService {
  constructor(
    @InjectRepository(DynamicParameters)
    private dynamicParametersRepository: Repository<DynamicParameters>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(dynamicParameterBody: CreateDynamicParameterDto) {
    try {
      const dynamicParameter = await this.dynamicParametersRepository.save(
        dynamicParameterBody
      );
      if (!dynamicParameter) {
        throw new HttpException(
          'Error creating dynamic Parameter',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Parameter created successfully',
        obj: dynamicParameter,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteDynamicParameter(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicParameter = await this.dynamicParametersRepository.findOne({
        where: {
          companyDynamicParameterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicParameter) {
        throw new HttpException(
          'No dynamic Parameter found',
          HttpStatus.BAD_REQUEST
        );
      }
      const deleteDynamicParameter = await this.dynamicParametersRepository.delete(
        dynamicParameter
      );
      if (deleteDynamicParameter.affected === 0) {
        throw new HttpException(
          'There was an error removing dynamic Parameter',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Dynamic Parameter removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicParameters = await this.dynamicParametersRepository.find({
        where: { companyDynamicParameterId: decoded.user.companyUserId },
      });
      if (!dynamicParameters) {
        throw new HttpException(
          'No dynamic Parameters found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Parameters retrieved successfully',
        obj: dynamicParameters,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicParameter = await this.dynamicParametersRepository.findOne({
        where: {
          companyDynamicParameterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicParameter) {
        throw new HttpException(
          'No dynamicParameter found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Parameter retrieved successfully',
        obj: dynamicParameter,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, dynamicParameterBody: CreateDynamicParameterDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicParameter = await this.dynamicParametersRepository.findOne({
        where: {
          companyDynamicParameterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicParameter) {
        throw new HttpException(
          'Error finding Dynamic Parameter',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedDynamicParameter = await this.dynamicParametersRepository.save(
        { ...dynamicParameter, ...dynamicParameterBody }
      );
      if (!updatedDynamicParameter) {
        throw new HttpException(
          'Error updating Dynamic Parameter',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Parameter updated successfully',
        obj: updatedDynamicParameter,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
