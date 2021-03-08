import { Injectable, Scope, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as request from 'request-promise';
import { vendorsNames } from '../../constants/appconstant';
import { Clients } from '../client/client.entity';
import { returnData } from './helper/quote-rush.helper';
import { xiloAuthurl } from '../../constants/appconstant';
import { ClientDto } from '../client/dto/client.dto';

@Injectable({ scope: Scope.REQUEST })
export class QuoteRushService {
    constructor(
        @InjectRepository(Clients)
        private clientRepository: Repository<Clients>,
        @Inject(REQUEST) private request: Request
    ) {}

    async createContact(req, res) {
        try {
            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            const response = await  this.handleCreateContact(token, req.params.clientId);

            if (!response.status)
                throw new HttpException('Error creating QQ contact. Method failed', HttpStatus.BAD_REQUEST)

            res.send(response.response);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async handleCreateContact(token, clientId) {
        try {
            const client: ClientDto = await this.clientRepository.createQueryBuilder('client')
                .where('client.id = :id', { id: clientId })
                .leftJoinAndSelect('client.drivers', 'drivers')
                .leftJoinAndSelect('client.vehicles', 'vehicles')
                .leftJoinAndSelect('client.homes', 'homes')
                .leftJoinAndSelect('client.businesses', 'businesses')
                .orderBy({
                    'drivers.createdAt': 'DESC',
                    'vehicles.createdAt': 'DESC',
                })
                .getOne();


            if (!client || !client.firstName || !client.lastName)
                return { status: false, error: 'Error creating Quote Rush file. No client found or not enough client data' };

            const data = await returnData(client);

            if (!data.status)  return { status: false, error: 'Error upserting Quote Rush. Issue with data' };

            data['vendorName'] = vendorsNames.VENDOR_QUOTERUSH;
            const path = `/api/quote-rush/upsert/${clientId}`;
            const options = {
                method: 'PUT',
                url: xiloAuthurl + path,
                body: data,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };

          const response = await request(options);

          return { status: true, response: response };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
