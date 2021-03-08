import {
  Injectable,
  Scope,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between, Not, getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import aws from 'aws-sdk';
import { Clients } from './client.entity';
import { Companies } from '../company/company.entity';
import clean = require('clean-deep');
import { LifecycleAnalytics } from '../lifecycle-analytics/LifecycleAnalytics.entity';
import { Flows } from '../flow/flows.entity';
import { Emails } from '../email/emails.entity';
import { TextMessages } from '../text-messages/TextMessages.entity';
import { Documents } from '../../entities/Documents';
import { Agents } from '../agent/agent.entity';
import { Homes } from '../home/homes.entity';
import { ClientDto } from './dto/client.dto';
import { Users } from '../user/user.entity';
import { awsCredential, encryption } from '../../constants/appconstant';
import crypto from 'crypto';
import { join } from 'path';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { IntegrationValidator } from '../v2-ezlynx/helper/integration-validator';
import * as moment from 'moment';
import { REQUEST } from '@nestjs/core';
import { Request, response } from 'express';
import { FlowHelper } from '../flow/helper/flow.helper';
import * as simpleencryptor from 'simple-encryptor';
const encryptor = simpleencryptor.createEncryptor(encryption.key);
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import cleaner from 'clean-deep';

@Injectable({ scope: Scope.REQUEST })
export class ClientService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(LifecycleAnalytics)
    private lifeCycleAnalyticRepository: Repository<LifecycleAnalytics>,
    @InjectRepository(Flows) private flowRepository: Repository<Flows>,
    @InjectRepository(Emails) private emailRepository: Repository<Emails>,
    @InjectRepository(TextMessages)
    private textMessagesRepository: Repository<TextMessages>,
    @InjectRepository(Documents)
    private documentRepository: Repository<Documents>,
    @InjectRepository(Agents) private agentRepository: Repository<Agents>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Homes) private homeRepository: Repository<Homes>,
    @InjectRepository(Lifecycles)
    private lifecyclesRepository: Repository<Lifecycles>,
    private integrationValidator: IntegrationValidator,
    private flowHelper: FlowHelper,
    @Inject(REQUEST) private request: Request
  ) {}

  async list() {
    try {
      const clientsList = await this.clientRepository.find();

      if (!clientsList) {
        throw new HttpException(
          'Client List not found!',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Clients retrieved successfully',
        obj: clientsList,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async userDeleteClient(clientId: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository.findOne({
        id: clientId,
        companyClientId: decoded.user.companyUserId,
      });

      if (!client)
        throw new HttpException('Client not found!', HttpStatus.BAD_REQUEST);

      const deletedClient = await this.clientRepository.delete({
        id: clientId,
        companyClientId: decoded.user.companyUserId,
      });

      if (deletedClient.affected !== 1) {
        throw new HttpException(
          'There was an error retrieving client!',
          HttpStatus.BAD_REQUEST
        );
      }

      return { message: 'Client removed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async agentDeleteClient(clientId: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository.findOne({
        id: clientId,
        companyClientId: decoded.agent.companyAgentId,
      });

      if (!client)
        throw new HttpException('Client not found!', HttpStatus.BAD_REQUEST);

      const deletedClient = await this.clientRepository.delete({
        id: clientId,
        companyClientId: decoded.agent.companyAgentId,
      });

      if (deletedClient.affected !== 1)
        throw new HttpException(
          'There was an error retrieving client!',
          HttpStatus.BAD_REQUEST
        );

      return { message: 'Client removed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createToken(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository.findOne({
        id: id,
        companyClientId: decoded.companyId,
      });

      if (!client) {
        throw new HttpException(
          'Error creating token. No client found',
          HttpStatus.BAD_REQUEST
        );
      }
      const generatedtoken = await jwt.sign(
        { client: { id: client.id, companyClientId: client.companyClientId } },
        'secret',
        { expiresIn: '7d' }
      );
      return {
        title: 'Client token created successfully',
        obj: generatedtoken
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteMultipleProspects(clientIdsList) {
    try {
      const deletedClient = await this.clientRepository.delete(
        clientIdsList.clientIds
      );
      if (deletedClient.affected === 0)
        throw new HttpException(
          'Error while deleting client. No clients found',
          HttpStatus.BAD_REQUEST
        );

      return { 
        message: 'Clients deleted successfully',
        obj: response
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listOne(companyID) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companyRepository.findOne({
        companyId: companyID,
      });

      if (!company) {
        throw new HttpException(
          'No company found with that id',
          HttpStatus.BAD_REQUEST
        );
      }

      const clientId =
        typeof decoded.client !== 'undefined' &&
        decoded.client &&
        decoded.client.id
          ? decoded.client.id
          : null;
      const companyId = company.id;
      if (!clientId) {
        throw new HttpException(
          'Error finding client. No client ID',
          HttpStatus.BAD_REQUEST
        );
      }

      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: clientId, companyClientId: companyId })
        .leftJoinAndSelect('client.locations', 'location')
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.incidents', 'incidents')
        .leftJoinAndSelect(
          'client.recreationalVehicles',
          'recreationalVehicles'
        )
        .leftJoinAndSelect('client.policies', 'policies')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.homes', 'home')
        .orderBy({
          'drivers.createdAt': 'ASC',
          'vehicles.createdAt': 'ASC',
          'incidents.createdAt': 'ASC',
          'recreationalVehicles.createdAt': 'ASC',
          'policies.createdAt': 'ASC',
        })
        .getOne();

      if (!client) {
        throw new HttpException('No client found', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Client retrieved successfully',
        obj: client,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listByUser() {
    try {
      const decoded = this.request.body.decodedUser;
      const clients = await this.clientRepository
        .createQueryBuilder('client')
        .where({ companyClientId: decoded.user.companyUserId })
        .leftJoinAndSelect('client.agents', 'agents')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .leftJoinAndSelect('client.notes', 'notes')
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.rates', 'rates')
        .getMany();

      return {
        message: 'Clients retrieved successfully',
        obj: clients,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listByAgent() {
    try {
      const decoded = this.request.body.decodedUser;
      const clients = await this.clientRepository
        .createQueryBuilder('client')
        .where({ companyClientId: decoded.agent.companyAgentId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.agents', 'agents')
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .leftJoinAndSelect('client.notes', 'notes')
        .getMany();
      return {
        message: 'Clients retrieved successfully',
        obj: clients,
      }
      return clients;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listOneClient(clientId) {
    try {
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.locations', 'location')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.agents', 'agents')
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .leftJoinAndSelect('client.homes', 'home')
        .getOne();

      if (!client) {
        throw new HttpException('No client found', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Client found successfully',
        obj: client,
      } 
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listOneByAgent(clientId) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: clientId, companyClientId: decoded.agent.companyAgentId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.agents', 'agents')
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .leftJoinAndSelect('client.homes', 'home')
        .leftJoinAndSelect('client.locations', 'location')
        .leftJoinAndSelect('client.incidents', 'incidents')
        .leftJoinAndSelect(
          'client.recreationalVehicles',
          'recreationalVehicles'
        )
        .leftJoinAndSelect('client.policies', 'policies')
        .leftJoinAndSelect('client.notes', 'notes')
        .orderBy({
          'drivers.createdAt': 'ASC',
          'vehicles.createdAt': 'ASC',
          'incidents.createdAt': 'ASC',
          'recreationalVehicles.createdAt': 'ASC',
          'policies.createdAt': 'ASC',
        })
        .getOne();

      if (!client) {
        throw new HttpException('No client found', HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'Client retrieved successfully',
        obj: client,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listOneByUser(clientId) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: clientId, companyClientId: decoded.user.companyAgentId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.agents', 'agents')
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .leftJoinAndSelect('client.homes', 'home')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.locations', 'location')
        .leftJoinAndSelect('client.incidents', 'incidents')
        .leftJoinAndSelect(
          'client.recreationalVehicles',
          'recreationalVehicles'
        )
        .leftJoinAndSelect('client.policies', 'policies')
        .leftJoinAndSelect('client.notes', 'notes')
        .orderBy({
          'drivers.createdAt': 'ASC',
          'vehicles.createdAt': 'ASC',
          'incidents.createdAt': 'ASC',
          'recreationalVehicles.createdAt': 'ASC',
          'policies.createdAt': 'ASC',
        })
        .getOne();

      if (!client) {
        throw new HttpException('No client found', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Client found',
        obj: client
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async agentUpdateClient(clientBody) {
    try {
      const client = await this.clientRepository.findOne({ id: clientBody.id });
      if (!client)
        throw new HttpException('Client not found!', HttpStatus.BAD_REQUEST);

      const clientResult = await this.clientRepository.save(clientBody);
      return {
        title: 'Client updated successfully',
        obj: clientResult
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateClientAgent(clientBody: ClientDto) {
    try {
      const updatedClient = await this.lifeCycleAnalyticRepository
        .createQueryBuilder('LifecycleAnalytics')
        .update(LifecycleAnalytics)
        .set({ agentLifecycleAnalyticId: clientBody.clientAgentId })
        .where('clientLifecycleAnalyticId = :id', { id: clientBody.id })
        .execute();
        return {
          title: 'client agent updated successfully.',
          obj: updatedClient,
        };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addToNewLeadFlow() {
    try {
      const decoded = this.request.body.decodedUser;
      const flows = await this.flowRepository.findOne({
        companyFlowId: decoded.client.companyClientId,
        isNewClientFlow: true,
        isEnabled: true,
      });
      let response;
      if (!flows)
        throw new HttpException('No flows found', HttpStatus.BAD_REQUEST);
      else {
        const client = await this.clientRepository.findOne({
          id: decoded.user.id,
          formClientId: null,
        });
        if (client) {
          await this.flowHelper.addToFlow(flows.id, decoded.client.id, decoded.client.companyClientId);
          response = { message: 'Newleadflow added successfully.' };
        } else {
          response = { message: 'Newleadflow already added.' };
        }
      }
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getClientFlows(id) {
    try {
      const decoded= this.request.body.decodedUser;
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: id, companyClientId: decoded.user.companyUserId })
        .leftJoinAndSelect('client.flows', 'flows')
        .getOne();

      const AFQuery = {
        companyFlowId: decoded.user.companyUserId,
        isEnabled: true,
      };
      if (client.flows) {
        const emails = await this.emailRepository.find({
          where: {
            flowEmailId: client.flows.id,
            clientEmailId: id,
          },
        });
        const modifiedEmails = emails.map((item) => {
          item['isEmail'] = true;
          return item;
        });
        const messages = await this.textMessagesRepository.find({
          where: {
            flowTextMessageId: client.flows.id,
            clientTextMessageId: id,
          },
        });
        const emailsAndmsgs = [...modifiedEmails, ...messages];
        emailsAndmsgs.sort((a, b) => +a.scheduledDate - +b.scheduledDate);
        if (emailsAndmsgs.length) {
          const d2 = new Date();
          const d1 = new Date(emailsAndmsgs[0].scheduledDate);
          const timeDiff = d1.getTime() - d2.getTime();
          if (0 < timeDiff) {
            client.flows['daysInFlow'] = Math.ceil(
              timeDiff / (1000 * 3600 * 24)
            );
          } else {
            client.flows['daysInFlow'] = 0;
          }
        }

        const emailOrMsg = emailsAndmsgs.find(
          (item) => item.replyStatus == null
        );
        if (emailOrMsg) {
          client.flows['nextStep'] = emailOrMsg['isEmail']
            ? {
                type: `Email (${emailOrMsg['subject']})`,
                scheduleDate: emailOrMsg.scheduledDate,
              }
            : { type: 'Text Message', scheduleDate: emailOrMsg.scheduledDate };
        }
        AFQuery['id'] = Not(client.flows.id);
      }

      const availableFlow = await this.flowRepository.find(AFQuery);
      availableFlow.sort(
        (a, b) =>
          +b.isEnabled - +a.isEnabled || +b.isNewClientFlow - +a.isNewClientFlow
      );
      return {
        currentFlow: {
          title: client.flows
            ? 'Current flow retrieved successfully'
            : 'No current flow available',
          obj: client.flows,
        },
        availableFlow: {
          title: availableFlow.length
            ? 'Available flow retrieved successfully'
            : 'No flow available',
          obj: availableFlow,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSignedDocumentUrl(documentId) {
    try {
      const document = await this.documentRepository.findOne({
        id: documentId,
      });
      if (!document)
        throw new HttpException(
          'No document found with this Id!',
          HttpStatus.BAD_REQUEST
        );

      const s3 = new aws.S3({
        accessKeyId: awsCredential.accessKeyId,
        secretAccessKey: awsCredential.secretAccessKey,
        region: awsCredential.region,
      });

      const params = {
        Bucket: 'xilo-secure',
        Key: document.objName,
        Expires: 1 * 60,
      };
      let response;
      await s3.getSignedUrl('getObject', params, function (err, url) {
        if (err) {
          throw new HttpException(
            'Pre-Signed URL error',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        } else {
          response = {
            success: true,
            url: url,
          };
        }
      });
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFromFlow() {
    try {
      const decoded = this.request.body.decodedUser;
      const response = await this.flowHelper.removeFromFlow(this.request.params.clientId, decoded.user.companyUserId);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listByMessages() {
    try {
      const decoded = this.request.body.decodedUser;
      const agent = await this.agentRepository.findOne({
        id: decoded.agent.id,
      });

      if (!agent) {
        throw new HttpException(
          'Error finding clients. No agent found',
          HttpStatus.BAD_REQUEST
        );
      }

      const whereObj = {
        companyClientId: agent.companyAgentId,
      };

      if (!agent.canSeeAllClients) {
        whereObj['clientAgentId'] = agent.id;
      }

      const textWhereObj = {
        companyClientId: agent.companyAgentId,
      };
      // textWhereObj[Op.and].push({'$emails$': null})
      const textClients = await this.clientRepository
        .createQueryBuilder('client')
        .where(textWhereObj)
        .leftJoinAndSelect(
          'client.textMessages',
          'textMessages',
          'textMessages.scheduledDate <= :scheduledDate',
          { scheduledDate: new Date() }
        )
        .leftJoinAndSelect('client.emails', 'emails')
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .orderBy({
          'client.createdAt': 'DESC',
          'textMessages.scheduledDate': 'DESC',
          'emails.scheduledDate': 'DESC',
        })
        .getMany();
      const emailWhereObj = { companyClientId: agent.companyAgentId };
      // emailWhereObj[Op.and].push({'$textMessages$': null})

      const emailClients = await this.clientRepository
        .createQueryBuilder('client')
        .where(emailWhereObj)
        .leftJoinAndSelect('client.textMessages', 'textMessages')
        .leftJoinAndSelect(
          'client.emails',
          'emails',
          'emails.scheduledDate <= :scheduledDate',
          { scheduledDate: new Date() }
        )
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .orderBy({
          'client.createdAt': 'DESC',
          'textMessages.scheduledDate': 'DESC',
          'emails.scheduledDate': 'DESC',
        })
        .getMany();

      const textAndEmailClients = await this.clientRepository
        .createQueryBuilder('client')
        .where(whereObj)
        .leftJoinAndSelect(
          'client.textMessages',
          'textMessages',
          'textMessages.scheduledDate <= :scheduledDate',
          { scheduledDate: new Date() }
        )
        .leftJoinAndSelect(
          'client.emails',
          'emails',
          'emails.scheduledDate <= :scheduledDate',
          { scheduledDate: new Date() }
        )
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .orderBy({
          'client.createdAt': 'DESC',
          'textMessages.scheduledDate': 'DESC',
          'emails.scheduledDate': 'DESC',
        })
        .getMany();

      if (!textClients && !emailClients && !textAndEmailClients) {
        throw new HttpException(
          'Error finding clients. No clients found',
          HttpStatus.BAD_REQUEST
        );
      }

      const clients = [];
      clients.push(...textClients);
      clients.push(...emailClients);
      clients.push(...textAndEmailClients);
      return {
        title: 'Clients found with messages',
        obj: clients
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async personEnrichment() {
    try {
      const decoded = this.request.body.decodedUser;
      // Check requested clientId and decoded token client id is same or not
      if (
        decoded.decodedUser &&
        decoded.decodedUser.client &&
        decoded.decodedUser.client.id
      ) {
        const clientDetails = await this.clientRepository.findOne({
          id: decoded.decodedUser.client.id,
        });

        // Fetch home details which is attached to decoded token client id
        const clientHomeDetails = await this.homeRepository.findOne({
          clientHomeId: decoded.decodedUser.client.id,
        });

        let homeAddress = {};
        if (clientHomeDetails) {
          homeAddress = {
            streetName: clientHomeDetails.streetName
              ? clientHomeDetails.streetName
              : null,
            streetNumber: clientHomeDetails.streetNumber
              ? clientHomeDetails.streetNumber
              : null,
            streetAddress: clientHomeDetails.streetAddress
              ? clientHomeDetails.streetAddress
              : null,
            city: clientHomeDetails.city ? clientHomeDetails.city : null,
            postalCd: clientHomeDetails.zipCode
              ? clientHomeDetails.zipCode
              : null,
          };
        }

        if (!clientDetails) {
          throw new HttpException(
            'There was an error retrieving client',
            HttpStatus.BAD_REQUEST
          );
        } else {
          const personDefaultObj = {
            ...homeAddress,
            firstName: clientDetails.firstName ? clientDetails.firstName : null,
            lastName: clientDetails.lastName ? clientDetails.lastName : '',
            phone: clientDetails.phone ? clientDetails.phone : null,
            email: clientDetails.email ? clientDetails.email : '',
            streetName: clientDetails.streetName
              ? clientDetails.streetName
              : null,
            streetNumber: clientDetails.streetNumber
              ? clientDetails.streetNumber
              : null,
            city: clientDetails.city ? clientDetails.city : null,
            postalCd: clientDetails.postalCd ? clientDetails.postalCd : null,
            latitude: clientDetails.latitude ? clientDetails.latitude : null,
            longitude: clientDetails.longitude ? clientDetails.longitude : null,
            gender: clientDetails.gender ? clientDetails.gender : null,
            birthDate: clientDetails.birthDate ? clientDetails.birthDate : null,
            educationLevel: clientDetails.educationLevel
              ? clientDetails.educationLevel
              : null,
            occupation: clientDetails.occupation
              ? clientDetails.occupation
              : null,
            fullAddress: clientDetails.fullAddress
              ? clientDetails.fullAddress
              : null,
            height: clientDetails.height ? clientDetails.height : '',
            weight: clientDetails.weight ? clientDetails.weight : '',
            streetAddress: clientDetails.streetAddress
              ? clientDetails.streetAddress
              : '',
            fullName: clientDetails.fullName ? clientDetails.fullName : '',
            isMarried:
              clientDetails.isMarried && clientDetails.isMarried === 'Married'
                ? clientDetails.isMarried
                : '',
            yearsAtCurrentAddress: clientDetails.yearsAtCurrentAddress
              ? clientDetails.yearsAtCurrentAddress
              : '',
            // isUSCitizen: clientDetails.isUSCitizen ? clientDetails.isUSCitizen : '',
            country: clientDetails.country ? clientDetails.country : '',
          };
          // This is works when personEnrichmentService implemented
          //   const personObjForUpdate = await personEnrichmentService.getPersonDetails(personDefaultObj);
          //   const updatedClient = await clientDetails.update(personObjForUpdate);
          //   return updatedClient
        }
        return true;
      } else {
        throw new HttpException('Not authorised', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        'Error in client enrichment api',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async addToFlow(clientBody) {
    try {
      if (!clientBody.flowId && clientBody.clientId) {
        throw new HttpException(
          'Something went wrong please contact administrator.',
          HttpStatus.BAD_REQUEST
        );
      }
      const decoded = this.request.body.decodedUser;
      const flowResponse = await this.flowHelper.addToFlow(clientBody.flowId, clientBody.clientId, decoded.user.companyUserId);
      return {
        title: 'Flow added successfully in client',
        flowResponse,
      }
    } catch (error) {
      throw new HttpException(
        'Error in addFlow',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(clientBody) {
    try {
      const client = await this.clientRepository.findOne({
        where: { id: clientBody.id },
      });

      if (!client) {
        throw new HttpException('No client found.', HttpStatus.BAD_REQUEST);
      }

      delete clientBody.flowClientId;
      const updatedClient = await this.clientRepository.update(
        client.id,
        clientBody
      );
      return {
        title: 'Client updated successfully',
        obj: updatedClient,
      };
    } catch (error) {
      throw new HttpException(
        'Error finding client',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async companyUpdateClient(id: number, clientDto: ClientDto) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository.findOne({
        where: { id: id, companyClientId: decoded.user.companyUserId },
      });

      if (!client) {
        throw new HttpException('No client found.', HttpStatus.BAD_REQUEST);
      }
      const updatedClient = await this.clientRepository.update(
        client.id,
        clientDto
      );
      return {
        title: 'Client updated successfully',
        obj: updatedClient,
      }
    } catch (error) {
      throw new HttpException(
        'Error finding client',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async emailUpdateClient(lifecycleId, agentId, res) {
    try {
      const decoded = this.request.body.decodedUser;
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: decoded.client.id })
        .leftJoinAndSelect('client.lifecycles', 'lifecycles')
        .getOne();

      const clientHasFollowUpEmail = client.hasFollowUpEmail;
      const newClient = client.lifecycles['isNewClient'];
      const newClientId = client.lifecycles['id'];
      await this.clientRepository.update(client.id, {
        clientLifecycleId: lifecycleId ? lifecycleId : client.clientLifecycleId,
        clientAgentId: agentId ? agentId : client.clientAgentId,
        hasFollowUpEmail: false,
      });

      const lifecycleAnalytic = {
        clientLifecycleAnalyticId: client.id,
        agentLifecycleAnalyticId: client.clientAgentId,
        companyLifecycleAnalyticId: client.companyClientId,
        lifecycleLifecycleAnalyticId: lifecycleId,
        date: new Date(),
        month: (new Date().getMonth() + 1).toString(),
        day: new Date().getDate().toString(),
        year: new Date().getFullYear().toString(),
        insuranceType: 'auto',
      };

      if (clientHasFollowUpEmail === true) {
        if (newClient === true) {
          lifecycleAnalytic.lifecycleLifecycleAnalyticId = client[lifecycleId];
          await this.lifeCycleAnalyticRepository
            .save(lifecycleAnalytic)
            .then(async () => {
              lifecycleAnalytic.lifecycleLifecycleAnalyticId =
                client[newClientId];
              await this.lifeCycleAnalyticRepository.save(lifecycleAnalytic);
              return res.sendFile(
                join(__dirname, 'views', 'client-update.html')
              );
            });
        }

        lifecycleAnalytic.lifecycleLifecycleAnalyticId = lifecycleId;
        await this.lifeCycleAnalyticRepository.save(lifecycleAnalytic);
        return res.sendFile(join(__dirname, 'views', 'client-update.html'));
      }
      return res.sendFile(join(__dirname, 'views', 'client-update.html'));
    } catch (error) {
      throw new HttpException(
        'Error finding client',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async listByDateAndCompany(req) {
    try {
      const decoded = this.request.body.decodedUser;
      const today = new Date();
      const filterParams = req.query;
      const daysAgoDate = new Date().setDate(today.getDate() - (filterParams.createdAt !== 'allTime' ? (+filterParams.createdAt + 1) : 0));
      const id =
        typeof decoded.agent !== 'undefined' && decoded.agent.id
          ? decoded.agent.companyAgentId
          : decoded.user.companyUserId;
      const limit = req.params.limit;
      const page = req.params.page;

      const userId =
        (decoded && decoded.agent && decoded.agent.id) || decoded.user.id;
      let userDetails = null;
      let settings = null;
      if (decoded && decoded.agent && decoded.agent.id) {
        userDetails = await this.agentRepository.findOne({ id: userId });
      } else {
        userDetails = await this.userRepository.findOne({ id: userId });
      }
      if (userDetails) {
        settings = userDetails.settings;
      }
      const whereClause = {
        companyClientId: id,
      };
      if (filterParams.createdAt  !== 'allTime') {
        whereClause['createdAt'] = Between(
          new Date(daysAgoDate),
          new Date(today)
        );
        if (settings && settings.hideOnEmail) {
          whereClause['email'] = null;
        }
        if (settings && settings.hideOnFirstName) {
          whereClause['firstName'] = null;
        }
        if (settings && settings.hideOnLastName) {
          whereClause['lastName'] = null;
        }
        if (settings && settings.hideOnPhone) {
          whereClause['phone'] = null;
        }
        if (settings && settings.hideOnFullAddress) {
          whereClause['fullAddress'] = null;
        }
        if (filterParams.agentIds) {
          if (filterParams.agentIds.includes(',')) {
            const ids = filterParams.agentIds.split(',');
            if (ids && ids.length > 0) {
              // const agentIds = ids.map(id => ({ clientAgentId: id }));
              // whereClause[Op.and].push({[Op.or]: agentIds})
            }
          } else if (+filterParams.agentIds && +filterParams.agentIds > 0) {
            whereClause['clientAgentId'] = filterParams.agentIds;
          }
        } else if (+filterParams.agentIds && +filterParams.agentIds > 0) {
          whereClause['clientAgentId'] = filterParams.agentIds;
        }
      }
      const noSearchList = ['agentIds', 'createdAt', 'fullName', 'tags', 'page'];
      const iLikeList = ['email', 'phone', 'postalCd'] 
      const isValidKey = key => {
        return key && key.length && !key.includes('function');
      }
      for (const key in filterParams) {
        if (isValidKey(key) && !noSearchList.includes(key) && !iLikeList.includes(key) && filterParams[key]) {
          whereClause[key] = filterParams[key];
        } else if (isValidKey(key) && iLikeList.includes(key) && filterParams[key]) {
          whereClause[key] = Like(`${filterParams[key]}%`);
        }
      }
      if (filterParams.name) {
        whereClause['firstName'] = Like(`${filterParams.name}%`);
        whereClause['lastName'] = Like(`${filterParams.name}%`);
      }
      if (filterParams.tag) {
        whereClause['tags'] = In([filterParams.tag]);
      }
      if (filterParams.tags) {
        whereClause['tags'] = In([filterParams.tags.split(',')]);
      }
    
      const [result, total] = await this.clientRepository.findAndCount({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
        join: {
          alias: 'client',
          leftJoinAndSelect: {
            businesses: 'client.businesses',
            drivers: 'client.drivers',
            notes: 'client.notes',
          },
        },
      });
      if (!result) {
        throw new HttpException('No client found.', HttpStatus.BAD_REQUEST);
      }
      let response;
      if (total < 31) {
        const clients = await this.clientRepository.find({
          where: whereClause,
          order: {
            createdAt: 'DESC',
          },
          join: {
            alias: 'client',
            leftJoinAndSelect: {
              businesses: 'client.businesses',
              drivers: 'client.drivers',
              notes: 'client.notes',
            },
          },
        });
        response = {
          title: 'Clients found successfully',
          obj: clients,
          isCount: false,
        };
      } else {
        response = {
          title: 'Clients found successfully',
          obj: result,
          count: total,
          isCount: true,
        };
      }
      return response;
    } catch (error) {
      throw new HttpException(
        'No client found.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async countByFilterParams(req) {
    try {
      const decoded = this.request.body.decodedUser;
      const id = (typeof decoded.agent !== 'undefined' && decoded.agent.id) ? decoded.agent.companyAgentId : decoded.user.companyUserId;
      const filterParams = req.query;
      const timeAgo = (timeValue, unit) => {
        return moment().subtract(timeValue, unit);
      }
      let daysAgoDate = null;

      const whereClause = {
        companyClientId: id
      };

      if (filterParams.createdAt !== 'allTime') {
        daysAgoDate = timeAgo(+filterParams.createdAt + 1, 'days');
        whereClause['createdAt'] = Between(
          new Date(daysAgoDate),
          new Date()
        );
      }
      if (filterParams.agentIds) {
        if (filterParams.agentIds.includes(',')) {
          const ids = filterParams.agentIds.split(',');
          if (ids && ids.length > 0) {
            const agentIds = ids.map(id => ({ clientAgentId: id }));
            whereClause['clientAgentId'] = agentIds;
          }
        } else if (+filterParams.agentIds && +filterParams.agentIds > 0) {
          whereClause['clientAgentId'] = req.query.agentIds;
        }
      } else if (+filterParams.agentIds && +filterParams.agentIds > 0) {
        whereClause['clientAgentId'] = req.query.agentIds;
      }
      const noSearchList = ['agentIds', 'createdAt', 'fullName', 'tags', 'page', 'tour'];
      const iLikeList = ['email', 'phone', 'postalCd'] 
      const isValidKey = key => {
        return key && key.length && !key.includes('function');
      }
      for (const key in filterParams) {
        if (isValidKey(key) && !noSearchList.includes(key) && !iLikeList.includes(key) && filterParams[key]) {
          whereClause[key] = req.query[key];
        } else if (isValidKey(key) && iLikeList.includes(key) && filterParams[key]) {
          whereClause[key] = Like(`${req.query[key]}%`);
        }
      }

      if (filterParams.fullName) {
        whereClause['firstName'] = Like(`${req.query.fullName}%`);
        whereClause['lastName'] = Like(`${req.query.fullName}%`);
      }
      if (filterParams.tag) {
        whereClause['tags'] = In([req.query.tag]);
      }
      if (filterParams.tags) {
        whereClause['tags'] = In([req.query.tags.split(',')]);
      }
      
      const clientCount =  await this.clientRepository.count({where: whereClause});
  
      if (!clientCount && clientCount !== 0) {
        throw new HttpException('Error finding clients. No clients founds', HttpStatus.BAD_REQUEST);
      }
      return {
        count: clientCount,
        isCount: true,
        title: 'Clients counted successfully'
      }
    } catch(error) {
      throw new HttpException('Error counting clients', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listOneByParams(req) {
    try {
      const decoded = this.request.body.decodedUser;
      const params = req.params.params;

      const companyId = decoded.companyId;
      const clientId = req.params.id;

      if (!clientId || !companyId) {
        throw new HttpException(
          'Error finding client. No IDs',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const paramsList = params.includes(',') ? params.split(',') : [params];
      let orderObj = {};
      let includeObj = {};

      const orders = {
        'client.drivers.createdAt': 'ASC',
        'vehciles.createdAt': 'ASC',
        'incidents.createdAt': 'ASC',
        'policies.createdAt': 'ASC',
        'recreationalVehicles.createdAt': 'ASC',
        'notes.createdAt': 'ASC',
      };

      const includes = {
        drivers: 'client.drivers',
        vehicles: 'client.vehicles',
        homes: 'client.homes',
        locations: 'client.locations',
        incidents: 'client.incidents',
        policies: 'client.policies',
        businesses: 'client.businesses',
        recreationalVehicles: 'client.recreationalVehicles',
        notes: 'client.notes',
      };

      if (!params) {
        orderObj = orders;
        includeObj = includes;
      } else {
        const isMultiple = [
          'drivers',
          'vehicles',
          'recreationalVehicles',
          'policies',
          'incidents',
          'notes',
          'documents',
        ];
        for (const param of paramsList) {
          if (isMultiple.includes(param)) {
            orderObj[param] = 'ASC';
          }
          includeObj[param] = `client.${params}`;
        }
      }

      let response;
      const client = await this.clientRepository.findOne({
        where: {
          id: clientId,
          companyClientId: companyId,
        },
        join: {
          alias: 'client',
          leftJoinAndSelect: includeObj,
        },
      });

      if (!client) {
        response = {
          obj: null,
        };
      }

      response = {
        title: 'Client retrieved successfully',
        obj: client,
      };
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error finding client',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async listOneById(clientId: number) {
    try {
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.business', 'business')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .leftJoinAndSelect('client.locations', 'locations')
        .leftJoinAndSelect('client.incidents', 'incidents')
        .leftJoinAndSelect(
          'client.recreationalVehicles',
          'recreationalVehicles'
        )
        .leftJoinAndSelect('client.policies', 'policies')
        .orderBy('drivers.createdAt', 'ASC')
        .addOrderBy('vehicles.createdAt', 'ASC')
        .addOrderBy('incidents.createdAt', 'ASC')
        .addOrderBy('recreationalVehicles.createdAt', 'ASC')
        .addOrderBy('policies.createdAt', 'ASC');

      if (!client) {
        throw new HttpException('No client found', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Client retrieved successfully',
        obj: client,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadSecureDocument(req, res) {
    try {
      const clientId = req.body.decodedUser.client.id;
      const s3 = new aws.S3({
        secretAccessKey: awsCredential.secretAccessKey,
        accessKeyId: awsCredential.accessKeyId,
        region: awsCredential.region,
      });
      let originalname = '';
      let fileName = '';
      const uploadM = multer({
        storage: multerS3({
          s3,
          bucket: 'xilo-secure',
          acl: 'private',
          metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
          },
          key(req, file, cb) {
            originalname = file.originalname;
            fileName = `${crypto
              .createHash('md5')
              .update(originalname)
              .digest('hex')}.${originalname.substr(
              originalname.lastIndexOf('.') + 1
            )}`;
            cb(null, fileName);
          },
        }),
      }).single('files');

      uploadM(req, res, async (error) => {
        if (error)
          throw new HttpException(
            'Error while creating document',
            HttpStatus.BAD_REQUEST
          );

        const document = await this.documentRepository.save({
          clientId: clientId,
          fileName: originalname,
          objName: fileName,
        });

        if (!document)
          throw new HttpException(
            'Error while creating document',
            HttpStatus.BAD_REQUEST
          );

        return { documentId: document.id, document };
      });
    } catch (error) {
      throw new HttpException(
        'Error finding client',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async validateClient(id, type) {
    try {
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: id })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'home')
        .leftJoinAndSelect('client.incidents', 'incidents')
        .orderBy({
          'drivers.createdAt': 'ASC',
          'vehicles.createdAt': 'ASC',
        })
        .getOne();

      if (!client)
        throw new HttpException(
          'Error validating client. No client found',
          HttpStatus.INTERNAL_SERVER_ERROR
        );

      const messages = await this.integrationValidator.validateEZLynx(
        client,
        type,
        null
      );

      if (!messages.status)
        throw new HttpException(
          'Error validating form. Validation failed',
          HttpStatus.BAD_REQUEST
        );

      let output: any = [...messages.messages];
      let response;

      if (output.length > 0) {
        const logs = output;
        await this.clientRepository.update(id, { ezlynxValidationLogs: logs });
        output = output.join('\n');
      } else {
        response = {
          title: 'Client validated',
          valid: true,
        };
      }

      response = {
        title: 'Client validated',
        valid: false,
        obj: output,
      };

      return response;
    } catch (error) {
      throw new HttpException(
        'Error finding client',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async bulkUpdate() {
    try {
      delete this.request.body.flowClientId;

      const client = [this.request.body];
      let isNewClient = false;

      if (!client || !client[0]) {
        throw new HttpException(
          'Error updating client. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!client[0].id) {
        isNewClient = true;
      }

      if (client[0].ssn) {
        client[0].ssnHash = encryptor.encrypt(client[0].ssn);
        client[0].ssn = 'Answered';
      }

      if (isNewClient) {
        const newClientLA = await this.lifecyclesRepository.findOne({
          where: {
            companyLifecycleId: client[0].companyClientId,
            isNewClient: true,
          },
        });
        if (newClientLA) {
          client[0].clientLifecycleId = newClientLA.id;
        }
      }

      const newClient = await this.clientRepository.save(
        this.clientRepository.create(client)
      );
      if (!newClient) {
        throw new HttpException(
          'Error updating client',
          HttpStatus.BAD_REQUEST
        );
      }
      let returnedClient = null;

      if (isNewClient) {
        returnedClient = await this.clientRepository
          .createQueryBuilder('client')
          .where({ id: newClient[0].id })
          .leftJoinAndSelect('client.drivers', 'drivers')
          .leftJoinAndSelect('client.business', 'business')
          .leftJoinAndSelect('client.vehicles', 'vehicles')
          .leftJoinAndSelect('client.homes', 'homes')
          .leftJoinAndSelect('client.locations', 'locations')
          .leftJoinAndSelect('client.incidents', 'incidents')
          .leftJoinAndSelect(
            'client.recreationalVehicles',
            'recreationalVehicles'
          )
          .leftJoinAndSelect('client.policies', 'policies')
          .orderBy('drivers.createdAt', 'ASC')
          .addOrderBy('vehicles.createdAt', 'ASC')
          .addOrderBy('incidents.createdAt', 'ASC')
          .addOrderBy('recreationalVehicles.createdAt', 'ASC')
          .addOrderBy('policies.createdAt', 'ASC');
      }

      if (isNewClient) {
        client[0].id = returnedClient.id;
        const token = await jwt.sign(
          {
            client: {
              id: client[0].id,
              companyClientId: client[0].companyClientId,
            },
          },
          'secret',
          { expiresIn: 864000 }
        );
        const newClientLA = await this.lifecyclesRepository.findOne({
          where: {
            companyLifecycleId: returnedClient.companyClientId,
            isNewClient: true,
          },
        });
        if (!newClientLA) {
        } else {
          const updatedClient = await returnedClient.update({
            clientLifecycleId: newClientLA.id,
          });
          this.request['session'].data.obj['clientLifecycleId'] =
            newClientLA.id;
        }
        this.request['session'].data.token = token;
      }

      return {
        title: 'Client updated successfully',
        id: returnedClient ? returnedClient.id : null,
        obj: returnedClient,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async upsertAll(companyId: number) {
    try {
      const updates = this.request.body.updates;

      if (!updates) {
        throw new HttpException(
          'Error upserting object. No updates found',
          HttpStatus.BAD_REQUEST
        );
      }

      const company = await this.companyRepository.findOne({
        where: { companyId: companyId },
        select: ['id'],
      });

      if (!company) {
        throw new HttpException(
          'Error upserting object. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const responses = [];

      let clientData = null;
      // NEED TO BETTER DETECT METHOD FINISH
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const objModel = update.objModel;
        const object = update.object;
        if (objModel && object) {
          if (objModel === 'Client') {
            object.flowClientId ? delete object.flowClientId : null;
            if (object.ssn && object.ssn !== 'Answered') {
              object.ssnHash = encryptor.encrypt(object.ssn);
              object.ssn = 'Answered';
            } else if (object.spouseSsn && object.spouseSsn !== 'Answered') {
              object.spouseSsnHash = encryptor.encrypt(object.spouseSsn);
              object.spouseSsn = 'Answered';
            }
            object.companyClientId = company.id;
            object.applicantMaritalStatusCd === 'Single'
              ? delete object.spouseMaritalStatus
              : '';
            object.maritalStatus === 'Single'
              ? delete object.spouseMaritalStatus
              : '';
            const data = await getRepository(objModel).save(object);
            if (!data) {
              throw new HttpException(
                'Error upserting object. Upsert failed',
                HttpStatus.BAD_REQUEST
              );
            }
            clientData = data;
            const response = { objModel: objModel, id: data.id };
            responses.push(response);
          } else {
            if (objModel === 'Driver') {
              if (object.ssnU && object.ssnU !== 'Answered') {
                object.ssnUHash = encryptor.encrypt(object.ssnU);
                object.ssnU = 'Answered';
              }
            }
            if (clientData && clientData.id) {
              object[`client${objModel}Id`] = clientData.id;
            }
            object[`company${objModel}Id`] = company.id;
            object.applicantMaritalStatusCd === 'Single'
              ? delete object.spouseMaritalStatus
              : '';
            object.maritalStatus === 'Single'
              ? delete object.spouseMaritalStatus
              : '';
            const [data, created] = await getRepository(objModel).save(object);
            if (!data) {
              throw new HttpException(
                'Error upserting object. Upsert failed',
                HttpStatus.BAD_REQUEST
              );
            }
            const response = { objModel: objModel, id: data.id };
            responses.push(response);
          }
        }
      }

      if (
        this.request.query.newClient &&
        this.request.query.newClient === 'true'
      ) {
        const token = await jwt.sign(
          {
            client: {
              id: clientData.id,
              companyClientId: clientData.companyClientId,
            },
          },
          'secret',
          { expiresIn: 864000 }
        );
        const newClientLA = await this.lifecyclesRepository.findOne({
          where: {
            companyLifecycleId: clientData.companyClientId,
            isNewClient: true,
          },
        });
        if (!newClientLA) {
        } else {
          const updatedClient = await clientData.update({
            clientLifecycleId: newClientLA.id,
          });
        }
        this.request['session'].data.token = token;
      }
      return {
        title: 'Objects upserted successfully',
        responses: responses,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async create(bodyObj: ClientDto) {
    try {
      const client = await this.clientRepository.save(bodyObj);
      if (!client) {
        throw new HttpException(
          'Error creating client',
          HttpStatus.BAD_REQUEST
        );
      }
      const token = jwt.sign(
        {
          client: { id: client.id, companyClientId: client.companyClientId },
        },
        'secret',
        { expiresIn: 864000 }
      );
      return {
        title: 'Client created successfully',
        token,
        clientId: client.id,
        obj: client,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async upsert(bodyObj) {
    try {
      const client = cleaner(bodyObj);

      delete client.flowClientId;
      delete client.drivers;
      delete client.vehicles;
      delete client.homes;
      delete client.locations;
      delete client.business;
      delete client.incidents;
      delete client.recreationalVehicles;
      delete client.policies;

      if (bodyObj.ssn && bodyObj.ssn !== 'Answered') {
        bodyObj.ssnHash = encryptor.encrypt(bodyObj.ssn);
        bodyObj.ssn = 'Answered';
      }

      client.maritalStatus === 'Single'
        ? delete client.spouseMaritalStatus
        : '';
      client.applicantMaritalStatusCd === 'Single'
        ? delete client.spouseMaritalStatus
        : '';
      const returnedClient = await this.clientRepository.save(client);
      if (!returnedClient) {
        throw new HttpException(
          'Error upserting client',
          HttpStatus.BAD_REQUEST
        );
      }
      this.request['session'].data = {
        title: 'Client upserted successfully',
        id: returnedClient.id,
      };
      if (
        this.request.query.newClient &&
        this.request.query.newClient === 'true'
      ) {
        const token = await jwt.sign(
          {
            client: { id: client.id, companyClientId: client.companyClientId },
          },
          'secret',
          { expiresIn: 864000 }
        );
        const newClientLA = await this.lifecyclesRepository.findOne({
          where: {
            companyLifecycleId: client.companyClientId,
            isNewClient: true,
          },
        });
        if (!newClientLA) {
        } else {
          const updatedClient = await returnedClient.update({
            clientLifecycleId: newClientLA.id,
          });
        }
        this.request['session'].data['token'] = token;
      }
      return this.request['session'];
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteByModel() {
    try {
      if (
        !this.request.params.companyId ||
        !this.request.params.model ||
        !this.request.params.id
      ) {
        throw new HttpException(
          'Error deleting object. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      const company = await this.companyRepository.findOne({
        where: { companyId: this.request.params.companyId },
        select: ['id'],
      });

      if (!company) {
        throw new HttpException(
          'Error deleting object. No company found',
          HttpStatus.BAD_REQUEST
        );
      }

      let whereObj = { id: this.request.params.id };

      if (
        this.request.params.model !== 'Incident' &&
        this.request.params.model !== 'RecreationalVehicle'
      ) {
        whereObj = {
          id: this.request.params.id,
          [`company${this.request.params.model}Id`]: company.id,
        };
      }

      const obj = await getRepository(this.request.params.model).findOne({
        where: whereObj,
        attributes: ['id'],
      });

      if (!obj) {
        throw new HttpException(
          'Error deleting object. No object found',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedObj = await getRepository(this.request.params.model).delete(
        obj
      );
      if (deletedObj.affected === 0) {
        throw new HttpException(
          'Error deleting object.',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Object destroyed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
