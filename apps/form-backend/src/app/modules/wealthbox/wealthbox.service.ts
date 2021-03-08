import { Injectable, Inject, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as request from 'request-promise';
import * as helper from './wealthbox.helper';
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';

import { Clients } from '../client/client.entity';
import { ClientDto } from '../client/dto/client.dto';
import { Companies } from '../company/company.entity';
import { CompanyDto } from '../company/dto/company.dto';
import { ClientDetailsDto } from './dto/clientDetails.dto';

@Injectable({ scope: Scope.REQUEST })
export class WealthboxService {
    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(Clients) private clientsRepository: Repository<Clients>,
        @InjectRepository(Companies) private companiesRepository: Repository<Companies>,
    ) { }

    async createContact(clientDetails: ClientDetailsDto, clientId: string): Promise<any> {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const client: ClientDto = await this.clientsRepository.createQueryBuilder('clients')
            .where({id: clientId})
            .leftJoinAndSelect('clients.businesses', 'businesses')
            .getOne();

            if (!client || !client.firstName)
                throw new HttpException('Error creating Wealthbox. No client found or not enough client data', HttpStatus.NOT_FOUND);
            const clientData = await helper.returnContactData(client);

            if (!clientData.data)
                throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);

            clientDetails.clientData = clientData.data;
            clientDetails.vendorName = vendorsNames.VENDOR_WEALTHBOX;
            clientDetails.wealthboxId = client.wealthboxId;

            const path = `/api/wealthbox/createContact/${this.request.params.clientId}`;
            const options = {
                method: 'POST',
                url: xiloAuthurl + path,
                body: clientDetails,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };

            const response = await request(options);
            await this.clientsRepository.update(client.id, { wealthboxId: response.id });
            return response;

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTask(clientDetails: ClientDetailsDto, clientId: string): Promise<any> {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const client: ClientDto = await this.clientsRepository.createQueryBuilder('clients')
            .where({ id: clientId })
            .leftJoinAndSelect('clients.drivers', 'drivers')
            .leftJoinAndSelect('clients.vehicles', 'vehicles')
            .leftJoinAndSelect('clients.homes', 'homes')
            .getOne();

            if (!client || !client.firstName)
                throw new HttpException('Error creating Wealthbox. No client found or not enough client data', HttpStatus.NOT_FOUND);            
            const taskData = await helper.returnTaskData(client);
            if (!taskData.data)
                throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);

            clientDetails.taskData = taskData.data;
            clientDetails.vendorName = vendorsNames.VENDOR_WEALTHBOX;

            const path = `/api/wealthbox/createTask/${this.request.params.clientId}`;
            const options = {
                method: 'POST',
                url: xiloAuthurl + path,
                body: clientDetails,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };

            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async createEvent(clientDetails: ClientDetailsDto, clientId: string): Promise<any> {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const client: ClientDto = await this.clientsRepository.createQueryBuilder('clients')
            .where({ id: clientId })
            .leftJoinAndSelect('clients.drivers', 'drivers')
            .leftJoinAndSelect('clients.vehicles', 'vehicles')
            .leftJoinAndSelect('clients.homes', 'homes')
            .getOne();

            if (!client || !client.firstName)
                throw new HttpException('Error creating Wealthbox. No client found or not enough client data', HttpStatus.NOT_FOUND);
            const eventData = await helper.returnEventData(client);
            if (!eventData.data)
                throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);

            clientDetails.eventData = eventData.data;
            clientDetails.vendorName = vendorsNames.VENDOR_WEALTHBOX;

            const path = `/api/wealthbox/createEvent/${clientId}`;
            const options = {
                method: 'POST',
                url: xiloAuthurl + path,
                body: clientDetails,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };
            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async createProject(clientDetails: ClientDetailsDto, clientId: string): Promise<any> {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const projectData = await helper.returnProjectData();
            if (!projectData)
                throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);

            clientDetails.projectData = projectData.data;
            clientDetails.vendorName = vendorsNames.VENDOR_WEALTHBOX;
            const path = `/api/wealthbox/createProject/${clientId}`;
            const options = {
                method: 'POST',
                url: xiloAuthurl + path,
                body: clientId,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };
            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async createNote(clientDetails: ClientDetailsDto, clientId: string): Promise<any> {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const client: ClientDto = await this.clientsRepository.createQueryBuilder('clients')
            .where({ id: clientId })
            .leftJoinAndSelect('clients.drivers', 'drivers')
            .leftJoinAndSelect('clients.vehicles', 'vehicles')
            .leftJoinAndSelect('clients.homes', 'homes')
            .leftJoinAndSelect('clients.businesses', 'businesses')
            .getOne();

            if (!client || !client.firstName)
                throw new HttpException('Error creating Wealthbox. No client found or not enough client data', HttpStatus.NOT_FOUND);
            
            const company: CompanyDto | any = await this.companiesRepository.createQueryBuilder('companies')
            .where({id: client.companyClientId})
            .leftJoinAndSelect('companies.agents', 'agents')
            .getOne();

            if (!company)
                throw new HttpException('No company found', HttpStatus.NOT_FOUND);
            const noteData = await helper.returnNoteData(client, company);

            if (!noteData)
                throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
            clientDetails.noteData = noteData.data;
            clientDetails.vendorName = vendorsNames.VENDOR_WEALTHBOX;

            const path = `/api/wealthbox/createNote/${clientId}`;
            const options = {
                method: 'POST',
                url: xiloAuthurl + path,
                body: clientDetails,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };
            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async createOpportunity(clientDetails: ClientDetailsDto, clientId: string): Promise<any> {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const client: ClientDto = await this.clientsRepository.createQueryBuilder('clients')
            .where({ id: clientId })
            .leftJoinAndSelect('clients.drivers', 'drivers')
            .leftJoinAndSelect('clients.vehicles', 'vehicles')
            .leftJoinAndSelect('clients.homes', 'homes')
            .getOne();

            if (!client || !client.firstName)
                throw new HttpException('Error creating Wealthbox. No client found or not enough client data', HttpStatus.NOT_FOUND);

            const opportunityData = await helper.returnOpportunityData(client);
            if (!opportunityData)
                throw new HttpException('Invalid Request', HttpStatus.NOT_FOUND);

            clientDetails.opportunityData = opportunityData.data;
            clientDetails.vendorName = vendorsNames.VENDOR_WEALTHBOX;

            const path = `/api/wealthbox/createOpportunity/${clientId}`;
            const options = {
                method: 'POST',
                url: xiloAuthurl + path,
                body: clientDetails,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };
            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async createWorkflow(clientDetails: ClientDetailsDto, clientId: string): Promise<any> {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            if (!token) {
                throw new HttpException('Wealthbox token not found', HttpStatus.NOT_FOUND);
            }
            const client: ClientDto = await this.clientsRepository.createQueryBuilder('clients')
            .where({ id: clientId })
            .leftJoinAndSelect('clients.drivers', 'drivers')
            .leftJoinAndSelect('clients.vehicles', 'vehicles')
            .leftJoinAndSelect('clients.homes', 'homes')
            .getOne();

            if (!client || !client.firstName)
                throw new HttpException('Error creating Wealthbox. No client found or not enough client data', HttpStatus.NOT_FOUND);

            const workFlowData = await helper.returnWorkFlowData(client);
            if (!workFlowData)
                throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);

            clientDetails.workFlowData = workFlowData.data;
            clientDetails.vendorName = vendorsNames.VENDOR_WEALTHBOX;

            const path = `/api/wealthbox/createWorkflow/${clientId}`;
            const options = {
                method: 'POST',
                url: xiloAuthurl + path,
                body: clientDetails,
                json: true,
                headers: {
                    'x-access-token': token,
                },
            };
            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
