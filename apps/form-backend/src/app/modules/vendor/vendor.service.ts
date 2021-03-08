import { Injectable, Scope, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as request from 'request-promise';
import { Companies } from '../company/company.entity';
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';

@Injectable({ scope: Scope.REQUEST })
export class VendorService {

    constructor(
        @InjectRepository(Companies)
        private companyRepository: Repository<Companies>,
        @Inject(REQUEST) private request: Request
    ) {}

    async create() {
        try {
            const decoded = this.request.body.decodedUser;

            if (!decoded.user.companyUserId || !this.request.body.vendorName || !this.request.body.username)
                throw new HttpException('Invalid data!', HttpStatus.INTERNAL_SERVER_ERROR)

            const vendorList = Object.values(vendorsNames);
            if (vendorList.indexOf(this.request.body.vendorName) < 0)
                throw new HttpException('Vendor name not valid!', HttpStatus.INTERNAL_SERVER_ERROR)

            this.request.body.companyId = decoded.user.companyUserId;
            const path = '/api/vendor/add';
            const options = {
                method: 'POST', url: xiloAuthurl + path, body: this.request.body, json: true,
            };

            const response = await request(options)
                            .catch((error) => { throw new HttpException(error.message, HttpStatus.BAD_REQUEST) });

            const company = await this.companyRepository.findOne({
                where: { id: decoded.user.companyUserId },
            });
            if (this.request.body.vendorName === 'EZLYNX') {
            await this.companyRepository.update(company.id, { ezlynxIntegrationId: response.newVendorID });
            } else if (this.request.body.vendorName === 'QQ') {
            await this.companyRepository.update(company.id, { qqIntegrationId: response.newVendorID });
            } else if (this.request.body.vendorName === 'VENDOR_PROGRESSIVE_DE_RATER') {
            let newArray = [];
                if (company.raterIntegrationIds !== null) {
                    newArray = company.raterIntegrationIds;
                    newArray.push(response.newVendorID);
                } else {
                    newArray.push(response.newVendorID);
                }
                await this.companyRepository.update(company.id, { raterIntegrationIds: newArray });
            }
          return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async upsert() {
        try {
            const decoded = this.request.body.decodedUser;

            if (!decoded.user.companyUserId || (!this.request.body.username && !this.request.body.accessToken))
                throw new HttpException('Invalid data!', HttpStatus.BAD_REQUEST)

            const vendorList = Object.values(vendorsNames);
            if (vendorList.indexOf(this.request.body.vendorName) < 0)
                throw new HttpException('Vendor name not valid!', HttpStatus.BAD_REQUEST)


            this.request.body.companyId = decoded.user.companyUserId;
            const path = '/api/vendor/upsert';
            const options = {
                method: 'PATCH', url: xiloAuthurl + path, body: this.request.body, json: true,
            };

            const response = await request(options)
                .catch(error => { throw new HttpException(error.message, HttpStatus.BAD_REQUEST) });

            const company = await this.companyRepository.findOne({
                where: { id: decoded.user.companyUserId },
            });

            if (response.status && response.status === 'create') {
                if (this.request.body.vendorName === 'EZLYNX') {
                    await this.companyRepository.update(company.id,{ ezlynxIntegrationId: response.newVendorID });
                } else if (this.request.body.vendorName === 'QQ') {
                await this.companyRepository.update(company.id,{ qqIntegrationId: response.newVendorID });
            } else if (this.request.body.vendorName === 'VENDOR_PROGRESSIVE_DE_RATER') {
                let newArray = [];
                if (company.raterIntegrationIds !== null) {
                    newArray = company.raterIntegrationIds;
                    newArray.push(response.newVendorID);
                } else {
                    newArray.push(response.newVendorID);
                }
                await this.companyRepository.update(company.id ,{ raterIntegrationIds: newArray });
            } else if (this.request.body.vendorName === 'TURBORATER') {
                await this.companyRepository.update(company.id ,{ turboraterIntegrationId: response.newVendorID });
            } else if (this.request.body.vendorName === 'QUOTERUSH') {
                await this.companyRepository.update(company.id ,{ quoteRushIntegrationId: response.newVendorID });
            } else if (this.request.body.vendorName === 'CABRILLO') {
                await this.companyRepository.update(company.id ,{ cabrilloIntegrationId: response.newVendorID });
            } else if (this.request.body.vendorName === 'NOWCERTS') {
                await this.companyRepository.update(company.id ,{ nowCertsIntegrationId: response.newVendorID });
            } else if (this.request.body.vendorName === 'COMMERCIAL_EZLYNX') {
                await this.companyRepository.update(company.id ,{ commercialEzlynxIntegrationId: response.newVendorID });
            }
        }
      return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBestRate() {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const clientId = this.request.query.clientId ? `?clientId=${this.request.query.clientId}` : '';
            const path = '/api/rate/list/best' + clientId;
            const options = {
                method: 'GET',
                url: xiloAuthurl + path,
                body: this.request.body,
                json: true,
                headers: { 'x-access-token': token },
            };
          const response = await request(options);
          return response;
        } catch (error) {
           throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async getAllRates() {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];
            const clientId = this.request.query.clientId ? `?clientId=${this.request.query.clientId}` : '';
            const path = '/api/rate/list/all' + clientId;
            const options = {
                method: 'GET',
                url: xiloAuthurl + path,
                body: this.request.body,
                json: true,
                headers: { 'x-access-token': token },
            };
          const response = await request(options);
          return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getVendorNames() {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];

            const decoded = this.request.body.decodedUser;
            const companyId = decoded.user ? decoded.user.companyUserId : decoded.agent ?  
                        decoded.agent.companyAgentId : decoded.client.companyClientId;
            const path = '/api/vendor/getAll';
            if (!companyId)
                throw new HttpException('Error with the company id in token', HttpStatus.INTERNAL_SERVER_ERROR)

            this.request.body.companyId = companyId;
            const options = {
                method: 'PUT',
                url: xiloAuthurl + path,
                body: this.request.body,
                json: true,
                headers: { 'x-access-token': token },
            };
            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRateById() {
        try {
            const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];

            const path = `/api/rate/${this.request.params.clientId}`;
            const options = {
                method: 'GET',
                url: xiloAuthurl + path,
                json: true,
                headers: {
                    'x-access-token': token,
                },
                };
            const response = await request(options);
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
