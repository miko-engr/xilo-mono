
import * as addressParser from 'parse-address';
import * as nodeMailer from 'nodemailer';
import * as fs from 'fs';
import * as juice from 'juice';
import * as _ from 'lodash';
import {
  nodeMailer as configConstant,
  emailTemplate,
} from '../constants/appconstant';

export const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export async function sendSimpleMail(
  toEmail: string,
  subject: string,
  emailBody: any,
  done?: any
) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: configConstant.EMAIL,
      pass: configConstant.PAW,
    },
  });

  await fs.readFile(
    emailTemplate.ERROR_LOG,
    'utf8',
    async (fsError, fileData) => {
      if (fsError) {
        return {
          success: false,
          message: 'something went wrong please try again',
        };
      }

      let compiledTemplateFunc = await _.template(fileData);

      let compiledTemplate = await compiledTemplateFunc({ emailBody });
      const htmlData = await juice(compiledTemplate);

      const mailOptions = {
        html: htmlData,
        from: '"XILO Team"',
        to: toEmail,
        subject: !subject ? 'XILO Error log Details' : subject,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return {
            success: false,
            message: 'something went wrong please try again',
          };
        }
        return { success: true, message: 'email sent successfully' };
      });
    }
  );
  return { success: true, message: 'email sent successfully' };
}

export async function sendInvitationMail(
  email: string,
  subject: string,
  emailInfo: any
) {
  try {
    if (!email) {
      return { success: false, message: 'email not found' };
    }
    const transporter = await nodeMailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: configConstant.EMAIL,
        pass: configConstant.PAW,
      },
    });
    await fs.readFile(
      emailTemplate.INVITATION_MAIL,
      'utf8',
      async (fsError, fileData) => {
        if (fsError) {
          return {
            success: false,
            message: 'something went wrong please try again',
          };
        }
        let compiledTemplateFun = await _.template(fileData);
        let compiledTemplate = await compiledTemplateFun({ emailInfo });
        const htmlData = await juice(compiledTemplate);
        const mailOptions = {
          from: configConstant.EMAIL,
          to: email,
          subject: subject,
          html: htmlData,
        };
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return {
              success: false,
              message: 'something went wrong please try again',
            };
          }
          return { success: true, message: 'email sent successfully' };
        });
      }
    );
  } catch (error) {
    return { success: false, message: 'something went wrong please try again' };
  }
}
