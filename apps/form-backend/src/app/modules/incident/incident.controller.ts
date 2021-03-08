import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}
  @Post('create')
  create(@Body() bodyObj: CreateIncidentDto) {
    return this.incidentService.create(bodyObj);
  }
  @Patch('upsert')
  upsert(@Body() bodyObj: CreateIncidentDto) {
    return this.incidentService.upsert(bodyObj);
  }
  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.incidentService.delete(id);
  }
  @Get('list/company')
  listByCompany() {
    return this.incidentService.listByCompany();
  }
  @Get('list/id/:id')
  listOneById(@Param('id') id: number) {
    return this.incidentService.listOneById(id);
  }
}
