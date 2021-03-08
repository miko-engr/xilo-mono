import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { DynamicParameters } from '../dynamic-parameter/dynamic-parameters.entity';
import { DynamicRateConditions } from '../dynamic-rate-condition/dynamic-rate-condition.entity';
import { Emails } from '../email/emails.entity';
import { Flows } from '../flow/flows.entity';
import { Homes } from '../home/homes.entity';
import { Partners } from '../../entities/Partners';
import { Pdfs } from '../pdf/pdfs.entity';
import { Policies } from '../../entities/Policies';
import { Raters } from '../rater/raters.entity';
import { Rates } from '../rate/Rates.entity';
import { Templates } from '../template/template.entity';
import { Tasks } from '../task/tasks.entity';
import { TextMessages } from '../text-messages/TextMessages.entity';
import { Agents } from '../agent/agent.entity';
import { Notes } from '../note/note.entity';
import { LifecycleAnalytics } from '../lifecycle-analytics/LifecycleAnalytics.entity';
import { Coverages } from '../coverage/coverages.entity';
import { Forms } from '../form/forms.entity';
import { Users } from '../user/user.entity';
import { Parameters } from '../parameter/Parameters.entity';
import { Clients } from '../client/client.entity';
@Entity('Companies')
export class Companies {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('character varying', { name: 'slogan', nullable: true, length: 255 })
  slogan: string | null;

  @Column('character varying', {
    name: 'contactNumber',
    nullable: true,
    length: 255,
  })
  contactNumber: string | null;

  @Column('character varying', {
    name: 'contactEmail',
    nullable: true,
    length: 255,
  })
  contactEmail: string | null;

  @Column('character varying', {
    name: 'mainLocation',
    nullable: true,
    length: 255,
  })
  mainLocation: string | null;

  @Column('character varying', { name: 'logo', nullable: true, length: 255 })
  logo: string | null;

  @Column('character varying', {
    name: 'customerId',
    nullable: true,
    length: 255,
  })
  customerId: string | null;

  @Column('character varying', { name: 'cardId', nullable: true, length: 255 })
  cardId: string | null;

  @Column('character varying', {
    name: 'cardLast4',
    nullable: true,
    length: 255,
  })
  cardLast4: string | null;

  @Column('character varying', {
    name: 'subscriptionId',
    nullable: true,
    length: 255,
  })
  subscriptionId: string | null;

  @Column('boolean', {
    name: 'addedPayment',
    nullable: true,
    default: () => 'false',
  })
  addedPayment: boolean | null;

  @Column('character varying', {
    name: 'companyId',
    nullable: true,
    length: 255,
  })
  companyId: string | null;

  @Column('character varying', {
    name: 'companyWebsite',
    nullable: true,
    length: 255,
  })
  companyWebsite: string | null;

  @Column('character varying', {
    name: 'navbarBackgroundColorStart',
    nullable: true,
    length: 255,
    default: () => '#111',
  })
  navbarBackgroundColorStart: string | null;

  @Column('character varying', {
    name: 'navbarBackgroundColorEnd',
    nullable: true,
    length: 255,
    default: () => '#636363',
  })
  navbarBackgroundColorEnd: string | null;

  @Column('character varying', {
    name: 'navbarFontColor',
    nullable: true,
    length: 255,
    default: () => '#fdfdfd',
  })
  navbarFontColor: string | null;

  @Column('text', {
    name: 'emailText',
    nullable: true,
    default: () =>
      "Here's a review of all the information you have submitted. " +
      'We will be using this information to process your quote. \nIf any of this ' +
      'information is incorrect or missing, please respond to this email and we will ' +
      'make sure to update it!\n' +
      '\nWe look forward to working with you, an agent will be with you very shortly!',
  })
  emailText: string | null;

  @Column('character varying', {
    name: 'navbarFont',
    nullable: true,
    length: 255,
    default: () => "'Comfortaa', cursive",
  })
  navbarFont: string | null;

  @Column('character varying', {
    name: 'facebookApiKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  facebookApiKey: string | null;

  @Column('character varying', {
    name: 'klaviyoApiKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  klaviyoApiKey: string | null;

  @Column('boolean', {
    name: 'redirectCompany',
    nullable: true,
    default: () => 'false',
  })
  redirectCompany: boolean | null;

  @Column('character varying', {
    name: 'redirectUrl',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  redirectUrl: string | null;

  @Column('character varying', {
    name: 'brandColor',
    nullable: true,
    length: 255,
    default: () => '#7C7FFF',
  })
  brandColor: string | null;

  @Column('boolean', {
    name: 'hasApplied',
    nullable: true,
    default: () => 'false',
  })
  hasApplied: boolean | null;

  @Column('boolean', {
    name: 'hasAppliedEpic',
    nullable: true,
    default: () => 'false',
  })
  hasAppliedEpic: boolean | null;

  @Column('boolean', {
    name: 'hasEzlynx',
    nullable: true,
    default: () => 'false',
  })
  hasEzlynx: boolean | null;

  @Column('boolean', {
    name: 'pipedriveIntegration',
    nullable: true,
    default: () => 'false',
  })
  pipedriveIntegration: boolean | null;

  @Column('character varying', {
    name: 'pipedriveToken',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedriveToken: string | null;

  @Column('character varying', {
    name: 'pipedriveUrl',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedriveUrl: string | null;

  @Column('character varying', {
    name: 'pipedriveStage',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedriveStage: string | null;

  @Column('character varying', {
    name: 'pipedriveStageId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedriveStageId: string | null;

  @Column('character varying', {
    name: 'pipedrivePipeline',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedrivePipeline: string | null;

  @Column('character varying', {
    name: 'pipedrivePipelineId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedrivePipelineId: string | null;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('boolean', {
    name: 'fireFirstEmailAuto',
    nullable: true,
    default: () => 'true',
  })
  fireFirstEmailAuto: boolean | null;

  @Column('boolean', {
    name: 'fireSecondEmailAuto',
    nullable: true,
    default: () => 'false',
  })
  fireSecondEmailAuto: boolean | null;

  @Column('character varying', {
    name: 'logoHeight',
    nullable: true,
    length: 255,
    default: () => '45px',
  })
  logoHeight: string | null;

  @Column('character varying', {
    name: 'googleAdwordsCustomerId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  googleAdwordsCustomerId: string | null;

  @Column('character varying', {
    name: 'googleAnalyticsViewId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  googleAnalyticsViewId: string | null;

  @Column('character varying', {
    name: 'googleApiAccessToken',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  googleApiAccessToken: string | null;

  @Column('character varying', {
    name: 'googleApiRefreshToken',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  googleApiRefreshToken: string | null;

  @Column('boolean', {
    name: 'hasActiveSubscription',
    nullable: true,
    default: () => 'false',
  })
  hasActiveSubscription: boolean | null;

  @Column('boolean', {
    name: 'hasSalesforce',
    nullable: true,
    default: () => 'false',
  })
  hasSalesforce: boolean | null;

  @Column('character varying', {
    name: 'salesforceU',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  salesforceU: string | null;

  @Column('character varying', {
    name: 'salesforceP',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  salesforceP: string | null;

  @Column('character varying', {
    name: 'accessToken',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  accessToken: string | null;

  @Column('boolean', {
    name: 'hasGoogleConversions',
    nullable: true,
    default: () => 'false',
  })
  hasGoogleConversions: boolean | null;

  @Column('character varying', {
    name: 'headerText',
    nullable: true,
    length: 255,
    default: () => 'What is your zip code?',
  })
  headerText: string | null;

  @Column('character varying', {
    name: 'subHeaderText',
    nullable: true,
    length: 255,
    default: () => 'Enter in your zip code to start your free quote!',
  })
  subHeaderText: string | null;

  @Column('character varying', {
    name: 'placeholderText',
    nullable: true,
    length: 255,
    default: () => 'Enter your zip here',
  })
  placeholderText: string | null;

  @Column('character varying', {
    name: 'secondaryPlaceholderText',
    nullable: true,
    length: 255,
    default: () => 'Zip Code',
  })
  secondaryPlaceholderText: string | null;

  @Column('character varying', {
    name: 'buttonText',
    nullable: true,
    length: 255,
    default: () => 'Start Quote',
  })
  buttonText: string | null;

  @Column('character varying', {
    name: 'ezlynxRqUid',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  ezlynxRqUid: string | null;

  @Column('boolean', {
    name: 'hasEzlynxIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasEzlynxIntegration: boolean | null;

  @Column('character varying', {
    name: 'textNumber',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  textNumber: string | null;

  @Column('boolean', {
    name: 'hasHawksoftIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasHawksoftIntegration: boolean | null;

  @Column('boolean', {
    name: 'hasHubspotIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasHubspotIntegration: boolean | null;

  @Column('character varying', {
    name: 'hubspotApiKey',
    nullable: true,
    length: 255,
    default: () => 'false',
  })
  hubspotApiKey: string | null;

  @Column('boolean', {
    name: 'hasUSDotIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasUsDotIntegration: boolean | null;

  @Column('character varying', {
    name: 'qqU',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  qqU: string | null;

  @Column('character varying', {
    name: 'qqP',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  qqP: string | null;

  @Column('boolean', {
    name: 'hasQQIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasQqIntegration: boolean | null;

  @Column('boolean', {
    name: 'addedEzlynxDefaults',
    nullable: true,
    default: () => 'false',
  })
  addedEzlynxDefaults: boolean | null;

  @Column('boolean', {
    name: 'addedHawksoftDefaults',
    nullable: true,
    default: () => 'false',
  })
  addedHawksoftDefaults: boolean | null;

  @Column('integer', { name: 'ezlynxIntegrationId', nullable: true })
  ezlynxIntegrationId: number | null;

  @Column('integer', { name: 'hawksoftIntegrationId', nullable: true })
  hawksoftIntegrationId: number | null;

  @Column('integer', { name: 'salesforceIntegrationId', nullable: true })
  salesforceIntegrationId: number | null;

  @Column('integer', { name: 'qqIntegrationId', nullable: true })
  qqIntegrationId: number | null;

  @Column('int4', { name: 'raterIntegrationIds', nullable: true, array: true })
  raterIntegrationIds: number[] | null;

  @Column('boolean', {
    name: 'showReport',
    nullable: true,
    default: () => 'true',
  })
  showReport: boolean | null;

  @Column('boolean', {
    name: 'hasOwnNavbar',
    nullable: true,
    default: () => 'false',
  })
  hasOwnNavbar: boolean | null;

  @Column('boolean', {
    name: 'hasPoweredByXilo',
    nullable: true,
    default: () => 'true',
  })
  hasPoweredByXilo: boolean | null;

  @Column('boolean', {
    name: 'hasCabrilloIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasCabrilloIntegration: boolean | null;

  @Column('boolean', {
    name: 'hasStyledEmails',
    nullable: true,
    default: () => 'true',
  })
  hasStyledEmails: boolean | null;

  @Column('boolean', {
    name: 'listClientDetailsOnEmail',
    nullable: true,
    default: () => 'false',
  })
  listClientDetailsOnEmail: boolean | null;

  @Column('boolean', {
    name: 'hasSalesAutomation',
    nullable: true,
    default: () => 'false',
  })
  hasSalesAutomation: boolean | null;

  @Column('json', { name: 'emailConfig', nullable: true })
  emailConfig: object | null;

  @Column('json', { name: 'textConfig', nullable: true })
  textConfig: object | null;

  @Column('character varying', {
    name: 'infusionsoftApiAccessToken',
    nullable: true,
    length: 255,
  })
  infusionsoftApiAccessToken: string | null;

  @Column('character varying', {
    name: 'infusionsoftApiRefreshToken',
    nullable: true,
    length: 255,
  })
  infusionsoftApiRefreshToken: string | null;

  @Column('varchar', { name: 'tags', nullable: true, array: true })
  tags: string[] | null;

  @Column('boolean', {
    name: 'hasTags',
    nullable: true,
    default: () => 'false',
  })
  hasTags: boolean | null;

  @Column('boolean', {
    name: 'hasNotes',
    nullable: true,
    default: () => 'false',
  })
  hasNotes: boolean | null;

  @Column('boolean', {
    name: 'hasXanatekIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasXanatekIntegration: boolean | null;

  @Column('character varying', {
    name: 'xanatekAgencyId',
    nullable: true,
    length: 255,
  })
  xanatekAgencyId: string | null;

  @Column('json', { name: 'analyticsPreferences', nullable: true })
  analyticsPreferences: object | null;

  @Column('boolean', {
    name: 'hasInfusionsoftIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasInfusionsoftIntegration: boolean | null;

  @Column('boolean', {
    name: 'hasGoogleEvents',
    nullable: true,
    default: () => 'false',
  })
  hasGoogleEvents: boolean | null;

  @Column('character varying', {
    name: 'googleAnalyticsId',
    nullable: true,
    length: 255,
  })
  googleAnalyticsId: string | null;

  @Column('boolean', {
    name: 'hasQuoteRushIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasQuoteRushIntegration: boolean | null;

  @Column('integer', { name: 'quoteRushIntegrationId', nullable: true })
  quoteRushIntegrationId: number | null;

  @Column('boolean', {
    name: 'hasAgencyMatrixIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasAgencyMatrixIntegration: boolean | null;

  @Column('boolean', {
    name: 'hasTurboraterIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasTurboraterIntegration: boolean | null;

  @Column('integer', { name: 'turboraterIntegrationId', nullable: true })
  turboraterIntegrationId: number | null;

  @Column('boolean', {
    name: 'hasCarrierIntegrations',
    nullable: true,
    default: () => 'false',
  })
  hasCarrierIntegrations: boolean | null;

  @Column('boolean', {
    name: 'hasNowCertsIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasNowCertsIntegration: boolean | null;

  @Column('integer', { name: 'nowCertsIntegrationId', nullable: true })
  nowCertsIntegrationId: number | null;

  @Column('boolean', {
    name: 'hasAppulateIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasAppulateIntegration: boolean | null;

  @Column('boolean', {
    name: 'hasRicochet',
    nullable: true,
    default: () => 'false',
  })
  hasRicochet: boolean | null;

  @Column('boolean', {
    name: 'hasAgencySoftwareIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasAgencySoftwareIntegration: boolean | null;

  @Column('character varying', {
    name: 'streetNumber',
    nullable: true,
    length: 255,
  })
  streetNumber: string | null;

  @Column('character varying', {
    name: 'streetName',
    nullable: true,
    length: 255,
  })
  streetName: string | null;

  @Column('character varying', {
    name: 'streetAddress',
    nullable: true,
    length: 255,
  })
  streetAddress: string | null;

  @Column('character varying', { name: 'city', nullable: true, length: 255 })
  city: string | null;

  @Column('character varying', { name: 'state', nullable: true, length: 255 })
  state: string | null;

  @Column('character varying', { name: 'zipCode', nullable: true, length: 255 })
  zipCode: string | null;

  @Column('character varying', { name: 'county', nullable: true, length: 255 })
  county: string | null;

  @Column('character varying', { name: 'unit', nullable: true, length: 255 })
  unit: string | null;

  @Column('character varying', {
    name: 'fullAddress',
    nullable: true,
    length: 255,
  })
  fullAddress: string | null;

  @Column('character varying', {
    name: 'producerNumber',
    nullable: true,
    length: 255,
  })
  producerNumber: string | null;

  @Column('character varying', {
    name: 'mainProducer',
    nullable: true,
    length: 255,
  })
  mainProducer: string | null;

  @Column('integer', { name: 'cabrilloIntegrationId', nullable: true })
  cabrilloIntegrationId: number | null;

  @Column('boolean', {
    name: 'hasMyEvo',
    nullable: true,
    default: () => 'false',
  })
  hasMyEvo: boolean | null;

  @Column('boolean', {
    name: 'hasCommercialEzlynxIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasCommercialEzlynxIntegration: boolean | null;

  @Column('integer', { name: 'commercialEzlynxIntegrationId', nullable: true })
  commercialEzlynxIntegrationId: number | null;

  @Column('boolean', {
    name: 'hasAMS360Integration',
    nullable: true,
    default: () => 'false',
  })
  hasAms360Integration: boolean | null;

  @Column('boolean', {
    name: 'hasWealthboxIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasWealthboxIntegration: boolean | null;

  @Column('character varying', {
    name: 'division',
    nullable: true,
    length: 255,
  })
  division: string | null;

  @Column('character varying', {
    name: 'department',
    nullable: true,
    length: 255,
  })
  department: string | null;

  @Column('character varying', { name: 'branch', nullable: true, length: 255 })
  branch: string | null;

  @Column('character varying', { name: 'group', nullable: true, length: 255 })
  group: string | null;

  @Column('character varying', {
    name: 'mainExecutiveCode',
    nullable: true,
    length: 255,
  })
  mainExecutiveCode: string | null;

  @Column('boolean', {
    name: 'hasPartnerXE',
    nullable: true,
    default: () => 'false',
  })
  hasPartnerXe: boolean | null;

  @Column('varchar', {
    name: 'taskTypes',
    nullable: true,
    array: true,
    default: () => 'NULL::character varying[]',
  })
  taskTypes: string[] | null;

  @Column('boolean', {
    name: 'hasTasks',
    nullable: true,
    default: () => 'false',
  })
  hasTasks: boolean | null;

  @Column('boolean', {
    name: 'isActive',
    nullable: true,
    default: () => 'true',
  })
  isActive: boolean | null;

  @Column('boolean', {
    name: 'hasGoogleIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasGoogleIntegration: boolean | null;

  @Column('boolean', {
    name: 'hasOutlookIntegration',
    nullable: true,
    default: () => 'false',
  })
  hasOutlookIntegration: boolean | null;

  @Column('character varying', {
    name: 'outlookAccessToken',
    nullable: true,
    length: 255,
    default: () => 'false',
  })
  outlookAccessToken: string | null;

  @Column('character varying', {
    name: 'outlookRefreshToken',
    nullable: true,
    length: 255,
    default: () => 'false',
  })
  outlookRefreshToken: string | null;

  @Column('boolean', { name: 'hasZapier', nullable: true })
  hasZapier: boolean | null;

  @Column('json', { name: 'contractDetails', nullable: true })
  contractDetails: object | null;

  @Column('character varying', {
    name: 'accentColor',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  accentColor: string | null;

  @Column('character varying', {
    name: 'docusignAccessToken',
    nullable: true,
    length: 4096,
  })
  docusignAccessToken: string | null;

  @Column('character varying', {
    name: 'docusignRefreshToken',
    nullable: true,
    length: 4096,
  })
  docusignRefreshToken: string | null;

  @Column('boolean', {
    name: 'hasCronTrigger',
    nullable: true,
    default: () => 'false',
  })
  hasCronTrigger: boolean | null;

  @Column('json', { name: 'payment', nullable: true })
  payment: object | null;

  @Column('boolean', {
    name: 'hasV2Integrations',
    nullable: true,
    default: () => 'false',
  })
  hasV2Integrations: boolean | null;

  @Column('character varying', {
    name: 'brandSecondaryColor',
    nullable: true,
    length: 255,
  })
  brandSecondaryColor: string | null;

  @Column('boolean', {
    name: 'hasPLRater',
    nullable: true,
    default: () => 'false',
  })
  hasPlRater: boolean | null;

  @Column('json', {
    name: 'preselectedIntegrations',
    nullable: true,
    array: true,
  })
  preselectedIntegrations: object[] | null;

  @Column('character varying', {
    name: 'gaCrossDomainURL',
    nullable: true,
    length: 255,
  })
  gaCrossDomainUrl: string | null;

  @Column('boolean', {
    name: 'hasBetterAgency',
    nullable: true,
    default: () => 'false',
  })
  hasBetterAgency: boolean | null;

  @OneToMany(
    () => DynamicParameters,
    (dynamicParameters) => dynamicParameters.companyDynamicParameter
  )
  dynamicParameters: DynamicParameters[];

  @OneToMany(
    () => DynamicRateConditions,
    (dynamicRateConditions) => dynamicRateConditions.company
  )
  dynamicRateConditions: DynamicRateConditions[];

  @OneToMany(() => Clients, (clients) => clients.companies)
  clients: Clients[];

  @OneToMany(() => Emails, (emails) => emails.companyEmail)
  emails: Emails[];

  @OneToMany(() => Flows, (flows) => flows.companyFlow)
  flows: Flows[];

  @OneToMany(() => Homes, (homes) => homes.company)
  homes: Homes[];

  @OneToMany(() => Partners, (partners) => partners.companyPartner)
  partners: Partners[];

  @OneToMany(() => Pdfs, (pdfs) => pdfs.company)
  pdfs: Pdfs[];

  @OneToMany(() => Policies, (policies) => policies.companyPolicy)
  policies: Policies[];

  @OneToMany(() => Raters, (raters) => raters.companyRater)
  raters: Raters[];

  @OneToMany(() => Rates, (rates) => rates.companyRate)
  rates: Rates[];

  @OneToMany(() => Tasks, (tasks) => tasks.company)
  tasks: Tasks[];

  @OneToMany(() => Templates, (templates) => templates.companyTemplate)
  templates: Templates[];

  @OneToMany(
    () => TextMessages,
    (textMessages) => textMessages.companyTextMessage
  )
  textMessages: TextMessages[];

  @OneToMany(() => Forms, (forms) => forms.company)
  forms: Forms[];

  @OneToMany(() => Coverages, (coverages) => coverages.company)
  coverages: Coverages[];

  @OneToMany(() => Users, (User) => User.company)
  users: Users[];

  @OneToMany(() => Agents, (agents) => agents.companies)
  agents: Agents[];

  @OneToMany(() => Lifecycles, (lifecycles) => lifecycles.companies)
  Lifecycles: Lifecycles[];

  @OneToMany(
    () => LifecycleAnalytics,
    (lifecycleAnalytics) => lifecycleAnalytics.companies
  )
  lifecycleAnalytics: LifecycleAnalytics[];

  @OneToMany(() => Notes, (notes) => notes.companyNote)
  notes: Notes[];

  @OneToMany(() => Parameters, (parametes) => parametes.companyParameter)
  parameters: Parameters[];
}
