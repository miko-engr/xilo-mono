import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { Companies } from '../company/company.entity';
import { AdwordsUser, AdwordsConstants } from 'node-adwords';
import { google } from 'googleapis';
import { GOOGLE } from'../../constants/appconstant';

const developerToken = GOOGLE.GOOGLE_DEV_TOKEN;
const clientId = GOOGLE.CLIENT_ID;
const clientSecret = GOOGLE.CLIENT_SECRET;
const redirectURI = GOOGLE.REDIRECT_URL;

const scopes = [
  'https://www.googleapis.com/auth/adwords',
  'https://www.googleapis.com/auth/analytics',
  'https://www.googleapis.com/auth/gmail.readonly',
];

const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectURI);

@Injectable({ scope: Scope.REQUEST })
export class GoogleService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>
  ) {}
  async getGoogleAuthUrl() {
    try {
      const url = await oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
        state: encodeURIComponent(`token=${this.request.query.token}`)
      });
      return { url };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async handleAuthGrant(code: string) {
    try {
      const response = await oAuth2Client.getToken(code);
      if (!response) {
        throw new HttpException(
          'There was an error connecting with your adwords account',
          HttpStatus.BAD_REQUEST
        );
      }
      const decoded = this.request.body.decodedUser;
      const payload = {
        googleApiRefreshToken: response.tokens.refresh_token,
        googleApiAccessToken: response.tokens.access_token,
      };
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const updatedCompany = await this.companiesRepository.save({
        ...company,
        ...payload,
      });
      if (!updatedCompany) {
        throw new HttpException(
          'There was an error updating company',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Company updated successfully',
        obj: updatedCompany,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async refreshGoogleApiTokens() {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const getTokenInfo = await oAuth2Client.getTokenInfo(
        company.googleApiAccessToken
      );
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });
      const refreshData = await oAuth2Client.refreshAccessToken();
      if (!refreshData) {
        throw new HttpException(
          'There was an error while refreshing token',
          HttpStatus.BAD_REQUEST
        );
      }
      const tokens = refreshData.credentials;
      const payload = {
        googleApiRefreshToken: tokens.refresh_token,
        googleApiAccessToken: tokens.access_token,
      };
      const updatedCompany = await this.companiesRepository.save({
        ...company,
        ...payload,
      });
      if (!updatedCompany) {
        throw new HttpException(
          'There was an error while updating tokens in company',
          HttpStatus.BAD_REQUEST
        );
      }
      return updatedCompany;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getCampaigns() {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      const user = new AdwordsUser({
        developerToken,
        clientCustomerId: company.googleAdwordsCustomerId, // this is just for demonstraction, ideally it should coming from company
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: company.googleApiRefreshToken,
      });
      const campaignService = user.getService('CampaignService', 'v201806');

      const selector = {
        fields: ['Id', 'Name'],
        ordering: [{ field: 'Name', sortOrder: 'ASCENDING' }],
        paging: {
          startIndex: 0,
          numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE,
        },
      };
      const campaingsData = await campaignService.get({
        serviceSelector: selector,
      });
      if (!campaingsData) {
        throw new HttpException(
          'There was an error fetching campaigns',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Campaigns fetched successfully',
        obj: campaingsData.result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAnalyticsReport() {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });
      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = [
        'ga:campaign',
        'ga:date',
        'ga:source',
        'ga:medium',
        'ga:adContent',
        'ga:keyword',
        'ga:userType',
        'ga:latitude',
        'ga:longitude',
      ];

      const metrics = [
        'ga:sessions',
        'ga:pageviews',
        'ga:bounces',
        'ga:sessionDuration',
        'ga:sessionsPerUser',
        'ga:transactions',
        'ga:transactionRevenue',
        'ga:newUsers',
        'ga:sessions',
        'ga:pageviews',
      ];
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': '7daysAgo',
        'end-date': 'today',
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching analytics report',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Reports fetched successfully',
        obj: responseData.data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAnalyticsReportHeatmap() {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
        relations: ['landingPages'],
      });
      if (!company) {
        throw new HttpException('No company found', HttpStatus.BAD_REQUEST);
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:pagePath', 'ga:latitude', 'ga:longitude'];

      const metrics = ['ga:sessions'];

      const filters = [];

      //   company.landingPages.forEach((lp) => { TODO landingPages don't have
      //     filters.push(`ga:pagePath==${lp.url}`);
      //   });
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': this.request.body.startDate,
        'end-date': this.request.body.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
        filters: filters.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching analytics report',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Reports fetched successfully',
        obj: responseData.data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAnalyticsByMedium(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
        relations: ['mediums'],
      });
      if (!company) {
        throw new HttpException(
          'No company found with that Id',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:medium'];

      const metrics = ['ga:sessions', 'ga:totalEvents'];
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching google sessions',
          HttpStatus.BAD_REQUEST
        );
      }
      const mediums = [];
      const mediumResults = responseData.data.rows;
      mediumResults.forEach((med, i) => {
        const medObj = {
          name: med[0],
          totalSessions: med[1],
          totalEvents: med[2],
          totalNewLeads: 0,
          totalSold: 0,
        };
        // company.mediums.forEach((medium, j) => { TODO mediums don't have
        //   if (medium.name === medObj.name) {
        //     medObj.id = medium.id;
        //     mediums.push(medObj);
        //   }
        // });
        if (!mediumResults[i + 1]) {
          return {
            title: 'Mediums retrieved successfully',
            obj: mediums,
          };
        } else {
          throw new HttpException(
            'There was an error fetching google sessions',
            HttpStatus.BAD_REQUEST
          );
        }
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getSessionsByLpAndMedium() {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException(
          'No company found with that Id',
          HttpStatus.BAD_REQUEST
        );
      }
      //   TODO nothing landingpage
      //   model.Company.findOne({
      //     where: { id: decoded.user.companyUserId },
      //   })
      //     .then((company) => {
      //       if (!company) {
      //         return res.status(401).json({
      //           message: 'No company found with that Id',
      //         });
      //       }
      //       return model.LandingPage.findAll({
      //         where: {
      //           [Op.and]: [{ companyLandingPageId: company.id }],
      //         },
      //         include: [
      //           {
      //             as: 'medium',
      //             model: model.Medium,
      //           },
      //         ],
      //       })
      //         .then((landingPages) => {
      //           if (!landingPages) {
      //             return res.status(401).json({
      //               message: 'No company found with that Id',
      //             });
      //           }
      //           oAuth2Client.setCredentials({
      //             access_token: company.googleApiAccessToken,
      //             refresh_token: company.googleApiRefreshToken,
      //           });

      //           const analytics = google.analytics({
      //             version: 'v3',
      //             auth: oAuth2Client,
      //           });

      //           const dimensions = ['ga:medium', 'ga:pagePath'];

      //           const metrics = ['ga:sessions'];

      //           const filters = [];

      //           landingPages.forEach((lp) => {
      //             if (lp.url === '/') {
      //               filters.push('ga:pagePath==/');
      //             } else {
      //               filters.push(`ga:pagePath=@${lp.url}`);
      //             }
      //           });

      //           return analytics.data.ga
      //             .get({
      //               ids: `ga:${company.googleAnalyticsViewId.toString()}`,
      //               'start-date': req.query.startDate,
      //               'end-date': req.query.endDate,
      //               dimensions: dimensions.join(','),
      //               metrics: metrics.join(','),
      //               filters: filters.join(','),
      //             })
      //             .then((result) => {
      //               const lps = [];
      //               const lpResults = result.data.rows;
      //               lpResults.forEach((lpR, i) => {
      //                 const lpObj = { sessions: 0 };
      //                 lps.push(lpObj);
      //                 landingPages.forEach((lp, j) => {
      //                   const stringMatch = stringSimilarity.compareTwoStrings(
      //                     lp.url,
      //                     lpR[1]
      //                   );
      //                   if (stringMatch >= 0.9) {
      //                     lps[i].id = lp.id;
      //                     lps[i].medium = lpR[0];
      //                     lps[i].url = lp.url;
      //                     lps[i].sessions += +lpR[2];
      //                   }
      //                 });
      //                 if (!lpResults[i + 1]) {
      //                   res.status(200).json({
      //                     title: 'Landing Pages and Mediums fetched successfully',
      //                     obj: lps,
      //                   });
      //                 }
      //               });
      //             })
      //             .catch((error) =>
      //               res.status(400).json({
      //                 title: 'There was an error fetching google sessions',
      //                 errorType: 2,
      //                 data: 'analytics',
      //                 error: error.stack,
      //               })
      //             );
      //         })
      //         .catch((error3) =>
      //           res.status(400).json({
      //             title: 'There was an error fetching landing pages',
      //             errorType: 2,
      //             data: 'analytics',
      //             error: error3.stack,
      //           })
      //         );
      //     })
      //     .catch((error2) =>
      //       res.status(400).json({
      //         title: 'There was an error fetching google sessions',
      //         errorType: 2,
      //         data: 'analytics',
      //         error: error2.stack,
      //       })
      //     );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getEventsSessionsByMedium(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
        relations: ['landingPages'],
      });
      if (!company) {
        throw new HttpException(
          'No company found with that Id',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:medium'];

      const metrics = ['ga:sessions', 'ga:totalEvents'];

      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching google sessions',
          HttpStatus.BAD_REQUEST
        );
      }
      const mediumResults = responseData.data.rows;
      const mediums = [];
      mediumResults.forEach((med, i) => {
        const randomId = Math.floor(Math.random() * 10000 + 1);
        const medObj = {
          id: randomId,
          name: med[0],
          totalSessions: med[1],
          totalEvents: med[2],
          totalNewLeads: 0,
          totalSold: 0,
        };
        mediums.push(medObj);
        if (!mediumResults[i + 1]) {
          return {
            title: 'Mediums retrieved successfully',
            obj: mediums,
          };
        } else {
          throw new HttpException(
            'There was an error fetching google sessions',
            HttpStatus.BAD_REQUEST
          );
        }
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getSessionsByLPMedium(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
        relations: ['landingPages'],
      });
      if (!company) {
        throw new HttpException(
          'No company found with that Id',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:medium', 'ga:pagePath'];

      const metrics = ['ga:sessions'];

      const filters = [];

      //   company.landingPages.forEach((lp) => {
      //     filters.push(`ga:pagePath==${lp.url}`); TODO don't have landingPages
      //   });
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
        filters: filters.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching google sessions',
          HttpStatus.BAD_REQUEST
        );
      }
      const landingPageResults = responseData.data.rows;
      const landingPages = [];
      landingPageResults.forEach((med, i) => {
        const randomId = Math.floor(Math.random() * 10000 + 1);
        const landingPageObj = {
          id: randomId,
          medium: med[0],
          url: med[1],
          sessions: med[2],
        };
        landingPages.push(landingPageObj);
        if (!landingPageResults[i + 1]) {
          return {
            title: 'Landing Pages retrieved successfully',
            obj: landingPages,
          };
        } else {
          throw new HttpException(
            'There was an error fetching google sessions',
            HttpStatus.BAD_REQUEST
          );
        }
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getEventsByCTAMedium(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
        relations: ['landingPages'],
      });
      if (!company) {
        throw new HttpException(
          'No company found with that Id',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:medium', 'ga:pagePath', 'ga:eventCategory'];

      const metrics = ['ga:totalEvents'];

      const filters = [];

      //   company.landingPages.forEach((lp) => {
      //     filters.push(`ga:pagePath==${lp.url}`); TODO don't have landingPages
      //   });
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
        filters: filters.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching google events',
          HttpStatus.BAD_REQUEST
        );
      }
      const ctaResults = responseData.data.rows;
      const ctas = [];
      ctaResults.forEach((med, i) => {
        const randomId = Math.floor(Math.random() * 10000 + 1);
        const ctaObj = {
          id: randomId,
          medium: med[0],
          url: med[1],
          eventCategory: med[2],
          events: med[3],
        };
        ctas.push(ctaObj);
        if (!ctaResults[i + 1]) {
          return {
            title: 'CTAs retrieved successfully',
            obj: ctas,
          };
        } else {
          throw new HttpException(
            'There was an error fetching google events',
            HttpStatus.BAD_REQUEST
          );
        }
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getCTAs(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException(
          'No company found with that Id',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = [
        'ga:eventCategory',
        'ga:eventAction',
        'ga:eventLabel',
      ];

      const metrics = [
        'ga:totalEvents',
        'ga:uniqueEvents',
        'ga:eventValue',
        'ga:sessionsWithEvent',
      ];
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
      });

      if (!responseData) {
        throw new HttpException(
          'There was an error fetching google events',
          HttpStatus.BAD_REQUEST
        );
      }
      const returnObj = {
        totalsForAllEvents: responseData.data.totalsForAllResults,
        events: responseData.data.rows,
      };
      return {
        title: 'Google events fetched successfully',
        obj: returnObj,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getLandingPages(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
      });
      if (!company) {
        throw new HttpException(
          'No company found with that Id',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:pagePath'];

      const metrics = ['ga:sessions'];
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching landing page sessions',
          HttpStatus.BAD_REQUEST
        );
      }
      const returnObj = {
        totalSessions: responseData.data.totalsForAllResults['ga:sessions'],
        sessionsByUrl: responseData.data.rows,
      };
      return {
        title: 'Sessions fetched successfully',
        obj: returnObj,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getSessionsByPath(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
        relations: ['landingPages'],
      });
      if (!company) {
        //   !company || !company.landingPages
        throw new HttpException(
          'No company or landing pages associated found',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:pagePath'];

      const metrics = ['ga:sessions'];

      const filters = [];

      //   company.landingPages.forEach((lp) => { TODO don't have landingPages
      //     if (lp.url === '/') {
      //       filters.push('ga:pagePath==/');
      //     } else {
      //       filters.push(`ga:pagePath=@${lp.url}`);
      //     }
      //   });
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
        filters: filters.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching landing page sessions',
          HttpStatus.BAD_REQUEST
        );
      }
      const returnObj = {
        totalSessions: responseData.data.totalsForAllResults['ga:sessions'],
        sessionsByUrl: responseData.data.rows,
      };
      return {
        title: 'Sessions fetched successfully',
        obj: returnObj,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getCTAsByPaths(query: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const company = await this.companiesRepository.findOne({
        where: {
          id: decoded.user.companyUserId,
        },
        relations: ['landingPages'],
      });
      if (!company) {
        //   !company || !company.landingPages
        throw new HttpException(
          'No company or landing pages associated found',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:eventCategory', 'ga:pagePath'];

      const metrics = ['ga:totalEvents'];

      const filters = [];

      //   company.landingPages.forEach((lp) => { TODO don't have landingPages
      //     if (lp.url === '/') {
      //       filters.push('ga:pagePath==/');
      //     } else {
      //       filters.push(`ga:pagePath=@${lp.url}`);
      //     }
      //   });
      const responseData = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
        filters: filters.join(','),
      });
      if (!responseData) {
        throw new HttpException(
          'There was an error fetching cta events',
          HttpStatus.BAD_REQUEST
        );
      }
      const returnObj = {
        totalSessions: responseData.data.totalsForAllResults['ga:sessions'],
        sessionsByUrl: responseData.data.rows,
      };
      return {
        title: 'Sessions fetched successfully',
        obj: returnObj,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getLPsAndCTAsByPaths(
    year: string,
    month: string,
    day: string,
    query: any
  ) {
    try {
      const decoded = this.request.body.decodedUser;
      let whereClause = {};
      if (year && typeof month !== 'undefined' && typeof day !== 'undefined') {
        whereClause = {
          year: year,
          month: month,
          day: day,
        };
      } else if (typeof day === 'undefined' && month) {
        whereClause = {
          year: year,
          month: month,
        };
      } else if (typeof day === 'undefined' && typeof month === 'undefined') {
        whereClause = {
          year: year,
        };
      }
      const company = await this.companiesRepository
        .createQueryBuilder('company')
        .where({ id: decoded.user.companyUserId })
        .leftJoinAndSelect('company.landingPages', 'landingPages')
        .leftJoinAndSelect('landingPages.ctas', 'ctas')
        .leftJoinAndSelect(
          'ctas.newClientLifecycleAnalytics',
          'newClientLifecycleAnalytics'
        )
        .andWhere('newClientLifecycleAnalytics.year = :year', { year: year })
        .andWhere('newClientLifecycleAnalytics.month = :month', {
          month: month,
        })
        .andWhere('newClientLifecycleAnalytics.day = :day', { day: day })
        .leftJoinAndSelect(
          'newClientLifecycleAnalytics.lifecycle',
          'lifecycle',
          'lifecycle.isNewClient=:isNewClient',
          { isNewClient: true }
        )
        .leftJoinAndSelect(
          'ctas.soldLifecycleAnalytics',
          'soldLifecycleAnalytics'
        )
        .andWhere('soldLifecycleAnalytics.year = :year', { year: year })
        .andWhere('soldLifecycleAnalytics.month = :month', {
          month: month,
        })
        .andWhere('soldLifecycleAnalytics.day = :day', { day: day })
        .leftJoinAndSelect(
          'soldLifecycleAnalytics.lifecycle',
          'lifecycle',
          'lifecycle.isSold=:isSold',
          { isSold: true }
        )
        .getOne();
      if (!company) {
        // || !company.landingPages
        throw new HttpException(
          'No company or landing pages associated found',
          HttpStatus.BAD_REQUEST
        );
      }
      oAuth2Client.setCredentials({
        access_token: company.googleApiAccessToken,
        refresh_token: company.googleApiRefreshToken,
      });

      const analytics = google.analytics({
        version: 'v3',
        auth: oAuth2Client,
      });

      const dimensions = ['ga:pagePath'];

      const metrics = ['ga:sessions'];

      const filters = [];

      //   company.landingPages.forEach((lp) => { TODO don't have landingPages
      //     if (lp.url === '/') {
      //       filters.push('ga:pagePath==/');
      //     } else {
      //       filters.push(`ga:pagePath=@${lp.url}`);
      //     }
      //   });
      const responseData1 = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions.join(','),
        metrics: metrics.join(','),
        filters: filters.join(','),
      });
      if (!responseData1) {
        throw new HttpException(
          'There was an error fetching cta events',
          HttpStatus.BAD_REQUEST
        );
      }
      const dimensions2 = ['ga:eventCategory', 'ga:pagePath'];

      const metrics2 = ['ga:totalEvents'];

      //   company.landingPages.forEach((lp) => { TODO don't have landingPages
      //     for (let i = 0; i < responseData1.data.rows.length; i++) {
      //       if (lp.url === responseData1.data.rows[i][0]) {
      //         lp.totalSessions = responseData1.data.rows[i][1];
      //       }
      //     }
      //   });
      const responseData2 = await analytics.data.ga.get({
        ids: `ga:${company.googleAnalyticsViewId.toString()}`,
        'start-date': query.startDate,
        'end-date': query.endDate,
        dimensions: dimensions2.join(','),
        metrics: metrics2.join(','),
        filters: filters.join(','),
      });
      if (!responseData2) {
        throw new HttpException(
          'There was an error fetching cta events',
          HttpStatus.BAD_REQUEST
        );
      }
      //   company.landingPages.forEach((lp) => { TODO don't have landingPages
      //     lp.ctas.forEach((cta) => {
      //       for (let i = 0; i < responseData2.data.rows.length; i++) {
      //         if (cta.googleEventCategory === responseData2.data.rows[i][0]) {
      //           if (cta.totalEvents !== null) {
      //             cta.totalEvents += +responseData2.data.rows[i][2];
      //           } else {
      //             cta.totalEvents = +responseData2.data.rows[i][2];
      //           }
      //         }
      //       }
      //     });
      //   });
      return {
        title: 'Sessions fetched successfully',
        // obj: company.landingPages,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
