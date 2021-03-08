import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import * as hsHelper from './helper/hawksoft.helper';
@Injectable()
export class HawksoftService {
  constructor(
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>
  ) {}

  async createFile(clientId: number, type: string) {
    try {
      const client = await this.clientsRepository
        .createQueryBuilder('client')
        .where({ id: clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .leftJoinAndSelect('client.business', 'business')
        .orderBy('drivers.createdAt', 'ASC')
        .orderBy('vehicles.createdAt', 'ASC');

      if (!client) {
        throw new HttpException(
          'Error creating Hawksoft file. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      let hsData = {};
      if (type === 'all') {
        hsData = await hsHelper.returnData(client);
      }

      if (!hsData['status']) {
        throw new HttpException(
          'Error creating Hawksoft file. Type not supplied or error parsing client',
          HttpStatus.BAD_REQUEST
        );
      }

      let hsFile = '';

      const hsDataFile = hsData['data'];

      for (let key in hsDataFile) {
        if (hsDataFile[key] && typeof hsDataFile[key] != 'undefined') {
          hsFile += `${key} = ${returnValue(hsDataFile[key])}\n`;
        }
      }

      function returnValue(value) {
        if (
          (value && value !== 'undefined' && typeof value != 'undefined') ||
          value === false
        ) {
          if (value === true || value === 'true') {
            return 'Yes';
          } else if (value === false || value === 'false') {
            return 'No';
          } else {
            return value;
          }
        }
      }
      return {
        title: 'Hawksoft file created successfully',
        obj: hsFile,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
