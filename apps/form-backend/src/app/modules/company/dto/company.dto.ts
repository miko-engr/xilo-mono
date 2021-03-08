import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsObject, IsArray } from 'class-validator';

export class CompanyDto  {
  @IsOptional() @IsNumber() @IsNotEmpty() id: number;
  @IsOptional() @IsNotEmpty() @IsString() createdAt: string;
  @IsOptional() @IsNotEmpty() @IsString() updatedAt: string;
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() slogan: string;
  @IsOptional() @IsString() contactNumber: string;
  @IsOptional() @IsString() contactEmail: string;
  @IsOptional() @IsString() mainLocation: string;
  @IsOptional() @IsString() logo: string;
  @IsOptional() @IsString() customerId: string;
  @IsOptional() @IsString() cardId: string;
  @IsOptional() @IsString() cardLast4: string;
  @IsOptional() @IsString() subscriptionId: string;
  @IsOptional() @IsBoolean() addedPayment: boolean;
  @IsOptional() @IsBoolean() hasActiveSubscription: boolean;
  @IsOptional() @IsString() companyId: string;
  @IsOptional() @IsString() companyWebsite: string;
  @IsOptional() @IsString() navbarBackgroundColorStart: string;
  @IsOptional() @IsString() navbarBackgroundColorEnd: string;
  @IsOptional() @IsString() navbarFontColor: string;
  @IsOptional() @IsString() emailText: string;
  @IsOptional() @IsString() navbarFont: string;
  @IsOptional() @IsString() facebookApiKey: string;
  @IsOptional() @IsString() klaviyoApiKey: string;
  @IsOptional() @IsBoolean() redirectCompany: boolean;
  @IsOptional() @IsString() redirectUrl: string;
  @IsOptional() @IsString() brandColor: string;
  @IsOptional() @IsBoolean() hasApplied: boolean;
  @IsOptional() @IsBoolean() hasAppliedEpic: boolean;
  @IsOptional() @IsBoolean() hasEzlynx: boolean;
  @IsOptional() @IsBoolean() pipedriveIntegration: boolean;
  @IsOptional() @IsString() pipedriveToken: string;
  @IsOptional() @IsString() pipedriveUrl: string;
  @IsOptional() @IsString() pipedriveStage: string;
  @IsOptional() @IsString() pipedriveStageId: string;
  @IsOptional() @IsString() pipedrivePipeline: string;
  @IsOptional() @IsString() pipedrivePipelineId: string;
  @IsOptional() @IsBoolean() fireFirstEmailAuto: boolean;
  @IsOptional() @IsBoolean() fireSecondEmailAuto: boolean;
  @IsOptional() @IsString() logoHeight: string;
  @IsOptional() @IsString() googleAdwordsCustomerId: string;
  @IsOptional() @IsString() googleAnalyticsViewId: string;
  @IsOptional() @IsString() googleApiAccessToken: string;
  @IsOptional() @IsString() googleApiRefreshToken: string;
  @IsOptional() @IsBoolean() hasSalesforce: boolean;
  @IsOptional() @IsString() salesforceU: string;
  @IsOptional() @IsString() salesforceP: string;
  @IsOptional() @IsString() accessToken: string;
  @IsOptional() @IsBoolean() hasGoogleConversions: boolean;
  @IsOptional() @IsString() headerText: string;
  @IsOptional() @IsString() subHeaderText: string;
  @IsOptional() @IsString() placeholderText: string;
  @IsOptional() @IsString() secondaryPlaceholderText: string;
  @IsOptional() @IsString() buttonText: string;
  @IsOptional() @IsString() ezlynxRqUid: string;
  @IsOptional() @IsBoolean() hasEzlynxIntegration: boolean;
  @IsOptional() @IsString() textNumber: string;
  @IsOptional() @IsBoolean() hasHawksoftIntegration: boolean;
  @IsOptional() @IsBoolean() hasHubspotIntegration: boolean;
  @IsOptional() @IsString() hubspotApiKey: string;
  @IsOptional() @IsBoolean() hasUsDotIntegration: boolean;
  @IsOptional() @IsString() qqU: string;
  @IsOptional() @IsString() qqP: string;
  @IsOptional() @IsBoolean() hasQqIntegration: boolean;
  @IsOptional() @IsBoolean() addedEzlynxDefaults: boolean;
  @IsOptional() @IsBoolean() addedHawksoftDefaults: boolean;
  @IsOptional() @IsNumber() ezlynxIntegrationId: number;
  @IsOptional() @IsNumber() hawksoftIntegrationId: number;
  @IsOptional() @IsNumber() salesforceIntegrationId: number;
  @IsOptional() @IsNumber() qqIntegrationId: number;
  @IsOptional() @IsNumber() raterIntegrationIds: number[];
  @IsOptional() @IsBoolean() showReport: boolean;
  @IsOptional() @IsBoolean() hasOwnNavbar: boolean;
  @IsOptional() @IsBoolean() hasPoweredByXilo: boolean;
  @IsOptional() @IsBoolean() hasCabrilloIntegration: boolean;
  @IsOptional() @IsBoolean() hasStyledEmails: boolean;
  @IsOptional() @IsBoolean() listClientDetailsOnEmail: boolean;
  @IsOptional() @IsBoolean() hasSalesAutomation: boolean;
  @IsOptional() @IsObject() emailConfig: object;
  @IsOptional() @IsObject() textConfig: object;
  @IsOptional() @IsString() infusionsoftApiAccessToken: string;
  @IsOptional() @IsString() infusionsoftApiRefreshToken: string;
  @IsOptional() @IsArray() tags;
  @IsOptional() @IsBoolean() hasTags: boolean;
  @IsOptional() @IsBoolean() hasNotes: boolean;
  @IsOptional() @IsBoolean() hasXanatekIntegration: boolean;
  @IsOptional() @IsString() xanatekAgencyId: string;
  @IsOptional() @IsObject() analyticsPreferences: object;
  @IsOptional() @IsBoolean() hasInfusionsoftIntegration: boolean;
  @IsOptional() @IsBoolean() hasGoogleEvents: boolean;
  @IsOptional() @IsString() googleAnalyticsId: string;
  @IsOptional() @IsBoolean() hasQuoteRushIntegration: boolean;
  @IsOptional() @IsNumber() quoteRushIntegrationId: number;
  @IsOptional() @IsBoolean() hasAgencyMatrixIntegration: boolean;
  @IsOptional() @IsBoolean() hasTurboraterIntegration: boolean;
  @IsOptional() @IsNumber() turboraterIntegrationId: number;
  @IsOptional() @IsBoolean() hasCarrierIntegrations: boolean;
  @IsOptional() @IsBoolean() hasNowCertsIntegration: boolean;
  @IsOptional() @IsNumber() nowCertsIntegrationId: number;
  @IsOptional() @IsBoolean() hasAppulateIntegration: boolean;
  @IsOptional() @IsBoolean() hasRicochet: boolean;
  @IsOptional() @IsBoolean() hasAgencySoftwareIntegration: boolean;
  @IsOptional() @IsString() streetNumber: string;
  @IsOptional() @IsString() streetName: string;
  @IsOptional() @IsString() streetAddress: string;
  @IsOptional() @IsString() city: string;
  @IsOptional() @IsString() state: string;
  @IsOptional() @IsString() zipCode: string;
  @IsOptional() @IsString() county: string;
  @IsOptional() @IsString() unit: string;
  @IsOptional() @IsString() fullAddress: string;
  @IsOptional() @IsString() producerNumber: string;
  @IsOptional() @IsString() mainProducer: string;
  @IsOptional() @IsNumber() cabrilloIntegrationId: number;
  @IsOptional() @IsBoolean() hasMyEvo: boolean;
  @IsOptional() @IsBoolean() hasCommercialEzlynxIntegration: boolean;
  @IsOptional() @IsNumber() commercialEzlynxIntegrationId: number;
  @IsOptional() @IsBoolean() hasAms360Integration: boolean;
  @IsOptional() @IsBoolean() hasWealthboxIntegration: boolean;
  @IsOptional() @IsString() division: string;
  @IsOptional() @IsString() department: string;
  @IsOptional() @IsString() branch: string;
  @IsOptional() @IsString() group: string;
  @IsOptional() @IsString() mainExecutiveCode: string;
  @IsOptional() @IsBoolean() hasPartnerXe: boolean;
  @IsOptional() taskTypes: string[];
  @IsOptional() @IsBoolean() hasTasks: boolean;
  @IsOptional() @IsBoolean() isActive: boolean;
  @IsOptional() @IsBoolean() hasGoogleIntegration: boolean;
  @IsOptional() @IsBoolean() hasOutlookIntegration: boolean;
  @IsOptional() @IsString() outlookAccessToken: string;
  @IsOptional() @IsString() outlookRefreshToken: string;
  @IsOptional() @IsBoolean() hasZapier: boolean;
  @IsOptional() @IsObject() contractDetails: object;
  @IsOptional() @IsString() accentColor: string;
  @IsOptional() @IsString() docusignAccessToken: string;
  @IsOptional() @IsString() docusignRefreshToken: string;
  @IsOptional() @IsBoolean() hasCronTrigger: boolean;
  @IsOptional() @IsObject() payment: object;
  @IsOptional() @IsBoolean() hasV2Integrations: boolean;
  @IsOptional() @IsString() brandSecondaryColor: string;
  @IsOptional() @IsBoolean() hasPlRater: boolean;
  @IsOptional() preselectedIntegrations: object[];
  @IsOptional() @IsString() gaCrossDomainUrl: string;
  @IsOptional() @IsBoolean() hasBetterAgency: boolean;
  @IsOptional() @IsObject() readonly decodedUser: object;
}
