import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WealthboxService } from './wealthbox.service';
import { ClientDetailsDto } from './dto/clientDetails.dto';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('wealthbox')
export class WealthboxController {
    constructor(
        private readonly wealthboxService: WealthboxService,
    ) {}

    @Post('/createContact/:clientId')
    createContact(@Body() clientDetails: ClientDetailsDto, @Param('clientId') clientId: string) {
        return this.wealthboxService.createContact(clientDetails, clientId);
    }
    @Post('/createTask/:clientId')
    createTask(@Body() clientDetails: ClientDetailsDto, @Param('clientId') clientId: string) {
        return this.wealthboxService.createTask(clientDetails, clientId);
    }
    @Post('/createEvent/:clientId')
    createEvent(@Body() clientDetails: ClientDetailsDto, @Param('clientId') clientId: string) {
        return this.wealthboxService.createEvent(clientDetails, clientId);
    }
    @Post('/createProject/:clientId')
    createProject(@Body() clientDetails: ClientDetailsDto, @Param('clientId') clientId: string) {
        return this.wealthboxService.createProject(clientDetails, clientId);
    }
    @Post('/createNote/:clientId')
    createNote(@Body() clientDetails: ClientDetailsDto, @Param('clientId') clientId: string) {
        return this.wealthboxService.createNote(clientDetails, clientId);
    }
    @Post('/createOpportunity/:clientId')
    createOpportunity(@Body() clientDetails: ClientDetailsDto, @Param('clientId') clientId: string) {
        return this.wealthboxService.createOpportunity(clientDetails, clientId);
    }
    @Post('/createWorkflow/:clientId')
    createWorkflow(@Body() clientDetails: ClientDetailsDto, @Param('clientId') clientId: string) {
        return this.wealthboxService.createWorkflow(clientDetails, clientId);
    }
}