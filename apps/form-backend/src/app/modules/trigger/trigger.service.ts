import { Injectable, Inject, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LifecycleEmailService } from '../lifecycle-email/lifecycle-email.service';
import { IntegrationService } from '../integration/integration.service';
import { Clients } from '../client/client.entity';

@Injectable({ scope: Scope.REQUEST })
export class TriggerService {
    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(Clients) private clientsRepository: Repository<Clients>,
        private integrationService: IntegrationService,
        private lifecycleEmailService: LifecycleEmailService,
    ) { }

    async fireCronTrigger() {
        try {
            const clientIds = this.request.body.clientIds;
            if (!clientIds || (clientIds.length && clientIds.length === 0))
                throw new HttpException('Error triggering from cron. No client ids received', HttpStatus.BAD_REQUEST);
            const passedIds = [];

            for (const clientId of clientIds) {
                //Fire integration
                const integrationResult = await this.integrationService.fireIntegrations(clientId);
                //Fire notification
                let notificationResult = await this.lifecycleEmailService.handleSendEmail({ clientId: clientId, emailType: 'newLead' }, null, null, null);
                let logs = [];

                if (integrationResult.result && (integrationResult.result.passed || integrationResult.result.failed))
                    logs = [...integrationResult.result.passed, ...integrationResult.result.failed];
                notificationResult = {status: true, error: null};
                if (!notificationResult.status)
                    logs.push(JSON.stringify(notificationResult.error));
                else
                    logs.push('Notifications passed');

                if (logs.length > 0)
                    await this.clientsRepository.update(clientId, { cronTriggerLog: logs });
                if (
                    (integrationResult && integrationResult.status) ||
                    (notificationResult && notificationResult.status)
                ) passedIds.push(clientId);

                await this.clientsRepository.update({
                    id: clientId,
                    // silent: true
                }, { formStatus: 'New', cronTriggerFireDate: new Date() });
            }

            return {
                title: 'Trigger fired successfully',
                success: true,
                ids: passedIds
            };

        } catch (error) {
            throw new HttpException('Error triggering new lead. Method failed', HttpStatus.BAD_REQUEST);
        }
    }
}
