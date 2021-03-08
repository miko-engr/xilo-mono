import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Promise from 'bluebird';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import cleaner from 'clean-deep';
import { encryption } from '../../constants/appconstant';
import * as simpleencryptor from 'simple-encryptor';
const encryptor = simpleencryptor.createEncryptor(encryption.key);
import { Drivers } from './drivers.entity';
import { Vehicles } from '../../entities/Vehicles';
import { Answers } from '../../entities/Answers';
import { Companies } from '../company/company.entity';
import { Clients } from '../client/client.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
@Injectable({ scope: Scope.REQUEST })
export class DriverService {
  constructor(
    @InjectRepository(Drivers)
    private driversRepository: Repository<Drivers>,
    @InjectRepository(Vehicles)
    private vehiclesRepository: Repository<Vehicles>,
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request
  ) {}
  async updateVehicle() {
    try {
      const vehicles = await this.vehiclesRepository
        .createQueryBuilder('vehicles')
        .where({})
        .leftJoinAndSelect('vehicles.driver', 'driver')
        .leftJoinAndSelect('driver.client', 'client')
        .getMany();
      if (!vehicles) {
        throw new HttpException('No vehicles found', HttpStatus.BAD_GATEWAY);
      }
      await Promise.map(vehicles, (vehicle) => {
        const newVehicle = vehicle;
        if (!vehicle.clientVehicleId && vehicle.driver) {
          return this.vehiclesRepository.save({
            ...vehicle,
            ...{ clientVehicleId: vehicle.driver.clientDriverId },
          });
        }
        if (
          !vehicle.companyVehicleId &&
          vehicle.driver &&
          vehicle.driver.client
        ) {
          return this.vehiclesRepository.save({
            ...vehicle,
            ...{ companyVehicleId: vehicle.driver.client.companyClientId },
          });
        }
        if (vehicle.driver && !vehicle.driver.companyDriverId) {
          return this.vehiclesRepository.save({
            ...vehicle,
            ...{ companyDriverId: vehicle.driver.client.companyClientId },
          });
        }
      });
      const answers = await this.answersRepository.find();
      if (!answers) {
        throw new HttpException('No answers found', HttpStatus.BAD_GATEWAY);
      }
      await Promise.map(answers, (answer) => {
        const newWidth =
          answer.width !== null ? answer.width.replace('%', '') : answer.width;
        return this.answersRepository.save({
          ...answer,
          ...{ width: newWidth },
        });
      });
      return {
        title: 'All vehicles and answers updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async updateDrivers() {
    try {
      const drivers = await this.driversRepository.find({
        relations: ['client'],
      });
      if (!drivers) {
        throw new HttpException('No drivers found', HttpStatus.BAD_GATEWAY);
      }
      await Promise.map(drivers, (driver) => {
        if (!driver.companyDriverId || driver.companyDriverId === null) {
          return this.driversRepository.save({
            ...driver,
            ...{ companyDriverId: driver.client.companyClientId },
          });
        }
      });
      return {
        title: 'All drivers updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async create(bodyObj: CreateDriverDto) {
    try {
      const newDriver = await this.driversRepository.save(bodyObj);
      if (!newDriver) {
        throw new HttpException(
          'Error creating driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        title: 'Driver created successfully',
        obj: newDriver,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async companyDeleteDriver(clientId: number, driverId: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: [
          {
            id:
              typeof decoded.user !== 'undefined'
                ? decoded.user.companyUserId
                : -1,
          },
          {
            id:
              typeof decoded.agent !== 'undefined'
                ? decoded.agent.companyAgentId
                : -1,
          },
        ],
      });
      if (!company) {
        throw new HttpException(
          'There was an error retrieving company',
          HttpStatus.BAD_GATEWAY
        );
      }
      const client = await this.clientsRepository.findOne({
        where: {
          id: clientId,
          companyClientId: company.id,
        },
      });
      if (!client) {
        throw new HttpException(
          'There was an error retrieving client',
          HttpStatus.BAD_GATEWAY
        );
      }
      const driver = await this.driversRepository.findOne({
        where: {
          id: driverId,
          clientDriverId: client.id,
        },
      });
      if (!driver) {
        throw new HttpException(
          'There was an error retrieving the driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      const deletedDriver = await this.driversRepository.delete(driver);
      if (deletedDriver.affected === 0) {
        throw new HttpException(
          'There was an error deleting the driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        message: 'Driver removed successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async deleteDriver(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientsRepository.findOne({
        where: {
          id: decoded.client.id,
        },
      });
      if (!client) {
        throw new HttpException(
          'There was an error retrieving client',
          HttpStatus.BAD_GATEWAY
        );
      }
      const driver = await this.driversRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!driver) {
        throw new HttpException(
          'There was an error finding this driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      const deletedDriver = await this.driversRepository.delete(driver);
      if (deletedDriver.affected === 0) {
        throw new HttpException(
          'There was an error deleting the driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        message: 'Driver removed successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async deleteDriverFromSimpleForm(id: number) {
    try {
      const driver = await this.driversRepository.findOne({
        where: { id: id },
      });
      if (!driver) {
        throw new HttpException(
          'Error deleting driver. No driver found',
          HttpStatus.BAD_GATEWAY
        );
      }
      const deletedDriver = await this.driversRepository.delete(driver);
      if (deletedDriver.affected === 0) {
        throw new HttpException(
          'There was an error deleting the driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        title: 'Driver deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async upsert(bodyObj: CreateDriverDto) {
    try {
      const driver = cleaner(bodyObj);

      if (bodyObj.ssnU && bodyObj.ssnU !== 'Answered') {
        bodyObj.ssnUHash = encryptor.encrypt(bodyObj.ssnU);
        bodyObj.ssnU = 'Answered';
      }

      const newDriver = await this.driversRepository.save(driver);
      if (!newDriver) {
        throw new HttpException(
          'Error upserting driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        title: 'Driver upserted successfully',
        id: newDriver.id,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async update(id: number, bodyObj: CreateDriverDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const driver = await this.driversRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!driver) {
        throw new HttpException('Error finding driver', HttpStatus.BAD_GATEWAY);
      }
      const updatedDriver = await this.driversRepository.save({
        ...driver,
        ...bodyObj,
      });
      if (!updatedDriver) {
        throw new HttpException(
          'Error updating driver',
          HttpStatus.BAD_GATEWAY
        );
      }
      return {
        title: 'Driver updated successfully',
        obj: updatedDriver,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
