import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Clients } from '../client/client.entity';
import { Homes } from '../home/homes.entity';
import { Answers } from '../../entities/Answers';
import { Integrations } from '../integration/Integrations.entity';
import { vendorsNames, xiloAuthurl } from '../../constants/appconstant';
import * as request from 'request-promise';
import * as path from 'path';
import { V2EzlynxHelper } from './helper/v2-ezlynx.helper';
import { EzlynxService } from '../ezlynx/ezlynx.service';
import { EzlynxValidate } from './helper/ezlynx.validate';
@Injectable({ scope: Scope.REQUEST })
export class V2EzlynxService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(Homes)
    private homesRepository: Repository<Homes>,
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
    @InjectRepository(Integrations)
    private integrationsRepository: Repository<Integrations>,
    private ezHelper: V2EzlynxHelper,
    private ezlynxController: EzlynxService,
    private ezValidator: EzlynxValidate
  ) {}
  async createApplicant(clientId: number, type: string) {
    try {
      const token =
        this.request.body.token ||
        this.request.query.token ||
        this.request.headers['x-access-token'];

      const response = await this.createApplicantMethod({
        clientId: clientId,
        type: type,
        token: token,
      });

      if (!response.status) {
        console.log(response['error']);
        const errorObj = {
          error: response['error'],
          validations: response['validations'],
        };
        throw new HttpException(
          JSON.stringify(errorObj),
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'EZlynx applicant pushed successfully',
        responses: response['responses'],
        validations: response['validations'],
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createApplicantMethod(bodyData: any) {
    try {
      const token = bodyData.token;
      const clientId = bodyData.clientId;
      const type = bodyData.type;
      const client = await this.clientsRepository.findOne({
        where: { id: clientId },
        relations: ['drivers', 'vehicles', 'business', 'incidents'],
        order: { drivers: 'ASC', vehicles: 'ASC' },
      });

      if (!client) {
        return { status: false, error: 'No client found' };
      }

      if (!client.formClientId) {
        return {
          status: false,
          error: 'No form found on this applicant. Please contact support',
        };
      }

      if (client.ezlynxId) {
        // TODOS TOKEN HAS EXPIRED VALIDATION
        // Incorrect Credentials validation
        // Data based validation
        const res = await this.ezlynxController.createPersonalApplicantMethod(
          token,
          client.id
        );
        if (!res.status) {
          const error = res.error.error.message;
          console.log(error);
          const validationIssue = {
            vendorName: 'EZLYNX',
            lob: 'Personal',
            errorType: 'credentials',
            error: error,
            createdAt: new Date().getTime(),
          };
          if (
            client.validations &&
            client.validations.length &&
            client.validations.length > 0
          ) {
            const newValids = [...client.validations, validationIssue];
            await this.clientsRepository.save({
              ...client,
              ...{
                validations: newValids,
              },
            });
          }
        }
      }

      const homes = await this.homesRepository.find({
        where: {
          clientHomeId: client.id,
          city: Not(IsNull()),
        },
        order: { createdAt: 'ASC' },
      });

      if (homes) {
        client.homes = homes;
      }

      const requests = [];

      function arrayExists(arr) {
        return client[arr] && client[arr].length && client[arr].length > 0;
      }

      function fieldExists(field, object) {
        return (
          client[object] &&
          client[object][0] &&
          (client[object][0][field] || client[object][0][field] === 0)
        );
      }

      function lobExists(type) {
        return (
          client.typesOfInsurances &&
          client.typesOfInsurances.length &&
          client.typesOfInsurances.length > 0 &&
          client.typesOfInsurances.includes(type)
        );
      }

      if (type === 'Home' || type === 'Auto') {
        requests.push(type);
      } else {
        if (
          (arrayExists('vehicles') &&
            fieldExists('vehicleModelYear', 'vehicles')) ||
          lobExists('Auto')
        ) {
          requests.push('Auto');
        }

        if (arrayExists('homes') && fieldExists('city', 'homes')) {
          requests.push('Home');
        }
      }

      const masterResponse = [];
      const validations = [];
      let that = this;
      async function updateValidations(requestString, errorType) {
        let newValidations = [];
        if (
          client.validations &&
          client.validations.length &&
          client.validations.length > 0
        ) {
          newValidations = client.validations.filter(
            (val) => !(val.vendorName === 'EZLYNX' && val.lob === requestString)
          );
        }
        if (validations.length > 0) {
          newValidations.push(...validations);
        }

        await that.clientsRepository.save({
          ...client,
          ...{ validations: newValidations },
        });
        client.validations = newValidations;
      }

      async function setValidations(requestString, errorBody, data) {
        const validation = await that.ezValidator.validate(
          client.id,
          requestString
        );
        if (
          validation.status &&
          validation.data &&
          validation.data.length > 0
        ) {
          for (let item of validation.data) {
            const oneValidation = {
              lob: requestString,
              createdAt: new Date().getTime(),
              error: item.error,
              dataIn: data.data,
              expectedValues: item.expected,
              integrationIds: item.ids,
              fieldDataIn: item.entered,
              errorType: item.errorType,
              vendorName: 'EZLYNX',
            };
            validations.push(oneValidation);
          }
        } else if (errorBody.error && typeof errorBody.error === 'string') {
          // UNKNOWN ISSUE
          validations.push({
            lob: requestString,
            createdAt: new Date().getTime(),
            error: errorBody.error,
            dataIn: data.data,
            errorType: errorBody.errorType,
            vendorName: 'EZLYNX',
          });
        }

        await updateValidations(requestString, errorBody.errorType);

        return validation;
      }

      for (let i = 0; i < requests.length; i++) {
        const requestString = requests[i];

        const data = await this.ezHelper.returnData(client, requestString);

        if (!data.status) {
          return { status: false, error: data.error };
        }

        if (
          requestString === 'Home' &&
          (!client.homes || !client.homes[0] || !client.homes[0].city)
        ) {
          if (requests.length > 1) {
            // NO HOME ADDRESS VALIDATION
            validations.push({
              lob: requestString,
              createdAt: new Date().getTime(),
              error: 'No property address found on this applicant',
              dataIn: data.data,
              errorType: 'data',
              vendorName: 'EZLYNX',
            });

            await updateValidations(requestString, 'data');

            masterResponse.push({
              status: 'Failed',
              error: 'No property address found on this applicant',
              lob: requestString,
            });
          } else {
            return {
              status: false,
              error: 'No property address found on this applicant',
            };
          }
        }

        if (client && client.clientAgentId && data.data) {
          data['agent'] = client.clientAgentId;
        }

        data['vendorName'] = vendorsNames.VENDOR_EZLYNX;

        let path = `/api/ezlynx/v2/upsert/${requestString}/${clientId}`;

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
          body: data,
          json: true,
          headers: {
            'x-access-token': token,
          },
        };

        const response = await request(options);

        if (response.body && response.body.status === 'Succeeded') {
          await this.clientsRepository.save({
            ...client,
            ...{
              ezlynxUrl: response.body.url,
            },
          });
          masterResponse.push({
            status: 'Succeeded',
            url: response.body.url,
            lob: requestString,
          });

          await setValidations(requestString, response.body, data);
        } else if (
          response.body.errorType &&
          response.body.errorType === 'credentials'
        ) {
          // VALIDATE USERNAME
          validations.push({
            lob: requestString,
            createdAt: new Date().getTime(),
            error: response.body.error,
            dataIn: data.data,
            errorType: response.body.errorType,
            vendorName: 'EZLYNX',
          });

          masterResponse.push({
            status: 'Failed',
            error: response.body.error,
            lob: requestString,
          });

          await updateValidations(requestString, 'credentials');
        } else {
          // VALIDATE EZLYNX DATA
          const validation = await setValidations(
            requestString,
            response.body,
            data
          );

          masterResponse.push({
            status: 'Failed',
            error: response.body.error,
            lob: requestString,
            validation: validation,
          });
        }
      }

      const respObj = {
        status: true,
        responses: masterResponse,
        validations: client.validations,
      };

      for (let resp of masterResponse) {
        if (resp.status === 'Failed') {
          respObj.status = false;
          respObj['error'] = resp.error;
        }
      }

      return respObj;
    } catch (error) {
      return { status: false, error: error };
    }
  }
  async setDefaults() {
    try {
      const ezSchema = require(path.join(
        __dirname,
        `../assets/schema/ez-${this.request.params.type}.js`
      ));
      const answers = await this.answersRepository.find({
        where: { formAnswerId: this.request.params.id },
        select: ['id', 'propertyKey', 'objectName', 'formAnswerId'],
      });

      const lob = this.request.params.type === 'auto' ? 'Auto' : 'Home';

      const integrations = await this.integrationsRepository.find({
        where: {
          formIntegrationId: this.request.params.id,
          parentGroup: lob,
          vendorName: 'EZLYNX',
        },
      });

      if (!answers) {
        throw new HttpException(
          'Error. No answers found',
          HttpStatus.BAD_REQUEST
        );
      }

      function isDuplicate(eInt, int) {
        return (
          eInt.group === int.group &&
          eInt.element === int.element &&
          eInt.xiloObject === int.xiloObject &&
          eInt.xiloKey === int.xiloKey &&
          JSON.stringify(eInt.transformation) ===
            JSON.stringify(int.transformation)
        );
      }

      let created = 0;

      for (let int of ezSchema) {
        const existingInt = integrations.some((eInt) => isDuplicate(eInt, int));
        if (!existingInt) {
          const answerIndex = answers.findIndex(
            (ans) =>
              ans.propertyKey === int.xiloKey &&
              ans.objectName === int.xiloObject
          );
          if (answerIndex > -1) {
            const answer = answers[answerIndex];
            delete int.id;
            int.answerIntegrationId = answer.id;
            int.formIntegrationId = this.request.params.id;
            await this.integrationsRepository.save(int);
            created += 1;
          }
        }
      }

      return {
        title: 'Forms defaulted to EZLynx successfully',
        count: created,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getFields() {
    try {
      const response = await this.ezHelper.getFieldsMethod(
        this.request.params.type,
        this.request.params.field
      );

      if (!response.status) {
        throw new HttpException(
          'Error getting fields. Handler failed',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Fields retrieved successfully',
        obj: response.obj,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
