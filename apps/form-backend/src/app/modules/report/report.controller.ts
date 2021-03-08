import { Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Post('weekly')
  createAndSendWeeklyReport() {
    return this.reportService.createAndSendWeeklyReport();
  }
  @Post('internal/daily')
  sendDailyInternalReport() {
    return this.reportService.sendDailyInternalReport();
  }
}
