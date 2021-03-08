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
import { DynamicCoverages } from './dynamic-coverages.entity';
import { Companies } from '../company/company.entity';
import { CreateDynamicCoverageDto } from './dto/create-dynamic-coverage.dto';
@Injectable({ scope: Scope.REQUEST })
export class DynamicCoverageService {
  constructor(
    @InjectRepository(DynamicCoverages)
    private dynamicCoveragesRepository: Repository<DynamicCoverages>,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(dynamicCoverageBody: CreateDynamicCoverageDto) {
    try {
      const dynamicCoverage = await this.dynamicCoveragesRepository.save(
        dynamicCoverageBody
      );
      if (!dynamicCoverage) {
        throw new HttpException(
          'Error creating dynamic Coverage',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Coverage created successfully',
        obj: dynamicCoverage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteDynamicCoverage(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicCoverage = await this.dynamicCoveragesRepository.findOne({
        where: {
          companyDynamicCoverageId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicCoverage) {
        throw new HttpException(
          'No dynamic Coverage found',
          HttpStatus.BAD_REQUEST
        );
      }
      const deleteDynamicCoverage = await this.dynamicCoveragesRepository.delete(
        dynamicCoverage.id
      );
      if (deleteDynamicCoverage.affected === 0) {
        throw new HttpException(
          'There was an error removing dynamic Coverage',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Dynamic Coverage removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicCoverages = await this.dynamicCoveragesRepository.find({
        where: { companyDynamicCoverageId: decoded.user.companyUserId },
      });
      if (!dynamicCoverages) {
        throw new HttpException(
          'No dynamic Coverages found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Coverages retrieved successfully',
        obj: dynamicCoverages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndDynamicRate(companyId: number, dynamicRateId: number) {
    try {
      const company = await this.companyRepository.findOne({
        where: {
          companyId: companyId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const dynamicCoverages = await this.dynamicCoveragesRepository.find({
        where: {
          dynamicRateDynamicCoverageId: dynamicRateId,
        },
        order: { position: 'ASC' },
      });
      if (!dynamicCoverages) {
        throw new HttpException(
          'No dynamic Coverages found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Coverages retrieved successfully',
        obj: dynamicCoverages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicCoverage = await this.dynamicCoveragesRepository.findOne({
        where: {
          companyDynamicCoverageId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicCoverage) {
        throw new HttpException(
          'No dynamic Coverage found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Coverage retrieved successfully',
        obj: dynamicCoverage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, dynamicCoverageBody: CreateDynamicCoverageDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicCoverage = await this.dynamicCoveragesRepository.findOne({
        where: {
          companyDynamicCoverageId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicCoverage) {
        throw new HttpException(
          'Error finding Dynamic Coverage',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedDynamicCoverage = await this.dynamicCoveragesRepository.save(
        { ...dynamicCoverage, ...dynamicCoverageBody }
      );
      if (!updatedDynamicCoverage) {
        throw new HttpException(
          'Error updating DynamicCoverage',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'DynamicCoverage updated successfully',
        obj: updatedDynamicCoverage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
