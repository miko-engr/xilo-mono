import {
  Injectable,
  Scope,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, getRepository, MoreThan, MoreThanOrEqual, 
          IsNull, Not, getConnection } from 'typeorm';
import * as moment from 'moment';
import { Companies } from '../company/company.entity';
import { Zapiersyncs } from './zapiersyncs.entity';
import { Clients } from '../client/client.entity';
import { ClientDto } from '../client/dto/client.dto';
import { FormAnalytics } from '../analyticsv2/FormAnalytics.entity';
import { Agents } from '../agent/agent.entity';
import { Forms } from '../form/forms.entity';
import { Answers } from '../../entities/Answers';
import { EzlynxService } from '../ezlynx/ezlynx.service';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Homes } from '../home/homes.entity';
import { Drivers } from '../driver/drivers.entity';
import { Vehicles } from '../../entities/Vehicles';

@Injectable({ scope: Scope.REQUEST })
export class ZapierService {
  constructor(
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(Zapiersyncs)
    private zapiersyncsRepository: Repository<Zapiersyncs>,
    @InjectRepository(Clients) private clientsRepository: Repository<Clients>,
    @InjectRepository(FormAnalytics)
    private formAnalyticsRepository: Repository<FormAnalytics>,
    @InjectRepository(Agents) private agentsRepository: Repository<Agents>,
    @InjectRepository(Forms) private formRepository: Repository<Forms>,
    @InjectRepository(Answers) private answersRepository: Repository<Answers>,
    @InjectRepository(Lifecycles)
    private lifecycleRepository: Repository<Lifecycles>,
    private readonly ezlynxService: EzlynxService
  ) {}
  async lifecycleTrigger(companyId): Promise<ClientDto[]> {
    try {
      if (!companyId)
        throw new HttpException('Company Id not found', HttpStatus.NOT_FOUND);

      const company = await this.companiesRepository.findOne({
        where: { companyId: companyId },
      });
      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      let zapiersync = await this.zapiersyncsRepository.findOne({
        where: { companyId: companyId },
      });

      if (!zapiersync) {
        this.zapiersyncsRepository.create();
        zapiersync = await this.zapiersyncsRepository.save({
          companyId: companyId.toString(),
          lastSyncTime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      const response = await this.clientsRepository
        .createQueryBuilder('clients')
        .where({
          lifecycleUpdatedAt: MoreThanOrEqual(zapiersync.lifecycleLastSyncTime),
          companyClientId: company.id,
        })
        .select(['companyId', 'lifecycle'])
        .leftJoinAndSelect('clients.companies', 'companies')
        .leftJoinAndSelect('clients.lifecycles', 'lifecycles', 'lifecycles.name = :name', { name: request.query.name})
        .select(['lifecycles.name'])
        .getMany();

      await this.zapiersyncsRepository.update(zapiersync.id, {
        lifecycleLastSyncTime: new Date(),
      });
      return response;
    } catch (error) {
      throw new HttpException(
        'Lifecycle Trigger error',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async trigger(companyId, model) {
    try {
      if (!model || !companyId)
        throw new HttpException('CompanyId not found', HttpStatus.NOT_FOUND);

      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });
      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      let zapiersync = await this.zapiersyncsRepository.findOne({
        where: { companyId: companyId },
      });

      if (!zapiersync) {
        const zs = new Zapiersyncs();
        zs.companyId = companyId.toString();
        zs.lastSyncTime = new Date();
        zs.createdAt = new Date();
        zs.updatedAt = new Date();
        zapiersync = await this.zapiersyncsRepository.save(zs);
      }
      const response = await getRepository(
        model as string
      ).find({
        where: {
          updatedAt: !LessThan(zapiersync.lastSyncTime),
          [`company${model}Id`]: company.id,
        },
        join: {
          alias: `${model}`,
          leftJoinAndSelect: {
            company: `${model}.company`,
          },
          select: [],
        },
        select: ['companyId'],
      });

      await this.zapiersyncsRepository.update(zapiersync.id, {
        lastSyncTime: new Date(),
      });
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async convert2obj(a) {
        const modifiedObj = {};
        for (const key in a) {
          if (Array.isArray(a[key])) {
            for (let i = 1; i <= a[key].length; i++) {
              for (const ckey in a[key][i - 1]) {
                modifiedObj[`${key}${i}_${ckey}`] = a[key][i - 1][ckey];
              }
            }
          } else {
            modifiedObj[key] = a[key];
          }
        }
        return modifiedObj;
  }

  async finishedEventByCompanyForm(companyId) {
    try {
      if (!companyId)
        throw new HttpException('CompanyId not found', HttpStatus.NOT_FOUND);

      const company = await this.companiesRepository.findOne({
        where: { companyId: companyId },
      });

      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      let zapiersync = await this.zapiersyncsRepository.findOne({
        where: { companyId: companyId },
      });
      if (!zapiersync)
        zapiersync = await this.zapiersyncsRepository.create({
          companyId: companyId.toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        });

      const zapSyncTime = moment(zapiersync.eventLastSyncTime).subtract(
        10,
        'minutes'
      );

      const formAnalytics: FormAnalytics[] = await this.formAnalyticsRepository
        .createQueryBuilder('formAnalytics')
        .where({
          formAnalyticCompanyId: company.id,
          formAnalyticClientId: Not(IsNull()),
          formAnalyticFormId: request.query.form_id,
          event: 'Finished Form',
          createdAt: MoreThanOrEqual(zapSyncTime),
          zapFired: false})
        .innerJoinAndSelect('formAnalytics.form', 'forms')
        .innerJoinAndSelect('formAnalytics.client', 'clients')
        .getRawMany();

      const clients = await this.clientsRepository
        .createQueryBuilder('clients')
        .where({
          companyClientId: company.id,
          formClientId: request.query.form_id,
          zapStatus: 'Triggered',
        })
        .innerJoinAndSelect('clients.drivers', 'drivers')
        .innerJoinAndSelect('clients.vehicles', 'vehicles')
        .innerJoinAndSelect('clients.homes', 'homes')
        .getMany();

      await this.zapiersyncsRepository.update(zapiersync.id, {
        eventLastSyncTime: new Date(),
      });

      const p = formAnalytics.map(async (item) => {
        await this.formAnalyticsRepository.update(item.id, { zapFired: true });
        await this.clientsRepository.update(item.client.id, {
          zapStatus: 'Fired',
        });
        const obj = await this.convert2obj(
          JSON.parse(JSON.stringify(item.client))
        );
        obj['formName'] = item.form.title;
        if (item.client && item.client.clientAgentId) {
          const agent = await this.agentsRepository.findOne({
            where: { id: item.client.clientAgentId },
            select: ['id', 'email', 'betterAgencyUsername'],
          });
          if (agent) {
            obj['clientAgentId'] = agent.email;
            if (agent.betterAgencyUsername)
              obj['betterAgencyUsername'] = agent.betterAgencyUsername;
          }
        }
        return obj;
      });

      const c = clients.map(async (client) => {
        await this.clientsRepository.update(client.id, { zapStatus: 'Fired' });
        const obj = await this.convert2obj(JSON.parse(JSON.stringify(client)));
        if (client.formClientId) {
          const form = await this.formRepository.findOne({
            where: { id: client.formClientId },
            select: ['id', 'title'],
          });
          if (form) obj['formName'] = form.title;
        }
        if (client.clientAgentId) {
          const agent = await this.agentsRepository.findOne({
            where: { id: client.clientAgentId },
            select: ['id', 'email', 'betterAgencyUsername'],
          });
          if (agent) {
            obj['clientAgentId'] = agent.email;
            if (agent.betterAgencyUsername) {
              obj['betterAgencyUsername'] = agent.betterAgencyUsername;
            }
          }
        }
        return obj;
      });
      const response = [];
      response.push(...(await await Promise.all(p)));
      response.push(...(await await Promise.all(c)));
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async agentTrigger(companyId) {
    try {
      if (!companyId)
        throw new HttpException('CompanyId not found', HttpStatus.NOT_FOUND);
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });

      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      let zapiersync = await this.zapiersyncsRepository.findOne({
        where: { companyId: companyId },
      });

      if (!zapiersync)
        zapiersync = await this.zapiersyncsRepository.create({
          companyId: companyId.toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        });

      const response = await this.clientsRepository.find({
        where: {
          clientAgentIdUpdatedAt: MoreThan(zapiersync.agentLastSyncTime),
          companyClientId: company.id,
        },
      });

      await this.zapiersyncsRepository.update(zapiersync.id, {
        agentLastSyncTime: new Date(),
      });
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async convert2object(answers, a) {
        const modifiedObj = {};
        for (const key in a) {
          if (Array.isArray(a[key])) {
            for (let i = 1; i <= a[key].length; i++) {
              for (const ckey in a[key][i - 1]) {
                const index = answers.findIndex(
                  (ans) => ans.objectName === key && ans.propertyKey === ckey
                );
                if (index > -1) {
                  modifiedObj[`${key}${i}_${ckey}`] =
                    a[key][i - 1][ckey] ||
                    answers[index].placeholderText ||
                    answers[index].propertyKey;
                } else {
                  delete a[key][i - 1][ckey];
                }
              }
            }
          } else {
            const index = answers.findIndex(
              (ans) => ans.objectName === 'client' && ans.propertyKey === key
            );
            if (index > -1) {
              modifiedObj[key] =
                a[key] ||
                answers[index].placeholderText ||
                answers[index].propertyKey;
            } else {
              delete a[key];
            }
          }
        }
        return modifiedObj;
  }

  async fetchSmpleFieldsByForm(companyId) {
    try {
      if (!companyId)
        throw new HttpException('CompanyId not found', HttpStatus.NOT_FOUND);

      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });
      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      const zapiersync = await this.zapiersyncsRepository.findOne({
        where: { companyId: companyId },
      });
      if (!zapiersync)
        await this.zapiersyncsRepository.create({
          companyId: companyId.toString(),
        });

      const formAnalytics: FormAnalytics[] = await this.formAnalyticsRepository
        .createQueryBuilder('formAnalytics')
        .where({
          formAnalyticCompanyId: company.id,
          formAnalyticClientId: Not(IsNull()),
          formAnalyticFormId: request.query.form_id,
          event: 'Finished Form',
        })
        .innerJoinAndSelect('formAnalytics.form', 'forms')
        .innerJoinAndSelect('formAnalytics.client', 'client')
        .orderBy('formAnalytics.id', 'DESC')
        .getRawMany();

      const answers = await this.answersRepository.find({
        where: {
          formAnswerId: request.query.form_id,
        },
      });
      if (!answers)
        throw new HttpException('Form not found', HttpStatus.NOT_FOUND);

      const p = formAnalytics.map(async (item) => {
        const obj = await this.convert2object(answers, 
          JSON.parse(JSON.stringify(item.client))
        );
        obj['formName'] = item.form.title;
        if (item.client && item.client.clientAgentId) {
          const agent = await this.agentsRepository.findOne({
            where: { id: item.client.clientAgentId },
          });
          if (agent)
            obj['clientAgentId'] = agent.email;
        }
        return obj;
      });
      const response = [];
      const obj = await Promise.all(p);

      for (const key in obj[0]) {
        const newObj = {
          key: key,
          label: obj[0][key],
        };
        response.push(newObj);
      }

      return response;
    } catch (error) {
      throw new HttpException('Trigger error', HttpStatus.BAD_REQUEST);
    }
  }
  async fetchCompanyForm(companyId) {
    try {
      if (!companyId)
        throw new HttpException('CompanyId not found', HttpStatus.NOT_FOUND);
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });

      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      const form = await this.formRepository
        .createQueryBuilder('form')
        .where({ companyFormId: company.id })
        .select(['id', 'title'])
        .getOne();
      return form;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async create(zapierBody) {
    try {
      if (!zapierBody.model)
        throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: zapierBody.data.companyId,
        },
      });
      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      delete zapierBody.data.companyId;
      zapierBody.data[`company${zapierBody.model}Id`] = company.id;
      zapierBody.data['createdAt'] = new Date();
      zapierBody.data['updatedAt'] = new Date();

      const response = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(zapierBody.model+'s')
                .values(zapierBody.data)
                .execute();
      return response;
    } catch (error) {
      throw new HttpException('Error creating contact', HttpStatus.BAD_REQUEST);
    }
  }

  async returnName(value) {
        switch (true) {
          case value === 'homes':
            return 'clientHomeId';
          case value === 'vehicles':
            return 'clientVehicleId';
          case value === 'drivers':
            return 'clientDriverId';
        }
  }

    async convertPlainJSON(data) {
        const values = Object.keys(data); // get keys of flattened client
        const modifiedObj = values.reduce((acc, item) => {
          // split flattened client keys
          const arr = item.split(/([0-9]+)(_)/);
          if (arr.length === 1) {
            acc[item] = data[item];
          } else {
            // check if keys exists in modifiedObj
            if (!Object.prototype.hasOwnProperty.call(acc, arr[0])) {
              acc[arr[0]] = []; // array of object
            }
            if (acc[arr[0]][parseInt(arr[1]) - 1]) {
              // check if index exists in array if exist add key-value in that object
              acc[arr[0]][parseInt(arr[1]) - 1][arr[3]] = data[item];
            } else {
              // check if index exists in array if not exist add object in that position
              acc[arr[0]][parseInt(arr[1]) - 1] = new Object();
              acc[arr[0]][parseInt(arr[1]) - 1][arr[3]] = data[item];
            }
          }
          return acc;
        }, {});
        // expected output { firstName: 'first', lastName: 'last', drivers: [{ firstName: 'first', lastName: 'last',},{firstName: 'first',lastName: 'last',}]}
        return modifiedObj;
  }

  async createFlattenedClient(companyId, zapierObject) {
    try {
      if (!companyId)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      const company = await this.companiesRepository.findOne({
        where: {
          companyId: companyId,
        },
      });
      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      const data: any = this.convertPlainJSON(zapierObject);
      let client: any = await this.clientsRepository.findOne({
        where: {
          email: Not(IsNull()) && data.email,
        },
      });

      data.companyClientId = company.id;
      if (!client) client = await this.clientsRepository.create(data);
      else client = await this.clientsRepository.update(client.id, data);

      const responseArray = [];
      for (const key in data) {
        // check if value isArray it creates entry in that model
        if (Array.isArray(data[key])) {
          const res = data[key].map(async (item) => {
            let modelName = key.replace(/(\b\w)/gi, (m) => m.toUpperCase());
            modelName =
              modelName.substr(-1) == 's' ? modelName.slice(0, -1) : modelName; // get model name
            try {
              const empty = !Object.values(item).some(
                (x) => x !== null && x !== ''
              );
              if (!empty) {
                item[`company${modelName}Id`] = company.id;
                const keyName = await this.returnName(key)
                item[keyName] = client.id;
                item['createdAt'] = new Date()
                item['updatedAt'] = new Date()
                
                const createResp = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(modelName+'s')
                .values(item)
                .execute();
                return createResp.identifiers[0].id
              } else return empty;
            } catch (error) {
              return `${modelName} ${error.message}`;
            }
          });
          responseArray.push(Promise.all(res));
        }
      }

      if (company.hasEzlynxIntegration) {
        request.params.clientId = String(client.id);
        await this.ezlynxService.createContact(
          client.id,
          request.params.type
        );
      }

      return {
        id: client.id,
        response: await Promise.all(responseArray),
      };
    } catch (error) {
      throw new HttpException('Create client error', HttpStatus.BAD_REQUEST);
    }
  }
  async changeLifecycle(zapierBody) {
    try {
      if (
        !zapierBody.companyId ||
        !zapierBody.email ||
        !zapierBody.name
      ) {
        const missingKey = !zapierBody.companyId
          ? ' Company Id '
          : !zapierBody.email
          ? ' Email '
          : !zapierBody.name
          ? ' Name '
          : ' Param ';
        throw new HttpException(
          `No${missingKey}Provided`,
          HttpStatus.NOT_FOUND
        );
      }

      const company = await this.companiesRepository.findOne({
        where: {
          companyId: zapierBody.companyId,
        },
      });

      if (!company)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

      const client = await this.clientsRepository.findOne({
        where: {
          email: zapierBody.data.email,
          companyClientId: company.id,
        },
        select: ['id', 'clientLifecycleId', 'companyClientId'],
      });

      if (!client)
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      const lifecycle = await this.lifecycleRepository.findOne({
        where: {
          companyLifecycleId: client.companyClientId,
          name: zapierBody.data.name,
        },
      });
      if (!lifecycle)
        throw new HttpException('Lifecycle not found', HttpStatus.NOT_FOUND);

      const response = await this.clientsRepository.update(client.id, {
        clientLifecycleId: lifecycle.id,
      });
      return {
        title: 'Lifecycle updated successfully',
        response,
      };
    } catch (error) {
      throw new HttpException('Error creating contact', HttpStatus.BAD_REQUEST);
    }
  }
}
