import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as KeenAnalysis from 'keen-analysis';
import * as nodemailer from 'nodemailer';
import Promise from 'bluebird';
import { keen } from '../../constants/appconstant';
import { Users } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const client = new KeenAnalysis({
  projectId: keen.PROJECT_ID,
  readKey: keen.READ_KEY,
});
@Injectable()
export class ReportService {
  mailOptions: any;
  transporter: any;
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>
  ) {}
  async createAndSendWeeklyReport() {
    try {
      const d = new Date();
      const today = new Date().toLocaleDateString();
      const lastWeek = new Date(
        d.setDate(d.getDate() - 7)
      ).toLocaleDateString();

      const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const returnValidEmail = async (email) =>
        emailRegEx.test(String(email).toLowerCase());

      const createEmail = async (user, result) => {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          port: 25,
          auth: {
            user: 'customer-success@xilo.io',
            pass: 'tothetop!123@',
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        this.mailOptions = {
          from: 'customer-success@xilo.io',
          to: user.username,
          subject: `XILO - Weekly Report For ${lastWeek} - ${today}`,
          html: `
                              <!doctype html>
                              <html>
                                <head>
                                  <meta name="viewport" content="width=device-width" />
                                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                                  <title>XILO Report</title>
                                  <style>
                                    /* -------------------------------------
                                        GLOBAL RESETS
                                    ------------------------------------- */
                                    
                                    /*All the styling goes here*/
                                    
                                    img {
                                      border: none;
                                      -ms-interpolation-mode: bicubic;
                                      max-width: 100%; 
                                    }
                                    body {
                                      background-color: #f6f6f6;
                                      font-family: sans-serif;
                                      -webkit-font-smoothing: antialiased;
                                      font-size: 14px;
                                      line-height: 1.4;
                                      margin: 0;
                                      padding: 0;
                                      -ms-text-size-adjust: 100%;
                                      -webkit-text-size-adjust: 100%; 
                                    }
                                    table {
                                      border-collapse: separate;
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      width: 100%; }
                                      table td {
                                        font-family: sans-serif;
                                        font-size: 14px;
                                        vertical-align: top; 
                                    }
                                    /* -------------------------------------
                                        BODY & CONTAINER
                                    ------------------------------------- */
                                    .body {
                                      background-color: #f6f6f6;
                                      width: 100%; 
                                    }
                                    /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                                    .container {
                                      display: block;
                                      margin: 0 auto !important;
                                      /* makes it centered */
                                      max-width: 580px;
                                      padding: 10px;
                                      width: 580px; 
                                    }
                                    /* This should also be a block element, so that it will fill 100% of the .container */
                                    .content {
                                      box-sizing: border-box;
                                      display: block;
                                      margin: 0 auto;
                                      max-width: 580px;
                                      padding: 10px; 
                                    }
                                    /* -------------------------------------
                                        HEADER, FOOTER, MAIN
                                    ------------------------------------- */
                                    .main {
                                      background: #ffffff;
                                      border-radius: 3px;
                                      border: 1px solid #ccc;
                                      width: 100%; 
                                    }
                                    .wrapper {
                                      box-sizing: border-box;
                                      padding: 20px; 
                                    }
                                    .content-block {
                                      padding-bottom: 10px;
                                      padding-top: 10px;
                                    }
                                    .footer {
                                      clear: both;
                                      margin-top: 10px;
                                      text-align: center;
                                      width: 100%; 
                                    }
                                      .footer td,
                                      .footer p,
                                      .footer span,
                                      .footer a {
                                        color: #999999;
                                        font-size: 12px;
                                        text-align: center; 
                                    }
                                    /* -------------------------------------
                                        TYPOGRAPHY
                                    ------------------------------------- */
                                    h1,
                                    h2,
                                    h3,
                                    h4 {
                                      color: #000000;
                                      font-family: sans-serif;
                                      font-weight: 400;
                                      line-height: 1.4;
                                      margin: 0;
                                      margin-bottom: 30px; 
                                    }
                                    h1 {
                                      font-size: 35px;
                                      font-weight: 300;
                                      text-align: center;
                                      text-transform: capitalize; 
                                    }
                                    p,
                                    ul,
                                    ol {
                                      font-family: sans-serif;
                                      font-size: 14px;
                                      font-weight: normal;
                                      margin: 0;
                                      margin-bottom: 15px; 
                                    }
                                      p li,
                                      ul li,
                                      ol li {
                                        list-style-position: inside;
                                        margin-left: 5px; 
                                    }
                                    a {
                                      color: #3498db;
                                      text-decoration: underline; 
                                    }
                                    /* -------------------------------------
                                        BUTTONS
                                    ------------------------------------- */
                                    .btn {
                                      box-sizing: border-box;
                                      width: 100%; }
                                      .btn > tbody > tr > td {
                                        padding-bottom: 15px; }
                                      .btn table {
                                        width: auto; 
                                    }
                                      .btn table td {
                                        background-color: #ffffff;
                                        border-radius: 5px;
                                        text-align: center; 
                                    }
                                      .btn a {
                                        background-color: #ffffff;
                                        border: solid 1px #3498db;
                                        border-radius: 5px;
                                        box-sizing: border-box;
                                        color: #3498db;
                                        cursor: pointer;
                                        display: inline-block;
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin: 0;
                                        padding: 12px 25px;
                                        text-decoration: none;
                                        text-transform: capitalize; 
                                    }
                                    .btn-primary table td {
                                      background-color: #fff; 
                                      border-radius: 0;
                                      border: 1px solid #ccc;
                                      margin: 0;
                                    }
                                    .btn-primary table th {
                                      background-color: #7c7fff; 
                                      color: #fff;
                                      border-radius: 0;
                                      margin: 0;
                                      border: 1px solid #ccc;
                                    }
                                    .btn-primary a {
                                      background-color: #3498db;
                                      border-color: #3498db;
                                      color: #ffffff; 
                                    }
                                    /* -------------------------------------
                                        OTHER STYLES THAT MIGHT BE USEFUL
                                    ------------------------------------- */
                                    .last {
                                      margin-bottom: 0; 
                                    }
                                    .first {
                                      margin-top: 0; 
                                    }
                                    .align-center {
                                      text-align: center; 
                                    }
                                    .align-right {
                                      text-align: right; 
                                    }
                                    .align-left {
                                      text-align: left; 
                                    }
                                    .clear {
                                      clear: both; 
                                    }
                                    .mt0 {
                                      margin-top: 0; 
                                    }
                                    .mb0 {
                                      margin-bottom: 0; 
                                    }
                                    .preheader {
                                      color: transparent;
                                      display: none;
                                      height: 0;
                                      max-height: 0;
                                      max-width: 0;
                                      opacity: 0;
                                      overflow: hidden;
                                      mso-hide: all;
                                      visibility: hidden;
                                      width: 0; 
                                    }
                                    .powered-by a {
                                      text-decoration: none; 
                                    }
                                    hr {
                                      border: 0;
                                      border-bottom: 1px solid #f6f6f6;
                                      margin: 20px 0; 
                                    }
                                    /* -------------------------------------
                                        RESPONSIVE AND MOBILE FRIENDLY STYLES
                                    ------------------------------------- */
                                    @media only screen and (max-width: 620px) {
                                      table[class=body] h1 {
                                        font-size: 28px !important;
                                        margin-bottom: 10px !important; 
                                      }
                                      table[class=body] p,
                                      table[class=body] ul,
                                      table[class=body] ol,
                                      table[class=body] td,
                                      table[class=body] span,
                                      table[class=body] a {
                                        font-size: 16px !important; 
                                      }
                                      table[class=body] .wrapper,
                                      table[class=body] .article {
                                        padding: 10px !important; 
                                      }
                                      table[class=body] .content {
                                        padding: 0 !important; 
                                      }
                                      table[class=body] .container {
                                        padding: 0 !important;
                                        width: 100% !important; 
                                      }
                                      table[class=body] .main {
                                        border-left-width: 0 !important;
                                        border-radius: 0 !important;
                                        border-right-width: 0 !important; 
                                      }
                                      table[class=body] .btn table {
                                        width: 100% !important; 
                                      }
                                      table[class=body] .btn a {
                                        width: 100% !important; 
                                      }
                                      table[class=body] .img-responsive {
                                        height: auto !important;
                                        max-width: 100% !important;
                                        width: auto !important; 
                                      }
                                    }
                                    /* -------------------------------------
                                        PRESERVE THESE STYLES IN THE HEAD
                                    ------------------------------------- */
                                    @media all {
                                      .ExternalClass {
                                        width: 100%; 
                                      }
                                      .ExternalClass,
                                      .ExternalClass p,
                                      .ExternalClass span,
                                      .ExternalClass font,
                                      .ExternalClass td,
                                      .ExternalClass div {
                                        line-height: 100%; 
                                      }
                                      .apple-link a {
                                        color: inherit !important;
                                        font-family: inherit !important;
                                        font-size: inherit !important;
                                        font-weight: inherit !important;
                                        line-height: inherit !important;
                                        text-decoration: none !important; 
                                      }
                                      .btn-primary table td:hover {
                                        background-color: #34495e !important; 
                                      }
                                      .btn-primary a:hover {
                                        background-color: #34495e !important;
                                        border-color: #34495e !important; 
                                      } 
                                    }
                                  </style>
                                </head>
                                <body class="">
                                  <span class="preheader">You had ${
                                    result[0]
                                  } Visitors, ${result[1]} Start Form, ${
            result[2]
          } New Leads, and ${result[3]} Finish the form this week!</span>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                                    <tr>
                                      <td>&nbsp;</td>
                                      <td class="container">
                                        <div class="content">
                              
                                          <!-- START CENTERED WHITE CONTAINER -->
                                          <table role="presentation" class="main">
                              
                                            <!-- START MAIN CONTENT AREA -->
                                            <tr>
                                              <td class="wrapper">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                    <td>
                                                      <p>Hi, ${
                                                        user.firstName
                                                      }!</p>
                                                      <p>Please see your weekly XILO report for ${lastWeek} - ${today}.</p>
                                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                                        <tbody>
                                                          <tr>
                                                            <td align="left">
                                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                                    <tbody>
                                                                    <tr>
                                                                    <table>
                                                                    <tr>
                                                                        <th>Visited Forms</th>
                                                                        <th>Started Forms</th>
                                                                        <th>New Leads</th>
                                                                        <th>Finished Form</th>
                                                                        <th>Visit To Lead Conversion Rate</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>${
                                                                          result[0]
                                                                        }</td>
                                                                        <td>${
                                                                          result[1]
                                                                        }</td>
                                                                        <td>${
                                                                          result[2]
                                                                        }</td>
                                                                        <td>${
                                                                          result[3]
                                                                        }</td>
                                                                        <td>${(
                                                                          (parseInt(
                                                                            result[2]
                                                                          ) /
                                                                            parseInt(
                                                                              result[0]
                                                                            )) *
                                                                          100
                                                                        ).toFixed(
                                                                          2
                                                                        )}%</td>
                                                                    </tr>
                                                                    </table>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <p></p>
                                                      <p>Have a great day!</p>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                              
                                          <!-- END MAIN CONTENT AREA -->
                                          </table>
                                          <!-- END CENTERED WHITE CONTAINER -->
                              
                                          <!-- START FOOTER -->
                                          <div class="footer">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                              <tr>
                                                <td class="content-block">
                                                  <span class="apple-link"><a href="www.xilo.io" target="_blank">XILO</a>, San Diego, CA</span><br>
                                                  <span class="apple-link">customer-success@xilo.io | 858-848-9801</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td class="content-block powered-by">
                                                </td>
                                              </tr>
                                            </table>
                                          </div>
                                          <!-- END FOOTER -->
                              
                                        </div>
                                      </td>
                                      <td>&nbsp;</td>
                                    </tr>
                                  </table>
                                </body>
                              </html>
                              `,
        };
        // Send email using nodemailer
        this.transporter.sendMail(this.mailOptions, (error, info) => {
          if (error) {
          }
        });
      };

      const users = await this.userRepository.find({
        where: { sendReport: true },
        relations: ['company'],
      });
      if (!users) {
        throw new HttpException('No found users', HttpStatus.BAD_REQUEST);
      }
      let result;
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (returnValidEmail(user)) {
          result = await client.query('funnel', {
            steps: [
              {
                actor_property: 'ip_address',
                event_collection: 'Visited XILO',
                filters: [
                  {
                    operator: 'eq',
                    property_name: 'company.company_name',
                    property_value: `${user.company.name}`,
                  },
                ],
                inverted: false,
                optional: false,
                timeframe: 'previous_7_days',
                timezone: 'US/Pacific',
                with_actors: false,
              },
              {
                actor_property: 'ip_address',
                event_collection: 'Started Form',
                filters: [
                  {
                    operator: 'eq',
                    property_name: 'company.company_name',
                    property_value: `${user.company.name}`,
                  },
                ],
                inverted: false,
                optional: false,
                timeframe: 'previous_7_days',
                timezone: 'US/Pacific',
                with_actors: false,
              },
              {
                actor_property: 'ip_address',
                event_collection: 'New Lead',
                filters: [
                  {
                    operator: 'eq',
                    property_name: 'company.company_name',
                    property_value: `${user.company.name}`,
                  },
                ],
                inverted: false,
                optional: false,
                timeframe: 'previous_7_days',
                timezone: 'US/Pacific',
                with_actors: false,
              },
              {
                actor_property: 'ip_address',
                event_collection: 'Finished Form',
                filters: [
                  {
                    operator: 'eq',
                    property_name: 'company.company_name',
                    property_value: `${user.company.name}`,
                  },
                ],
                inverted: false,
                optional: false,
                timeframe: 'previous_7_days',
                timezone: 'US/Pacific',
                with_actors: false,
              },
            ],
          });
          await createEmail(user, result.result);
        }
        if (!users[i + 1]) {
          return {
            title: 'Data found',
            obj: result.result,
          };
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async sendDailyInternalReport() {
    try {
      const d = new Date();
      const today = new Date().toLocaleDateString();
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff =
        +now -
        +start +
        (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
      const oneDay = 1000 * 60 * 60 * 24;
      const ytd = Math.floor(diff / oneDay);

      const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const returnValidEmail = async (email) =>
        emailRegEx.test(String(email).toLowerCase());

      const createEmail = async () => {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          port: 25,
          auth: {
            user: 'customer-success@xilo.io',
            pass: 'tothetop!123@',
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        this.mailOptions = {
          from: 'customer-success@xilo.io',
          to: 'customer-success@xilo.io',
          subject: `XILO - Daily Report For ${today}`,
          html: `
                    <!doctype html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <title>XILO Report</title>
                        <style>
                          /* -------------------------------------
                              GLOBAL RESETS
                          ------------------------------------- */
                          
                          /*All the styling goes here*/
                          
                          img {
                            border: none;
                            -ms-interpolation-mode: bicubic;
                            max-width: 100%; 
                          }
                          body {
                            background-color: #f6f6f6;
                            font-family: sans-serif;
                            -webkit-font-smoothing: antialiased;
                            font-size: 14px;
                            line-height: 1.4;
                            margin: 0;
                            padding: 0;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%; 
                          }
                          table {
                            border-collapse: separate;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            width: 100%; }
                            table td {
                              font-family: sans-serif;
                              font-size: 14px;
                              vertical-align: top; 
                          }
                          /* -------------------------------------
                              BODY & CONTAINER
                          ------------------------------------- */
                          .body {
                            background-color: #f6f6f6;
                            width: 100%; 
                          }
                          /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                          .container {
                            display: block;
                            margin: 0 auto !important;
                            /* makes it centered */
                            max-width: 1000px;
                            padding: 10px;
                            width: 1000px; 
                          }
                          /* This should also be a block element, so that it will fill 100% of the .container */
                          .content {
                            box-sizing: border-box;
                            display: block;
                            margin: 0 auto;
                            max-width: 1000px;
                            padding: 10px; 
                          }
                          /* -------------------------------------
                              HEADER, FOOTER, MAIN
                          ------------------------------------- */
                          .main {
                            background: #ffffff;
                            border-radius: 3px;
                            border: 1px solid #ccc;
                            width: 100%; 
                          }
                          .wrapper {
                            box-sizing: border-box;
                            padding: 20px; 
                          }
                          .content-block {
                            padding-bottom: 10px;
                            padding-top: 10px;
                          }
                          .footer {
                            clear: both;
                            margin-top: 10px;
                            text-align: center;
                            width: 100%; 
                          }
                            .footer td,
                            .footer p,
                            .footer span,
                            .footer a {
                              color: #999999;
                              font-size: 12px;
                              text-align: center; 
                          }
                          /* -------------------------------------
                              TYPOGRAPHY
                          ------------------------------------- */
                          h1,
                          h2,
                          h3,
                          h4 {
                            color: #000000;
                            font-family: sans-serif;
                            font-weight: 400;
                            line-height: 1.4;
                            margin: 0;
                            margin-bottom: 30px; 
                          }
                          h1 {
                            font-size: 35px;
                            font-weight: 300;
                            text-align: center;
                            text-transform: capitalize; 
                          }
                          p,
                          ul,
                          ol {
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px; 
                          }
                            p li,
                            ul li,
                            ol li {
                              list-style-position: inside;
                              margin-left: 5px; 
                          }
                          a {
                            color: #3498db;
                            text-decoration: underline; 
                          }
                          /* -------------------------------------
                              BUTTONS
                          ------------------------------------- */
                          .btn {
                            box-sizing: border-box;
                            width: 100%; }
                            .btn > tbody > tr > td {
                              padding-bottom: 15px; }
                            .btn table {
                              width: auto; 
                          }
                            .btn table td {
                              background-color: #ffffff;
                              border-radius: 5px;
                              text-align: center; 
                          }
                            .btn a {
                              background-color: #ffffff;
                              border: solid 1px #3498db;
                              border-radius: 5px;
                              box-sizing: border-box;
                              color: #3498db;
                              cursor: pointer;
                              display: inline-block;
                              font-size: 14px;
                              font-weight: bold;
                              margin: 0;
                              padding: 12px 25px;
                              text-decoration: none;
                              text-transform: capitalize; 
                          }
                          .btn-primary table td {
                            background-color: #fff; 
                            border-radius: 0;
                            border: 1px solid #ccc;
                            margin: 0;
                          }
                          .btn-primary table th {
                            background-color: #7c7fff; 
                            color: #fff;
                            border-radius: 0;
                            margin: 0;
                            border: 1px solid #ccc;
                          }
                          .btn-primary a {
                            background-color: #3498db;
                            border-color: #3498db;
                            color: #ffffff; 
                          }
                          /* -------------------------------------
                              OTHER STYLES THAT MIGHT BE USEFUL
                          ------------------------------------- */
                          .last {
                            margin-bottom: 0; 
                          }
                          .first {
                            margin-top: 0; 
                          }
                          .align-center {
                            text-align: center; 
                          }
                          .align-right {
                            text-align: right; 
                          }
                          .align-left {
                            text-align: left; 
                          }
                          .clear {
                            clear: both; 
                          }
                          .mt0 {
                            margin-top: 0; 
                          }
                          .mb0 {
                            margin-bottom: 0; 
                          }
                          .preheader {
                            color: transparent;
                            display: none;
                            height: 0;
                            max-height: 0;
                            max-width: 0;
                            opacity: 0;
                            overflow: hidden;
                            mso-hide: all;
                            visibility: hidden;
                            width: 0; 
                          }
                          .powered-by a {
                            text-decoration: none; 
                          }
                          hr {
                            border: 0;
                            border-bottom: 1px solid #f6f6f6;
                            margin: 20px 0; 
                          }
                          /* -------------------------------------
                              RESPONSIVE AND MOBILE FRIENDLY STYLES
                          ------------------------------------- */
                          @media only screen and (max-width: 620px) {
                            table[class=body] h1 {
                              font-size: 28px !important;
                              margin-bottom: 10px !important; 
                            }
                            table[class=body] p,
                            table[class=body] ul,
                            table[class=body] ol,
                            table[class=body] td,
                            table[class=body] span,
                            table[class=body] a {
                              font-size: 16px !important; 
                            }
                            table[class=body] .wrapper,
                            table[class=body] .article {
                              padding: 10px !important; 
                            }
                            table[class=body] .content {
                              padding: 0 !important; 
                            }
                            table[class=body] .container {
                              padding: 0 !important;
                              width: 100% !important; 
                            }
                            table[class=body] .main {
                              border-left-width: 0 !important;
                              border-radius: 0 !important;
                              border-right-width: 0 !important; 
                            }
                            table[class=body] .btn table {
                              width: 100% !important; 
                            }
                            table[class=body] .btn a {
                              width: 100% !important; 
                            }
                            table[class=body] .img-responsive {
                              height: auto !important;
                              max-width: 100% !important;
                              width: auto !important; 
                            }
                          }
                          /* -------------------------------------
                              PRESERVE THESE STYLES IN THE HEAD
                          ------------------------------------- */
                          @media all {
                            .ExternalClass {
                              width: 100%; 
                            }
                            .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                              line-height: 100%; 
                            }
                            .apple-link a {
                              color: inherit !important;
                              font-family: inherit !important;
                              font-size: inherit !important;
                              font-weight: inherit !important;
                              line-height: inherit !important;
                              text-decoration: none !important; 
                            }
                            .btn-primary table td:hover {
                              background-color: #34495e !important; 
                            }
                            .btn-primary a:hover {
                              background-color: #34495e !important;
                              border-color: #34495e !important; 
                            } 
                          }
                        </style>
                      </head>
                      <body class="">
                        <span class="preheader">Let's make these customers successful!</span>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                          <tr>
                            <td>&nbsp;</td>
                            <td class="container">
                              <div class="content">
                    
                                <!-- START CENTERED WHITE CONTAINER -->
                                <table role="presentation" class="main">
                    
                                  <!-- START MAIN CONTENT AREA -->
                                  <tr>
                                    <td class="wrapper">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td>
                                            <p>Hi, CEO!</p>
                                            <p>Please see your daily XILO report for ${today}.</p>
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                              <tbody>
                                                <tr>
                                                  <td align="left">
                                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                          <tr>
                                                          <table>
                                                          <tr>
                                                            <th>Agency</th>
                                                            <th>VF Y</th>
                                                            <th>SF Y</th>
                                                            <th>NL Y</th>
                                                            <th>FF Y</th>
                                                            <th>% Y</th>
                                                            <th>VF WTD</th>
                                                            <th>SF WTD</th>
                                                            <th>NL WTD</th>
                                                            <th>FF WTD</th>
                                                            <th>% WTD</th>
                                                            <th>VF MTD</th>
                                                            <th>SF MTD</th>
                                                            <th>NL MTD</th>
                                                            <th>FF MTD</th>
                                                            <th>% MTD</th>
                                                            <th>VF YTD</th>
                                                            <th>SF YTD</th>
                                                            <th>NL YTD</th>
                                                            <th>FF YTD</th>
                                                            <th>% YTD</th>
                                                          </tr>
                                                            ${await generateTd()}
                                                          </table>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <p></p>
                                            <p>Have a great day!</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                    
                                <!-- END MAIN CONTENT AREA -->
                                </table>
                                <!-- END CENTERED WHITE CONTAINER -->
                    
                                <!-- START FOOTER -->
                                <div class="footer">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td class="content-block">
                                        <span class="apple-link"><a href="www.xilo.io" target="_blank">XILO</a>, San Diego, CA</span><br>
                                        <span class="apple-link">customer-success@xilo.io | 858-848-9801</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="content-block powered-by">
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                                <!-- END FOOTER -->
                    
                              </div>
                            </td>
                            <td>&nbsp;</td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    `,
        };
        // Send email using nodemailer
        this.transporter.sendMail(this.mailOptions, (error, info) => {
          if (error) {
          }
        });
      };

      const generateTd = async () => {
        await results.sort((a, b) => b.results.mtd[2] - a.results.mtd[2]);

        let html = '';
        await Promise.all(
          results.map(async (oneCompany) => {
            html += `<tr><td>${oneCompany.name}</td>
            <td>${oneCompany.results.y[0]}</td>
            <td>${oneCompany.results.y[1]}</td>
            <td>${oneCompany.results.y[2]}</td>
            <td>${oneCompany.results.y[3]}</td>
            <td>${(
              (parseInt(oneCompany.results.y[2]) /
                parseInt(oneCompany.results.y[0])) *
              100
            ).toFixed(2)}%</td>
            <td>${oneCompany.results.wtd[0]}</td>
            <td>${oneCompany.results.wtd[1]}</td>
            <td>${oneCompany.results.wtd[2]}</td>
            <td>${oneCompany.results.wtd[3]}</td>
            <td>${(
              (parseInt(oneCompany.results.wtd[2]) /
                parseInt(oneCompany.results.wtd[0])) *
              100
            ).toFixed(2)}%</td>
            <td>${oneCompany.results.mtd[0]}</td>
            <td>${oneCompany.results.mtd[1]}</td>
            <td>${oneCompany.results.mtd[2]}</td>
            <td>${oneCompany.results.mtd[3]}</td>
            <td>${(
              (parseInt(oneCompany.results.mtd[2]) /
                parseInt(oneCompany.results.mtd[0])) *
              100
            ).toFixed(2)}%</td>
            <td>${oneCompany.results.ytd[0]}</td>
            <td>${oneCompany.results.ytd[1]}</td>
            <td>${oneCompany.results.ytd[2]}</td>
            <td>${oneCompany.results.ytd[3]}</td>
            <td>${(
              (parseInt(oneCompany.results.ytd[2]) /
                parseInt(oneCompany.results.ytd[0])) *
              100
            ).toFixed(2)}%</td></tr>`;
          })
        );

        return html;
      };

      const userList = await this.userRepository.find({
        where: { showReport: true },
        relations: ['company'],
      });
      if (!userList) {
        throw new HttpException('No found users', HttpStatus.BAD_REQUEST);
      }
      const results = [];

      const data = await Promise.all(
        userList.map(async (oneUser) => {
          let wtd = d.getDay();
          const mtd = d.getDate();
          if (wtd === 0) {
            wtd = 7;
          }

          if (returnValidEmail(oneUser.username)) {
            const yResult = await client.query('funnel', {
              steps: [
                {
                  actor_property: 'ip_address',
                  event_collection: 'Visited XILO',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: 'previous_1_days',
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Started Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: 'previous_1_days',
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'New Lead',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: 'previous_1_days',
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Finished Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: 'previous_1_days',
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
              ],
            });
            const wtdResult = await client.query('funnel', {
              steps: [
                {
                  actor_property: 'ip_address',
                  event_collection: 'Visited XILO',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${wtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Started Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${wtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'New Lead',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${wtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Finished Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${wtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
              ],
            });
            const mtdResult = await client.query('funnel', {
              steps: [
                {
                  actor_property: 'ip_address',
                  event_collection: 'Visited XILO',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${mtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Started Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${mtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'New Lead',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${mtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Finished Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${mtd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
              ],
            });

            const ytdResult = await client.query('funnel', {
              steps: [
                {
                  actor_property: 'ip_address',
                  event_collection: 'Visited XILO',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${ytd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Started Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${ytd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'New Lead',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${ytd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
                {
                  actor_property: 'ip_address',
                  event_collection: 'Finished Form',
                  filters: [
                    {
                      operator: 'eq',
                      property_name: 'company.company_name',
                      property_value: `${oneUser.company.name}`,
                    },
                  ],
                  inverted: false,
                  optional: false,
                  timeframe: `previous_${ytd}_days`,
                  timezone: 'US/Pacific',
                  with_actors: false,
                },
              ],
            });

            const result = {
              name: oneUser.company.name,
              results: {
                y: yResult.result,
                wtd: wtdResult.result,
                mtd: mtdResult.result,
                ytd: ytdResult.result,
              },
            };

            results.push(result);
          }
        })
      );

      await createEmail();

      return {
        message: 'Report Success',
        obj: results,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
