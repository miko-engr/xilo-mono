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
import { Businesses } from './businesses.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
@Injectable({ scope: Scope.REQUEST })
export class BusinessService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Businesses)
    private businessesRepository: Repository<Businesses>
  ) {}
  async create(bodyObj: CreateBusinessDto) {
    try {
      const newBusiness = await this.businessesRepository.save(bodyObj);
      if (!newBusiness) {
        throw new HttpException(
          'Error creating business',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        title: 'New business created successfully',
        obj: newBusiness.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async delete(id: number) {
    try {
      const business = await this.businessesRepository.findOne({
        where: { id: id },
      });
      if (!business) {
        throw new HttpException(
          'Error deleting business. No business found with this ID!',
          HttpStatus.BAD_GATEWAY
        );
      }
      const response = await this.businessesRepository.delete(business);
      if (response.affected === 0) {
        throw new HttpException(
          'Error deleting business.',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        message: 'Business deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const business = await this.businessesRepository.findOne({
        where: {
          companyBusinessId: decoded.user.companyUserId,
        },
      });

      if (!business) {
        throw new HttpException(
          'Error finding business. Business not found!',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        message: 'Business retrieved successfully',
        obj: business,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async listOneById(id: number) {
    try {
      const business = await this.businessesRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!business) {
        throw new HttpException(
          'Error finding business. Business not found!',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        message: 'Business retrieved successfully',
        obj: business,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async upsert(bodyObj: CreateBusinessDto) {
    try {
      const business = await this.businessesRepository.save(bodyObj);
      if (!business) {
        throw new HttpException(
          'Error upserting business',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        title: 'Business upserted successfully',
        id: business.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
