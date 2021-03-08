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
import { Pages } from './page.entity';
import { PageDto } from './dto/page.dto';
import { Page } from './interface/page.interface';

@Injectable({ scope: Scope.REQUEST })
export class PageService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Pages)
    private pagesRepository: Repository<Pages>
  ) {}

  async listByCompanyFormUser(formId: number): Promise<Page[]> {
    try {
      const decoded = this.request.body.decodedUser;
      const pages = await this.pagesRepository.find({
        where: {
          companyPageId: decoded.user.companyUserId,
          formPageId: formId,
        },
      });
      if (!pages)
        throw new HttpException('No pages found', HttpStatus.BAD_REQUEST);
      return pages;
    } catch (error) {
      throw new HttpException(
        'There was an error finding pages',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async listTemplates(): Promise<Page[]> {
    try {
      const pages = await this.pagesRepository
        .createQueryBuilder('pages')
        .where({ isTemplate: true })
        .orderBy('pages.templateTitle', 'ASC')
        .innerJoinAndSelect('pages.questions', 'questions')
        .orderBy('questions.position', 'ASC')
        .leftJoinAndSelect('questions.answers', 'answers')
        .orderBy('answers.position', 'ASC')
        .getMany();

      if (!pages)
        throw new HttpException(
          'Error finding pages. No pages found',
          HttpStatus.BAD_REQUEST
        );
      return pages;
    } catch (error) {
      throw new HttpException(
        'Error finding pages',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async listOne(formId: number, pageId: number): Promise<Page> {
    try {
      const decoded = this.request.body.decodedUser;
      const page = await this.pagesRepository.findOne({
        where: {
          companyPageId: decoded.user.companyUserId,
          formPageId: formId,
          id: pageId,
        },
      });
      if (!page)
        throw new HttpException('No page found', HttpStatus.BAD_REQUEST);
      return page;
    } catch (error) {
      throw new HttpException(
        'There was an error finding page',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    formId: number,
    pageId: number,
    pageBody: PageDto
  ): Promise<Page> {
    try {
      const decoded = this.request.body.decodedUser;
      delete pageBody['decodedUser'];
      const page = await this.pagesRepository.findOne({
        where: {
          companyPageId: decoded.user.companyUserId,
          id: pageId,
          formPageId: formId,
        },
      });
      if (!page)
        throw new HttpException(
          'Error updating page. No page found',
          HttpStatus.BAD_REQUEST
        );

      const updatedPage: object = await this.pagesRepository.update(
        page.id,
        pageBody
      );
      return updatedPage;
    } catch (error) {
      throw new HttpException(
        'Error updating page',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(pageBody: PageDto): Promise<Page> {
    try {
      const page = await this.pagesRepository.save(pageBody);
      if (!page)
        throw new HttpException('Error creating page', HttpStatus.BAD_REQUEST);
      return page;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async duplicate(pageBody: PageDto): Promise<Page> {
    try {
      const page = this.pagesRepository.save(pageBody);
      if (!page)
        throw new HttpException('Error creating page', HttpStatus.BAD_REQUEST);
      return page;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(formId: number, pageId: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const page = await this.pagesRepository.findOne({
        where: {
          companyPageId: decoded.user.companyUserId,
          formPageId: formId,
          id: pageId,
        },
      });
      if (!page)
        throw new HttpException('No page found', HttpStatus.BAD_REQUEST);

      const deletedPage = await this.pagesRepository.delete(page);
      if (deletedPage.affected === 0)
        throw new HttpException(
          'There was an error removing page',
          HttpStatus.BAD_REQUEST
        );
      return {
        message: 'Page removed successfully',
      };
    } catch (error) {
      throw new HttpException(
        'There was an error finding page',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
