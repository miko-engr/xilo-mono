import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextMessages } from '../../text-messages/TextMessages.entity';
import { sendGrid, twilioConfig } from '../../../constants/appconstant';
import * as sg from '@sendgrid/mail';
sg.setApiKey(sendGrid.SENDGRID_API_KEY);
import * as twilio from 'twilio';
import Mustache from 'mustache';
import { emailRegEx } from '../../../helpers/email.helper';
import { Emails } from '../../email/emails.entity';
import { Flows } from '../flows.entity';
import { Clients } from '../../client/client.entity';

@Injectable()
export class FlowHelper {
    constructor(
        @InjectRepository(TextMessages)
        private textMessageRepository: Repository<TextMessages>,
        @InjectRepository(Emails)
        private emailRepository: Repository<Emails>,
        @InjectRepository(Flows)
        private flowRepository: Repository<Flows>,
        @InjectRepository(Clients)
        private clientRepository: Repository<Clients>
    ) {}

    async scheduleTextMessage(newTextMessageObj) {
            const currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            currentDate.setDate(currentDate.getDate() - 1);
            const scheduledDate = new Date(newTextMessageObj.scheduledDate);

            if (scheduledDate > currentDate) {
                throw new Error('Please try a proper sent date near about 1 year!');
            }
            if (newTextMessageObj.isSentNow) {
                const obj = {
                    company: newTextMessageObj.clientObj.companies,
                    client: newTextMessageObj.clientObj
                }
                const accountSid = (newTextMessageObj.clientObj.companies.textConfig 
                    ? newTextMessageObj.clientObj.companies.textConfig.accountSid 
                    : null) || twilioConfig.ACCT_SID;
                const authToken = (newTextMessageObj.clientObj.companies.textConfig 
                    ? newTextMessageObj.clientObj.companies.textConfig.accountToken
                    : null) || twilioConfig.AUTH_TOKEN;
                const client = twilio(accountSid, authToken);
                let message = {};
                try {
                    if(newTextMessageObj.to.length === 10 && !newTextMessageObj.to.startsWith("1")) {
                        newTextMessageObj.to = `+1${newTextMessageObj.to}`
                    } else if(newTextMessageObj.to.length === 11 && newTextMessageObj.to.startsWith("1")) {
                        newTextMessageObj.to = `+${newTextMessageObj.to}`
                    }

                    const from = newTextMessageObj.clientObj.companies.textConfig.from 
                        ? newTextMessageObj.clientObj.company.textConfig.from 
                        : null;

                    const textObj = {
                        body: Mustache.render(newTextMessageObj.body, obj),
                        from: from || twilioConfig.DEFAULT_FROM_NO,
                        to: newTextMessageObj.to,
                    };
                    textObj.body = textObj.body.replace(/\n/g, "<br/>");
                    message = await client.messages.create(textObj);
                } catch (error) {
                    throw new Error(`Text message not sent!${error}`);
                }
                if (message['message']) {
                    newTextMessageObj.replyStatus = 'failed';
                    newTextMessageObj.replyErrorCode = message['status'];
                    newTextMessageObj.replyErrorMessage = message['message'];
                } else if (!message['errorCode'] && !message['errorMessage']) {
                    newTextMessageObj.replySid = message['sid'];
                    newTextMessageObj.replyStatus = 'success';
                    newTextMessageObj.replyErrorCode = message['errorCode'];
                    newTextMessageObj.replyErrorMessage = message['errorMessage'];
                    newTextMessageObj.status = 'Replied';
                }
            }

            const from = newTextMessageObj.clientObj.companies.textConfig 
                ? newTextMessageObj.clientObj.companies.textConfig.from 
                : null;
            if (from) {
                newTextMessageObj.from = from;
            }
            newTextMessageObj['createdAt'] = new Date()
            newTextMessageObj['updatedAt'] = new Date()
            const newTextMessage = await this.textMessageRepository.save(newTextMessageObj);
            return newTextMessage;
    }

    async scheduleEmail(data) {
        try {
            const isValidRecipientEmail = emailRegEx.test(String(data.recipient).toLowerCase());
            if (!isValidRecipientEmail)
                throw new Error('Email not valid!');
            const currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            currentDate.setDate(currentDate.getDate() - 1);
            const scheduledDate = new Date(data.scheduledDate);
            if (scheduledDate > currentDate)
                throw new Error('Invliad scheduledDate. It should be near about 1 year!');
            if (data.isSentNow) {
                const obj = {
                    company: data.clientObj.companies,
                    client: data.clientObj
                }

                const emailObj = {
                    to: data.recipient,
                    from: data.sender || sendGrid.FROM_EMAIL,
                    subject: Mustache.render(data.subject, obj),
                    html: Mustache.render(data.body, obj)
                };
                emailObj.html = emailObj.html.replace(/\n/g, "<br/>");
                let response;
                try {
                    response = await sg.send(emailObj);
                } catch(error) {
                    response = error;
                }

                if ((response[0] && response[0].statusCode && response[0].statusCode !== 200 && response[0].statusCode !== 202) || (response && response.code && response.code !== 200 && response.code !== 202)) {
                    data.replyStatus = 'failed';
                    data.replyErrorMessage = 'Error while sending email immediately';
                } else {
                    data.replyStatus = 'success';
                }
            }
            const newEmail = await this.emailRepository.save(data);
            return newEmail
        } catch (error) {
            throw new Error('Email not sent!');
        }
    }

    async addToFlow (flowId, clientId, companyFlowId) {
            let result = [];
            const flow = await this.flowRepository.findOne({
                where: { id: flowId }
            });
            const client: any = await this.clientRepository.findOne({
                where: { id: clientId },
                join: {
                    alias: 'client',
                    leftJoinAndSelect: {
                        'client.companies': 'companies'
                    }
                }
            });
            const sequence = flow.sequence;
            await this.clientRepository.update({id: clientId}, {flowClientId: flowId});
            if (sequence) {
                const date = new Date();
                let dMilliseconds = date.valueOf();
                const startMilli = dMilliseconds;

                result = sequence.map(async (item: any) => {
                    try {
                        let response;
                        if (item.isTimeDelay) {
                            const mSeconds = +item.secondsDelay * 1000;
                            const mMinutes = +item.minutesDelay * 60000;
                            const mHour = +item.hoursDelay * 3600000;
                            const mDay = +item.daysDelay * 86400000;
                            const milliseconds = mSeconds + mMinutes + mHour + mDay;
                            dMilliseconds += milliseconds;
                            response = dMilliseconds
                        }
                        if (item.isEmail) {
                            const newEmail = {
                                clientObj : client,
                                recipient : client.email,
                                sender : client.companies.emailConfig ? client.companies.emailConfig.from : null,
                                subject : item.title,
                                body : item.body,
                                companyEmailId : companyFlowId,
                                clientEmailId : +clientId,
                                flowEmailId : flow.id,
                                status : 'Replied',
                            }
                            if (startMilli !== dMilliseconds) {
                                newEmail['scheduledDate'] = (new Date(dMilliseconds));
                                newEmail['isSchedule'] = true;
                                newEmail['isSentNow'] = false;
                            } else {
                                newEmail['scheduledDate'] = (new Date());
                                newEmail['isSchedule'] = false;
                                newEmail['isSentNow'] = true;
                            }
                            response = await this.scheduleEmail(newEmail);
                            response = {response: response.id, 'type': 'email'}
                        }
                        if (item.isText) {
                            const newText = {
                                clientObj : client,
                                to : client.phone,
                                from : client.companies.textConfig ? client.companies.textConfig.from : null,
                                body : item.body,
                                clientTextMessageId : +clientId,
                                companyTextMessageId : companyFlowId,
                                flowTextMessageId : flow.id,
                                status : 'Replied',
                                scheduledDate : (new Date(dMilliseconds)),
                            }
                            if (startMilli !== dMilliseconds) {
                                newText.scheduledDate = (new Date(dMilliseconds));
                                newText['isSchedule'] = true;
                                newText['isSentNow'] = false;
                            } else {
                                newText.scheduledDate = (new Date());
                                newText['isSchedule'] = false;
                                newText['isSentNow'] = true;
                            }
                            response = await this.scheduleTextMessage(newText);
                            response = {response: response.id, 'type': 'text'}
                        }

                        return response;
                    } catch (error) {
                        return error.message;
                    }
                });
            }
        return Promise.all(result);
    }

    async removeFromFlow(clientId, companyId) {
        
        await this.clientRepository.createQueryBuilder('Client')
        .update(Clients)
        .set({ flowClientId: null })
        .where({ id: clientId, companyClientId: companyId })
        .execute();
        
        await this.emailRepository.createQueryBuilder('Email')
        .delete()
        .from(Emails)
        .where({ clientEmailId: clientId, companyEmailId: companyId })
        .execute();
        
        await this.textMessageRepository.createQueryBuilder('TextMessages')
        .delete()
        .from(TextMessages)
        .where({ clientTextMessageId: clientId, companyTextMessageId: companyId })
        .execute()
            
        return 'Flow removed from client successfully.';
    }
}