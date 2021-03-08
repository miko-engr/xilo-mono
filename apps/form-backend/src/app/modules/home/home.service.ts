import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import cleaner from 'clean-deep';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Homes } from './homes.entity';
import { CreateHomeDto } from './dto/create-home.dto';
@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Homes)
    private homesRepository: Repository<Homes>
  ) {}
  async create(bodyObj: CreateHomeDto) {
    try {
      const home = await this.homesRepository.save(bodyObj);
      if (!home) {
        throw new HttpException('Error creating home', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Home created successfully',
        obj: home,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async upsert(bodyObj: CreateHomeDto) {
    try {
      const home = cleaner(bodyObj);

      const newHome = await this.homesRepository.save(home);
      if (!newHome) {
        throw new HttpException('Error creating home', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Home upserted successfully',
        id: newHome.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, bodyObj: CreateHomeDto) {
    try {
      const homeClient = await this.homesRepository.findOne({
        where: { id: id },
      });
      if (!homeClient) {
        throw new HttpException(
          'Error finding home client',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedData = await this.homesRepository.save({
        ...homeClient,
        ...bodyObj,
      });
      if (!updatedData) {
        throw new HttpException(
          'Error updating home client',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Home client updated successfully',
        obj: updatedData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async delete(id: number) {
    try {
      const home = await this.homesRepository.findOne({
        where: { id: id },
      });

      if (!home) {
        throw new HttpException(
          'Error deleting home. No home found',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedHome = await this.homesRepository.delete(home);
      if (deletedHome.affected === 0) {
        throw new HttpException('Error deleting home.', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Home deleted successfuly',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
