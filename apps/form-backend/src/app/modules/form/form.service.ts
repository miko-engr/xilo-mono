import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import * as _ from 'lodash';
import * as csv from 'csvtojson';

import { Repository, Like, Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Companies } from '../company/company.entity';
import { Pages } from '../page/page.entity';
import { Questions } from '../../entities/Questions'; //TODO should be imported from Questions module
import { Answers } from '../../entities/Answers'; //TODO should be imported from Answers module
import { Integrations } from '../integration/Integrations.entity';
import { Forms } from './forms.entity';
import { CreateFormDto } from './dto/create.form.dto';
import { FormTemplateHelper } from './helper/form-template.helper';
import { XILO_COMPANY_ID } from '../../constants/appconstant';
import * as ezHelper from '../ezlynx/helper/ezlynx.helper';
import { IntegrationValidator } from '../v2-ezlynx/helper/integration-validator';
@Injectable({ scope: Scope.REQUEST })
export class FormService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Forms)
    private formsRepository: Repository<Forms>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(Pages)
    private pagesRepository: Repository<Pages>,
    @InjectRepository(Questions)
    private questionsRepository: Repository<Questions>,
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
    @InjectRepository(Integrations)
    private integrationsRepository: Repository<Integrations>,
    private formTemplateHelper: FormTemplateHelper,
    private integrationValidator: IntegrationValidator
  ) {}
  async create(formBody: CreateFormDto) {
    try {
      const newForm = await this.formsRepository.save(formBody);
      if (!newForm) {
        throw new HttpException('Form creating error', HttpStatus.BAD_REQUEST);
      }
      await this.formTemplateHelper.updateAllAnswers(formBody.companyFormId);

      return {
        title: 'Form created successfully',
        obj: newForm,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async duplicate(formBody: CreateFormDto) {
    try {
      const decoded = this.request.body.decodedUser;
      function replaceAll(str, find, replace) {
        return str.replace(new RegExp(_.escapeRegExp(find), 'g'), replace);
      }

      const companyId =
        decoded && decoded.user ? decoded.user.companyUserId : null;

      const company = await this.companiesRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException(
          'Error duplicating form. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const formJson = JSON.stringify(formBody);
      const brandedFormJson = replaceAll(formJson, '!{}', company.brandColor);
      const newForm = JSON.parse(brandedFormJson);

      newForm.title += ' - New';

      const createdForm = await this.formsRepository.save(newForm);
      if (!createdForm) {
        throw new HttpException('Form creating error', HttpStatus.BAD_REQUEST);
      }
      await this.formTemplateHelper.updateAllAnswers(
        decoded.user.companyUserId
      );

      return {
        title: 'Default Forms created successfully',
        obj: createdForm,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteForm(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const form = await this.formsRepository.findOne({
        where: {
          companyFormId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!form) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }
      const deletedForm = await this.formsRepository.delete(form);
      if (deletedForm.affected === 0) {
        throw new HttpException(
          'There was an error removing form',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Form removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      let companyId = null;
      if (decoded.user && decoded.user.companyUserId) {
        companyId = decoded.user.companyUserId;
      } else if (decoded.agent && decoded.agent.companyAgentId) {
        companyId = decoded.agent.companyAgentId;
      }
      const forms = await this.formsRepository.find({
          where: {
            companyFormId: companyId,
          },
          order: { title: 'ASC' },
      });
      if (!forms) {
        throw new HttpException('Error finding forms', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Forms found successfully',
        obj: forms,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listFormOnlyByCompany() {
    try {
      const companyId = this.request.body.decodedUser.companyId;
      const forms = await this.formsRepository.find({
        where: { companyFormId: companyId },
        select: ['id', 'title', 'integrations', 'icon'],
        order: { title: 'ASC' },
      });
      if (!forms) {
        throw new HttpException('Error finding forms', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Forms found successfully',
        obj: forms,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listById(id: number) {
    try {
      const form = await this.formsRepository
        .createQueryBuilder('form')
        .where({ id: id })
        .leftJoinAndSelect('form.pages', 'pages')
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('answers.questionAnswer', 'question')
        .leftJoinAndSelect('answers.conditions', 'answerConditions')
        .leftJoinAndSelect('answers.integrations', 'integrations')
        .leftJoinAndSelect('questions.conditions', 'questionConditions')     
        .leftJoinAndSelect('questions.dynamicRateConditions', 'condition')
        .leftJoinAndSelect('pages.conditions', 'conditions')
        .orderBy('pages.position', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .addOrderBy('answers.position', 'ASC')
        .addOrderBy('integrations.group', 'ASC')
        .addOrderBy('integrations.element', 'ASC')
        .getOne();

      await form.pages.map(onePage => {
	      onePage.questions.length && onePage.questions.map(oneQuestion => {
		        oneQuestion.answers.map(oneAnswer => {
			          oneAnswer['question'] = oneAnswer['questionAnswer'];
			          delete oneAnswer.questionAnswer;
			          oneAnswer['answerConditions'] = oneAnswer['conditions']
			          delete oneAnswer.conditions;
		        })
        })
      })
        
      if (!form) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyForUser() {
    try {
      const decoded = this.request.body.decodedUser;
      const forms = await this.formsRepository.find({
        where: { companyFormId: decoded.user.companyUserId },
      });
      if (!forms) {
        throw new HttpException(
          'Error finding forms. No forms found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Forms found successfully',
        obj: forms,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndFormId(formId: number) {
    try {
      const form = await this.formsRepository
        .createQueryBuilder('form')
        .where({ id: formId })
        .leftJoinAndSelect(
          'form.pages',
          'pages',
          'pages.isFormCompletedPage = :isFormCompletedPage',
          { isFormCompletedPage: false }
        )
        .leftJoinAndSelect('pages.conditions', 'conditions')
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.page', 'page')
        .leftJoinAndSelect('questions.questionConditions', 'questionConditions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('answers.answerConditions', 'answerConditions')
        .orderBy('pages.position', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .addOrderBy('answers.position', 'ASC')
        .getOne();

      if (!form) {
        throw new HttpException(
          'Error finding form. No form found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndFormName(companyId: number, formType: string) {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
        select: ['id', 'companyId'],
      });

      if (!company) {
        throw new HttpException(
          'Error finding form. No company',
          HttpStatus.BAD_REQUEST
        );
      }

      const query = {};

      formType === 'auto' ? (query['isAuto'] = true) : null;
      formType === 'home' ? (query['isHome'] = true) : null;
      formType === 'autohome' ? (query['isAutoHome'] = true) : null;

      const form = await this.formsRepository
        .createQueryBuilder('form')
        .where({ query, companyFormId: company.id })
        .leftJoinAndSelect(
          'form.pages',
          'pages',
          'pages.isFormCompletedPage = :isFormCompletedPage',
          { isFormCompletedPage: false }
        )
        .leftJoinAndSelect('pages.conditions', 'conditions')
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.page', 'page')
        .leftJoinAndSelect('questions.questionConditions', 'questionConditions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('answers.answerConditions', 'answerConditions')
        .orderBy('pages.position', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .addOrderBy('answers.position', 'ASC')
        .getOne();

      if (!form) {
        throw new HttpException(
          'Error finding form. No form found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyId(companyId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: companyId },
      });

      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }

      const forms = await this.formsRepository.find({
        where: { companyFormId: company.id },
      });

      if (!forms) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'Forms retrieved successfully',
        obj: forms,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listAllTemplates() {
    try {
      const forms = await this.formsRepository
        .createQueryBuilder('form')
        .where({ isTemplate: true })
        .leftJoinAndSelect('form.dynamicRates', 'dynamicRates')
        .leftJoinAndSelect('form.pages', 'pages')
        .leftJoinAndSelect('pages.conditions', 'conditions')
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('answers.questionAnswer', 'question')
        .leftJoinAndSelect('question.pageQuestion', 'page')
        .getMany();
      if (!forms || !forms[0]) {
        throw new HttpException(
          'Error finding forms. No forms found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Forms found successfully',
        obj: forms,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndForm() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: this.request.query.companyId },
      });
      if (!company) {
        throw new HttpException(
          'Error finding form. No company found',
          HttpStatus.BAD_REQUEST
        );
      }
      const form = await this.formsRepository
        .createQueryBuilder('form')
        .where({
          companyFormId: company.id,
          title: Like(`%${this.request.query.title}%`),
        })
        .leftJoinAndSelect('form.applications', 'applications')
        .leftJoinAndSelect('form.discounts', 'discounts')
        .leftJoinAndSelect('form.dynamicRates', 'dynamicRates')
        .leftJoinAndSelect('dynamicRates.dynamicCoverages', 'dynamicCoverages')
        .leftJoinAndSelect(
          'form.pages',
          'pages',
          'pages.isFormCompletedPage = :isFormCompletedPage',
          { isFormCompletedPage: false }
        )
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.page', 'page')
        .leftJoinAndSelect('questions.conditions', 'conditions')
        .leftJoinAndSelect('conditions.answer', 'answer')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('answers.question', 'question')
        .orderBy('discounts.position', 'ASC')
        .addOrderBy('dynamicCoverages.position', 'ASC')
        .addOrderBy('pages', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .addOrderBy('answers.position', 'ASC')
        .getOne();

      if (!form) {
        throw new HttpException(
          'Error finding form. No found found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listAllByCompany() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: this.request.query.companyId },
      });

      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }

      const forms = await this.formsRepository.find({
        where: {
          companyFormId: company.id,
          isEnabled: true,
        },
        order: { createdAt: 'DESC' },
      });

      if (!forms) {
        throw new HttpException('No forms found', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Forms found successfully',
        obj: forms,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndFormStart() {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: this.request.query.companyId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const form = await this.formsRepository
        .createQueryBuilder('form')
        .where({
          companyFormId: company.id,
          title: Like(`%${this.request.query.title}%`),
        })
        .leftJoinAndSelect('form.pages', 'pages')
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.page', 'page')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('answers.question', 'question')
        .orderBy('pages.position', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .addOrderBy('answers.position', 'ASC')
        .getOne();
      if (!form) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Form retrieved successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndAutoForm() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: this.request.query.companyId },
      });
      if (!company) {
        throw new HttpException(
          'Error finding auto form. No company found',
          HttpStatus.BAD_REQUEST
        );
      }
      const form = await this.formsRepository
        .createQueryBuilder('form')
        .where({ companyFormId: company.id, isAuto: true })
        .leftJoinAndSelect('form.dynamicRates', 'dynamicRates')
        .leftJoinAndSelect('dynamicRates.dynamicCoverages', 'dynamicCoverages')
        .leftJoinAndSelect(
          'form.pages',
          'pages',
          'pages.isFormCompletedPage = :isFormCompletedPage',
          { isFormCompletedPage: false }
        )
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.conditions', 'conditions')
        .leftJoinAndSelect('conditions.answer', 'answer')
        .orderBy('dynamicCoverages.position', 'ASC')
        .addOrderBy('pages.position', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .getOne();

      if (!form) {
        throw new HttpException(
          'Error finding form. No found found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndAutoFormOnly() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: this.request.query.companyId },
      });

      if (!company) {
        throw new HttpException(
          'Error finding form. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const form = await this.formsRepository.findOne({
        where: {
          companyFormId: company.id,
          isAuto: true,
        },
      });

      if (!form) {
        throw new HttpException(
          'Error finding form. No form found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndHomeFormOnly() {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: this.request.query.companyId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const form = await this.formsRepository.findOne({
        where: {
          companyFormId: company.id,
          isHome: true,
        },
      });
      if (!form) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Form retrieved successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndHomeFormPages() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: this.request.query.companyId },
      });

      if (!company) {
        throw new HttpException(
          'No company found with that id',
          HttpStatus.BAD_REQUEST
        );
      }
      const pages = await this.pagesRepository
        .createQueryBuilder('page')
        .where({ companyPageId: company.id, isFormCompletedPage: false })
        .leftJoinAndSelect(
          'page.form',
          'form',
          'pages.isFormCompletedPage = :isFormCompletedPage',
          { isFormCompletedPage: false }
        )
        .orderBy('position', 'ASC')
        .getMany();

      if (!pages) {
        throw new HttpException(
          'No company found with company id',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Pages retrieved successfully',
        obj: pages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndAutoFormPages() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: this.request.query.companyId },
      });

      if (!company) {
        throw new HttpException(
          'No company found with that id',
          HttpStatus.BAD_REQUEST
        );
      }
      const pages = await this.pagesRepository
        .createQueryBuilder('page')
        .where({ companyPageId: company.id, isFormCompletedPage: false })
        .leftJoinAndSelect(
          'page.form',
          'form',
          'pages.isFormCompletedPage = :isAuto',
          { isAuto: true }
        )
        .orderBy('position', 'ASC')
        .getMany();

      if (!pages) {
        throw new HttpException(
          'No company found with company id',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Pages retrieved successfully',
        obj: pages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndAutoFormDiscounts(companyId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const form = await this.formsRepository.findOne({
        where: {
          companyFormId: company.id,
          isAuto: true,
        },
        relations: ['discounts'],
      });
      if (!form) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Discounts retrieved successfully',
        // obj: form.discounts, TODO there is no discount in form entity
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndHomeFormDiscounts(companyId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const form = await this.formsRepository.findOne({
        where: {
          companyFormId: company.id,
          isHome: true,
        },
        relations: ['discounts'],
      });
      if (!form) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Discounts retrieved successfully',
        // obj: form.discounts, TODO there is no discount in form entity
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompanyAndHomeForm() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { companyId: this.request.query.companyId },
      });
      if (!company) {
        throw new HttpException(
          'Error finding home form. No company found',
          HttpStatus.BAD_REQUEST
        );
      }
      const form = await this.formsRepository
        .createQueryBuilder('form')
        .where({ companyFormId: company.id, isHome: true })
        .leftJoinAndSelect('form.dynamicRates', 'dynamicRates')
        .leftJoinAndSelect('dynamicRates.dynamicCoverages', 'dynamicCoverages')
        .leftJoinAndSelect(
          'form.pages',
          'pages',
          'pages.isFormCompletedPage = :isFormCompletedPage',
          { isFormCompletedPage: false }
        )
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.conditions', 'conditions')
        .leftJoinAndSelect('conditions.answer', 'answer')
        .orderBy('dynamicCoverages.position', 'ASC')
        .addOrderBy('pages.position', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .getOne();

      if (!form) {
        throw new HttpException(
          'Error finding form. No found found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByFormIdAndCompany(formId: number) {
    try {
      const form = await this.formsRepository.findOne({
        where: { id: formId },
      });
      if (!form) {
        throw new HttpException(
          'Error finding form. No form found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Form found successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const form = await this.formsRepository.findOne({
        where: {
          companyFormId: decoded.user.companyUserId,
          id: id,
        },
      });
      if (!form) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Form retrieved successfully',
        obj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateStartPages() {
    try {
      const autoForms = await this.formsRepository
        .createQueryBuilder('form')
        .where({ isAuto: true, isHome: false })
        .leftJoinAndSelect('from.pages', 'pages')
        .leftJoinAndSelect('from.company', 'company')
        .orderBy('pages.position', 'ASC')
        .getMany();

      if (!autoForms || !autoForms[0]) {
        throw new HttpException('Auto forms not found', HttpStatus.BAD_REQUEST);
      }
      const homeForms = await this.formsRepository
        .createQueryBuilder('form')
        .where({ isAuto: false, isHome: true })
        .leftJoinAndSelect('from.pages', 'pages')
        .leftJoinAndSelect('from.company', 'company')
        .orderBy('pages.position', 'ASC')
        .getMany();

      if (!homeForms || !homeForms[0]) {
        throw new HttpException('Home forms not found', HttpStatus.BAD_REQUEST);
      }

      const homeStartPage = async function (form, company) {
        return {
          title: 'Start',
          position: 0,
          isStartPage: true,
          progressButtonText: 'Start Quote &#8594;',
          companyPageId: company.id,
          formPageId: form.id,
        };
      };

      const homeStartQuestion = async function (form, company, page) {
        return {
          headerText: "What is the address of the home you're insuring?",
          subHeaderText:
            'Enter in the address of the home to start your free quote!',
          companyQuestionId: company.id,
          formQuestionId: form.id,
          pageQuestionId: page.id,
          position: 0,
          hasCustomHtml: false,
          image:
            '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.533 512.533" style="enable-background:new 0 0 512.533 512.533;" xml:space="preserve"> <path style="fill:#F3705B;" d="M406.6,62.4c-83.2-83.2-217.6-83.2-299.733,0c-83.2,83.2-83.2,216.533,0,299.733l149.333,150.4 L405.533,363.2C488.733,280,488.733,145.6,406.6,62.4z"/> <path style="fill:#FFFFFF;" d="M256.2,360C175.133,360,109,293.867,109,212.8S175.133,65.6,256.2,65.6s147.2,66.133,147.2,147.2 S337.266,360,256.2,360z"/> <path style="fill:#435B6C;" d="M325.533,140.267c-12.8-10.667-32-16-59.733-16h-62.933v177.067h39.467v-49.067h24.533 c26.667,0,45.867-5.333,58.667-14.933c12.8-10.667,19.2-26.667,19.2-48C344.733,166.933,338.333,150.933,325.533,140.267z M296.733,209.6c-4.267,5.333-13.867,7.467-26.667,7.467H243.4v-59.733h22.4c12.8,0,22.4,2.133,28.8,6.4 c6.4,4.267,9.6,11.733,9.6,21.333C304.2,196.8,301,204.267,296.733,209.6z"/> <g> </g> </svg>',
        };
      };

      const homeStartAnswer = async function (form, company, page, question) {
        return {
          isInput: false,
          isSelect: false,
          isNativeSelect: false,
          isDatePicker: false,
          isMobileDatePicker: false,
          isButton: false,
          isTextarea: false,
          hasSuffix: false,
          hasPrefix: false,
          hasSecondaryPlaceholder: true,
          secondaryPlaceholderText: 'Address',
          placeholderText: 'Enter Home Address',
          isRequired: true,
          propertyValue: null,
          propertyKey: 'fullAddress',
          displayValue: null,
          width: '45',
          position: 0,
          hasCustomHtml: false,
          companyAnswerId: company.id,
          formAnswerId: form.id,
          pageAnswerId: page.id,
          questionAnswerId: question.id,
          isAddressSearch: true,
        };
      };

      const autoStartPage = async function (form, company) {
        return {
          title: 'Start',
          position: 0,
          isStartPage: true,
          progressButtonText: 'Start Quote &#8594;',
          companyPageId: company.id,
          formPageId: form.id,
        };
      };

      const autoStartQuestion = async function (form, company, page) {
        return {
          headerText: 'What is your zip code?',
          subHeaderText: 'Enter in your zip code to start your free quote!',
          companyQuestionId: company.id,
          pageQuestionId: page.id,
          formQuestionId: form.id,
          position: 0,
          hasCustomHtml: false,
          image: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path style="fill:${company.brandColor}" d="M365.017,343.585c-2.214,0-4.427-0.844-6.116-2.534c-3.378-3.378-3.378-8.854,0.001-12.23 l18.715-18.716c1.622-1.623,3.822-2.533,6.116-2.533h17.561c4.778,0,8.649,3.872,8.649,8.649s-3.871,8.649-8.649,8.649h-13.98 l-16.183,16.182C369.444,342.741,367.23,343.585,365.017,343.585z"/> <path style="fill:${company.brandColor}" d="M146.978,343.585c-2.214,0-4.427-0.844-6.116-2.534l-16.181-16.182H110.7 c-4.778,0-8.649-3.872-8.649-8.649s3.871-8.649,8.649-8.649h17.563c2.294,0,4.493,0.911,6.116,2.533l18.715,18.716 c3.378,3.378,3.378,8.854-0.001,12.23C151.405,342.741,149.191,343.585,146.978,343.585z"/> </g> <path style="fill:#4EBFED;" d="M356.328,336.67H153.372l11.347-48.098c2.433-10.332,11.658-17.632,22.279-17.632h135.692 c10.621,0,19.846,7.299,22.279,17.632L356.328,336.67z"/> <path style="fill:#92DDF4;" d="M356.328,336.67H242.834l28.956-65.73h50.9c10.621,0,19.846,7.299,22.279,17.632L356.328,336.67z"/> <path style="fill:${company.brandColor}" d="M356.324,342.437c-2.614,0-4.98-1.789-5.607-4.442l-11.359-48.098 c-1.83-7.768-8.683-13.191-16.668-13.191H186.998c-7.984,0-14.838,5.423-16.667,13.188l-11.348,48.101 c-0.731,3.1-3.826,5.023-6.936,4.287c-3.1-0.731-5.019-3.837-4.287-6.935l11.347-48.098c3.06-12.996,14.531-22.074,27.891-22.074 h135.692c13.361,0,24.83,9.078,27.893,22.076l11.357,48.095c0.732,3.1-1.187,6.204-4.286,6.936 C357.208,342.386,356.762,342.437,356.324,342.437z"/> <g> <rect x="133.766" y="427.444" style="fill:#415E72;" width="43.82" height="54.106"/> <rect x="334.416" y="427.444" style="fill:#415E72;" width="43.82" height="54.106"/> </g> <polyline style="fill:#CFDCE5;" points="464.249,140.31 47.751,140.31 47.751,238.328 464.249,238.328 "/> <g> <polyline style="fill:#C1CED6;" points="464.249,140.31 47.751,140.31 47.751,158.76 464.249,158.76 "/> <polyline style="fill:#C1CED6;" points="464.249,192.202 47.751,192.202 47.751,202.581 464.249,202.581 "/> <polyline style="fill:#C1CED6;" points="464.249,215.265 47.751,215.265 47.751,225.644 464.249,225.644 "/> <polyline style="fill:#C1CED6;" points="464.249,169.139 47.751,169.139 47.751,179.517 464.249,179.517 "/> </g> <polygon style="fill:${company.brandColor}" points="464.252,116.382 464.252,147.413 47.755,147.413 47.755,116.382 256.003,35.165 "/> <polygon style="fill:${company.brandColor}" points="464.252,121.387 464.252,147.413 461.173,147.413 256.003,67.396 50.822,147.413 47.755,147.413 47.755,121.387 256.003,40.158 "/> <g> <path style="fill:#415E72;" d="M464.249,481.81c-4.778,0-8.649-3.872-8.649-8.649V122.737c0-4.776,3.871-8.649,8.649-8.649 c4.778,0,8.649,3.872,8.649,8.649V473.16C472.898,477.937,469.025,481.81,464.249,481.81z"/> <path style="fill:#415E72;" d="M47.75,481.81c-4.778,0-8.649-3.872-8.649-8.649V122.737c0-4.776,3.871-8.649,8.649-8.649 s8.649,3.872,8.649,8.649V473.16C56.399,477.937,52.528,481.81,47.75,481.81z"/> <polygon style="fill:#415E72;" points="502.782,145.026 256,48.779 9.218,145.026 0,121.391 256,21.547 512,121.391 "/> </g> <rect x="4.844" y="473.155" style="fill:#344F5E;" width="502.304" height="17.297"/> <path style="fill:${company.brandColor}" d="M383.998,419.694v-65.776c0-10.482-8.499-18.981-18.981-18.981H146.978 c-10.482,0-18.981,8.499-18.981,18.981v65.776"/> <g> <circle style="fill:#FCD577;" cx="171.821" cy="383.37" r="19.604"/> <circle style="fill:#FCD577;" cx="340.182" cy="383.37" r="19.604"/> </g> <rect x="113.01" y="418.542" style="fill:#CFDCE5;" width="285.983" height="27.676"/> <g> <rect x="208.145" y="366.327" style="fill:#314A5F;" width="95.712" height="12.685"/> <rect x="208.145" y="389.39" style="fill:#314A5F;" width="95.712" height="12.685"/> </g> </svg>`,
        };
      };

      const autoStartAnswer = async function (form, company, page, question) {
        return {
          isInput: false,
          isStartPageInput: true,
          isSelect: false,
          isNativeSelect: false,
          isDatePicker: false,
          isMobileDatePicker: false,
          isButton: false,
          isTextarea: false,
          hasSuffix: false,
          hasPrefix: false,
          hasSecondaryPlaceholder: true,
          secondaryPlaceholderText: 'Zip Code',
          placeholderText: 'Enter Zip Code',
          isRequired: true,
          propertyValue: null,
          propertyKey: 'postalCd',
          displayValue: null,
          width: '45',
          position: 0,
          hasCustomHtml: false,
          companyAnswerId: company.id,
          formAnswerId: form.id,
          pageAnswerId: page.id,
          questionAnswerId: question.id,
        };
      };

      const autoData = await Promise.all(
        autoForms.map(async (form) => {
          const hasStartPage = form.pages.some((page) => page.isStartPage);

          if (hasStartPage) {
          } else {
            for (let i = 0; i < form.pages.length; i++) {
              const page = form.pages[i];
              const newPosition = +page.position + 1;
              await this.pagesRepository.save({
                ...page,
                ...{ position: newPosition },
              });
            }
            const startPage = await this.pagesRepository.save(
              await autoStartPage(form, form.company)
            );
            const startQuestion = await this.questionsRepository.save(
              await autoStartQuestion(form, form.company, startPage)
            );
            const startAnswer = await this.answersRepository.save(
              await autoStartAnswer(
                form,
                form.company,
                startPage,
                startQuestion
              )
            );
            const updatedForm = await this.formsRepository.save({
              ...form,
              ...{
                hasDynamicStartPage: true,
              },
            });
          }
        })
      );

      const homeData = await Promise.all(
        homeForms.map(async (form) => {
          let hasStartPage = form.pages.some((page) => page.isStartPage);
          if (form.hasDynamicStartPage) {
            hasStartPage = true;
          }
          if (hasStartPage) {
          } else {
            for (let i = 0; i < form.pages.length; i++) {
              const page = form.pages[i];
              const newPosition = +page.position + 1;
              await this.pagesRepository.save({
                ...page,
                ...{ position: newPosition },
              });
            }
            const startPage = await this.pagesRepository.save(
              await homeStartPage(form, form.company)
            );
            const startQuestion = await this.questionsRepository.save(
              await homeStartQuestion(form, form.company, startPage)
            );
            const startAnswer = await this.answersRepository.save(
              await homeStartAnswer(
                form,
                form.company,
                startPage,
                startQuestion
              )
            );
            const updatedForm = await this.formsRepository.save({
              ...form,
              ...{
                hasDynamicStartPage: true,
              },
            });
          }
        })
      );

      return {
        message: 'Forms updated successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, formBody: CreateFormDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const form = await this.formsRepository.findOne({
        where: {
          companyFormId: decoded.user.companyUserId,
          id: id,
        },
      });

      if (!form) {
        throw new HttpException(
          'Error updating form. No form found',
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedForm = await this.formsRepository.save({
        ...form,
        formBody,
      });

      return {
        title: 'Form updated successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async validateForm(id: number, type: string, method: string) {
    try {
      const whereObj = {
        objectName: Not(IsNull),
        propertyKey: Not(IsNull),
      };

      if (method == 'fields') {
        whereObj['id'] = id;
      } else {
        whereObj['formAnswerId'] = id;
      }

      const answers = await this.answersRepository.find({
        where: whereObj,
      });

      const dummyClient = {};

      const optionMisMatches = [];

      async function returnTestData(answer) {
        if (answer.isInput) {
          if (answer.isAddressSearch) {
            return '225 Haines St Newark, DE 19711';
          } else if (answer.validationType === 'number') {
            return answer.propertyKey.includes('phone') ? '3022221234' : 10;
          } else if (answer.validationType === 'email') {
            return 'test@xilo.io';
          } else if (answer.propertyKey === 'vehicleVin') {
            return 'WDBRF92H57F919771';
          } else {
            return 'Test';
          }
        } else if (answer.isDatePicker) {
          if (answer.propertyKey.toLowerCase().includes('birth')) {
            return '1990-12-01';
          } else {
            return '2020-12-01';
          }
        } else if (answer.isSelect) {
          if (answer.propertyKey === 'vehicleManufacturer') {
            return 'MERCEDES-BENZ';
          } else if (answer.propertyKey === 'vehicleModel') {
            return 'C 280 4MATIC';
          } else if (answer.propertyKey === 'vehicleModelYear') {
            return '2007';
          } else if (answer.propertyKey === 'vehicleBodyStyle') {
            return 'SEDAN 4 AWD 3.0L L4 DOHC 24V';
          } else {
            let badOption = null;
            let badOptions = [];
            for (let option of answer.options) {
              const ezOptions = await ezHelper.returnArrayByKey(
                answer.propertyKey
              );
              if (ezOptions) {
                let bestMatch = null;
                if (isNaN(option)) {
                  if (answer.propertyKey === 'roofType') {
                    option = option.toUpperCase();
                  }
                  const rateNumber = answer.propertyKey.includes('occu')
                    ? 0.2
                    : 0.5;
                  bestMatch = await ezHelper.returnClosestValueIfClose(
                    option,
                    ezOptions,
                    rateNumber
                  );
                } else {
                  bestMatch = await ezHelper.returnClosestNumberValue(
                    option,
                    ezOptions,
                    null
                  );
                }
                if (!bestMatch && !ezOptions.includes(option)) {
                  badOption = option;
                  badOptions.push(
                    `${
                      answer.placeholderText
                    }: ${option} doesnt exist in EZLynx. Please use one of the following: ${ezOptions.join(
                      ','
                    )}`
                  );
                }
              }
            }
            if (badOption) {
              optionMisMatches.push(...badOptions);
              return badOption;
            } else {
              return answer.options[0];
            }
          }
        } else if (answer.propertyKey === 'vehicelVin') {
          return 'Test';
        } else if (answer.propertyKey === 'vehicleModelYear') {
          return 'Test';
        }
      }

      const isMultiple = [
        'drivers',
        'vehicles',
        'homes',
        'locations',
        'incidents',
        'recreationalVehicles',
        'policies',
      ];

      for (const answer of answers) {
        if (answer.objectName === 'client') {
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient['streetNumber'] = '225';
            dummyClient['streetName'] = 'Haines St';
            dummyClient['streetAddress'] = '225 Haines St';
            dummyClient['city'] = 'Newark';
            dummyClient['stateCd'] = 'DE';
            dummyClient['postalCd'] = '19711';
            dummyClient['fullAddress'] = '225 Haines St Newark, DE 19711';
          }
          dummyClient[answer.propertyKey] = await returnTestData(answer);
        } else if (isMultiple.includes(answer.objectName)) {
          if (!dummyClient[answer.objectName]) {
            dummyClient[answer.objectName] = [{}];
          }
          if (answer.propertyKey === 'applicantGivenName') {
            dummyClient['firstName'] = await returnTestData(answer);
          } else if (answer.propertyKey === 'aplicantSurname') {
            dummyClient['lastName'] = await returnTestData(answer);
          }
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient[answer.objectName][0]['streetNumber'] = '225';
            dummyClient[answer.objectName][0]['streetName'] = 'Haines St';
            dummyClient[answer.objectName][0]['streetAddress'] =
              '225 Haines St';
            dummyClient[answer.objectName][0]['city'] = 'Newark';
            dummyClient[answer.objectName][0]['state'] = 'DE';
            dummyClient[answer.objectName][0]['zipCode'] = '19711';
            dummyClient[answer.objectName][0]['fullAddress'] =
              '225 Haines St Newark, DE 19711';
          } else {
            dummyClient[answer.objectName][0][
              answer.propertyKey
            ] = await returnTestData(answer);
          }
        } else {
          if (!dummyClient[answer.objectName]) {
            dummyClient[answer.objectName] = {};
          }
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient[answer.objectName]['streetNumber'] = '225';
            dummyClient[answer.objectName]['streetName'] = 'Haines St';
            dummyClient[answer.objectName]['streetAddress'] = '225 Haines St';
            dummyClient[answer.objectName]['city'] = 'Newark';
            dummyClient[answer.objectName]['state'] = 'DE';
            dummyClient[answer.objectName]['zipCode'] = '19711';
            dummyClient[answer.objectName]['fullAddress'] =
              '225 Haines St Newark, DE 19711';
          } else {
            dummyClient[answer.objectName][
              answer.propertyKey
            ] = await returnTestData(answer);
          }
        }
      }

      if (method === 'fields' && answers.length && answers.length === 1) {
        if (type === 'auto') {
          if (answers[0].propertyKey === 'firstName') {
            dummyClient['lastName'] = 'Test';
          } else if (answers[0]['propertyKey'] === 'lastName') {
            dummyClient['firstName'] = 'Test';
          } else if (answers[0]['propertyKey'] === 'applicantGivenName') {
            dummyClient['drivers'][0].applicantSurname = 'Test';
          } else if (answers[0].propertyKey === 'applicantSurname') {
            dummyClient['drivers'][0].applicantGivenName = 'Test';
          } else {
            dummyClient['firstName'] = 'Test';
            dummyClient['lastName'] = 'Test';
          }
        } else if (type === 'home') {
          if (answers[0].propertyKey === 'firstName') {
            dummyClient['lastName'] = 'Test';
          } else if (answers[0].propertyKey === 'lastName') {
            dummyClient['firstName'] = 'Test';
          } else {
            dummyClient['firstName'] = 'Test';
            dummyClient['lastName'] = 'Test';
          }
        }
      }
      const messages = await this.integrationValidator.validateEZLynx(
        dummyClient,
        type,
        method
      );

      if (!messages.status) {
        throw new HttpException(
          'Error validating form. Validation failed',
          HttpStatus.BAD_REQUEST
        );
      }

      let output: any = [...messages.messages, ...optionMisMatches];

      if (output.length > 0) {
        output = output.join('\n');
      } else {
        return {
          title: 'Form validated',
          valid: true,
        };
      }

      return {
        title: 'Form validated',
        valid: false,
        obj: output,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async validateFormV2(id: number, type: string, vendor: string) {
    try {
      const method = this.request.query.method;
      const integrations = await this.integrationsRepository.find({
        where: {
          formIntegrationId: id,
          vendorName: vendor,
        },
        relations: ['Answers'],
      });
      if (!integrations) {
        throw new HttpException(
          'Error Not found intergration',
          HttpStatus.BAD_REQUEST
        );
      }
      const dummyClient = { formClientId: id };

      let optionMisMatches = [];

      async function returnTestData(answer) {
        if (answer.isInput) {
          if (answer.isAddressSearch) {
            return '225 Haines St Newark, DE 19711';
          } else if (answer.validationType === 'number') {
            return answer.propertyKey.includes('phone') ? '3022221234' : 10;
          } else if (answer.validationType === 'email') {
            return 'test@xilo.io';
          } else if (answer.isVehicleVIN) {
            return 'WDBRF92H57F919771';
          } else {
            return 'Test';
          }
        } else if (answer.isDatePicker) {
          if (answer.propertyKey.toLowerCase().includes('birth')) {
            return '1990-12-01';
          } else {
            return '2020-12-01';
          }
        } else if (answer.isSelect) {
          if (answer.isVehicleMake) {
            return 'MERCEDES-BENZ';
          } else if (answer.isVehicleModel) {
            return 'C 280 4MATIC';
          } else if (answer.isVehicleYear) {
            return '2007';
          } else if (answer.isVehicleBodyStyle) {
            return 'SEDAN 4 AWD 3.0L L4 DOHC 24V';
          } else {
            let badOption = null;
            let badOptions = [];
            for (let option of answer.options) {
              const ezOptions = await ezHelper.returnArrayByKey(
                answer.propertyKey
              );
              if (ezOptions) {
                let bestMatch = null;
                if (isNaN(option)) {
                  if (answer.propertyKey === 'roofType') {
                    option = option.toUpperCase();
                  }
                  const rateNumber = answer.propertyKey.includes('occu')
                    ? 0.2
                    : 0.5;
                  bestMatch = await ezHelper.returnClosestValueIfClose(
                    option,
                    ezOptions,
                    rateNumber
                  );
                } else {
                  bestMatch = await ezHelper.returnClosestNumberValue(
                    option,
                    ezOptions,
                    null
                  );
                }
                if (!bestMatch && !ezOptions.includes(option)) {
                  badOption = option;
                  const badOptionsText = `${
                    answer.placeholderText
                  }: ${option} doesnt exist in EZLynx. Please use one of the following: ${ezOptions.join(
                    ','
                  )}`;
                  const validations =
                    answer.validations &&
                    answer.validations.length &&
                    answer.validations.length > 0
                      ? answer.validations
                      : [];
                  validations.push(badOptionsText);
                  await answer.update({ validations: validations });
                  badOptions.push(badOptionsText);
                }
              }
            }
            if (badOption) {
              optionMisMatches.push(...badOptions);
              return badOption;
            } else {
              return answer.options[0];
            }
          }
        } else if (answer.propertyKey === 'vehicelVin') {
          return 'Test';
        } else if (answer.propertyKey === 'vehicleModelYear') {
          return 'Test';
        }
      }

      const isMultiple = [
        'drivers',
        'vehicles',
        'homes',
        'locations',
        'incidents',
        'recreationalVehicles',
        'policies',
      ];

      for (const int of integrations) {
        const answer = int['answer'];
        if (answer.objectName === 'client') {
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient['streetNumber'] = '225';
            dummyClient['streetName'] = 'Haines St';
            dummyClient['streetAddress'] = '225 Haines St';
            dummyClient['city'] = 'Newark';
            dummyClient['stateCd'] = 'DE';
            dummyClient['postalCd'] = '19711';
            dummyClient['fullAddress'] = '225 Haines St Newark, DE 19711';
          }
          dummyClient[answer.propertyKey] = await returnTestData(answer);
        } else if (isMultiple.includes(answer.objectName)) {
          if (!dummyClient[answer.objectName]) {
            dummyClient[answer.objectName] = [{}];
          }
          if (answer.propertyKey === 'applicantGivenName') {
            dummyClient['firstName'] = await returnTestData(answer);
          } else if (answer.propertyKey === 'applicantSurname') {
            dummyClient['lastName'] = await returnTestData(answer);
          }
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient[answer.objectName][0]['streetNumber'] = '225';
            dummyClient[answer.objectName][0]['streetName'] = 'Haines St';
            dummyClient[answer.objectName][0]['streetAddress'] =
              '225 Haines St';
            dummyClient[answer.objectName][0]['city'] = 'Newark';
            dummyClient[answer.objectName][0]['state'] = 'DE';
            dummyClient[answer.objectName][0]['zipCode'] = '19711';
            dummyClient[answer.objectName][0]['fullAddress'] =
              '225 Haines St Newark, DE 19711';
          } else {
            dummyClient[answer.objectName][0][
              answer.propertyKey
            ] = await returnTestData(answer);
          }
        } else {
          if (!dummyClient[answer.objectName]) {
            dummyClient[answer.objectName] = {};
          }
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient[answer.objectName]['streetNumber'] = '225';
            dummyClient[answer.objectName]['streetName'] = 'Haines St';
            dummyClient[answer.objectName]['streetAddress'] = '225 Haines St';
            dummyClient[answer.objectName]['city'] = 'Newark';
            dummyClient[answer.objectName]['state'] = 'DE';
            dummyClient[answer.objectName]['zipCode'] = '19711';
            dummyClient[answer.objectName]['fullAddress'] =
              '225 Haines St Newark, DE 19711';
          } else {
            dummyClient[answer.objectName][
              answer.propertyKey
            ] = await returnTestData(answer);
          }
        }
      }
      const messages = await this.integrationValidator.validateV2EZLynx(
        dummyClient,
        type,
        method
      );

      if (!messages.status) {
        throw new HttpException(
          'Error validating form. Validation failed',
          HttpStatus.BAD_REQUEST
        );
      }

      let output: any = [...messages.messages, ...optionMisMatches];

      if (output.length > 0) {
        output = output.join('\n');
      } else {
        return {
          title: 'Form validated',
          valid: true,
        };
      }

      return {
        title: 'Form validated',
        valid: false,
        obj: output,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async validateFields(id: number, type: string) {
    try {
      const whereObj = {
        objectName: Not(IsNull()),
        propertyKey: Not(IsNull()),
        formAnswerId: id,
      };

      const answers = await this.answersRepository.find({
        where: whereObj,
      });

      let dummyClient = {};

      let optionMisMatches = [];

      let globalMessages = [];

      let output = [];

      async function returnTestData(answer) {
        if (answer.isInput) {
          if (answer.isAddressSearch) {
            return '225 Haines St Newark, DE 19711';
          } else if (answer.validationType === 'number') {
            return answer.propertyKey.includes('phone') ? '3022221234' : 10;
          } else if (answer.validationType === 'email') {
            return 'test@xilo.io';
          } else if (answer.propertyKey === 'vehicleVin') {
            return 'WDBRF92H57F919771';
          } else {
            return 'Test';
          }
        } else if (answer.isDatePicker) {
          if (answer.propertyKey.toLowerCase().includes('birth')) {
            return '1990-12-01';
          } else {
            return '2020-12-01';
          }
        } else if (answer.isSelect) {
          if (answer.propertyKey === 'vehicleManufacturer') {
            return 'MERCEDES-BENZ';
          } else if (answer.propertyKey === 'vehicleModel') {
            return 'C 280 4MATIC';
          } else if (answer.propertyKey === 'vehicleModelYear') {
            return '2007';
          } else if (answer.propertyKey === 'vehicleBodyStyle') {
            return 'SEDAN 4 AWD 3.0L L4 DOHC 24V';
          } else {
            let badOption = null;
            let badOptions = [];
            for (let option of answer.options) {
              const ezOptions = await ezHelper.returnArrayByKey(
                answer.propertyKey
              );
              if (ezOptions) {
                let bestMatch = null;
                if (isNaN(option)) {
                  if (answer.propertyKey === 'roofType') {
                    option = option.toUpperCase();
                  }
                  const rateNumber = answer.propertyKey.includes('occu')
                    ? 0.2
                    : 0.5;
                  bestMatch = await ezHelper.returnClosestValueIfClose(
                    option,
                    ezOptions,
                    rateNumber
                  );
                } else {
                  bestMatch = await ezHelper.returnClosestNumberValue(
                    option,
                    ezOptions,
                    null
                  );
                }
                if (!bestMatch && !ezOptions.includes(option)) {
                  badOption = option;
                  badOptions.push(
                    `${
                      answer.placeholderText
                    }: ${option} doesnt exist in EZLynx. Please use one of the following: ${ezOptions.join(
                      ','
                    )}`
                  );
                }
              }
            }
            if (badOption) {
              optionMisMatches.push(...badOptions);
              return badOption;
            } else {
              return answer.options[0];
            }
          }
        } else if (answer.propertyKey === 'vehicelVin') {
          return 'Test';
        } else if (answer.propertyKey === 'vehicleModelYear') {
          return 'Test';
        }
      }

      const isMultiple = [
        'drivers',
        'vehicles',
        'homes',
        'locations',
        'incidents',
        'recreationalVehicles',
        'policies',
      ];

      const autoKey = [
        'firstName',
        'lastName',
        'gender',
        'maritalStatus',
        'industry',
        'occupation',
        'educationLevel',
        'relation',
      ];

      for (let answer of answers) {
        if (answer.objectName === 'client') {
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient['streetNumber'] = '225';
            dummyClient['streetName'] = 'Haines St';
            dummyClient['streetAddress'] = '225 Haines St';
            dummyClient['city'] = 'Newark';
            dummyClient['stateCd'] = 'DE';
            dummyClient['postalCd'] = '19711';
            dummyClient['fullAddress'] = '225 Haines St Newark, DE 19711';
          }
          dummyClient[answer.propertyKey] = await returnTestData(answer);
        } else if (isMultiple.includes(answer.objectName)) {
          if (!dummyClient[answer.objectName]) {
            dummyClient[answer.objectName] = [{}];
          }
          if (answer.propertyKey === 'applicantGivenName') {
            dummyClient['firstName'] = await returnTestData(answer);
          } else if (answer.propertyKey === 'aplicantSurname') {
            dummyClient['lastName'] = await returnTestData(answer);
          }
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient[answer.objectName][0]['streetNumber'] = '225';
            dummyClient[answer.objectName][0]['streetName'] = 'Haines St';
            dummyClient[answer.objectName][0]['streetAddress'] =
              '225 Haines St';
            dummyClient[answer.objectName][0]['city'] = 'Newark';
            dummyClient[answer.objectName][0]['state'] = 'DE';
            dummyClient[answer.objectName][0]['zipCode'] = '19711';
            dummyClient[answer.objectName][0]['fullAddress'] =
              '225 Haines St Newark, DE 19711';
          } else {
            dummyClient[answer.objectName][0][
              answer.propertyKey
            ] = await returnTestData(answer);
          }
        } else {
          if (!dummyClient[answer.objectName]) {
            dummyClient[answer.objectName] = {};
          }
          if (answer.isAddressSearch && answer.propertyKey === 'fullAddress') {
            dummyClient[answer.objectName]['streetNumber'] = '225';
            dummyClient[answer.objectName]['streetName'] = 'Haines St';
            dummyClient[answer.objectName]['streetAddress'] = '225 Haines St';
            dummyClient[answer.objectName]['city'] = 'Newark';
            dummyClient[answer.objectName]['state'] = 'DE';
            dummyClient[answer.objectName]['zipCode'] = '19711';
            dummyClient[answer.objectName]['fullAddress'] =
              '225 Haines St Newark, DE 19711';
          } else {
            dummyClient[answer.objectName][
              answer.propertyKey
            ] = await returnTestData(answer);
          }
        }
        let result = await this.integrationValidator.validateEZLynx(
          dummyClient,
          type,
          'fields'
        );

        if (!result.status) {
          result.messages = [];
        }

        output = [...result.messages, ...optionMisMatches];

        if (!answer.validations) {
          answer.validations = [
            { vendor: 'EZLYNX', isValid: false, messages: [] },
          ];
        }

        if (output && output.length && output.length > 0) {
          if (!answer.validations.some((val) => val['vendor'] === 'EZLYNX')) {
            answer.validations.push({
              vendor: 'EZLYNX',
              isValid: false,
              messages: [],
            });
          }

          for (let validation of answer.validations) {
            if (validation['vendor'] === 'EZLYNX') {
              validation['isValid'] = false;
              validation['messages'] = output;
            }
          }

          await this.answersRepository.save({
            ...answer,
            ...{ validations: answer.validations },
          });
        } else {
          if (!answer.validations.some((val) => val['vendor'] === 'EZLYNX')) {
            answer.validations.push({
              vendor: 'EZLYNX',
              isValid: true,
              messages: [],
            });
          }

          for (let validation of answer.validations) {
            if (validation['vendor'] === 'EZLYNX') {
              validation['isValid'] = true;
              validation['messages'] = [];
            }
          }
          await this.answersRepository.save({
            ...answer,
            ...{ validations: answer.validations },
          });
        }

        dummyClient = {};

        globalMessages.push(...output);

        optionMisMatches = [];
      }
      let message;
      if (globalMessages.length > 0) {
        message = globalMessages.join('\n');
      } else {
        return {
          title: 'Form validated',
          valid: true,
        };
      }

      return {
        title: 'Form validated',
        valid: false,
        obj: message,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async bulkUpdate() {
    try {
      const decoded = this.request.body.decodedUser;
      const companyId = decoded.user.companyUserId;
      if (!companyId) {
        throw new HttpException(
          'Error bulk updating forms. No company id or token',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedPages = this.request.body.deletedPages;
      const deletedQuestions = this.request.body.deletedQuestions;
      const deletedAnswers = this.request.body.deletedAnswers;

      if (deletedPages) {
        await this.pagesRepository.delete({
          id: deletedPages,
          companyPageId: companyId,
        });
      }

      if (deletedQuestions) {
        await this.questionsRepository.delete({
          id: deletedQuestions,
          companyQuestionId: companyId,
        });
      }

      if (deletedAnswers) {
        await this.answersRepository.delete({
          id: deletedAnswers,
          companyAnswerId: companyId,
        });
      }

      const pages = this.request.body.form.pages;

      if (!pages || !pages[0]) {
        throw new HttpException(
          'Error bulk updating form. No pages sent',
          HttpStatus.BAD_REQUEST
        );
      }
      const newPages = await this.pagesRepository.save(pages);
      return {
        title: 'Form updated successfully',
        pages: newPages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createFormFromCSV(csvString: any) {
    try {
      const decoded = this.request.body.decodedUser;
      if (!decoded) {
        throw new HttpException(
          'Error creating form from csv. Auth failed',
          HttpStatus.BAD_REQUEST
        );
      }
      const companyId = decoded.user.companyUserId;
      if (!companyId) {
        throw new HttpException(
          'Error creating form from csv. Auth failed - User',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!csvString) {
        throw new HttpException(
          'Error creating form from csv. No csv string',
          HttpStatus.BAD_REQUEST
        );
      }

      const outputs = await csv().fromString(csvString);
      if (!outputs || (outputs && outputs.length === 0)) {
        throw new HttpException(
          'Error creating form from csv. CSV conversion failed',
          HttpStatus.BAD_REQUEST
        );
      }

      function returnExists(value) {
        return value !== '' && value !== 'NULL';
      }

      function returnAbsoluteValue(value) {
        if (returnExists(value)) {
          if (value === 'FALSE') return false;
          if (value === 'TRUE') return true;
          if (value === 'NULL') return null;
          return value;
        } else {
          return null;
        }
      }

      let form = { companyFormId: companyId, pages: [] };
      for (let i = 0; i < outputs.length; i++) {
        const row = outputs[i];
        if (returnExists(row.FormTitle)) {
          form['title'] = row.FormTitle;
          if (returnExists(row.FormType)) form[row.FormType] = true;
        }
        if (returnExists(row.PageTitle)) {
          let page = {
            companyPageId: companyId,
            questions: [],
            position: +row.Page,
          };
          const newPage = page;
          newPage['title'] = row.PageTitle;
          form.pages.push(newPage);
        }
        if (returnExists(row.QuestionHeader)) {
          let question = {
            companyQuestionId: companyId,
            answers: [],
            position: +row.Question,
          };
          const newQuestion = question;
          const pi = +row.Page;
          newQuestion['headerText'] = row.QuestionHeader;
          newQuestion['subHeaderText'] = row.QuestionSubheader;
          form.pages[pi].questions.push(newQuestion);
        }
        if (returnExists(row.AnswerType)) {
          const newAnswer = {
            companyAnswerId: companyId,
            position: +row.Answer,
          };
          const pi = +row.Page;
          const qi = +row.Question;
          let options = null;
          newAnswer[row.AnswerType] = true;
          newAnswer['objectName'] = returnAbsoluteValue(row.AnswerObject);
          newAnswer['propertyKey'] = returnAbsoluteValue(row.AnswerKey);
          newAnswer['width'] =
            row.AnswerWidth === 'small'
              ? '22'
              : row.AnswerWidth === 'med'
              ? '45'
              : row.AnswerWidth === 'large'
              ? '90'
              : null;
          newAnswer['placeholderText'] = returnAbsoluteValue(
            row.AnswerPlaceholder
          );
          newAnswer['isRequired'] = returnAbsoluteValue(row.AnswerRequired);
          if (returnExists(row.AnswerOptions)) {
            options = row.AnswerOptions.split('+');
            newAnswer['options'] = options;
          }
          if (returnExists(row.AnswerParams)) {
            const param = row.AnswerParams.includes('+')
              ? row.AnswerParams.split('+')
              : [row.AnswerParams];
            if (param) {
              param.forEach((item) => {
                let newItem = JSON.parse(item);
                Object.assign(newAnswer, newItem);
              });
            }
          }
          form.pages[pi].questions[qi].answers.push(newAnswer);
        }
      }

      const newForm = await this.formsRepository.save(form);
      if (!newForm) {
        throw new HttpException('Form create error', HttpStatus.BAD_REQUEST);
      }
      await this.formTemplateHelper.updateAllAnswers(companyId);

      return {
        title: 'Form created from csv successfully',
        form: newForm,
        formObj: form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createProgressiveAutoForm() {
    try {
      const request = await this.formTemplateHelper.createProgressiveAutoForm();

      if (!request.status) {
        throw new HttpException(
          'Error creating new Progressive auto form',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New Progressive Auto Form Created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createCSECAForm() {
    try {
      const decoded = this.request.body.decodedUser;

      const company = await this.companiesRepository.findOne({
        where: { id: decoded.user.companyUserId },
      });
      if (!company) {
        throw new HttpException('No found company', HttpStatus.BAD_REQUEST);
      }
      const { brandColor } = company;
      const companyId = company.id;

      const oldAutoForm = await this.formsRepository.findOne({
        where: {
          isAuto: true,
          companyFormId: decoded.user.companyUserId,
        },
      });

      const violationCodes = [
        'Disobeying, Fleeing, Eluding - FLEEING/ATTEMPTING TO ELUDE POLICE OFFICER',
        'Disobeying, Fleeing, Eluding - FLEE/ATTEMPT TO ELUDE OFFICER-FELONY',
        'Equipment - DEF/NO LAMPS, GENERALLY',
        'Equipment - DEF BRAKES, GENERALLY',
        'Equipment - OPER VEH IN UNSAFE CONDITION',
        'License, Registration, Insurance - DRIVER OR PERM OPER OF VEHICLE NOT REG',
        'License, Registration, Insurance - REG TO BE CARRIED IN VEHICLE AND DISPLAYED',
        'License, Registration, Insurance - SUSPENSION',
        'License, Registration, Insurance - REVOCATION',
        'License, Registration, Insurance - REINSTATEMENT',
        'License, Registration, Insurance - NO DRIV LIC, GENERALLY',
        'License, Registration, Insurance - DRIV WHILE LIC SUSP/REV',
        'License, Registration, Insurance - PERM UNAUTH TO DRIVE,GENERALLY',
        'License, Registration, Insurance - DRIV IN VIOL OF RESTR OF LIC',
        'License, Registration, Insurance - LIC OR REG VIOL-NO DISTINCTION',
        'License, Registration, Insurance - REGISTRATION RESTORED',
        'License, Registration, Insurance - SUSP OR WITHDWL, UNSPECF, OTHR',
        'License, Registration, Insurance - REVOCATION, UNSPECIFIED, OTHER',
        'License, Registration, Insurance - LICENSE RESTR/OCCUP LIC ISSUED',
        'License, Registration, Insurance - REIN,LIC RESTORED OR REISSUED',
        'Malicious Acts, Theft, Throwing - THEFT OF MV',
        'Malicious Acts, Theft, Throwing - DAMAGING/TAMPERING W/MV',
        'Narcotics/Alcohol - DUI, GENERALLY',
        'Narcotics/Alcohol - DRIV W/BAC GREATER THAN LEGAL LIMIT',
        'Other (accident) - NOT AT FAULT ACCIDENT',
        'Other (accident) - AT FAULT(CONTRIB) IN PD ACC',
        'Other (accident) - AT FAULT(CONTRIB) IN INJURY ACC',
        'Other (major) - FAIL TO STOP AFTER ACC-UNSPECF',
        'Other (major) - NEGLIGENT DRIVING',
        'Other (major) - DUI RESULTING IN DEATH/INJURY',
        'Other (major) - HOMICIDE BY VEH,NEGLIGENT HOMC',
        'Other (major) - INVOLUNTARY MANSLAUGHTER',
        'Other (major) - SERIOUS VIOL OF VEH LAW RESULTING IN DEATH',
        'Other (minor) - NO SVC DESCRIPTION AVAILABLE',
        'Other (minor) - MVR RECORD PENDING',
        'Other (minor) - NO DMV RESPONSE',
        'Other (minor) - REG VIOL, GENERALLY',
        'Other (minor) - VIOL OF INSTRUCTION PERM',
        'Other (minor) - DENIAL, GENERAL',
        'Other (minor) - DISQUALIFICATION, GENERALLY',
        'Other (minor) - CDL DISQUALIFICATION, GENERAL',
        'Other (minor) - ACTION PENDING',
        'Other (minor) - FAIL TO OBEY TRAF STRL SIGNAL, GENERAL',
        'Other (minor) - IMP TURN, GENERAL',
        'Other (minor) - LIMITATIONS ON TURNING AROUND, GENERALLY',
        'Other (minor) - IMP CROSSED DIVIDED HWY',
        'Other (minor) - FAIL TO DRIV RT SIDE,GENERALLY',
        'Other (minor) - DROVE ON WRONG SIDE OF DIV HWY',
        'Other (minor) - WRONG WAY,GENERALLY',
        'Other (minor) - FOLLOW TOO CLOSELY,GENERALLY',
        'Other (minor) - RIDERS ON MCYC, GENERALLY',
        'Other (minor) - RECKLESS DRIVING,WILLFUL AND WANTON DISREGARD',
        'Other (minor) - PARKING,GENERALLY',
        'Other (minor) - OTHER MOVING VIOL',
        'Other (minor) - SNOWMOBILE EQUIP VIOLATION',
        'Other (minor) - WATER CRAFT VIOLATIONS',
        'Other (minor) - OTHR NON-MOVING VIOL',
        'Other (minor) - OUT-OF-ST VIOL UNSPECIFIED',
        'Passing - IMP PASSING UNSPECIFIED, OTHER',
        'Safety restraints - CERTAIN SAFETY DEV REQ FOR HAZ/EXPLOS CARGO',
        'Safety restraints - FAIL TO USE RESTRAINT SYSTEM',
        'Speed (too fast or slow) - SPEEDING, GENERALLY',
        'Speed (too fast or slow) - SPEED GREATER THAN REASONABLE OR PRUDENT',
        'Speed (too fast or slow) - SPEED IN EXCESS OF 100 MPH',
        'Speed (too fast or slow) - RACING OR PARTICIPATING IN ANY MANNER IN RACE',
        'Title - ALTER,FORGE,COUNTERFEIT TITLE,REG,PLATES',
        'Title - POSSESSION/USE OF ALTERED TITLE,REG,PLATES',
        'Title - REG/TITLE WITHDRAWN',
        'Turn, Stop, Yield right of way - FAIL TO YLD UNSPECIFIED, OTHER',
        'Turn, Stop, Yield right of way - FAIL TO STOP-UNSPECIFIED,OTHER',
        'Turn, Stop, Yield right of way - FAIL TO OBEY NO LANE CHNG SIGN',
        'Turn, Stop, Yield right of way - POSITION AND METHOD OF TURN, GENERALLY',
        'Turn, Stop, Yield right of way - SIGNAL VIOL, GENERAL',
        'Turn, Stop, Yield right of way - FAIL TO YLD TO PED,GENERALLY',
        'Unsafe / overweight Load - VIOL OF TRANS OF HAZ/EXPLOS MATERIAL,GENERALL',
        'Unsafe / overweight Load - COMPLY W/REGULATIONS IF CARRYING HAZ MATERIAL',
        'Unsafe / overweight Load - LOAD EXTENDING BEYOND VEH',
        'Unsafe / overweight Load - UNSECUR/UNCOVD LOAD, LEAK LOAD',
        'Unsafe / overweight Load - OTHR PROJ LOAD VIOL',
        'Other (minor) - HAND-HELD WIRELESS TELEPHONE: PROHIBITED USE',
        'Other (minor) - HAND-HELD WIRELESS TELEPHONE: PROHIBITED USE',
        'Other (minor) - HAND-HELD WIRELESS TELEPHONE: PROHIBITED USE',
        'Other (minor) - HAND-HELD WIRELESS TELEPHONE: PROHIBITED USE',
        'Other (minor) - PROHIBITED USE OF ELECT WIRELESS COMM DEVICE',
        'Other (minor) - PROHIBITED USE OF ELECT WIRELESS COMM DEVICE',
        'Other (minor) - PROHIBITED USE OF ELECT WIRELESS COMM DEVICE',
        'Other (minor) - PROHIBITED USE OF ELECT WIRELESS COMM DEVICE',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - USE CELL PHONE WHILE DRIVING',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - WIRELESS PHONE USE PROHIBITED FOR PERS -18',
        'Other (minor) - USE TELEPHONE WHILE DRIVING SCHOOLBUS/TRANSIT',
        'Other (minor) - USE TELEPHONE WHILE DRIVING SCHOOLBUS/TRANSIT',
        'Other (minor) - USE TELEPHONE WHILE DRIVING SCHOOLBUS/TRANSIT',
        'Other (minor) - USE TELEPHONE WHILE DRIVING SCHOOLBUS/TRANSIT',
      ];

      const options = {
        carrier: [
          '21st Century ',
          'Affirmative Ins ',
          'Aig: Aig National Ins Co ',
          'Aig: Illinois National Ins Co ',
          'Aig: Other ',
          'Alfa ',
          'Allstate American Bankers ',
          'American Century Casualty ',
          'American Modern ',
          'American National ',
          'AssuranceAmerica Ins Co ',
          'Auto-owners ',
          'Cincinnati Financial ',
          'Cotton States Ins ',
          'Cwi - Deployed Military ',
          'Dairyland ',
          'Emc Ins ',
          'Encompass ',
          'Esurance ',
          'Farm Bureau ',
          'Farmers ',
          'First Acceptance Ins ',
          'Geico ',
          'Guideone ',
          'Hartford ',
          'Horace Mann ',
          'Infinity ',
          'Integon ',
          'Kingsway ',
          'Liberty Mutual ',
          'Metlife ',
          'National General ',
          'Nationwide ',
          'Omni Ins ',
          'Other Standard ',
          'Other Non-standard ',
          'Progressive Quality Casualty Ins Co Inc ',
          'Safeco ',
          'Safeway Ins ',
          'Sagamore Ins Co ',
          'Sentry Ins ',
          'State Auto ',
          'State Farm ',
          'Travelers ',
          'USAA ',
          'Usagencies ',
          'Victoria',
        ],
      };

      const autoForm = {
        title: 'Auto',
        isAuto: true,
        isHome: false,
        hasVendorRates: true,
        companyFormId: companyId,
        pages: [
          {
            title: 'Start',
            position: 0,
            isStartPage: true,
            progressButtonText: 'Start Quote &#8594;',
            companyPageId: company.id,
            questions: [
              {
                headerText: 'What is your zip code?',
                subHeaderText:
                  'Enter in your zip code to start your free quote!',
                companyQuestionId: company.id,
                position: 0,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path style="fill:${company.brandColor}" d="M365.017,343.585c-2.214,0-4.427-0.844-6.116-2.534c-3.378-3.378-3.378-8.854,0.001-12.23 l18.715-18.716c1.622-1.623,3.822-2.533,6.116-2.533h17.561c4.778,0,8.649,3.872,8.649,8.649s-3.871,8.649-8.649,8.649h-13.98 l-16.183,16.182C369.444,342.741,367.23,343.585,365.017,343.585z"/> <path style="fill:${company.brandColor}" d="M146.978,343.585c-2.214,0-4.427-0.844-6.116-2.534l-16.181-16.182H110.7 c-4.778,0-8.649-3.872-8.649-8.649s3.871-8.649,8.649-8.649h17.563c2.294,0,4.493,0.911,6.116,2.533l18.715,18.716 c3.378,3.378,3.378,8.854-0.001,12.23C151.405,342.741,149.191,343.585,146.978,343.585z"/> </g> <path style="fill:#4EBFED;" d="M356.328,336.67H153.372l11.347-48.098c2.433-10.332,11.658-17.632,22.279-17.632h135.692 c10.621,0,19.846,7.299,22.279,17.632L356.328,336.67z"/> <path style="fill:#92DDF4;" d="M356.328,336.67H242.834l28.956-65.73h50.9c10.621,0,19.846,7.299,22.279,17.632L356.328,336.67z"/> <path style="fill:${company.brandColor}" d="M356.324,342.437c-2.614,0-4.98-1.789-5.607-4.442l-11.359-48.098 c-1.83-7.768-8.683-13.191-16.668-13.191H186.998c-7.984,0-14.838,5.423-16.667,13.188l-11.348,48.101 c-0.731,3.1-3.826,5.023-6.936,4.287c-3.1-0.731-5.019-3.837-4.287-6.935l11.347-48.098c3.06-12.996,14.531-22.074,27.891-22.074 h135.692c13.361,0,24.83,9.078,27.893,22.076l11.357,48.095c0.732,3.1-1.187,6.204-4.286,6.936 C357.208,342.386,356.762,342.437,356.324,342.437z"/> <g> <rect x="133.766" y="427.444" style="fill:#415E72;" width="43.82" height="54.106"/> <rect x="334.416" y="427.444" style="fill:#415E72;" width="43.82" height="54.106"/> </g> <polyline style="fill:#CFDCE5;" points="464.249,140.31 47.751,140.31 47.751,238.328 464.249,238.328 "/> <g> <polyline style="fill:#C1CED6;" points="464.249,140.31 47.751,140.31 47.751,158.76 464.249,158.76 "/> <polyline style="fill:#C1CED6;" points="464.249,192.202 47.751,192.202 47.751,202.581 464.249,202.581 "/> <polyline style="fill:#C1CED6;" points="464.249,215.265 47.751,215.265 47.751,225.644 464.249,225.644 "/> <polyline style="fill:#C1CED6;" points="464.249,169.139 47.751,169.139 47.751,179.517 464.249,179.517 "/> </g> <polygon style="fill:${company.brandColor}" points="464.252,116.382 464.252,147.413 47.755,147.413 47.755,116.382 256.003,35.165 "/> <polygon style="fill:${company.brandColor}" points="464.252,121.387 464.252,147.413 461.173,147.413 256.003,67.396 50.822,147.413 47.755,147.413 47.755,121.387 256.003,40.158 "/> <g> <path style="fill:#415E72;" d="M464.249,481.81c-4.778,0-8.649-3.872-8.649-8.649V122.737c0-4.776,3.871-8.649,8.649-8.649 c4.778,0,8.649,3.872,8.649,8.649V473.16C472.898,477.937,469.025,481.81,464.249,481.81z"/> <path style="fill:#415E72;" d="M47.75,481.81c-4.778,0-8.649-3.872-8.649-8.649V122.737c0-4.776,3.871-8.649,8.649-8.649 s8.649,3.872,8.649,8.649V473.16C56.399,477.937,52.528,481.81,47.75,481.81z"/> <polygon style="fill:#415E72;" points="502.782,145.026 256,48.779 9.218,145.026 0,121.391 256,21.547 512,121.391 "/> </g> <rect x="4.844" y="473.155" style="fill:#344F5E;" width="502.304" height="17.297"/> <path style="fill:${company.brandColor}" d="M383.998,419.694v-65.776c0-10.482-8.499-18.981-18.981-18.981H146.978 c-10.482,0-18.981,8.499-18.981,18.981v65.776"/> <g> <circle style="fill:#FCD577;" cx="171.821" cy="383.37" r="19.604"/> <circle style="fill:#FCD577;" cx="340.182" cy="383.37" r="19.604"/> </g> <rect x="113.01" y="418.542" style="fill:#CFDCE5;" width="285.983" height="27.676"/> <g> <rect x="208.145" y="366.327" style="fill:#314A5F;" width="95.712" height="12.685"/> <rect x="208.145" y="389.39" style="fill:#314A5F;" width="95.712" height="12.685"/> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isStartPageInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    hasSecondaryPlaceholder: true,
                    secondaryPlaceholderText: 'Zip Code',
                    placeholderText: 'Enter Zip Code',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'postalCd',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: company.id,
                  },
                ],
              },
            ],
          },
          {
            title: 'Drivers',
            position: 1,
            isDriver: true,
            isVehicle: false,
            companyPageId: companyId,
            questions: [
              {
                headerText: 'Can you tell us about the driver?',
                subHeaderText:
                  'We need this information to get you an accurate quote',
                companyQuestionId: companyId,
                position: 0,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 58.27 58.27" style="enable-background:new 0 0 58.27 58.27;" xml:space="preserve"> <g> <g> <path style="fill:#ECF0F1;" d="M18.613,41.696l-7.907,4.313c-0.464,0.253-0.881,0.564-1.269,0.903 c4.611,3.886,10.562,6.231,17.064,6.231c6.454,0,12.367-2.31,16.964-6.144c-0.424-0.358-0.884-0.68-1.394-0.934l-8.467-4.233 c-1.094-0.547-1.785-1.665-1.785-2.888v-3.322c0.238-0.271,0.51-0.619,0.801-1.03c1.154-1.63,2.027-3.423,2.632-5.304 c1.086-0.335,1.886-1.338,1.886-2.53v-3.546c0-0.78-0.347-1.477-0.886-1.965v-5.126c0,0,1.053-7.977-9.75-7.977 s-9.75,7.977-9.75,7.977v5.126c-0.54,0.488-0.886,1.185-0.886,1.965v3.546c0,0.934,0.491,1.756,1.226,2.231 c0.886,3.857,3.206,6.633,3.206,6.633v3.24C20.296,40.043,19.65,41.13,18.613,41.696z"/> <g> <path style="fill:#556080;" d="M26.953,0.148C12.32-0.102,0.254,11.558,0.004,26.191c-0.142,8.297,3.556,15.754,9.444,20.713 c0.385-0.336,0.798-0.644,1.257-0.894l7.907-4.313c1.037-0.566,1.683-1.653,1.683-2.835v-3.24c0,0-2.321-2.776-3.206-6.633 c-0.734-0.475-1.226-1.296-1.226-2.231v-3.546c0-0.78,0.347-1.477,0.886-1.965v-5.126c0,0-1.053-7.977,9.75-7.977 s9.75,7.977,9.75,7.977v5.126c0.54,0.488,0.886,1.185,0.886,1.965v3.546c0,1.192-0.8,2.195-1.886,2.53 c-0.605,1.881-1.478,3.674-2.632,5.304c-0.291,0.411-0.563,0.759-0.801,1.03v3.322c0,1.223,0.691,2.342,1.785,2.888l8.467,4.233 c0.508,0.254,0.967,0.575,1.39,0.932c5.71-4.762,9.399-11.882,9.536-19.9C53.246,12.464,41.587,0.398,26.953,0.148z"/> </g> </g> <g> <polygon style="fill:#EDDCC7;" points="36.836,48.633 36.828,48.64 34.84,55.93 39.487,51.283 "/> <path style="fill:#D75A4A;" d="M56.086,34.684l-1.247-1.247c-0.775-0.775-2.032-0.775-2.807,0l-3.582,3.582L51.1,39.67 L56.086,34.684z"/><rect x="42.094" y="35.939" transform="matrix(0.7071 0.7071 -0.7071 0.7071 44.0976 -18.1587)" style="fill:#F29C21;" width="3.749" height="16.424"/> <polygon style="fill:#D6C4B1;" points="42.485,54.297 42.493,54.29 39.487,51.283 34.84,55.93 34.707,56.418 "/> <path style="fill:#A34740;" d="M54.107,42.676l3.582-3.582c0.775-0.775,0.775-2.032,0-2.807l-1.602-1.602L51.1,39.67 L54.107,42.676z"/><rect x="44.671" y="38.768" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 46.6666 113.2895)" style="fill:#E18C25;" width="4.251" height="16.424"/> <path style="fill:#5E5E5E;" d="M34,58.126c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l2.207-2.207 c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-2.207,2.207C34.512,58.028,34.256,58.126,34,58.126z"/> </g> </g> </svg>',
                answers: [
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'First Name',
                    errorText: 'First Name Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantGivenName',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Last Name',
                    errorText: 'Last Name Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantSurname',
                    displayValue: null,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Birthday',
                    errorText: 'Birthday Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantBirthDt',
                    displayValue: null,
                    width: '45',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Gender',
                    errorText: 'Gender Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantGenderCd',
                    displayValue: null,
                    width: '45',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: ['Male', 'Female'],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Marital Status',
                    errorText: 'Marital Status Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantMaritalStatusCd',
                    displayValue: null,
                    width: '45',
                    position: 4,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      'Married',
                      'Single',
                      'Separated',
                      'Divorced',
                      'Widowed',
                    ],
                  },
                ],
              },
              {
                headerText: "We can quote you faster with a driver's license",
                subHeaderText:
                  'If you do not know your license information, you can skip this question',
                companyQuestionId: companyId,
                position: 1,
                errorText: 'Question Is Required',
                isRequired: false,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#D1D3D4;" d="M508,417H4c-2.209,0-4-1.791-4-4V156.923h512V413C512,415.209,510.209,417,508,417z"/> <path style="fill:#A7A9AC;" d="M481.095,156.923V417H508c2.209,0,4-1.791,4-4V156.923H481.095z"/> <g> <rect x="240.98" y="187.88" style="fill:${brandColor}" width="240.11" height="198.15"/> <path style="fill:${brandColor}" d="M512,156.923H0V99c0-2.209,1.791-4,4-4h504c2.209,0,4,1.791,4,4V156.923z"/> </g> <path style="fill:#8768ff;" d="M481.095,95v61.923H512V99c0-2.209-1.791-4-4-4H481.095z"/> <rect x="31.11" y="188.78" style="fill:#ffffff;" width="173.07" height="197.26"/> <path style="fill:${brandColor}" d="M169.162,386.038H66.118v-39.485c0-28.455,23.067-51.522,51.522-51.522l0,0 c28.455,0,51.522,23.067,51.522,51.522V386.038z"/> <g> <ellipse style="fill:#FFD359;" cx="117.64" cy="265.72" rx="29.25" ry="29.31"/> <path style="fill:#FFD359;" d="M92.716,156.923H0V99c0-2.209,1.791-4,4-4h88.716V156.923z"/> <path style="fill:#FFD359;" d="M395.074,237.907H280.437c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h114.638 c4.143,0,7.5,3.357,7.5,7.5S399.217,237.907,395.074,237.907z"/> <path style="fill:#FFD359;" d="M348.373,277.731h-67.937c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h67.937 c4.143,0,7.5,3.357,7.5,7.5S352.516,277.731,348.373,277.731z"/> <path style="fill:#FFD359;" d="M444.652,277.731h-67.936c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h67.936 c4.143,0,7.5,3.357,7.5,7.5S448.795,277.731,444.652,277.731z"/> <path style="fill:#FFD359;" d="M443.149,315.561H280.437c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5H443.15 c4.143,0,7.5,3.357,7.5,7.5S447.292,315.561,443.149,315.561z"/> <path style="fill:#FFD359;" d="M443.149,354.387H280.437c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5H443.15 c4.143,0,7.5,3.357,7.5,7.5S447.292,354.387,443.149,354.387z"/> <path style="fill:#FFD359;" d="M444.652,237.907h-17.299c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h17.299 c4.143,0,7.5,3.357,7.5,7.5S448.795,237.907,444.652,237.907z"/> </g> </svg>`,
                answers: [
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: "Driver's License Number",
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'driverLicenseNumber',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Date License Issued',
                    errorText: 'Date License Issued Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'driverLicensedDt',
                    displayValue: null,
                    width: '45',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
              {
                headerText: 'Add or select a driver',
                subHeaderText: 'You must add your spouse if you are married',
                companyQuestionId: companyId,
                position: 5,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#95D6A6;" d="M428.854,204.583c-6.667-3.176-13.611-5.855-20.787-7.997c-6.736-2.014-13.679-3.549-20.787-4.569 c-6.793-0.974-13.727-1.492-20.787-1.492c-4.491,0-8.937,0.205-13.326,0.606c-6.189,0.564-12.263,1.53-18.205,2.849 c-2.117,0.47-4.217,0.987-6.298,1.549c-3.489,0.941-6.927,2.009-10.307,3.198c-5.891,2.073-11.609,4.516-17.128,7.3 c-1.088,0.549-2.166,1.111-3.239,1.686c-6.226,3.34-12.182,7.119-17.828,11.298c-2.102,1.556-4.161,3.168-6.175,4.832 c-1.66,1.372-3.298,2.767-4.895,4.21c-2.065,1.865-4.076,3.787-6.029,5.766c-4.886,4.947-9.423,10.241-13.567,15.841 c-1.103,1.491-2.18,3.003-3.229,4.537c-2.097,3.067-4.08,6.215-5.942,9.443c-0.931,1.614-1.832,3.248-2.701,4.9 c-0.888,1.692-1.754,3.398-2.579,5.127c-1.695,3.56-3.241,7.203-4.644,10.916c-0.468,1.238-0.92,2.483-1.357,3.736 c-0.352,1.013-0.696,2.03-1.03,3.053c-0.334,1.021-0.657,2.05-0.967,3.082c-1.006,3.369-1.892,6.79-2.655,10.256 c-0.764,3.466-1.402,6.979-1.914,10.53c-0.244,1.698-0.459,3.405-0.644,5.122c-0.556,5.148-0.847,10.374-0.847,15.665 c0,12.751,1.655,25.12,4.752,36.91c1.032,3.93,2.226,7.796,3.57,11.592c1.278,3.602,2.69,7.139,4.235,10.607 c1.545,3.467,3.221,6.862,5.025,10.18c1.993,3.665,4.141,7.236,6.433,10.704c2.292,3.467,4.728,6.83,7.297,10.083 c26.671,33.741,67.946,55.431,114.193,55.431C446.727,481.534,512,416.26,512,336.028C512,278.102,477.97,227.978,428.854,204.583z" /> <path style="fill:#9CDD05;" d="M89.101,308.136c12.261-15.887,27.445-29.402,44.745-39.734c7.191-4.294,14.743-8.043,22.603-11.178 c7.719-3.079,15.735-5.567,23.989-7.417c-19.756-18.216-45.649-28.453-72.869-28.453C48.253,221.355,0,269.61,0,328.923 c0,11.48,9.305,20.787,20.787,20.787h45.179c2.686-7.188,5.87-14.131,9.522-20.787C79.489,321.63,84.047,314.684,89.101,308.136z"/> <g> <path style="fill:#EFC27B;" d="M128.354,117.425c0-11.207,2.155-21.913,6.031-31.759c2.601-6.6,5.981-12.806,10.036-18.507 c-10.331-7.595-23.073-12.096-36.853-12.096c-34.387,0-62.36,27.976-62.36,62.361s27.973,62.358,62.36,62.358 c13.776,0,26.52-4.5,36.853-12.095c-4.055-5.701-7.437-11.907-10.036-18.507C130.509,139.335,128.354,128.63,128.354,117.425z"/> <path style="fill:#EFC27B;" d="M144.421,67.159c-4.055,5.701-7.435,11.907-10.036,18.507c-3.876,9.846-6.031,20.552-6.031,31.759 c0,11.204,2.155,21.91,6.031,31.754c2.598,6.602,5.981,12.807,10.036,18.507c15.771,22.182,41.66,36.694,70.891,36.694 c47.948,0,86.957-39.008,86.957-86.956c0-47.949-39.009-86.959-86.957-86.959C186.08,30.466,160.195,44.978,144.421,67.159z"/> </g> <path style="fill:#A4E276;" d="M229.311,384.531c-5.381-15.178-8.323-31.501-8.323-48.502c0-7.055,0.517-13.995,1.491-20.787 c1.023-7.103,2.558-14.049,4.569-20.787c0.619-2.066,1.294-4.107,1.997-6.135c1.746-5.011,3.74-9.904,6-14.652 c0.826-1.729,1.692-3.437,2.579-5.127c3.478-6.612,7.457-12.915,11.871-18.88c-11.183-2.446-22.627-3.708-34.184-3.708 c-11.977,0-23.645,1.337-34.874,3.854c-8.252,1.849-16.269,4.337-23.989,7.417c-7.86,3.136-15.411,6.883-22.603,11.178 c-17.3,10.332-32.484,23.848-44.745,39.734c-5.053,6.546-9.61,13.492-13.614,20.787c-3.652,6.656-6.837,13.599-9.522,20.787 c-6.472,17.321-10.018,36.058-10.018,55.608c0,11.48,9.305,20.787,20.787,20.787h175.565c-5.14-6.505-9.743-13.454-13.73-20.787 C234.962,398.684,231.865,391.736,229.311,384.531z"/> <path style="fill:#368B4C;" d="M408.067,315.242H387.28v-20.787c0-11.48-9.308-20.787-20.787-20.787 c-11.478,0-20.787,9.307-20.787,20.787v20.787h-20.787c-11.478,0-20.787,9.307-20.787,20.787c0,11.481,9.308,20.787,20.787,20.787 h20.787v20.787c0,11.481,9.308,20.787,20.787,20.787c11.478,0,20.787-9.305,20.787-20.787v-20.787h20.787 c11.478,0,20.787-9.305,20.787-20.787C428.854,324.549,419.545,315.242,408.067,315.242z"/> <path style="fill:#64C37D;" d="M345.707,377.602v-20.787h-20.787c-11.478,0-20.787-9.305-20.787-20.787 c0-11.48,9.308-20.787,20.787-20.787h20.787v-20.787c0-11.48,9.308-20.787,20.787-20.787v-83.146 c-47.912,0-90.473,23.296-116.998,59.139c-4.415,5.964-8.394,12.27-11.871,18.88c-0.888,1.692-1.754,3.398-2.579,5.127 c-2.26,4.748-4.254,9.639-6,14.652c-0.704,2.027-1.377,4.069-1.997,6.135c-2.011,6.738-3.546,13.683-4.569,20.787 c-0.974,6.792-1.491,13.732-1.491,20.787c0,17.001,2.942,33.324,8.323,48.502c2.555,7.203,5.651,14.153,9.26,20.787 c3.987,7.332,8.59,14.282,13.73,20.787c26.671,33.741,67.946,55.431,114.193,55.431v-83.146 C355.016,398.389,345.707,389.085,345.707,377.602z"/> <path style="fill:#ECB45C;" d="M144.421,67.159c-4.055,5.701-7.435,11.907-10.036,18.507c-3.876,9.846-6.031,20.552-6.031,31.758 c0,11.204,2.155,21.91,6.031,31.755c2.598,6.602,5.981,12.807,10.036,18.507c15.771,22.182,41.66,36.694,70.891,36.694V30.465 C186.08,30.466,160.195,44.978,144.421,67.159z"/> <path style="fill:#64C37D;" d="M156.45,257.224c-7.86,3.136-15.411,6.883-22.603,11.178c-17.3,10.332-32.484,23.848-44.745,39.734 c-5.053,6.546-9.612,13.492-13.614,20.787c-3.652,6.656-6.837,13.599-9.522,20.787c-6.472,17.321-10.018,36.058-10.018,55.608 c0,11.48,9.305,20.787,20.787,20.787h138.577v-180.15c-11.977,0-23.645,1.337-34.874,3.854 C172.185,251.658,164.168,254.147,156.45,257.224z"/> <path style="fill:#ECB45C;" d="M107.568,55.062c-34.387,0-62.36,27.976-62.36,62.361s27.973,62.358,62.36,62.358 c0.058,0,0.115-0.003,0.173-0.004V55.066C107.683,55.066,107.626,55.062,107.568,55.062z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    isAddDriver: true,
                    width: '60',
                    placeholder: 'Select a driver',
                    displayValue: 'Add Driver',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
            ],
          },
          {
            title: 'Insurance',
            position: 2,
            isDriver: false,
            isVehicle: false,
            isInsurance: true,
            companyPageId: companyId,
            questions: [
              {
                headerText: 'Have you had insurance for the past 6 months?',
                subHeaderText:
                  'Please answer no if your insurance was stopped, cancelled or inactive at anytime in the past 6 months',
                companyQuestionId: companyId,
                position: 0,
                isClient: true,
                errorText: 'Insurance Status Is Required',
                isRequired: false,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#f0c087;" d="M402.407,427.983v59.628c0,9.517-7.787,17.232-17.393,17.232H150.031 c-3.87,0-7.732-0.36-11.535-1.076l-60.344-11.36c-14.014,0-25.87-10.942-26.146-24.836c-0.153-7.2,2.741-13.752,7.478-18.447 c4.624-4.584,11.027-7.423,18.085-7.423l61.713,11.399c3.735,0.69,7.526,1.037,11.325,1.037h50.152 c-15.508-0.081-28.038-12.555-28.038-27.939c0-7.718,3.151-14.695,8.255-19.755c5.094-5.06,12.142-8.184,19.926-8.184h171.523 C388.984,398.259,402.407,411.567,402.407,427.983z"/> <g> <path style="fill:#d4a56d;" d="M372.425,398.259h-30.737c16.558,0,29.982,13.308,29.982,29.724v59.628 c0,9.517-7.787,17.232-17.393,17.232h30.737c9.606,0,17.393-7.715,17.393-17.232v-59.628 C402.407,411.567,388.984,398.259,372.425,398.259z"/> <path style="fill:#d4a56d;" d="M292.293,469.14h-94.95c-4.142,0-18.221,0-18.221-15h113.171c4.142,0,7.499,3.358,7.499,7.5 S296.435,469.14,292.293,469.14z"/> </g> <path style="fill:#5c5aff;" d="M456,512h-52.896c-2.209,0-4-1.791-4-4V400.279c0-2.209,1.791-4,4-4H456c2.209,0,4,1.791,4,4V508 C460,510.209,458.209,512,456,512z"/> <path style="fill:#ffffff;" d="M429.552,396.28V512H456c2.209,0,3.999-1.791,3.999-4V400.28c0-2.209-1.791-4-3.999-4H429.552z"/> <path style="fill:#cfd2da;" d="M402.886,54.368c3.805,1.452,6.319,5.108,6.319,9.189v127.664c0,32.81-12.653,64.37-35.423,87.917 c-23.348,24.151-59.898,51.708-114.352,68.932c-0.554,0.175-1.156,0.175-1.71,0c-54.455-17.224-90.997-44.781-114.352-68.932 c-22.763-23.547-35.423-55.107-35.423-87.917V63.556c0-4.081,2.515-7.737,6.319-9.189L255.086,0.643 c2.247-0.857,4.731-0.857,6.978,0L402.886,54.368z"/> <path style="fill:#eff2fa;" d="M402.886,54.368l-24.586-9.38v149.12c0,38.343-12.653,75.225-35.423,102.743 c-6.608,7.988-14.275,16.294-23.104,24.555c22.92-13.486,40.636-28.435,54.01-42.269c22.77-23.547,35.423-55.107,35.423-87.917 V63.556C409.206,59.476,406.691,55.819,402.886,54.368z"/> <path style="fill:${brandColor}" d="M378.3,81.97v108.02c0,25.46-9.67,49.49-27.25,67.66c-24.58,25.43-55.67,44.59-92.47,57.01V33.99 c0.59,0,1.16,0.07,1.71,0.2l1.84,0.7c0.01,0,0.01,0,0.02,0.01l113.58,43.33C377.28,78.83,378.3,80.31,378.3,81.97z"/> <path style="fill:${brandColor}" d="M258.58,33.99v280.67c-36.8-12.42-67.89-31.58-92.48-57.01c-17.57-18.17-27.25-42.2-27.25-67.66 V81.97c0-1.66,1.02-3.14,2.57-3.74l113.56-43.32l1.89-0.72C257.42,34.06,257.99,33.99,258.58,33.99z"/> <path style="fill:#fdfdfd;" d="M243.593,227.899c-3.953,0-7.904-1.514-10.919-4.543l-49.929-50.146 c-6.031-6.056-6.031-15.877,0-21.933c6.03-6.056,15.808-6.056,21.838,0l39.01,39.18l68.976-69.275 c6.031-6.057,15.808-6.057,21.838,0c6.031,6.056,6.031,15.877,0,21.933l-79.895,80.241 C251.497,226.384,247.544,227.899,243.593,227.899z"/> <g> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isClient: true,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: null,
                    isRequired: false,
                    propertyValue: 'Yes',
                    propertyKey: 'hasPriorInsurance',
                    displayValue: 'Yes, I have',
                    isConditionParent: true,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    isClient: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: null,
                    isRequired: false,
                    propertyValue: 'No',
                    propertyKey: 'hasPriorInsurance',
                    displayValue: "No, I haven't",
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isSpacer: true,
                    width: '90',
                    position: 2,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    isClient: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Insurance Company',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorInsuranceCompany',
                    displayValue: null,
                    width: '45',
                    position: 3,
                    hasCustomHtml: false,
                    isConditional: true,
                    conditionValue: 'Yes',
                    conditionKey: 'hasPriorInsurance',
                    companyAnswerId: companyId,
                    options: options.carrier,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Years With Company',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorInsuranceDuration',
                    displayValue: null,
                    width: '45',
                    position: 4,
                    hasCustomHtml: false,
                    isConditional: true,
                    conditionValue: 'Yes',
                    conditionKey: 'hasPriorInsurance',
                    companyAnswerId: companyId,
                    options: [
                      'Less Than 1 Year',
                      'At Least 1 Year But less Then 3',
                      'At Least 3 Year But Less Than 5 Years',
                      '5 Years Or More',
                    ],
                  },
                ],
              },
              {
                headerText: 'What is your home address?',
                subHeaderText:
                  'This helps us understand where your vehicle will be insured at',
                companyQuestionId: companyId,
                position: 1,
                isClient: true,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.533 512.533" style="enable-background:new 0 0 512.533 512.533;" xml:space="preserve"> <path style="fill:#F3705B;" d="M406.6,62.4c-83.2-83.2-217.6-83.2-299.733,0c-83.2,83.2-83.2,216.533,0,299.733l149.333,150.4 L405.533,363.2C488.733,280,488.733,145.6,406.6,62.4z"/> <path style="fill:#F3F3F3;" d="M256.2,70.933c-77.867,0-141.867,62.933-141.867,141.867c0,77.867,62.933,141.867,141.867,141.867 c77.867,0,141.867-62.933,141.867-141.867S334.066,70.933,256.2,70.933z"/> <polygon style="fill:#FFD15D;" points="256.2,112.533 176.2,191.467 176.2,305.6 336.2,305.6 336.2,191.467 "/> <g> <rect x="229.533" y="241.6" style="fill:#435B6C;" width="54.4" height="64"/> <path style="fill:#435B6C;" d="M356.466,195.733L264.733,104c-4.267-4.267-11.733-4.267-17.067,0l-91.733,91.733 c-4.267,4.267-4.267,11.733,0,17.067c4.267,4.267,11.733,4.267,17.067,0l83.2-84.267l83.2,83.2c2.133,2.133,5.333,3.2,8.533,3.2 c3.2,0,6.4-1.067,8.533-3.2C360.733,207.467,360.733,200,356.466,195.733z"/> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isAddressSearch: true,
                    isSelect: false,
                    isClient: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    secondaryPlaceholderText: 'Home Address',
                    errorText: 'Home Address Is Required',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'fullAddress',
                    displayValue: null,
                    width: '80',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Years At Address',
                    errorText: 'Years At Address Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'lengthAtAddress',
                    displayValue: null,
                    isConditionParent: false,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      '2 Months Or Less',
                      'More Than 2 Months But Less Than 1 Year',
                      '1 Year Or More',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Own Or Rent Home',
                    errorText: 'Home Ownership Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'homeownership',
                    displayValue: null,
                    isConditionParent: true,
                    width: '45',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: ['Own Home/Condo', 'Own Mobile Home', 'Rent'],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Current Renters Limits',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'rentersLimits',
                    displayValue: null,
                    conditionKey: 'homeownership',
                    conditionValue: 'Rent',
                    isConditional: true,
                    width: '45',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      'Greater Than $300,000',
                      '$300,000',
                      'Less Than $300,000',
                      "Don't Have Renters Insurance",
                      'Not Sure',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Total Residents In Home',
                    errorText: 'No. Of Residents Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'numberOfResidentsInHome',
                    displayValue: null,
                    width: '45',
                    position: 4,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9+'],
                  },
                ],
              },
              {
                headerText: 'How can an agent contact you?',
                subHeaderText: 'This is important for getting you your quote',
                companyQuestionId: companyId,
                position: 2,
                isClient: true,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 58.981 58.981" style="enable-background:new 0 0 58.981 58.981;" xml:space="preserve"> <g> <path style="fill:#545E73;" d="M35.89,58H10.701c-1.881,0-3.405-1.525-3.405-3.405V3.405C7.296,1.525,8.821,0,10.701,0H35.89 c1.881,0,3.405,1.525,3.405,3.405v51.189C39.296,56.475,37.771,58,35.89,58z"/> <rect x="7.296" y="6" style="fill:#8697CB;" width="32" height="40"/> <circle style="fill:#323A45;" cx="23.296" cy="52" r="3"/> <path style="fill:#323A45;" d="M23.296,4h-4c-0.553,0-1-0.447-1-1s0.447-1,1-1h4c0.553,0,1,0.447,1,1S23.849,4,23.296,4z"/> <path style="fill:#323A45;" d="M27.296,4h-1c-0.553,0-1-0.447-1-1s0.447-1,1-1h1c0.553,0,1,0.447,1,1S27.849,4,27.296,4z"/> <g> <circle style="fill:${brandColor}" cx="39.686" cy="46.981" r="12"/> <path style="fill:#FFFFFF;" d="M45.686,45.981h-5v-5c0-0.552-0.448-1-1-1s-1,0.448-1,1v5h-5c-0.552,0-1,0.448-1,1s0.448,1,1,1h5v5 c0,0.552,0.448,1,1,1s1-0.448,1-1v-5h5c0.552,0,1-0.448,1-1S46.238,45.981,45.686,45.981z"/> </g> </g> </svg>`,
                answers: [
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'First Name',
                    errorText: 'First Name Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'firstName',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Last Name',
                    errorText: 'Last Name Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'lastName',
                    displayValue: null,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Birthday',
                    errorText: 'Birthday Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'birthday',
                    displayValue: null,
                    width: '45',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Gender',
                    errorText: 'Gender Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'gender',
                    displayValue: null,
                    width: '45',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: ['Male', 'Female'],
                  },
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    isClient: true,
                    placeholderText: 'Email',
                    errorText: 'Email Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'email',
                    displayValue: null,
                    width: '45',
                    position: 4,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Phone Number',
                    errorText: 'Phone Is Required',
                    isRequired: true,
                    propertyValue: null,
                    isClient: true,
                    propertyKey: 'phone',
                    displayValue: null,
                    width: '45',
                    position: 5,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    fireNewLead: true,
                  },
                ],
              },
              {
                headerText:
                  'How many accidents, violations, or speeding tickets have you had in the last 5 years?',
                subHeaderText:
                  'If more than 1, please select the biggest violation on your record or the most recent',
                companyQuestionId: companyId,
                position: 3,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path style="fill:#9AA7B8;" d="M488.897,230.149h-28.81c-24.365,0-32.777,63.655-32.777,63.655l14.7,5.436l11.059-29.909h27.393 c13.149,0,23.808-10.659,23.808-23.808C504.271,237.031,497.388,230.149,488.897,230.149z"/> <path style="fill:#9AA7B8;" d="M51.896,230.149h-28.81c-8.491,0-15.374,6.883-15.374,15.374c0,13.149,10.659,23.808,23.808,23.808 h27.393l11.058,29.909l14.7-5.436C84.672,293.804,72.098,230.149,51.896,230.149z"/> </g> <rect x="136.098" y="141.365" style="fill:#384149;" width="239.794" height="62.691"/> <path style="fill:#C0EAF9;" d="M434.664,296.521H77.319l29.153-87.531c4.712-14.179,17.983-23.74,32.925-23.74h233.19 c14.942,0,28.212,9.561,32.925,23.74L434.664,296.521z"/> <path style="fill:#A0D9F2;" d="M433.347,296.521H78.636l21.65-62.454c4.911-14.179,18.725-23.74,34.283-23.74h242.845 c15.559,0,29.372,9.561,34.283,23.74L433.347,296.521z"/> <path style="fill:#444D56;" d="M429.7,306.434l-31.621-94.972c-3.659-10.993-13.903-18.379-25.489-18.379H139.391 c-11.586,0-21.83,7.385-25.489,18.379l-31.621,94.972l-14.871-4.952l31.621-94.972c5.795-17.406,22.014-29.101,40.36-29.101h233.199 c18.346,0,34.565,11.695,40.36,29.101l31.621,94.972L429.7,306.434z"/> <path style="fill:#616970;" d="M349.586,268.312H162.397c-6.559,0-12.603,3.556-15.788,9.289l-10.513,18.921l172.846,12.614 l66.947-12.614l-10.513-18.921C362.189,271.867,356.145,268.312,349.586,268.312z"/> <path style="fill:#C8E8EE;" d="M399.773,100.614H112.211c-5.572,0-10.09,4.517-10.09,10.09v39.378c0,5.572,4.517,10.09,10.09,10.09 h287.562c5.572,0,10.09-4.517,10.09-10.09v-39.378C409.862,105.131,405.345,100.614,399.773,100.614z"/> <path style="fill:#E93438;" d="M188.419,100.614h-76.209c-5.572,0-10.09,4.517-10.09,10.09v39.378c0,5.572,4.517,10.09,10.09,10.09 h76.209V100.614z"/> <path style="fill:#D32A32;" d="M126.503,150.08v-39.378c0-5.572,4.517-10.09,10.09-10.09h-24.381c-5.572,0-10.09,4.517-10.09,10.09 v39.378c0,5.572,4.517,10.09,10.09,10.09h24.381C131.02,160.17,126.503,155.653,126.503,150.08z"/> <path style="fill:#60D6FF;" d="M399.773,100.614h-76.209v59.556h76.209c5.572,0,10.09-4.517,10.09-10.09v-39.378 C409.862,105.131,405.345,100.614,399.773,100.614z"/> <path style="fill:#C8E8EE;" d="M255.992,65.089c-4.329,0-7.837-3.509-7.837-7.837V9.143c0-4.328,3.508-7.837,7.837-7.837 c4.329,0,7.837,3.509,7.837,7.837v48.109C263.828,61.582,260.321,65.089,255.992,65.089z"/> <path style="fill:#E93438;" d="M191.868,76.175c-3.231,0-6.255-2.012-7.391-5.233l-16.001-45.371 c-1.439-4.081,0.703-8.557,4.785-9.997c4.079-1.439,8.557,0.702,9.997,4.785l16.001,45.371c1.439,4.081-0.703,8.557-4.785,9.997 C193.613,76.03,192.732,76.175,191.868,76.175z"/> <path style="fill:#60D6FF;" d="M320.114,76.175c-0.865,0-1.744-0.144-2.606-0.448c-4.081-1.44-6.223-5.916-4.785-9.998 l16.002-45.371c1.44-4.082,5.915-6.223,9.997-4.785c4.081,1.44,6.223,5.915,4.785,9.998l-16.001,45.371 C326.37,74.162,323.344,76.175,320.114,76.175z"/> <g> <path style="fill:#2B2A32;" d="M29.782,427.557v67.527c0,8.621,6.989,15.61,15.61,15.61h60.203c8.621,0,15.61-6.989,15.61-15.61 v-79.449"/> <path style="fill:#2B2A32;" d="M390.782,415.635v79.449c0,8.621,6.989,15.61,15.61,15.61h60.203c8.621,0,15.61-6.989,15.61-15.61 v-79.449"/> </g> <path style="fill:#0D1B24;" d="M340.619,468.921H171.363c-12.121,0-21.946-9.826-21.946-21.946l0,0l140.604-18.803l72.545,18.803 l0,0C362.566,459.096,352.74,468.921,340.619,468.921z"/> <path style="fill:#444D56;" d="M466.693,296.522H45.29c-16.066,0-29.091,13.025-29.091,29.091v90.022h479.584v-90.022 C495.783,309.546,482.76,296.522,466.693,296.522z"/> <path style="fill:#333B42;" d="M76.636,296.522H45.29c-16.066,0-29.091,13.025-29.091,29.091v90.022h31.346v-90.022 C47.545,309.546,60.57,296.522,76.636,296.522z"/> <path style="fill:#616970;" d="M362.663,324.733H149.32c-6.871,0-12.441,5.57-12.441,12.441V412.5h238.225v-75.327 C375.104,330.303,369.534,324.733,362.663,324.733z"/> <path style="fill:#8492A0;" d="M512,405.89v30.459c0,0.784-0.084,1.536-0.251,2.267c-1.034,4.786-5.287,8.359-10.376,8.359H10.616 C4.754,446.975,0,442.221,0,436.349V405.89c0-5.872,4.754-10.627,10.616-10.627h490.757C507.246,395.263,512,400.018,512,405.89z"/> <g> <path style="fill:#9AA7B8;" d="M512,405.89v30.459c0,0.784-0.084,1.536-0.251,2.267H35.004c-5.872,0-10.627-4.754-10.627-10.627 v-30.459c0-0.784,0.084-1.536,0.251-2.267h476.745C507.246,395.263,512,400.018,512,405.89z"/> <path style="fill:#9AA7B8;" d="M96.132,395.26H53.815v63.448c0,3.909,3.169,7.078,7.078,7.078h28.159 c3.909,0,7.078-3.169,7.078-7.078V395.26H96.132z"/> <path style="fill:#9AA7B8;" d="M458.171,395.26h-42.316v63.448c0,3.909,3.169,7.078,7.078,7.078h28.159 c3.909,0,7.078-3.169,7.078-7.078V395.26H458.171z"/> </g> <g> <path style="fill:#8492A0;" d="M83.619,465.784H60.892c-3.908,0-7.074-3.166-7.074-7.074v-63.446h22.716v63.446 C76.535,462.618,79.701,465.784,83.619,465.784z"/> <path style="fill:#8492A0;" d="M445.655,465.784h-22.727c-3.908,0-7.074-3.166-7.074-7.074v-63.446h22.716v63.446 C438.571,462.618,441.747,465.784,445.655,465.784z"/> </g> <g> <rect x="403.32" y="324.734" style="fill:#FEFFFF;" width="65.825" height="34.48"/> <rect x="42.841" y="324.734" style="fill:#FEFFFF;" width="65.825" height="34.48"/> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '0',
                    propertyKey: 'priorPenalties',
                    displayValue: 'None',
                    width: '23',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '1',
                    propertyKey: 'priorPenalties',
                    displayValue: '1 Violation',
                    width: '23',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isConditionParent: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '2',
                    propertyKey: 'priorPenalties',
                    displayValue: '2 Violations',
                    width: '23',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isConditionParent: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '3',
                    propertyKey: 'priorPenalties',
                    displayValue: '3 Or More',
                    width: '23',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isConditionParent: true,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Select Prior Violation Code',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesCode',
                    displayValue: null,
                    isConditionParent: false,
                    width: '45',
                    position: 4,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: violationCodes,
                    conditionKey: 'priorPenalties',
                    conditionValue: '1',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Selected Violation Date',
                    startDate: '01/01/2015',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesDate',
                    displayValue: null,
                    width: '45',
                    position: 5,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    conditionKey: 'priorPenalties',
                    conditionValue: '1',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Select Prior Violation Code',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesCode',
                    displayValue: null,
                    isConditionParent: false,
                    width: '45',
                    position: 6,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: violationCodes,
                    conditionKey: 'priorPenalties',
                    conditionValue: '2',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Selected Violation Date',
                    startDate: '01/01/2015',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesDate',
                    displayValue: null,
                    width: '45',
                    position: 7,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    conditionKey: 'priorPenalties',
                    conditionValue: '2',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Select Prior Violation Code',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesCode',
                    displayValue: null,
                    isConditionParent: false,
                    width: '45',
                    position: 8,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: violationCodes,
                    conditionKey: 'priorPenalties',
                    conditionValue: '3',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Selected Violation Date',
                    startDate: '01/01/2015',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesDate',
                    displayValue: null,
                    width: '45',
                    position: 9,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    conditionKey: 'priorPenalties',
                    conditionValue: '3',
                    isConditional: true,
                  },
                ],
              },
            ],
          },
          {
            title: 'Drivers',
            position: 2,
            isDriver: true,
            isVehicle: false,
            companyPageId: companyId,
            questions: [
              {
                headerText: 'Can you tell us about the driver?',
                subHeaderText:
                  'We need this information to get you an accurate quote',
                companyQuestionId: companyId,
                position: 0,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 58.27 58.27" style="enable-background:new 0 0 58.27 58.27;" xml:space="preserve"> <g> <g> <path style="fill:#ECF0F1;" d="M18.613,41.696l-7.907,4.313c-0.464,0.253-0.881,0.564-1.269,0.903 c4.611,3.886,10.562,6.231,17.064,6.231c6.454,0,12.367-2.31,16.964-6.144c-0.424-0.358-0.884-0.68-1.394-0.934l-8.467-4.233 c-1.094-0.547-1.785-1.665-1.785-2.888v-3.322c0.238-0.271,0.51-0.619,0.801-1.03c1.154-1.63,2.027-3.423,2.632-5.304 c1.086-0.335,1.886-1.338,1.886-2.53v-3.546c0-0.78-0.347-1.477-0.886-1.965v-5.126c0,0,1.053-7.977-9.75-7.977 s-9.75,7.977-9.75,7.977v5.126c-0.54,0.488-0.886,1.185-0.886,1.965v3.546c0,0.934,0.491,1.756,1.226,2.231 c0.886,3.857,3.206,6.633,3.206,6.633v3.24C20.296,40.043,19.65,41.13,18.613,41.696z"/> <g> <path style="fill:#556080;" d="M26.953,0.148C12.32-0.102,0.254,11.558,0.004,26.191c-0.142,8.297,3.556,15.754,9.444,20.713 c0.385-0.336,0.798-0.644,1.257-0.894l7.907-4.313c1.037-0.566,1.683-1.653,1.683-2.835v-3.24c0,0-2.321-2.776-3.206-6.633 c-0.734-0.475-1.226-1.296-1.226-2.231v-3.546c0-0.78,0.347-1.477,0.886-1.965v-5.126c0,0-1.053-7.977,9.75-7.977 s9.75,7.977,9.75,7.977v5.126c0.54,0.488,0.886,1.185,0.886,1.965v3.546c0,1.192-0.8,2.195-1.886,2.53 c-0.605,1.881-1.478,3.674-2.632,5.304c-0.291,0.411-0.563,0.759-0.801,1.03v3.322c0,1.223,0.691,2.342,1.785,2.888l8.467,4.233 c0.508,0.254,0.967,0.575,1.39,0.932c5.71-4.762,9.399-11.882,9.536-19.9C53.246,12.464,41.587,0.398,26.953,0.148z"/> </g> </g> <g> <polygon style="fill:#EDDCC7;" points="36.836,48.633 36.828,48.64 34.84,55.93 39.487,51.283 "/> <path style="fill:#D75A4A;" d="M56.086,34.684l-1.247-1.247c-0.775-0.775-2.032-0.775-2.807,0l-3.582,3.582L51.1,39.67 L56.086,34.684z"/><rect x="42.094" y="35.939" transform="matrix(0.7071 0.7071 -0.7071 0.7071 44.0976 -18.1587)" style="fill:#F29C21;" width="3.749" height="16.424"/> <polygon style="fill:#D6C4B1;" points="42.485,54.297 42.493,54.29 39.487,51.283 34.84,55.93 34.707,56.418 "/> <path style="fill:#A34740;" d="M54.107,42.676l3.582-3.582c0.775-0.775,0.775-2.032,0-2.807l-1.602-1.602L51.1,39.67 L54.107,42.676z"/><rect x="44.671" y="38.768" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 46.6666 113.2895)" style="fill:#E18C25;" width="4.251" height="16.424"/> <path style="fill:#5E5E5E;" d="M34,58.126c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l2.207-2.207 c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-2.207,2.207C34.512,58.028,34.256,58.126,34,58.126z"/> </g> </g> </svg>',
                answers: [
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'First Name',
                    errorText: 'First Name Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantGivenName',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Last Name',
                    errorText: 'Last Name Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantSurname',
                    displayValue: null,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Birthday',
                    errorText: 'Birthday Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantBirthDt',
                    displayValue: null,
                    width: '45',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Gender',
                    errorText: 'Gender Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantGenderCd',
                    displayValue: null,
                    width: '45',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: ['Male', 'Female'],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Marital Status',
                    errorText: 'Marital Status Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantMaritalStatusCd',
                    displayValue: null,
                    width: '45',
                    position: 4,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      'Married',
                      'Single',
                      'Separated',
                      'Divorced',
                      'Widowed',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Occupation',
                    errorText: 'Occupation Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'applicantOccupationClassCd',
                    displayValue: null,
                    width: '45',
                    position: 5,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      'Homemaker (full-time)',
                      'Retired (full-time)',
                      'Unemployed',
                      'Student (full-time)',
                      'Agriculture/Forestry/Fishing',
                      'Art/Design/Media',
                      'Banking/Finance/Real Estate',
                      'Business/Sales/Office',
                      'Construction / Energy / Mining',
                      'Education/Library',
                      'Engineer/Architect/Science/Math',
                      'Food Service / Hotel Services',
                      'Government/Military',
                      'Information Technology',
                      'Insurance',
                      'Legal/Law Enforcement/Security',
                      'Medical/Social Services/Religion',
                      'Personal Care/Service',
                      'Production / Manufacturing',
                      'Repair / Maintenance / Grounds',
                      'Sports/Recreation',
                      'Travel / Transportation / Storage',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Education Level',
                    errorText: 'Education Level Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'educationLevel',
                    displayValue: null,
                    width: '45',
                    position: 6,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      'No high school diploma or GED (no discount)',
                      'High school diploma or GED',
                      'Vocational / trade school degree or military training',
                      'Completed some college',
                      'Currently in college',
                      'College degree',
                      'Graduate work or graduate degree',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Licensed Driving Experience',
                    errorText: 'Driving Experience Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'drivingExperience',
                    displayValue: null,
                    width: '45',
                    position: 7,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      '3 years or more',
                      'At least 2 years, but less than 3 years',
                      'At least 1 year, but less than 2 years',
                      'Less than 1 year',
                    ],
                  },
                ],
              },
              {
                headerText: "We can quote you faster with a driver's license",
                subHeaderText:
                  'If you do not know your license information, you can skip this question',
                companyQuestionId: companyId,
                position: 1,
                errorText: 'Question Is Required',
                isRequired: false,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#D1D3D4;" d="M508,417H4c-2.209,0-4-1.791-4-4V156.923h512V413C512,415.209,510.209,417,508,417z"/> <path style="fill:#A7A9AC;" d="M481.095,156.923V417H508c2.209,0,4-1.791,4-4V156.923H481.095z"/> <g> <rect x="240.98" y="187.88" style="fill:${brandColor}" width="240.11" height="198.15"/> <path style="fill:${brandColor}" d="M512,156.923H0V99c0-2.209,1.791-4,4-4h504c2.209,0,4,1.791,4,4V156.923z"/> </g> <path style="fill:#8768ff;" d="M481.095,95v61.923H512V99c0-2.209-1.791-4-4-4H481.095z"/> <rect x="31.11" y="188.78" style="fill:#ffffff;" width="173.07" height="197.26"/> <path style="fill:${brandColor}" d="M169.162,386.038H66.118v-39.485c0-28.455,23.067-51.522,51.522-51.522l0,0 c28.455,0,51.522,23.067,51.522,51.522V386.038z"/> <g> <ellipse style="fill:#FFD359;" cx="117.64" cy="265.72" rx="29.25" ry="29.31"/> <path style="fill:#FFD359;" d="M92.716,156.923H0V99c0-2.209,1.791-4,4-4h88.716V156.923z"/> <path style="fill:#FFD359;" d="M395.074,237.907H280.437c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h114.638 c4.143,0,7.5,3.357,7.5,7.5S399.217,237.907,395.074,237.907z"/> <path style="fill:#FFD359;" d="M348.373,277.731h-67.937c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h67.937 c4.143,0,7.5,3.357,7.5,7.5S352.516,277.731,348.373,277.731z"/> <path style="fill:#FFD359;" d="M444.652,277.731h-67.936c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h67.936 c4.143,0,7.5,3.357,7.5,7.5S448.795,277.731,444.652,277.731z"/> <path style="fill:#FFD359;" d="M443.149,315.561H280.437c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5H443.15 c4.143,0,7.5,3.357,7.5,7.5S447.292,315.561,443.149,315.561z"/> <path style="fill:#FFD359;" d="M443.149,354.387H280.437c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5H443.15 c4.143,0,7.5,3.357,7.5,7.5S447.292,354.387,443.149,354.387z"/> <path style="fill:#FFD359;" d="M444.652,237.907h-17.299c-4.143,0-7.5-3.357-7.5-7.5s3.357-7.5,7.5-7.5h17.299 c4.143,0,7.5,3.357,7.5,7.5S448.795,237.907,444.652,237.907z"/> </g> </svg>`,
                answers: [
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: "Driver's License Number",
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'driverLicenseNumber',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'License State',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'driverLicenseStateCd',
                    displayValue: null,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: [
                      'AL',
                      'AK',
                      'AS',
                      'AZ',
                      'AR',
                      'CA',
                      'CO',
                      'CT',
                      'DE',
                      'DC',
                      'FM',
                      'FL',
                      'GA',
                      'GU',
                      'HI',
                      'ID',
                      'IL',
                      'IN',
                      'IA',
                      'KS',
                      'KY',
                      'LA',
                      'ME',
                      'MH',
                      'MD',
                      'MA',
                      'MI',
                      'MN',
                      'MS',
                      'MO',
                      'MT',
                      'NE',
                      'NV',
                      'NH',
                      'NJ',
                      'NM',
                      'NY',
                      'NC',
                      'ND',
                      'MP',
                      'OH',
                      'OK',
                      'OR',
                      'PW',
                      'PA',
                      'PR',
                      'RI',
                      'SC',
                      'SD',
                      'TN',
                      'TX',
                      'UT',
                      'VT',
                      'VI',
                      'VA',
                      'WA',
                      'WV',
                      'WI',
                      'WY',
                    ],
                  },
                ],
              },
              {
                headerText: 'Add or select a driver',
                subHeaderText: 'You must add your spouse if you are married',
                companyQuestionId: companyId,
                position: 2,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#95D6A6;" d="M428.854,204.583c-6.667-3.176-13.611-5.855-20.787-7.997c-6.736-2.014-13.679-3.549-20.787-4.569 c-6.793-0.974-13.727-1.492-20.787-1.492c-4.491,0-8.937,0.205-13.326,0.606c-6.189,0.564-12.263,1.53-18.205,2.849 c-2.117,0.47-4.217,0.987-6.298,1.549c-3.489,0.941-6.927,2.009-10.307,3.198c-5.891,2.073-11.609,4.516-17.128,7.3 c-1.088,0.549-2.166,1.111-3.239,1.686c-6.226,3.34-12.182,7.119-17.828,11.298c-2.102,1.556-4.161,3.168-6.175,4.832 c-1.66,1.372-3.298,2.767-4.895,4.21c-2.065,1.865-4.076,3.787-6.029,5.766c-4.886,4.947-9.423,10.241-13.567,15.841 c-1.103,1.491-2.18,3.003-3.229,4.537c-2.097,3.067-4.08,6.215-5.942,9.443c-0.931,1.614-1.832,3.248-2.701,4.9 c-0.888,1.692-1.754,3.398-2.579,5.127c-1.695,3.56-3.241,7.203-4.644,10.916c-0.468,1.238-0.92,2.483-1.357,3.736 c-0.352,1.013-0.696,2.03-1.03,3.053c-0.334,1.021-0.657,2.05-0.967,3.082c-1.006,3.369-1.892,6.79-2.655,10.256 c-0.764,3.466-1.402,6.979-1.914,10.53c-0.244,1.698-0.459,3.405-0.644,5.122c-0.556,5.148-0.847,10.374-0.847,15.665 c0,12.751,1.655,25.12,4.752,36.91c1.032,3.93,2.226,7.796,3.57,11.592c1.278,3.602,2.69,7.139,4.235,10.607 c1.545,3.467,3.221,6.862,5.025,10.18c1.993,3.665,4.141,7.236,6.433,10.704c2.292,3.467,4.728,6.83,7.297,10.083 c26.671,33.741,67.946,55.431,114.193,55.431C446.727,481.534,512,416.26,512,336.028C512,278.102,477.97,227.978,428.854,204.583z" /> <path style="fill:#9CDD05;" d="M89.101,308.136c12.261-15.887,27.445-29.402,44.745-39.734c7.191-4.294,14.743-8.043,22.603-11.178 c7.719-3.079,15.735-5.567,23.989-7.417c-19.756-18.216-45.649-28.453-72.869-28.453C48.253,221.355,0,269.61,0,328.923 c0,11.48,9.305,20.787,20.787,20.787h45.179c2.686-7.188,5.87-14.131,9.522-20.787C79.489,321.63,84.047,314.684,89.101,308.136z"/> <g> <path style="fill:#EFC27B;" d="M128.354,117.425c0-11.207,2.155-21.913,6.031-31.759c2.601-6.6,5.981-12.806,10.036-18.507 c-10.331-7.595-23.073-12.096-36.853-12.096c-34.387,0-62.36,27.976-62.36,62.361s27.973,62.358,62.36,62.358 c13.776,0,26.52-4.5,36.853-12.095c-4.055-5.701-7.437-11.907-10.036-18.507C130.509,139.335,128.354,128.63,128.354,117.425z"/> <path style="fill:#EFC27B;" d="M144.421,67.159c-4.055,5.701-7.435,11.907-10.036,18.507c-3.876,9.846-6.031,20.552-6.031,31.759 c0,11.204,2.155,21.91,6.031,31.754c2.598,6.602,5.981,12.807,10.036,18.507c15.771,22.182,41.66,36.694,70.891,36.694 c47.948,0,86.957-39.008,86.957-86.956c0-47.949-39.009-86.959-86.957-86.959C186.08,30.466,160.195,44.978,144.421,67.159z"/> </g> <path style="fill:#A4E276;" d="M229.311,384.531c-5.381-15.178-8.323-31.501-8.323-48.502c0-7.055,0.517-13.995,1.491-20.787 c1.023-7.103,2.558-14.049,4.569-20.787c0.619-2.066,1.294-4.107,1.997-6.135c1.746-5.011,3.74-9.904,6-14.652 c0.826-1.729,1.692-3.437,2.579-5.127c3.478-6.612,7.457-12.915,11.871-18.88c-11.183-2.446-22.627-3.708-34.184-3.708 c-11.977,0-23.645,1.337-34.874,3.854c-8.252,1.849-16.269,4.337-23.989,7.417c-7.86,3.136-15.411,6.883-22.603,11.178 c-17.3,10.332-32.484,23.848-44.745,39.734c-5.053,6.546-9.61,13.492-13.614,20.787c-3.652,6.656-6.837,13.599-9.522,20.787 c-6.472,17.321-10.018,36.058-10.018,55.608c0,11.48,9.305,20.787,20.787,20.787h175.565c-5.14-6.505-9.743-13.454-13.73-20.787 C234.962,398.684,231.865,391.736,229.311,384.531z"/> <path style="fill:#368B4C;" d="M408.067,315.242H387.28v-20.787c0-11.48-9.308-20.787-20.787-20.787 c-11.478,0-20.787,9.307-20.787,20.787v20.787h-20.787c-11.478,0-20.787,9.307-20.787,20.787c0,11.481,9.308,20.787,20.787,20.787 h20.787v20.787c0,11.481,9.308,20.787,20.787,20.787c11.478,0,20.787-9.305,20.787-20.787v-20.787h20.787 c11.478,0,20.787-9.305,20.787-20.787C428.854,324.549,419.545,315.242,408.067,315.242z"/> <path style="fill:#64C37D;" d="M345.707,377.602v-20.787h-20.787c-11.478,0-20.787-9.305-20.787-20.787 c0-11.48,9.308-20.787,20.787-20.787h20.787v-20.787c0-11.48,9.308-20.787,20.787-20.787v-83.146 c-47.912,0-90.473,23.296-116.998,59.139c-4.415,5.964-8.394,12.27-11.871,18.88c-0.888,1.692-1.754,3.398-2.579,5.127 c-2.26,4.748-4.254,9.639-6,14.652c-0.704,2.027-1.377,4.069-1.997,6.135c-2.011,6.738-3.546,13.683-4.569,20.787 c-0.974,6.792-1.491,13.732-1.491,20.787c0,17.001,2.942,33.324,8.323,48.502c2.555,7.203,5.651,14.153,9.26,20.787 c3.987,7.332,8.59,14.282,13.73,20.787c26.671,33.741,67.946,55.431,114.193,55.431v-83.146 C355.016,398.389,345.707,389.085,345.707,377.602z"/> <path style="fill:#ECB45C;" d="M144.421,67.159c-4.055,5.701-7.435,11.907-10.036,18.507c-3.876,9.846-6.031,20.552-6.031,31.758 c0,11.204,2.155,21.91,6.031,31.755c2.598,6.602,5.981,12.807,10.036,18.507c15.771,22.182,41.66,36.694,70.891,36.694V30.465 C186.08,30.466,160.195,44.978,144.421,67.159z"/> <path style="fill:#64C37D;" d="M156.45,257.224c-7.86,3.136-15.411,6.883-22.603,11.178c-17.3,10.332-32.484,23.848-44.745,39.734 c-5.053,6.546-9.612,13.492-13.614,20.787c-3.652,6.656-6.837,13.599-9.522,20.787c-6.472,17.321-10.018,36.058-10.018,55.608 c0,11.48,9.305,20.787,20.787,20.787h138.577v-180.15c-11.977,0-23.645,1.337-34.874,3.854 C172.185,251.658,164.168,254.147,156.45,257.224z"/> <path style="fill:#ECB45C;" d="M107.568,55.062c-34.387,0-62.36,27.976-62.36,62.361s27.973,62.358,62.36,62.358 c0.058,0,0.115-0.003,0.173-0.004V55.066C107.683,55.066,107.626,55.062,107.568,55.062z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    isAddDriver: true,
                    width: '60',
                    placeholder: 'Select a driver',
                    displayValue: 'Add Driver',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
            ],
          },
          {
            title: 'Vehicles',
            isVehicle: true,
            isDriver: false,
            position: 3,
            companyPageId: companyId,
            questions: [
              {
                headerText: 'Where is the vehicle primarily parked?',
                subHeaderText:
                  'Please enter the zip code of where your vehicle resides',
                companyQuestionId: companyId,
                position: 0,
                errorText: 'Zip Code Is Required',
                isRequired: false,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.533 512.533" style="enable-background:new 0 0 512.533 512.533;" xml:space="preserve"> <path style="fill:#F3705B;" d="M406.6,62.4c-83.2-83.2-217.6-83.2-299.733,0c-83.2,83.2-83.2,216.533,0,299.733l149.333,150.4 L405.533,363.2C488.733,280,488.733,145.6,406.6,62.4z"/> <path style="fill:#FFFFFF;" d="M256.2,360C175.133,360,109,293.867,109,212.8S175.133,65.6,256.2,65.6s147.2,66.133,147.2,147.2 S337.266,360,256.2,360z"/> <path style="fill:#435B6C;" d="M325.533,140.267c-12.8-10.667-32-16-59.733-16h-62.933v177.067h39.467v-49.067h24.533 c26.667,0,45.867-5.333,58.667-14.933c12.8-10.667,19.2-26.667,19.2-48C344.733,166.933,338.333,150.933,325.533,140.267z M296.733,209.6c-4.267,5.333-13.867,7.467-26.667,7.467H243.4v-59.733h22.4c12.8,0,22.4,2.133,28.8,6.4 c6.4,4.267,9.6,11.733,9.6,21.333C304.2,196.8,301,204.267,296.733,209.6z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Garaged Zip Code',
                    isRequired: true,
                    errorText: 'Zip Code Is Required',
                    propertyValue: null,
                    propertyKey: 'applicantPostalCd',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
              {
                headerText: "What's the year, make, and model of the vehicle?",
                subHeaderText:
                  'Enter in the VIN to automatically find the vehicle or select it manually below',
                companyQuestionId: companyId,
                position: 1,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:${brandColor}" d="M489.798,239.613c-16.627-10.241-70.258-23.335-145.52-23.335l-39.756-46.38 c-8.385-9.782-20.627-15.413-33.511-15.413H152.008c-12.644,0-24.87,4.523-34.47,12.751L70.624,207.45l-50.039,7.148 c-7.106,1.015-12.889,6.231-14.63,13.195l-5.95,23.794l132.415,61.792h370.755v-49.903 C503.173,253.717,498.107,244.732,489.798,239.613z"/> <path style="fill:${brandColor}" d="M503.173,269.241c0-17.655-26.482-35.31-150.067-35.31H8.831c-4.875,0-8.827,3.953-8.827,8.827 v52.965l167.725,26.482h335.445V269.241z"/> <path style="fill:${brandColor}" d="M503.173,304.551H89.244l-78.5-17.443c-4.715-1.035-9.474,1.935-10.535,6.702 c-1.052,4.759,1.949,9.474,6.707,10.53l79.447,17.655c0.629,0.142,1.267,0.211,1.913,0.211h414.894c4.879,0,8.828-3.953,8.828-8.827 C511.999,308.504,508.052,304.551,503.173,304.551z"/> <circle style="fill:#EDEDEE;" cx="423.72" cy="304.549" r="44.137"/> <path style="fill:#504B5A;" d="M423.725,357.516c-29.207,0-52.965-23.758-52.965-52.965c0-29.207,23.758-52.965,52.965-52.965 s52.965,23.758,52.965,52.965C476.69,333.758,452.932,357.516,423.725,357.516z M423.725,269.241 c-19.473,0-35.31,15.837-35.31,35.31c0,19.473,15.837,35.31,35.31,35.31s35.31-15.836,35.31-35.31 C459.035,285.078,443.199,269.241,423.725,269.241z"/> <circle style="fill:#DCDBDE;" cx="423.72" cy="304.549" r="17.655"/> <circle style="fill:#EDEDEE;" cx="88.275" cy="304.549" r="44.137"/> <path style="fill:#504B5A;" d="M88.279,357.516c-29.207,0-52.965-23.758-52.965-52.965c0-29.207,23.758-52.965,52.965-52.965 s52.965,23.758,52.965,52.965C141.243,333.758,117.485,357.516,88.279,357.516z M88.279,269.241c-19.473,0-35.31,15.837-35.31,35.31 c0,19.473,15.837,35.31,35.31,35.31s35.31-15.836,35.31-35.31C123.589,285.078,107.752,269.241,88.279,269.241z"/> <circle style="fill:#DCDBDE;" cx="88.275" cy="304.549" r="17.655"/> <g> <path style="fill:${brandColor}" d="M353.105,286.896H167.728c-4.875,0-8.827-3.953-8.827-8.827l0,0c0-4.875,3.953-8.827,8.827-8.827 h185.377c4.875,0,8.827,3.952,8.827,8.827l0,0C361.933,282.945,357.98,286.896,353.105,286.896z"/> <path style="fill:${brandColor}" d="M503.173,286.896h-8.827c-4.875,0-8.828-3.953-8.828-8.827l0,0c0-4.875,3.953-8.827,8.828-8.827 h8.827c4.875,0,8.827,3.952,8.827,8.827l0,0C512,282.945,508.048,286.896,503.173,286.896z"/> </g> <path style="fill:${brandColor}" d="M70.624,207.449l46.914-40.214c9.6-8.228,21.826-12.751,34.47-12.751h119.003 c12.885,0,25.125,5.63,33.511,15.413l39.756,46.38H135.276c-7.78,0-15.546-0.643-23.221-1.922L70.624,207.449z"/> <path style="fill:#625D6B;" d="M261.294,169.664c-3.354-4.025-8.323-6.352-13.563-6.352h-81.524c-4.682,0-9.173,1.86-12.483,5.171 l-26.482,26.482c-2.341,2.341-3.657,5.516-3.657,8.827l0,0c0,6.894,5.589,12.484,12.484,12.484h154.647 c3.742,0,5.786-4.365,3.391-7.24L261.294,169.664z"/> <polygon style="fill:#504B5A;" points="185.381,216.276 158.898,216.276 176.553,163.312 194.208,163.312 "/> <path style="fill:#EDEDEE;" d="M493.697,242.759h-8.181c-4.875,0-8.827,3.952-8.827,8.827s3.953,8.827,8.827,8.827h17.261 C502.011,253.548,498.814,247.337,493.697,242.759z"/> <path style="fill:#625D6B;" d="M304.522,169.897c-2.115-2.468-4.48-4.669-7.036-6.585H283.08c-3.742,0-5.786,4.364-3.391,7.24 l32.813,39.374c3.354,4.025,8.323,6.352,13.562,6.352h18.213L304.522,169.897z"/> <path style="fill:${brandColor}" d="M0.004,242.759v8.827h17.655c4.875,0,8.827-3.952,8.827-8.827s-3.953-8.827-8.827-8.827H8.831 C3.955,233.931,0.004,237.884,0.004,242.759z"/> <g> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Vehicle VIN',
                    errorText: 'VIN Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'vehicleVin',
                    displayValue: null,
                    width: '90',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isVehicleVIN: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    errorText: 'Vehicle Year Is Required',
                    isRequired: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Enter The Vehicle Year',
                    propertyValue: null,
                    propertyKey: 'vehicleModelYear',
                    displayValue: null,
                    width: '20',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isVehicleYear: true,
                    options: [
                      '2021',
                      '2020',
                      '2019',
                      '2018',
                      '2017',
                      '2016',
                      '2015',
                      '2014',
                      '2013',
                      '2012',
                      '2011',
                      '2010',
                      '2009',
                      '2008',
                      '2007',
                      '2006',
                      '2005',
                      '2004',
                      '2003',
                      '2002',
                      '2001',
                      '2000',
                      '1999',
                      '1998',
                      '1997',
                      '1996',
                      '1995',
                      '1994',
                      '1993',
                      '1992',
                      '1991',
                      '1990',
                      '1989',
                      '1988',
                      '1987',
                      '1986',
                      '1985',
                      '1984',
                      '1983',
                      '1982',
                      '1981',
                      '1980',
                      '1979',
                      '1978',
                      '1977',
                      '1976',
                      '1975',
                      '1974',
                      '1973',
                      '1972',
                      '1971',
                      '1970',
                      '1969',
                      '1968',
                      '1967',
                      '1966',
                      '1965',
                      '1964',
                      '1963',
                      '1962',
                      '1961',
                      '1960',
                      '1959',
                      '1958',
                      '1957',
                      '1956',
                      '1955',
                      '1954',
                      '1953',
                      '1952',
                      '1951',
                      '1950',
                      '1949',
                      '1948',
                      '1947',
                      '1946',
                      '1945',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    errorText: 'Vehicle Is Required',
                    isRequired: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Enter The Vehicle Make Or Model',
                    propertyValue: null,
                    propertyKey: 'vehicleModel',
                    displayValue: null,
                    width: '70',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isVehicleMakeModel: true,
                  },
                ],
              },
              {
                headerText: 'How is this vehicle primarly used?',
                subHeaderText:
                  'This helps us estimate what your wear and tear will be',
                companyQuestionId: companyId,
                position: 2,
                errorText: 'Primary Use Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#5C5E70;" d="M512,256v0.554c-0.052,23.364-3.229,45.996-9.143,67.49c-1.891,6.896-4.075,13.678-6.52,20.323 c-2.1,5.705-4.399,11.327-6.886,16.833c-1.661,3.688-3.417,7.335-5.245,10.93v0.01c-4.232,8.286-8.892,16.311-13.97,24.043 c-1.985,3.03-4.033,6.019-6.144,8.955c-5.831,8.129-12.142,15.914-18.871,23.291c-3.584,3.929-7.293,7.753-11.118,11.452 c-1.787,1.735-3.594,3.438-5.423,5.099c-5.622,5.151-11.473,10.041-17.533,14.67c-3.427,2.612-6.928,5.141-10.491,7.575 c-5.684,3.908-11.525,7.586-17.533,11.024c-20.574,11.797-42.945,20.814-66.601,26.551c-19.404,4.702-39.675,7.199-60.52,7.199 c-6.907,0-13.751-0.272-20.511-0.815c-23.312-1.839-45.745-6.813-66.873-14.493c-41.127-14.932-77.332-40.103-105.545-72.421 c-18.85-21.598-34.137-46.383-44.93-73.445C6.44,321.494,0.003,289.499,0.003,256c0-141.384,114.614-255.998,255.998-255.998 c16.06,0,31.775,1.484,47.02,4.305c9.237,1.724,18.306,3.929,27.167,6.614c17.92,5.413,35.025,12.748,51.043,21.755 c14.806,8.307,28.693,18.056,41.472,29.038c5.099,4.378,10.01,8.944,14.743,13.699c17.784,17.868,32.956,38.358,44.868,60.834 c2.55,4.807,4.953,9.697,7.189,14.681c2.623,5.81,5.026,11.724,7.21,17.753c1.39,3.803,2.675,7.649,3.887,11.536 c0.387,1.275,0.773,2.55,1.149,3.835c1.118,3.803,2.142,7.649,3.072,11.525c0.313,1.285,0.616,2.56,0.899,3.845 c0.867,3.814,1.641,7.649,2.32,11.525c0.219,1.191,0.418,2.382,0.616,3.584v0.031c0.564,3.396,1.045,6.834,1.463,10.282 c0.219,1.766,0.418,3.542,0.596,5.318c0.251,2.57,0.47,5.151,0.648,7.743C511.791,243.879,512,249.918,512,256z"/> <g> <path style="fill:#797B89;" d="M489.503,150.925c-2.236,2.55-5.517,4.148-9.174,4.148H304.046c-3.385,0-6.437-1.369-8.662-3.584 c-2.215-2.215-3.584-5.277-3.584-8.652c0-6.76,5.486-12.236,12.246-12.236h37.209c3.375,0,6.437-1.369,8.652-3.584 c2.215-2.226,3.584-5.277,3.584-8.662c0-6.76-5.475-12.236-12.236-12.236h-10.386c-3.375,0-6.447-1.369-8.662-3.584 c-2.215-2.215-3.584-5.287-3.584-8.662c0-6.76,5.486-12.236,12.246-12.236h34.377c3.375,0,6.437-1.369,8.652-3.584 c2.215-2.226,3.584-5.277,3.584-8.662c0-6.76-5.475-12.236-12.236-12.236h-75.483c-3.375,0-6.437-1.369-8.652-3.584 c-2.215-2.215-3.584-5.287-3.584-8.662c0-6.76,5.475-12.236,12.236-12.236h91.47c14.806,8.307,28.693,18.056,41.472,29.038 c5.099,4.378,10.01,8.944,14.743,13.699c17.784,17.868,32.956,38.358,44.868,60.834 C484.864,141.051,487.267,145.94,489.503,150.925z"/> <path style="fill:#797B89;" d="M132.015,387.541c0,6.76-5.486,12.246-12.246,12.246h-3.396c-3.375,0-6.447,1.369-8.662,3.584 c-2.215,2.215-3.584,5.277-3.584,8.652c0,6.76-5.475,12.246-12.236,12.246H63.073c-18.85-21.598-34.137-46.383-44.93-73.445h48.075 c6.76,0,12.236,5.475,12.236,12.236c0,6.76,5.486,12.246,12.246,12.246h29.069c3.385,0,6.437,1.369,8.662,3.584 C130.646,381.105,132.015,384.156,132.015,387.541z"/> <path style="fill:#797B89;" d="M240.022,281.754L240.022,281.754c0-6.76,5.48-12.24,12.24-12.24h39.444 c6.76,0,12.24-5.48,12.24-12.24l0,0c0-6.76-5.48-12.24-12.24-12.24H175.424c-6.76,0-12.24,5.48-12.24,12.24l0,0 c0,6.76-5.48,12.24-12.24,12.24H111.5c-6.76,0-12.24,5.48-12.24,12.24l0,0c0,6.76,5.48,12.24,12.24,12.24h58.486 c6.76,0,12.24,5.48,12.24,12.24l0,0c0,6.76,5.48,12.24,12.24,12.24h116.283c6.76,0,12.24-5.48,12.24-12.24l0,0 c0-6.76-5.48-12.24-12.24-12.24h-58.486C245.503,293.995,240.022,288.515,240.022,281.754z"/> </g> <rect x="303.019" y="177.391" style="fill:#FCF8F2;" width="27.167" height="101.354"/> <g> <path style="fill:#494B5B;" d="M54.795,241.36h-23.64c-6.444,0-11.668-5.223-11.668-11.668v-28.213h46.976v28.213 C66.463,236.137,61.239,241.36,54.795,241.36z"/> <path style="fill:#494B5B;" d="M260.559,241.36h-23.64c-6.444,0-11.668-5.223-11.668-11.668v-28.213h46.976v28.213 C272.228,236.137,267.003,241.36,260.559,241.36z"/> </g> <path style="fill:#FF525D;" d="M283.626,143.61v41.827c-0.024-0.012-0.047-0.012-0.071-0.018c-2.63,8.08-5.958,15.842-9.907,23.225 H18.066c-1.922-3.593-3.7-7.283-5.32-11.054c-1.708-3.966-3.239-8.027-4.587-12.171c-0.024,0.006-0.047,0.006-0.071,0.018V143.61 c0-5.693,1.46-11.196,4.138-16.031c2.436-4.416,5.882-8.282,10.149-11.237l13.524-9.357l12.407-54.074 c2.974-12.974,14.518-22.173,27.83-22.173h139.436c13.312,0,24.856,9.197,27.835,22.173l12.402,54.074l13.53,9.357 C278.289,122.538,283.626,132.729,283.626,143.61z"/> <path style="fill:#34ABE0;" d="M232.213,106.986H59.509c-3.99,0-6.945-3.706-6.053-7.595l9.871-43.027 c1.377-6.011,6.644-10.214,12.816-10.214h139.43c6.171,0,11.437,4.203,12.821,10.214l9.866,43.027 C239.152,103.28,236.202,106.986,232.213,106.986z"/> <path style="fill:#494B5B;" d="M214.195,208.642v3.456c0,8.395-11.65,15.199-26.021,15.199h-84.636 c-14.37,0-26.021-6.805-26.021-15.199v-3.456H214.195z"/> <path style="fill:#EF4152;" d="M12.747,197.591c-1.708-3.966-3.239-8.027-4.587-12.171c-0.024,0.006-0.047,0.006-0.071,0.018V143.61 c0-5.693,1.46-11.196,4.138-16.031c0,0-9.417,57.698,97.574,57.698C178.528,185.278,87.001,192.454,12.747,197.591z"/> <g> <path style="fill:#5C5E70;" d="M208.071,176.466H83.644c-3.183,0-5.764-2.58-5.764-5.764l0,0c0-3.183,2.58-5.764,5.764-5.764 h124.428c3.183,0,5.764,2.58,5.764,5.764l0,0C213.835,173.885,211.254,176.466,208.071,176.466z"/> <path style="fill:#5C5E70;" d="M208.071,157.658H83.644c-3.183,0-5.764-2.58-5.764-5.764l0,0c0-3.183,2.58-5.764,5.764-5.764 h124.428c3.183,0,5.764,2.58,5.764,5.764l0,0C213.835,155.077,211.254,157.658,208.071,157.658z"/> </g> <path style="fill:#F9EED7;" d="M291.713,196.96c0,1.38-0.242,2.708-0.69,3.941c-0.58,1.636-1.527,3.113-2.73,4.324 c-2.114,2.114-5.028,3.42-8.258,3.42H11.685c-5.065,0-9.381-3.23-10.995-7.744C0.242,199.669,0,198.341,0,196.96 c0-3.222,1.306-6.144,3.42-8.265c2.114-2.114,5.035-3.42,8.265-3.42h268.35C286.486,185.275,291.713,190.508,291.713,196.96z"/> <path style="fill:#78CAEF;" d="M224.611,78.392c1.354,4.326-3.649,7.835-7.255,5.089l-13.345-10.164L190.01,62.655 c-3.541-2.697-1.634-8.35,2.817-8.35h20.826c2.032,0,3.83,1.321,4.438,3.26L224.611,78.392z"/> <path style="fill:#FF6E7C;" d="M248.119,126.422h-75.07c-3.264,0-5.911-2.647-5.911-5.911l0,0c0-3.264,2.647-5.911,5.911-5.911 h75.07c3.264,0,5.911,2.647,5.911,5.911l0,0C254.03,123.775,251.383,126.422,248.119,126.422z"/> <path style="fill:#E8DBC4;" d="M291.023,200.902c-0.58,1.636-1.527,3.113-2.73,4.324c-2.114,2.114-5.028,3.42-8.258,3.42H11.685 c-5.065,0-9.381-3.23-10.995-7.744H291.023z"/> <g> <path style="fill:#FCF8F2;" d="M262.474,195.581H152.782c-2.845,0-5.151-2.306-5.151-5.151l0,0c0-2.845,2.306-5.151,5.151-5.151 h109.692c2.845,0,5.151,2.306,5.151,5.151l0,0C267.625,193.274,265.319,195.581,262.474,195.581z"/> <path style="fill:#FCF8F2;" d="M136.568,195.581h-23.006c-2.845,0-5.151-2.306-5.151-5.151l0,0c0-2.845,2.306-5.151,5.151-5.151 h23.006c2.845,0,5.151,2.306,5.151,5.151l0,0C141.72,193.274,139.414,195.581,136.568,195.581z"/> </g> <path style="fill:#279FC9;" d="M122.804,106.986H59.509c-3.99,0-6.945-3.706-6.053-7.595l9.871-43.027 c1.377-6.011,6.644-10.214,12.816-10.214C76.142,46.149,65.468,99.367,122.804,106.986z"/> <path style="fill:#EF4152;" d="M235.266,176.87c-6.857,0-12.434-5.578-12.434-12.434v-13.448c0-6.505,5.011-11.895,11.458-12.386 c0.436-0.048,0.783-0.048,0.976-0.048h31.556c6.857,0,12.434,5.578,12.434,12.434v13.448c0,1.156-0.158,2.278-0.469,3.338 c-1.481,5.36-6.384,9.096-11.965,9.096H235.266z"/> <path style="fill:#EDBB4C;" d="M272.986,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.7,2.623-3.093,4.545-5.935,4.545h-31.556 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-3.281,2.56-5.966,5.799-6.144c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C270.228,144.824,272.986,147.582,272.986,150.988z"/> <path style="fill:#FFD15C;" d="M272.986,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.115,0.021-0.24,0.021-0.355,0.021h-31.566 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-0.564,0.073-1.108,0.23-1.62c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C270.228,144.824,272.986,147.582,272.986,150.988z"/> <path style="fill:#FFDC8D;" d="M264.975,155.972h-12.539c-2.116,0-3.832-1.716-3.832-3.832l0,0c0-2.116,1.716-3.832,3.832-3.832 h12.539c2.116,0,3.832,1.716,3.832,3.832l0,0C268.807,154.257,267.091,155.972,264.975,155.972z"/> <path style="fill:#EF4152;" d="M24.893,176.87c-6.857,0-12.434-5.578-12.434-12.434v-13.448c0-6.505,5.011-11.895,11.458-12.386 c0.436-0.048,0.783-0.048,0.976-0.048h31.556c6.857,0,12.434,5.578,12.434,12.434v13.448c0,1.156-0.158,2.278-0.469,3.338 c-1.481,5.36-6.384,9.096-11.965,9.096H24.893z"/> <path style="fill:#EDBB4C;" d="M62.614,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.7,2.623-3.093,4.545-5.935,4.545H24.893 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-3.281,2.56-5.966,5.799-6.144c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C59.856,144.824,62.614,147.582,62.614,150.988z"/> <path style="fill:#FFD15C;" d="M62.614,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.115,0.021-0.24,0.021-0.355,0.021H30.463 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-0.564,0.073-1.108,0.23-1.62c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C59.856,144.824,62.614,147.582,62.614,150.988z"/> <path style="fill:#FFDC8D;" d="M54.604,155.972H42.065c-2.116,0-3.832-1.716-3.832-3.832l0,0c0-2.116,1.716-3.832,3.832-3.832 h12.539c2.116,0,3.832,1.716,3.832,3.832l0,0C58.435,154.257,56.72,155.972,54.604,155.972z"/> <path style="fill:#494B5B;" d="M411.1,270.617h-23.64c-6.444,0-11.668-5.223-11.668-11.668v-28.213h46.976v28.213 C422.768,265.394,417.544,270.617,411.1,270.617z"/> <path style="fill:#E8DBC4;" d="M510.715,230.16c0.251,2.57,0.47,5.151,0.648,7.743H374.367c-1.348-2.529-2.633-5.11-3.835-7.743 c-0.512-1.097-1.003-2.194-1.484-3.312c-1.651-3.856-3.156-7.795-4.462-11.818c-0.052-0.115-0.084-0.24-0.125-0.355 c-0.021,0.01-0.042,0.01-0.073,0.021v-41.827c0-5.695,1.463-11.191,4.138-16.029c2.445-4.42,5.883-8.286,10.156-11.243l13.521-9.352 l12.413-54.073c2.205-9.665,9.174-17.23,18.087-20.459c5.099,4.378,10.01,8.944,14.743,13.699 c17.784,17.868,32.956,38.358,44.868,60.834c5.527,10.407,10.344,21.243,14.399,32.433c1.39,3.803,2.675,7.649,3.887,11.536 c0.387,1.275,0.773,2.55,1.149,3.835c1.118,3.803,2.142,7.649,3.072,11.525c0.313,1.285,0.616,2.56,0.899,3.845 c0.867,3.814,1.641,7.649,2.32,11.525c0.219,1.191,0.418,2.382,0.616,3.584v0.031c0.564,3.396,1.045,6.834,1.463,10.282 C510.339,226.607,510.537,228.383,510.715,230.16z"/> <path style="fill:#34ABE0;" d="M437.447,75.41c17.784,17.868,32.956,38.358,44.868,60.834h-66.497c-3.991,0-6.949-3.709-6.06-7.596 l9.874-43.029c1.379-6.008,6.646-10.209,12.821-10.209C432.452,75.41,437.447,75.41,437.447,75.41z"/> <path style="fill:#494B5B;" d="M512,256v0.554h-52.161c-14.367,0-26.018-6.802-26.018-15.193v-3.459h77.541 C511.791,243.879,512,249.918,512,256z"/> <path style="fill:#D6C8B0;" d="M369.052,226.847c-1.708-3.966-3.239-8.027-4.587-12.171c-0.024,0.006-0.047,0.006-0.071,0.018 v-41.827c0-5.693,1.46-11.196,4.138-16.031c0,0-9.417,57.698,97.574,57.698C534.833,214.534,443.306,221.711,369.052,226.847z"/> <path style="fill:#EDBB4C;" d="M421.299,182.905c0,4.474-1.442,8.625-3.884,11.988c-3.718,5.119-9.748,8.447-16.551,8.447 c-11.284,0-20.429-9.15-20.429-20.435c0-6.803,3.328-12.833,8.441-16.551c3.363-2.441,7.508-3.884,11.988-3.884 C412.149,162.471,421.299,171.621,421.299,182.905z"/> <path style="fill:#FFD15C;" d="M421.299,182.905c0,4.474-1.442,8.625-3.884,11.988c-3.363,2.441-7.508,3.884-11.988,3.884 c-11.29,0-20.435-9.145-20.435-20.429c0-4.48,1.442-8.625,3.884-11.993c3.363-2.441,7.508-3.884,11.988-3.884 C412.149,162.471,421.299,171.621,421.299,182.905z"/> <g> <circle style="fill:#FFDC8D;" cx="411.353" cy="179.543" r="4.951"/> <circle style="fill:#FFDC8D;" cx="405.585" cy="170.233" r="3.474"/> </g> <g> <path style="fill:#5C5E70;" d="M500.6,180.214h-60.656c-3.176,0-5.757-2.581-5.757-5.768c0-1.588,0.648-3.03,1.682-4.075 c1.045-1.045,2.487-1.693,4.075-1.693h56.769C498.103,172.482,499.388,176.327,500.6,180.214z"/> <path style="fill:#5C5E70;" d="M504.822,195.573h-64.877c-3.176,0-5.757-2.57-5.757-5.757c0-1.599,0.648-3.041,1.682-4.075 c1.045-1.045,2.487-1.693,4.075-1.693h61.805C502.868,187.852,503.892,191.697,504.822,195.573z"/> <path style="fill:#5C5E70;" d="M508.04,210.944h-68.096c-3.176,0-5.757-2.581-5.757-5.757c0-1.588,0.648-3.03,1.682-4.075 c1.045-1.045,2.487-1.693,4.075-1.693h65.776C506.587,203.233,507.361,207.067,508.04,210.944z"/> </g> <path style="fill:#F9EED7;" d="M510.715,230.16c0.251,2.57,0.47,5.151,0.648,7.743h-143.37c-5.068,0-9.383-3.229-11.003-7.743 c-0.439-1.233-0.69-2.56-0.69-3.939c0-3.229,1.306-6.144,3.427-8.265c1.337-1.348,2.999-2.361,4.859-2.926 c1.076-0.324,2.226-0.502,3.406-0.502h140.663v0.031c0.564,3.396,1.045,6.834,1.463,10.282 C510.339,226.607,510.537,228.383,510.715,230.16z"/> <path style="fill:#E8DBC4;" d="M510.715,230.16c0.251,2.57,0.47,5.151,0.648,7.743h-143.37c-5.068,0-9.383-3.229-11.003-7.743 H510.715z"/> <g> <path style="fill:#FCF8F2;" d="M510.119,224.84h-1.034c-2.842,0-5.151-2.309-5.151-5.151c0-1.421,0.575-2.717,1.505-3.647 c0.846-0.836,1.964-1.379,3.218-1.484C509.221,217.955,509.701,221.393,510.119,224.84z"/> <path style="fill:#FCF8F2;" d="M492.873,224.838h-23.006c-2.845,0-5.151-2.306-5.151-5.151l0,0c0-2.845,2.306-5.151,5.151-5.151 h23.006c2.845,0,5.151,2.306,5.151,5.151l0,0C498.025,222.531,495.719,224.838,492.873,224.838z"/> </g> <path style="fill:#279FC9;" d="M479.109,136.243h-63.295c-3.99,0-6.945-3.706-6.053-7.595l9.871-43.027 c1.377-6.011,6.644-10.214,12.816-10.214C432.447,75.406,421.772,128.623,479.109,136.243z"/> <path style="fill:#494B5B;" d="M235.49,468.049v43.133c-23.312-1.839-45.745-6.813-66.873-14.493v-28.64H235.49z"/> <path style="fill:#4BC999;" d="M502.857,324.043c-1.891,6.896-4.075,13.678-6.52,20.323c-2.1,5.705-4.399,11.327-6.886,16.833 c-1.661,3.688-3.417,7.335-5.245,10.93v0.01c-4.232,8.286-8.892,16.311-13.97,24.043c-1.985,3.03-4.033,6.019-6.144,8.955 c-5.831,8.129-12.142,15.914-18.871,23.291c-3.584,3.929-7.293,7.753-11.118,11.452c-1.787,1.735-3.594,3.438-5.423,5.099 c-5.622,5.151-11.473,10.041-17.533,14.67c-3.427,2.612-6.928,5.141-10.491,7.575c-5.684,3.908-11.525,7.586-17.533,11.024H166.59 c-1.923-3.615-3.751-7.283-5.475-11.024c-0.711-1.557-1.411-3.135-2.09-4.712c-0.47-1.087-0.93-2.173-1.369-3.271 c-0.021-0.042-0.042-0.094-0.052-0.136c-0.418-1.003-0.815-1.996-1.212-3.009c-0.042-0.094-0.073-0.199-0.115-0.303 c-0.408-1.034-0.794-2.079-1.181-3.124c-0.115-0.303-0.23-0.596-0.334-0.899c-0.334-0.93-0.669-1.86-0.993-2.8 c-0.387-1.087-0.752-2.173-1.108-3.271c-0.052-0.167-0.115-0.345-0.167-0.512c-0.042,0.01-0.073,0.01-0.105,0.021v-59.538 c0-8.108,2.079-15.945,5.893-22.82c3.469-6.29,8.37-11.797,14.44-15.997l19.257-13.322l17.659-76.977 c4.242-18.474,20.668-31.566,39.622-31.566H447.76c18.944,0,35.38,13.092,39.622,31.566L502.857,324.043z"/> <path style="fill:#34ABE0;" d="M471.444,333.529H225.59c-5.68,0-9.888-5.276-8.616-10.813l14.053-61.251 c1.96-8.558,9.458-14.541,18.243-14.541h198.487c8.785,0,16.283,5.983,18.251,14.541l14.044,61.251 C481.323,328.253,477.124,333.529,471.444,333.529z"/> <path style="fill:#494B5B;" d="M383.123,478.247c-20.574,11.797-42.945,20.814-66.601,26.551h-28.254 c-20.459,0-37.041-9.686-37.041-21.64v-4.911H383.123z"/> <path style="fill:#41B787;" d="M159.021,462.51c-2.431-5.647-4.611-11.427-6.53-17.325c-0.033,0.008-0.067,0.008-0.101,0.025 v-59.543c0-8.103,2.078-15.938,5.89-22.82c0,0-13.405,82.137,138.903,82.137C395.021,444.982,264.727,455.198,159.021,462.51z"/> <g> <path style="fill:#EDBB4C;" d="M483.798,372.265c0.136-0.052,0.272-0.094,0.408-0.136v0.01c-4.232,8.286-8.892,16.311-13.97,24.043 c-1.985,3.03-4.033,6.019-6.144,8.955c-0.313-1.682-0.47-3.417-0.47-5.183c0-9.676,4.723-18.254,11.995-23.541 c0.261-0.199,0.543-0.387,0.815-0.575c0.815-0.554,1.661-1.055,2.529-1.526c0.376-0.199,0.752-0.397,1.139-0.575 c0.345-0.167,0.69-0.334,1.045-0.481c0.596-0.261,1.202-0.502,1.829-0.711C483.245,372.442,483.516,372.349,483.798,372.265z"/> <path style="fill:#EDBB4C;" d="M233.4,399.955c0,6.37-2.053,12.277-5.529,17.065c-5.292,7.287-13.876,12.025-23.561,12.025 c-16.064,0-29.081-13.026-29.081-29.09c0-9.685,4.738-18.269,12.016-23.561c4.788-3.475,10.687-5.529,17.065-5.529 C220.373,370.865,233.4,383.892,233.4,399.955z"/> </g> <path style="fill:#FFD15C;" d="M233.4,399.955c0,6.37-2.053,12.277-5.529,17.065c-4.788,3.475-10.687,5.529-17.065,5.529 c-16.073,0-29.09-13.017-29.09-29.081c0-6.378,2.053-12.277,5.529-17.074c4.788-3.475,10.687-5.529,17.065-5.529 C220.373,370.865,233.4,383.892,233.4,399.955z"/> <g> <circle style="fill:#FFDC8D;" cx="219.239" cy="395.167" r="7.048"/> <circle style="fill:#FFDC8D;" cx="211.037" cy="381.918" r="4.945"/> </g> <path style="fill:#FFD15C;" d="M483.798,372.265c0.136-0.052,0.272-0.094,0.408-0.125c-4.232,8.286-8.892,16.311-13.97,24.043 c-0.084-0.899-0.125-1.797-0.125-2.717c0-6.363,2.048-12.257,5.507-17.053c0.01-0.01,0.021-0.01,0.021-0.021 c0.261-0.188,0.533-0.376,0.794-0.554c0.815-0.554,1.661-1.055,2.529-1.526c0.376-0.199,0.752-0.397,1.139-0.575 c0.345-0.167,0.69-0.334,1.045-0.481c0.596-0.261,1.202-0.502,1.829-0.711C483.245,372.442,483.516,372.349,483.798,372.265z"/> <g> <path style="fill:#5C5E70;" d="M439.487,396.118H257.54c-3.202,0-5.796-2.596-5.796-5.796v-4.817c0-3.202,2.596-5.796,5.796-5.796 h181.947c3.202,0,5.796,2.596,5.796,5.796v4.817C445.283,393.523,442.687,396.118,439.487,396.118z"/> <path style="fill:#5C5E70;" d="M439.487,417.996H257.54c-3.202,0-5.796-2.596-5.796-5.796v-4.817c0-3.202,2.596-5.796,5.796-5.796 h181.947c3.202,0,5.796,2.596,5.796,5.796v4.817C445.283,415.401,442.687,417.996,439.487,417.996z"/> <path style="fill:#5C5E70;" d="M445.221,428.428c-3.584,3.929-7.293,7.753-11.118,11.452H257.538c-3.197,0-5.799-2.602-5.799-5.799 v-4.817c0-3.197,2.602-5.799,5.799-5.799h181.947C442.41,423.465,444.824,425.628,445.221,428.428z"/> </g> <path style="fill:#F9EED7;" d="M428.68,444.979c-5.622,5.151-11.473,10.041-17.533,14.67c-3.427,2.612-6.928,5.141-10.491,7.575 c-5.684,3.908-11.525,7.586-17.533,11.024H157.51c-7.21,0-13.354-4.598-15.652-11.024c-0.637-1.755-0.982-3.647-0.982-5.611 c0-4.587,1.86-8.746,4.869-11.766c1.902-1.902,4.274-3.354,6.917-4.148c1.536-0.47,3.166-0.721,4.848-0.721H428.68z"/> <path style="fill:#78CAEF;" d="M460.623,292.824c1.928,6.158-5.194,11.153-10.328,7.244l-18.998-14.468l-19.931-15.178 c-5.042-3.839-2.326-11.886,4.01-11.886h29.646c2.894,0,5.452,1.88,6.317,4.641L460.623,292.824z"/> <path style="fill:#5BD3A2;" d="M496.337,344.366c-2.1,5.705-4.399,11.327-6.886,16.833H384.753c-3.281,0-5.945-2.664-5.945-5.945 v-4.942c0-3.281,2.664-5.945,5.945-5.945H496.337z"/> <path style="fill:#E8DBC4;" d="M400.656,467.224c-5.684,3.908-11.525,7.586-17.533,11.024H157.51 c-7.21,0-13.354-4.598-15.652-11.024H400.656z"/> <g> <path style="fill:#FCF8F2;" d="M428.68,444.979c-5.622,5.151-11.473,10.041-17.533,14.67h-54.93c-2.863,0-5.183-2.32-5.183-5.183 v-4.305c0-2.863,2.32-5.183,5.183-5.183L428.68,444.979L428.68,444.979z"/> <path style="fill:#FCF8F2;" d="M337.441,459.649h-37.057c-2.861,0-5.181-2.32-5.181-5.181v-4.305c0-2.861,2.32-5.181,5.181-5.181 h37.057c2.861,0,5.181,2.32,5.181,5.181v4.305C342.622,457.33,340.303,459.649,337.441,459.649z"/> </g> <path style="fill:#279FC9;" d="M315.695,333.529H225.59c-5.68,0-9.888-5.276-8.616-10.813l14.053-61.251 c1.96-8.558,9.458-14.541,18.243-14.541C249.269,246.924,234.072,322.683,315.695,333.529z"/> <path style="fill:#FCF8F2;" d="M330.189,10.92v87.583h-27.167V4.306C312.259,6.031,321.328,8.235,330.189,10.92z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Primary Use',
                    errorText: 'Primary Use Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'vehicleUseCd',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: ['Pleasure', 'Business', 'Commute', 'Farm'],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    isClient: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: "Years You've Had Vehicle",
                    errorText: 'Years With Vehicle Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'lengthOfOwnership',
                    displayValue: null,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    isConditional: false,
                    companyAnswerId: companyId,
                    options: [
                      'Less Than 1 Month',
                      'At Least 1 Month But Less Than 1 Year',
                      'At Least 1 Year But Less Than 3 Years',
                      'At Least 3 Years But Less Than 5 years',
                      '5 Years Or More',
                    ],
                  },
                ],
              },
              {
                headerText: 'What level of coverage are you looking for?',
                subHeaderText:
                  'This helps us calculate the coverage that you need for your vehicle',
                companyQuestionId: companyId,
                position: 3,
                isClient: true,
                errorText: 'Coverage Level Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve"> <path style="fill:#EFF2FA;" d="M256.005,511.965c264.786-114.743,255.96-458.972,255.96-458.972 C353.09,44.166,256.005,0.034,256,0.034c-0.006,0-97.09,44.132-255.965,52.958c0,0-8.826,344.229,255.96,458.972"/> <path style="fill:#D7DEED;" d="M255.966,0.05C255.226,0.383,158.307,44.2,0.034,52.993c0,0-8.825,344.205,255.931,458.959V0.05z"/> <path style="fill:${brandColor}" d="M256,38.129c30.758,11.744,108.583,37.599,219.602,47.611 c-5.411,81.695-37.114,298.42-219.612,387.379C164.087,428.431,99.22,347.052,63.058,230.985 C44.806,172.405,38.527,118.339,36.391,85.74C147.41,75.728,225.241,49.873,256,38.129"/> <path style="fill:#FFFFFF;" d="M217.039,347.159l-82.177-82.177c-3.447-3.447-3.447-9.036,0-12.483l12.479-12.479 c3.447-3.447,9.036-3.447,12.483,0l69.698,69.698l148.601-148.601c3.447-3.447,9.036-3.447,12.483,0l12.479,12.479 c3.447,3.447,3.447,9.036,0,12.483l-161.082,161.08C235.11,354.052,223.932,354.052,217.039,347.159z"/> <path style="fill:${brandColor}" d="M256,56.974c31.721,11.606,102.639,34.047,200.604,44.623 c-3.857,40.283-14.012,104.179-40.698,168.328c-35.296,84.84-89.076,146.511-159.926,183.432 c-83.252-43.244-142.467-119.777-176.067-227.623C65.207,178.538,58.44,134.375,55.364,101.6 C153.358,91.025,224.275,68.58,256,56.974 M256,38.129C225.241,49.873,147.41,75.728,36.391,85.74 c2.136,32.599,8.415,86.664,26.667,145.245C99.22,347.052,164.087,428.431,255.991,473.119 C438.489,384.16,470.192,167.435,475.602,85.74C364.583,75.728,286.757,49.873,256,38.129L256,38.129z"/> <g> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '1',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText: 'Liability coverage only',
                    displayValue: 'Lowest',
                    width: '23',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '2',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText:
                      'Liability and some comprehensive coverage',
                    displayValue: 'Good',
                    width: '23',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '3',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText:
                      'Liability, comphrehensive and the minimum limit full coverage',
                    displayValue: 'Better',
                    width: '23',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '4',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText:
                      'Liability, comprehensive, and the maximum limit full coverage',
                    displayValue: 'Best',
                    width: '23',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
              {
                headerText: 'Add a vehicle',
                subHeaderText: 'You can also select and edit a vehicle',
                companyQuestionId: companyId,
                position: 4,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path style="fill:#485360;" d="M73.675,120.982c-1.5,0-3.019-0.339-4.42-1.052l-38.404-19.586 c-4.342-2.215-5.879-7.196-3.434-11.129c2.445-3.93,7.948-5.325,12.289-3.109l38.404,19.586c4.342,2.215,5.88,7.196,3.434,11.129 C79.887,119.484,76.827,120.982,73.675,120.982z"/> <path style="fill:#485360;" d="M35.288,243.678c-3.154,0-6.214-1.498-7.871-4.161c-2.446-3.932-0.909-8.914,3.434-11.129 l38.404-19.586c4.342-2.214,9.845-0.821,12.289,3.109c2.447,3.932,0.909,8.914-3.434,11.129l-38.404,19.586 C38.307,243.339,36.788,243.678,35.288,243.678z"/> <path style="fill:#485360;" d="M437.568,120.982c-3.206,0-6.319-1.498-8.004-4.161c-2.487-3.932-0.924-8.914,3.492-11.129 l39.051-19.586c4.415-2.214,10.009-0.821,12.496,3.109c2.487,3.932,0.924,8.914-3.492,11.129l-39.05,19.586 C440.638,120.644,439.092,120.982,437.568,120.982z"/> <path style="fill:#485360;" d="M476.602,243.678c-1.525,0-3.071-0.339-4.494-1.052l-39.051-19.586 c-4.416-2.215-5.98-7.196-3.492-11.129c2.486-3.93,8.081-5.325,12.497-3.109l39.05,19.586c4.416,2.215,5.98,7.196,3.492,11.129 C482.919,242.18,479.806,243.678,476.602,243.678z"/> </g> <path style="fill:#F44321;" d="M350.174,222.372H85.525c-7.219,0-13.072-5.851-13.072-13.072v-89.866 c0-7.219,5.853-13.072,13.072-13.072h340.408c7.219,0,13.072,5.853,13.072,13.072V209.3c0,7.221-5.853,13.072-13.072,13.072h-48.526 "/> <path style="fill:#C6281C;" d="M117.343,209.3v-89.866c0-7.219,5.853-13.072,13.072-13.072h-44.89 c-7.219,0-13.072,5.853-13.072,13.072V209.3c0,7.221,5.853,13.072,13.072,13.072h44.89 C123.196,222.372,117.343,216.522,117.343,209.3z"/> <g> <path style="fill:#BAB0A8;" d="M15.568,364.807h18.943c1.485,0,2.891,0.328,4.161,0.902V78.496c0-1.111-0.148-2.187-0.4-3.221 c-3.487,3.192-8.117,5.155-13.217,5.155s-9.73-1.964-13.217-5.155c-0.253,1.034-0.4,2.111-0.4,3.221v287.198 C12.701,365.128,14.095,364.807,15.568,364.807z"/> <path style="fill:#BAB0A8;" d="M477.491,364.807h18.943c1.473,0,2.867,0.321,4.13,0.887V78.496c0-1.111-0.148-2.187-0.4-3.221 c-3.487,3.192-8.117,5.155-13.217,5.155c-5.1,0-9.73-1.964-13.217-5.155c-0.252,1.034-0.4,2.111-0.4,3.221v287.212 C474.601,365.134,476.006,364.807,477.491,364.807z"/> </g> <path style="fill:#485360;" d="M506.553,466.113c0,5.587-4.53,10.119-10.119,10.119h-18.943c-5.588,0-10.12-4.532-10.12-10.119 v-93.366c0-5.59,4.532-10.119,10.12-10.119h18.943c5.59,0,10.119,4.53,10.119,10.119V466.113z"/> <g> <path style="fill:#FFFFFF;" d="M134.823,191.509v-54.436h36.956v11.041h-24.381v11.73h20.087v10.198h-20.087v21.468 L134.823,191.509L134.823,191.509z"/> <path style="fill:#FFFFFF;" d="M178.447,191.509v-54.436h12.572v54.436H178.447z"/> <path style="fill:#FFFFFF;" d="M214.02,160.381v31.127h-12.572v-54.436h9.813l25.379,31.973v-31.973h12.572v54.436h-10.119 L214.02,160.381z"/> <path style="fill:#FFFFFF;" d="M259.64,191.509v-54.436h12.572v54.436H259.64z"/> <path style="fill:#FFFFFF;" d="M315.298,153.019c-0.154-0.203-0.69-0.587-1.608-1.149c-0.922-0.562-2.07-1.151-3.451-1.764 c-1.379-0.613-2.887-1.151-4.523-1.611c-1.636-0.46-3.272-0.69-4.906-0.69c-4.498,0-6.746,1.509-6.746,4.523 c0,0.919,0.243,1.687,0.728,2.3c0.485,0.613,1.199,1.163,2.147,1.649c0.944,0.485,2.134,0.932,3.565,1.341 c1.43,0.411,3.092,0.87,4.983,1.38c2.607,0.717,4.958,1.496,7.054,2.338c2.096,0.843,3.873,1.891,5.33,3.143 c1.455,1.253,2.579,2.775,3.373,4.563c0.792,1.79,1.19,3.936,1.19,6.438c0,3.068-0.576,5.661-1.726,7.783 c-1.151,2.121-2.672,3.835-4.562,5.136c-1.89,1.304-4.062,2.251-6.517,2.838c-2.453,0.587-4.983,0.881-7.592,0.881 c-1.991,0-4.038-0.154-6.132-0.46c-2.098-0.306-4.141-0.754-6.134-1.343c-1.993-0.587-3.924-1.29-5.79-2.109 c-1.866-0.817-3.592-1.764-5.174-2.836l5.518-10.961c0.206,0.255,0.871,0.741,1.995,1.458c1.123,0.715,2.518,1.43,4.178,2.147 c1.662,0.715,3.516,1.353,5.561,1.915c2.043,0.564,4.112,0.844,6.21,0.844c4.447,0,6.67-1.353,6.67-4.063 c0-1.022-0.334-1.866-0.998-2.529s-1.585-1.266-2.759-1.802c-1.176-0.536-2.568-1.034-4.179-1.496 c-1.61-0.46-3.362-0.971-5.251-1.532c-2.507-0.768-4.679-1.598-6.517-2.491c-1.84-0.893-3.362-1.929-4.562-3.107 c-1.203-1.174-2.098-2.53-2.685-4.063c-0.587-1.532-0.881-3.321-0.881-5.366c0-2.862,0.536-5.391,1.61-7.592 c1.072-2.196,2.529-4.049,4.371-5.558c1.839-1.507,3.973-2.645,6.402-3.413c2.426-0.766,4.994-1.149,7.704-1.149 c1.891,0,3.757,0.179,5.598,0.536c1.839,0.357,3.603,0.819,5.289,1.381c1.687,0.562,3.257,1.2,4.715,1.917 c1.458,0.715,2.796,1.43,4.025,2.147L315.298,153.019z"/> <path style="fill:#FFFFFF;" d="M376.635,137.072v54.437H364.06v-22.31h-21.698v22.31H329.79v-54.436h12.572v21.085h21.698v-21.085 L376.635,137.072L376.635,137.072z"/> </g> <g> <path style="fill:#FE9900;" d="M25.055,35.768C11.24,35.768,0,47.006,0,60.821c0,13.816,11.24,25.055,25.055,25.055 S50.11,74.638,50.11,60.821C50.11,47.006,38.871,35.768,25.055,35.768z"/> <path style="fill:#FE9900;" d="M486.947,35.768c-13.815,0-25.054,11.238-25.054,25.053c0,13.816,11.239,25.055,25.054,25.055 c13.815,0,25.053-11.239,25.053-25.055C512,47.006,500.762,35.768,486.947,35.768z"/> </g> <path style="fill:#485360;" d="M44.631,466.113c0,5.587-4.531,10.119-10.12,10.119H15.568c-5.588,0-10.121-4.532-10.121-10.119 v-93.366c0-5.59,4.533-10.119,10.121-10.119h18.943c5.59,0,10.12,4.53,10.12,10.119V466.113z"/> <path style="fill:#364351;" d="M484.671,466.113v-93.366c0-5.59,4.532-10.119,10.12-10.119h-17.3c-5.588,0-10.12,4.53-10.12,10.119 v93.366c0,5.587,4.532,10.119,10.12,10.119h17.3C489.203,476.232,484.671,471.7,484.671,466.113z"/> <g> <path style="fill:#EF7A06;" d="M17.301,60.821c0-10.777,6.839-19.983,16.405-23.513c-2.697-0.996-5.611-1.54-8.65-1.54 c-13.815,0-25.055,11.238-25.055,25.053c0,13.816,11.24,25.055,25.055,25.055c3.038,0,5.953-0.545,8.65-1.54 C24.14,80.807,17.301,71.598,17.301,60.821z"/> <path style="fill:#EF7A06;" d="M479.193,60.821c0-10.777,6.839-19.983,16.405-23.513c-2.697-0.996-5.611-1.54-8.65-1.54 c-13.815,0-25.054,11.238-25.054,25.053c0,13.816,11.239,25.055,25.054,25.055c3.038,0,5.953-0.545,8.65-1.54 C486.032,80.807,479.193,71.598,479.193,60.821z"/> </g> <path style="fill:#364351;" d="M22.748,466.113v-93.366c0-5.59,4.531-10.119,10.12-10.119h-17.3c-5.588,0-10.121,4.53-10.121,10.119 v93.366c0,5.587,4.533,10.119,10.121,10.119h17.3C27.279,476.232,22.748,471.7,22.748,466.113z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    isAddVehicle: true,
                    width: '60',
                    placeholder: 'Select a vehicle',
                    displayValue: 'Add Vehicle',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
            ],
          },
        ],
      };

      const newForm = await this.formsRepository.save(autoForm);
      await this.formTemplateHelper.updateAllAnswers(company.id);

      const discounts = [
        {
          title: 'Home Bundle - Click Link To Add Home Info',
          moreInformation:
            'If you are insuring your car and home, you can recieve a bundle discount on insuring both with one of our companies',
          discount: null,
          hasExternalUrl: true,
          externalUrl: `https://app.xilo.io/client-app/home/start?companyId=${company.companyId}`,
          mobileUrl: `https://app.xilo.io/client-app/home/mobile?companyId=${company.companyId}`,
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Renters Bundle',
          moreInformation:
            'If you are getting renters insurance and insuring your car, you can recieve a bundle discount on insuring both with one of our companies',
          discount: null,
          propertyKey: 'hasRentersBundle',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Pay In Full Discount',
          moreInformation:
            'If you pay your premium in full, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasPayInFullDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Auto Pay Discount',
          moreInformation:
            'If you setup autopay with your bank account, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasAutoPayDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Defensive Driver Discount',
          moreInformation:
            'If you have taken a defensive driving course, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasDefensiveDriverDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Good Student Discount',
          moreInformation:
            'If you are a full-time student and have a 3.0 or above, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasGoodStudentDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
      ];

      // const newDiscounts = await model.Discount.bulkCreate(discounts); TODO discount entity deleted

      const delData = await this.formsRepository.delete(oldAutoForm);
      if (delData.affected === 0) {
        throw new HttpException(
          'Old form delete error',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'PR Form Created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createInsuranceForm() {
    try {
      const decoded = this.request.body.decodedUser;

      const company = await this.companiesRepository.findOne({
        where: { id: decoded.user.companyUserId },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const { brandColor } = company;
      const companyId = company.id;

      const oldAutoForm = await this.formsRepository.findOne({
        where: {
          isAuto: true,
          companyFormId: decoded.user.companyUserId,
        },
      });

      const violationCodes = [
        'AAF - At Fault Accident',
        'BOT - Open Bottle',
        'CCW - Comp Claim Weather Induced',
        'CMP - Comp Claim greater than $1,000',
        'CMU - Comp Claim $1,000 or less',
        'CRD - Careless/Improper Operation',
        'DEQ - Defective Equipment',
        'DEV - Traffic Device/Sign',
        'DR - Drag Racing',
        'DWI - Drive Under Influence',
        'FAR - False Reporting',
        'FDL - Foreign Drivers License',
        'FEL - Auto Theft/Felony Motor Vehicle',
        'FLE - Fleeing From Police',
        'FRA - Failure to Report Accident',
        'FTC - Following Too Close',
        'FTY - Failure to Yield',
        'HOM - Vehicular Homicide',
        'IBK - Improper Backing',
        'IP - Improper Passing',
        'IT - Improper Turn',
        'LDL - Without Owners Consent',
        'LIC - License/Credentials',
        'LTS - Leaving the Scene',
        'MAJ - Other Serious Violation',
        'MMV - Minor Moving Violation',
        'NAF - Not at Fault Accident',
        'REF - Refusal to Test',
        'RKD - Reckless Driving',
        'SAF - Safety Violation',
        'SCH - Passing School Bus',
        'SLV - Serious License Violation',
        'SPD - Speeding',
        'SUS - Driving under Suspension',
        'UDR - Unverifiable Record',
        'WSR - Wrong way/one-way street',
      ];

      const autoForm = {
        title: 'Auto',
        isAuto: true,
        isHome: false,
        hasVendorRates: false,
        companyFormId: companyId,
        pages: [
          {
            title: 'Start',
            position: 0,
            isStartPage: true,
            progressButtonText: 'Start Quote &#8594;',
            companyPageId: company.id,
            questions: [
              {
                headerText: 'What is your zip code?',
                subHeaderText:
                  'Enter in your zip code to start your free quote!',
                companyQuestionId: company.id,
                position: 0,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path style="fill:${company.brandColor}" d="M365.017,343.585c-2.214,0-4.427-0.844-6.116-2.534c-3.378-3.378-3.378-8.854,0.001-12.23 l18.715-18.716c1.622-1.623,3.822-2.533,6.116-2.533h17.561c4.778,0,8.649,3.872,8.649,8.649s-3.871,8.649-8.649,8.649h-13.98 l-16.183,16.182C369.444,342.741,367.23,343.585,365.017,343.585z"/> <path style="fill:${company.brandColor}" d="M146.978,343.585c-2.214,0-4.427-0.844-6.116-2.534l-16.181-16.182H110.7 c-4.778,0-8.649-3.872-8.649-8.649s3.871-8.649,8.649-8.649h17.563c2.294,0,4.493,0.911,6.116,2.533l18.715,18.716 c3.378,3.378,3.378,8.854-0.001,12.23C151.405,342.741,149.191,343.585,146.978,343.585z"/> </g> <path style="fill:#4EBFED;" d="M356.328,336.67H153.372l11.347-48.098c2.433-10.332,11.658-17.632,22.279-17.632h135.692 c10.621,0,19.846,7.299,22.279,17.632L356.328,336.67z"/> <path style="fill:#92DDF4;" d="M356.328,336.67H242.834l28.956-65.73h50.9c10.621,0,19.846,7.299,22.279,17.632L356.328,336.67z"/> <path style="fill:${company.brandColor}" d="M356.324,342.437c-2.614,0-4.98-1.789-5.607-4.442l-11.359-48.098 c-1.83-7.768-8.683-13.191-16.668-13.191H186.998c-7.984,0-14.838,5.423-16.667,13.188l-11.348,48.101 c-0.731,3.1-3.826,5.023-6.936,4.287c-3.1-0.731-5.019-3.837-4.287-6.935l11.347-48.098c3.06-12.996,14.531-22.074,27.891-22.074 h135.692c13.361,0,24.83,9.078,27.893,22.076l11.357,48.095c0.732,3.1-1.187,6.204-4.286,6.936 C357.208,342.386,356.762,342.437,356.324,342.437z"/> <g> <rect x="133.766" y="427.444" style="fill:#415E72;" width="43.82" height="54.106"/> <rect x="334.416" y="427.444" style="fill:#415E72;" width="43.82" height="54.106"/> </g> <polyline style="fill:#CFDCE5;" points="464.249,140.31 47.751,140.31 47.751,238.328 464.249,238.328 "/> <g> <polyline style="fill:#C1CED6;" points="464.249,140.31 47.751,140.31 47.751,158.76 464.249,158.76 "/> <polyline style="fill:#C1CED6;" points="464.249,192.202 47.751,192.202 47.751,202.581 464.249,202.581 "/> <polyline style="fill:#C1CED6;" points="464.249,215.265 47.751,215.265 47.751,225.644 464.249,225.644 "/> <polyline style="fill:#C1CED6;" points="464.249,169.139 47.751,169.139 47.751,179.517 464.249,179.517 "/> </g> <polygon style="fill:${company.brandColor}" points="464.252,116.382 464.252,147.413 47.755,147.413 47.755,116.382 256.003,35.165 "/> <polygon style="fill:${company.brandColor}" points="464.252,121.387 464.252,147.413 461.173,147.413 256.003,67.396 50.822,147.413 47.755,147.413 47.755,121.387 256.003,40.158 "/> <g> <path style="fill:#415E72;" d="M464.249,481.81c-4.778,0-8.649-3.872-8.649-8.649V122.737c0-4.776,3.871-8.649,8.649-8.649 c4.778,0,8.649,3.872,8.649,8.649V473.16C472.898,477.937,469.025,481.81,464.249,481.81z"/> <path style="fill:#415E72;" d="M47.75,481.81c-4.778,0-8.649-3.872-8.649-8.649V122.737c0-4.776,3.871-8.649,8.649-8.649 s8.649,3.872,8.649,8.649V473.16C56.399,477.937,52.528,481.81,47.75,481.81z"/> <polygon style="fill:#415E72;" points="502.782,145.026 256,48.779 9.218,145.026 0,121.391 256,21.547 512,121.391 "/> </g> <rect x="4.844" y="473.155" style="fill:#344F5E;" width="502.304" height="17.297"/> <path style="fill:${company.brandColor}" d="M383.998,419.694v-65.776c0-10.482-8.499-18.981-18.981-18.981H146.978 c-10.482,0-18.981,8.499-18.981,18.981v65.776"/> <g> <circle style="fill:#FCD577;" cx="171.821" cy="383.37" r="19.604"/> <circle style="fill:#FCD577;" cx="340.182" cy="383.37" r="19.604"/> </g> <rect x="113.01" y="418.542" style="fill:#CFDCE5;" width="285.983" height="27.676"/> <g> <rect x="208.145" y="366.327" style="fill:#314A5F;" width="95.712" height="12.685"/> <rect x="208.145" y="389.39" style="fill:#314A5F;" width="95.712" height="12.685"/> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isStartPageInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    hasSecondaryPlaceholder: true,
                    secondaryPlaceholderText: 'Zip Code',
                    placeholderText: 'Enter Zip Code',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'postalCd',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: company.id,
                  },
                ],
              },
            ],
          },
          {
            title: 'Insurance',
            position: 1,
            isDriver: false,
            isVehicle: false,
            isInsurance: true,
            companyPageId: companyId,
            questions: [
              {
                headerText: 'Have you had insurance for the past 6 months?',
                subHeaderText:
                  'Please answer no if your insurance was stopped, cancelled or inactive at anytime in the past 6 months',
                companyQuestionId: companyId,
                position: 0,
                isClient: true,
                errorText: 'Insurance Status Is Required',
                isRequired: false,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#f0c087;" d="M402.407,427.983v59.628c0,9.517-7.787,17.232-17.393,17.232H150.031 c-3.87,0-7.732-0.36-11.535-1.076l-60.344-11.36c-14.014,0-25.87-10.942-26.146-24.836c-0.153-7.2,2.741-13.752,7.478-18.447 c4.624-4.584,11.027-7.423,18.085-7.423l61.713,11.399c3.735,0.69,7.526,1.037,11.325,1.037h50.152 c-15.508-0.081-28.038-12.555-28.038-27.939c0-7.718,3.151-14.695,8.255-19.755c5.094-5.06,12.142-8.184,19.926-8.184h171.523 C388.984,398.259,402.407,411.567,402.407,427.983z"/> <g> <path style="fill:#d4a56d;" d="M372.425,398.259h-30.737c16.558,0,29.982,13.308,29.982,29.724v59.628 c0,9.517-7.787,17.232-17.393,17.232h30.737c9.606,0,17.393-7.715,17.393-17.232v-59.628 C402.407,411.567,388.984,398.259,372.425,398.259z"/> <path style="fill:#d4a56d;" d="M292.293,469.14h-94.95c-4.142,0-18.221,0-18.221-15h113.171c4.142,0,7.499,3.358,7.499,7.5 S296.435,469.14,292.293,469.14z"/> </g> <path style="fill:#5c5aff;" d="M456,512h-52.896c-2.209,0-4-1.791-4-4V400.279c0-2.209,1.791-4,4-4H456c2.209,0,4,1.791,4,4V508 C460,510.209,458.209,512,456,512z"/> <path style="fill:#ffffff;" d="M429.552,396.28V512H456c2.209,0,3.999-1.791,3.999-4V400.28c0-2.209-1.791-4-3.999-4H429.552z"/> <path style="fill:#cfd2da;" d="M402.886,54.368c3.805,1.452,6.319,5.108,6.319,9.189v127.664c0,32.81-12.653,64.37-35.423,87.917 c-23.348,24.151-59.898,51.708-114.352,68.932c-0.554,0.175-1.156,0.175-1.71,0c-54.455-17.224-90.997-44.781-114.352-68.932 c-22.763-23.547-35.423-55.107-35.423-87.917V63.556c0-4.081,2.515-7.737,6.319-9.189L255.086,0.643 c2.247-0.857,4.731-0.857,6.978,0L402.886,54.368z"/> <path style="fill:#eff2fa;" d="M402.886,54.368l-24.586-9.38v149.12c0,38.343-12.653,75.225-35.423,102.743 c-6.608,7.988-14.275,16.294-23.104,24.555c22.92-13.486,40.636-28.435,54.01-42.269c22.77-23.547,35.423-55.107,35.423-87.917 V63.556C409.206,59.476,406.691,55.819,402.886,54.368z"/> <path style="fill:${brandColor}" d="M378.3,81.97v108.02c0,25.46-9.67,49.49-27.25,67.66c-24.58,25.43-55.67,44.59-92.47,57.01V33.99 c0.59,0,1.16,0.07,1.71,0.2l1.84,0.7c0.01,0,0.01,0,0.02,0.01l113.58,43.33C377.28,78.83,378.3,80.31,378.3,81.97z"/> <path style="fill:${brandColor}" d="M258.58,33.99v280.67c-36.8-12.42-67.89-31.58-92.48-57.01c-17.57-18.17-27.25-42.2-27.25-67.66 V81.97c0-1.66,1.02-3.14,2.57-3.74l113.56-43.32l1.89-0.72C257.42,34.06,257.99,33.99,258.58,33.99z"/> <path style="fill:#fdfdfd;" d="M243.593,227.899c-3.953,0-7.904-1.514-10.919-4.543l-49.929-50.146 c-6.031-6.056-6.031-15.877,0-21.933c6.03-6.056,15.808-6.056,21.838,0l39.01,39.18l68.976-69.275 c6.031-6.057,15.808-6.057,21.838,0c6.031,6.056,6.031,15.877,0,21.933l-79.895,80.241 C251.497,226.384,247.544,227.899,243.593,227.899z"/> <g> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isClient: true,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: null,
                    isRequired: false,
                    propertyValue: 'Yes',
                    propertyKey: 'hasPriorInsurance',
                    displayValue: 'Yes, I have',
                    isConditionParent: true,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    isClient: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: null,
                    isRequired: false,
                    propertyValue: 'No',
                    propertyKey: 'hasPriorInsurance',
                    displayValue: "No, I haven't",
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    isClient: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Insurance Company',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorInsuranceCompany',
                    displayValue: null,
                    width: '60',
                    position: 2,
                    hasCustomHtml: false,
                    isConditional: true,
                    conditionValue: 'Yes',
                    conditionKey: 'hasPriorInsurance',
                    companyAnswerId: companyId,
                    options: [
                      '21ST CENTURY',
                      'AFFIRMATIVE INS',
                      'AIG: AIG NATIONAL INS CO',
                      'AIG: ILLINOIS NATIONAL INS CO',
                      'AIG: OTHER',
                      'ALFA',
                      'ALLSTATE',
                      'AMERICAN BANKERS',
                      'AMERICAN CENTURY CASUALTY',
                      'AMERICAN MODERN',
                      'AMERICAN NATIONAL',
                      'ASSURANCEAMERICA INS CO',
                      'AUTO-OWNERS',
                      'CINCINNATI FINANCIAL',
                      'COTTON STATES INS',
                      'CWI - DEPLOYED MILITARY',
                      'DAIRYLAND',
                      'EMC INS',
                      'ENCOMPASS',
                      'ESURANCE',
                      'FARM BUREAU',
                      'FARMERS',
                      'FIRST ACCEPTANCE INS',
                      'GEICO',
                      'GUIDEONE',
                      'HARTFORD',
                      'HORACE MANN',
                      'INFINITY',
                      'INTEGON',
                      'KINGSWAY',
                      'LIBERTY MUTUAL',
                      'METLIFE',
                      'NATIONAL GENERAL',
                      'NATIONWIDE',
                      'OMNI INS',
                      'OTHER STANDARD',
                      'OTHER NON-STANDARD',
                      'PROGRESSIVE',
                      'QUALITY CASUALTY INS CO INC',
                      'SAFECO',
                      'SAFEWAY INS',
                      'SAGAMORE INS CO',
                      'SENTRY INS',
                      'STATE AUTO',
                      'STATE FARM',
                      'TRAVELERS',
                      'USAA',
                      'USAGENCIES',
                      'VICTORIA',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Years With Company',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorInsuranceDuration',
                    displayValue: null,
                    width: '28',
                    position: 3,
                    hasCustomHtml: false,
                    isConditional: true,
                    conditionValue: 'Yes',
                    conditionKey: 'hasPriorInsurance',
                    companyAnswerId: companyId,
                    options: [
                      'Less Than 1 Year',
                      'At Least 1 Year But less Then 3',
                      'At Least 3 Year But Less Than 5 Years',
                      '5 Years Or More',
                    ],
                  },
                ],
              },
              {
                headerText: 'What is your home address?',
                subHeaderText:
                  'This helps us understand where your vehicle will be insured at',
                companyQuestionId: companyId,
                position: 1,
                isClient: true,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="25.278" y1="479.7732" x2="221.489" y2="411.5112" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#E2EDF2"/> <stop offset="1" style="stop-color:#9FC7E2"/> </linearGradient> <path style="fill:url(#SVGID_1_);" d="M44.912,72.683c-4.814-9.951-0.651-21.92,9.3-26.733c3.248-1.571,6.707-2.17,10.066-1.94 c3.168-7.043,8.73-13.055,16.225-16.681c16.942-8.197,37.321-1.107,45.518,15.835c1.981,4.095,3.062,8.391,3.333,12.666 c7.562-0.252,14.923,3.868,18.431,11.117c4.746,9.809,0.642,21.607-9.168,26.353c-8.908,4.31-19.44,1.303-24.856-6.63 c-1.138,0.73-2.326,1.406-3.574,2.011c-13.394,6.48-28.931,3.399-38.904-6.545C61.406,86.68,49.669,82.513,44.912,72.683z"/> <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="44.1546" y1="496.9826" x2="73.0446" y2="486.9286" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#E2EDF2"/> <stop offset="1" style="stop-color:#9FC7E2"/> </linearGradient> <circle style="fill:url(#SVGID_2_);" cx="49.945" cy="19.511" r="16.727"/> <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="112.1688" y1="402.6902" x2="132.3288" y2="382.5402" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#816965"/> <stop offset="1" style="stop-color:#654E48"/> </linearGradient> <path style="fill:url(#SVGID_3_);" d="M149.315,171.132h-40.343c-5.709,0-10.337-4.628-10.337-10.337V96.446 c0-5.709,4.628-10.337,10.337-10.337h40.343c5.709,0,10.337,4.628,10.337,10.337v64.349 C159.653,166.504,155.025,171.132,149.315,171.132z"/> <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="75.8086" y1="141.8" x2="75.8086" y2="5.04" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FFE7A5"/> <stop offset="0.966" style="stop-color:#FFBF5C"/> </linearGradient> <rect x="16.063" y="354.612" style="fill:url(#SVGID_4_);" width="120.471" height="154.604"/> <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="74.6335" y1="177.22" x2="74.6335" y2="127.48" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_5_);" d="M141.553,387.739H16.333c-5.131,0-8.804-4.954-7.315-9.865l12.426-40.931 c0.978-3.222,3.948-5.423,7.315-5.423h112.795V387.739z"/> <linearGradient id="SVGID_6_" gradientUnits="userSpaceOnUse" x1="433.8086" y1="141.8" x2="433.8086" y2="5.04" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FFE7A5"/> <stop offset="0.966" style="stop-color:#FFBF5C"/> </linearGradient> <rect x="375.467" y="354.612" style="fill:url(#SVGID_6_);" width="120.471" height="154.604"/> <linearGradient id="SVGID_7_" gradientUnits="userSpaceOnUse" x1="431.0082" y1="34.3695" x2="306.6182" y2="145.2196" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00;stop-opacity:0"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <polygon style="fill:url(#SVGID_7_);" points="495.937,468.71 414.996,387.768 375.467,387.768 375.467,509.213 495.937,509.213 "/> <linearGradient id="SVGID_8_" gradientUnits="userSpaceOnUse" x1="434.9837" y1="177.22" x2="434.9837" y2="127.48" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_8_);" d="M370.447,387.739h125.22c5.131,0,8.804-4.954,7.315-9.865l-12.426-40.931 c-0.978-3.222-3.948-5.423-7.315-5.423H370.447V387.739z"/> <linearGradient id="SVGID_9_" gradientUnits="userSpaceOnUse" x1="254.8286" y1="240.99" x2="254.8286" y2="-94.5" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FFE7A5"/> <stop offset="0.966" style="stop-color:#FFBF5C"/> <stop offset="1" style="stop-color:#DB9E36"/> </linearGradient> <polygon style="fill:url(#SVGID_9_);" points="415.061,189.342 415.061,509.211 96.979,509.211 96.979,189.342 256,33.433 "/> <linearGradient id="SVGID_10_" gradientUnits="userSpaceOnUse" x1="220.5873" y1="351.0487" x2="128.8673" y2="442.7687" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00;stop-opacity:0"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <polygon style="fill:url(#SVGID_10_);" points="96.979,189.342 96.979,207.668 398.522,509.211 415.061,509.211 415.061,189.342 256,33.433 "/> <linearGradient id="SVGID_11_" gradientUnits="userSpaceOnUse" x1="266.7558" y1="152.8495" x2="230.8658" y2="375.6195" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00;stop-opacity:0"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <polygon style="fill:url(#SVGID_11_);" points="415.061,286.013 415.061,509.213 314.639,509.213 96.979,291.553 96.979,286.013 "/> <linearGradient id="SVGID_12_" gradientUnits="userSpaceOnUse" x1="217.9791" y1="76.4804" x2="75.0391" y2="219.4204" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00;stop-opacity:0"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_12_);" d="M365.913,509.213H210.349l-85.514-85.514c-3.765-2.441-6.27-6.676-6.27-11.48v-68.825 c0-7.54,6.139-13.679,13.679-13.679h49.619c4.815,0,9.05,2.506,11.491,6.27l-0.372,0.295L365.913,509.213z"/> <path style="fill:#503837;" d="M181.863,417.879h-49.615c-3.129,0-5.665-2.536-5.665-5.665v-68.815c0-3.129,2.537-5.665,5.665-5.665 h49.615c3.129,0,5.665,2.537,5.665,5.665v68.815C187.529,415.343,184.992,417.879,181.863,417.879z"/> <path style="fill:#FFFFFF;" d="M181.863,425.899h-49.615c-7.545,0-13.684-6.139-13.684-13.684v-68.815 c0-7.545,6.139-13.684,13.684-13.684h49.615c7.545,0,13.684,6.139,13.684,13.684v68.815 C195.548,419.76,189.409,425.899,181.863,425.899z M134.603,409.86h44.906v-64.107h-44.906V409.86z"/> <linearGradient id="SVGID_13_" gradientUnits="userSpaceOnUse" x1="393.5509" y1="99.9623" x2="302.0309" y2="191.4823" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00;stop-opacity:0"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_13_);" d="M415.072,358.103v151.11h-4.881l-85.514-85.514c-3.776-2.441-6.282-6.676-6.282-11.48 v-68.825c0-7.54,6.139-13.679,13.69-13.679h49.608c4.815,0,9.05,2.506,11.491,6.27l0.197,0.154l-0.132,0.143L415.072,358.103z"/> <path style="fill:#503837;" d="M381.697,417.879h-49.615c-3.129,0-5.665-2.536-5.665-5.665v-68.815c0-3.129,2.536-5.665,5.665-5.665 h49.615c3.129,0,5.665,2.537,5.665,5.665v68.815C387.363,415.343,384.826,417.879,381.697,417.879z"/> <path style="fill:#FFFFFF;" d="M381.698,425.899h-49.615c-7.545,0-13.684-6.139-13.684-13.684v-68.815 c0-7.545,6.139-13.684,13.684-13.684h49.615c7.545,0,13.684,6.139,13.684,13.684v68.815 C395.382,419.76,389.243,425.899,381.698,425.899z M334.436,409.86h44.906v-64.107h-44.906V409.86z"/> <path style="fill:#816965;" d="M222.877,509.209V335.44c0-7.665,6.213-13.878,13.878-13.878h38.536 c7.665,0,13.878,6.213,13.878,13.878v173.769H222.877z"/> <path style="fill:#503837;" d="M297.376,509.209H280.96V340.172c0-5.72-4.68-10.401-10.401-10.401h-29.074 c-5.744,0-10.401,4.656-10.401,10.401v169.037h-16.415V329.316c0-8.815,7.146-15.961,15.961-15.961h50.784 c8.815,0,15.961,7.146,15.961,15.961v179.893H297.376z"/> <circle style="fill:#FFFFFF;" cx="244.264" cy="386.788" r="7.484"/> <rect x="96.969" y="465.415" style="fill:#654E48;" width="318.103" height="43.792"/> <linearGradient id="SVGID_14_" gradientUnits="userSpaceOnUse" x1="20.1112" y1="53.3485" x2="77.5672" y2="-4.1015" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#9EB644"/> <stop offset="1" style="stop-color:#738611"/> </linearGradient> <path style="fill:url(#SVGID_14_);" d="M93.486,492.097c0,6.044-1.143,11.811-3.231,17.112H3.231C1.143,503.908,0,498.141,0,492.097 c0-5.885,1.085-11.511,3.072-16.694c6.719-17.579,23.739-30.049,43.672-30.049s36.952,12.471,43.672,30.049 C92.402,480.587,93.486,486.213,93.486,492.097z"/> <linearGradient id="SVGID_15_" gradientUnits="userSpaceOnUse" x1="70.13" y1="40.7114" x2="111.81" y2="-0.9687" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#9EB644"/> <stop offset="1" style="stop-color:#738611"/> </linearGradient> <path style="fill:url(#SVGID_15_);" d="M123.628,496.797c0,4.384-0.829,8.567-2.343,12.413H58.156 c-1.514-3.845-2.343-8.029-2.343-12.413c0-4.269,0.787-8.35,2.229-12.11c4.874-12.752,17.22-21.798,31.68-21.798 s26.806,9.046,31.68,21.798C122.841,488.446,123.628,492.528,123.628,496.797z"/> <linearGradient id="SVGID_16_" gradientUnits="userSpaceOnUse" x1="424.9272" y1="60.9786" x2="491.8972" y2="-6.0014" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#9EB644"/> <stop offset="1" style="stop-color:#738611"/> </linearGradient> <path style="fill:url(#SVGID_16_);" d="M512,489.262c0,7.045-1.333,13.768-3.766,19.947H406.79 c-2.432-6.178-3.766-12.902-3.766-19.947c0-6.86,1.265-13.417,3.581-19.46c7.833-20.491,27.672-35.028,50.907-35.028 c23.235,0,43.074,14.537,50.907,35.028C510.735,475.845,512,482.402,512,489.262z"/> <linearGradient id="SVGID_17_" gradientUnits="userSpaceOnUse" x1="327.6079" y1="281.3493" x2="181.0779" y2="427.8793" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00;stop-opacity:0"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_17_);" d="M415.061,235.1v169.532L210.452,200.013c-4.016-2.419-6.716-6.807-6.716-11.826v-38.44 c0-28.813,23.452-52.254,52.264-52.254c15.601,0,29.626,6.887,39.213,17.759L415.061,235.1z"/> <path style="fill:#654E48;" d="M391.75,218.606H124.372c-6.376,0-11.562,5.187-11.562,11.562v51.333h8.031v-51.333 c0-1.947,1.584-3.531,3.531-3.531h15.994v54.863h8.031v-54.863h23.859v54.863h8.031v-54.863h23.859v54.863h8.031v-54.863h23.859 v54.863h8.031v-54.863h23.86v54.863h8.031v-54.863h23.859v54.863h8.031v-54.863h23.859v54.863h8.031v-54.863h23.859v54.863h8.031 v-54.863h20.118c1.947,0,3.531,1.584,3.531,3.531v51.333h8.031v-51.333C403.312,223.793,398.125,218.606,391.75,218.606z"/> <linearGradient id="SVGID_18_" gradientUnits="userSpaceOnUse" x1="254.8086" y1="245.14" x2="254.8086" y2="192.8" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_18_);" d="M421.654,273.168v25.75c0,3.827-3.102,6.929-6.929,6.929H97.275 c-3.827,0-6.929-3.102-6.929-6.929v-25.75c0-3.827,3.102-6.929,6.929-6.929h317.45C418.552,266.239,421.654,269.341,421.654,273.168 z"/> <linearGradient id="SVGID_19_" gradientUnits="userSpaceOnUse" x1="254.8086" y1="368.7599" x2="254.8086" y2="191.07" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_19_);" d="M472.01,217.228L266.626,11.776c-5.854-5.854-15.346-5.854-21.2,0L39.99,217.211 c-3.83,3.83-3.83,10.039,0,13.869l8.755,8.755c3.83,3.83,10.039,3.83,13.869,0l190.62-190.62c1.541-1.541,4.04-1.541,5.581,0 l190.57,190.636c3.83,3.83,10.039,3.83,13.869,0l8.755-8.755C475.84,227.267,475.84,221.058,472.01,217.228z"/> <linearGradient id="SVGID_20_" gradientUnits="userSpaceOnUse" x1="407.64" y1="337.2113" x2="300.24" y2="444.6093" gradientTransform="matrix(1.0039 0 0 -1.0039 0.1922 516.5547)"> <stop offset="0" style="stop-color:#FF5D00;stop-opacity:0"/> <stop offset="1" style="stop-color:#D54003"/> </linearGradient> <path style="fill:url(#SVGID_20_);" d="M266.626,11.776c-2.927-2.927-6.763-4.39-10.6-4.39v40.675c1.01,0,2.02,0.386,2.791,1.156 l190.569,190.636c3.83,3.83,10.039,3.83,13.869,0l8.755-8.755c3.83-3.83,3.83-10.039,0-13.869L266.626,11.776z"/> <path style="fill:#654E48;" d="M294.433,193.67h-76.865c-3.031,0-5.487-2.457-5.487-5.487v-38.433 c0-24.257,19.664-43.921,43.921-43.921l0,0c24.257,0,43.921,19.664,43.921,43.921v38.433 C299.921,191.213,297.463,193.67,294.433,193.67z"/> <path style="fill:#FFFFFF;" d="M256,97.49c-28.816,0-52.259,23.444-52.259,52.259v38.432c0,7.625,6.202,13.827,13.827,13.827h76.865 c7.625,0,13.827-6.202,13.827-13.827v-38.432C308.259,120.933,284.817,97.49,256,97.49z M291.293,145.302H264.34v-30.137 C278.542,118.591,289.445,130.555,291.293,145.302z M247.66,115.165v30.137h-26.953C222.555,130.555,233.457,118.591,247.66,115.165 z M220.419,161.981h27.241v23.35h-27.241V161.981z M264.34,185.331v-23.35h27.241v23.35H264.34z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isAddressSearch: true,
                    isSelect: false,
                    isClient: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    secondaryPlaceholderText: 'Home Address',
                    errorText: 'Home Address Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'fullAddress',
                    displayValue: null,
                    width: '80',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
              {
                headerText: 'How can an agent contact you?',
                subHeaderText: 'This is important for getting you your quote',
                companyQuestionId: companyId,
                position: 2,
                isClient: true,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 58.981 58.981" style="enable-background:new 0 0 58.981 58.981;" xml:space="preserve"> <g> <path style="fill:#545E73;" d="M35.89,58H10.701c-1.881,0-3.405-1.525-3.405-3.405V3.405C7.296,1.525,8.821,0,10.701,0H35.89 c1.881,0,3.405,1.525,3.405,3.405v51.189C39.296,56.475,37.771,58,35.89,58z"/> <rect x="7.296" y="6" style="fill:#8697CB;" width="32" height="40"/> <circle style="fill:#323A45;" cx="23.296" cy="52" r="3"/> <path style="fill:#323A45;" d="M23.296,4h-4c-0.553,0-1-0.447-1-1s0.447-1,1-1h4c0.553,0,1,0.447,1,1S23.849,4,23.296,4z"/> <path style="fill:#323A45;" d="M27.296,4h-1c-0.553,0-1-0.447-1-1s0.447-1,1-1h1c0.553,0,1,0.447,1,1S27.849,4,27.296,4z"/> <g> <circle style="fill:${brandColor}" cx="39.686" cy="46.981" r="12"/> <path style="fill:#FFFFFF;" d="M45.686,45.981h-5v-5c0-0.552-0.448-1-1-1s-1,0.448-1,1v5h-5c-0.552,0-1,0.448-1,1s0.448,1,1,1h5v5 c0,0.552,0.448,1,1,1s1-0.448,1-1v-5h5c0.552,0,1-0.448,1-1S46.238,45.981,45.686,45.981z"/> </g> </g> </svg>`,
                answers: [
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    isClient: true,
                    placeholderText: 'Email',
                    errorText: 'Email Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'email',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: true,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Phone Number',
                    errorText: 'Phone Is Required',
                    isRequired: true,
                    propertyValue: null,
                    isClient: true,
                    propertyKey: 'phone',
                    displayValue: null,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    fireNewLead: true,
                  },
                ],
              },
              {
                headerText:
                  'How many accidents, violations, or speeding tickets have you had in the last 5 years?',
                subHeaderText:
                  'If more than 1, please select the biggest violation on your record or the most recent',
                companyQuestionId: companyId,
                position: 3,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path style="fill:#9AA7B8;" d="M488.897,230.149h-28.81c-24.365,0-32.777,63.655-32.777,63.655l14.7,5.436l11.059-29.909h27.393 c13.149,0,23.808-10.659,23.808-23.808C504.271,237.031,497.388,230.149,488.897,230.149z"/> <path style="fill:#9AA7B8;" d="M51.896,230.149h-28.81c-8.491,0-15.374,6.883-15.374,15.374c0,13.149,10.659,23.808,23.808,23.808 h27.393l11.058,29.909l14.7-5.436C84.672,293.804,72.098,230.149,51.896,230.149z"/> </g> <rect x="136.098" y="141.365" style="fill:#384149;" width="239.794" height="62.691"/> <path style="fill:#C0EAF9;" d="M434.664,296.521H77.319l29.153-87.531c4.712-14.179,17.983-23.74,32.925-23.74h233.19 c14.942,0,28.212,9.561,32.925,23.74L434.664,296.521z"/> <path style="fill:#A0D9F2;" d="M433.347,296.521H78.636l21.65-62.454c4.911-14.179,18.725-23.74,34.283-23.74h242.845 c15.559,0,29.372,9.561,34.283,23.74L433.347,296.521z"/> <path style="fill:#444D56;" d="M429.7,306.434l-31.621-94.972c-3.659-10.993-13.903-18.379-25.489-18.379H139.391 c-11.586,0-21.83,7.385-25.489,18.379l-31.621,94.972l-14.871-4.952l31.621-94.972c5.795-17.406,22.014-29.101,40.36-29.101h233.199 c18.346,0,34.565,11.695,40.36,29.101l31.621,94.972L429.7,306.434z"/> <path style="fill:#616970;" d="M349.586,268.312H162.397c-6.559,0-12.603,3.556-15.788,9.289l-10.513,18.921l172.846,12.614 l66.947-12.614l-10.513-18.921C362.189,271.867,356.145,268.312,349.586,268.312z"/> <path style="fill:#C8E8EE;" d="M399.773,100.614H112.211c-5.572,0-10.09,4.517-10.09,10.09v39.378c0,5.572,4.517,10.09,10.09,10.09 h287.562c5.572,0,10.09-4.517,10.09-10.09v-39.378C409.862,105.131,405.345,100.614,399.773,100.614z"/> <path style="fill:#E93438;" d="M188.419,100.614h-76.209c-5.572,0-10.09,4.517-10.09,10.09v39.378c0,5.572,4.517,10.09,10.09,10.09 h76.209V100.614z"/> <path style="fill:#D32A32;" d="M126.503,150.08v-39.378c0-5.572,4.517-10.09,10.09-10.09h-24.381c-5.572,0-10.09,4.517-10.09,10.09 v39.378c0,5.572,4.517,10.09,10.09,10.09h24.381C131.02,160.17,126.503,155.653,126.503,150.08z"/> <path style="fill:#60D6FF;" d="M399.773,100.614h-76.209v59.556h76.209c5.572,0,10.09-4.517,10.09-10.09v-39.378 C409.862,105.131,405.345,100.614,399.773,100.614z"/> <path style="fill:#C8E8EE;" d="M255.992,65.089c-4.329,0-7.837-3.509-7.837-7.837V9.143c0-4.328,3.508-7.837,7.837-7.837 c4.329,0,7.837,3.509,7.837,7.837v48.109C263.828,61.582,260.321,65.089,255.992,65.089z"/> <path style="fill:#E93438;" d="M191.868,76.175c-3.231,0-6.255-2.012-7.391-5.233l-16.001-45.371 c-1.439-4.081,0.703-8.557,4.785-9.997c4.079-1.439,8.557,0.702,9.997,4.785l16.001,45.371c1.439,4.081-0.703,8.557-4.785,9.997 C193.613,76.03,192.732,76.175,191.868,76.175z"/> <path style="fill:#60D6FF;" d="M320.114,76.175c-0.865,0-1.744-0.144-2.606-0.448c-4.081-1.44-6.223-5.916-4.785-9.998 l16.002-45.371c1.44-4.082,5.915-6.223,9.997-4.785c4.081,1.44,6.223,5.915,4.785,9.998l-16.001,45.371 C326.37,74.162,323.344,76.175,320.114,76.175z"/> <g> <path style="fill:#2B2A32;" d="M29.782,427.557v67.527c0,8.621,6.989,15.61,15.61,15.61h60.203c8.621,0,15.61-6.989,15.61-15.61 v-79.449"/> <path style="fill:#2B2A32;" d="M390.782,415.635v79.449c0,8.621,6.989,15.61,15.61,15.61h60.203c8.621,0,15.61-6.989,15.61-15.61 v-79.449"/> </g> <path style="fill:#0D1B24;" d="M340.619,468.921H171.363c-12.121,0-21.946-9.826-21.946-21.946l0,0l140.604-18.803l72.545,18.803 l0,0C362.566,459.096,352.74,468.921,340.619,468.921z"/> <path style="fill:#444D56;" d="M466.693,296.522H45.29c-16.066,0-29.091,13.025-29.091,29.091v90.022h479.584v-90.022 C495.783,309.546,482.76,296.522,466.693,296.522z"/> <path style="fill:#333B42;" d="M76.636,296.522H45.29c-16.066,0-29.091,13.025-29.091,29.091v90.022h31.346v-90.022 C47.545,309.546,60.57,296.522,76.636,296.522z"/> <path style="fill:#616970;" d="M362.663,324.733H149.32c-6.871,0-12.441,5.57-12.441,12.441V412.5h238.225v-75.327 C375.104,330.303,369.534,324.733,362.663,324.733z"/> <path style="fill:#8492A0;" d="M512,405.89v30.459c0,0.784-0.084,1.536-0.251,2.267c-1.034,4.786-5.287,8.359-10.376,8.359H10.616 C4.754,446.975,0,442.221,0,436.349V405.89c0-5.872,4.754-10.627,10.616-10.627h490.757C507.246,395.263,512,400.018,512,405.89z"/> <g> <path style="fill:#9AA7B8;" d="M512,405.89v30.459c0,0.784-0.084,1.536-0.251,2.267H35.004c-5.872,0-10.627-4.754-10.627-10.627 v-30.459c0-0.784,0.084-1.536,0.251-2.267h476.745C507.246,395.263,512,400.018,512,405.89z"/> <path style="fill:#9AA7B8;" d="M96.132,395.26H53.815v63.448c0,3.909,3.169,7.078,7.078,7.078h28.159 c3.909,0,7.078-3.169,7.078-7.078V395.26H96.132z"/> <path style="fill:#9AA7B8;" d="M458.171,395.26h-42.316v63.448c0,3.909,3.169,7.078,7.078,7.078h28.159 c3.909,0,7.078-3.169,7.078-7.078V395.26H458.171z"/> </g> <g> <path style="fill:#8492A0;" d="M83.619,465.784H60.892c-3.908,0-7.074-3.166-7.074-7.074v-63.446h22.716v63.446 C76.535,462.618,79.701,465.784,83.619,465.784z"/> <path style="fill:#8492A0;" d="M445.655,465.784h-22.727c-3.908,0-7.074-3.166-7.074-7.074v-63.446h22.716v63.446 C438.571,462.618,441.747,465.784,445.655,465.784z"/> </g> <g> <rect x="403.32" y="324.734" style="fill:#FEFFFF;" width="65.825" height="34.48"/> <rect x="42.841" y="324.734" style="fill:#FEFFFF;" width="65.825" height="34.48"/> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '0',
                    propertyKey: 'priorPenalties',
                    displayValue: 'None',
                    width: '23',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '1',
                    propertyKey: 'priorPenalties',
                    displayValue: '1 Violation',
                    width: '23',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isConditionParent: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '2',
                    propertyKey: 'priorPenalties',
                    displayValue: '2 Violations',
                    width: '23',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isConditionParent: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '3',
                    propertyKey: 'priorPenalties',
                    displayValue: '3 Or More',
                    width: '23',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isConditionParent: true,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Select Prior Violation Code',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesCode',
                    displayValue: null,
                    isConditionParent: false,
                    width: '45',
                    position: 4,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: violationCodes,
                    conditionKey: 'priorPenalties',
                    conditionValue: '1',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Selected Violation Date',
                    startDate: '01/01/2015',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesDate',
                    displayValue: null,
                    width: '45',
                    position: 5,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    conditionKey: 'priorPenalties',
                    conditionValue: '1',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Select Prior Violation Code',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesCode',
                    displayValue: null,
                    isConditionParent: false,
                    width: '45',
                    position: 6,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: violationCodes,
                    conditionKey: 'priorPenalties',
                    conditionValue: '2',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Selected Violation Date',
                    startDate: '01/01/2015',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesDate',
                    displayValue: null,
                    width: '45',
                    position: 7,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    conditionKey: 'priorPenalties',
                    conditionValue: '2',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Select Prior Violation Code',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesCode',
                    displayValue: null,
                    isConditionParent: false,
                    width: '45',
                    position: 8,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: violationCodes,
                    conditionKey: 'priorPenalties',
                    conditionValue: '3',
                    isConditional: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: true,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Selected Violation Date',
                    startDate: '01/01/2015',
                    isRequired: false,
                    propertyValue: null,
                    propertyKey: 'priorPenaltiesDate',
                    displayValue: null,
                    width: '45',
                    position: 9,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    conditionKey: 'priorPenalties',
                    conditionValue: '3',
                    isConditional: true,
                  },
                ],
              },
            ],
          },
          {
            title: 'Vehicles',
            isVehicle: true,
            isDriver: false,
            position: 3,
            companyPageId: companyId,
            questions: [
              {
                headerText: "What's the year, make, and model of the vehicle?",
                subHeaderText:
                  'Enter in the VIN to automatically find the vehicle or select it manually below',
                companyQuestionId: companyId,
                position: 0,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:${brandColor}" d="M489.798,239.613c-16.627-10.241-70.258-23.335-145.52-23.335l-39.756-46.38 c-8.385-9.782-20.627-15.413-33.511-15.413H152.008c-12.644,0-24.87,4.523-34.47,12.751L70.624,207.45l-50.039,7.148 c-7.106,1.015-12.889,6.231-14.63,13.195l-5.95,23.794l132.415,61.792h370.755v-49.903 C503.173,253.717,498.107,244.732,489.798,239.613z"/> <path style="fill:${brandColor}" d="M503.173,269.241c0-17.655-26.482-35.31-150.067-35.31H8.831c-4.875,0-8.827,3.953-8.827,8.827 v52.965l167.725,26.482h335.445V269.241z"/> <path style="fill:${brandColor}" d="M503.173,304.551H89.244l-78.5-17.443c-4.715-1.035-9.474,1.935-10.535,6.702 c-1.052,4.759,1.949,9.474,6.707,10.53l79.447,17.655c0.629,0.142,1.267,0.211,1.913,0.211h414.894c4.879,0,8.828-3.953,8.828-8.827 C511.999,308.504,508.052,304.551,503.173,304.551z"/> <circle style="fill:#EDEDEE;" cx="423.72" cy="304.549" r="44.137"/> <path style="fill:#504B5A;" d="M423.725,357.516c-29.207,0-52.965-23.758-52.965-52.965c0-29.207,23.758-52.965,52.965-52.965 s52.965,23.758,52.965,52.965C476.69,333.758,452.932,357.516,423.725,357.516z M423.725,269.241 c-19.473,0-35.31,15.837-35.31,35.31c0,19.473,15.837,35.31,35.31,35.31s35.31-15.836,35.31-35.31 C459.035,285.078,443.199,269.241,423.725,269.241z"/> <circle style="fill:#DCDBDE;" cx="423.72" cy="304.549" r="17.655"/> <circle style="fill:#EDEDEE;" cx="88.275" cy="304.549" r="44.137"/> <path style="fill:#504B5A;" d="M88.279,357.516c-29.207,0-52.965-23.758-52.965-52.965c0-29.207,23.758-52.965,52.965-52.965 s52.965,23.758,52.965,52.965C141.243,333.758,117.485,357.516,88.279,357.516z M88.279,269.241c-19.473,0-35.31,15.837-35.31,35.31 c0,19.473,15.837,35.31,35.31,35.31s35.31-15.836,35.31-35.31C123.589,285.078,107.752,269.241,88.279,269.241z"/> <circle style="fill:#DCDBDE;" cx="88.275" cy="304.549" r="17.655"/> <g> <path style="fill:${brandColor}" d="M353.105,286.896H167.728c-4.875,0-8.827-3.953-8.827-8.827l0,0c0-4.875,3.953-8.827,8.827-8.827 h185.377c4.875,0,8.827,3.952,8.827,8.827l0,0C361.933,282.945,357.98,286.896,353.105,286.896z"/> <path style="fill:${brandColor}" d="M503.173,286.896h-8.827c-4.875,0-8.828-3.953-8.828-8.827l0,0c0-4.875,3.953-8.827,8.828-8.827 h8.827c4.875,0,8.827,3.952,8.827,8.827l0,0C512,282.945,508.048,286.896,503.173,286.896z"/> </g> <path style="fill:${brandColor}" d="M70.624,207.449l46.914-40.214c9.6-8.228,21.826-12.751,34.47-12.751h119.003 c12.885,0,25.125,5.63,33.511,15.413l39.756,46.38H135.276c-7.78,0-15.546-0.643-23.221-1.922L70.624,207.449z"/> <path style="fill:#625D6B;" d="M261.294,169.664c-3.354-4.025-8.323-6.352-13.563-6.352h-81.524c-4.682,0-9.173,1.86-12.483,5.171 l-26.482,26.482c-2.341,2.341-3.657,5.516-3.657,8.827l0,0c0,6.894,5.589,12.484,12.484,12.484h154.647 c3.742,0,5.786-4.365,3.391-7.24L261.294,169.664z"/> <polygon style="fill:#504B5A;" points="185.381,216.276 158.898,216.276 176.553,163.312 194.208,163.312 "/> <path style="fill:#EDEDEE;" d="M493.697,242.759h-8.181c-4.875,0-8.827,3.952-8.827,8.827s3.953,8.827,8.827,8.827h17.261 C502.011,253.548,498.814,247.337,493.697,242.759z"/> <path style="fill:#625D6B;" d="M304.522,169.897c-2.115-2.468-4.48-4.669-7.036-6.585H283.08c-3.742,0-5.786,4.364-3.391,7.24 l32.813,39.374c3.354,4.025,8.323,6.352,13.562,6.352h18.213L304.522,169.897z"/> <path style="fill:${brandColor}" d="M0.004,242.759v8.827h17.655c4.875,0,8.827-3.952,8.827-8.827s-3.953-8.827-8.827-8.827H8.831 C3.955,233.931,0.004,237.884,0.004,242.759z"/> <g> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Vehicle VIN',
                    errorText: 'VIN Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'vehicleVin',
                    displayValue: null,
                    width: '90',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isVehicleVIN: true,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    errorText: 'Vehicle Year Is Required',
                    isRequired: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Enter The Vehicle Year',
                    propertyValue: null,
                    propertyKey: 'vehicleModelYear',
                    displayValue: null,
                    width: '20',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isVehicleYear: true,
                    options: [
                      '2021',
                      '2020',
                      '2019',
                      '2018',
                      '2017',
                      '2016',
                      '2015',
                      '2014',
                      '2013',
                      '2012',
                      '2011',
                      '2010',
                      '2009',
                      '2008',
                      '2007',
                      '2006',
                      '2005',
                      '2004',
                      '2003',
                      '2002',
                      '2001',
                      '2000',
                      '1999',
                      '1998',
                      '1997',
                      '1996',
                      '1995',
                      '1994',
                      '1993',
                      '1992',
                      '1991',
                      '1990',
                      '1989',
                      '1988',
                      '1987',
                      '1986',
                      '1985',
                      '1984',
                      '1983',
                      '1982',
                      '1981',
                      '1980',
                      '1979',
                      '1978',
                      '1977',
                      '1976',
                      '1975',
                      '1974',
                      '1973',
                      '1972',
                      '1971',
                      '1970',
                      '1969',
                      '1968',
                      '1967',
                      '1966',
                      '1965',
                      '1964',
                      '1963',
                      '1962',
                      '1961',
                      '1960',
                      '1959',
                      '1958',
                      '1957',
                      '1956',
                      '1955',
                      '1954',
                      '1953',
                      '1952',
                      '1951',
                      '1950',
                      '1949',
                      '1948',
                      '1947',
                      '1946',
                      '1945',
                    ],
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    errorText: 'Vehicle Is Required',
                    isRequired: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Enter The Vehicle Make Or Model',
                    propertyValue: null,
                    propertyKey: 'vehicleModel',
                    displayValue: null,
                    width: '70',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    isVehicleMakeModel: true,
                  },
                ],
              },
              {
                headerText: 'How is this vehicle primarly used?',
                subHeaderText:
                  'This helps us estimate what your wear and tear will be',
                companyQuestionId: companyId,
                position: 1,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path style="fill:#5C5E70;" d="M512,256v0.554c-0.052,23.364-3.229,45.996-9.143,67.49c-1.891,6.896-4.075,13.678-6.52,20.323 c-2.1,5.705-4.399,11.327-6.886,16.833c-1.661,3.688-3.417,7.335-5.245,10.93v0.01c-4.232,8.286-8.892,16.311-13.97,24.043 c-1.985,3.03-4.033,6.019-6.144,8.955c-5.831,8.129-12.142,15.914-18.871,23.291c-3.584,3.929-7.293,7.753-11.118,11.452 c-1.787,1.735-3.594,3.438-5.423,5.099c-5.622,5.151-11.473,10.041-17.533,14.67c-3.427,2.612-6.928,5.141-10.491,7.575 c-5.684,3.908-11.525,7.586-17.533,11.024c-20.574,11.797-42.945,20.814-66.601,26.551c-19.404,4.702-39.675,7.199-60.52,7.199 c-6.907,0-13.751-0.272-20.511-0.815c-23.312-1.839-45.745-6.813-66.873-14.493c-41.127-14.932-77.332-40.103-105.545-72.421 c-18.85-21.598-34.137-46.383-44.93-73.445C6.44,321.494,0.003,289.499,0.003,256c0-141.384,114.614-255.998,255.998-255.998 c16.06,0,31.775,1.484,47.02,4.305c9.237,1.724,18.306,3.929,27.167,6.614c17.92,5.413,35.025,12.748,51.043,21.755 c14.806,8.307,28.693,18.056,41.472,29.038c5.099,4.378,10.01,8.944,14.743,13.699c17.784,17.868,32.956,38.358,44.868,60.834 c2.55,4.807,4.953,9.697,7.189,14.681c2.623,5.81,5.026,11.724,7.21,17.753c1.39,3.803,2.675,7.649,3.887,11.536 c0.387,1.275,0.773,2.55,1.149,3.835c1.118,3.803,2.142,7.649,3.072,11.525c0.313,1.285,0.616,2.56,0.899,3.845 c0.867,3.814,1.641,7.649,2.32,11.525c0.219,1.191,0.418,2.382,0.616,3.584v0.031c0.564,3.396,1.045,6.834,1.463,10.282 c0.219,1.766,0.418,3.542,0.596,5.318c0.251,2.57,0.47,5.151,0.648,7.743C511.791,243.879,512,249.918,512,256z"/> <g> <path style="fill:#797B89;" d="M489.503,150.925c-2.236,2.55-5.517,4.148-9.174,4.148H304.046c-3.385,0-6.437-1.369-8.662-3.584 c-2.215-2.215-3.584-5.277-3.584-8.652c0-6.76,5.486-12.236,12.246-12.236h37.209c3.375,0,6.437-1.369,8.652-3.584 c2.215-2.226,3.584-5.277,3.584-8.662c0-6.76-5.475-12.236-12.236-12.236h-10.386c-3.375,0-6.447-1.369-8.662-3.584 c-2.215-2.215-3.584-5.287-3.584-8.662c0-6.76,5.486-12.236,12.246-12.236h34.377c3.375,0,6.437-1.369,8.652-3.584 c2.215-2.226,3.584-5.277,3.584-8.662c0-6.76-5.475-12.236-12.236-12.236h-75.483c-3.375,0-6.437-1.369-8.652-3.584 c-2.215-2.215-3.584-5.287-3.584-8.662c0-6.76,5.475-12.236,12.236-12.236h91.47c14.806,8.307,28.693,18.056,41.472,29.038 c5.099,4.378,10.01,8.944,14.743,13.699c17.784,17.868,32.956,38.358,44.868,60.834 C484.864,141.051,487.267,145.94,489.503,150.925z"/> <path style="fill:#797B89;" d="M132.015,387.541c0,6.76-5.486,12.246-12.246,12.246h-3.396c-3.375,0-6.447,1.369-8.662,3.584 c-2.215,2.215-3.584,5.277-3.584,8.652c0,6.76-5.475,12.246-12.236,12.246H63.073c-18.85-21.598-34.137-46.383-44.93-73.445h48.075 c6.76,0,12.236,5.475,12.236,12.236c0,6.76,5.486,12.246,12.246,12.246h29.069c3.385,0,6.437,1.369,8.662,3.584 C130.646,381.105,132.015,384.156,132.015,387.541z"/> <path style="fill:#797B89;" d="M240.022,281.754L240.022,281.754c0-6.76,5.48-12.24,12.24-12.24h39.444 c6.76,0,12.24-5.48,12.24-12.24l0,0c0-6.76-5.48-12.24-12.24-12.24H175.424c-6.76,0-12.24,5.48-12.24,12.24l0,0 c0,6.76-5.48,12.24-12.24,12.24H111.5c-6.76,0-12.24,5.48-12.24,12.24l0,0c0,6.76,5.48,12.24,12.24,12.24h58.486 c6.76,0,12.24,5.48,12.24,12.24l0,0c0,6.76,5.48,12.24,12.24,12.24h116.283c6.76,0,12.24-5.48,12.24-12.24l0,0 c0-6.76-5.48-12.24-12.24-12.24h-58.486C245.503,293.995,240.022,288.515,240.022,281.754z"/> </g> <rect x="303.019" y="177.391" style="fill:#FCF8F2;" width="27.167" height="101.354"/> <g> <path style="fill:#494B5B;" d="M54.795,241.36h-23.64c-6.444,0-11.668-5.223-11.668-11.668v-28.213h46.976v28.213 C66.463,236.137,61.239,241.36,54.795,241.36z"/> <path style="fill:#494B5B;" d="M260.559,241.36h-23.64c-6.444,0-11.668-5.223-11.668-11.668v-28.213h46.976v28.213 C272.228,236.137,267.003,241.36,260.559,241.36z"/> </g> <path style="fill:#FF525D;" d="M283.626,143.61v41.827c-0.024-0.012-0.047-0.012-0.071-0.018c-2.63,8.08-5.958,15.842-9.907,23.225 H18.066c-1.922-3.593-3.7-7.283-5.32-11.054c-1.708-3.966-3.239-8.027-4.587-12.171c-0.024,0.006-0.047,0.006-0.071,0.018V143.61 c0-5.693,1.46-11.196,4.138-16.031c2.436-4.416,5.882-8.282,10.149-11.237l13.524-9.357l12.407-54.074 c2.974-12.974,14.518-22.173,27.83-22.173h139.436c13.312,0,24.856,9.197,27.835,22.173l12.402,54.074l13.53,9.357 C278.289,122.538,283.626,132.729,283.626,143.61z"/> <path style="fill:#34ABE0;" d="M232.213,106.986H59.509c-3.99,0-6.945-3.706-6.053-7.595l9.871-43.027 c1.377-6.011,6.644-10.214,12.816-10.214h139.43c6.171,0,11.437,4.203,12.821,10.214l9.866,43.027 C239.152,103.28,236.202,106.986,232.213,106.986z"/> <path style="fill:#494B5B;" d="M214.195,208.642v3.456c0,8.395-11.65,15.199-26.021,15.199h-84.636 c-14.37,0-26.021-6.805-26.021-15.199v-3.456H214.195z"/> <path style="fill:#EF4152;" d="M12.747,197.591c-1.708-3.966-3.239-8.027-4.587-12.171c-0.024,0.006-0.047,0.006-0.071,0.018V143.61 c0-5.693,1.46-11.196,4.138-16.031c0,0-9.417,57.698,97.574,57.698C178.528,185.278,87.001,192.454,12.747,197.591z"/> <g> <path style="fill:#5C5E70;" d="M208.071,176.466H83.644c-3.183,0-5.764-2.58-5.764-5.764l0,0c0-3.183,2.58-5.764,5.764-5.764 h124.428c3.183,0,5.764,2.58,5.764,5.764l0,0C213.835,173.885,211.254,176.466,208.071,176.466z"/> <path style="fill:#5C5E70;" d="M208.071,157.658H83.644c-3.183,0-5.764-2.58-5.764-5.764l0,0c0-3.183,2.58-5.764,5.764-5.764 h124.428c3.183,0,5.764,2.58,5.764,5.764l0,0C213.835,155.077,211.254,157.658,208.071,157.658z"/> </g> <path style="fill:#F9EED7;" d="M291.713,196.96c0,1.38-0.242,2.708-0.69,3.941c-0.58,1.636-1.527,3.113-2.73,4.324 c-2.114,2.114-5.028,3.42-8.258,3.42H11.685c-5.065,0-9.381-3.23-10.995-7.744C0.242,199.669,0,198.341,0,196.96 c0-3.222,1.306-6.144,3.42-8.265c2.114-2.114,5.035-3.42,8.265-3.42h268.35C286.486,185.275,291.713,190.508,291.713,196.96z"/> <path style="fill:#78CAEF;" d="M224.611,78.392c1.354,4.326-3.649,7.835-7.255,5.089l-13.345-10.164L190.01,62.655 c-3.541-2.697-1.634-8.35,2.817-8.35h20.826c2.032,0,3.83,1.321,4.438,3.26L224.611,78.392z"/> <path style="fill:#FF6E7C;" d="M248.119,126.422h-75.07c-3.264,0-5.911-2.647-5.911-5.911l0,0c0-3.264,2.647-5.911,5.911-5.911 h75.07c3.264,0,5.911,2.647,5.911,5.911l0,0C254.03,123.775,251.383,126.422,248.119,126.422z"/> <path style="fill:#E8DBC4;" d="M291.023,200.902c-0.58,1.636-1.527,3.113-2.73,4.324c-2.114,2.114-5.028,3.42-8.258,3.42H11.685 c-5.065,0-9.381-3.23-10.995-7.744H291.023z"/> <g> <path style="fill:#FCF8F2;" d="M262.474,195.581H152.782c-2.845,0-5.151-2.306-5.151-5.151l0,0c0-2.845,2.306-5.151,5.151-5.151 h109.692c2.845,0,5.151,2.306,5.151,5.151l0,0C267.625,193.274,265.319,195.581,262.474,195.581z"/> <path style="fill:#FCF8F2;" d="M136.568,195.581h-23.006c-2.845,0-5.151-2.306-5.151-5.151l0,0c0-2.845,2.306-5.151,5.151-5.151 h23.006c2.845,0,5.151,2.306,5.151,5.151l0,0C141.72,193.274,139.414,195.581,136.568,195.581z"/> </g> <path style="fill:#279FC9;" d="M122.804,106.986H59.509c-3.99,0-6.945-3.706-6.053-7.595l9.871-43.027 c1.377-6.011,6.644-10.214,12.816-10.214C76.142,46.149,65.468,99.367,122.804,106.986z"/> <path style="fill:#EF4152;" d="M235.266,176.87c-6.857,0-12.434-5.578-12.434-12.434v-13.448c0-6.505,5.011-11.895,11.458-12.386 c0.436-0.048,0.783-0.048,0.976-0.048h31.556c6.857,0,12.434,5.578,12.434,12.434v13.448c0,1.156-0.158,2.278-0.469,3.338 c-1.481,5.36-6.384,9.096-11.965,9.096H235.266z"/> <path style="fill:#EDBB4C;" d="M272.986,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.7,2.623-3.093,4.545-5.935,4.545h-31.556 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-3.281,2.56-5.966,5.799-6.144c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C270.228,144.824,272.986,147.582,272.986,150.988z"/> <path style="fill:#FFD15C;" d="M272.986,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.115,0.021-0.24,0.021-0.355,0.021h-31.566 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-0.564,0.073-1.108,0.23-1.62c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C270.228,144.824,272.986,147.582,272.986,150.988z"/> <path style="fill:#FFDC8D;" d="M264.975,155.972h-12.539c-2.116,0-3.832-1.716-3.832-3.832l0,0c0-2.116,1.716-3.832,3.832-3.832 h12.539c2.116,0,3.832,1.716,3.832,3.832l0,0C268.807,154.257,267.091,155.972,264.975,155.972z"/> <path style="fill:#EF4152;" d="M24.893,176.87c-6.857,0-12.434-5.578-12.434-12.434v-13.448c0-6.505,5.011-11.895,11.458-12.386 c0.436-0.048,0.783-0.048,0.976-0.048h31.556c6.857,0,12.434,5.578,12.434,12.434v13.448c0,1.156-0.158,2.278-0.469,3.338 c-1.481,5.36-6.384,9.096-11.965,9.096H24.893z"/> <path style="fill:#EDBB4C;" d="M62.614,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.7,2.623-3.093,4.545-5.935,4.545H24.893 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-3.281,2.56-5.966,5.799-6.144c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C59.856,144.824,62.614,147.582,62.614,150.988z"/> <path style="fill:#FFD15C;" d="M62.614,150.988v13.448c0,0.564-0.073,1.108-0.23,1.62c-0.115,0.021-0.24,0.021-0.355,0.021H30.463 c-3.406,0-6.165-2.759-6.165-6.165v-13.448c0-0.564,0.073-1.108,0.23-1.62c0.115-0.021,0.24-0.021,0.366-0.021h31.556 C59.856,144.824,62.614,147.582,62.614,150.988z"/> <path style="fill:#FFDC8D;" d="M54.604,155.972H42.065c-2.116,0-3.832-1.716-3.832-3.832l0,0c0-2.116,1.716-3.832,3.832-3.832 h12.539c2.116,0,3.832,1.716,3.832,3.832l0,0C58.435,154.257,56.72,155.972,54.604,155.972z"/> <path style="fill:#494B5B;" d="M411.1,270.617h-23.64c-6.444,0-11.668-5.223-11.668-11.668v-28.213h46.976v28.213 C422.768,265.394,417.544,270.617,411.1,270.617z"/> <path style="fill:#E8DBC4;" d="M510.715,230.16c0.251,2.57,0.47,5.151,0.648,7.743H374.367c-1.348-2.529-2.633-5.11-3.835-7.743 c-0.512-1.097-1.003-2.194-1.484-3.312c-1.651-3.856-3.156-7.795-4.462-11.818c-0.052-0.115-0.084-0.24-0.125-0.355 c-0.021,0.01-0.042,0.01-0.073,0.021v-41.827c0-5.695,1.463-11.191,4.138-16.029c2.445-4.42,5.883-8.286,10.156-11.243l13.521-9.352 l12.413-54.073c2.205-9.665,9.174-17.23,18.087-20.459c5.099,4.378,10.01,8.944,14.743,13.699 c17.784,17.868,32.956,38.358,44.868,60.834c5.527,10.407,10.344,21.243,14.399,32.433c1.39,3.803,2.675,7.649,3.887,11.536 c0.387,1.275,0.773,2.55,1.149,3.835c1.118,3.803,2.142,7.649,3.072,11.525c0.313,1.285,0.616,2.56,0.899,3.845 c0.867,3.814,1.641,7.649,2.32,11.525c0.219,1.191,0.418,2.382,0.616,3.584v0.031c0.564,3.396,1.045,6.834,1.463,10.282 C510.339,226.607,510.537,228.383,510.715,230.16z"/> <path style="fill:#34ABE0;" d="M437.447,75.41c17.784,17.868,32.956,38.358,44.868,60.834h-66.497c-3.991,0-6.949-3.709-6.06-7.596 l9.874-43.029c1.379-6.008,6.646-10.209,12.821-10.209C432.452,75.41,437.447,75.41,437.447,75.41z"/> <path style="fill:#494B5B;" d="M512,256v0.554h-52.161c-14.367,0-26.018-6.802-26.018-15.193v-3.459h77.541 C511.791,243.879,512,249.918,512,256z"/> <path style="fill:#D6C8B0;" d="M369.052,226.847c-1.708-3.966-3.239-8.027-4.587-12.171c-0.024,0.006-0.047,0.006-0.071,0.018 v-41.827c0-5.693,1.46-11.196,4.138-16.031c0,0-9.417,57.698,97.574,57.698C534.833,214.534,443.306,221.711,369.052,226.847z"/> <path style="fill:#EDBB4C;" d="M421.299,182.905c0,4.474-1.442,8.625-3.884,11.988c-3.718,5.119-9.748,8.447-16.551,8.447 c-11.284,0-20.429-9.15-20.429-20.435c0-6.803,3.328-12.833,8.441-16.551c3.363-2.441,7.508-3.884,11.988-3.884 C412.149,162.471,421.299,171.621,421.299,182.905z"/> <path style="fill:#FFD15C;" d="M421.299,182.905c0,4.474-1.442,8.625-3.884,11.988c-3.363,2.441-7.508,3.884-11.988,3.884 c-11.29,0-20.435-9.145-20.435-20.429c0-4.48,1.442-8.625,3.884-11.993c3.363-2.441,7.508-3.884,11.988-3.884 C412.149,162.471,421.299,171.621,421.299,182.905z"/> <g> <circle style="fill:#FFDC8D;" cx="411.353" cy="179.543" r="4.951"/> <circle style="fill:#FFDC8D;" cx="405.585" cy="170.233" r="3.474"/> </g> <g> <path style="fill:#5C5E70;" d="M500.6,180.214h-60.656c-3.176,0-5.757-2.581-5.757-5.768c0-1.588,0.648-3.03,1.682-4.075 c1.045-1.045,2.487-1.693,4.075-1.693h56.769C498.103,172.482,499.388,176.327,500.6,180.214z"/> <path style="fill:#5C5E70;" d="M504.822,195.573h-64.877c-3.176,0-5.757-2.57-5.757-5.757c0-1.599,0.648-3.041,1.682-4.075 c1.045-1.045,2.487-1.693,4.075-1.693h61.805C502.868,187.852,503.892,191.697,504.822,195.573z"/> <path style="fill:#5C5E70;" d="M508.04,210.944h-68.096c-3.176,0-5.757-2.581-5.757-5.757c0-1.588,0.648-3.03,1.682-4.075 c1.045-1.045,2.487-1.693,4.075-1.693h65.776C506.587,203.233,507.361,207.067,508.04,210.944z"/> </g> <path style="fill:#F9EED7;" d="M510.715,230.16c0.251,2.57,0.47,5.151,0.648,7.743h-143.37c-5.068,0-9.383-3.229-11.003-7.743 c-0.439-1.233-0.69-2.56-0.69-3.939c0-3.229,1.306-6.144,3.427-8.265c1.337-1.348,2.999-2.361,4.859-2.926 c1.076-0.324,2.226-0.502,3.406-0.502h140.663v0.031c0.564,3.396,1.045,6.834,1.463,10.282 C510.339,226.607,510.537,228.383,510.715,230.16z"/> <path style="fill:#E8DBC4;" d="M510.715,230.16c0.251,2.57,0.47,5.151,0.648,7.743h-143.37c-5.068,0-9.383-3.229-11.003-7.743 H510.715z"/> <g> <path style="fill:#FCF8F2;" d="M510.119,224.84h-1.034c-2.842,0-5.151-2.309-5.151-5.151c0-1.421,0.575-2.717,1.505-3.647 c0.846-0.836,1.964-1.379,3.218-1.484C509.221,217.955,509.701,221.393,510.119,224.84z"/> <path style="fill:#FCF8F2;" d="M492.873,224.838h-23.006c-2.845,0-5.151-2.306-5.151-5.151l0,0c0-2.845,2.306-5.151,5.151-5.151 h23.006c2.845,0,5.151,2.306,5.151,5.151l0,0C498.025,222.531,495.719,224.838,492.873,224.838z"/> </g> <path style="fill:#279FC9;" d="M479.109,136.243h-63.295c-3.99,0-6.945-3.706-6.053-7.595l9.871-43.027 c1.377-6.011,6.644-10.214,12.816-10.214C432.447,75.406,421.772,128.623,479.109,136.243z"/> <path style="fill:#494B5B;" d="M235.49,468.049v43.133c-23.312-1.839-45.745-6.813-66.873-14.493v-28.64H235.49z"/> <path style="fill:#4BC999;" d="M502.857,324.043c-1.891,6.896-4.075,13.678-6.52,20.323c-2.1,5.705-4.399,11.327-6.886,16.833 c-1.661,3.688-3.417,7.335-5.245,10.93v0.01c-4.232,8.286-8.892,16.311-13.97,24.043c-1.985,3.03-4.033,6.019-6.144,8.955 c-5.831,8.129-12.142,15.914-18.871,23.291c-3.584,3.929-7.293,7.753-11.118,11.452c-1.787,1.735-3.594,3.438-5.423,5.099 c-5.622,5.151-11.473,10.041-17.533,14.67c-3.427,2.612-6.928,5.141-10.491,7.575c-5.684,3.908-11.525,7.586-17.533,11.024H166.59 c-1.923-3.615-3.751-7.283-5.475-11.024c-0.711-1.557-1.411-3.135-2.09-4.712c-0.47-1.087-0.93-2.173-1.369-3.271 c-0.021-0.042-0.042-0.094-0.052-0.136c-0.418-1.003-0.815-1.996-1.212-3.009c-0.042-0.094-0.073-0.199-0.115-0.303 c-0.408-1.034-0.794-2.079-1.181-3.124c-0.115-0.303-0.23-0.596-0.334-0.899c-0.334-0.93-0.669-1.86-0.993-2.8 c-0.387-1.087-0.752-2.173-1.108-3.271c-0.052-0.167-0.115-0.345-0.167-0.512c-0.042,0.01-0.073,0.01-0.105,0.021v-59.538 c0-8.108,2.079-15.945,5.893-22.82c3.469-6.29,8.37-11.797,14.44-15.997l19.257-13.322l17.659-76.977 c4.242-18.474,20.668-31.566,39.622-31.566H447.76c18.944,0,35.38,13.092,39.622,31.566L502.857,324.043z"/> <path style="fill:#34ABE0;" d="M471.444,333.529H225.59c-5.68,0-9.888-5.276-8.616-10.813l14.053-61.251 c1.96-8.558,9.458-14.541,18.243-14.541h198.487c8.785,0,16.283,5.983,18.251,14.541l14.044,61.251 C481.323,328.253,477.124,333.529,471.444,333.529z"/> <path style="fill:#494B5B;" d="M383.123,478.247c-20.574,11.797-42.945,20.814-66.601,26.551h-28.254 c-20.459,0-37.041-9.686-37.041-21.64v-4.911H383.123z"/> <path style="fill:#41B787;" d="M159.021,462.51c-2.431-5.647-4.611-11.427-6.53-17.325c-0.033,0.008-0.067,0.008-0.101,0.025 v-59.543c0-8.103,2.078-15.938,5.89-22.82c0,0-13.405,82.137,138.903,82.137C395.021,444.982,264.727,455.198,159.021,462.51z"/> <g> <path style="fill:#EDBB4C;" d="M483.798,372.265c0.136-0.052,0.272-0.094,0.408-0.136v0.01c-4.232,8.286-8.892,16.311-13.97,24.043 c-1.985,3.03-4.033,6.019-6.144,8.955c-0.313-1.682-0.47-3.417-0.47-5.183c0-9.676,4.723-18.254,11.995-23.541 c0.261-0.199,0.543-0.387,0.815-0.575c0.815-0.554,1.661-1.055,2.529-1.526c0.376-0.199,0.752-0.397,1.139-0.575 c0.345-0.167,0.69-0.334,1.045-0.481c0.596-0.261,1.202-0.502,1.829-0.711C483.245,372.442,483.516,372.349,483.798,372.265z"/> <path style="fill:#EDBB4C;" d="M233.4,399.955c0,6.37-2.053,12.277-5.529,17.065c-5.292,7.287-13.876,12.025-23.561,12.025 c-16.064,0-29.081-13.026-29.081-29.09c0-9.685,4.738-18.269,12.016-23.561c4.788-3.475,10.687-5.529,17.065-5.529 C220.373,370.865,233.4,383.892,233.4,399.955z"/> </g> <path style="fill:#FFD15C;" d="M233.4,399.955c0,6.37-2.053,12.277-5.529,17.065c-4.788,3.475-10.687,5.529-17.065,5.529 c-16.073,0-29.09-13.017-29.09-29.081c0-6.378,2.053-12.277,5.529-17.074c4.788-3.475,10.687-5.529,17.065-5.529 C220.373,370.865,233.4,383.892,233.4,399.955z"/> <g> <circle style="fill:#FFDC8D;" cx="219.239" cy="395.167" r="7.048"/> <circle style="fill:#FFDC8D;" cx="211.037" cy="381.918" r="4.945"/> </g> <path style="fill:#FFD15C;" d="M483.798,372.265c0.136-0.052,0.272-0.094,0.408-0.125c-4.232,8.286-8.892,16.311-13.97,24.043 c-0.084-0.899-0.125-1.797-0.125-2.717c0-6.363,2.048-12.257,5.507-17.053c0.01-0.01,0.021-0.01,0.021-0.021 c0.261-0.188,0.533-0.376,0.794-0.554c0.815-0.554,1.661-1.055,2.529-1.526c0.376-0.199,0.752-0.397,1.139-0.575 c0.345-0.167,0.69-0.334,1.045-0.481c0.596-0.261,1.202-0.502,1.829-0.711C483.245,372.442,483.516,372.349,483.798,372.265z"/> <g> <path style="fill:#5C5E70;" d="M439.487,396.118H257.54c-3.202,0-5.796-2.596-5.796-5.796v-4.817c0-3.202,2.596-5.796,5.796-5.796 h181.947c3.202,0,5.796,2.596,5.796,5.796v4.817C445.283,393.523,442.687,396.118,439.487,396.118z"/> <path style="fill:#5C5E70;" d="M439.487,417.996H257.54c-3.202,0-5.796-2.596-5.796-5.796v-4.817c0-3.202,2.596-5.796,5.796-5.796 h181.947c3.202,0,5.796,2.596,5.796,5.796v4.817C445.283,415.401,442.687,417.996,439.487,417.996z"/> <path style="fill:#5C5E70;" d="M445.221,428.428c-3.584,3.929-7.293,7.753-11.118,11.452H257.538c-3.197,0-5.799-2.602-5.799-5.799 v-4.817c0-3.197,2.602-5.799,5.799-5.799h181.947C442.41,423.465,444.824,425.628,445.221,428.428z"/> </g> <path style="fill:#F9EED7;" d="M428.68,444.979c-5.622,5.151-11.473,10.041-17.533,14.67c-3.427,2.612-6.928,5.141-10.491,7.575 c-5.684,3.908-11.525,7.586-17.533,11.024H157.51c-7.21,0-13.354-4.598-15.652-11.024c-0.637-1.755-0.982-3.647-0.982-5.611 c0-4.587,1.86-8.746,4.869-11.766c1.902-1.902,4.274-3.354,6.917-4.148c1.536-0.47,3.166-0.721,4.848-0.721H428.68z"/> <path style="fill:#78CAEF;" d="M460.623,292.824c1.928,6.158-5.194,11.153-10.328,7.244l-18.998-14.468l-19.931-15.178 c-5.042-3.839-2.326-11.886,4.01-11.886h29.646c2.894,0,5.452,1.88,6.317,4.641L460.623,292.824z"/> <path style="fill:#5BD3A2;" d="M496.337,344.366c-2.1,5.705-4.399,11.327-6.886,16.833H384.753c-3.281,0-5.945-2.664-5.945-5.945 v-4.942c0-3.281,2.664-5.945,5.945-5.945H496.337z"/> <path style="fill:#E8DBC4;" d="M400.656,467.224c-5.684,3.908-11.525,7.586-17.533,11.024H157.51 c-7.21,0-13.354-4.598-15.652-11.024H400.656z"/> <g> <path style="fill:#FCF8F2;" d="M428.68,444.979c-5.622,5.151-11.473,10.041-17.533,14.67h-54.93c-2.863,0-5.183-2.32-5.183-5.183 v-4.305c0-2.863,2.32-5.183,5.183-5.183L428.68,444.979L428.68,444.979z"/> <path style="fill:#FCF8F2;" d="M337.441,459.649h-37.057c-2.861,0-5.181-2.32-5.181-5.181v-4.305c0-2.861,2.32-5.181,5.181-5.181 h37.057c2.861,0,5.181,2.32,5.181,5.181v4.305C342.622,457.33,340.303,459.649,337.441,459.649z"/> </g> <path style="fill:#279FC9;" d="M315.695,333.529H225.59c-5.68,0-9.888-5.276-8.616-10.813l14.053-61.251 c1.96-8.558,9.458-14.541,18.243-14.541C249.269,246.924,234.072,322.683,315.695,333.529z"/> <path style="fill:#FCF8F2;" d="M330.189,10.92v87.583h-27.167V4.306C312.259,6.031,321.328,8.235,330.189,10.92z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Primary Use',
                    errorText: 'Primary Use Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'vehicleUseCd',
                    displayValue: null,
                    width: '45',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                    options: ['Pleasure', 'Business', 'Work', 'Farm'],
                  },
                  {
                    isInput: false,
                    isSelect: true,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    isClient: true,
                    hasSuffix: false,
                    hasPrefix: false,
                    placeholderText: 'Purchased New Or Used',
                    errorText: 'New Or Used Is Required',
                    isRequired: true,
                    propertyValue: null,
                    propertyKey: 'purchaseType',
                    displayValue: null,
                    width: '45',
                    position: 1,
                    hasCustomHtml: false,
                    isConditional: false,
                    companyAnswerId: companyId,
                    options: ['New', 'Used'],
                  },
                ],
              },
              {
                headerText: 'What level of coverage are you looking for?',
                subHeaderText:
                  'This helps us calculate the coverage that you need for your vehicle',
                companyQuestionId: companyId,
                position: 2,
                isClient: true,
                errorText: 'Coverage Level Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve"> <path style="fill:#EFF2FA;" d="M256.005,511.965c264.786-114.743,255.96-458.972,255.96-458.972 C353.09,44.166,256.005,0.034,256,0.034c-0.006,0-97.09,44.132-255.965,52.958c0,0-8.826,344.229,255.96,458.972"/> <path style="fill:#D7DEED;" d="M255.966,0.05C255.226,0.383,158.307,44.2,0.034,52.993c0,0-8.825,344.205,255.931,458.959V0.05z"/> <path style="fill:${brandColor}" d="M256,38.129c30.758,11.744,108.583,37.599,219.602,47.611 c-5.411,81.695-37.114,298.42-219.612,387.379C164.087,428.431,99.22,347.052,63.058,230.985 C44.806,172.405,38.527,118.339,36.391,85.74C147.41,75.728,225.241,49.873,256,38.129"/> <path style="fill:#FFFFFF;" d="M217.039,347.159l-82.177-82.177c-3.447-3.447-3.447-9.036,0-12.483l12.479-12.479 c3.447-3.447,9.036-3.447,12.483,0l69.698,69.698l148.601-148.601c3.447-3.447,9.036-3.447,12.483,0l12.479,12.479 c3.447,3.447,3.447,9.036,0,12.483l-161.082,161.08C235.11,354.052,223.932,354.052,217.039,347.159z"/> <path style="fill:${brandColor}" d="M256,56.974c31.721,11.606,102.639,34.047,200.604,44.623 c-3.857,40.283-14.012,104.179-40.698,168.328c-35.296,84.84-89.076,146.511-159.926,183.432 c-83.252-43.244-142.467-119.777-176.067-227.623C65.207,178.538,58.44,134.375,55.364,101.6 C153.358,91.025,224.275,68.58,256,56.974 M256,38.129C225.241,49.873,147.41,75.728,36.391,85.74 c2.136,32.599,8.415,86.664,26.667,145.245C99.22,347.052,164.087,428.431,255.991,473.119 C438.489,384.16,470.192,167.435,475.602,85.74C364.583,75.728,286.757,49.873,256,38.129L256,38.129z"/> <g> </g> </svg>`,
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '1',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText: 'Liability coverage only',
                    displayValue: 'Lowest',
                    width: '23',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '2',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText:
                      'Liability and some comprehensive coverage',
                    displayValue: 'Good',
                    width: '23',
                    position: 1,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '3',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText:
                      'Liability, comphrehensive and the minimum limit full coverage',
                    displayValue: 'Better',
                    width: '23',
                    position: 2,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: true,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    propertyValue: '4',
                    propertyKey: 'coverageLevel',
                    hasInformationIcon: true,
                    informationIconText:
                      'Liability, comprehensive, and the maximum limit full coverage',
                    displayValue: 'Best',
                    width: '23',
                    position: 3,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
              {
                headerText: 'Add a vehicle',
                subHeaderText: 'You can also select and edit a vehicle',
                companyQuestionId: companyId,
                position: 3,
                errorText: 'Question Is Required',
                isRequired: true,
                hasCustomHtml: false,
                image:
                  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path style="fill:#485360;" d="M73.675,120.982c-1.5,0-3.019-0.339-4.42-1.052l-38.404-19.586 c-4.342-2.215-5.879-7.196-3.434-11.129c2.445-3.93,7.948-5.325,12.289-3.109l38.404,19.586c4.342,2.215,5.88,7.196,3.434,11.129 C79.887,119.484,76.827,120.982,73.675,120.982z"/> <path style="fill:#485360;" d="M35.288,243.678c-3.154,0-6.214-1.498-7.871-4.161c-2.446-3.932-0.909-8.914,3.434-11.129 l38.404-19.586c4.342-2.214,9.845-0.821,12.289,3.109c2.447,3.932,0.909,8.914-3.434,11.129l-38.404,19.586 C38.307,243.339,36.788,243.678,35.288,243.678z"/> <path style="fill:#485360;" d="M437.568,120.982c-3.206,0-6.319-1.498-8.004-4.161c-2.487-3.932-0.924-8.914,3.492-11.129 l39.051-19.586c4.415-2.214,10.009-0.821,12.496,3.109c2.487,3.932,0.924,8.914-3.492,11.129l-39.05,19.586 C440.638,120.644,439.092,120.982,437.568,120.982z"/> <path style="fill:#485360;" d="M476.602,243.678c-1.525,0-3.071-0.339-4.494-1.052l-39.051-19.586 c-4.416-2.215-5.98-7.196-3.492-11.129c2.486-3.93,8.081-5.325,12.497-3.109l39.05,19.586c4.416,2.215,5.98,7.196,3.492,11.129 C482.919,242.18,479.806,243.678,476.602,243.678z"/> </g> <path style="fill:#F44321;" d="M350.174,222.372H85.525c-7.219,0-13.072-5.851-13.072-13.072v-89.866 c0-7.219,5.853-13.072,13.072-13.072h340.408c7.219,0,13.072,5.853,13.072,13.072V209.3c0,7.221-5.853,13.072-13.072,13.072h-48.526 "/> <path style="fill:#C6281C;" d="M117.343,209.3v-89.866c0-7.219,5.853-13.072,13.072-13.072h-44.89 c-7.219,0-13.072,5.853-13.072,13.072V209.3c0,7.221,5.853,13.072,13.072,13.072h44.89 C123.196,222.372,117.343,216.522,117.343,209.3z"/> <g> <path style="fill:#BAB0A8;" d="M15.568,364.807h18.943c1.485,0,2.891,0.328,4.161,0.902V78.496c0-1.111-0.148-2.187-0.4-3.221 c-3.487,3.192-8.117,5.155-13.217,5.155s-9.73-1.964-13.217-5.155c-0.253,1.034-0.4,2.111-0.4,3.221v287.198 C12.701,365.128,14.095,364.807,15.568,364.807z"/> <path style="fill:#BAB0A8;" d="M477.491,364.807h18.943c1.473,0,2.867,0.321,4.13,0.887V78.496c0-1.111-0.148-2.187-0.4-3.221 c-3.487,3.192-8.117,5.155-13.217,5.155c-5.1,0-9.73-1.964-13.217-5.155c-0.252,1.034-0.4,2.111-0.4,3.221v287.212 C474.601,365.134,476.006,364.807,477.491,364.807z"/> </g> <path style="fill:#485360;" d="M506.553,466.113c0,5.587-4.53,10.119-10.119,10.119h-18.943c-5.588,0-10.12-4.532-10.12-10.119 v-93.366c0-5.59,4.532-10.119,10.12-10.119h18.943c5.59,0,10.119,4.53,10.119,10.119V466.113z"/> <g> <path style="fill:#FFFFFF;" d="M134.823,191.509v-54.436h36.956v11.041h-24.381v11.73h20.087v10.198h-20.087v21.468 L134.823,191.509L134.823,191.509z"/> <path style="fill:#FFFFFF;" d="M178.447,191.509v-54.436h12.572v54.436H178.447z"/> <path style="fill:#FFFFFF;" d="M214.02,160.381v31.127h-12.572v-54.436h9.813l25.379,31.973v-31.973h12.572v54.436h-10.119 L214.02,160.381z"/> <path style="fill:#FFFFFF;" d="M259.64,191.509v-54.436h12.572v54.436H259.64z"/> <path style="fill:#FFFFFF;" d="M315.298,153.019c-0.154-0.203-0.69-0.587-1.608-1.149c-0.922-0.562-2.07-1.151-3.451-1.764 c-1.379-0.613-2.887-1.151-4.523-1.611c-1.636-0.46-3.272-0.69-4.906-0.69c-4.498,0-6.746,1.509-6.746,4.523 c0,0.919,0.243,1.687,0.728,2.3c0.485,0.613,1.199,1.163,2.147,1.649c0.944,0.485,2.134,0.932,3.565,1.341 c1.43,0.411,3.092,0.87,4.983,1.38c2.607,0.717,4.958,1.496,7.054,2.338c2.096,0.843,3.873,1.891,5.33,3.143 c1.455,1.253,2.579,2.775,3.373,4.563c0.792,1.79,1.19,3.936,1.19,6.438c0,3.068-0.576,5.661-1.726,7.783 c-1.151,2.121-2.672,3.835-4.562,5.136c-1.89,1.304-4.062,2.251-6.517,2.838c-2.453,0.587-4.983,0.881-7.592,0.881 c-1.991,0-4.038-0.154-6.132-0.46c-2.098-0.306-4.141-0.754-6.134-1.343c-1.993-0.587-3.924-1.29-5.79-2.109 c-1.866-0.817-3.592-1.764-5.174-2.836l5.518-10.961c0.206,0.255,0.871,0.741,1.995,1.458c1.123,0.715,2.518,1.43,4.178,2.147 c1.662,0.715,3.516,1.353,5.561,1.915c2.043,0.564,4.112,0.844,6.21,0.844c4.447,0,6.67-1.353,6.67-4.063 c0-1.022-0.334-1.866-0.998-2.529s-1.585-1.266-2.759-1.802c-1.176-0.536-2.568-1.034-4.179-1.496 c-1.61-0.46-3.362-0.971-5.251-1.532c-2.507-0.768-4.679-1.598-6.517-2.491c-1.84-0.893-3.362-1.929-4.562-3.107 c-1.203-1.174-2.098-2.53-2.685-4.063c-0.587-1.532-0.881-3.321-0.881-5.366c0-2.862,0.536-5.391,1.61-7.592 c1.072-2.196,2.529-4.049,4.371-5.558c1.839-1.507,3.973-2.645,6.402-3.413c2.426-0.766,4.994-1.149,7.704-1.149 c1.891,0,3.757,0.179,5.598,0.536c1.839,0.357,3.603,0.819,5.289,1.381c1.687,0.562,3.257,1.2,4.715,1.917 c1.458,0.715,2.796,1.43,4.025,2.147L315.298,153.019z"/> <path style="fill:#FFFFFF;" d="M376.635,137.072v54.437H364.06v-22.31h-21.698v22.31H329.79v-54.436h12.572v21.085h21.698v-21.085 L376.635,137.072L376.635,137.072z"/> </g> <g> <path style="fill:#FE9900;" d="M25.055,35.768C11.24,35.768,0,47.006,0,60.821c0,13.816,11.24,25.055,25.055,25.055 S50.11,74.638,50.11,60.821C50.11,47.006,38.871,35.768,25.055,35.768z"/> <path style="fill:#FE9900;" d="M486.947,35.768c-13.815,0-25.054,11.238-25.054,25.053c0,13.816,11.239,25.055,25.054,25.055 c13.815,0,25.053-11.239,25.053-25.055C512,47.006,500.762,35.768,486.947,35.768z"/> </g> <path style="fill:#485360;" d="M44.631,466.113c0,5.587-4.531,10.119-10.12,10.119H15.568c-5.588,0-10.121-4.532-10.121-10.119 v-93.366c0-5.59,4.533-10.119,10.121-10.119h18.943c5.59,0,10.12,4.53,10.12,10.119V466.113z"/> <path style="fill:#364351;" d="M484.671,466.113v-93.366c0-5.59,4.532-10.119,10.12-10.119h-17.3c-5.588,0-10.12,4.53-10.12,10.119 v93.366c0,5.587,4.532,10.119,10.12,10.119h17.3C489.203,476.232,484.671,471.7,484.671,466.113z"/> <g> <path style="fill:#EF7A06;" d="M17.301,60.821c0-10.777,6.839-19.983,16.405-23.513c-2.697-0.996-5.611-1.54-8.65-1.54 c-13.815,0-25.055,11.238-25.055,25.053c0,13.816,11.24,25.055,25.055,25.055c3.038,0,5.953-0.545,8.65-1.54 C24.14,80.807,17.301,71.598,17.301,60.821z"/> <path style="fill:#EF7A06;" d="M479.193,60.821c0-10.777,6.839-19.983,16.405-23.513c-2.697-0.996-5.611-1.54-8.65-1.54 c-13.815,0-25.054,11.238-25.054,25.053c0,13.816,11.239,25.055,25.054,25.055c3.038,0,5.953-0.545,8.65-1.54 C486.032,80.807,479.193,71.598,479.193,60.821z"/> </g> <path style="fill:#364351;" d="M22.748,466.113v-93.366c0-5.59,4.531-10.119,10.12-10.119h-17.3c-5.588,0-10.121,4.53-10.121,10.119 v93.366c0,5.587,4.533,10.119,10.121,10.119h17.3C27.279,476.232,22.748,471.7,22.748,466.113z"/> <g> </g> </svg>',
                answers: [
                  {
                    isInput: false,
                    isSelect: false,
                    isNativeSelect: false,
                    isDatePicker: false,
                    isMobileDatePicker: false,
                    isButton: false,
                    isTextarea: false,
                    hasSuffix: false,
                    hasPrefix: false,
                    isAddVehicle: true,
                    width: '60',
                    placeholder: 'Select a vehicle',
                    displayValue: 'Add Vehicle',
                    position: 0,
                    hasCustomHtml: false,
                    companyAnswerId: companyId,
                  },
                ],
              },
            ],
          },
        ],
      };

      const newForm = await this.formsRepository.save(
        this.formsRepository.create(autoForm)
      );

      await this.formTemplateHelper.updateAllAnswers(company.id);

      const discounts = [
        {
          title: 'Home Bundle - Click Link To Add Home Info',
          moreInformation:
            'If you are insuring your car and home, you can recieve a bundle discount on insuring both with one of our companies',
          discount: null,
          hasExternalUrl: true,
          externalUrl: `https://app.xilo.io/client-app/home/start?companyId=${company.companyId}`,
          mobileUrl: `https://app.xilo.io/client-app/home/mobile?companyId=${company.companyId}`,
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Renters Bundle',
          moreInformation:
            'If you are getting renters insurance and insuring your car, you can recieve a bundle discount on insuring both with one of our companies',
          discount: null,
          propertyKey: 'hasRentersBundle',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Pay In Full Discount',
          moreInformation:
            'If you pay your premium in full, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasPayInFullDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Auto Pay Discount',
          moreInformation:
            'If you setup autopay with your bank account, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasAutoPayDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Defensive Driver Discount',
          moreInformation:
            'If you have taken a defensive driving course, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasDefensiveDriverDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
        {
          title: 'Good Student Discount',
          moreInformation:
            'If you are a full-time student and have a 3.0 or above, you may be able to get a discount from one of our companies',
          discount: null,
          propertyKey: 'hasGoodStudentDiscount',
          formDiscountId: newForm.id,
          companyDiscountId: company.id,
        },
      ];

      //   const newDiscounts = await model.Discount.bulkCreate(discounts); TODO discount entity deleted

      const delData = await this.formsRepository.delete(oldAutoForm);
      if (!delData) {
        throw new HttpException(
          'old form delete error',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'CSE CA Form Created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createCommercialTruckingForm() {
    try {
      const request = await this.formTemplateHelper.createCommercialTruckingForm();

      if (!request.status) {
        throw new HttpException(
          'Error creating new Commercial Trucking Form',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New Trucking Form Created Successfully',
        form: request.form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createSimpleCommercialTruckingForm() {
    try {
      const request = await this.formTemplateHelper.createSimpleCommercialTruckingForm();
      if (!request.status) {
        throw new HttpException(
          'Error creating new Commercial Trucking Form',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New Trucking Form Created Successfully',
        form: request.form,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createEZLynxAutoForm() {
    try {
      const request = await this.formTemplateHelper.createEZLynxAutoForm();

      if (!request.status) {
        throw new HttpException(
          'Error creating new EZLynx auto form',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New EZLynx Auto Form Created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createEZLynxHomeForm() {
    try {
      const request = await this.formTemplateHelper.createEZLynxHomeForm();

      if (!request.status) {
        throw new HttpException(
          'Error creating new EZLynx Home form',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New EZLynx Home Form Created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createV2AutoHomeForm() {
    try {
      const companyId = this.request.body.decodedUser.user.companyUserId;

      const company = await this.companiesRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException(
          'Error creating simple form. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New V2 Auto-Home Form Created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createV2SimpleAutoHomeForm() {
    try {
      const companyId = this.request.body.decodedUser.user.companyUserId;

      const company = await this.companiesRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException(
          'Error creating simple form. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Simple Auto-Home Created',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createEZLynxSimpleAutoForm() {
    try {
      const request = await this.formTemplateHelper.createEZLynxSimpleAutoForm();

      if (!request.status) {
        throw new HttpException(
          'Error creating simple auto form',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Simple Auto Created',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createEZLynxSimpleHomeForm() {
    try {
      const request = await this.formTemplateHelper.createEZLynxSimpleHomeForm();

      if (!request.status) {
        throw new HttpException(
          'Error creating simple home form',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Simple Home Created',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async duplicateForm() {
    try {
      const decoded = this.request.body.decodedUser;
      const { forms } = this.request.body;
      const newFormList = [];
      await Promise.all(
        await forms.map(async (formId) => {
          const form = await this.getFormById(formId);
          const newFormObj = await this.formTemplateHelper.getDuplicateFormObject(
            form.dataValues,
            decoded.companyId
          );
          await newFormList.push(newFormObj);
        })
      );

      const formsData = await this.formsRepository.save(
        this.formsRepository.create(newFormList)
      );
      return formsData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async listDefaultForms() {
    try {
      const company = await this.companiesRepository.findOne({
        where: { id: XILO_COMPANY_ID },
      });

      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }

      const forms = await this.formsRepository.find({
        where: {
          companyFormId: company.id,
        },
      });

      if (!forms) {
        throw new HttpException('No form found', HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'Forms retrieved successfully',
        obj: forms,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getFormById(formId: number) {
    try {
      const oneForm = await this.formsRepository
        .createQueryBuilder('form')
        .where({ id: formId })
        .leftJoinAndSelect('form.pages', 'pages')
        .leftJoinAndSelect('pages.conditions', 'conditions')
        .leftJoinAndSelect('pages.questions', 'questions')
        .leftJoinAndSelect('questions.conditions', 'conditions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('answers.question', 'question')
        .leftJoinAndSelect('answers.answerConditions', 'answerConditions')
        .orderBy('pages.position', 'ASC')
        .addOrderBy('questions.position', 'ASC')
        .addOrderBy('answers.position', 'ASC')
        .getOne();
      return oneForm;
    } catch (error) {
      return error;
    }
  }
}
