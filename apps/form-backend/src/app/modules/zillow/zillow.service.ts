import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as Zillow from 'node-zillow';
import { zillow as zillowConst } from '../../constants/appconstant';
const zwsid = zillowConst.zswid;
const zillow = new Zillow(zwsid);
@Injectable({ scope: Scope.REQUEST })
export class ZillowService {
  constructor(@Inject(REQUEST) private request: Request) {}
  async listZillowData() {
    try {
      if (!this.request.body.fullAddress) {
        throw new HttpException(
          'Error retrieving zillow information. No address sent',
          HttpStatus.BAD_REQUEST
        );
      }

      const fullAddress = this.request.body.fullAddress;

      const parameters = {
        address: fullAddress.streetAddress,
        citystatezip: `${fullAddress.city}, ${fullAddress.state} ${fullAddress.zipCode}`,
        rentzestimate: true,
      };

      const zillowData = await zillow.get('GetDeepSearchResults', parameters);

      if (
        !zillowData ||
        !(zillowData.message && zillowData.message.code == '0')
      ) {
        throw new HttpException(
          'Error retrieving zillow data. No data found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Zillow data retrieved successfully',
        obj: zillowData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
