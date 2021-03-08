import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as requestpromise from 'request-promise';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QqCatalystHelper } from './helper/qq-catalyst.helper';
import { Clients } from '../client/client.entity';
import { ClientDto } from '../client/dto/client.dto';
import { Forms } from '../form/forms.entity';
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';

@Injectable({ scope: Scope.REQUEST })
export class QqCatalystService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Forms) private formRepository: Repository<Forms>,
    private qqCatalystHelper: QqCatalystHelper
  ) {}
  async handleCreateContact(token, clientId) {
    let oneClient: ClientDto;
    try {
      const client = await this.clientRepository
        .createQueryBuilder('clients')
        .where(clientId)
        .select([
          'id',
          'qqContactId',
          'firstName',
          'lastName',
          'streetAddress',
          'city',
          'postalCd',
          'stateCd',
          'email',
          'phone',
          'formClientId',
        ])
        .innerJoinAndSelect('clients.homes', 'homes')
        .select([
          'id',
          'clientHomeId',
          'streetAddress',
          'city',
          'zipCode',
          'state',
          'fullAddress',
        ])
        .innerJoinAndSelect('clients.business', 'business')
        .select([
          'id',
          'fullAddress',
          'entityName',
          'city',
          'zipCode',
          'state',
          'streetAddress',
        ])
        .innerJoinAndSelect('clients.drivers', 'drivers')
        .select(['id', 'applicantGivenName', 'applicantSurname'])
        .getOne();

      if (!client)
        return {
          status: false,
          error: 'Error creating QQ contact. No client found',
        };
      oneClient = client;
      if (+client.qqContactId > 0)
        return {
          status: false,
          error: 'Contact already pushed to QQ. Cant push duplicates',
        };
      let form = {
        title: 'Unknown',
      };

      if (client.formClientId > 0) {
        form = await this.formRepository.findOne({
          where: {
            id: client.formClientId,
          },
          select: ['id', 'title'],
        });
      }
      const data: any = await this.qqCatalystHelper.returnData(
        client,
        form.title
      );
      if (!data.status) {
        return { status: false, error: data.error };
      }
      data.vendorName = vendorsNames.VENDOR_QQ;
      const path = '/api/qq/contact';
      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: data,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };
      const response = await requestpromise(options);
      if (response && response.obj && response.obj.IsSuccess === true) {
        const updatedClient: any = await this.clientRepository.update(
          clientId,
          {
            qqContactId: response.obj.EntityID,
            validations: [],
          }
        );
      }

      return { status: true, response: response };
    } catch (error) {
      const message =
        error && error.error && error.error.error && error.error.error.message;
      if (message && message.includes('auth')) {
        const oneValidation = {
          lob: '--',
          createdAt: new Date().getTime(),
          error: 'Authentication failed. Please check password in API Settings',
          integrationIds: null,
          fieldDataIn: null,
          errorType: 'credentials',
          vendorName: 'QQ',
        };
        await this.clientRepository.update(oneClient.id, {
          validations: [oneValidation],
        });
      }
      return { status: false, error: error };
    }
  }

  async createContact(clientId: number) {
    try {
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];
      const response = await this.handleCreateContact(token, clientId);
      if (!response.status)
        throw new HttpException(
          'Error creating QQ contact. Method failed',
          HttpStatus.BAD_REQUEST
        );
      const data = response.response;
      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async createPolicy() {
    try {
      if (!this.request.body.policy)
        throw new HttpException('No policy was sent', HttpStatus.NOT_FOUND);
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];
      this.request.body.vendorName = vendorsNames.VENDOR_QQ;
      const path = '/api/qq/policy';
      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: this.request.body,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };
      const response = await requestpromise(options);
      return response;
    } catch (error) {
      throw new HttpException('Error creating policy', HttpStatus.BAD_REQUEST);
    }
  }

  async createQuote(policyId: number) {
    try {
      if (!this.request.body.quote)
        throw new HttpException('No quote was sent', HttpStatus.NOT_FOUND);
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];
      this.request.body.vendorName = vendorsNames.VENDOR_QQ;
      const path = `/api/qq/quote/${policyId}`;
      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: this.request.body,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };
      const response = await requestpromise(options);
      const data = response;
      return data;
    } catch (error) {
      throw new HttpException('Error creating quote', HttpStatus.BAD_REQUEST);
    }
  }

  async createTask() {
    try {
      if (!this.request.body.task)
        throw new HttpException('No task was sent', HttpStatus.NOT_FOUND);
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];
      this.request.body.vendorName = vendorsNames.VENDOR_QQ;
      const path = '/api/qq/task';
      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: this.request.body,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };
      const response = await requestpromise(options);
      const data = response;
      return data;
    } catch (error) {
      throw new HttpException('Error creating task', HttpStatus.BAD_REQUEST);
    }
  }
}
