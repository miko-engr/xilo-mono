import { Controller, Get, Query, Post, Param } from '@nestjs/common';
import { GoogleService } from './google.service';
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('auth/url')
  getGoogleAuthUrl() {
    return this.googleService.getGoogleAuthUrl();
  }
  @Get('auth')
  handleAuthGrant(@Query('code') code: string) {
    return this.googleService.handleAuthGrant(code);
  }
  @Get('adwords/campaigns')
  getCampaigns() {
    return this.googleService.getCampaigns();
  }
  @Get('analytics/report')
  getAnalyticsReport() {
    return this.googleService.getAnalyticsReport();
  }
  @Post('analytics/report/heatmap')
  getAnalyticsReportHeatmap() {
    return this.googleService.getAnalyticsReportHeatmap();
  }
  @Get('analytics/report/funnel/:year/:month/:day')
  getLPsAndCTAsByPaths(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Query() query: any
  ) {
    return this.googleService.getLPsAndCTAsByPaths(year, month, day, query);
  }
  @Get('analytics/report/landing-pages')
  getLandingPages(@Query() query: any) {
    return this.googleService.getLandingPages(query);
  }
  @Get('analytics/report/landing-pages/filter/path')
  getSessionsByPath(@Query() query: any) {
    return this.googleService.getSessionsByPath(query);
  }
  @Get('analytics/report/ctas')
  getCTAs(@Query() query: any) {
    return this.googleService.getCTAs(query);
  }
  @Get('analytics/report/ctas/filter/path')
  getCTAsByPaths(@Query() query: any) {
    return this.googleService.getCTAsByPaths(query);
  }
  @Get('analytics/report/mediums')
  getAnalyticsByMedium(@Query() query: any) {
    return this.googleService.getAnalyticsByMedium(query);
  }
  @Get('analytics/report/events-sessions/medium')
  getEventsSessionsByMedium(@Query() query: any) {
    return this.googleService.getEventsSessionsByMedium(query);
  }
  @Get('analytics/report/sessions/landing-page/medium')
  getSessionsByLPMedium(@Query() query: any) {
    return this.googleService.getSessionsByLPMedium(query);
  }
  @Get('analytics/report/events/cta/medium')
  getEventsByCTAMedium(@Query() query: any) {
    return this.googleService.getEventsByCTAMedium(query);
  }
  @Get('analytics/report/mediums/landing-pages')
  getSessionsByLpAndMedium() {
    return this.googleService.getSessionsByLpAndMedium();
  }
}
