import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Clients } from '../client/client.entity';
import { File } from './file.entity';
import { CreateFileDto } from './dto/create.file.dto';
import * as ObjectsToCsv from 'objects-to-csv';
import * as csvHelper from './helper/csv.helper';
@Injectable({ scope: Scope.REQUEST })
export class FileService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}
  async createCSVFile(clientIds: number[]) {
    try {
      const decoded = this.request.body.decodedUser;
      if (!clientIds) {
        throw new HttpException(
          'Error creating csv file. No client ids',
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
          'Error creating csv file. Client Id array is empty',
          HttpStatus.BAD_REQUEST
        );
      }
      const clients = await this.clientsRepository
        .createQueryBuilder('client')
        .where('client.id IN (:...ids)', {
          ids: clientIds,
        })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .leftJoinAndSelect('client.business', 'business')
        .leftJoinAndSelect('client.locations', 'locations')
        .leftJoinAndSelect('client.agent', 'agent')
        .orderBy('drivers.createdAt', 'ASC')
        .addOrderBy('vehicles.createdAt', 'ASC')
        .addOrderBy('locations.createdAt', 'ASC')
        .getMany();

      if (!clients || clients.length < 1) {
        throw new HttpException(
          'Error creating csv file. No clients found',
          HttpStatus.BAD_REQUEST
        );
      }

      let csvData: any = {};
      csvData = await csvHelper.returnData(clients);

      if (csvData === {} || !csvData['status']) {
        throw new HttpException(
          'Error creating csv file. Error parsing clients',
          HttpStatus.BAD_REQUEST
        );
      }

      const csvFile = await new ObjectsToCsv(csvData.data).toString();

      return {
        title: 'CSV file created successfully',
        obj: csvFile,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async create(fileBody: CreateFileDto) {
    try {
      const file = await this.fileRepository.save(fileBody);
      if (!file) {
        throw new HttpException('Error creating file', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'File created successfully',
        obj: file,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteFile(id: number) {
    try {
      const file = await this.fileRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!file) {
        throw new HttpException('No file found', HttpStatus.BAD_REQUEST);
      }
      const deleteFile = await this.fileRepository.delete(file);
      if (deleteFile.affected === 0) {
        throw new HttpException(
          'There was an error removing file',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'File removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const file = await this.fileRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!file) {
        throw new HttpException('No file found', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'File retrieved successfully',
        obj: file,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, fileBody: CreateFileDto) {
    try {
      const file = await this.fileRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!file) {
        throw new HttpException('No file found', HttpStatus.BAD_REQUEST);
      }
      const updatedFile = await this.fileRepository.save({
        ...file,
        ...fileBody,
      });
      if (!updatedFile) {
        throw new HttpException('Error updating File', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'File updated successfully',
        obj: updatedFile,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
