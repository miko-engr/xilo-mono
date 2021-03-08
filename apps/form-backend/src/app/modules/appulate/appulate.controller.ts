import { Controller, Put, Body } from '@nestjs/common';
import { AppulateService } from './appulate.service';
import { ContractDetailsDto } from './dto/contract-details.dto';

@Controller('appulate')
export class AppulateController {
    constructor(
        private readonly appulateService: AppulateService,
    ) {}

    @Put('/')
    createContact(@Body() contractDetails: ContractDetailsDto) {
        return this.appulateService.createContact(contractDetails);
    }
}
