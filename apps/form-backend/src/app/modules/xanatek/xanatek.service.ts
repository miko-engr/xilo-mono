import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ObjectsToCsv from 'objects-to-csv';
import { Clients } from '../client/client.entity';
import * as xHelper from './helper/xanatek.helper';

@Injectable()
export class XanatekService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>
  ) {}
  async createFile(clientId: number) {
    try {
      const client = await this.clientRepository.findOne({
        where: { id: clientId },
        relations: ['drivers'],
      });

      if (!client) {
        throw new HttpException(
          'Error creating Xanatek file. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      let xData = {};
      xData = await xHelper.returnData(client);

      if (xData === {}) {
        throw new HttpException(
          'Error creating Xanatek file. Type not supplied or error parsing client',
          HttpStatus.BAD_REQUEST
        );
      }

      const xFile = await new ObjectsToCsv([xData]).toString();

      return {
        title: 'Xanatek file created successfully',
        obj: xFile,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
