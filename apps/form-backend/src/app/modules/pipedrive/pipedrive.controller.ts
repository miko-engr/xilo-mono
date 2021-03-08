import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { PipedriveService } from './pipedrive.service';
@Controller('pipedrive')
export class PipedriveController {
  constructor(private readonly pipedriverService: PipedriveService) {}

  @Get('deals')
  getDeals(@Query() query: any) {
    return this.pipedriverService.getDeals(query);
  }
  @Get('pipelines/:companyId')
  async getPipelinesAndupdateCompanyPipeline(
    @Param('companyId') companyId: number,
    @Query() query: any
  ) {
    try {
      const data = await this.pipedriverService.getPipelines(query);
      return this.pipedriverService.updateCompanyPipeline(companyId, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('stages/:companyId')
  async getStagesAndupdateCompanyStage(
    @Param('companyId') companyId: number,
    @Query() query: any
  ) {
    try {
      const data = await this.pipedriverService.getStages(query);
      return this.pipedriverService.updateCompanyStage(data, companyId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('add-deal')
  addDeal(@Body() dealBody: any) {
    return this.pipedriverService.addDeal(dealBody);
  }
  @Post('add-note/:clientId')
  addNote(@Param('clientId') clientId: number, @Body() noteBody: any) {
    return this.pipedriverService.addNote(clientId, noteBody);
  }
  @Post('add-person')
  addPerson(@Body() personBody: any) {
    return this.pipedriverService.addPerson(personBody);
  }
  @Post('update-note/:id/:clientId')
  updateNote(@Param('clientId') clientId: number, @Param('id') id: number) {
    return this.pipedriverService.updateNote(clientId, id);
  }
}
