import { Post, Controller } from '@nestjs/common';
import { TriggerService } from './trigger.service';

@Controller('trigger')
export class TriggerController {
    constructor(private readonly triggerService: TriggerService) {}
    /**
     * @return status of triggerd event
     */
    @Post('/cron')
    fireCronTrigger() {
        return this.triggerService.fireCronTrigger();
    }
}