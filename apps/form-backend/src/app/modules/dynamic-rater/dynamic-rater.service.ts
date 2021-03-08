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
import { Forms } from '../form/forms.entity';
import { DynamicRaters } from './dynamic-raters.entity';
import { DynamicCoverages } from '../dynamic-coverage/dynamic-coverages.entity';
import { CreateDynamicRaterDto } from './dto/create-dynamic-rater.dto';
import { DynamicRates } from '../dynamic-rate/dynamic-rates.entity';

@Injectable({ scope: Scope.REQUEST })
export class DynamicRaterService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(DynamicRaters)
    private dynamicRaterRepository: Repository<DynamicRaters>,
    @InjectRepository(DynamicRates)
    private dynamicRatesRepository: Repository<DynamicRates>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Forms)
    private formsRepository: Repository<Forms>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(DynamicCoverages)
    private dynamicCoveragesRepository: Repository<DynamicCoverages>
  ) {}
  async create(dynamicRaterBody: CreateDynamicRaterDto) {
    try {
      const dynamicRater = this.dynamicRaterRepository.save(dynamicRaterBody);
      if (!dynamicRater) {
        throw new HttpException(
          'Error creating dynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'DynamicRater created successfully',
        obj: dynamicRater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteRater(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicRater = await this.dynamicRaterRepository.findOne({
        where: {
          companyDynamicRaterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicRater) {
        throw new HttpException(
          'No dynamic Rater found',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedDynamicRater = await this.dynamicRaterRepository.delete(
        dynamicRater
      );
      if (deletedDynamicRater.affected === 0) {
        throw new HttpException(
          'There was an error removing dynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'DynamicRater removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async duplicate(token: string, dynamicRaterBody: CreateDynamicRaterDto) {
    try {
      const dynamicRater = await this.dynamicRaterRepository.save(
        dynamicRaterBody
      );
      if (!dynamicRater) {
        throw new HttpException(
          'Error creating dynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Default Raters created successfully',
        obj: dynamicRater,
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
      const raters = await this.dynamicRaterRepository.find({
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
      const dRaters = await this.dynamicRaterRepository
        .createQueryBuilder('dRater')
        .leftJoinAndSelect('dRater.forms', 'forms')
        .leftJoinAndSelect('forms.dynamicRates', 'dynamicRates')
        .leftJoinAndSelect('dynamicRates.dynamicCoverages', 'dynamicCoverages')
        .leftJoinAndSelect('forms.pages', 'pages')
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('questions.conditions', 'conditions')
        .orderBy('forms.pages.position', 'ASC')
        .addOrderBy('forms.pages.questions.position', 'ASC')
        .addOrderBy('forms.pages.questions.answers.position', 'ASC')
        .where({ companyDynamicRaterId: companyId })
        .getMany();

      if (!dRaters) {
        throw new HttpException(
          'No raters found with that id',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Raters retrieved successfully',
        obj: dRaters,
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
      const raters = await this.dynamicRaterRepository
        .createQueryBuilder('dRater')
        .leftJoinAndSelect('dRater.coverages', 'coverages')
        .leftJoinAndSelect('dRater.parameters', 'parameters')
        .leftJoinAndSelect('parameters.answer', 'answer')
        .where({ companyDynamicRaterId: companyId, formRaterId: id })
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

      const dRater = await this.dynamicRaterRepository.findOne({
        where: {
          companyDynamicRaterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dRater) {
        throw new HttpException(
          'No rater found with that id',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Dynamic rater retrieved successfully',
        obj: dRater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, dynamicRaterBody: CreateDynamicRaterDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const dynamicRater = await this.dynamicRaterRepository.findOne({
        where: {
          companyDynamicRaterId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!dynamicRater) {
        throw new HttpException(
          'Error finding DynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedRater = await this.dynamicRaterRepository.save({
        ...dynamicRater,
        ...dynamicRaterBody,
      });
      if (!updatedRater) {
        throw new HttpException(
          'Error updating DynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'DynamicRater updated successfully',
        obj: updatedRater,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createByTemplate(dynamicRaterBody: CreateDynamicRaterDto) {
    try {
      const dynamicRater = await this.dynamicRaterRepository.save(
        dynamicRaterBody
      );
      if (!dynamicRater) {
        throw new HttpException(
          'Error creating dynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'DynamicRater created successfully',
        obj: dynamicRater,
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
        companyDynamicRaterId: decoded.user.companyUserId,
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
        companyDynamicRaterId: decoded.user.companyUserId,
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
      const dynamicRater = await this.dynamicRaterRepository.save(autoRater);
      if (!dynamicRater) {
        throw new HttpException(
          'Error creating dynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      const homeForm = await this.formsRepository.findOne({
        where: {
          isHome: true,
          companyFormId: decoded.user.companyUserId,
        },
      });
      if (!homeForm) {
        throw new HttpException(
          'Error creating dynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      homeRater.formRaterId = homeForm.id;
      const newRater = await this.dynamicRaterRepository.save(homeRater);
      if (!newRater) {
        throw new HttpException(
          'Error creating dynamicRater',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'DynamicRater created successfully',
        obj: { dynamicRater, newRater },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createDefaultHomeRater(companyId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: { id: companyId },
      });
      if (!company) {
        throw new HttpException(
          'No company with that id',
          HttpStatus.BAD_REQUEST
        );
      }
      const dHomeRater = await this.dynamicRaterRepository.save({
        title: 'Default Home Rater',
        state: '',
        companyDynamicRaterId: companyId,
      });
      const form = await this.formsRepository.findOne({
        where: { companyFormId: companyId, isHome: true },
      });
      if (!form) {
        throw new HttpException(
          'No Form found with that id',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedForm = await this.formsRepository.save({
        ...form,
        ...{
          hasDRates: true,
          dynamicRaterFormId: dHomeRater.id,
        },
      });
      if (!updatedForm) {
        throw new HttpException('Erro Form updating', HttpStatus.BAD_REQUEST);
      }
      const dRate = await this.dynamicRatesRepository.save({
        min: 399,
        max: 1199,
        base: 799,
        hasReplacementCost: true,
        costPerSqFt: 199,
        avBaseSqFt: 1500,
        premiumIncreasePerSqFt: 40,
        isAnnual: true,
        isMonthly: false,
        companyDynamicRateId: companyId,
        formDynamicRateId: form.id,
      });
      if (!dRate) {
        throw new HttpException(
          'Error creating dynamic rate',
          HttpStatus.BAD_REQUEST
        );
      }
      const coverages = [
        {
          title: 'Lowest Coverage',
          specs: [
            { title: 'Liability', coverage: '300000', moreInfo: null },
            { title: 'Deductible', coverage: '2500', moreInfo: null },
          ],
          premiumIncrease: -100,
          position: 0,
          image: `<svg class="svg-shield" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#D7EBFF;" d="M256,512c-2.424,0-4.847-0.528-7.098-1.582C121.37,450.56,38.957,326.669,38.957,194.783V83.479 c0-4.843,2.098-9.44,5.761-12.614c3.652-3.169,8.521-4.604,13.293-3.913c68.065,9.712,137.609-13.489,186.184-62.06 c6.521-6.521,17.087-6.521,23.609,0c48.577,48.565,118.142,71.745,186.184,62.06c4.783-0.696,9.641,0.745,13.293,3.913 c3.664,3.174,5.762,7.771,5.762,12.614v111.304c0,131.886-82.413,255.777-209.946,315.636C260.847,511.473,258.424,512,256,512z"/> <path style="fill:#B7C4CC;" d="M263.098,510.419c127.533-59.858,209.946-183.75,209.946-315.636V83.479 c0-4.843-2.098-9.44-5.761-12.614c-3.652-3.169-8.51-4.609-13.293-3.913c-68.044,9.685-137.609-13.495-186.184-62.06 C264.544,1.631,260.272,0,256,0v512C258.424,512,260.847,511.473,263.098,510.419z"/> <path style="fill:#ffffff;" d="M406.261,194.783v-43.951c0-8.521-6.413-15.674-14.891-16.598 c-44.967-4.896-88.587-20.653-126.141-45.56c-2.794-1.853-6.01-2.78-9.228-2.78V256h142.541 C403.516,235.97,406.261,215.461,406.261,194.783z"/> <path style="fill:${company.brandColor}" d="M264.663,433.908C332.886,392.498,380.781,327.492,398.541,256H256v180.332 C259,436.332,262.001,435.522,264.663,433.908z"/> <path style="fill:#FFFFFF;" d="M256,85.894c-3.218,0-6.435,0.927-9.228,2.78c-37.554,24.908-81.174,40.663-126.141,45.56 c-8.478,0.924-14.891,8.075-14.891,16.598v43.951c0,20.677,2.745,41.187,7.72,61.217H256V85.894z"/> <path style="fill:#ffffff;" d="M247.337,433.908c2.664,1.614,5.663,2.424,8.663,2.424V256H113.459 C131.22,327.489,179.114,392.495,247.337,433.908z"/> <g> </g> </svg>`,
          dynamicRateDynamicCoverageId: dRate.id,
          companyDynamicCoverageId: company.id,
        },
        {
          title: 'Good Coverage',
          specs: [
            { title: 'Liability', coverage: '300000', moreInfo: null },
            { title: 'Deductible', coverage: '1000', moreInfo: null },
          ],
          premiumIncrease: 0,
          position: 1,
          image: `<svg class="svg-shield" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#D7EBFF;" d="M256,512c-2.424,0-4.847-0.528-7.098-1.582C121.37,450.56,38.957,326.669,38.957,194.783V83.479 c0-4.843,2.098-9.44,5.761-12.614c3.652-3.169,8.521-4.604,13.293-3.913c68.065,9.712,137.609-13.489,186.184-62.06 c6.521-6.521,17.087-6.521,23.609,0c48.577,48.565,118.142,71.745,186.184,62.06c4.783-0.696,9.641,0.745,13.293,3.913 c3.664,3.174,5.762,7.771,5.762,12.614v111.304c0,131.886-82.413,255.777-209.946,315.636C260.847,511.473,258.424,512,256,512z"/> <path style="fill:#B7C4CC;" d="M263.098,510.419c127.533-59.858,209.946-183.75,209.946-315.636V83.479 c0-4.843-2.098-9.44-5.761-12.614c-3.652-3.169-8.51-4.609-13.293-3.913c-68.044,9.685-137.609-13.495-186.184-62.06 C264.544,1.631,260.272,0,256,0v512C258.424,512,260.847,511.473,263.098,510.419z"/> <path style="fill:#ffffff;" d="M406.261,194.783v-43.951c0-8.521-6.413-15.674-14.891-16.598 c-44.967-4.896-88.587-20.653-126.141-45.56c-2.794-1.853-6.01-2.78-9.228-2.78V256h142.541 C403.516,235.97,406.261,215.461,406.261,194.783z"/> <path style="fill:${company.brandColor}" d="M264.663,433.908C332.886,392.498,380.781,327.492,398.541,256H256v180.332 C259,436.332,262.001,435.522,264.663,433.908z"/> <path style="fill:#ffffff;" d="M256,85.894c-3.218,0-6.435,0.927-9.228,2.78c-37.554,24.908-81.174,40.663-126.141,45.56 c-8.478,0.924-14.891,8.075-14.891,16.598v43.951c0,20.677,2.745,41.187,7.72,61.217H256V85.894z"/> <path style="fill:${company.brandColor}" d="M247.337,433.908c2.664,1.614,5.663,2.424,8.663,2.424V256H113.459 C131.22,327.489,179.114,392.495,247.337,433.908z"/> <g> </g> </svg>`,
          dynamicRateDynamicCoverageId: dRate.id,
          companyDynamicCoverageId: company.id,
        },
        {
          title: 'Better Coverage',
          specs: [
            { title: 'Liability', coverage: '500000', moreInfo: null },
            { title: 'Deductible', coverage: '2500', moreInfo: null },
          ],
          premiumIncrease: 0,
          position: 2,
          image: `<svg class="svg-shield" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#D7EBFF;" d="M256,512c-2.424,0-4.847-0.528-7.098-1.582C121.37,450.56,38.957,326.669,38.957,194.783V83.479 c0-4.843,2.098-9.44,5.761-12.614c3.652-3.169,8.521-4.604,13.293-3.913c68.065,9.712,137.609-13.489,186.184-62.06 c6.521-6.521,17.087-6.521,23.609,0c48.577,48.565,118.142,71.745,186.184,62.06c4.783-0.696,9.641,0.745,13.293,3.913 c3.664,3.174,5.762,7.771,5.762,12.614v111.304c0,131.886-82.413,255.777-209.946,315.636C260.847,511.473,258.424,512,256,512z"/> <path style="fill:#B7C4CC;" d="M263.098,510.419c127.533-59.858,209.946-183.75,209.946-315.636V83.479 c0-4.843-2.098-9.44-5.761-12.614c-3.652-3.169-8.51-4.609-13.293-3.913c-68.044,9.685-137.609-13.495-186.184-62.06 C264.544,1.631,260.272,0,256,0v512C258.424,512,260.847,511.473,263.098,510.419z"/> <path style="fill:#ffffff;" d="M406.261,194.783v-43.951c0-8.521-6.413-15.674-14.891-16.598 c-44.967-4.896-88.587-20.653-126.141-45.56c-2.794-1.853-6.01-2.78-9.228-2.78V256h142.541 C403.516,235.97,406.261,215.461,406.261,194.783z"/> <path style="fill:${company.brandColor}" d="M264.663,433.908C332.886,392.498,380.781,327.492,398.541,256H256v180.332 C259,436.332,262.001,435.522,264.663,433.908z"/> <path style="fill:${company.brandColor}" d="M256,85.894c-3.218,0-6.435,0.927-9.228,2.78c-37.554,24.908-81.174,40.663-126.141,45.56 c-8.478,0.924-14.891,8.075-14.891,16.598v43.951c0,20.677,2.745,41.187,7.72,61.217H256V85.894z"/> <path style="fill:${company.brandColor}" d="M247.337,433.908c2.664,1.614,5.663,2.424,8.663,2.424V256H113.459 C131.22,327.489,179.114,392.495,247.337,433.908z"/> <g> </g> </svg>`,
          dynamicRateDynamicCoverageId: dRate.id,
          companyDynamicCoverageId: company.id,
        },
        {
          title: 'Best Coverage',
          specs: [
            { title: 'Liability', coverage: '500000', moreInfo: null },
            { title: 'Deductible', coverage: '1000', moreInfo: null },
          ],
          premiumIncrease: 50,
          position: 3,
          image: `<svg class="svg-shield" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#D7EBFF;" d="M256,512c-2.424,0-4.847-0.528-7.098-1.582C121.37,450.56,38.957,326.669,38.957,194.783V83.479 c0-4.843,2.098-9.44,5.761-12.614c3.652-3.169,8.521-4.604,13.293-3.913c68.065,9.712,137.609-13.489,186.184-62.06 c6.521-6.521,17.087-6.521,23.609,0c48.577,48.565,118.142,71.745,186.184,62.06c4.783-0.696,9.641,0.745,13.293,3.913 c3.664,3.174,5.762,7.771,5.762,12.614v111.304c0,131.886-82.413,255.777-209.946,315.636C260.847,511.473,258.424,512,256,512z"/> <path style="fill:#B7C4CC;" d="M263.098,510.419c127.533-59.858,209.946-183.75,209.946-315.636V83.479 c0-4.843-2.098-9.44-5.761-12.614c-3.652-3.169-8.51-4.609-13.293-3.913c-68.044,9.685-137.609-13.495-186.184-62.06 C264.544,1.631,260.272,0,256,0v512C258.424,512,260.847,511.473,263.098,510.419z"/> <path style="fill:${company.brandColor}" d="M406.261,194.783v-43.951c0-8.521-6.413-15.674-14.891-16.598 c-44.967-4.896-88.587-20.653-126.141-45.56c-2.794-1.853-6.01-2.78-9.228-2.78V256h142.541 C403.516,235.97,406.261,215.461,406.261,194.783z"/> <path style="fill:${company.brandColor}" d="M264.663,433.908C332.886,392.498,380.781,327.492,398.541,256H256v180.332 C259,436.332,262.001,435.522,264.663,433.908z"/> <path style="fill:${company.brandColor}" d="M256,85.894c-3.218,0-6.435,0.927-9.228,2.78c-37.554,24.908-81.174,40.663-126.141,45.56 c-8.478,0.924-14.891,8.075-14.891,16.598v43.951c0,20.677,2.745,41.187,7.72,61.217H256V85.894z"/> <path style="fill:${company.brandColor}" d="M247.337,433.908c2.664,1.614,5.663,2.424,8.663,2.424V256H113.459 C131.22,327.489,179.114,392.495,247.337,433.908z"/> <g> </g> </svg>`,
          dynamicRateDynamicCoverageId: dRate.id,
          companyDynamicCoverageId: company.id,
        },
      ];
      const newCoverages = await this.dynamicCoveragesRepository.save(
        coverages
      );

      return {
        title: 'Dynamic Rater created successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
