import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Integrations } from './Integrations.entity';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Clients } from '../client/client.entity'
import { Forms } from '../form/forms.entity'
import { EzlynxService } from '../ezlynx/ezlynx.service';
import { Ams360Service } from '../ams360/ams360.service';
import { InfusionsoftService } from '../infusionsoft/infusionsoft.service';
import { QqCatalystService } from '../qq-catalyst/qq-catalyst.service';
import { QuoteRushService } from '../quote-rush/quote-rush.service';
import { ClientDto } from '../client/dto/client.dto';
@Injectable({ scope: Scope.REQUEST })
export class IntegrationService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Integrations)
    private integrationsRepository: Repository<Integrations>,
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Forms) private formRepository: Repository<Forms>,
    private ezlynxService: EzlynxService,
    private ams360Service: Ams360Service,
    private infusionsoftService: InfusionsoftService,
    private qqCatalystService: QqCatalystService,
    private quoteRushService: QuoteRushService,
  ) {}
  async create(bodyObj: CreateIntegrationDto) {
    try {
      const integration = await this.integrationsRepository.save(bodyObj);
      if (!integration) {
        throw new HttpException(
          'Error creating integration. Method failed',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Integration completed successfully',
        obj: integration.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async remove(id: number) {
    try {
      const integration = await this.integrationsRepository.findOne({
        where: { id: id },
      });
      if (!integration) {
        throw new HttpException(
          'No found  integration.',
          HttpStatus.BAD_REQUEST
        );
      }
      const deletedIntegration = await this.integrationsRepository.delete(
        integration
      );
      if (deletedIntegration.affected === 0) {
        throw new HttpException(
          'Error deleting integration.',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Integration removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id, integrationObj) {
    try {
      const updatedIntegration = await this.integrationsRepository.update(
        {
          id: id,
        },
        integrationObj
      );
      if (updatedIntegration.affected === 0) {
        throw new HttpException(
          'Error updating integration.',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Integration updated successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async fireIntegrations(clientId) {
        try {
            const client: ClientDto = await this.clientRepository.findOne({
                where: clientId,
                select: ['id', 'companyClientId', 'formClientId', 'infusionsoftTagId']
            });

            if (!client || !client.formClientId)
                return { status: false, error: 'Error firing integrations. No client or form found' };

            const token = jwt.sign({ client: { id: client.id, companyClientId: client.companyClientId } }, 'secret', { expiresIn: 30000 });

            const form = await this.formRepository.findOne({
                where: { id: client.formClientId },
                select: ['id', 'integrations', 'title', 'customerType']
            });

            if (!form || !form.integrations || form.integrations.length === 0)
                return { status: false, error: 'Error firing integrations. No form found' };

            function hasIntegration(integrations, vendor) {
                return (integrations && integrations.length > 0 && integrations.includes(vendor));
            }

            let result = { passed: [], failed: [] };

            if (hasIntegration(form.integrations, 'EZLYNX')) {
                if (client && client.company && client.company.hasV2Integrations) {
                    // const ezResult = await ezV2Controller.createApplicantMethod({ clientId: clientId, type: 'form', token: token });
                    // if (!ezResult.status) {
                    //     result.failed.push('EZ failed');
                    // } else {
                    //     result.passed.push('EZ');
                    // }
                } else {
                    function titleHas(title, type) {
                        return (title && title.toLowerCase().includes(type));
                    }
                    const type = titleHas(form.title, 'auto') ? 'Auto' : titleHas(form.title, 'home') ? 'Home' :
                        titleHas(form.title, 'auto-home') ? 'Auto-Home' : form.title;

                    // const ezResult = await this.ezlynxService.handleCreateContact(token, clientId, type); TODO Fix on commit migration
                    // if (!ezResult.status)
                    //     result.failed.push('EZ failed');
                    // else
                    //     result.passed.push('EZ');
                }
            }

            if (hasIntegration(form.integrations, 'AMS360')) {
                if (form.customerType)
                    client.customerType = form.customerType;

                // const amsResult = await this.ams360Service.handleCreateContact(token, clientId); TODO Fix on commit migration
                // if (!amsResult.status)
                //     result.failed.push('AMS failed');
                // else
                //     result.passed.push('AMS');
            }

            // if (hasIntegration(form.integrations, 'PIPEDRIVE')) {
            //     if (!client.pipedriveDealId) {
            //         await pushNewPipedrivePerson(company, client, form, queryParams);
            //     } else {
            //         await pushNewPipedriveNote(company, client, form, queryParams);
            //     }
            // }

            if (hasIntegration(form.integrations, 'INFUSIONSOFT')) {
                const refreshTokenResult = await this.infusionsoftService.handleRefreshAccessToken(client.companyClientId);
                if (!refreshTokenResult.status)
                    result.failed.push('Infusionsoft failed');
                else {
                    const accessToken = refreshTokenResult.newToken;
                    const createContactResult = await this.infusionsoftService.handleCreateOrUpdate(client.companyClientId, clientId, accessToken);

                    if (!createContactResult.status)
                        result.failed.push('Infusionsoft failed');
                    else if (client.infusionsoftTagId) {
                        const addTagResult = await this.infusionsoftService.handleAddTagToContact(clientId, accessToken);

                        if (!addTagResult.status)
                            result.failed.push('Infusionsoft failed');
                        else
                            result.passed.push('Infusionsoft');
                    }
                    else
                        result.passed.push('Infusionsoft');
                }
            }

            if (hasIntegration(form.integrations, 'QQ')) {
                const qqResult = await this.qqCatalystService.handleCreateContact(token, clientId);
                if (!qqResult.status)
                    result.failed.push('QQ failed');
                else
                    result.passed.push('QQ');
            }

            if (hasIntegration(form.integrations, 'QUOTERUSH')) {
                const quoteRushResult = await this.quoteRushService.handleCreateContact(token, clientId);
                if (!quoteRushResult.status)
                    result.failed.push('QuoteRush failed');
                else
                    result.passed.push('QuoteRush');
            }

            if (hasIntegration(form.integrations, 'TURBORATER')) {
                function titleHas(title, type) {
                    return (title && title.toLowerCase().includes(type));
                }

                const type = titleHas(form.title, 'auto') ? 'Auto' : titleHas(form.title, 'home') ? 'Home' :
                    titleHas(form.title, 'auto-home') ? 'Auto-Home' : form.title;

                // const turboResult = await turboraterController.handleCreateContact(token, clientId, type);
                // if (!turboResult.status) {
                //     result.failed.push('Turbo Rater failed');
                // } else {
                //     result.passed.push('Turbo Rater');
                // }
            }

            // if (hasIntegration(form.integrations, 'HUBSPOT') && company.hubspotApiKey !== null) {
            //     createHubspotContact(client, company);
            // }

            // if (hasIntegration(form.integrations, 'NOWCERTS')) {
            //     await pushNowCertsContact(client);
            // }

            // if (hasIntegration(form.integrations, 'WEALTHBOX')) {
            //     await pushWealthboxContact(client);
            // }

            if (result.passed.length > 0)
                return { status: true, result: result };
            else
                return { status: false, result: result, error: 'One or more integrations failed' };

        } catch (error) {
            console.log(error);
            return { status: false, error: error };
        }
  }
}
