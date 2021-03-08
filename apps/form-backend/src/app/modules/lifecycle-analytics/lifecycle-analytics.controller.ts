import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LifecycleAnalyticsService } from './lifecycle-analytics.service';
import { LifecycleAnalyticsDto } from './dto/lifecycleAnalytics.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Request, Response } from 'express';
@Controller('lifecycle-analytics')
export class LifecycleAnalyticsController {
  constructor(
    private readonly lifecycleAnalyticsService: LifecycleAnalyticsService
  ) {}

  /**
   * @param lifecycleAnalyticsId : lifecycleanalyticsId
   * @returns lifecycleAnalytics object with id
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  listById(@Param('id') lifecycleAnalyticsId: number) {
    return this.lifecycleAnalyticsService.listById(lifecycleAnalyticsId);
  }

  /**
   * @param lifecycleAnalyticsId : lifecycleanalyticsId
   * @returns lifecycleAnalytics object with id
   */
  @Get('client/:id')
  @UseGuards(AuthGuard)
  listById2(@Param('id') lifecycleAnalyticsId: number) {
    return this.lifecycleAnalyticsService.listById(lifecycleAnalyticsId);
  }

  /**
   * @returns list of lifecycleAnalytics array based on company
   */
  @Get('')
  @UseGuards(AuthGuard)
  listByCompany() {
    return this.lifecycleAnalyticsService.listByCompany();
  }

  /**
   * @param id : companyId
   * @returns lifecycleAnalytics object with information of company
   */
  @Get('platform-manager/:id')
  listByCompanyPlatformManager(@Param('id') id: number) {
    return this.lifecycleAnalyticsService.listByCompanyPlatformManager(id);
  }

  /**
   * @param id : agentId
   * @returns lifecycleAnalytics object with information of agents
   */
  @Get('agent/:id')
  @UseGuards(AuthGuard)
  listByAgent(@Param('id') id: number) {
    return this.lifecycleAnalyticsService.listByAgent(id);
  }

  /**
   * @param id : clientId
   * @returns lifecycleAnalytics object with information of clients
   */
  @Get('filter/client/:id')
  @UseGuards(AuthGuard)
  listByClient(@Param('id') id: number) {
    return this.lifecycleAnalyticsService.listByClient(id);
  }

  /**
   * @param month : month of analytics
   * @returns list of lifecycleAnalytics information based on month
   */
  @Get('filter/month/:month')
  @UseGuards(AuthGuard)
  listByMonth(@Param('month') month: string) {
    return this.lifecycleAnalyticsService.listByMonth(month);
  }

  /**
   * @param id : companyId
   * @param month : month
   * @returns list of lifecycleAnalytics information based on month
   */
  @Get('filter/month/platform-manager/:month/:id')
  listByMonthPlatformManager(
    @Param('id') id: number,
    @Param('month') month: string
  ) {
    return this.lifecycleAnalyticsService.listByMonthPlatformManager(id, month);
  }

  /**
   * @param day : day
   * @returns list of lifecycleAnalytics information based on day
   */
  @Get('filter/day/:day')
  @UseGuards(AuthGuard)
  listByDay(@Param('day') day: number) {
    return this.lifecycleAnalyticsService.listByDay(day);
  }

  /**
   *
   * @param id : companyId
   * @param day : day
   * @returns list of lifecycleAnalytics information based on day
   */
  @Get('filter/day/platform-manager/:day/:id')
  listByDayPlatformManager(@Param('id') id: number, @Param('day') day: number) {
    return this.lifecycleAnalyticsService.listByDayPlatformManager(id, day);
  }

  /**
   *
   * @param year : year
   * @returns list of lifecycleAnalytics information based on year
   */
  @Get('filter/year/:year')
  @UseGuards(AuthGuard)
  listByYear(@Param('year') year: number) {
    return this.lifecycleAnalyticsService.listByYear(year);
  }

  /**
   *
   * @param id : lifecycleAnalyticsId
   */
  @Get('filter/lifecycle/:id')
  @UseGuards(AuthGuard)
  listByLifecycle(@Param('id') id: number) {
    return this.lifecycleAnalyticsService.listByLifecycle(id);
  }

  @Get('filter/lifecycle/:lifecycle/:year/:month?/:day?')
  @UseGuards(AuthGuard)
  listByLifecycleAndDate(@Req() req: Request, @Res() res: Response) {
    return this.lifecycleAnalyticsService.listByLifecycleAndDate(req, res);
  }

  @Get('filter/medium/date-range/:lifecycle/:date')
  @UseGuards(AuthGuard)
  listByLifecycleDateRangeMedium(@Req() req: Request, @Res() res: Response) {
    return this.lifecycleAnalyticsService.listByLifecycleDateRangeMedium(
      req,
      res
    );
  }

  @Get('filter/medium/:lifecycle/:year/:month?/:day?')
  @UseGuards(AuthGuard)
  listByLifecycleDateMedium(@Req() req: Request, @Res() res: Response) {
    return this.lifecycleAnalyticsService.listByLifecycleDateMedium(req, res);
  }

  /**
   *
   * @param id : lifecycleAnalyticsId
   * @param companyId : companyId
   */
  @Get('filter/lifecycle/platform-manager/:id/:companyId')
  listByLifecyclePlatformManager(
    @Param('id') id: number,
    @Param('companyId') companyId: number
  ) {
    return this.lifecycleAnalyticsService.listByLifecyclePlatformManager(
      id,
      companyId
    );
  }

  /**
   * @param lifecycleAnalyticsDto : contains lifecycleAnalytics object
   */
  @Post()
  create(@Body() lifecycleAnalyticsDto: LifecycleAnalyticsDto) {
    return this.lifecycleAnalyticsService.create(lifecycleAnalyticsDto);
  }

  /**
   * @param lifecycleAnalyticsDto : contains lifecycleAnalytics object
   */
  @Post('new-client')
  createNewClient(@Body() lifecycleAnalyticsDto: LifecycleAnalyticsDto) {
    return this.lifecycleAnalyticsService.createNewClient(
      lifecycleAnalyticsDto
    );
  }

  /**
   * @param lifecycleAnalyticsDto : contains lifecycleAnalytics object
   */
  @Post('medium')
  @UseGuards(AuthGuard)
  createLifecycleByMedium(
    @Body() lifecycleAnalyticsDto: LifecycleAnalyticsDto
  ) {
    return this.lifecycleAnalyticsService.createLifecycleByMedium(
      lifecycleAnalyticsDto
    );
  }

  /**
   * @param lifecycleAnalyticsDto : contains lifecycleAnalytics object
   */
  @Post('medium/client')
  createLifecycleByMediumClient(
    @Body() lifecycleAnalyticsDto: LifecycleAnalyticsDto
  ) {
    return this.lifecycleAnalyticsService.createLifecycleByMediumClient(
      lifecycleAnalyticsDto
    );
  }
}
