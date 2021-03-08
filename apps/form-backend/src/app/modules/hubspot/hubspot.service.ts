import {
  HttpException,
  HttpStatus
} from '@nestjs/common';
import * as request from 'request-promise';
import { HubspotDto } from './dto/hubspot.dto';

export class HubspotService {
  async createAndUpdate (hubspotBody: HubspotDto) {
    try {
      const { client, company } = hubspotBody
      
      const data = {
        properties: [
          {
            property: 'firstname',
            value: client.firstName
          },
          {
            property: 'lastname',
            value: client.lastName
          },
          {
            property: 'phone',
            value: client.phone
          },
          {
            property: 'address',
            value: `${client.streetNumber} ${client.streetName}`
          },
          {
            property: 'city',
            value: client.city
          },
          {
            property: 'state',
            value: client.stateCd
          },
          {
            property: 'zip',
            value: client.postalCd
          }
        ]
      }
      const options = {
        method: 'post',
        body: data,
        json: true,
        url: `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${client.email}/?hapikey=${company.hubspotApiKey}&userId=${company.userId}`
      }

      const response = await request(options)
      if (!response) {
        throw new HttpException('Error creating hubspot contact', HttpStatus.BAD_REQUEST)
      }
      return { status: true, response: response }
    } catch (error) {
      return { status: false, error }
    }
  }
}
