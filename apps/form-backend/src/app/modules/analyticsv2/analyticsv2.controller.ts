import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Analyticsv2Service } from './analyticsv2.service';
import { AuthGuard } from '../../guards/auth.guard';
import { Request, Response } from 'express';
@Controller('analyticsv2')
export class Analyticsv2Controller {
  constructor(private readonly analyticsv2Service: Analyticsv2Service) {}

  /**
   * This function will return analytics reference by company
   * @returns company information by id
   */
  @Get('analytics-prefrence')
  @UseGuards(AuthGuard)
  getAnalyticsPrefrence() {
    return this.analyticsv2Service.getAnalyticsPrefrence();
  }

  /**
   * This function will return company lifecycle array
   * @returns company lifecycle array
   */
  @Get('get-company-lifecycle-name')
  @UseGuards(AuthGuard)
  getCompanyLifeCycleName() {
    return this.analyticsv2Service.getCompanyLifeCycleName();
  }

  /**
   * This function will return forn analytics chart header
   */
  @Get('form-analytic-chart-header')
  @UseGuards(AuthGuard)
  formAnalyticChartHeader() {
    return this.analyticsv2Service.formAnalyticChartHeader();
  }

  /**
   * This function will return forn analytics chart
   * {Params} form id
   */
  @Get('form-analytic-chart/:id')
  @UseGuards(AuthGuard)
  formAnalyticChart(@Param('id') id: number) {
    return this.analyticsv2Service.formAnalyticChart(id);
  }

  /**
   * This function will return client chart headers
   */
  @Get('client-chart-headers/:attribute')
  getClientChartHeaders(@Param('attribute') attribute: string) {
    return this.analyticsv2Service.getClientChartHeaders(attribute);
  }

  @Get('client-chart/:attribute/:chartType/:period')
  @UseGuards(AuthGuard)
  clientChart() {
    return this.analyticsv2Service.clientChart();
  }

  /**
   * This function will return client lifecycle analytics
   */
  @Get('get-lifecycle-analytics')
  @UseGuards(AuthGuard)
  getClientLifecycleAnalytics() {
    return this.analyticsv2Service.getClientLifecycleAnalytics();
  }

  /**
   * This function will create form analytics
   */
  @Post('record-form-analytics/new')
  recordFormAnalyticsNew(@Req() req: Request, @Res() res: Response) {
    return this.analyticsv2Service.recordFormAnalytics(req, res);
  }

  /**
   * This function will create form analytics
   */
  @Post('record-form-analytics')
  @UseGuards(AuthGuard)
  recordFormAnalytics(@Req() req: Request, @Res() res: Response) {
    return this.analyticsv2Service.recordFormAnalytics(req, res);
  }

  /**
   * This function will returns lifecycle analytics
   */
  @Get('life-cycle-analytic-chart/:attribute/:period/:startDate/:endDate')
  @UseGuards(AuthGuard)
  lifeCycleAnalyticChart(@Req() req: Request, @Res() res: Response) {
    return this.analyticsv2Service.lifeCycleAnalyticChart(req, res);
  }

  @Get('get-company-client-latlong/:period/:lifecycleId')
  @UseGuards(AuthGuard)
  getCompanyClientLanLong(@Req() req: Request, @Res() res: Response) {
    return this.analyticsv2Service.getCompanyClientLanLong(req, res);
  }

}
