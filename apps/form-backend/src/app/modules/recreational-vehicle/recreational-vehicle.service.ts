import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RecreationalVehicles } from './recreational-vehicles.entity';
import { CreateRecreationalVehicleDto } from './dto/create-recreational-vehicles.dto';
@Injectable({ scope: Scope.REQUEST })
export class RecreationalVehicleService {
  constructor(
    @InjectRepository(RecreationalVehicles)
    private recreationalVehiclesRepository: Repository<RecreationalVehicles>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(bodyObj: CreateRecreationalVehicleDto) {
    try {
      const newRecreationalVehicle = await this.recreationalVehiclesRepository.save(
        bodyObj
      );
      if (!newRecreationalVehicle) {
        throw new HttpException(
          'Error creating recreationalVehicle',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'New recreationalVehicle created successfully',
        obj: newRecreationalVehicle.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async delete(id: number) {
    try {
      const recreationalVehicle = await this.recreationalVehiclesRepository.findOne(
        { where: { id: id } }
      );
      if (!recreationalVehicle) {
        throw new HttpException(
          'Error deleting recreational vehicle. No recreational vehicle found with this ID!',
          HttpStatus.BAD_REQUEST
        );
      }
      const response = await this.recreationalVehiclesRepository.delete(
        recreationalVehicle
      );
      if (response.affected === 0) {
        throw new HttpException(
          'Error deleting recreational vehicle',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Recreational Vehicle deleted successfully',
        obj: response,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const recreationalVehicle = await this.recreationalVehiclesRepository.findOne(
        {
          where: {
            companyRecreationalVehicleId: decoded.user.companyUserId,
          },
        }
      );

      if (!recreationalVehicle) {
        throw new HttpException(
          'Error finding recreational Vehicle. Recreational Vehicle not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Recreational Vehicle retrieved successfully',
        obj: recreationalVehicle,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOneById(id: number) {
    try {
      const recreationalVehicle = await this.recreationalVehiclesRepository.findOne(
        {
          where: {
            id: id,
          },
        }
      );
      if (!recreationalVehicle) {
        throw new HttpException(
          'Error finding recreational Vehicle. Recreational Vehicle not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'RecreationalVehicle retrieved successfully',
        obj: recreationalVehicle,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async upsert(bodyObj: CreateRecreationalVehicleDto) {
    try {
      const recreationalVehicle = await this.recreationalVehiclesRepository.save(
        bodyObj
      );
      if (!recreationalVehicle) {
        throw new HttpException(
          'Error upserting recreational Vehicle',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'RecreationalVehicle upserted successfully',
        id: recreationalVehicle.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
