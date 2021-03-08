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
import { AppImages } from './app-images.entity';
import { CreateAppImageDto } from './dto/create-app-image.dto';
@Injectable({ scope: Scope.REQUEST })
export class AppImageService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(AppImages)
    private appImagesRepository: Repository<AppImages>
  ) {}
  async create(appImageBody: CreateAppImageDto) {
    try {
      const appImage = await this.appImagesRepository.save(appImageBody);
      if (!appImage) {
        throw new HttpException(
          'Error creating app Image',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'App Image created successfully',
        obj: appImage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async bulkCreate() {
    try {
      const images = this.request.body;
      const appImages = await this.appImagesRepository.save(images);
      if (!appImages) {
        throw new HttpException(
          'Error creating app Images',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'App Images created successfully',
        obj: appImages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteAppImage(id: number) {
    try {
      const appImage = await this.appImagesRepository.findOne({
        where: { id: id },
      });
      if (!appImage) {
        throw new HttpException('No app Image found', HttpStatus.BAD_REQUEST);
      }
      const deletedAppImage = await this.appImagesRepository.delete(appImage);
      if (deletedAppImage.affected === 0) {
        throw new HttpException(
          'There was an error removing app Image',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'App Image removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async list() {
    try {
      const appImages = await this.appImagesRepository.find();
      if (!appImages) {
        throw new HttpException('No app Images found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'App Images retrieved successfully',
        obj: appImages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const appImage = await this.appImagesRepository.findOne({
        where: { id: id },
      });
      if (!appImage) {
        throw new HttpException('No app Image found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'AppI mage retrieved successfully',
        obj: appImage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, appImageBody: CreateAppImageDto) {
    try {
      const appImage = await this.appImagesRepository.findOne({
        where: { id: id },
      });
      if (!appImage) {
        throw new HttpException('No app Image found', HttpStatus.BAD_REQUEST);
      }
      const updatedAppImage = await this.appImagesRepository.save({
        ...appImage,
        ...appImageBody,
      });
      if (!updatedAppImage) {
        throw new HttpException(
          'Error updating App Image',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'App Image updated successfully',
        obj: updatedAppImage,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
