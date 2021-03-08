import { Put, Param, Controller } from '@nestjs/common';
import { QqCatalystService } from './qq-catalyst.service';

@Controller('qq-catalyst')
export class QqCatalystController {
    constructor(private readonly qqCatalystService: QqCatalystService) { }
    /**
     * @param {number} clientId The id of Client 
     */
    @Put('/contact/:clientId')
    createContact(@Param('clientId') clientId: number) {
        return this.qqCatalystService.createContact(clientId);
    }

    @Put('/policy')
    createPolicy() {
        return this.qqCatalystService.createPolicy();
    }
    /**
     * @param {number} policyId
     */
    @Put('/quote/:policyId')
    createQuote(@Param('policyId') policyId: number) {
        return this.qqCatalystService.createQuote(policyId);
    }

    @Put('/task')
    createTask() {
        return this.qqCatalystService.createTask();
    }
}
