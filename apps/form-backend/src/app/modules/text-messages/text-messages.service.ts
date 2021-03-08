import { Injectable, Scope, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TextMessages } from './TextMessages.entity';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Clients } from '../client/client.entity';
import { FlowHelper } from '../flow/helper/flow.helper';

@Injectable({ scope: Scope.REQUEST })
export class TextMessagesService {
    constructor(
        @InjectRepository(TextMessages)
        private textMessagesRepository: Repository<TextMessages>,
        @InjectRepository(Clients)
        private clientRepository: Repository<Clients>,
        @Inject(REQUEST) private request: Request,
        private flowHelper: FlowHelper
    ) {}

    async create(textBody) {
        try {
            const decoded = this.request.body.decodedUser;
            let newTextMessageObj = null;
            if (!textBody.companyTextMessageId) {
            newTextMessageObj = {
            to: textBody.to,
            body: textBody.body,
            scheduledDate: textBody.scheduledDate,
            isSchedule: !textBody.isSentNow,
            companyTextMessageId: decoded.user.companyUserId,
            clientTextMessageId: textBody.clientTextMessageId,
            flowTextMessageId: textBody.flowTextMessageId || null,
            replySid: '',
            replyStatus: '',
            replyErrorCode: '',
            replyErrorMessage: '',
            status: 'Replied'
            };
            } else {
                newTextMessageObj = textBody;
            }
        const client = await this.clientRepository
        .createQueryBuilder('client')
        .where({ id: textBody.clientTextMessageId })
        .leftJoinAndSelect('client.companies', 'companies')
        .getOne()

        if (!client)
          throw new HttpException('Error sending text. No client found', HttpStatus.BAD_REQUEST);

        newTextMessageObj['clientObj'] = client;
        const newTextMessage = await this.flowHelper.scheduleTextMessage(newTextMessageObj);
        return newTextMessage
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)            
        }
    }

    async update(id, textBody) {
        try {
            const decoded = this.request.body.decodedUser;
            const textMessage = await this.textMessagesRepository.findOne({
                where: {
                    id: id,
                    companyTextMessageId: decoded.companyId},
            });
            if (!textMessage)
                throw new HttpException('TextMessage not found!', HttpStatus.BAD_REQUEST)

            const updatedTextMessage = await this.textMessagesRepository.save({ ...textMessage , ...textBody });
            return updatedTextMessage;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)            
        }
    }

    async delete(id) {
        try {
            const textMessage = await this.textMessagesRepository.delete(id);
            if(textMessage.affected === 0) 
                throw new HttpException('TextMessage not deleted!', HttpStatus.BAD_REQUEST);
            return { message: 'TextMessage deleted successfully' }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByCompany() {
        try {
            const decoded = this.request.body.decodedUser;
            const allTextMessages = await this.textMessagesRepository.find({
                where: {
                    companyTextMessageId: decoded.user.companyUserId,
                },
            });
            if (!allTextMessages)
                throw new HttpException('TextMessage not found!', HttpStatus.BAD_REQUEST)

            return allTextMessages;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listOneById(id) {
        try {
            const decoded = this.request.body.decodedUser;
            const oneTextMessage = await this.textMessagesRepository.findOne({
                where: {
                    id: id,
                    companyTextMessageId: decoded.user.companyUserId,
                },
            });
            if (!oneTextMessage) 
                throw new HttpException('TextMessage not found!', HttpStatus.BAD_REQUEST)
    
            return oneTextMessage;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
