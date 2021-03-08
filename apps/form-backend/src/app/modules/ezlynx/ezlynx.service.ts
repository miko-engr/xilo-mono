import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as request from 'request-promise';
import { Repository, Not, IsNull } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Clients } from '../client/client.entity';
import { Homes } from '../home/homes.entity';
import { Forms } from '../form/forms.entity';
import { sendSimpleMail } from '../../helpers/email.helper';
import * as set from 'lodash.set';
import * as _ from 'lodash';
import * as ezHelper from './helper/ezlynx.helper';
import { xiloAuthurl, vendorsNames } from '../../constants/appconstant';
import * as companyHelper from '../company/helper/company.helper';
import { Companies } from '../company/company.entity';
@Injectable({ scope: Scope.REQUEST })
export class EzlynxService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Clients) private clientsRepository: Repository<Clients>,
    @InjectRepository(Homes) private homesRepository: Repository<Homes>,
    @InjectRepository(Forms) private formsRepository: Repository<Forms>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>
  ) { }

  async createContact(clientId: number, type: string) {
    try {
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];
      const client = await this.clientsRepository
        .createQueryBuilder('client')
        .where({
          id: clientId,
        })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.business', 'business')
        .leftJoinAndSelect('client.company', 'company')
        .leftJoinAndSelect('client.incidents', 'incidents')
        .leftJoinAndSelect(
          'client.recreationalVehicles',
          'recreationalVehicles'
        )
        .orderBy('drivers.createdAt', 'ASC')
        .addOrderBy('vehicles.createdAt', 'ASC')
        .getOne();

      if (!client) {
        throw new HttpException(
          'Error pushing to EZLynx. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      if (client.ezlynxId && !client.isExistingEzLynxApplicant) {
        const res = await this.createPersonalApplicantMethod(token, client.id);
        if (!res.status) {
          const error = res.error;
          console.log(error.message);
        }
      }

      const homes = await this.homesRepository.find({
        where: {
          clientHomeId: client.id,
          city: Not(IsNull),
        },
        order: { createdAt: 'ASC' },
      });
      if (!homes) {
        throw new HttpException(
          'Error finding home. No home found',
          HttpStatus.BAD_REQUEST
        );
      }
      if (homes) {
        client.homes = homes;
      }

      function hasName(client) {
        if (
          client &&
          client.drivers &&
          client.drivers.length > 0 &&
          ((client.drivers[0].applicantGivenName &&
            client.drivers[0].applicantSurname) ||
            client.drivers[0].fullName)
        ) {
          return true;
        } else if (client && client.firstName && client.lastName) {
          return true;
        } else if (client.fullName) {
          return true;
        } else {
          return false;
        }
      }

      function hasHome(home, form) {
        if (home && (home.state || home.city || home.zipCode)) {
          return true;
        } else if (
          form &&
          form.title &&
          form.title.toLowerCase().includes('home') &&
          !form.title.toLowerCase().includes('auto')
        ) {
          return true;
        } else {
          return false;
        }
      }

      function hasAuto(vehicle, driver, form) {
        if (
          (vehicle &&
            (vehicle.vehicleVin ||
              vehicle.vehicleManufacturer ||
              vehicle.vehicleModel ||
              vehicle.vehicleModelYear)) ||
          (driver && (driver.applicantGivenName || driver.applicantSurname))
        ) {
          return true;
        } else if (
          form &&
          form.title &&
          form.title.toLowerCase().includes('auto') &&
          !form.title.toLowerCase().includes('home')
        ) {
          return true;
        } else {
          return false;
        }
      }

      if (!hasName(client)) {
        const subjectId = client
          ? client['company']
            ? `${client['company'].name} - ${client.id}`
            : `${client.id}`
          : clientId
            ? clientId
            : null;
        sendSimpleMail(
          'jon@xilo.io',
          `BUG - EZLynx: No data found ${subjectId}`,
          JSON.stringify(client)
        );
        throw new HttpException(
          'Error creating EZLynx file. No client found or not enough client data',
          HttpStatus.BAD_REQUEST
        );
      }

      let form = null;

      if (client.formClientId) {
        form = await this.formsRepository.findOne({
          where: { id: client.formClientId },
        });
      }

      let data;
      let autoData;
      let homeData;
      let runBoth = false;

      if (type === 'Auto') {
        data = await ezHelper.returnAutoData(client, client['company']);
      } else if (type === 'Home') {
        data = await ezHelper.returnHomeData(client, client['company']);
      } else if (client) {
        let ran = 0;
        if (
          hasAuto(
            client && client.vehicles && client.vehicles[0]
              ? client.vehicles[0]
              : null,
            client && client.drivers && client.drivers[0]
              ? client.drivers[0]
              : null,
            form
          )
        ) {
          autoData = await ezHelper.returnAutoData(client, client['company']);
          ran += 1;
        }
        if (
          hasHome(
            client && client.homes && client.homes[0] ? client.homes[0] : null,
            form
          )
        ) {
          try {
            homeData = await ezHelper.returnHomeData(client, client['company']);
            if (ran > 0) {
              runBoth = true;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }

      if (
        (data && !data.status) ||
        (runBoth && !autoData.status && !homeData.status)
      ) {
        console.log(data);
        const subjectId = client
          ? client['company']
            ? `${client['company'].name} - ${client.id}`
            : `${client.id}`
          : clientId
            ? clientId
            : null;
        sendSimpleMail(
          'jon@xilo.io',
          `BUG - Error creating ezlynx contact ${subjectId}`,
          'Error with data'
        );
        throw new HttpException(
          'Error upserting EZLynx. Issue with data',
          HttpStatus.BAD_REQUEST
        );
      }

      this.request.body.autoData =
        autoData && autoData.data ? autoData.data : null;
      this.request.body.homeData =
        homeData && homeData.data ? homeData.data : null;
      this.request.body.data = data && data.data ? data.data : null;
      if (client && client.clientAgentId && this.request.body.autoData) {
        this.request.body['data'] = {};
        this.request.body.data['clientAgentId'] = client.clientAgentId;
      }
      if (client && client.clientAgentId && this.request.body.homeData) {
        this.request.body['data'] = {};
        this.request.body.data['clientAgentId'] = client.clientAgentId;
      }
      if (client && client.clientAgentId && this.request.body.data) {
        this.request.body.data['clientAgentId'] = client.clientAgentId;
      }
      if (this.request.body.autoData && this.request.body.homeData) {
        this.request.body['runBoth'] = true;
      }
      this.request.body.vendorName = vendorsNames.VENDOR_EZLYNX;

      let path = `/api/ezlynx/upsert/${type}/${clientId}`;

      if (
        client.ezlynxStatus === 'created' ||
        (client.ezlynxUrl && !client.ezlynxUrl.includes('failed'))
      ) {
        path += '?action=update';
      } else if (!client.ezlynxUrl) {
        path += '?action=create';
      }

      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: this.request.body,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };

      const response = await request(options);

      let url = null;

      if (response && response.url) {
        url = response.url;
      } else if (
        response &&
        response.auto &&
        response.auto.url !== 'Upload Failed'
      ) {
        url = response.auto.url;
      } else if (
        response &&
        response.home &&
        response.home.url !== 'Upload Failed'
      ) {
        url = response.home.url;
      }

      if (url) {
        const updatedClient = await this.clientsRepository.save({
          ...client,
          ...{
            ezlynxUrl: url,
            ezlynxStatus: 'created',
          },
        });
        if (!updatedClient) {
          throw new HttpException(
            'Error updating client',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      if (response.validations) {
        const updatedClient = await this.clientsRepository.save({
          ...client,
          ...{
            ezlynxValidationLogs: response.validations,
          },
        });
        if (!updatedClient) {
          throw new HttpException(
            'Error updating client',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      return response;
    } catch (error) {
      try {
        console.log(error);
        let client = null;
        if (clientId) {
          client = await this.clientsRepository
            .createQueryBuilder('client')
            .where({
              id: clientId,
            })
            .leftJoinAndSelect('client.drivers', 'drivers')
            .leftJoinAndSelect('client.vehicles', 'vehicles')
            .leftJoinAndSelect('client.homes', 'homes')
            .leftJoinAndSelect('client.company', 'company')
            .leftJoinAndSelect('client.agent', 'agent')
            .leftJoinAndSelect(
              'client.recreationalVehicles',
              'recreationalVehicles'
            )
            .orderBy('drivers.createdAt', 'ASC')
            .addOrderBy('vehicles.createdAt', 'ASC')
            .getOne();

          if (!client) {
            throw new HttpException(
              'Error pushing to EZLynx. No client found',
              HttpStatus.BAD_REQUEST
            );
          }
        }
        const companyName =
          client && client.company ? `${client.company.name} ` : '';
        const agentName =
          client && client.agent
            ? ` by ${client.agent.firstName} ${client.agent.lastName}`
            : '';
        const clientName =
          client && (client.firstName || client.lastName)
            ? `${client.firstName} ${client.lastName} `
            : null;
        const clientDetail = await companyHelper.returnClientDetailRows(client);
        const clientDetailArray = clientDetail.map((row) => {
          return `${row['label']}: ${row['value']}`;
        });
        if (clientDetailArray) {
          clientDetailArray.join('\n');
        }
        const clientString = JSON.stringify(clientDetail);
        const data = `<p>${error ? error.toString() : 'No error'}</p><br>
            <br><p>${client ? clientString : 'No client'}</p>`;
        sendSimpleMail(
          'jon@xilo.io',
          `${companyName}EZ Bug for ${
          clientName ? clientName : clientId
          }${agentName}`,
          data
        );
        throw new HttpException(
          'Error creating contact',
          HttpStatus.BAD_REQUEST
        );
      } catch (error2) {
        throw new HttpException(
          'Error creating contact',
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }
  async createPersonalApplicant(clientId: number) {
    try {
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];

      const data = await this.createPersonalApplicantMethod(token, clientId);

      if (!data.status) {
        throw new HttpException(
          'Error updating EZ Personal. Method failed',
          HttpStatus.BAD_REQUEST
        );
      }

      return data.response;
    } catch (error) {
      throw new HttpException('Error creating contact', HttpStatus.BAD_REQUEST);
    }
  }
  async createPersonalApplicantMethod(token, clientId) {
    try {
      const client = await this.clientsRepository.findOne({
        where: { id: clientId },
      });

      // TODO ADD VALIDATIONS FOR NOT HAVING NAME OR ENTITY
      function isNotValid() {
        return (
          !client ||
          (!client.firstName &&
            !client.lastName &&
            !client.fullName &&
            !client.fullAddress)
        );
      }

      if (isNotValid()) {
        return {
          status: false,
          error:
            'Error creating personal EZLynx applicant. No client found or not enough client data',
        };
      }

      const data = await this.returnPersonalData(client);

      if (data && !data.status) {
        return {
          status: false,
          error: 'Error upserting personal EZLynx applicant. Issue with data',
        };
      }

      const obj = {
        data: data.data,
        vendorName: vendorsNames.VENDOR_COMMERCIAL_EZLYNX,
      };

      const ezIdQuery = client.ezlynxId ? `?ezlynxId=${client.ezlynxId}` : '';

      if (client && client.clientAgentId) {
        obj['clientAgentId'] = client.clientAgentId;
      }

      const path = `/api/ezlynx/upsert-personal-applicant/${
        clientId + ezIdQuery
        }`;
      const options = {
        method: 'PUT',
        url: xiloAuthurl + path,
        body: obj,
        json: true,
        headers: {
          'x-access-token': token,
        },
      };

      const response = await request(options);

      let updateObj = { isExistingEZLynxApplicant: true };

      if (response['ezlynxId']) {
        updateObj['ezlynxId'] = response['ezlynxId'];
      }

      const updatedClient = this.clientsRepository.save({
        ...client,
        ...updateObj,
      });

      return { status: true, response: response };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  async validateEZHome() {
    try {
      // const result = await integrationHelper.validateEZHome(this.request.body);  TODO should be imported from helper

      //   if (!result.status) {
      //     console.log('Status error: ', result.error);
      //     throw new HttpException(
      //       'Error validating. Failed',
      //       HttpStatus.BAD_REQUEST
      //     );
      //   }

      return {
        title: 'Validation passed',
        // obj: result.validation,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async returnPersonalData(client) {
    try {
      const company = await this.companiesRepository.findOne({
        where: { id: client.companyClientId },
        select: ['id', 'streetAddress', 'unit', 'city', 'state', 'zipCode'],
      });

      async function assignObject(object, key, value, defaultValue = null) {
        const valueExists = value !== null && typeof value !== 'undefined';
        if (valueExists) {
          set(object, key, value);
          return null;
        }
        set(object, key, defaultValue);
        return null;
      }

      function replaceAll(str, find, replace) {
        return str.replace(new RegExp(_.escapeRegExp(find), 'g'), replace);
      }

      function formatPhone(phone) {
        let newPhone = phone;
        if (phone) {
          newPhone = replaceAll(newPhone, '-', '');
          newPhone = replaceAll(newPhone, ' ', '');
        }
        return newPhone;
      }

      const data: any = {};

      data.CurrentAddress = {};

      await assignObject(data, 'ApplicantType', 'ProspectLead'); // 'Unknown','ProspectLead','ActiveClient','InactiveClient'
      await assignObject(
        data.CurrentAddress,
        'AddressLine1',
        client.streetAddress,
        company.streetAddress
      );
      await assignObject(
        data.CurrentAddress,
        'UnitNumber',
        client.unitNumber,
        company.unit
      );
      await assignObject(
        data.CurrentAddress,
        'City',
        client.city,
        company.city
      );
      await assignObject(
        data.CurrentAddress,
        'State',
        client.stateCd,
        company.state
      );
      await assignObject(
        data.CurrentAddress,
        'Zip',
        client.postalCd,
        company.zipCode
      );
      await assignObject(
        data.CurrentAddress,
        'County',
        client.county,
        company.county
      );

      await assignObject(data, 'ApplicantXref', client.id);
      if (client.firstName || client.lastName) {
        await assignObject(data, 'FirstName', client.firstName, 'VALUE');
        await assignObject(data, 'LastName', client.lastName, 'VALUE');
      } else if (client.fullName) {
        const names = client.fullName.split(' ');
        if (names[0]) {
          await assignObject(data, 'FirstName', names[0]);
          await assignObject(data, 'MiddleName', null);
        }
        if (names[1]) {
          await assignObject(data, 'LastName', names[1]);
        }
      } else {
        await assignObject(data, 'FirstName', client.firstName, 'VALUE');
        await assignObject(data, 'LastName', client.lastName, 'VALUE');
      }

      await assignObject(data, 'CellPhone', formatPhone(client.phone));
      await assignObject(data, 'Email', client.email);
      await assignObject(data, 'Id', client.ezlynxId);

      return {
        status: true,
        data,
      };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
