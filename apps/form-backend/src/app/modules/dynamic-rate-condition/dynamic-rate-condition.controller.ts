import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';

import { DynamicRateConditionService } from './dynamic-rate-condition.service';
import { DynamicRateConditionDto } from './dto/dynamic-rate-condition.dto'
import { AuthGuard } from '../../guards/auth.guard';

@Controller('dynamic-rate-condition')
export class DynamicRateConditionController {
    constructor(private readonly dynamicRateConditionService: DynamicRateConditionService) { }

    /**
     * @returns all dynamicRateConditions with coverages and parameters Array
     */
    @UseGuards(AuthGuard)
    @Get('/')
    list() {
        return this.dynamicRateConditionService.list();
    }

    /**
     * @returns dynamicRateConditions with coverages and parameters Array by companyId
     */
    @UseGuards(AuthGuard)
    @Get('/company')
    listByCompany() {
        return this.dynamicRateConditionService.listByCompany();
    }

    /**
     * @param {number} id  The id of the formRate
     * @returns dynamicRateConditions with coverages and parameters,formRate Array by formRateId
     */
    @UseGuards(AuthGuard)
    @Get('/company/:id')
    listByCompanyAndForm() {
        return this.dynamicRateConditionService.listByCompanyAndForm();
    }

    /**
     * @param {number} id  The id of the dynamicRateConditions
     * @returns dynamicRateConditions by id
     */
    @UseGuards(AuthGuard)
    @Get('/:id')
    listOne(@Param('id') id: number) {
        return this.dynamicRateConditionService.listOne(id);
    }

    /**
     * @param {number} id The id of the dynamicRateCondition
     * @returns created or updated a dynamicRateCondition
     */
    @UseGuards(AuthGuard)
    @Patch('/:id')
    update(@Param('id') id: number) {
        return this.dynamicRateConditionService.update(id);
    }

    /**
     * @param {dynamicRateCondition} dynamicRateCondition object to create
     * @returns created dynamicRateCondition object
     */
    @Post('/')
    create(@Body() dynamicRateConditionBody: DynamicRateConditionDto) {
        return this.dynamicRateConditionService.create(dynamicRateConditionBody);
    }

    /**
     * @param {dynamicRateCondition} duplicate dynamicRateCondition object to created
     * @returns created dynamicRateCondition object
     */
    @Post('/duplicate')
    duplicate(@Body() dynamicRateConditionBody: DynamicRateConditionDto) {
        return this.dynamicRateConditionService.duplicate(dynamicRateConditionBody);
    }

    /**
     * @param {number} id   The id of the dynamicRateCondition
     * @returns success message or error message
     */
    @UseGuards(AuthGuard)
    @Delete('/:id')
    deleteRateCondition(@Param('id') id: number) {
        return this.dynamicRateConditionService.deleteRateCondition(id);
    }
}
