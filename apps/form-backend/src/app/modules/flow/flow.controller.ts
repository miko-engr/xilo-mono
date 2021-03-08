import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FlowService } from './flow.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { AuthGuard } from '../../guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}
  @Get('new/lead')
  listNewLeadFlowByCompany() {
    return this.flowService.listNewLeadFlowByCompany();
  }
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.flowService.listOne(id);
  }
  @Get()
  listByCompany() {
    return this.flowService.listByCompany();
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() bodyObj: CreateFlowDto) {
    return this.flowService.update(id, bodyObj);
  }

  @Post()
  create(@Body() bodyObj: CreateFlowDto) {
    return this.flowService.create(bodyObj);
  }
  @Post('search')
  findSearch(@Body('searchTitle') searchTitle: string) {
    return this.flowService.findSearch(searchTitle);
  }
  @Delete(':id')
  deleteFlow(@Param('id') id: number) {
    return this.flowService.deleteFlow(id);
  }
}
