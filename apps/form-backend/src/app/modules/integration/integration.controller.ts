import { Controller, Get, Put, Post, Param, Req, Res } from '@nestjs/common';
import * as request from 'request-promise';
import { Ams360Service } from '../ams360/ams360.service';
import { Request, Response } from 'express';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly ams360Service: Ams360Service) {}

  /**
   * USDOT Integration
   */
  @Get('/us-dot/:usDotId')
  getDataByUSDOT() {
    // here need to add call once USDOT inetgration finished
  }

  /**
   * USDOT Integration
   */
  @Get('us-dot/:usDotId/:formId')
  getDataByUSDOTV2() {
    // here need to add call once USDOT inetgration finished
  }

  /**
   * EZLYNX Integration
   */
  @Put('ezlynx/contact/:clientId/:type')
  createContact() {
    // await ezlynxController.createContact(req, res, next);
  }

  @Put('ezlynx/upsert-personal-and-rater-applicant/:clientId/:type')
  createPersonalApplicant() {
    // ezlynxController.createPersonalApplicant,
    // ezlynxController.createContact
  }

  @Post('ezlynx/default')
  addDefaults() {
    // await ezlynxController.addDefaults(req, res, next);
  }

  /**
   * Hawksoft Integration
   */
  @Post('hawksoft/default')
  addDefaultsHawksoft() {
    // await hawksoftController.addDefaults(req, res, next);
  }

  @Post('klaviyo-track')
  async klaviyoTrack(@Req() req: Request, @Res() res: Response) {
    const options = {
      url: `https://a.klaviyo.com/api/track?data=${req.body.data}`,
    };

    await request(options, (err, result) => {
      if (err) {
        return res.status(400).json({
          title: 'Error requesting klaviyo',
          errorType: 2,
          data: 'klaviyo',
          error: 'Please try again',
        });
      }
      return res.status(200).json({
        title: 'Succes',
        data: result,
      });
    });
  }

  /**
   * Turborater
   */
  @Put('turborater/contact/:clientId/:type')
  createTurboraterContact() {
    // await turboraterController.createContact(req, res, next);
  }

  /**
   * Quoterush
   */
  @Put('/quote-rush/contact/:clientId')
  createQuoteRushContact() {
    //   await quoteRushController.createContact(req, res, next);
  }

  /**
   * Cabrillo
   */
  @Put('/cabrillo/contact/:clientId/:type')
  createCabrilloContact() {
    //   await cabrilloController.createContact(req, res, next);
  }

  /**
   * Nowcerts
   */
  @Put('/nowCerts/contact/:clientId')
  createNowcertsContact() {
    //   await nowCertsController.createContact(req, res, next);
  }

  /**
   * Appulate
   */
  @Put('/appulate/contact')
  createappulateContact() {
    //  await appulateController.createContact(req, res, next);
  }

  /**
   * Ams360 integration
   */
  @Put('ams360/:clientId')
  // createAms360Contact(@Param('clientId') clientId: number) {
  createAms360Contact(@Req() req: Request, @Res() res: Response) {
    return this.ams360Service.createContact(req, res);
  }

  /**
   * Commercial Ezlynx Integration
   */
  @Put('commercial-ezlynx/contact/:clientId/:type')
  createCommericalContact() {
    //   await commercialEzlynxController.createContact(req, res, next);
  }
}
