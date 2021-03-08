import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from '../client/client.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as ObjectsToCsv from 'objects-to-csv';
import * as amHelper from './helper/agency-matrix.helper';
@Injectable({ scope: Scope.REQUEST })
export class AgencyMatrixService {
  constructor(
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request
  ) {}
  async createFile(type: string, clientId: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = this.clientRepository
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
          'Error creating Agency Matrix file. No client found!',
          HttpStatus.BAD_REQUEST
        );
      }

      let amData = {};
      if (type === 'auto') {
        amData = await amHelper.returnAutoData(client);
      } else if (type === 'home') {
        amData = await amHelper.returnHomeData(client);
      } else if (type === 'commercial') {
        amData = await amHelper.returnCommercialData(client);
      }

      if (amData === {}) {
        throw new HttpException(
          'Error creating Agency Matrix file. Type not supplied or error parsing client!',
          HttpStatus.BAD_REQUEST
        );
      }

      const amFile = await new ObjectsToCsv(amData).toString();

      return {
        title: 'Agency Matrix file created successfully',
        obj: amFile,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
