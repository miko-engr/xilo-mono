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
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { Crons } from './crons.entity';
import { CreateCronDto } from './dto/create-cron.dto';
import * as jwt from 'jsonwebtoken';
import * as cron from 'node-cron';
import * as sgMail from '@sendgrid/mail';
import * as moment from 'moment';
@Injectable({ scope: Scope.REQUEST })
export class CronService {
  constructor(
    @InjectRepository(Crons)
    private cronsRepository: Repository<Crons>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(cronBody: CreateCronDto) {
    try {
      const cron = await this.cronsRepository.create(cronBody);
      if (!cron) {
        throw new HttpException(
          'There was an error retrieving crons',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Cron created successfully',
        obj: cron,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async schedule(queryToken: string, minutes: string) {
    try {
      const token = this.request.headers['x-access-token'] || queryToken;
      const decoded = jwt.decode(token as string);
      const now = new Date();
      const minutesLater = now.setMinutes(now.getMinutes() + +minutes);
      sgMail.setApiKey(
        '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'
      );
      const client = await this.clientsRepository.findOne({
        where: { id: decoded['client'].id },
      });
      if (!client) {
        throw new HttpException('No client found', HttpStatus.BAD_REQUEST);
      }
      client.hasFollowUpEmail = true;
      const updatedClient = await this.clientsRepository.save(client);
      if (!updatedClient) {
        throw new HttpException('Update client error', HttpStatus.BAD_REQUEST);
      }
      const company = this.companyRepository
        .createQueryBuilder('company')
        .where({ id: decoded['client'].companyClientId })
        .select('id')
        .leftJoinAndSelect(
          'company.lifecycles',
          'lifecycles',
          'company.isEnabled = :isEnabled',
          { isEnabled: true }
        )
        .leftJoinAndSelect(
          'company.agents',
          'agents',
          'agents.isPrimaryAgent = :isPrimaryAgent',
          { isPrimaryAgent: true }
        )
        .getOne();
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      for (let i = 0; i < company['agents'].length; i++) {
        const agent = company['agents'][i];
        const msg = {
          to: agent.email,
          from: 'customer-success@xilo.io',
          subject: `Following up with ${`${client.firstName} ${client.lastName}`}`,
          html: returnHtml(agent.id),
          send_at: moment(minutesLater).unix(),
        };
        if (company['agents'][i + 1]) {
          sgMail.send(msg);
        } else {
          sgMail
            .send(msg)
            .then((message) => {
              return message;
            })
            .catch((error) => {
              return error;
            });
        }
      }
      function returnHtml(agentId) {
        return `
                  <body style="text-align: center">
                      Please update Xilo on the status of ${`${client.firstName} ${client.lastName}`} (${
          client.email + '-' + client.phone
        }) by clicking one of the lifecycle statuses below.<br><br>
                      ${returnLifecycles(agentId)}
                      </body>
                  `;
      }
      function returnLifecycles(agentId) {
        let lifecycleString = '';
        for (const lifecycle of company['lifecycles']) {
          lifecycleString += `<div style="box-sizing: border-box; cursor: pointer; background-color:${lifecycle.color}; color: #fdfdfd; font-weigt: bold; text-align: center;font-size:16px; margin: 10px auto; height: 45px; width: 200px; padding: 20px 5px; border-radius: 3px;">
                                              <a style="text-decoration: none; color: #fdfdfd;" href="https://xilo-api.herokuapp.com/api/client/thank-you/${lifecycle.id}/${agentId}?token=${token}">
                                                  ${lifecycle.name}
                                              </a>
                                          </div>`;
        }
        return lifecycleString;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async stop() {
    cron.schedule('');
  }
  async update(id: number, cronBody: CreateCronDto) {
    try {
      const cronData = await this.cronsRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!cronData) {
        throw new HttpException('No cron found', HttpStatus.BAD_REQUEST);
      }

      const updatedCron = await this.cronsRepository.save({
        ...cronData,
        ...cronBody,
      });
      return {
        title: 'Cron updated successfully',
        obj: updatedCron,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOneById(id: number) {
    try {
      const oneCron = await this.cronsRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!oneCron) {
        throw new HttpException('Cron not found!', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Cron retrieved successfully',
        obj: oneCron,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async list() {
    try {
      const cronData = await this.cronsRepository.find({});
      if (!cronData) {
        throw new HttpException('Cron not found!', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Crons retrieved successfully',
        obj: cronData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
