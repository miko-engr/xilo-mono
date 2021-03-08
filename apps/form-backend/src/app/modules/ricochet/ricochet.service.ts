import {
  Injectable,
  Inject,
  Scope,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import request from 'request-promise';
import { Clients } from '../client/client.entity';
import * as ricochetHelper from './helper/ricochet.helper';
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';
@Injectable({ scope: Scope.REQUEST })
export class RicochetService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Clients) private clientsRepository: Repository<Clients>
  ) {}
  async createContact() {
    try {
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];
      const client = await this.clientsRepository
        .createQueryBuilder('client')
        .where({ id: this.request.params.clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .leftJoinAndSelect('client.business', 'business')
        .orderBy('drivers.createdAt', 'ASC')
        .orderBy('vehicles.createdAt', 'ASC')
        .getOne();

      if (!client || !client.firstName || !client.lastName) {
        throw new HttpException(
          'Error creating Ricochet file. No client found or not enough client data',
          HttpStatus.BAD_REQUEST
        );
      }

      const data = await ricochetHelper.returnData(client);

      if (data && !data.status) {
        throw new HttpException(
          'Error upserting Ricochet. Issue with data',
          HttpStatus.BAD_REQUEST
        );
      }

      this.request.body.data = data.data;

      this.request.body.vendorName = vendorsNames.VENDOR_RICOCHET;
      const path = `/api/ricochet/upsert/${this.request.params.clientId}`;
      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: this.request.body,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };

      const response = await request(options);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
