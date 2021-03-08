import { Get, Post, Controller, Query, Body } from '@nestjs/common';
import { ZapierService } from './zapier.service';
import { ZapiersyncsDto } from './dto/zapier.dto';

@Controller('zapier')
export class ZapierController {
    constructor(private zapierService: ZapierService) { }

    @Get('/trigger')
    trigger(
        @Query('companyId') companyId: string,
        @Query('model') model: string,
    ) {
        return this.zapierService.trigger(companyId, model);
    }

    @Get('/lifecycle-trigger')
    lifecycleTrigger(
        @Query('companyId') companyId: string,
    ) {
        return this.zapierService.lifecycleTrigger(companyId);
    }

    @Get('/agent-trigger')
    agentTrigger(
        @Query('companyId') companyId: string,
    ) {
        return this.zapierService.agentTrigger(companyId);
    }

    @Get('/event-trigger')
    finishedEventByCompanyForm(
        @Query('companyId') companyId: string,
    ) {
        return this.zapierService.finishedEventByCompanyForm(companyId);
    }

    @Get('/event-trigger-sample')
    fetchSmpleFieldsByForm(@Query('companyId') companyId: string) {
        return this.zapierService.fetchSmpleFieldsByForm(companyId);
    }

    @Get('/fetch-company-forms')
    fetchCompanyForm(@Query('companyId') companyId: string) {
        return this.zapierService.fetchCompanyForm(companyId);
    }

    @Post('/create')
    create(@Body() zapierBody: ZapiersyncsDto) {
        return this.zapierService.create(zapierBody);
    }

    @Post('/create-flattened-client')
    createFlattenedClient(@Query('companyId') companyId: string, @Body() zapierBody: object) {
        return this.zapierService.createFlattenedClient(companyId, zapierBody);
    }

    @Post('/create/lifecycle')
    changeLifecycle(@Body() zapierBody: ZapiersyncsDto) {
        return this.zapierService.changeLifecycle(zapierBody);
    }
}
