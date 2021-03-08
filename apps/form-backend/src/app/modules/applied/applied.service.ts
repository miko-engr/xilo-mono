import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from '../client/client.entity';
import { returnData } from './helper/applied.helper';
@Injectable()
export class AppliedService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>
  ) {}
  async createFile(clientId: number) {
    try {
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
          'Error creating Applied file. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      const appliedRaterData = await returnData(client);

      if (!appliedRaterData) {
        throw new HttpException(
          'Error creating Applied file. Type not supplied or error parsing client',
          HttpStatus.BAD_REQUEST
        );
      }

      const tempAppliedRaterFile = Object.keys(appliedRaterData).map((key) => {
        return `${key}||${appliedRaterData[key]}\n`;
      });

      const appliedRaterFile = tempAppliedRaterFile.join('');

      return {
        title: 'Applied file created successfully',
        obj: appliedRaterFile,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating Applied Epic file',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
