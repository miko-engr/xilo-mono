import { Injectable, Scope, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as request from 'request-promise';
import * as convert from 'xml-js';
import * as jwt from 'jsonwebtoken';
import * as ObjectsToCsv from 'objects-to-csv';
import { Clients } from '../client/client.entity';
import { Homes } from '../home/homes.entity';
import { Drivers } from '../driver/drivers.entity';
import { Companies } from '../company/company.entity';
import { Businesses } from '../business/businesses.entity';
import { Agents } from '../agent/agent.entity';
import { returnDriverData, returnVehicleData, returnClientData} from './helper/ams360';
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';

@Injectable({ scope: Scope.REQUEST })
export class Ams360Service {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Homes) private homeRepository: Repository<Homes>,
    @InjectRepository(Drivers) private driversRepository: Repository<Drivers>,
    @InjectRepository(Companies) private companiesRepository: Repository<Companies>,
    @InjectRepository(Businesses) private businessesRepository: Repository<Businesses>,
    @InjectRepository(Agents) private agentRepository: Repository<Agents>,
    @Inject(REQUEST) private request: Request
  ) {}

    async createFile(clientId: number, type: string) {
    try {
        const client = await this.clientRepository
        .createQueryBuilder('client')
        .where('client.id = :id', { id: clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.locations', 'location')
        .orderBy({
          'drivers.createdAt': 'DESC',
          'vehicles.createdAt': 'DESC',
          'location.createdAt': 'DESC'
        })
        .getOne();

      if (!client) {
          throw new HttpException('Error creating AMS 360 file. No client found!', HttpStatus.BAD_REQUEST);
      }

      const amData = [];
      if (type === 'drivers') {
        const driverData = await returnDriverData(client);
        amData.push(driverData);
      } else if (type === 'vehicles') {
        const vehicleData = await returnVehicleData(client);
        amData.push(vehicleData);
      } 

      if (amData.length === 0) {
        throw new HttpException(
          'Error creating AMS 360 file. Type not supplied or error parsing client',
          HttpStatus.BAD_REQUEST
        );
      }

      const ams360File = await new ObjectsToCsv(amData).toString();
      return {
        title: 'AMS 360 file created successfully',
        ams360File
      };

    } catch (error) {
       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

    async createContact(req, res) {
      try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        const clientAttrs = ['id', 'client.amsCustomerId', 'client.firstName', 'client.lastName', 'client.streetName',
            'client.streetNumber','client.unitNumber','client.city','client.stateCd','client.county','client.postalCd', 'client.phone', 'client.email',
            'client.birthDate', 'client.maritalStatus', 'client.customerType', 'client.clientAgentId', 'client.companyClientId'];
        
        const homeAttrs = ['id', 'home.streetName', 'home.streetNumber','home.unitNumber','home.city',
            'home.state', 'home.county', 'home.zipCode'];

        const driverAttrs = ['id', 'driver.createdAt', 'driver.applicantGivenName', 'driver.applicantSurname', 'driver.applicantBirthDt', 
            'driver.applicantGenderCd', 'driver.applicantMaritalStatusCd', 'driver.applicantOccupationClassCd', 'driver.educationLevel']

        const client = await this.clientRepository.createQueryBuilder('client')
                       .select(clientAttrs)
                       .where({ id: req.params.clientId})
                       .getOne();
        
        if (!client)
            throw new HttpException('No client found', HttpStatus.BAD_REQUEST);

        const homes = await this.homeRepository.createQueryBuilder('home')
                        .select(homeAttrs)
                        .where({ clientHomeId: client.id })
                        .getMany()
        client['homes'] = homes;

        const drivers = await this.driversRepository.createQueryBuilder('driver')
                        .select(driverAttrs)
                        .where({ clientDriverId: client.id })
                        .getMany()
        client['drivers'] = drivers;

        const business = await this.businessesRepository.findOne({clientBusinessId: client.id})
        client['business'] = business;

        const company = await this.companiesRepository.createQueryBuilder('companies')
                        .where("companies.id = :id", { id: client.companyClientId })
                        .getOne()

        let agent = null;

        if (client.clientAgentId) {
        agent = await this.agentRepository.findOne( { where: { id: client.clientAgentId } } );
          if (!agent) {
            agent = null;
          }
        }

      const amsData = {
        customer: null
      };
      amsData.customer = await returnClientData(client, company, agent);

      if (!amsData) {
        throw new HttpException('Error creating AMS 360 customer. Type not supplied or error parsing client', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.body.vendorName = vendorsNames.VENDOR_AMS360;
      req.body.customer = amsData.customer;

      let type = 'InsertCustomer';

      if (client.amsCustomerId) {
        type = 'UpdateCustomer'
      }

      const path = `/api/ams360/upsert/${req.params.clientId}/${type}`;
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
      
      let customerId = client.amsCustomerId; 
      if (!client.amsCustomerId && response && response.customerResponse) {
        const xmlResult = convert.xml2json(response.customerResponse, { compact: true, spaces: 0 });
        const parseXmlRes = JSON.parse(xmlResult);
        const result = parseXmlRes['soap:Envelope']['soap:Body'][`${type}_Response`];
        if (result.CustomerId && result.CustomerId._text) {
          customerId = result.CustomerId._text.replace(/(\r\n\s|\n|\r|\s)/gm, '');
          if (customerId) { 
            await this.clientRepository.update(req.params.clientId, { amsCustomerId: customerId });
          }
        }
      }
        
      res.sendStatus(200).json({ response, customerId })
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  async listDetails() {
      try {
        const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];      
        this.request.body.vendorName = vendorsNames.VENDOR_AMS360;
        const path = `/api/ams360/list-details`;
        const options = {
          method: 'POST',
          url: xiloAuthurl + path,
          body: this.request.body,
          json: true,
          headers: {
            'x-access-token': token,
          },
      };

      const response = await request(options);
      if (response.obj && response.obj[0]) {
        const user = this.request.body.decodedUser || jwt.decode(token);

        const company = await this.companiesRepository
        .createQueryBuilder('companies')
        .where('companies.id = :id', { id: user.user.companyUserId })
        .leftJoinAndSelect('companies.agents', 'agents')
        .getOne();

        if (!company || !company.agents) {
          throw new HttpException('Error getting AMS details', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const amsList = {divisions: [], departments: [], groups: [], branches: [], executives: [], reps: []};

        response.obj.forEach(async(items) => {
          items.forEach(async(item) => {
            try {
              if (item && item.name && item.type) {
                if (item.code && item.type.includes('division')) {
                  amsList.divisions.push({name: item.name, code: item.code});
                } else if (item.code && item.type.includes('group')) {
                  amsList.groups.push({name: item.name, code: item.code});
                } else if (item.code && item.type.includes('department')) {
                  amsList.departments.push({name: item.name, code: item.code});
                } else if (item.code && item.type.includes('branch')) {
                  amsList.branches.push({name: item.name, code: item.code});
                }
              } else if (item.code) {
                if (item.code && item.isAccountExec) {
                  amsList.executives.push({name: item.name, code: item.code});
                } else if (item.code && item.isAccountRep) {
                  amsList.reps.push({name: item.name, code: item.code});
                }
              }
            } catch(error) {
              console.log(error);
            }
          });
        });
        return {
          divisions: amsList.divisions,
          groups: amsList.groups,
          branches: amsList.branches,
          departments: amsList.departments,
          executives: amsList.executives,
          reps: amsList.reps,
        }

      } else {
        throw new HttpException('Error getting AMS details', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}
