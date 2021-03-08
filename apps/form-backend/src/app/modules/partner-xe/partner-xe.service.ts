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
import * as ObjectsToCsv from 'objects-to-csv';
import { Clients } from '../client/client.entity';
import * as peHelper from './helper/partner-xe.helper';
@Injectable({ scope: Scope.REQUEST })
export class PartnerXeService {
  constructor(
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request
  ) {}
  async createFile() {
    try {
      const decoded = this.request.body.decodedUser;
      if (!this.request.body.clientIds) {
        throw new HttpException(
          'Error creating Partner XE file. No client ids',
          HttpStatus.BAD_REQUEST
        );
      }
      const clientIds = this.request.body.clientIds;
      const idArray = [];
      clientIds.forEach(async (id) => {
        const obj = { id: id };
        idArray.push(obj);
      });

      if (!idArray || idArray.length < 1) {
        throw new HttpException(
          'Error creating Partner XE file. Client Id array is empty',
          HttpStatus.BAD_REQUEST
        );
      }
      const clients = await this.clientsRepository
        .createQueryBuilder('client')
        .where('client.id IN (:...ids)', {
          ids: clientIds,
        })
        .leftJoinAndSelect('client.business', 'business')
        .leftJoinAndSelect('client.agent', 'agent')
        .leftJoinAndSelect('client.drivers', 'drivers')
        .orderBy('drivers.createdAt', 'ASC')
        .getMany();

      if (!clients || clients.length < 1) {
        throw new HttpException(
          'Error creating Partner XE file. No clients found',
          HttpStatus.BAD_REQUEST
        );
      }

      let peData = {};
      if (this.request.params.type === 'client') {
        peData = await peHelper.returnClientData(clients);
      } else if (this.request.params.type === 'drivers') {
        peData = await peHelper.returnDriverData(clients);
      }

      if (peData === {} || !peData['status']) {
        throw new HttpException(
          'Error creating Partner XE file. Error parsing clients',
          HttpStatus.BAD_REQUEST
        );
      }

      const peFile = await new ObjectsToCsv(peData['data']).toString();

      return {
        title: 'Partner XE file created successfully',
        obj: peFile,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
