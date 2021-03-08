/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { OUTLOOK } from '../../constants/appconstant';
import { ModuleOptions, AuthorizationCode } from 'simple-oauth2';
import { Companies } from '../company/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const scope = 'openid profile offline_access User.Read Mail.Read';

@Injectable({ scope: Scope.REQUEST })
export class OutlookService {
  credentials: ModuleOptions = {
    client: {
      id: OUTLOOK.CLIENT_ID,
      secret: OUTLOOK.CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://login.microsoftonline.com',
      authorizePath: 'common/oauth2/v2.0/authorize',
      tokenPath: 'common/oauth2/v2.0/token',
    },
  };
  oauth2: AuthorizationCode;
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>
  ) {
    this.oauth2 = new AuthorizationCode(this.credentials);
  }
  async getOutLookAuthUrl() {
    try {
      const url = await this.oauth2.authorizeURL({
        redirect_uri: OUTLOOK.REDIRECT_URL,
        scope,
      });
      return url;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async handleAuthGrant() {
    try {
      const decoded = this.request.body.decodedUser;
      const outlookCode = (await this.request.query.code) as string;
      const result = await this.oauth2.getToken({
        code: outlookCode,
        redirect_uri: OUTLOOK.REDIRECT_URL,
        scope,
      });
      if (result.token['access_token'] && result.token['refresh_token']) {
        const payload = {
          outlookAccessToken: result.token['access_token'],
          outlookRefreshToken: result.token['refresh_token'],
        };
        const company = await this.companiesRepository.findOne({
          where: { id: decoded.user.companyUserId },
        });

        if (!company) {
          throw new HttpException(
            'There was an error retreiving the company',
            HttpStatus.BAD_REQUEST
          );
        }

        const updatedCompany = await this.companiesRepository.update(
          company,
          payload
        );
        return updatedCompany;
      }
      const tokens = await this.oauth2.createToken(result);

      const payload = {
        outlookAccessToken: tokens.token['access_token'],
        outlookRefreshToken: tokens.token['refresh_token'],
      };
      const company = await this.companiesRepository.findOne({
        where: { id: decoded.user.companyUserId },
      });

      if (!company) {
        throw new HttpException(
          'There was an error retreiving the company',
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedCompany = await this.companiesRepository.update(
        company,
        payload
      );
      return updatedCompany;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
