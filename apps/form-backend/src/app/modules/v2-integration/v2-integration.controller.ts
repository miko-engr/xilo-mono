import { Controller, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { IntegrationService } from '../integration/integration.service';
import { CreateIntegrationDto } from '../integration/dto/create-integration.dto';
@Controller('v2-integration')
export class V2IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}
  @Post()
  create(@Body() bodyObj: CreateIntegrationDto) {
    return this.integrationService.create(bodyObj);
  }
  @Put('update')
  update(@Body() bodyObj: CreateIntegrationDto) {
    return this.integrationService.update(bodyObj.id, bodyObj);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    return this.integrationService.remove(id);
  }
}
