import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as request from 'request-promise';
import { emailRegEx } from '../../helpers/email.helper';
@Injectable()
export class NotificationsService {
  constructor() {}
  async sendNotification(body: any) {
    try {
      if (!emailRegEx.test(body.recipient)) {
        return {
          status: false,
          error: 'Error sending email. Email is not valid',
        };
      }
      const created = await this.createCourierProfileIfNotExists(body);

      if (!created.status) {
        return {
          status: false,
          error: 'Error sending notification. Couldnt create profile',
        };
      }

      const url = 'https://api.trycourier.app/send';
      const options = {
        method: 'POST',
        url,
        body,
        json: true,
        headers: {
          Authorization: `Bearer ${process.env.COURIERTOKEN}`,
        },
      };

      const response = await request(options);

      return { status: true, response: response };
    } catch (err) {
      return { status: false, error: err };
    }
  }
  async createCourierProfileIfNotExists(body: any) {
    try {
      const path = 'https://api.trycourier.app/profiles/';
      let options: any = {
        method: 'GET',
        url: path + body.recipient,
        json: true,

        headers: {
          Authorization: `Bearer ${process.env.COURIERTOKEN}`,
        },
      };
      // check if exists
      let response = await request(options);
      if (Object.keys(response.profile).length) {
        return {
          status: true,
          exists: true,
          ...response,
        };
      } else {
        body['profile'] = {};
        body.profile['email'] = body.recipient;
        options = {
          method: 'POST',
          url: path + body.recipient,
          body: {
            profile: body.profile,
          },
          json: true,
          headers: {
            Authorization: `Bearer ${process.env.COURIERTOKEN}`,
          },
        };

        response = await request(options);

        return {
          status: true,
          exists: false,
          ...response.response,
        };
      }
    } catch (err) {
      return { status: false, error: err };
    }
  }
  async updateCourierProfile(body: any) {
    const path = 'https://api.trycourier.app/profiles/';
    const patch = [];
    if (body.profile.email) {
      const update = {
        op: 'replace',
        path: '/email',
        value: body.profile.email,
      };
      patch.push(update);
    }
    if (body.profile.email) {
      const update = {
        op: 'replace',
        path: '/phone_number',
        value: body.profile.phone,
      };
      patch.push(update);
    }
    try {
      let options = {
        method: 'PATCH',
        url: path + body.recipient,
        json: true,
        body: {
          patch: patch,
        },
        headers: {
          Authorization: `Bearer ${process.env.COURIERTOKEN}`,
        },
      };
      // update or create recipient
      const response = await request(options);

      return {
        ...response,
      };
    } catch (err) {
      throw err;
    }
  }
  async handleSendNotification(notificationBody: any) {
    try {
      if (!notificationBody.recipient) {
        throw new HttpException(
          `Recipientid  is required. Missing field 'recipient'`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (!notificationBody.profile) {
        throw new HttpException(
          `Profile  is required. Missing field 'profile'`,
          HttpStatus.BAD_REQUEST
        );
      }

      const response = await this.sendNotification(notificationBody);

      if (!response.status) {
        throw new HttpException(
          'Error sending notification',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        message:
          'Successfully sent notification to ' + notificationBody.recipient,
        ...response.response,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async handlecreateCourierProfileIfNotExists(notificationBody: any) {
    try {
      if (!notificationBody.recipient) {
        throw new HttpException(
          `Recipientid  is required. Missing field 'recipient`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (!notificationBody.profile) {
        throw new HttpException(
          `Profile  is required. Missing field 'profile'`,
          HttpStatus.BAD_REQUEST
        );
      }
      const response = await this.createCourierProfileIfNotExists(
        notificationBody
      );

      return {
        message: !response.exists
          ? 'Created a profile in courier'
          : 'Profile in courier exists',
        ...response,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  async handleUpdateCourierProfile(notificationBody: any) {
    try {
      if (!notificationBody.recipient) {
        throw new HttpException(
          `Recipientid  is required. Missing field 'recipient`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (!notificationBody.profile) {
        throw new HttpException(
          `Profile  is required. Missing field 'profile'`,
          HttpStatus.BAD_REQUEST
        );
      }
      const response = await this.updateCourierProfile(notificationBody);

      return {
        message: 'Updated a profile in courier',
        ...response,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
