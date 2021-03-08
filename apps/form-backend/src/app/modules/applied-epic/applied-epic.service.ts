import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from '../client/client.entity';
import {
  returnAutoData,
  returnHomeData,
  returnCommercialData,
} from './helper/applied-epic.helper';
import * as ObjectsToCsv from 'objects-to-csv';

@Injectable({ scope: Scope.REQUEST })
export class AppliedEpicService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request
  ) {}
  async createFile(clientId: number, type: string) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where('client.id = :id', { id: clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .leftJoinAndSelect('client.business', 'business')
        .orderBy({
          'drivers.createdAt': 'DESC',
          'vehicles.createdAt': 'DESC',
        })
        .getOne();

      if (!client) {
        throw new HttpException(
          'Error creating Applied Epic file. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      let aeData = {};
      if (type === 'auto') {
        aeData = await returnAutoData(client);
      } else if (type === 'home') {
        aeData = await returnHomeData(client);
      } else if (type === 'commercial') {
        aeData = await returnCommercialData(client);
      }

      if (aeData === {}) {
        throw new HttpException(
          'Error creating Applied Epic file. Type not supplied or error parsing client',
          HttpStatus.BAD_REQUEST
        );
      }

      const amFile = await new ObjectsToCsv(aeData).toString();

      return {
        title: 'Applied Epic file created successfully',
        obj: amFile,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating Applied Epic file',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
