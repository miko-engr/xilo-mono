import { Controller, Get, Param } from '@nestjs/common';
import { AgencyMatrixService } from './agency-matrix.service';

@Controller('agency-matrix')
export class AgencyMatrixController {
  constructor(private readonly agencyMatrixService: AgencyMatrixService) {}
  @Get(':type/:clientId')
  listOneById(
    @Param('type') type: string,
    @Param('clientId') clientId: number
  ) {
    return this.agencyMatrixService.createFile(type, clientId);
  }
}
