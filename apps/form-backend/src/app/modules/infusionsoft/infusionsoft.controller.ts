import {
    Controller,
    Get,
    Put,
    Post,
    Param,
    Body,
} from '@nestjs/common';
import { CompanyDto } from '../../modules/company/dto/company.dto';
import { ClientDto } from '../../modules/client/dto/client.dto';
import { InfusionsoftService } from './infusionsoft.service';


@Controller('infusionsoft')
export class InfusionsoftController {
    constructor(private readonly infusionsoftService: InfusionsoftService) { }
    /**
     * @returns InfusionsoftAuthUrl with title
     */
    @Get('/auth/url')
    getInfusionsoftAuthUrl() {
        return this.infusionsoftService.getInfusionsoftAuthUrl();
    }
    /**
     * @returns updated company details 
     */
    @Get('/auth')
    requestAccessToken() {
        return this.infusionsoftService.requestAccessToken();
    }
    /**
     * @param {number} clientId  The id of the client
     * @param {number} companyId  The id of the company
     * @returns upserted contact
     */
    @Put('/upsert/:clientId/:companyId')
    async createOrUpdate(@Param('clientId') clientId: number, @Param('companyId') companyId: number) {
        await this.infusionsoftService.refreshAccessToken(companyId);
        return this.infusionsoftService.createOrUpdate(clientId, companyId);
    }
    /**
     * @param {number} companyId  The id of the company
     * @returns response of added contant to compaign
     */
    @Post('/add-to-campaign/:companyId')
    async addToCampaign(@Param('companyId') companyId: number, @Body() companyDto: CompanyDto, @Body() clientDto: ClientDto) {
        await this.infusionsoftService.refreshAccessToken(companyId);
        return this.infusionsoftService.addToCampaign(companyDto, clientDto);
    }
    /**
     * @param {number} clientId  The id of the client
     * @param {number} companyId  The id of the company
     * @returns response of added tag to infusionsoft contact
     */
    @Post('/add-tag/:clientId/:companyId')
    async addTagToContact(@Param('clientId') clientId: number, @Param('compnyId') companyId: number) {
        await this.infusionsoftService.refreshAccessToken(companyId);
        return this.infusionsoftService.addTagToContact(clientId);
    }
    /**
     * @param {number} clientId  The id of the client
     * @param {number} companyId  The id of the company
     * @returns response of added tag to infusionsoft contact
     */
    @Post('/upsert-client-tag/:clientId/:companyId')
    async upsertClientTag(@Param('clientId') clientId: number, @Param('compnyId') companyId: number, @Body() companyDto: CompanyDto, @Body() clientDto: ClientDto) {
        await this.infusionsoftService.refreshAccessToken(companyId);
        await this.infusionsoftService.createOrUpdate(clientId, companyId);
        await this.infusionsoftService.addToCampaign(companyDto, clientDto);
    }
    /**
     * @param {number} companyId  The id of the company
     * @returns list of tags
     */
    @Get('/list-tags/:companyId')
    async listTags(@Param('compnyId') companyId: number) {
        await this.infusionsoftService.refreshAccessToken(companyId);
        return this.infusionsoftService.listTags();
    }
}