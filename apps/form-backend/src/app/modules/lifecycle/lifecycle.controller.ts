import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Delete,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { LifecycleService } from './lifecycle.service';
import { LifecycleDto } from './dto/lifecycle.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('lifecycle')
export class LifecycleController {
    constructor(private readonly lifecycleService: LifecycleService) { }
    /**
     * @param {number} id  The id of the companyLifecycleId
     * @return lifecycle based on isNewClient
     */
    @Get('/new-client/:id')
    listCompaniesNewClientLifecycle(@Param('id') id: number) {
        return this.lifecycleService.listCompaniesNewClientLifecycle(id)
    }
    /**
     * @param {number} id  The id of the companyLifecycleId
     * @return lifecycle based on isQuoted
     */
    @Get('/quoted/:id')
    listCompaniesQuotedLifecycle(@Param('id') id: number) {
        return this.lifecycleService.listCompaniesQuotedLifecycle(id)
    }
    /**
     * @param {number} id  The id of the companyLifecycleId
     * @return lifecycle based on isQuoted
     */
    @Get('/sold/:id')
    listCompaniesSoldLifecycle(@Param('id') id: number) {
        return this.lifecycleService.listCompaniesSoldLifecycle(id)
    }
    /**
     * @param {number} id  The id of the companyLifecycleId
     * @return lifecycle by id
     */
    @Get('/:id')
    @UseGuards(AuthGuard)
    listOne(@Param('id') id: number) {
        return this.lifecycleService.listOne(id)
    }
    /**
     * @param {number} id  The id of the companyLifecycleId
     * @return lifecycles by companyLifecycleId based on user
     */
    @Get('/')
    @UseGuards(AuthGuard)
    list() {
        return this.lifecycleService.list()
    }
    /**
     * @return lifecycles by companyLifecycleId based on agent
     */
    @Get('/company/agent')
    @UseGuards(AuthGuard)
    listByCompanyForAgent() {
        return this.lifecycleService.listByCompanyForAgent()
    }
    /**
     * @return lifecycles by companyLifecycleId based on user
     */
    @Get('/company/user')
    @UseGuards(AuthGuard)
    listByCompanyForUser() {
        return this.lifecycleService.listByCompanyForUser()
    }
    /**
     * @return lifecycles by companyId
     */
    @Get('/company/all')
    @UseGuards(AuthGuard)
    listByCompany() {
        return this.lifecycleService.listByCompany()
    }
    /**
     * @param {number} id  The id of the lifecycle
     * @return updatedLifecycle by lifecycleId
     */
    @Patch('/:id')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id') id: number) {
        return this.lifecycleService.update(id)
    }
    /**
     * @param {number} id  The id of the lifecycle
     * @Body {LifecycleDto} lifecycleBody  The body of the lifecycle
     * @return updatedLifecycle by lifecycleId
     */
    @Post('/')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() lifecycleBody: LifecycleDto) {
        return this.lifecycleService.create(lifecycleBody)
    }
    /**
     * @param {number} id  The id of the lifecycle
     * @return status of deleteLifecycle 
     */
    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteLifecycle(@Param('id') id: number) {
        return this.lifecycleService.deleteLifecycle(id)
    }
}