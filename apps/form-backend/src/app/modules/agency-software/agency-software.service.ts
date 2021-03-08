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
import * as asHelper from './helper/agency-software.helper';
@Injectable({ scope: Scope.REQUEST })
export class AgencySoftwareService {
  constructor(
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request
  ) {}
  async createFile(clientIds: number[]) {
    try {
      const decoded = this.request.body.decodedUser;
      if (!clientIds.length) {
        throw new HttpException(
          'Error creating Agency Software file. No client ids!',
          HttpStatus.BAD_REQUEST
        );
      }
      const idArray = [];
      clientIds.forEach(async (id) => {
        const obj = { id: id };
        idArray.push(obj);
      });

      if (!idArray || idArray.length < 1) {
        throw new HttpException(
          'Error creating Agency Software file. Client Id array is empty',
          HttpStatus.BAD_REQUEST
        );
      }
      const clients = await this.clientRepository
        .createQueryBuilder('client')
        .where('client.id IN (:...ids)', {
          ids: clientIds,
        })
        .leftJoinAndSelect('client.business', 'business')
        .leftJoinAndSelect('client.agent', 'agent')
        .getMany();

      if (!clients || clients.length < 1) {
        throw new HttpException(
          'Error creating Agency Software file. No clients found',
          HttpStatus.BAD_REQUEST
        );
      }

      let asData = {};
      asData = await asHelper.returnData(clients);

      if (asData === {} || !asData['status']) {
        throw new HttpException(
          'Error creating Agency Software file. Error parsing clients',
          HttpStatus.BAD_REQUEST
        );
      }

      const asFile = await new ObjectsToCsv(asData['data']).toString();

      return {
        title: 'Agency Software file created successfully',
        obj: asFile,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
