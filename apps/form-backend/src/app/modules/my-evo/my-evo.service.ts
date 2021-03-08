import {
  HttpException,
  Injectable,
  Scope,
  HttpStatus
} from '@nestjs/common';
import { MyEvoDto } from './dto/my-evo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ObjectsToCsv from 'objects-to-csv';
import { Clients } from '../client/client.entity';
import { returnData } from "../../helpers/my-evo.helper";

@Injectable({ scope: Scope.REQUEST })
export class MyEvoService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
) {}

  async createFile (myEvoDto: MyEvoDto) {
    try {
      if (!myEvoDto.clientIds) {
        throw new HttpException('Error creating Evo file. No client ids', HttpStatus.BAD_REQUEST)
      }
      const clientIds = myEvoDto.clientIds;
      const idArray = [];
      clientIds.forEach(async(id) => {
        const obj = { id: id };
        idArray.push(obj);
      });

      if (!idArray || !idArray.length) {
        throw new HttpException('Error creating Evo file. Client Id array is empty', HttpStatus.BAD_REQUEST)
      }

      const clients =  await this.clientRepository
        .createQueryBuilder('client')
        .where('client.id IN (:...ids)', {
          ids: clientIds,
        })
        .leftJoinAndSelect('client.businesses', 'business')
        .leftJoinAndSelect('client.agents', 'agent')
        .getMany();
  
      if (!clients || clients.length > 1) {
        throw new HttpException('Error creating Evo file. No clients found', HttpStatus.BAD_REQUEST)
      }
  
      const evoData = await returnData(clients);
      if (!evoData.status) {
        throw new HttpException('Error creating Evo file. Error parsing clients', HttpStatus.BAD_REQUEST)
      }

      const evoFile = await new ObjectsToCsv(evoData.data).toString();
  
      return {
        title: 'EVO file created successfully',
        obj: evoFile
      };
  
    } catch (error) {
      return { status: false, error }
    }
  }
}