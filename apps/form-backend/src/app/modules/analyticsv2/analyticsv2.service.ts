import {
  Injectable,
  Scope,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Not,
  MoreThan,
  IsNull,
  MoreThanOrEqual,
  Between,
  LessThan
} from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as url from 'url';
import * as request from 'request-promise';
import { Companies } from '../company/company.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { FormAnalytics } from './FormAnalytics.entity';
import { Agents } from '../agent/agent.entity';
import { Clients } from '../client/client.entity';
import { Users } from '../user/user.entity';
import { UAParser } from 'ua-parser-js';
import { mediums, searchDomain, ipGeoAPI } from '../../constants/appconstant';
import { LifecycleAnalytics } from '../lifecycle-analytics/LifecycleAnalytics.entity';

@Injectable({ scope: Scope.REQUEST })
export class Analyticsv2Service {
  constructor(
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Lifecycles)
    private lifecyclesRepository: Repository<Lifecycles>,
    @InjectRepository(LifecycleAnalytics)
    private lifecycleAnalyticsRepository: Repository<LifecycleAnalytics>,
    @InjectRepository(FormAnalytics)
    private formAnalyticsRepository: Repository<FormAnalytics>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Agents) private agentRepository: Repository<Agents>,
    @Inject(REQUEST) private request: Request
  ) {}

  async getAnalyticsPrefrence() {
    try {
      const decoded = this.request.body.decodedUser;
      const analyticsPrefrence = await this.companyRepository.findOne({
        id: decoded.user.companyUserId,
      });
      if (!analyticsPrefrence) {
        throw new HttpException(
          'There was an error retrieving lifecycles analyticsPrefrence',
          HttpStatus.BAD_REQUEST
        );
      }
      return analyticsPrefrence;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCompanyLifeCycleName() {
    try {
      const decoded = this.request.body.decodedUser;
      const lifecycleName = await this.lifecyclesRepository.find({
        where: { companyLifecycleId: decoded.user.companyUserId },
        order: { sequenceNumber: 'ASC' }
      });

      return lifecycleName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async clientChart() {
    try {
      const decoded = this.request.body.decodedUser;
      const payload = await this.getPeriodQuery(this.request.params.period);
      const query = {
        companyClientId: decoded.user.companyUserId,
        createdAt: MoreThan(payload.date),
        [this.request.params.attribute]: Not(IsNull())
      };
      let clients;
      if (this.request.params.attribute === 'birthDate') {
        const p = await (await this.getAgeRange()).map(async (item) => {
          query['birthDate'] =
            item.range === '51+'
              ? LessThan(item.startDate)
              : Between(item.endDate, item.startDate);

          const data = await this.clientRepository
            .createQueryBuilder('client')
            .where(query)
            .select(`COUNT(client.${this.request.params.attribute}) AS count`)
            .getRawMany();
          return { range: item.range, count: data[0] ? data[0].count : 0 };
        });
        clients = await Promise.all(p);
      } else {
        let queryBuilder = await this.clientRepository
          .createQueryBuilder('client')
          .where(query)
          .select([
            `COUNT(client.id) AS count, client.${this.request.params.attribute}`
          ])
          .groupBy(`client.${this.request.params.attribute}`);
        if (this.request.params.chartType !== 'PieChart') {
          queryBuilder = await queryBuilder
            .addSelect(
              `date_trunc('${payload.period}', client.createdAt) As "period"`
            )
            .addGroupBy('period');
        }
        clients = await queryBuilder.getRawMany();
      }
      return clients;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getClientLifecycleAnalytics() {
    try {
      const decoded = this.request.body.decodedUser;
      let companyId = null;
      let userDetails = null;
      let settings = {
        hideOnEmail: false,
        hideOnPhone: false,
        hideOnFirstName: false,
        hideOnLastName: false,
        hideOnFullAddress: false,
        hideOnBusinessName: false
      };
      if (decoded.user) {
        companyId = decoded.user.companyUserId;
        const userId = decoded && decoded.user && decoded.user.id;
        userDetails = await this.userRepository.findOne({
          where: { id: userId }
        });
      } else if (decoded.agent) {
        companyId = decoded.agent.companyAgentId;
        const userId = decoded && decoded.agent && decoded.agent.id;
        userDetails = await this.agentRepository.findOne({
          where: { id: userId }
        });
      } else if (decoded.client) {
        companyId = decoded.client.companyClientId;
      }
      if (userDetails && userDetails.settings) {
        settings = userDetails.settings;
      }
      const today = new Date();
      const dateRange = this.request.query.dateRange
        ? this.request.query.dateRange
        : '30';
      const daysAgoDate = new Date().setDate(
        today.getDate() - (dateRange !== 'allTime' ? +dateRange + 1 : 0)
      );
      const whereClause = {
        companyClientId: companyId
      };
      const businessWhereClause = {};
      if (this.request.query.dateRange !== 'allTime') {
        whereClause['createdAt'] = Between(
          new Date(daysAgoDate),
          new Date(today)
        );

        if (settings && settings.hideOnEmail) {
          whereClause['email'] = Not(IsNull());
        }
        if (settings && settings.hideOnFirstName) {
          whereClause['firstName'] = Not(IsNull());
        }
        if (settings && settings.hideOnLastName) {
          whereClause['lastName'] = Not(IsNull());
        }
        if (settings && settings.hideOnPhone) {
          whereClause['phone'] = Not(IsNull());
        }
        if (settings && settings.hideOnFullAddress) {
          whereClause['fullAddress'] = Not(IsNull());
        }
      }
      let dataPoint = null;

      if (
        this.request.query.lifecycle !== 'total' &&
        this.request.query.lifecycle !== 'today'
      ) {
        whereClause['clientLifecycleId'] = this.request.query.lifecycle;
      } else if (this.request.query.lifecycle === 'today') {
        const beginDay = moment().startOf('day');
        whereClause['createdAt'] = MoreThanOrEqual(beginDay);
      }

      const findQuerry = {
        where: whereClause,
        join: {
          alias: 'client',
          leftJoinAndSelect: {
            business: 'client.businesses'
          }
        }
      };
      if (settings && settings.hideOnBusinessName) {
        businessWhereClause['entityName'] = Not(IsNull());
      }
      if (
        settings &&
        !settings.hideOnEmail &&
        !settings.hideOnPhone &&
        !settings.hideOnFirstName &&
        !settings.hideOnLastName &&
        !settings.hideOnFullAddress &&
        !settings.hideOnBusinessName
      ) {
        delete findQuerry.join;
      }
      dataPoint = await this.clientRepository.count(findQuerry);
      return dataPoint;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getClientChartHeaders(attribute: string) {
    try {
      const column = attribute;
      const clientHeaders = await this.clientRepository
        .createQueryBuilder('Clients')
        .where({ [column]: Not(IsNull()) })
        .select(`Clients.${column} as ${column}`)
        .groupBy(`Clients.${column}`)
        .getRawMany();
      const response = [];
      if (clientHeaders.length > 0) {
        await clientHeaders.map((one) => response.push(Object.values(one)[0]));
      }
      return clientHeaders.length > 0 ? response : clientHeaders;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async formAnalyticChart(id) {
    try {
      const thisMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
      const decoded = this.request.body.decodedUser;
      let visitedAnalyticsQuery = await this.formAnalyticsRepository
        .createQueryBuilder('FormAnalytics')
        .where({
          formAnalyticCompanyId: decoded.user.companyUserId,
          event: 'Visited XILO',
          createdAt: MoreThan(thisMonth)
        })
        .select([
          'FormAnalytics.event, COUNT(FormAnalytics.event) AS count',
        ])
        .groupBy('FormAnalytics.event')
        .orderBy({ 'FormAnalytics.event': 'ASC' })

      if (isNaN(id)) {
        visitedAnalyticsQuery = await visitedAnalyticsQuery.innerJoinAndSelect('FormAnalytics.form', 'forms')
        .addGroupBy('forms.id')
      } else {
        visitedAnalyticsQuery = await visitedAnalyticsQuery.innerJoinAndSelect('FormAnalytics.form', 'forms', 'forms.id = :id', { id: id })
        .addGroupBy('forms.id')
      }
      const visitedAnalytics = await visitedAnalyticsQuery.getRawMany()

      let formAnalyticQuery = await this.formAnalyticsRepository
        .createQueryBuilder('FormAnalytics')
        .where({
          formAnalyticCompanyId: 1,
          event: ['Started Form', 'New Lead', 'Finished Form'],
          formAnalyticClientId: Not(IsNull()),
          createdAt: MoreThan(thisMonth)
        })
        .select('FormAnalytics.event, COUNT(FormAnalytics.event) AS count')
        .groupBy('FormAnalytics.event')
        .orderBy({ 'FormAnalytics.event': 'ASC' })
      if (isNaN(id)) {
        formAnalyticQuery = await formAnalyticQuery.innerJoinAndSelect('FormAnalytics.form', 'forms')
                              .addGroupBy('forms.id')
      } else {
        formAnalyticQuery = await formAnalyticQuery.innerJoinAndSelect('FormAnalytics.form', 'forms', 'forms.id = :id', { id: id })
                              .addGroupBy('forms.id')
      }
      
      const formAnalytic = await formAnalyticQuery.getRawMany()

      if (formAnalytic) {
        formAnalytic.push(...visitedAnalytics);
      }

      return formAnalytic.reverse();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async formAnalyticChartHeader() {
    try {
      const decoded = this.request.body.decodedUser;
      const lifecycleName = await this.formAnalyticsRepository
        .createQueryBuilder('FormAnalytics')
        .where({ 
            formAnalyticCompanyId: decoded.user.companyUserId,
            formAnalyticClientId: Not(IsNull())
          })
        .leftJoinAndSelect('FormAnalytics.form', 'form')
        .select(['form.id as id', 'form.title as title'])
        .groupBy('form.id')
        .addGroupBy('form.title')
        .getRawMany();
      return lifecycleName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async recordFormAnalytics(req, res) {
    try {
      let formAnalyticClientId = null;
      if (req.body.decodedUser) {
        formAnalyticClientId = req.body.decodedUser.client.id;
      }
      let medium;
      let referrer: any = {};
      const ip = req.ip;
      const formAnalyticsUID = await this.isFormAnalytics(
        req.body.formAnalyticsUID,
        req.body.eventName,
        req.body.formId
      );
      let response;
      if (!formAnalyticsUID) {
        const decoded = jwt.decode(req.query.token);
        const pageurl = url.parse(req.body.page_url, true);
        if (!req.body.referrer) {
          medium = medium.INTERNAL;
        } else {
          referrer = url.parse(req.body.referrer, true);
          medium = this.referrerMedium(referrer);
        }
        const ua: any = new UAParser(req.headers['user-agent']);
        let ipGeo;
        try {
          ipGeo = JSON.parse(await request(`${ipGeoAPI}&ip=${ip}`));
        } catch (error) {
          ipGeo = {};
        }
        const body = {
          pageUrl: pageurl.href,
          ipAddress: ipGeo.ip || null,
          geoCity: ipGeo.city || null,
          geoState: ipGeo.state_prov || null,
          geoCountry: ipGeo.country_name || null,
          geoCode: ipGeo.geoname_id || null,
          geoZipCode: ipGeo.zipcode || null,
          geoLatitude: ipGeo.latitude || null,
          geoLongitute: ipGeo.longitude || null,
          uaBrowserName: ua.browser.name,
          uaBrowserVersion: ua.browser.version,
          uaDeviceModel: Object.prototype.hasOwnProperty.call(
            ua.device,
            'model'
          )
            ? ua.device.model
            : null,
          uaDeviceType: Object.prototype.hasOwnProperty.call(ua.device, 'type')
            ? ua.device.type
            : null,
          uaDeviceVersion: Object.prototype.hasOwnProperty.call(
            ua.device,
            'vendor'
          )
            ? ua.device.vendor
            : null,
          uaEngineName: Object.prototype.hasOwnProperty.call(ua.engine, 'name')
            ? ua.engine.name
            : null,
          uaEngineVersion: Object.prototype.hasOwnProperty.call(
            ua.engine,
            'version'
          )
            ? ua.engine.version
            : null,
          uaOSName: Object.prototype.hasOwnProperty.call(ua.os, 'name')
            ? ua.os.name
            : null,
          uaOSVersion: Object.prototype.hasOwnProperty.call(ua.os, 'version')
            ? ua.os.version
            : null,
          uaCPUArchitecture: Object.prototype.hasOwnProperty.call(
            ua.cpu,
            'architecture'
          )
            ? ua.cpu.architecture
            : null,
          domain: pageurl.host,
          path: pageurl.pathname,
          queryString: JSON.stringify(pageurl.query),
          anchor: pageurl.hash,
          referrerUrl: Object.prototype.hasOwnProperty.call(referrer, 'href')
            ? referrer['href']
            : null,
          referrerDomain: Object.prototype.hasOwnProperty.call(referrer, 'host')
            ? referrer['host']
            : null,
          referrerPath: Object.prototype.hasOwnProperty.call(
            referrer,
            'pathname'
          )
            ? referrer['pathname']
            : null,
          referrerQueryString: Object.prototype.hasOwnProperty.call(
            referrer,
            'query'
          )
            ? JSON.stringify(referrer.query)
            : null,
          referrerAnchor: Object.prototype.hasOwnProperty.call(referrer, 'hash')
            ? referrer['hash']
            : null,
          referrerMedium: medium,
          userAgent: req.headers['user-agent'],
          event: req.body.eventName,
          formAnalyticFormId: req.body.formId,
          formAnalyticCompanyId: req.body.companyId,
          formAnalyticsUID: req.body.formAnalyticsUID,
          formAnalyticClientId
        };
        const formAnalytic = await this.formAnalyticsRepository.create(body);
        response = {
          success: true,
          formAnalyticsUID: formAnalytic.formAnalyticsUid
        };
      } else {
        response = {
          success: false,
          message: 'This form  has already formAnalytic for this event'
        };
      }
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async lifeCycleAnalyticChart(req, res) {
    try {
      const payload = await this.getPeriodQuery(req.params.period);
      const decoded = req.body.decodedUser;
      const whereClause = {
        companyLifecycleAnalyticId: decoded.user.companyUserId,
        createdAt: MoreThanOrEqual(payload.date),
        lifecycleLifecycleAnalyticId: Not(IsNull())
      };

      if (req.params.attribute === 'agent') {
        whereClause['agentLifecycleAnalyticId'] = Not(IsNull());
      }

      let query = {};
      if (req.params.attribute === 'company') {
        query = {
          where: whereClause,
          join: {
            alias: 'lifecycleAnalytics',
            leftJoinAndSelect: {
              lifecycles: 'lifecycleAnalytics.lifecycleAnalyticLifecycle'
            }
          },
          group: 'lifecycles.id'
        };
      } else if (req.params.attribute === 'agent') {
        whereClause.createdAt = Between(
          req.params.startDate,
          req.params.endDate
        );
        query = {
          where: whereClause,
          join: {
            alias: 'lifecycleAnalytics',
            leftJoinAndSelect: {
              lifecycle: 'lifecycleAnalytics.lifecycleAnalyticLifecycle',
              agent: 'lifecycleAnalytics.agentLifecycleAnalytic'
            }
          },
          group: [
            'agent.id',
            'lifecycleAnalytics.lifecycleLifecycleAnalyticId',
            'lifecycles.id'
          ]
        };
      }

      const lifeCycleAnalytic = await this.lifecycleAnalyticsRepository.find(
        query
      );
      res.status(200).json(lifeCycleAnalytic);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async referrerMedium(referrer) {
    let medium;
    if (referrer.protocol == 'mailto') {
      medium = mediums.EMAIL;
    } else {
      let domain = referrer.hostname;
      if (domain.indexOf('www.') > -1) {
        domain = domain.split('www.')[1];
        domain = domain.split('.')[0];
      } else {
        domain = domain.split('.')[0];
      }
      const searchDomains = searchDomain;
      if (searchDomains.includes(domain)) {
        medium = mediums.SEARCH;
      } else if (domain == 'xilo' || domain == 'localhost') {
        medium = mediums.INTERNAL;
      } else {
        medium = mediums.UNKNOWN;
      }
    }
    return medium;
  }

  async isFormAnalytics(formAnalyticsUID, event, formAnalyticFormId) {
    try {
      const formData = await this.formAnalyticsRepository.findOne({
        where: {
          event: event,
          formAnalyticsUid: formAnalyticsUID,
          formAnalyticFormId: formAnalyticFormId
        }
      });
      if (formData) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error('Error in creating formAnalytic');
    }
  }

  async getCompanyClientLanLong(req, res) {
    try {
      const token = req.headers['x-access-token'];
      const decoded: any = jwt.decode(token);
      const payload = await this.getPeriodQuery(req.params.period);
      const query = {
        companyLifecycleAnalyticId: decoded.user.companyUserId,
        clientLifecycleAnalyticId: Not(IsNull()),
        createdAt: MoreThanOrEqual(payload.date)
      };

      if (!isNaN(req.params.lifecycleId)) {
        query['lifecycleLifecycleAnalyticId'] = req.params.lifecycleId;
      }
      const lifeCycleAnalytic = await this.lifecycleAnalyticsRepository.find({
        join: {
          alias: 'lifecycleAnalytics',
          leftJoinAndSelect: {
            client: 'lifecycleAnalytics.clientLifecycleAnalytic'
          }
        },
        where: (qb) => {
          qb.where(query)
            .andWhere('client.latitude Is NOT Null')
            .andWhere('client.longitude Is NOT Null');
        }
      });
      return res.status(200).json(lifeCycleAnalytic);
    } catch (error) {
      throw new Error('Something went wrong please try again');
    }
  }

  async getPeriodQuery(opt) {
    const d = new Date();
    const cy = d.getFullYear();
    const cm = d.getMonth();
    const timezone = d.getTimezoneOffset();
    switch (opt) {
      case 'days':
        return {
          date: moment(Date.now())
            .subtract(6, 'days')
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .utcOffset(timezone),
          period: 'day'
        };
      case 'weeks':
        return {
          date: moment(Date.now())
            .subtract(21, 'days')
            .isoWeekday(1)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .utcOffset(timezone)
            .toDate(),
          period: 'week'
        };
      case 'months':
        return {
          date: moment(cy + '-' + ('0' + (cm + 1)).slice(-2))
            .subtract(3, 'month')
            .utcOffset(timezone)
            .toDate(),
          period: 'month'
        };
      case 'years':
        return {
          date: moment(cy + '-01')
            .subtract(3, 'year')
            .utcOffset(timezone)
            .toDate(),
          period: 'year'
        };
      default:
        return {};
    }
  }

  async getAgeRange() {
    const range = [];
    range.push({
      range: '0-20',
      startDate: moment(Date.now()).toDate(),
      endDate: moment(Date.now()).subtract(20, 'year').toDate()
    });
    range.push({
      range: '21-30',
      startDate: moment(Date.now())
        .subtract(20, 'year')
        .subtract(1, 'second')
        .toDate(),
      endDate: moment(Date.now()).subtract(30, 'year').toDate()
    });
    range.push({
      range: '31-40',
      startDate: moment(Date.now())
        .subtract(30, 'year')
        .subtract(1, 'second')
        .toDate(),
      endDate: moment(Date.now()).subtract(40, 'year').toDate()
    });
    range.push({
      range: '41-50',
      startDate: moment(Date.now())
        .subtract(40, 'year')
        .subtract(1, 'second')
        .toDate(),
      endDate: moment(Date.now()).subtract(50, 'year').toDate()
    });
    range.push({
      range: '51+',
      startDate: moment(Date.now())
        .subtract(50, 'year')
        .subtract(1, 'second')
        .toDate()
    });
    return range;
  }
}
