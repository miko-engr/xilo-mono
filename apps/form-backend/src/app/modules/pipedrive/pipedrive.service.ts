import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Pipedrive from 'pipedrive';
import * as companyHelper from '../company/helper/company.helper';
import { Companies } from '../company/company.entity';
import { Clients } from '../client/client.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable({ scope: Scope.REQUEST })
export class PipedriveService {
  constructor(
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request
  ) {}
  async getDeals(query: any) {
    const pipedrive = new Pipedrive.Client(query.apiToken, {
      strictMode: true,
    });
    pipedrive.Deals.getAll({}, (err, deals) => {
      if (err) {
        throw new HttpException(
          'There was an error retrieving deals',
          HttpStatus.BAD_REQUEST
        );
      }
      if (deals) {
        return {
          title: 'Deals retrieved successfully',
          obj: deals,
        };
      }
    });
  }
  async getPipelines(query: any) {
    try {
      const pipedrive = new Pipedrive.Client(query.apiToken, {
        strictMode: true,
      });
      pipedrive.Pipelines.getAll({}, function (err, pipelines) {
        if (err) {
          throw new HttpException(
            'Error getting pipelines',
            HttpStatus.BAD_REQUEST
          );
        }
        return {
          title: 'Company pipeline updated',
          obj: pipelines,
        };
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateCompanyPipeline(companyId: number, sessionData: any) {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          id: companyId,
          companyId: companyId,
        },
      });
      if (!company) {
        throw new HttpException(
          'Error finding pipelines. No company',
          HttpStatus.BAD_REQUEST
        );
      }
      function returnLowerCase(value) {
        if (value) {
          return value.toLowerCase();
        }
        return null;
      }
      const pipelines = sessionData.data.obj;
      const pipelineIndex = await pipelines.findIndex((pipeline) => {
        return (
          returnLowerCase(pipeline.name) ===
          returnLowerCase(company.pipedrivePipeline)
        );
      });
      const pipeline = pipelines[pipelineIndex];
      const updatedCompany = await this.companiesRepository.save({
        ...company,
        ...{
          pipedrivePipelineId: pipeline.id,
        },
      });
      return {
        title: 'Company updated',
        Obj: updatedCompany.pipedrivePipelineId,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getStages(query: any) {
    try {
      const pipedrive = new Pipedrive.Client(query.apiToken, {
        strictMode: true,
      });

      pipedrive.Stages.getAll({}, function (err, stages) {
        if (err) {
          throw new HttpException(
            'Error getting stages',
            HttpStatus.BAD_REQUEST
          );
        }
        return {
          title: 'Company stage updated',
          obj: stages,
        };
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateCompanyStage(sessionData: any, companyId: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: {
          id: companyId,
          companyId: companyId,
        },
      });
      if (!company) {
        throw new HttpException(
          'Error finding stages. No company',
          HttpStatus.BAD_REQUEST
        );
      }
      function returnLowerCase(value) {
        if (value) {
          return value.toLowerCase();
        }
        return null;
      }
      const stages = sessionData.obj;
      const stageIndex = await stages.findIndex((stage) => {
        return (
          returnLowerCase(stage.name) ===
          returnLowerCase(company.pipedriveStage)
        );
      });
      const stage = stages[stageIndex];
      const updatedCompany = await this.companiesRepository.save({
        ...company,
        ...{
          pipedriveStageId: stage.id,
        },
      });
      return {
        title: 'Company updated',
        Obj: updatedCompany.pipedriveStageId,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async addDeal(dealBody: any) {
    try {
      let id = null;
      const user = this.request.body.decodedUser;
      if (user) {
        if (user.client) {
          id = user.client.companyClientId;
        } else {
          id = user.user.companyUserId;
        }
      } else {
        throw new HttpException(
          'Error updating pipedrive. Not authorized to make request',
          HttpStatus.BAD_REQUEST
        );
      }
      const company = await this.companiesRepository.findOne({
        where: { id: id },
      });

      if (!company) {
        throw new HttpException(
          'Error updating pipedrive. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const pipedrive = new Pipedrive.Client(company.pipedriveToken, {
        strictMode: true,
      });
      pipedrive.Deals.add(dealBody.deal, async (err, deal) => {
        if (err) {
          throw new HttpException('Error adding deal', HttpStatus.BAD_REQUEST);
        }

        if (deal) {
          const updatedCompany = await this.companiesRepository.save({
            ...company,
            ...{
              pipedriveDealId: deal.id,
            },
          });

          return {
            title: 'New deal added',
            obj: deal,
          };
        }
        throw new HttpException(
          'Error adding deal. No deal created',
          HttpStatus.BAD_REQUEST
        );
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async addNote(clientId: number, noteBody: any) {
    try {
      let id = null;
      const user = this.request.body.decodedUser;
      if (user) {
        if (user.client) {
          id = user.client.companyClientId;
        } else {
          id = user.user.companyUserId;
        }
      } else {
        throw new HttpException(
          'Error updating pipedrive. Not authorized to make request',
          HttpStatus.BAD_REQUEST
        );
      }
      const company = await this.companiesRepository.findOne({
        where: { id: id },
      });

      if (!company) {
        throw new HttpException(
          'Error updating pipedrive. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const pipedrive = new Pipedrive.Client(company.pipedriveToken, {
        strictMode: true,
      });
      let content = '';
      const client = await this.clientsRepository.findOne({
        where: { id: clientId },
        relations: ['drivers', 'vehicles', 'homes', 'business'],
      });
      if (!client) {
        throw new HttpException(
          'Error adding note. No client found',
          HttpStatus.BAD_REQUEST
        );
      }
      const rows = await companyHelper.returnClientDetailRows(client);
      if (!rows || !rows[0]) {
        throw new HttpException(
          'Error adding note. No rows found',
          HttpStatus.BAD_REQUEST
        );
      }
      if (rows.length > 0) {
        rows.forEach((row) => {
          content += `<div class="form-group">
            <div class="group">
                <span class="info-label">${row['label']}  -  </span>
                <span class="info">${row['value']}
                </span>
            </div>
          </div>`;
        });
      }
      noteBody.note.content = content;
      pipedrive.Notes.add(noteBody.note, async (err, note) => {
        if (err) {
          throw new HttpException('Error adding note', HttpStatus.BAD_REQUEST);
        }

        if (note) {
          const updatedCompany = await this.companiesRepository.save({
            ...company,
            ...{
              pipedriveNoteId: note.id,
            },
          });
          return {
            title: 'New note added',
            obj: note,
          };
        }
        throw new HttpException(
          'Error adding note. No note created',
          HttpStatus.BAD_REQUEST
        );
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async addPerson(personBody: any) {
    try {
      let id = null;
      const user = this.request.body.decodedUser;
      if (user) {
        if (user.client) {
          id = user.client.companyClientId;
        } else {
          id = user.user.companyUserId;
        }
      } else {
        throw new HttpException(
          'Error updating pipedrive. Not authorized to make request',
          HttpStatus.BAD_REQUEST
        );
      }
      const company = await this.companiesRepository.findOne({
        where: { id: id },
      });

      if (!company) {
        throw new HttpException(
          'Error updating pipedrive. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const pipedrive = new Pipedrive.Client(company.pipedriveToken, {
        strictMode: true,
      });
      pipedrive.Persons.add(personBody.person, async (err, person) => {
        if (err) {
          throw new HttpException(
            'Error adding person',
            HttpStatus.BAD_REQUEST
          );
        }

        if (person) {
          return {
            title: 'New person added',
            obj: person,
          };
        } else {
          throw new HttpException(
            'Error adding person. Person not created',
            HttpStatus.BAD_REQUEST
          );
        }
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateNote(clientId: number, id: number) {
    try {
      let id = null;
      const user = this.request.body.decodedUser;
      if (user) {
        if (user.client) {
          id = user.client.companyClientId;
        } else {
          id = user.user.companyUserId;
        }
      } else {
        throw new HttpException(
          'Error updating pipedrive. Not authorized to make request',
          HttpStatus.BAD_REQUEST
        );
      }
      const company = await this.companiesRepository.findOne({
        where: { id: id },
      });

      if (!company) {
        throw new HttpException(
          'Error updating pipedrive. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const pipedrive = new Pipedrive.Client(company.pipedriveToken, {
        strictMode: true,
      });
      let content = '';
      const client = await this.clientsRepository.findOne({
        where: { id: clientId },
        relations: ['drivers', 'vehicles', 'homes', 'business'],
      });
      if (!client) {
        throw new HttpException(
          'Error updating note. No client found',
          HttpStatus.BAD_REQUEST
        );
      }
      const rows = await companyHelper.returnClientDetailRows(client);
      if (!rows || !rows[0]) {
        throw new HttpException(
          'Error updating note. No rows found',
          HttpStatus.BAD_REQUEST
        );
      }
      if (rows.length > 0) {
        rows.forEach((row) => {
          content += `<div class="form-group">
            <div class="group">
                <span class="info-label">${row['label']}  -  </span>
                <span class="info">${row['value']}
                </span>
            </div>
          </div>`;
        });
      }
      const updatedNote = { content: content };
      pipedrive.Notes.update(id, updatedNote, async (err, note) => {
        if (err) {
          throw new HttpException('Error adding note', HttpStatus.BAD_REQUEST);
        }

        if (note) {
          return {
            title: 'Note updated',
            obj: note,
          };
        }
        throw new HttpException(
          'Error updating note. No note updatd',
          HttpStatus.BAD_REQUEST
        );
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
