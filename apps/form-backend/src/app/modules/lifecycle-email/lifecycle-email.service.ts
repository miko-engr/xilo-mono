import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { Forms } from '../form/forms.entity';
import { emailRegEx } from '../../helpers/email.helper';
import { PdfService } from '../pdf/pdf.service';
import * as webpush from 'web-push';
import { PushSubscription } from 'web-push';
import { vapidKeys, courierEventids } from '../../constants/appconstant';
import { returnClientInfo } from './lifecycle-email.helper';
import { Agents } from '../agent/agent.entity';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable({ scope: Scope.REQUEST })
export class LifecycleEmailService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Forms) private formRepository: Repository<Forms>,
    @InjectRepository(Agents) private agentRepository: Repository<Agents>,
    private readonly pdfService: PdfService,
    private readonly notificationService: NotificationsService
  ) {}
  async returnExists(value) {
    if (
      (value && typeof value != 'undefined' && value !== 'undefined') ||
      value === false
    ) {
      return true;
    }
    return false;
  }

  async returnLeadName(client) {
    if (
      this.returnExists(client.firstName) &&
      this.returnExists(client.lastName)
    ) {
      return `${client.firstName} ${client.lastName}`;
    } else if (
      Object.prototype.hasOwnProperty.call(client, 'drivers') &&
      client.drivers.length > 0 &&
      this.returnExists(client.drivers[0].applicantGivenName) &&
      this.returnExists(client.drivers[0].applicantSurname)
    ) {
      return `${client.drivers[0].applicantGivenName} ${client.drivers[0].applicantSurname}`;
    }
    return 'Not Completed';
  }

  async sendNotificationByRecipient(
    client,
    eventId,
    recipient,
    dataObj,
    attachPDF
  ) {
    try {
      if (!emailRegEx.test(recipient)) {
        return {
          status: false,
          error: 'Error sending email. Email is not valid',
        };
      }
      const payload = {
        event: eventId,
        recipient: recipient,
        data: dataObj,
      };

      if (attachPDF) {
        const pdfData = await this.pdfService.createPdf({
          clientId: client.id,
        });
        if (!pdfData.status) {
          console.log(pdfData.error);
        } else {
          const buffer = Buffer.from(pdfData.data);
          payload['override'] = {
            sendgrid: {
              body: {
                attachments: [
                  {
                    content: buffer.toString('base64'),
                    type: 'application/pdf',
                    filename: `${this.returnLeadName(client)}.pdf`,
                  },
                ],
              },
            },
          };
        }
      }

      const response = await this.notificationService.sendNotification(payload);

      if (!response.status) {
        console.log(response.error);
        return { status: false, error: 'Error sending notifcation' };
      }
    } catch (error) {
      return { status: false, error: error };
    }
  }

  async handleSendEmail(params, query, Location, fileName) {
    try {
      const clientId = parseInt(
        params && params.clientId
          ? params.clientId
          : query && query.clientId
          ? query.clientId
          : null
      );

      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.businesses', 'businesses')
        .leftJoinAndSelect('client.homes', 'home')
        .getOne();
      if (!client)
        return { status: false, error: 'Error sending email. No client found' };

      const agentWhere = {};
      if ((params && params.agentId) || client.clientAgentId) {
        const agentId = params.agentId ? params.agentId : client.clientAgentId;
        agentWhere['id'] = parseInt(agentId);
      } else {
        agentWhere['isPrimaryAgent'] = true;
      }

      const company = await this.companyRepository
        .createQueryBuilder('companies')
        .where('companies.id = :id', { id: client.companyClientId })
        .leftJoinAndSelect('companies.agents', 'agents')
        .where(agentWhere)
        .getOne();

      if (!company)
        return {
          status: false,
          error: 'Error sending email. No company found',
        };

      let form = await this.formRepository.findOne({ id: client.formClientId });
      if (!form) form = null;

      let data = {};
      const clientUrl = `https://dashboard.xilo.io/agent/clients-table/view/${client.id}/client`;

      webpush.setVapidDetails(
        'mailto:jon@xilo.io',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      const notifObj = company.agents.map((agent) => agent.notificationJson);

      const notificationPayload = {
        notification: {
          title: 'New XILO Submission',
          body: 'Visit XILO to view your new submission',
          // "icon": `${path.dirname(__filename)}/../assets/icons/icon-96x96.png`,
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
            url: clientUrl,
          },
          actions: [
            {
              action: 'explore',
              title: 'View Submission',
            },
          ],
        },
      };

      const type =
        params && params.emailType
          ? params.emailType
          : query && query.emailType
          ? query.emailType
          : null;
      // Courier api requires data and an eventid
      // the data formed below can be used in the email variables.
      // use the field names below for interpolation
      const clientInfo = await returnClientInfo(client);
      data = {
        name: this.returnLeadName(client),
        email: client.email,
        clientInfo,
        clientUrl,
        phone: client.phone,
        mainLocation: company.mainLocation,
        clientAgentId: client.clientAgentId || agentWhere['id'],
        ezlynxUrl: client.ezlynxUrl,
        companyName: form.companyName || company.name,
        companyPhone: form.companyPhone || company.contactNumber,
        companyEmail: form.companyEmail || company.contactEmail,
        website: form.companyWebsite || company.companyWebsite,
        customText: '',
        formTitle: form.title,
        fileLink: Location ? Location : null,
        fileName: fileName ? fileName : null,
      };
      if (
        type === 'newLead' ||
        (type === 'finishedForm' &&
          form.isFireOnComplete &&
          !client.newLeadFired)
      ) {
        if (agentWhere['id'] || client.clientAgentId) {
          const agent = await this.agentRepository.findOne({
            where: { id: client.clientAgentId || agentWhere['id'] },
          });

          await this.sendNotificationByRecipient(
            client,
            courierEventids.NEWLEAD,
            agent.email,
            data,
            form.hasNotificationPdfAttachment
          );
        } else {
          company.agents.forEach(async (agent) => {
            await this.sendNotificationByRecipient(
              client,
              courierEventids.NEWLEAD,
              agent.email,
              data,
              form.hasNotificationPdfAttachment
            );
          });
        }
      } else if (type === 'assigned') {
        const agent = await this.agentRepository.findOne({
          where: { id: client.clientAgentId || agentWhere['id'] },
        });
        notificationPayload.notification.title = 'Assigned New XILO Lead';
        await this.sendNotificationByRecipient(
          client,
          courierEventids.ASSIGNEDLEAD,
          agent.email,
          data,
          form.hasNotificationPdfAttachment
        );
      } else if (
        !form ||
        (!form.sendFinishedFormEmail && !form.isFireOnComplete)
      ) {
        return { status: true };
      } else if (form.sendFinishedFormEmail) {
        await this.sendNotificationByRecipient(
          client,
          courierEventids.FINISHEDFORM,
          client.email,
          data,
          null
        );
      }

      if (type === 'newLead' || type === 'assigned') {
        Promise.all(
          notifObj.map((sub) => {
            if (sub)
              webpush.sendNotification(
                sub as PushSubscription,
                JSON.stringify(notificationPayload)
              );
          })
        ).catch((err) => {
          console.error('Error sending notification, reason: ', err);
        });
      }

      return { status: true };
    } catch (error) {
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }
}
