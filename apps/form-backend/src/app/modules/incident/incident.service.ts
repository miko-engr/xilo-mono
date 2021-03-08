import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Incidents } from './incidents.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
@Injectable({ scope: Scope.REQUEST })
export class IncidentService {
  constructor(
    @InjectRepository(Incidents)
    private incidentsRepository: Repository<Incidents>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(bodyObj: CreateIncidentDto) {
    try {
      const newIncident = await this.incidentsRepository.save(bodyObj);
      if (!newIncident) {
        throw new HttpException(
          'Error creating incident',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'New incident created successfully',
        obj: newIncident.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async delete(id: number) {
    try {
      const incident = await this.incidentsRepository.findOne({
        where: { id: id },
      });
      if (!incident) {
        throw new HttpException(
          'Error deleting incident. No incident found with this ID!',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedIncident = await this.incidentsRepository.delete(incident);
      if (deletedIncident.affected === 0) {
        throw new HttpException(
          'Error deleting incident.',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Incident deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const incident = await this.incidentsRepository.findOne({
        where: {
          companyIncidentId: decoded.user.companyUserId,
        },
      });

      if (!incident) {
        throw new HttpException(
          'Error finding incident. Incident not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Incident retrieved successfully',
        obj: incident,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOneById(id: number) {
    try {
      const incident = await this.incidentsRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!incident) {
        throw new HttpException(
          'Error finding incident. Incident not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Incident retrieved successfully',
        obj: incident,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async upsert(bodyObj: CreateIncidentDto) {
    try {
      const incident = await this.incidentsRepository.save(bodyObj);
      if (!incident) {
        throw new HttpException(
          'Error upserting incident',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Incident upserted successfully',
        id: incident.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
