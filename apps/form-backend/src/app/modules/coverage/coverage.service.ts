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
import { Coverages } from './coverages.entity';
import { CreateCoverageDto } from './dto/create-coverage.dto';
@Injectable({ scope: Scope.REQUEST })
export class CoverageService {
  constructor(
    @InjectRepository(Coverages)
    private coveragesRepository: Repository<Coverages>,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(coverageBody: CreateCoverageDto) {
    try {
      const coverage = await this.coveragesRepository.save(coverageBody);
      if (!coverage) {
        throw new HttpException(
          'Error creating coverage',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Coverage created successfully',
        obj: coverage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteCoverage(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const coverage = await this.coveragesRepository.findOne({
        where: { companyCoverageId: decoded.user.companyUserId, id: id },
      });
      if (!coverage) {
        throw new HttpException('No coverage found', HttpStatus.BAD_REQUEST);
      }
      const deleteCoverage = await this.coveragesRepository.delete(coverage.id);
      if (deleteCoverage.affected === 0) {
        throw new HttpException(
          'Coverage not deleted!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Coverage removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const coverages = await this.coveragesRepository.find({
        where: { companyCoverageId: decoded.user.companyUserId },
      });
      if (!coverages) {
        throw new HttpException('No coverages found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Coverages retrieved successfully',
        obj: coverages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async listOne(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const coverage = await this.coveragesRepository.findOne({
        where: { companyCoverageId: decoded.user.companyUserId, id: id },
      });
      if (!coverage) {
        throw new HttpException('No coverage found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Coverage retrieved successfully',
        obj: coverage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: number, coverageBody: CreateCoverageDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const coverage = await this.coveragesRepository.findOne({
        where: { companyCoverageId: decoded.user.companyUserId, id: id },
      });
      if (!coverage) {
        throw new HttpException('No coverage found', HttpStatus.BAD_REQUEST);
      }
      const updatedCoverage = await this.coveragesRepository.save({
        ...coverage,
        ...coverageBody,
      });
      if (!updatedCoverage) {
        throw new HttpException(
          'Error updating Coverage',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Coverage updated successfully',
        obj: updatedCoverage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
