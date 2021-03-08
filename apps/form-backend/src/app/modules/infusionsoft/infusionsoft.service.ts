import { Injectable, Scope, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as ClientOAuth2 from 'client-oauth2';
import * as jwt from 'jsonwebtoken';
import { Url } from 'url';
import { Clients } from '../../modules/client/client.entity';
import { ClientDto } from '../../modules/client/dto/client.dto';
import { Companies } from '../../modules/company/company.entity';
import { CompanyDto } from '../../modules/company/dto/company.dto';
import * as requestpromise from 'request-promise';
import { infusionSoft } from '../../constants/appconstant';

const { infusionSoftRedirectURI,
    apiUrl,
    infusionsoftClientId: clientId,
    infusionsoftClientSecret: clientSecret
} = infusionSoft;
const redirectURI = infusionSoftRedirectURI;

const oAuth2 = new ClientOAuth2({
    clientId: clientId,
    clientSecret: clientSecret,
    accessTokenUri: 'https://api.infusionsoft.com/token',
    authorizationUri: 'https://signin.infusionsoft.com/app/oauth/authorize',
    redirectUri: redirectURI,
    scopes: [''],
});

@Injectable({ scope: Scope.REQUEST })
export class InfusionsoftService {
    constructor(
        @InjectRepository(Companies)
        private companiesRepository: Repository<Companies>,
        @InjectRepository(Clients)
        private clientsRepository: Repository<Clients>,
        @Inject(REQUEST) private request: Request,
    ) { }

    async getInfusionsoftAuthUrl() {
        try {
            const uri: string = oAuth2.code.getUri();
            return {
                title: 'Auth url sent successfully',
                uri: uri,
            };
        }
        catch (error) {
            throw new HttpException('Error creating infusionsoft contact', HttpStatus.BAD_REQUEST);
        }
    }
    async requestAccessToken() {
        try {
            const uri = redirectURI + `?code=${this.request.query.code}`;
            const token = await oAuth2.code.getToken(uri);
            const queryToken: any = this.request.query.token || this.request.headers['x-access-token'];
            const decoded: any = jwt.decode(queryToken);

            let company = await this.companiesRepository.findOne(decoded.user.companyUserId);
            if (!company)
                throw new HttpException('Error getting token. No company found', HttpStatus.BAD_REQUEST);

            company = Object.assign({}, company, {
                hasInfusionsoftIntegration: true,
                infusionsoftApiRefreshToken: token.refreshToken,
                infusionsoftApiAccessToken: token.accessToken,
            });
            const updatedCompany = await this.companiesRepository.save(company);
            if (!updatedCompany) {
                throw new HttpException('Update Error', HttpStatus.BAD_REQUEST)
            }
            return {
                title: 'Company updated successfuly',
                obj: updatedCompany
            };
        }
        catch (error) {
            throw new HttpException('Error requesting access token', HttpStatus.BAD_REQUEST);
        }
    }
    async handleCreateOrUpdate(companyId: number, clientId: number, token: any) {
        try {
            const company = await this.companiesRepository.findOne(companyId);
            if (!company) {
                return { status: false, error: 'Error upserting contact. No company found' };
            }

            let client: ClientDto = await this.clientsRepository.findOne(clientId);
            if (!client) {
                return { status: false, error: 'Error upserting contact. No client found' };
            }

            let path = '/v1/contacts';
            let method = 'put';
            const data = {
                addresses: [
                    {
                        line1: client.streetAddress,
                        locality: client.city,
                        zip_code: client.postalCd,
                        field: 'BILLING'
                    }
                ],
                birthday: client.birthDate,
                email_addresses: [
                    {
                        email: client.email,
                        field: 'EMAIL1'
                    }
                ],
                family_name: client.lastName,
                given_name: client.firstName,
                phone_numbers: [
                    {
                        number: client.phone,
                        field: 'PHONE1'
                    }
                ],
                source_type: 'WEBFORM'
            }

            if (client.infusionsoftClientId) {
                path = `/v1/contacts/${client.infusionsoftClientId}`;
                method = 'patch';
            } else {
                data['duplicate_option'] = "Email";
            }
            const options = {
                method: method,
                url: apiUrl + path,
                json: data
            };
            const call = await this.request['newToken'].sign(options);
            const response = await requestpromise(call);
            if (!response) {
                return { status: false, error: 'Error upserting contact. API Call failed' };
            }

            const id = response.id;
            client = Object.assign({}, client, { infusionsoftClientId: id });
            await this.clientsRepository.update({ id: clientId }, client);

            return { status: true, response: response };
        } catch (error) {
            return { status: false, error: 'Error creating infusionsoft contact' };
        }
    }
    async createOrUpdate(clientId: number, companyId: number) {
        try {
            const response = await this.handleCreateOrUpdate(companyId, clientId, this.request['newToken']);

            if (!response.status) {
                throw new HttpException('Error creating infusionsoft contact. Method failed', HttpStatus.BAD_REQUEST);
            }
            return {
                title: 'Contact upserted successfully',
                obj: response.response,
            };
        } catch (error) {
            throw new HttpException('Error creating infusionsoft contact', HttpStatus.BAD_REQUEST);
        }
    }
    async handleRefreshAccessToken(companyId: number) {
        try {
            let company = await this.companiesRepository.findOne(companyId);

            if (!company || !company.infusionsoftApiAccessToken || !company.infusionsoftApiRefreshToken)
                return { status: false, error: 'Error refreshing token. No company found' };

            const token = await oAuth2.createToken(
                company.infusionsoftApiAccessToken,
                // company.infusionsoftApiRefreshToken,
                //  'bearer',
                {
                    // data: {
                    access_token: company.infusionsoftApiAccessToken,
                    refresh_token: company.infusionsoftApiRefreshToken,
                    token_type: 'bearer'
                    // }
                }
            );

            const currentDate = new Date();
            const newDate: Date = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
            token.expiresIn(newDate);

            const newToken = await token.refresh();
            company = Object.assign({}, company, {
                infusionsoftApiAccessToken: newToken.accessToken,
                infusionsoftApiRefreshToken: newToken.refreshToken
            });

            await this.companiesRepository.save(company);
            return { status: true, newToken: newToken };
        } catch (error) {
            return { status: false, error: 'Error refreshing token' };
        }
    }
    async refreshAccessToken(companyId: number) {
        try {
            const response = await this.handleRefreshAccessToken(companyId);
            if (!response.status) {
                throw new HttpException('Error refreshing access token. Method failed', HttpStatus.BAD_REQUEST);
            }
            // req.newToken = response.newToken;
            // this.newToken = response.newToken;
            this.request['newToken'] = response.newToken
            return response.newToken
        } catch (error) {
            throw new HttpException('Error refreshing token', HttpStatus.BAD_REQUEST);
        }
    }
    async addToCampaign(companyDto, clientDto) {
        try {
            const path = `/v1/campaigns/${companyDto.campaignId}/sequences/${companyDto.sequenceId}/contacts/${clientDto.contactId}`;
            const token = this.request['newToken'];
            const data = null;
            const options = {
                method: 'post',
                url: apiUrl + path,
                json: data,
            };
            const response = await token.sign(options);

            return {
                title: 'Added contact to campaign successfully',
                obj: response,
            };
        }
        catch (error) {
            throw new HttpException('Error adding infusionsoft contact to campaign', HttpStatus.BAD_REQUEST);
        }
    }
    async addTagToContact(clientId: number) {
        try {
            const response = await this.handleAddTagToContact(clientId, this.request['newToken']);
            if (!response.status)
                throw new HttpException('Error adding tag to contact. Method failed', HttpStatus.BAD_REQUEST);

            return {
                title: 'Added tag to contact successfully',
                obj: response.response,
            };
        } catch (error) {
            throw new HttpException('Error tag to infusionsoft contact', HttpStatus.BAD_REQUEST);
        }
    }
    async handleAddTagToContact(clientId: number, token: any) {
        try {
            const client: ClientDto = await this.clientsRepository.createQueryBuilder("clients")
                .where({ id: clientId })
                .select(['id', 'infusionsoftClientId', 'infusionsoftTagId'])
                .getOne();

            if (!client || !client.infusionsoftClientId || !client.infusionsoftTagId) {
                return { status: false, error: 'Error adding tag to contact. Data needed not found' };
            }

            const data = {
                ids: [client.infusionsoftClientId]
            };
            const path = `/v1/tags/${client.infusionsoftTagId}/contacts`;
            const options = {
                method: 'post',
                url: apiUrl + path,
                json: data,
            };
            const call = await this.request['newToken'].sign(options);
            const response = await requestpromise(call);

            return { status: true, response: response };
        } catch (error) {
            return { status: false, error: 'Error tag to infusionsoft contact' };
        }
    }
    async listTags() {
        try {
            const path = '/v1/tags';
            const token = this.request['newToken'];
            const options = {
                method: 'get',
                url: apiUrl + path,
            };
            const call = await token.sign(options);
            const response = await requestpromise(call);
            const tags = JSON.parse(response);

            if (!tags.tags)
                throw new HttpException('Error retrieving tags. No tags found', HttpStatus.BAD_REQUEST);

            return {
                title: 'Listed tags successfully',
                obj: tags.tags,
            };
        } catch (error) {
            throw new HttpException('Error listing infusionsoft tags', HttpStatus.BAD_REQUEST);
        }
    }
}
