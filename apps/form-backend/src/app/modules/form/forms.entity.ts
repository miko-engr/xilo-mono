import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agents } from '../agent/agent.entity';
import { Answers } from '../../entities/Answers';
import { FormAnalytics } from '../analyticsv2/FormAnalytics.entity';
import { DynamicRaters } from '../dynamic-rater/dynamic-raters.entity';
import { Integrations } from '../integration/Integrations.entity';
import { Pages } from '../page/page.entity';
import { Questions } from '../../entities/Questions';
import { Raters } from '../rater/raters.entity';
import { DynamicRates } from '../dynamic-rate/dynamic-rates.entity';
import { Companies } from '../company/company.entity';

@Entity('Forms', { schema: 'public' })
export class Forms {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'type',
    nullable: true,
    length: 255,
    default: () => null,
  })
  type: string | null;

  @Column('boolean', { name: 'isAuto', nullable: true, default: () => false })
  isAuto: boolean | null;

  @Column('boolean', { name: 'isHome', nullable: true, default: () => false })
  isHome: boolean | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'companyFormId', nullable: true })
  companyFormId: number | null;

  @Column('character varying', {
    name: 'title',
    nullable: true,
    length: 255,
    default: () => null,
  })
  title: string | null;

  @Column('boolean', {
    name: 'isDynamic',
    nullable: true,
    default: () => false,
  })
  isDynamic: boolean | null;

  @Column('boolean', {
    name: 'isTemplate',
    nullable: true,
    default: () => false,
  })
  isTemplate: boolean | null;

  @Column('boolean', {
    name: 'hasDRates',
    nullable: true,
    default: () => false,
  })
  hasDRates: boolean | null;

  @Column('boolean', {
    name: 'hasVendorRates',
    nullable: true,
    default: () => false,
  })
  hasVendorRates: boolean | null;

  @Column('boolean', {
    name: 'resultsIsEnabled',
    nullable: true,
    default: () => 'true',
  })
  resultsIsEnabled: boolean | null;

  @Column('boolean', {
    name: 'discountsIsEnabled',
    nullable: true,
    default: () => 'true',
  })
  discountsIsEnabled: boolean | null;

  @Column('character varying', {
    name: 'legal',
    nullable: true,
    default: () =>
      "As a part of our quoting process, our Service Providers will be verifying the information you have provided us today with consumer reports where permitted by law These reports may include information like your driving and credit history. The information produced from the reports will give us the ability to provide you with the most appropriate premium for your policy. XILO and affiliates make no guarantees regarding the quotes, fees, terms, rates, coverage or services offered or made available by Service Providers. XILO does not guarantee that quotes, coverage, rates or services offered by Service Providers or XILO are the best available. licensing, process or the certification and qualifications of Service Providers. The user has the given responsibility to investigate Service Providers. You understand and acknowledge that Service Providers are solely responsible for any products or services that they may provide to you. XILO' shall not be liable for any damages, cost, or claims in connection with, arising from or related to your use of a Service Providers products or services. XILO and affiliates urge you to obtain the advice of financial advisors, insurance agents, brokers or other qualified professionals who are fully aware of your individual circumstances before you make any insurance decision, contact our team to connect with a licensed agent. In no event or circumstance shall XILO be liable to you or any third party, whether in contract, warranty, tort, reliance, or otherwise, for any indirect, consequential, incidentall, special or punitive damages, including lost profit, arising from your use of the website, even if it has been advised of the possibility of such damages. Notwithstanding anything to the contrary contained herein. XILO also retains the right to capture and store any information input into the XILO website upon completion of any input.",
  })
  legal: string | null;

  @Column('character varying', {
    name: 'discountsProgressButtonText',
    nullable: true,
    length: 255,
    default: () => "'Show My Quotes'",
  })
  discountsProgressButtonText: string | null;

  @Column('boolean', { name: 'isSimpleForm', nullable: true })
  isSimpleForm: boolean | null;

  @Column('boolean', { name: 'isAutoHome', nullable: true })
  isAutoHome: boolean | null;

  @Column('character varying', {
    name: 'externalLink',
    nullable: true,
    length: 255,
  })
  externalLink: string | null;

  @Column('boolean', {
    name: 'hasDynamicStartPage',
    nullable: true,
    default: () => false,
  })
  hasDynamicStartPage: boolean | null;

  @Column('boolean', {
    name: 'hasFilterByState',
    nullable: true,
    default: () => false,
  })
  hasFilterByState: boolean | null;

  @Column('varchar', {
    name: 'states',
    nullable: true,
    array: true,
    default: () => [
      'AL',
      'AR',
      'AS',
      'AZ',
      'CA',
      'CO',
      'CT',
      'DC',
      'DE',
      'FL',
      'GA',
      'GU',
      'HI',
      'IA',
      'ID',
      'IL',
      'IN',
      'KS',
      'KY',
      'LA',
      'MA',
      'MD',
      'ME',
      'MI',
      'MN',
      'MO',
      'MS',
      'MT',
      'NC',
      'ND',
      'NE',
      'NH',
      'NJ',
      'NM',
      'NV',
      'NY',
      'OH',
      'OK',
      'OR',
      'PA',
      'PR',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VA',
      'VI',
      'VT',
      'WA',
      'WI',
      'WV',
      'WY',
    ],
  })
  states: string[] | null;

  @Column('boolean', {
    name: 'isCommercial',
    nullable: true,
    default: () => false,
  })
  isCommercial: boolean | null;

  @Column('varchar', { name: 'tags', nullable: true, array: true })
  tags: string[] | null;

  @Column('boolean', {
    name: 'hasFormTags',
    nullable: true,
    default: () => false,
  })
  hasFormTags: boolean | null;

  @Column('boolean', {
    name: 'hasDefaultAssignedAgent',
    nullable: true,
    default: () => false,
  })
  hasDefaultAssignedAgent: boolean | null;

  @Column('integer', { name: 'agentFormId', nullable: true })
  agentFormId: number | null;

  @Column('boolean', {
    name: 'listClientDetailsEmail',
    nullable: true,
    default: () => false,
  })
  listClientDetailsEmail: boolean | null;

  @Column('boolean', {
    name: 'styleEmail',
    nullable: true,
    default: () => 'true',
  })
  styleEmail: boolean | null;

  @Column('text', {
    name: 'finishedFormEmailText',
    nullable: true,
    default: () =>
      "Here's a review of all the information you have submitted. " +
      'We will be using this information to process your quote. \nIf any of this ' +
      'information is incorrect or missing, please respond to this email and we will ' +
      'make sure to update it!\n' +
      '\nWe look forward to working with you, an agent will be with you very shortly!',
  })
  finishedFormEmailText: string | null;

  @Column('boolean', {
    name: 'sendFinishedFormEmail',
    nullable: true,
    default: () => 'true',
  })
  sendFinishedFormEmail: boolean | null;

  @Column('character varying', { name: 'logo', nullable: true, length: 255 })
  logo: string | null;

  @Column('text', { name: 'icon', nullable: true })
  icon: string | null;

  @Column('boolean', {
    name: 'isEnabled',
    nullable: true,
    default: () => 'true',
  })
  isEnabled: boolean | null;

  @Column('boolean', {
    name: 'emailDefaultAgentOnly',
    nullable: true,
    default: () => false,
  })
  emailDefaultAgentOnly: boolean | null;

  @Column('character varying', {
    name: 'customerType',
    nullable: true,
    length: 255,
  })
  customerType: string | null;

  @Column('text', { name: 'customHtml', nullable: true })
  customHtml: string | null;

  @Column('boolean', {
    name: 'isFireOnComplete',
    nullable: true,
    default: () => false,
  })
  isFireOnComplete: boolean | null;

  @Column('varchar', { name: 'integrations', nullable: true, array: true })
  integrations: string[] | null;

  @Column('integer', { name: 'pdfId', nullable: true })
  pdfId: number | null;

  @Column('integer', { name: 'infusionsoftTagId', nullable: true })
  infusionsoftTagId: number | null;

  @Column('boolean', {
    name: 'hasRoundRobinAssignment',
    nullable: true,
    default: () => false,
  })
  hasRoundRobinAssignment: boolean | null;

  @Column('int', { name: 'roundRobinAgents', nullable: true, array: true })
  roundRobinAgents: number[] | null;

  @Column('boolean', { name: 'hasDownloadPdf', nullable: true })
  hasDownloadPdf: boolean | null;

  @Column('character varying', {
    name: 'companyPhone',
    nullable: true,
    length: 255,
  })
  companyPhone: string | null;

  @Column('character varying', {
    name: 'companyEmail',
    nullable: true,
    length: 255,
  })
  companyEmail: string | null;

  @Column('character varying', {
    name: 'companyName',
    nullable: true,
    length: 255,
  })
  companyName: string | null;

  @Column('character varying', {
    name: 'companyWebsite',
    nullable: true,
    length: 255,
  })
  companyWebsite: string | null;

  @Column('boolean', {
    name: 'hasNotificationPDFAttachment',
    nullable: true,
    default: () => false,
  })
  hasNotificationPdfAttachment: boolean | null;

  @Column('boolean', {
    name: 'isV2Form',
    nullable: true,
    default: () => false,
  })
  isV2Form: boolean | null;

  @OneToMany(() => Agents, (agents) => agents.agentForm)
  agents: Agents[];

  @OneToMany(() => Answers, (answers) => answers.formAnswer)
  answers: Answers[];

  @OneToMany(() => DynamicRates, (dynamicRates) => dynamicRates.formDynamicRate)
  dynamicRates: DynamicRates[];

  @OneToMany(
    () => FormAnalytics,
    (formAnalytics) => formAnalytics.form
  )
  formAnalytics: FormAnalytics[];

  @ManyToOne(() => DynamicRaters, (dynamicRaters) => dynamicRaters.forms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'dynamicRaterFormId', referencedColumnName: 'id' }])
  dynamicRaterForm: DynamicRaters;

  @OneToMany(() => Integrations, (integrations) => integrations.formIntegration)
  integrations2: Integrations[];

  @OneToMany(() => Pages, (pages) => pages.formPage)
  pages: Pages[];

  @OneToMany(() => Questions, (questions) => questions.formQuestion)
  Questions: Questions[];

  @OneToMany(() => Raters, (raters) => raters.formRater)
  raters: Raters[];

  @ManyToOne(() => Companies, (Companies) => Companies.forms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyFormId', referencedColumnName: 'id' }])
  company: Companies;
}
