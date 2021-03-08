import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../user/user.entity';
import { Companies } from '../company/company.entity';

import * as docusign from 'docusign-esign';
import { DOCUSIGN, XILO_COMPANY_ID } from '../../constants/appconstant';
import * as superagent from 'superagent';
import * as moment from 'moment';
const basePath = DOCUSIGN.basePath;
const templateId = DOCUSIGN.templateId;
const accountId = DOCUSIGN.accountId;
const integratorKey = DOCUSIGN.integratorKey;
const clientSecret = DOCUSIGN.clientSecret;
const basePathForToken = DOCUSIGN.basePathFortoken;
const xiloCompanyId = XILO_COMPANY_ID;

@Injectable()
export class DocuSignService {
  constructor(
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Users) private userRepository: Repository<Users>
  ) {}
  async createContract(email: string) {
    try {
      if (!email) {
        throw new HttpException('Email not found', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userRepository.findOne({
        where: { username: email },
        select: ['id', 'companyUserId'],
      });

      if (!user) {
        throw new HttpException(
          'Error creating contract. Admin not found',
          HttpStatus.BAD_REQUEST
        );
      }

      const company = await this.companyRepository.findOne({
        where: { id: user.companyUserId },
        select: ['id', 'contractDetails'],
      });

      if (!company) {
        throw new HttpException(
          'Error creating contract. Company not found',
          HttpStatus.BAD_REQUEST
        );
      }
      company.contractDetails = {
        name: 'Xilo User',
        occupation: '',
        email: email,
      };
      const updateCompany = await this.companyRepository.save(company);
      if (!updateCompany) {
        throw new HttpException(
          'Error updating contract.',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Contract created sucessfully!',
      };
    } catch (error) {
      throw new HttpException(
        'Error creating contract. Method failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async docuSignDocument(encodedEmail: string, redirectUri: string) {
    try {
      const email = decodeURIComponent(encodedEmail);
      const user = await this.userRepository.findOne({
        where: { username: email },
        select: ['id', 'companyUserId'],
      });

      if (!user) {
        throw new HttpException(
          'Error creating document. User not found!',
          HttpStatus.BAD_REQUEST
        );
      }

      const xilo = await this.companyRepository.findOne({
        where: { id: xiloCompanyId },
        select: ['id', 'docusignAccessToken', 'docusignRefreshToken'],
      });

      //TODO MAKE THIS ONLY COMPANY
      const company = await this.companyRepository.findOne({
        where: { id: user.companyUserId },
        select: ['id', 'contractDetails'],
      });

      if (!company || !xilo || !xilo.docusignRefreshToken) {
        throw new HttpException(
          'Error creating document. Company not found!',
          HttpStatus.BAD_REQUEST
        );
      }

      let contractInfo = company.contractDetails || {};

      if (!contractInfo || !contractInfo['email']) {
        throw new HttpException(
          'Error creating document. Email not found in contract!',
          HttpStatus.BAD_REQUEST
        );
      }
      // TODO should be working when imported docu sign package and helper service
      let apiClient = new docusign.ApiClient();
      apiClient.setBasePath(basePath);
      const refreshToken = xilo.docusignRefreshToken;
      const clientString = `${integratorKey}:${clientSecret}`;
      const postData = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      };
      const headers = {
        Authorization: 'Basic ' + new Buffer(clientString).toString('base64'),
      };
      const authReq = await superagent
        .post(basePathForToken + '/oauth/token')
        .send(postData)
        .set(headers)
        .type('application/json');

      const oAuthToken = JSON.parse(authReq.text);

      const dataForUpdate = authReq.text;
      const accessToken = oAuthToken.access_token;
      const dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(basePath);
      dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
      const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
      const envelope = await this.makeEnvelope(contractInfo);
      let results = await envelopesApi.createEnvelope(accountId, {
        envelopeDefinition: envelope,
      });
      const envelopeId = results.envelopeId;
      const viewRequest = await this.makeRecipientViewRequest({
        signerEmail: contractInfo['email'],
        signerName: contractInfo['customer']
          ? contractInfo['customer']['fullName']
          : contractInfo['contactEmail'],
        signerClientId: contractInfo['email'],
        templateId: templateId,
        redirectUri: redirectUri,
      });
      results = await envelopesApi.createRecipientView(accountId, envelopeId, {
        recipientViewRequest: viewRequest,
      });

      contractInfo['contractEnvelopeId'] = envelopeId;
      company.contractDetails = contractInfo;
      company.docusignAccessToken = dataForUpdate.access_token;
      company.docusignRefreshToken = dataForUpdate.refresh_token;
      const updateCompany = await this.companyRepository.save(company);
      if (!updateCompany) {
        throw new HttpException(
          'Error updating document',
          HttpStatus.BAD_REQUEST
        );
      }
      xilo.docusignAccessToken = dataForUpdate.access_token;
      xilo.docusignRefreshToken = dataForUpdate.refresh_token;
      const xiloUpdate = await this.companyRepository.save(xilo);
      if (!xiloUpdate) {
        throw new HttpException(
          'Error updating document',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        url: results.url,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async docuSignByDocument(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: email },
        select: ['id', 'companyUserId'],
      });

      if (!user) {
        throw new HttpException(
          'Error updating document to signed. No user found',
          HttpStatus.BAD_REQUEST
        );
      }

      //TODO MAKE COMPANY ONLY
      const company = await this.companyRepository.findOne({
        where: { id: user.companyUserId },
        select: ['id', 'contractDetails'],
      });

      let contractInfo = company.contractDetails;

      contractInfo['isDocumentSigned'] = true;
      company.contractDetails = contractInfo;
      const updateCompany = await this.companyRepository.save(company);
      if (!updateCompany) {
        throw new HttpException(
          'Error updating document to signed',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'Document signed sucessfully!',
      };
    } catch (error) {
      throw new HttpException(
        'Error signing document. Method failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async makeEnvelope(contractDetails) {
    try {
      const dateOnly = moment().format('DD');
      const monthOnly = moment().format('MMM');
      const yearOnly = moment().format('YY');
      const customerFullName = docusign.Text.constructFromObject({
        tabLabel: 'customerFullName',
        locked: 'true',
        required: 'true',
        value:
          (contractDetails.customer && contractDetails.customer.fullName) || '',
      });
      const contactEmail = docusign.Text.constructFromObject({
        tabLabel: 'contactEmail',
        locked: 'true',
        required: 'true',
        value: contractDetails.contactEmail || '',
      });
      const streetAddress = docusign.Text.constructFromObject({
        tabLabel: 'streetAddress',
        locked: 'true',
        required: 'true',
        value:
          (contractDetails.address && contractDetails.address.street) || '',
      });
      const unitNumber = docusign.Text.constructFromObject({
        tabLabel: 'unitNumber',
        locked: 'true',
        required: 'true',
        value:
          (contractDetails.address && contractDetails.address.unitNumber) || '',
      });
      const city = docusign.Text.constructFromObject({
        tabLabel: 'city',
        locked: 'true',
        required: 'true',
        value: (contractDetails.address && contractDetails.address.city) || '',
      });
      const state = docusign.Text.constructFromObject({
        tabLabel: 'state',
        locked: 'true',
        required: 'true',
        value: (contractDetails.address && contractDetails.address.state) || '',
      });
      const zip = docusign.Text.constructFromObject({
        tabLabel: 'zip',
        locked: 'true',
        required: 'true',
        value: (contractDetails.address && contractDetails.address.zip) || '',
      });
      const phone = docusign.Text.constructFromObject({
        tabLabel: 'phone',
        locked: 'true',
        required: 'true',
        value: contractDetails.phone || '',
      });
      const email = docusign.Text.constructFromObject({
        tabLabel: 'email',
        locked: 'true',
        required: 'true',
        value: contractDetails.email || '',
      });
      const subscriptionFees = docusign.Text.constructFromObject({
        tabLabel: 'subscriptionFees',
        locked: 'true',
        required: 'true',
        value: contractDetails.subscriptionFees || '',
      });
      const implementationFess = docusign.Text.constructFromObject({
        tabLabel: 'implementationFess',
        locked: 'true',
        required: 'true',
        value: contractDetails.implementationFess || '',
      });
      const users = docusign.Text.constructFromObject({
        tabLabel: 'users',
        locked: 'true',
        required: 'true',
        value: contractDetails.users || '',
      });
      const ppu = docusign.Text.constructFromObject({
        tabLabel: 'ppu',
        locked: 'true',
        required: 'true',
        value: contractDetails.ppu || '',
      });
      const discount = docusign.Text.constructFromObject({
        tabLabel: 'discount',
        locked: 'true',
        required: 'true',
        value: (contractDetails.discount || '0') + '%',
      });
      const xiloRepFullName = docusign.Text.constructFromObject({
        tabLabel: 'xiloRepFullName',
        locked: 'true',
        required: 'true',
        value:
          (contractDetails.xiloRep && contractDetails.xiloRep.fullName) || '',
      });
      const xiloRepTittle = docusign.Text.constructFromObject({
        tabLabel: 'xiloRepTittle',
        locked: 'true',
        required: 'true',
        value: (contractDetails.xiloRep && contractDetails.xiloRep.title) || '',
      });
      const customerTitle = docusign.Text.constructFromObject({
        tabLabel: 'customerTitle',
        locked: 'true',
        required: 'true',
        value:
          (contractDetails.customer && contractDetails.customer.title) || '',
      });
      const day = docusign.Text.constructFromObject({
        tabLabel: 'day',
        locked: 'true',
        required: 'true',
        value: dateOnly || '',
      });
      const month = docusign.Text.constructFromObject({
        tabLabel: 'month',
        locked: 'true',
        required: 'true',
        value: monthOnly || '',
      });
      const year = docusign.Text.constructFromObject({
        tabLabel: 'year',
        locked: 'true',
        required: 'true',
        value: yearOnly || '',
      });
      const tabs = docusign.Tabs.constructFromObject({
        textTabs: [
          customerFullName,
          contactEmail,
          streetAddress,
          unitNumber,
          city,
          state,
          zip,
          phone,
          email,
          subscriptionFees,
          implementationFess,
          users,
          ppu,
          discount,
          xiloRepFullName,
          xiloRepTittle,
          customerTitle,
          day,
          month,
          year,
        ],
      });
      const signer = docusign.Signer.constructFromObject({
        email: contractDetails.email,
        name: contractDetails.customer.fullName,
        roleName: 'Customer',
        recipientId: '1',
        clientUserId: contractDetails.email,
        tabs: tabs,
      });

      const sender = docusign.Signer.constructFromObject({
        email: contractDetails.xiloRep.email,
        name: contractDetails.xiloRep.fullName || contractDetails.xiloRep.email,
        roleName: 'Corza Technologies Inc',
        recipientId: '2',
        tabs: tabs,
      });
      const recipientsServerTemplate = docusign.Recipients.constructFromObject({
        signers: [signer, sender],
      });
      // create a composite template for the Server Template
      const compTemplate = docusign.CompositeTemplate.constructFromObject({
        compositeTemplateId: '1',
        serverTemplates: [
          docusign.ServerTemplate.constructFromObject({
            sequence: '1',
            templateId: templateId,
          }),
        ],
        // Add the roles via an inlineTemplate
        inlineTemplates: [
          docusign.InlineTemplate.constructFromObject({
            sequence: '1',
            recipients: recipientsServerTemplate,
          }),
        ],
      });
      // The signer recipient for the added document with
      // a tab definition:
      const signHere = docusign.SignHere.constructFromObject({
        anchorString: '**signature_1**',
        anchorYOffset: '10',
        anchorUnits: 'pixels',
        anchorXOffset: '20',
      });
      const signerTabs = docusign.Tabs.constructFromObject({
        signHereTabs: [signHere],
      });
      // create the envelope definition
      const env = docusign.EnvelopeDefinition.constructFromObject({
        status: 'sent',
        subject: 'new Document',
        compositeTemplates: [compTemplate],
      });
      return env;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async makeRecipientViewRequest(args) {
    try {
      // Data for this method
      let viewRequest = new docusign.RecipientViewRequest();
      viewRequest.returnUrl = args.redirectUri || '';
      viewRequest.authenticationMethod = 'none';
      viewRequest.email = args.signerEmail;
      viewRequest.userName = args.signerName;
      viewRequest.Address = '';
      viewRequest.clientUserId = args.signerClientId;
      viewRequest.authenticationMethod = 'email';
      return viewRequest;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
