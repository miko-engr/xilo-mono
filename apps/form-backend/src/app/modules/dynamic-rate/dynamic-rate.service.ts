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
import { Users } from '../user/user.entity';
import { Companies } from '../company/company.entity';
import { DynamicRates } from './dynamic-rates.entity';
import { CreateDynamicRateDto } from './dto/create-dynamic-rate.dto';
import * as jwt from 'jsonwebtoken';

@Injectable({ scope: Scope.REQUEST })
export class DynamicRateService {
  constructor(
    @InjectRepository(DynamicRates)
    private dynamicRateRepository: Repository<DynamicRates>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>
  ) {}
  async create(dynamicRateBody: CreateDynamicRateDto) {
    try {
      const dynamicRate = await this.dynamicRateRepository.save(
        dynamicRateBody
      );
      if (!dynamicRate) {
        throw new HttpException(
          'Error creating dynamicRate',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Rate created successfully',
        obj: dynamicRate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteDynamicRate(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicRate = await this.dynamicRateRepository.findOne({
        where: {
          companyDynamicRateId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicRate) {
        throw new HttpException(
          'No dynamic Rate found',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedDynamicRate = await this.dynamicRateRepository.delete(
        dynamicRate
      );
      if (deletedDynamicRate.affected === 0) {
        throw new HttpException(
          'There was an error removing dynamicRate',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'DynamicRate removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async duplicate(dynamicRateBody: CreateDynamicRateDto) {
    try {
      const dynamicRate = await this.dynamicRateRepository.save(
        dynamicRateBody
      );
      if (!dynamicRate) {
        throw new HttpException(
          'Error creating dynamicRate',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Default Rates created successfully',
        obj: dynamicRate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async list(token: string) {
    try {
      const decoded = jwt.decode(token);
      const user = await this.userRepository.findOne({
        where: {
          id: decoded['user'].id,
        },
      });
      if (!user) {
        throw new HttpException(
          'Unauthrized - No user found with that ID',
          HttpStatus.BAD_REQUEST
        );
      }
      const raters = await this.dynamicRateRepository.find({
        relations: ['coverages', 'parameters'],
      });
      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rates retrieved successfully',
        obj: raters,
      };
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
      const raters = await this.dynamicRateRepository.find({
        where: {
          companyDynamicRateId: companyId,
        },
        relations: ['coverages', 'parameters', 'forms'],
      });
      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rates retrieved successfully',
        obj: raters,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndForm(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const companyId =
        typeof decoded.client !== 'undefined' && decoded.client
          ? decoded.client.companyClientId
          : decoded.user.companyUserId;
      const raters = await this.dynamicRateRepository.find({
        where: { companyDynamicRateId: companyId, id: id },
        join: {
          alias: 'rate',
          leftJoinAndSelect: {
            coverages: 'rate.coverages',
            parameters: 'rate.parameters',
            answer: 'parameters.answer',
          },
        },
      });
      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rates retrieved successfully',
        obj: raters,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndAutoForm(companyId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: companyId },
      });
      if (!company) {
        throw new HttpException(
          'Error finding dynamic rate. No company found',
          HttpStatus.BAD_REQUEST
        );
      }
      const rater = await this.dynamicRateRepository
        .createQueryBuilder('rate')
        .leftJoinAndSelect('rate.dynamicCoverages', 'dynamicCoverages')
        .leftJoinAndSelect('rate.formDynamicRateId', 'forms')
        .where({ companyFormId: company.id, isAuto: true })
        .orderBy('dynamicCoverages.position', 'ASC')
        .getOne();
      if (!rater) {
        throw new HttpException(
          'Error finding dynamic rate. No dynamic rates found.',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndFormId(companyId: number, formId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: companyId },
      });
      if (!company) {
        throw new HttpException(
          'Error finding dynamic rate. No company found',
          HttpStatus.BAD_REQUEST
        );
      }
      const rater = await this.dynamicRateRepository
        .createQueryBuilder('rate')
        .leftJoinAndSelect('rate.dynamicCoverages', 'dynamicCoverages')
        .leftJoinAndSelect('rate.formDynamicRateId', 'forms')
        .where({ companyFormId: company.id, id: formId })
        .orderBy('dynamicCoverages.position', 'ASC')
        .getOne();

      if (!rater) {
        throw new HttpException(
          'Error finding dynamic rate. No dynamic rates found.',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Dynamic rate found successfully',
        obj: rater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndHomeForm(companyId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const rater = await this.dynamicRateRepository
        .createQueryBuilder('rate')
        .leftJoinAndSelect('rate.dynamicCoverages', 'dynamicCoverages')
        .leftJoinAndSelect('rate.formDynamicRateId', 'forms')
        .where({ companyFormId: company.id, isHome: true })
        .orderBy('dynamicCoverages.position', 'ASC')
        .getOne();
      if (!rater) {
        throw new HttpException('No rater found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rates retrieved successfully',
        obj: rater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicRate = await this.dynamicRateRepository.findOne({
        where: {
          companyDynamicRateId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicRate) {
        throw new HttpException('No dynamicRate found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'DynamicRate retrieved successfully',
        obj: dynamicRate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, dynamicRateBody: CreateDynamicRateDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicRate = await this.dynamicRateRepository.findOne({
        companyDynamicRateId: decoded.user.companyUserId,
        id: id,
      });
      if (!dynamicRate) {
        throw new HttpException(
          'Error finding Dynamic Rate',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedRate = await this.dynamicRateRepository.save({
        ...dynamicRate,
        ...dynamicRateBody,
      });
      if (!updatedRate) {
        throw new HttpException(
          'Error updating Dynamic Rate',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Rate updated successfully',
        obj: updatedRate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createByTemplate(dynamicRateBody: CreateDynamicRateDto) {
    try {
      const dynamicRate = await this.dynamicRateRepository.save(
        dynamicRateBody
      );
      if (!dynamicRate) {
        throw new HttpException(
          'Error creating dynamic Rate',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic Rate created successfully',
        obj: dynamicRate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
