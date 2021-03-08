import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('clients')
  getClients() {
    return this.analyticsService.getClients();
  }
  @Get('agents')
  getAgents() {
    return this.analyticsService.getAgents();
  }
  @Get('lifecycles')
  getLifecycles() {
    return this.analyticsService.getLifecycles();
  }
}
