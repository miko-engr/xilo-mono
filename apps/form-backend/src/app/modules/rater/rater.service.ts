import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
import { Forms } from '../form/forms.entity';
import { Raters } from './raters.entity';
import { CreateRaterDto } from './dto/create-rater.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable({ scope: Scope.REQUEST })
export class RaterService {
  constructor(
    @InjectRepository(Raters)
    private ratersRepository: Repository<Raters>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Forms)
    private formsRepository: Repository<Forms>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(raterBody: CreateRaterDto) {
    try {
      const rater = await this.ratersRepository.save(raterBody);
      if (!rater) {
        throw new HttpException('Error creating rater', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rater created successfully',
        obj: rater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteRater(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const rater = await this.ratersRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!rater) {
        throw new HttpException('No rater found', HttpStatus.BAD_REQUEST);
      }
      const deletedRater = await this.ratersRepository.delete(rater);
      if (deletedRater.affected === 0) {
        throw new HttpException(
          'There was an error removing rater',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Rater removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async duplicate(raterBody: CreateRaterDto) {
    try {
      const rater = await this.ratersRepository.save(
        this.ratersRepository.create(raterBody)
      );
      if (!rater) {
        throw new HttpException('Error creating rater', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Default Raters created successfully',
        obj: rater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async list() {
    try {
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository.findOne({
        where: { id: decoded.user.id },
      });
      if (!user) {
        throw new HttpException(
          'Unauthrized - No user found with that ID',
          HttpStatus.BAD_REQUEST
        );
      }
      const raters = await this.ratersRepository.find({
        relations: ['coverages', 'parameters'],
      });
      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Raters retrieved successfully',
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
      const raters = await this.ratersRepository.find({
        where: { companyRaterId: companyId },
        relations: ['coverages', 'parameters'],
      });
      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Raters retrieved successfully',
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
      const raters = await this.ratersRepository
        .createQueryBuilder('rater')
        .where({
          companyRaterId: companyId,
          formRaterId: id,
        })
        .leftJoinAndSelect('rater.coverages', 'coverages')
        .leftJoinAndSelect('rater.parameters', 'parameters')
        .leftJoinAndSelect('parameters.answer', 'answer')
        .getMany();
      if (!raters) {
        throw new HttpException('No raters found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Raters retrieved successfully',
        obj: raters,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const rater = await this.ratersRepository.findOne({
        where: {
          companyRaterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!rater) {
        throw new HttpException('No rater found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rater retrieved successfully',
        obj: rater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, raterBody: CreateRaterDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const rater = await this.ratersRepository.findOne({
        where: {
          companyRaterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!rater) {
        throw new HttpException('No rater found', HttpStatus.BAD_REQUEST);
      }
      const updatedRater = await this.ratersRepository.save({
        ...rater,
        ...raterBody,
      });
      if (!updatedRater) {
        throw new HttpException('Error updating Rater', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rater updated successfully',
        obj: updatedRater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createByTemplate(raterBody: CreateRaterDto) {
    try {
      const rater = await this.ratersRepository.save(
        this.ratersRepository.create(raterBody)
      );
      if (!rater) {
        throw new HttpException('Error creating rater', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rater created successfully',
        obj: rater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createByDefault() {
    try {
      const decoded = this.request.body.decodedUser;
      const autoRater = {
        title: 'Auto Default',
        state: 'Default',
        carrier: 'Default',
        formRaterId: null,
        isAuto: true,
        isHome: false,
        companyRaterId: decoded.user.companyUserId,
        parameters: [
          {
            title: 'Gender - Female',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'applicantGenderCd',
            conditionalValue: 'Female',
            percentChange: 1.02,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'Marital Status - Married',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'applicantMaritalStatusCd',
            conditionalValue: 'Married',
            percentChange: 0.93,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'Occupation - Unemployed',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'applicantOccupationClassCd',
            conditionalValue: 'Unemployed',
            percentChange: 1.15,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'Prior Penalties - 1',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'priorPenalties',
            conditionalValue: '1',
            percentChange: 1.35,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'Prior Penalties - 2',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'priorPenalties',
            conditionalValue: '2',
            percentChange: 3,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'Prior Penalties - 3',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'priorPenalties',
            conditionalValue: '3',
            percentChange: 4.5,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'Insured For Last 6 Months',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'currentlyInsured',
            conditionalValue: 'false',
            percentChange: 1.6,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'Parked Near City',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'isGaragedNearCity',
            conditionalValue: 'true',
            percentChange: 1.35,
            companyParameterId: decoded.user.companyUserId,
          },
          {
            title: 'High Performance Vehicle',
            isDriver: true,
            isVehicle: false,
            propertyKey: 'isHighPerformanceVehicle',
            conditionalValue: 'true',
            percentChange: 1.15,
            companyParameterId: decoded.user.companyUserId,
          },
        ],
        coverages: [
          {
            title: 'Low',
            isAuto: true,
            isHome: false,
            basePrice: 73,
            minPrice: 32,
            maxPrice: 98,
            companyCoverageId: decoded.user.companyUserId,
            position: 0,
          },
          {
            title: 'Good',
            isAuto: true,
            isHome: false,
            basePrice: 85,
            minPrice: 69,
            maxPrice: 98,
            companyCoverageId: decoded.user.companyUserId,
            position: 1,
          },
          {
            title: 'Better',
            isAuto: true,
            isHome: false,
            basePrice: 149,
            minPrice: 129,
            maxPrice: 198,
            companyCoverageId: decoded.user.companyUserId,
            position: 2,
          },
          {
            title: 'Best',
            isAuto: true,
            isHome: false,
            basePrice: 192,
            minPrice: 145,
            maxPrice: 250,
            companyCoverageId: decoded.user.companyUserId,
            position: 3,
          },
        ],
      };
      const homeRater = {
        title: 'Home Default',
        state: 'Default',
        carrier: 'Default',
        formRaterId: null,
        isAuto: false,
        isHome: true,
        companyRaterId: decoded.user.companyUserId,
        parameters: [],
        coverages: [
          {
            title: 'Low',
            isAuto: false,
            isHome: true,
            basePrice: 1228,
            minPrice: 901,
            maxPrice: 1420,
            liabilityLimit: '100000',
            deductible: '5000',
            hasMarketValue: true,
            hasDwellingCoverage: true,
            companyCoverageId: decoded.user.companyUserId,
            position: 0,
          },
          {
            title: 'Good',
            isAuto: false,
            isHome: true,
            basePrice: 2252,
            minPrice: 1999,
            maxPrice: 2569,
            liabilityLimit: '300000',
            deductible: '1000',
            hasMarketValue: true,
            hasDwellingCoverage: true,
            companyCoverageId: decoded.user.companyUserId,
            position: 1,
          },
          {
            title: 'Better',
            isAuto: false,
            isHome: true,
            basePrice: 3295,
            minPrice: 2987,
            maxPrice: 3609,
            liabilityLimit: '500000',
            deductible: '1000',
            hasMarketValue: true,
            hasDwellingCoverage: true,
            companyCoverageId: decoded.user.companyUserId,
            position: 2,
          },
          {
            title: 'Best',
            isAuto: false,
            isHome: true,
            basePrice: 4295,
            minPrice: 3986,
            maxPrice: 4900,
            liabilityLimit: '500000',
            deductible: '1000',
            hasMarketValue: true,
            hasDwellingCoverage: true,
            companyCoverageId: decoded.user.companyUserId,
            position: 3,
          },
        ],
      };
      const form = await this.formsRepository.findOne({
        where: {
          isAuto: true,
          companyFormId: decoded.user.companyUserId,
        },
      });
      if (!form) {
        throw new HttpException(
          'No form found for rating',
          HttpStatus.BAD_REQUEST
        );
      }
      autoRater.formRaterId = form.id;
      const newAutoRater = await this.ratersRepository.save(
        this.ratersRepository.create(autoRater)
      );
      if (!newAutoRater) {
        throw new HttpException('Error creating rater', HttpStatus.BAD_REQUEST);
      }
      const homeForm = await this.formsRepository.findOne({
        where: {
          isHome: true,
          companyFormId: decoded.user.companyUserId,
        },
      });
      if (!homeForm) {
        throw new HttpException(
          'No home form found for rating',
          HttpStatus.BAD_REQUEST
        );
      }
      homeRater.formRaterId = homeForm.id;
      const newHomeRater = await this.ratersRepository.save(
        this.ratersRepository.create(homeRater)
      );
      if (!newHomeRater) {
        throw new HttpException('Error creating rater', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Rater created successfully',
        obj: { newAutoRater, newHomeRater },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
