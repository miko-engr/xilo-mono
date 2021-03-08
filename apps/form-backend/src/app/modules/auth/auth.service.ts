import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Users } from '../user/user.entity';
import { Agents } from '../agent/agent.entity';
import { Companies } from '../company/company.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { CONFIG } from '../../constants/appconstant';
import { emailRegEx } from '../../helpers/email.helper';
import { NotificationsService } from '../notifications/notifications.service';
import {
  FormTemplateHelper
} from '../form/helper/form-template.helper';
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Agents) private agentRepository: Repository<Agents>,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Lifecycles)
    private lifecyclesRepository: Repository<Lifecycles>,
    @Inject(REQUEST) private request: Request,
    private readonly notificationsService: NotificationsService,
    private formTemplateHelper: FormTemplateHelper
  ) { }

  async resetUser(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          username: username,
        },
      });
      if (!user) {
        throw new HttpException(
          'No user found with that username',
          HttpStatus.BAD_REQUEST
        );
      }

      const token = await jwt.sign(
        {
          user: {
            id: user.id,
            username: user.username,
            companyUserId: user.companyUserId,
          },
        },
        'secret',
        { expiresIn: 7200 }
      );
      user.resetPasswordLink = token;
      await this.userRepository.save(user);
      const transporter = await nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'customer-success@xilo.io',
          pass: 'tothetop!123@',
        },
        tls: { rejectUnauthorized: false },
      });

      const html = `Your account has requested a password reset. If you did not send this please reach out to use about this email.
              If you did, click the link below to go to the reset password page. <br> <br> ${
        (CONFIG.nodeEnv === 'production'
          ? 'https://dashboard.xilo.io/auth/new-user-password?token='
          : CONFIG.nodeEnv === 'development'
            ? 'https://xilo-dev-dashboard.herokuapp.com/auth/new-user-password?token='
            : 'http://localhost:4100/auth/new-user-password?token=') +
        token
        }`;

      const mailOptions = {
        from: 'customer-success@xilo.io',
        to: user.username,
        subject: 'Password reset request for XILO',
        html,
      };

      const data = await transporter.sendMail(mailOptions);

      if (!data) {
        throw new HttpException(
          'Error sending email during new password request',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New password email sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Error resetting password',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async resetAgent(email: string) {
    try {
      const agent = await this.agentRepository.findOne({
        where: {
          email: email,
        },
      });

      if (!agent) {
        throw new HttpException(
          'No agent found with that email',
          HttpStatus.BAD_REQUEST
        );
      }

      const token = await jwt.sign(
        {
          agent: {
            id: agent.id,
            email: agent.email,
            companyAgentId: agent.companyAgentId,
          },
        },
        'secret',
        { expiresIn: 7200 }
      );

      agent.resetPasswordLink = token;
      await this.agentRepository.save(agent);

      const transporter = await nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'customer-success@xilo.io',
          pass: 'tothetop!123@',
        },
        tls: { rejectUnauthorized: false },
      });

      const html = `Your account has requested a password reset. If you did not send this please reach out to use about this email.
              If you did, click the link below to go to the reset password page. <br> <br> ${
        (CONFIG.nodeEnv === 'production'
          ? 'https://dashboard.xilo.io/auth/new-agent-password?token='
          : CONFIG.nodeEnv === 'development'
            ? 'https://xilo-dev-dashboard.herokuapp.com/auth/new-agent-password?token='
            : 'http://localhost:4100/auth/new-agent-password?token=') +
        token
        }`;

      const mailOptions = {
        from: 'customer-success@xilo.io',
        to: agent.email,
        subject: 'Password reset request from XILO',
        html,
      };

      const data = await transporter.sendMail(mailOptions);

      if (!data) {
        throw new HttpException(
          'Error sending email during new password request',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'New password email sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Error resetting password',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async signup(signupBody: any) {
    try {
      const isValidRecipientEmail = emailRegEx.test(
        String(signupBody.username).toLowerCase()
      );
      if (!isValidRecipientEmail) {
        throw new HttpException('Email not valid!', HttpStatus.BAD_REQUEST);
      }
      const randomNumber = Math.floor(Math.random() * 1000000).toString();
      const eUser = await this.userRepository.findOne({
        where: { username: signupBody.username },
      });
      if (eUser) {
        throw new HttpException(
          'Error signing up. User already exists',
          HttpStatus.BAD_REQUEST
        );
      }
      const company = await this.companyRepository.findOne({
        where: { companyId: randomNumber },
      });
      if (company) {
        throw new HttpException(
          'Error signing up. Random company Id duplicate. Try again',
          HttpStatus.BAD_REQUEST
        );
      }
      const analyticsConfig = {
        clientAttributes: [
          { column: 'gender', type: 'Bar', title: 'Gender' },
          { column: 'city', type: 'PieChart', title: 'City' },
          { column: 'birthDate', type: 'Bar', title: 'Age' },
          { column: 'maritalStatus', type: 'Bar', title: 'Marital Status' },
          { column: 'stateCd', type: 'Bar', title: 'State' },
          { column: 'occupation', type: 'PieChart', title: 'Occupation' },
        ],
        companyAttributes: ['company', 'agent'],
      };
      const newCompany = await this.companyRepository.save({
        companyId: randomNumber,
        companyWebsite: signupBody.website,
        brandColor: signupBody.brandColor,
        name: signupBody.companyName,
        tags: ['Auto', 'Home', 'Home Bundle', 'Trucking'],
        analyticsPreferences: analyticsConfig,
        taskTypes: ['Call', 'Email', 'Follow-up', 'Text', 'Work', 'Other'],
      });
      const user = await this.userRepository.save({
        username: signupBody.username.toLowerCase(),
        password:
          signupBody.password === null
            ? null
            : bcrypt.hashSync(signupBody.password, 10),
        companyUserId: newCompany.id,
      });

      // create a profile in courier app with username as recipientid and profile with any required data
      await this.notificationsService.createCourierProfileIfNotExists({
        recipient: signupBody.username,
        profile: {
          email: signupBody.username,
        },
      });

      const newLifecycle = {
        isEnabled: true,
        isNewClient: true,
        name: 'New Client',
        color: '#ffde7c',
        sequenceNumber: 0,
        targetYear: 360,
        targetMonth: 30,
        targetDay: 1,
        targetWeek: 7,
        companyLifecycleId: user.companyUserId,
      };
      const quotedLifecycle = {
        isEnabled: true,
        isQuoted: true,
        name: 'Quoted',
        color: '#bfbbb3',
        sequenceNumber: 1,
        targetYear: 180,
        targetMonth: 15,
        targetDay: 1,
        targetWeek: 6,
        companyLifecycleId: user.companyUserId,
      };
      const soldLifecycle = {
        isEnabled: true,
        isSold: true,
        name: 'Sold',
        color: '#7fff3a',
        sequenceNumber: 2,
        targetYear: 36,
        targetMonth: 3,
        targetDay: 1,
        targetWeek: 1,
        companyLifecycleId: user.companyUserId,
      };
      const lifecycleArray = [newLifecycle, quotedLifecycle, soldLifecycle];
      const newAgent = {
        email: user.username,
        password: user.password,
        companyAgentId: user.companyUserId,
        isPrimaryAgent: true,
      };
      const organicMed = {
        name: 'organic',
        totalSesions: '0',
        totalEvents: '0',
        totalNewLeads: '0',
        totalSold: '0',
        companyMediumId: user.companyUserId,
      };
      const cpcMed = {
        name: 'cpc',
        totalSesions: '0',
        totalEvents: '0',
        totalNewLeads: '0',
        totalSold: '0',
        companyMediumId: user.companyUserId,
      };
      const referralMed = {
        name: 'referral',
        totalSesions: '0',
        totalEvents: '0',
        totalNewLeads: '0',
        totalSold: '0',
        companyMediumId: user.companyUserId,
      };
      const directMed = {
        name: 'direct',
        totalSesions: '0',
        totalEvents: '0',
        totalNewLeads: '0',
        totalSold: '0',
        companyMediumId: user.companyUserId,
      };
      const noMed = {
        name: '(none)',
        totalSesions: '0',
        totalEvents: '0',
        totalNewLeads: '0',
        totalSold: '0',
        companyMediumId: user.companyUserId,
      };
      const medArray = [organicMed, cpcMed, referralMed, directMed, noMed];
      const lp = {
        url: '(none)',
        totalSesions: '0',
        companyLandingPageId: user.companyUserId,
      };
      const cta = {
        name: '(none)',
        googleEventCategory: '(none)',
        googleEventAction: 'click',
        googleEventLabel: 'Get A Quote',
        totalEvents: 0,
        companyCTAId: user.companyUserId,
      };

      const token = await jwt.sign(
        {
          user: {
            id: user.id,
            username: user.username,
            companyUserId: user.companyUserId,
          },
        },
        'secret',
        { expiresIn: 7200 }
      );
      if (token) {
        await jwt.verify(token, 'secret', async (err, decoded) => {
          if (err) {
            return {
              success: false,
              errorType: 6,
              data: 'user',
              message: 'Failed to authenticate token.',
            };
          }
          if (!decoded) {
            return {
              success: false,
              errorType: 6,
              data: 'user',
              message: 'Unauthorized user.',
            };
          }
          console.log(decoded);
          signupBody.decodedUser = decoded;
        });
      }

      const agent = await this.agentRepository.save(newAgent);
      const lifecycles = await this.lifecyclesRepository.save(lifecycleArray);

      return {
        title: 'Company and User created successfully',
        obj: user,
        token: token,
        userId: user.id,
      };
    } catch (error) {
      throw new HttpException('Error signing up', HttpStatus.BAD_REQUEST);
    }
  }
  async signinAsAgent(agentBody: any) {
    try {
      const emailCredential = agentBody.email
        ? agentBody.email.toLowerCase()
        : '';
      const agent = await this.agentRepository.findOne({
        where: { email: emailCredential },
        relations: ['companies'],
      });
      if (!agent) {
        throw new HttpException(
          'Incorrect Credentials',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!bcrypt.compareSync(agentBody.password, agent.password)) {
        throw new HttpException(
          'Incorrect Credentials',
          HttpStatus.BAD_REQUEST
        );
      }

      agent.password = null;
      const token = await jwt.sign(
        {
          agent: {
            id: agent.id,
            email: agent.email,
            companyAgentId: agent.companyAgentId,
          },
        },
        'secret',
        { expiresIn: 7200 }
      );
      return {
        message: 'Agent Logged In Successfully',
        token,
        agentId: agent.id,
        isCustomer: agent['companies'].customerId !== null,
        subscriptionId: agent['companies'].subscriptionId
          ? agent['companies'].subscriptionId
          : null,
      };
    } catch (error) {
      throw new HttpException(
        'Error logging in as agent',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async signinAsUser(userBody: any) {
    try {
      const usernameCredential = userBody.username
        ? userBody.username.toLowerCase()
        : '';

      const user = await this.userRepository.findOne({
        where: {
          username: usernameCredential,
        },
        relations: ['company'],
      });
      if (!user) {
        throw new HttpException(
          'Incorrect Credentials',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!bcrypt.compareSync(userBody.password, user.password)) {
        throw new HttpException(
          'Incorrect Credentials',
          HttpStatus.BAD_REQUEST
        );
      }
      const token = await jwt.sign(
        {
          user: {
            id: user.id,
            username: user.username,
            companyUserId: user.companyUserId,
          },
        },
        'secret',
        { expiresIn: 7200 }
      );
      return {
        message: 'User Logged In Successfully',
        token,
        userId: user.id,
        isCustomer: user.company && user.company.customerId !== null,
        subscriptionId:
          user && user.company.subscriptionId
            ? user.company.subscriptionId
            : null,
      };
    } catch (error) {
      console.log('---error', error)
      throw new HttpException('Error Logging In', HttpStatus.BAD_REQUEST);
    }
  }
  async updateUserPassword(userBody: any) {
    try {
      const decoded = this.request.body.decodedUser;
      const user = await this.userRepository.findOne({
        where: {
          id: decoded.user.id,
        },
      });

      if (!user) {
        throw new HttpException(
          'No user found with that id',
          HttpStatus.BAD_REQUEST
        );
      }
      user.password =
        userBody.password === null
          ? null
          : bcrypt.hashSync(userBody.password, 10);
      user.resetPasswordLink = null;
      const updatedUser = await this.userRepository.save(user);

      return {
        title: 'User password updated successfully',
        updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        'Error updating user password',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async updateAgentPassword(agentBody: any) {
    try {
      const decoded = this.request.body.decodedUser;

      const agent = await this.agentRepository.findOne({
        where: {
          id: decoded.agent.id,
        },
      });

      if (!agent) {
        throw new HttpException(
          'No agent found with that id',
          HttpStatus.BAD_REQUEST
        );
      }

      agent.password =
        agentBody.password === null
          ? null
          : bcrypt.hashSync(agentBody.password, 10);
      agent.resetPasswordLink = null;

      const updatedAgent = await this.agentRepository.save(agent);
      return {
        title: 'Agent password updated successfully',
        updatedAgent,
      };
    } catch (error) {
      throw new HttpException(
        'Error updating agent password',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async verifyAgent(queryToken: string) {
    try {
      const token = this.request.headers['x-access-token'] || queryToken;
      const decoded = jwt.decode(token as string);

      const agent = await this.agentRepository.findOne({
        where: { id: decoded['agent'].id },
      });

      if (!agent) {
        throw new HttpException(
          'No agent found with that id',
          HttpStatus.BAD_REQUEST
        );
      }

      if (queryToken !== agent.resetPasswordLink) {
        throw new HttpException('Token doesnt match', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Agent verified successfully',
        status: true,
      };
    } catch (error) {
      throw new HttpException('Error verifying agent', HttpStatus.BAD_REQUEST);
    }
  }
  async verifyUser(queryToken: string) {
    try {
      const decoded = this.request.body.decodedUser;

      const user = await this.userRepository.findOne({
        where: { id: decoded.user.id },
      });

      if (!user) {
        throw new HttpException(
          'No user found with that id',
          HttpStatus.BAD_REQUEST
        );
      }

      if (queryToken !== user.resetPasswordLink) {
        throw new HttpException('Token doesnt match', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'User verified successfully',
        status: true,
      };
    } catch (error) {
      throw new HttpException('Error verifying user', HttpStatus.BAD_REQUEST);
    }
  }
  async signupAsPlatformManager(platformBody: any) {
    try {
      /*const platformManager = await this.platformManagersRepository.findOne({
        where: {
          email: platformBody.email,
        },
      });
      if (platformManager) {
        throw new HttpException(
          'Platform Manager already exists',
          HttpStatus.BAD_REQUEST
        );
      }
      const newPlatformManager = await this.platformManagersRepository.save({
        email: platformBody.email.toLowerCase(),
        // password: (platformBody.password === null) ? null : bcrypt.hashSync(platformBody.password)  TODO should be added bcrypt package
      });
      if (!newPlatformManager) {
        throw new HttpException(
          'There was an error creating the platform Manager',
          HttpStatus.BAD_REQUEST
        );
      }
      // create a user profile for admin
        //   TODO should be imported from Notification module
          await createCourierProfileIfNotExists({
            recipient: platformBody.email,
            profile: {
              email:platformBody.email
            }
          })*/
      return {
        title: 'Platform Manager created successfully',
        // obj: newPlatformManager,
      };
    } catch (error) {
      throw new HttpException(
        'There was an error retrieving the platform Manager',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async signinAsPlatformManager(platformBody: any) {
    try {
      const emailCredential = platformBody.email
        ? platformBody.email.toLowerCase()
        : '';
      // const platformManager = await this.platformManagersRepository.findOne({
      //   where: {
      //     email: emailCredential,
      //   },
      // });
      // if (!platformManager) {
      //   throw new HttpException(
      //     'No platform manager found',
      //     HttpStatus.BAD_REQUEST
      //   );
      // }
      /*
    //   TODO should be added bcrypt package
      if (
        !bcrypt.compareSync(platformBody.password, platformManager.password)
      ) {
        throw new HttpException('Incorrect password!', HttpStatus.BAD_REQUEST);
      }

    //   TODO should be added jwt package

      const token = jwt.sign({ platformManager }, 'secret', {
        expiresIn: 864000,
      });
      */
      return {
        message: 'PlatformManager Logged In Successfully',
        // token,
        // platformManagerId: platformManager.id,
      };
    } catch (error) {
      throw new HttpException(
        'There was an error signing in!',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
