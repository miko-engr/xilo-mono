import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { TemplateDto } from './dto/template.dto'
import { Templates } from './template.entity'
@Injectable({ scope: Scope.REQUEST })
export class TemplateService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Templates)
    private templateRepository: Repository<Templates>,
  ) {}

  async create(bodyObj: TemplateDto) {
    try {
      const { decodedUser: { user: { companyUserId } } } = this.request.body
      const params = bodyObj
      params.companyTemplateId = companyUserId
      const newTemplate = await this.templateRepository.save(bodyObj)
      if (!newTemplate) throw new HttpException('Error creating template', HttpStatus.BAD_GATEWAY)

      return newTemplate
    } catch (error) {
      throw new HttpException('Error creating template', HttpStatus.BAD_GATEWAY)
    }
  }
  
  async update(id: number, bodyObj: TemplateDto) {
    try {
      const { decodedUser: { user: { companyUserId } } } = this.request.body
      const template = await this.templateRepository.findOne({
        where: {
          id: id,
          companyTemplateId: companyUserId
        }
      });
      const updatedTemplate = await this.templateRepository.update(id, {
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        title: bodyObj.title || template.title,
        body: bodyObj.body || template.body,
        isEmail: bodyObj.isEmail !== undefined ? bodyObj.isEmail : template.isEmail,
        isText: bodyObj.isText !== undefined ? bodyObj.isText : template.isText,
        subject: bodyObj.subject || template.subject,
        type: bodyObj.type || template.type,
        description: bodyObj.description || template.description,
        priority: bodyObj.priority || template.priority,
      })
      if (!updatedTemplate) throw new HttpException('Error updating template', HttpStatus.BAD_GATEWAY)

      return updatedTemplate
    } catch (error) {
      throw new HttpException('Error updating template', HttpStatus.BAD_GATEWAY)
    }
  }

  async delete(id: number) {
    try {
      const template = await this.templateRepository.findOne({
        where: { id: id }
      })
      if (!template) throw new HttpException('No template found with this ID!', HttpStatus.BAD_GATEWAY)

      const response = await this.templateRepository.delete(template)
      if (response.affected === 0) throw new HttpException('Error deleting template.', HttpStatus.BAD_GATEWAY)

      return {
        message: 'Template deleted successfully',
      }
    } catch (error) {
      throw new HttpException('Error deleting template', HttpStatus.BAD_GATEWAY)
    }
  }

  async listByCompany(type: string) {
    try {
      const { decodedUser: { user: { companyUserId } } } = this.request.body
      const allTemplates = await this.templateRepository.find({
          where: {
            companyTemplateId: companyUserId,
            isEmail: type === 'email',
            isText: type === 'text',
            isTask: type === 'task'
          }
        })

      if (!allTemplates) throw new HttpException('Template not found!', HttpStatus.BAD_GATEWAY)

      return allTemplates
    } catch (error) {
      throw new HttpException('Error retrieving template!', HttpStatus.BAD_GATEWAY)
    }
  }

  async listOneById(id: number) {
    try {
      const { decodedUser: { user: { companyUserId } } } = this.request.body
      const oneTemplate = await this.templateRepository.findOne({
        where: {
          id: id,
          companyTemplateId: companyUserId,
        }
      })
      if (!oneTemplate) throw new HttpException('Template not found!', HttpStatus.BAD_GATEWAY)

      return oneTemplate
    } catch (error) {
      throw new HttpException('Error retrieving template!', HttpStatus.BAD_GATEWAY)
    }
  }

  async listByCompanyAllTemplate() {
    try {
      const { decodedUser: { user: { companyUserId } } } = this.request.body
      const allTemplates = await this.templateRepository.find({
        where: {
          companyTemplateId: companyUserId,
          isEmail: true,
          isText: true,
          isTask: true
        }
      })
      if (!allTemplates) throw new HttpException('Template not found!', HttpStatus.BAD_GATEWAY)

      return allTemplates
    } catch (error) {
      throw new HttpException('Error retrieving template!', HttpStatus.BAD_GATEWAY)
    }
  }
}
