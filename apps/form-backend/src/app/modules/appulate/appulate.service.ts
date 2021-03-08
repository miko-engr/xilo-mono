import { Injectable, Inject, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as request from 'request-promise';
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';
import { AppulateHelper } from './appulate.helper';
import { ContractDetailsDto } from './dto/contract-details.dto';

@Injectable({ scope: Scope.REQUEST })
export class AppulateService {
    constructor(
        @Inject(REQUEST) private request:Request,
        private appulateHelper: AppulateHelper,
    ) {}
    
    async createContact(contractDetails: ContractDetailsDto): Promise<any> {
      try {
        const token = this.request.body.token || this.request.query.token || this.request.headers['x-access-token'];

        await this.appulateHelper.getPdFFormZipByBuffer(this.request.body, this.request.params.clientId, async (zipFileError, zipFilebuffer) => {
          if (zipFileError) throw new HttpException(zipFileError, HttpStatus.BAD_REQUEST);
          contractDetails.zipFilebuffer = zipFilebuffer;
          contractDetails.vendorName = vendorsNames.VENDOR_APPULATE;
          const path = '/api/appulate/upload';
          const options = {
            method: 'PUT',
            url: xiloAuthurl + path,
            body: contractDetails,
            json: true,
            headers: {
              'x-access-token': token,
            },
          };
          const response = await request(options);
          return response;
        });
      } catch (error) {
        throw new HttpException('Error creating contact', HttpStatus.BAD_REQUEST);
      }
    }
}