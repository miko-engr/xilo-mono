import { Controller, Get, Param, Query } from '@nestjs/common';
import { FormService } from '../form/form.service';
import { ClientService } from '../client/client.service';

@Controller('integration-validator')
export class IntegrationValidatorController {
    constructor(
    private readonly formService: FormService,
    private readonly clientService: ClientService
) {}

/**
 * Validate form 
 */
@Get('form/:id/:type/:vendor')
validateForm(
    @Param('id') id: number,
    @Param('type') type: string,
    @Query('method') method: string) {
    return this.formService.validateForm(id, type, method)
}

@Get('v2/form/:id/:type/:vendor')
validateFormV2(
    @Param('id') id: number,
    @Param('type') type: string,
    @Param('vendor') vendor: string) {
    return this.formService.validateFormV2(id, type, vendor)
}

/**
 * Validate form fields
 */
@Get('form/fields/:id/:type/:vendor')
validateFields(
    @Param('id') id: number,
    @Param('type') type: string) {
    return this.formService.validateFields(id, type)
}

/**
 * Validate client
 */
@Get('client/:id/:type')
validateClient(
    @Param('id') id: number,
    @Param('type') type: string,
    ) {
    return this.clientService.validateClient(id, type)
}
}
