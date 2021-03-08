import {
  HttpException,
  Injectable,
  Scope,
  HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from '../client/client.entity';
import { returnAutoData } from "./helper/now-certs.helper";
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';
import { request } from 'http';

@Injectable({ scope: Scope.REQUEST })
export class NowCertsService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
) {}

  async createContact (req) {
    try {
      const token = req.body.token || req.query.token || req.headers['x-access-token']

      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: req.params.clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .getOne()
  
      if (!client || !client.firstName || !client.lastName) {
        throw new HttpException('Error creating NowCerts. No client found or not enough client data', HttpStatus.BAD_REQUEST)
      }

      req.body.autoData = await returnAutoData(client);
      req.body.vendorName = vendorsNames.VENDOR_NOWCERTS;
      const path = `/api/nowCerts/upsert/${req.params.clientId}`;  
      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: req.body,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };
  
      const response = await request(options);
      return {
       data: response
      }
    } catch (error) {
      return { status: false, error }
    }
  }
}
