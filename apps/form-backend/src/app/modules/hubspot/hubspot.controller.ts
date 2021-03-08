import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { HubspotService } from './hubspot.service';
import { HubspotDto } from './dto/hubspot.dto';

@Controller('hubspot')
export class HubspotController {
  constructor(private readonly hubspotService: HubspotService) { }

  @Post('create-update')
  createAndUpdate(@Body() hubspotDto: HubspotDto) {
    return this.hubspotService.createAndUpdate(hubspotDto);
  }
}
