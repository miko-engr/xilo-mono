import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { Companies } from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { returnArrayOfKeyPairs, returnKeys } from './helper/company.helper';
import { CompanyDto } from './dto/company.dto';
import { Forms } from '../form/forms.entity';

/**
 * Company Service
 */
@Injectable({ scope: Scope.REQUEST })
export class CompanyService {
  constructor(
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Forms) private formRepository: Repository<Forms>
  ) {}

  /**
   * @param {number} id  The id of the Company
   * @returns One user given an id
   */
  async getById(id: number) {
    try {
      const company = await this.companyRepository
        .createQueryBuilder('companies')
        .where('companies.id = :id', { id: id })
        .leftJoinAndSelect('companies.Lifecycles', 'lifecycles')
        .leftJoinAndSelect('companies.agents', 'agents')
        .getOne();
      if (!company) {
        throw new HttpException('Company not found!', HttpStatus.BAD_REQUEST);
      }
      company['lifecycles'] = company.Lifecycles;
      const response = {
        title: 'Company found successfully',
        obj: company
      };
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listLifecycles(id) {
    try {
      const lifecyclesList = await this.companyRepository.createQueryBuilder("companies")
      .where("companies.id = :id", { id: id })
      .leftJoinAndSelect("companies.Lifecycles", "lifecycles")
      .orderBy('lifecycles.sequenceNumber', 'ASC')
      .getOne();
      return {
        title: 'Lifecycles retrieved successfully',
        obj: lifecyclesList 
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listByAgent(companyDto) {
    try {
      const decoded = companyDto.decodedUser;
      const company = await this.companyRepository.createQueryBuilder("companies")
      .where("companies.id = :id", { id: decoded.agent.companyAgentId })
      .leftJoinAndSelect("companies.Lifecycles", "lifecycles")
      .leftJoinAndSelect("companies.agents", "agents")
      .getOne();
       
      if (!company) {
        throw new HttpException('Company not found!', HttpStatus.BAD_REQUEST);
      }
      return { 
        title: 'Company retrieved',
        obj: company };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listLabelsInArray() {
    try {
      const keys = await returnArrayOfKeyPairs();
      return {
        title: 'Keys retrieved successfully',
        obj: keys
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listLabels(type, key) {
    try {
      let response;
      const keys = await returnKeys();
      if (key === 'all' && type === 'all') {
        response = keys;
      } else if (key === 'all' && type !== 'all') {
        response = keys[type];
      } else if (key !== 'all' && type !== 'all') {
        response = keys[type][key] ? keys[type][key] : null;
      }

      return {
        obj: response,
        title: 'Keys retrieved successfully'
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async listByCompanyId(companyId: number) {
    try {
      const company = await this.companyRepository.findOne({
        where: {
          isActive: true,
          companyId: companyId,
        },
      });
      if (!company) {
        throw new HttpException(
          'Error finding company',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        message: 'Company retrieved successfully',
        obj: company,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, companyDto: CompanyDto) {
    try {
      const company = await this.companyRepository.findOne({
        id: id,
      });

      if (!company) {
        throw new HttpException('Company not found!', HttpStatus.BAD_REQUEST);
      }

      const updatedCompany = Object.assign(company, companyDto);
      const companyResult = await this.companyRepository.save(updatedCompany);
      return {
            title: 'Company updated successfully',
            companyResult };
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }

  // TODO: Question and Answers joining pending
  async updateBrandColors(id: number, companyDto: CompanyDto) {
    try {
      if (!companyDto.brandColor) {
        throw new HttpException(
          'Error updating brand colors. No brand color sent',
          HttpStatus.BAD_REQUEST
        );
      }

      const company = await this.companyRepository.findOne({
        id: id,
      });

      if (!company) {
        throw new HttpException(
          'Error updating brand colors. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const forms = await this.formRepository.find({
        where: { companyFormId: company.id },
        join: {
          alias: 'forms',
          leftJoinAndSelect: {
            action: 'forms.Questions',
          },
        },
      });

      return forms;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
