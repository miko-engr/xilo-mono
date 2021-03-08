import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Emails } from './emails.entity';
import { Clients } from '../client/client.entity';
import { CreateEmailDto } from './dto/create-email.dto';
import * as sg from '@sendgrid/mail';
import { sendGrid } from '../../constants/appconstant';
import { emailRegEx } from '../../helpers/email.helper';
sg.setApiKey(sendGrid.SENDGRID_API_KEY);
@Injectable({ scope: Scope.REQUEST })
export class EmailService {
  constructor(
    @InjectRepository(Emails)
    private emailsRepository: Repository<Emails>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(emailBody: CreateEmailDto) {
    try {
      const client = await this.clientsRepository.findOne({
        where: {
          id: emailBody.clientEmailId,
          companyClientId: emailBody.companyEmailId,
        },
      });

      if (!client) {
        throw new HttpException(
          'Error sending email. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      async function returnEmailBody(body) {
        try {
          let newBody = body;
          if (newBody.includes('{{') || newBody.includes('}}')) {
            const params = [...newBody.matchAll(/{{(.*)}}/g)];
            for (let i = 0; i < params.length; i++) {
              const regObj = params[i];
              const str = regObj[1];
              if (str) {
                const paramSplit = str.split('.');
                if (paramSplit[0] === 'client') {
                  newBody = newBody.replace(`${paramSplit[1]}}}`, '');
                  newBody = newBody.replace(
                    `{{${paramSplit[0]}.`,
                    client[paramSplit[1]]
                  );
                }
              }
              if (!params[i + 1]) {
                return newBody;
              }
            }
          } else {
            return newBody;
          }
        } catch (error) {
          console.log(error);
        }
      }
      const decoded = this.request.body.decodedUser;
      const isValidRecipientEmail = emailRegEx.test(
        String(emailBody.recipient).toLowerCase()
      );
      if (!isValidRecipientEmail) {
        throw new HttpException('Email not valid!', HttpStatus.BAD_REQUEST);
      }
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      currentDate.setDate(currentDate.getDate() - 1);
      const scheduledDate = new Date(emailBody.scheduledDate);

      if (scheduledDate > currentDate) {
        throw new HttpException(
          'Invliad scheduledDate. It should be near about 1 year!',
          HttpStatus.BAD_REQUEST
        );
      }

      const companyId = decoded.agent
        ? decoded.agent.companyAgentId
        : decoded.user.companyUserId;

      const newEmailObj = {
        recipient: emailBody.recipient,
        sender: emailBody.sender,
        subject: emailBody.subject,
        body: await returnEmailBody(emailBody.body),
        scheduledDate: emailBody.scheduledDate,
        isSchedule: !emailBody.isSentNow,
        companyEmailId: decoded.companyId,
        clientEmailId: emailBody.clientEmailId,
        status: 'Replied',
        fromClient: false,
        replyStatus: '',
        replyErrorMessage: '',
        flowEmailId: emailBody.flowEmailId || null,
        createdAt: emailBody.createdAt,
        updatedAt: emailBody.updatedAt
      };

      if (emailBody.isSentNow) {
        if (emailBody.sender === undefined) {
          emailBody.sender = sendGrid.FROM_EMAIL;
        }

        const msg: any = {
          to: emailBody.recipient,
          from: emailBody.sender,
          subject: emailBody.subject,
          html: await returnEmailBody(emailBody.body),
          content: [
            {
              type: 'text/plain',
              value: await returnEmailBody(emailBody.body),
            },
          ],
        };

        const response = await sg.send(msg);

        if (response[0].statusCode !== 200 && response[0].statusCode !== 202) {
          newEmailObj.replyStatus = 'failed';
          newEmailObj.replyErrorMessage =
            'Error while sending email immediately';
          throw new HttpException('Email not sent!', HttpStatus.BAD_REQUEST);
        }
        newEmailObj.replyStatus = 'success';
      }

      const newEmail = await this.emailsRepository.save(newEmailObj);
      if (!newEmail) {
        throw new HttpException(
          'New email create error',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'New email created successfully',
        obj: newEmail,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async sendEmail(emailBody: CreateEmailDto) {
    try {
      const isValidRecipientEmail = emailRegEx.test(
        String(emailBody.recipient).toLowerCase()
      );
      if (!isValidRecipientEmail) {
        throw new HttpException(
          'Error sending email. Email not valid!',
          HttpStatus.BAD_REQUEST
        );
      }

      if (emailBody.isSentNow) {
        emailBody.sender = sendGrid.FROM_EMAIL;

        const msg: any = {
          to: [{ email: emailBody.recipient }],
          from: { email: emailBody.sender },
          subject: emailBody.subject,
          html: emailBody.body,
        };

        const response = await sg.send(msg);

        if (response[0].statusCode !== 200 && response[0].statusCode !== 202) {
          throw new HttpException(
            'Error sending email. Email failed!',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      return {
        title: 'New email created successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, emailBody: CreateEmailDto) {
    try {
      const companyId = this.request.body.decodedUser.companyId;
      const emailData = await this.emailsRepository.findOne({
        where: {
          id: id,
          companyEmailId: companyId,
        },
      });
      if (!emailData) {
        throw new HttpException(
          'Error email not found',
          HttpStatus.BAD_REQUEST
        );
      }
      const updatedEmail = await this.emailsRepository.save({
        ...emailData,
        ...emailBody,
      });
      if (!updatedEmail) {
        throw new HttpException('Error updating email', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Email updated successfully',
        obj: updatedEmail,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async delete(id: number) {
    try {
      const emailData = await this.emailsRepository.findOne({
        where: { id: id },
      });
      if (!emailData) {
        throw new HttpException(
          'No email found with this ID!',
          HttpStatus.BAD_REQUEST
        );
      }
      const response = await this.emailsRepository.delete(emailData);
      if (response.affected === 0) {
        throw new HttpException('Error email delete!', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Email deleted successfully',
        obj: response,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByCompany() {
    try {
      const decoded = this.request.body.decodedUser;
      const allEmails = await this.emailsRepository.find({
        where: {
          companyEmailId: decoded.user.companyUserId,
        },
      });
      if (!allEmails) {
        throw new HttpException('Email not found!', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Email retrieved successfully',
        obj: allEmails,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOneById(id: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const oneEmail = await this.emailsRepository.findOne({
        where: {
          id: id,
          companyEmailId: decoded.user.companyUserId,
        },
      });
      if (!oneEmail) {
        throw new HttpException('Email not found!', HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'Email retrieved successfully',
        obj: oneEmail,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
