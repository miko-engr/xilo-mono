import { Controller, Patch, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { CreateConditionDto } from './dto/create-condition.dto';
import { ConditionService } from './condition.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('condition')
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) { }
  @Patch('upsert-many')
  @UseGuards(AuthGuard)
  upsertMany(@Body() conditions: CreateConditionDto[]) {
    return this.conditionService.upsertMany(conditions);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number) {
    return this.conditionService.delete(id);
  }
}
