import { Controller, Get, Body, Param, Patch } from '@nestjs/common';
import { CronService } from './cron.service';
import { CreateCronDto } from './dto/create-cron.dto';
@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}
  @Get()
  schedule(@Param('token') token: string, @Param('minutes') minutes: string) {
    return this.cronService.schedule(token, minutes);
  }
  @Patch('edit/:id')
  update(@Param('id') id: number, @Body() cronBody: CreateCronDto) {
    return this.cronService.update(id, cronBody);
  }
  @Get(':id')
  listOneById(@Param('id') id: number) {
    return this.cronService.listOneById(id);
  }

  @Get('all/crons')
  list() {
    return this.cronService.list();
  }
}
