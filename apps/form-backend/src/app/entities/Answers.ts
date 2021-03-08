import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Forms } from '../modules/form/forms.entity';
import { Pages } from '../modules/page/page.entity';
import { Questions } from './Questions';
import { Conditions } from '../modules/condition/conditions.entity';
import { DynamicParameters } from '../modules/dynamic-parameter/dynamic-parameters.entity';
import { DynamicRateConditions } from '../modules/dynamic-rate-condition/dynamic-rate-condition.entity';
import { Integrations } from '../modules/integration/Integrations.entity';
import { Parameters } from '../modules/parameter/Parameters.entity';

@Index('Answers_pkey', ['id'], { unique: true })
@Entity('Answers', { schema: 'public' })
export class Answers {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('boolean', {
    name: 'isInput',
    nullable: true,
    default: () => 'false',
  })
  isInput: boolean | null;

  @Column('boolean', {
    name: 'isSelect',
    nullable: true,
    default: () => 'false',
  })
  isSelect: boolean | null;

  @Column('boolean', {
    name: 'isNativeSelect',
    nullable: true,
    default: () => 'false',
  })
  isNativeSelect: boolean | null;

  @Column('boolean', {
    name: 'isDatePicker',
    nullable: true,
    default: () => 'false',
  })
  isDatePicker: boolean | null;

  @Column('boolean', {
    name: 'isMobileDatePicker',
    nullable: true,
    default: () => 'false',
  })
  isMobileDatePicker: boolean | null;

  @Column('boolean', {
    name: 'isButton',
    nullable: true,
    default: () => 'false',
  })
  isButton: boolean | null;

  @Column('boolean', {
    name: 'isTextarea',
    nullable: true,
    default: () => 'false',
  })
  isTextarea: boolean | null;

  @Column('boolean', {
    name: 'isRequired',
    nullable: true,
    default: () => 'false',
  })
  isRequired: boolean | null;

  @Column('boolean', {
    name: 'hasSuffix',
    nullable: true,
    default: () => 'false',
  })
  hasSuffix: boolean | null;

  @Column('boolean', {
    name: 'hasPrefix',
    nullable: true,
    default: () => 'false',
  })
  hasPrefix: boolean | null;

  @Column('character varying', {
    name: 'suffixText',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  suffixText: string | null;

  @Column('character varying', {
    name: 'prefixText',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  prefixText: string | null;

  @Column('boolean', {
    name: 'hasSecondaryPlaceholder',
    nullable: true,
    default: () => 'false',
  })
  hasSecondaryPlaceholder: boolean | null;

  @Column('character varying', {
    name: 'placeholderText',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  placeholderText: string | null;

  @Column('character varying', {
    name: 'secondaryPlaceholderText',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  secondaryPlaceholderText: string | null;

  @Column('character varying', {
    name: 'propertyValue',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  propertyValue: string | null;

  @Column('character varying', {
    name: 'propertyKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  propertyKey: string | null;

  @Column('character varying', {
    name: 'displayValue',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  displayValue: string | null;

  @Column('character varying', {
    name: 'startDate',
    nullable: true,
    length: 255,
    default: () =>
      "'Fri Nov 15 2019 03:49:40 GMT+0000 (Coordinated Universal Time)'",
  })
  startDate: string | null;

  @Column('character varying', {
    name: 'width',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  width: string | null;

  @Column('integer', { name: 'position', nullable: true })
  position: number | null;

  @Column('boolean', {
    name: 'hasCustomHtml',
    nullable: true,
    default: () => 'false',
  })
  hasCustomHtml: boolean | null;

  @Column('text', { name: 'customAnswerHtml', nullable: true })
  customAnswerHtml: string | null;

  @Column('boolean', {
    name: 'fireNewLead',
    nullable: true,
    default: () => 'false',
  })
  fireNewLead: boolean | null;

  @Column('boolean', {
    name: 'isVehicleVIN',
    nullable: true,
    default: () => 'false',
  })
  isVehicleVin: boolean | null;

  @Column('boolean', {
    name: 'isVehicleYear',
    nullable: true,
    default: () => 'false',
  })
  isVehicleYear: boolean | null;

  @Column('boolean', {
    name: 'isVehicleMakeModel',
    nullable: true,
    default: () => 'false',
  })
  isVehicleMakeModel: boolean | null;

  @Column('boolean', {
    name: 'isAddressSearch',
    nullable: true,
    default: () => 'false',
  })
  isAddressSearch: boolean | null;

  @Column('boolean', {
    name: 'hasInformationIcon',
    nullable: true,
    default: () => 'false',
  })
  hasInformationIcon: boolean | null;

  @Column('character varying', {
    name: 'informationIconText',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  informationIconText: string | null;

  @Column('boolean', {
    name: 'isConditional',
    nullable: true,
    default: () => 'false',
  })
  isConditional: boolean | null;

  @Column('character varying', {
    name: 'conditionValue',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  conditionValue: string | null;

  @Column('varchar', {
    name: 'options',
    nullable: true,
    array: true,
    default: () => '(ARRAY[]::character varying[])::character varying(255)[]',
  })
  options: string[] | null;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'companyAnswerId', nullable: true })
  companyAnswerId: number | null;

  @Column('boolean', {
    name: 'isPrevNextButtons',
    nullable: true,
    default: () => 'false',
  })
  isPrevNextButtons: boolean | null;

  @Column('boolean', { name: 'isConditionParent', nullable: true })
  isConditionParent: boolean | null;

  @Column('character varying', {
    name: 'conditionKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  conditionKey: string | null;

  @Column('boolean', { name: 'isAddVehicle', nullable: true })
  isAddVehicle: boolean | null;

  @Column('boolean', { name: 'isAddDriver', nullable: true })
  isAddDriver: boolean | null;

  @Column('varchar', {
    name: 'conditionKeys',
    nullable: true,
    array: true,
    default: () => '(ARRAY[]::character varying[])::character varying(255)[]',
  })
  conditionKeys: string[] | null;

  @Column('character varying', {
    name: 'errorText',
    nullable: true,
    length: 255,
    default: () => "'Answer Is Required'",
  })
  errorText: string | null;

  @Column('boolean', {
    name: 'isAgeInput',
    nullable: true,
    default: () => 'false',
  })
  isAgeInput: boolean | null;

  @Column('boolean', {
    name: 'isViolationTracker',
    nullable: true,
    default: () => 'false',
  })
  isViolationTracker: boolean | null;

  @Column('boolean', {
    name: 'isAutocomplete',
    nullable: true,
    default: () => 'false',
  })
  isAutocomplete: boolean | null;

  @Column('boolean', {
    name: 'isProgressButton',
    nullable: true,
    default: () => 'false',
  })
  isProgressButton: boolean | null;

  @Column('boolean', {
    name: 'isCheckbox',
    nullable: true,
    default: () => 'false',
  })
  isCheckbox: boolean | null;

  @Column('character varying', {
    name: 'dateStartView',
    nullable: true,
    length: 255,
    default: () => "'multi-year'",
  })
  dateStartView: string | null;

  @Column('boolean', {
    name: 'hasFilter',
    nullable: true,
    default: () => 'false',
  })
  hasFilter: boolean | null;

  @Column('character varying', {
    name: 'filterCondition',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  filterCondition: string | null;

  @Column('character varying', {
    name: 'conditionAnswerId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  conditionAnswerId: string | null;

  @Column('boolean', {
    name: 'isSquareFootage',
    nullable: true,
    default: () => 'false',
  })
  isSquareFootage: boolean | null;

  @Column('boolean', {
    name: 'isHomeFinishings',
    nullable: true,
    default: () => 'false',
  })
  isHomeFinishings: boolean | null;

  @Column('character varying', {
    name: 'usDotKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  usDotKey: string | null;

  @Column('character varying', {
    name: 'hawksoftKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  hawksoftKey: string | null;

  @Column('boolean', {
    name: 'isFirstName',
    nullable: true,
    default: () => 'false',
  })
  isFirstName: boolean | null;

  @Column('boolean', {
    name: 'isLastName',
    nullable: true,
    default: () => 'false',
  })
  isLastName: boolean | null;

  @Column('boolean', {
    name: 'isEmail',
    nullable: true,
    default: () => 'false',
  })
  isEmail: boolean | null;

  @Column('boolean', {
    name: 'isPhone',
    nullable: true,
    default: () => 'false',
  })
  isPhone: boolean | null;

  @Column('character varying', {
    name: 'sfObjectName',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  sfObjectName: string | null;

  @Column('character varying', {
    name: 'sfPropertyCustomField',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  sfPropertyCustomField: string | null;

  @Column('character varying', {
    name: 'ezlynxKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  ezlynxKey: string | null;

  @Column('character varying', {
    name: 'qqKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  qqKey: string | null;

  @Column('boolean', {
    name: 'isClient',
    nullable: true,
    default: () => 'false',
  })
  isClient: boolean | null;

  @Column('boolean', {
    name: 'getRate',
    nullable: true,
    default: () => 'false',
  })
  getRate: boolean | null;

  @Column('boolean', {
    name: 'isSpacer',
    nullable: true,
    default: () => 'false',
  })
  isSpacer: boolean | null;

  @Column('character varying', {
    name: 'defaultValue',
    nullable: true,
    length: 255,
  })
  defaultValue: string | null;

  @Column('boolean', { name: 'isText', nullable: true, default: () => 'false' })
  isText: boolean | null;

  @Column('boolean', {
    name: 'isVehicleMake',
    nullable: true,
    default: () => 'false',
  })
  isVehicleMake: boolean | null;

  @Column('boolean', {
    name: 'isVehicleModel',
    nullable: true,
    default: () => 'false',
  })
  isVehicleModel: boolean | null;

  @Column('boolean', {
    name: 'isVehicleBodyStyle',
    nullable: true,
    default: () => 'false',
  })
  isVehicleBodyStyle: boolean | null;

  @Column('character varying', { name: 'object', nullable: true, length: 255 })
  object: string | null;

  @Column('boolean', {
    name: 'isSecureDocumentUpload',
    nullable: true,
    default: () => 'false',
  })
  isSecureDocumentUpload: boolean | null;

  @Column('boolean', {
    name: 'isStartPageInput',
    nullable: true,
    default: () => 'false',
  })
  isStartPageInput: boolean | null;

  @Column('boolean', { name: 'isLink', nullable: true, default: () => 'false' })
  isLink: boolean | null;

  @Column('character varying', {
    name: 'externalLink',
    nullable: true,
    length: 255,
  })
  externalLink: string | null;

  @Column('boolean', {
    name: 'getHomeData',
    nullable: true,
    default: () => 'false',
  })
  getHomeData: boolean | null;

  @Column('boolean', {
    name: 'getUSDotData',
    nullable: true,
    default: () => 'false',
  })
  getUsDotData: boolean | null;

  @Column('character varying', {
    name: 'objectName',
    nullable: true,
    length: 255,
  })
  objectName: string | null;

  @Column('character varying', {
    name: 'style',
    nullable: true,
    length: 255,
    default: () => "'standard'",
  })
  style: string | null;

  @Column('boolean', {
    name: 'isMultipleSelect',
    nullable: true,
    default: () => 'false',
  })
  isMultipleSelect: boolean | null;

  @Column('boolean', {
    name: 'fireFinishedFormEmail',
    nullable: true,
    default: () => 'false',
  })
  fireFinishedFormEmail: boolean | null;

  @Column('boolean', {
    name: 'isHiddenInput',
    nullable: true,
    default: () => 'false',
  })
  isHiddenInput: boolean | null;

  @Column('boolean', {
    name: 'isAddLocation',
    nullable: true,
    default: () => 'false',
  })
  isAddLocation: boolean | null;

  @Column('boolean', {
    name: 'isAddInsuranceCoverages',
    nullable: true,
    default: () => 'false',
  })
  isAddInsuranceCoverages: boolean | null;

  @Column('varchar', { name: 'columns', nullable: true, array: true })
  columns: string[] | null;

  @Column('boolean', {
    name: 'isTemplate',
    nullable: true,
    default: () => 'false',
  })
  isTemplate: boolean | null;

  @Column('character varying', {
    name: 'templateCategory',
    nullable: true,
    length: 255,
  })
  templateCategory: string | null;

  @Column('character varying', {
    name: 'templateTitle',
    nullable: true,
    length: 255,
  })
  templateTitle: string | null;

  @Column('boolean', {
    name: 'isAddHome',
    nullable: true,
    default: () => 'false',
  })
  isAddHome: boolean | null;

  @Column('boolean', {
    name: 'isPasswordInput',
    nullable: true,
    default: () => 'false',
  })
  isPasswordInput: boolean | null;

  @Column('boolean', { name: 'isCard', nullable: true, default: () => 'false' })
  isCard: boolean | null;

  @Column('text', { name: 'icon', nullable: true })
  icon: string | null;

  @Column('character varying', {
    name: 'headerText',
    nullable: true,
    length: 255,
  })
  headerText: string | null;

  @Column('character varying', {
    name: 'transformResponse',
    nullable: true,
    length: 255,
  })
  transformResponse: string | null;

  @Column('character varying', {
    name: 'validationType',
    nullable: true,
    length: 255,
  })
  validationType: string | null;

  @Column('boolean', {
    name: 'isSelectObject',
    nullable: true,
    default: () => 'false',
  })
  isSelectObject: boolean | null;

  @Column('character varying', {
    name: 'selectObjectName',
    nullable: true,
    length: 255,
  })
  selectObjectName: string | null;

  @Column('boolean', {
    name: 'isAddIncident',
    nullable: true,
    default: () => 'false',
  })
  isAddIncident: boolean | null;

  @Column('boolean', {
    name: 'isAddRecreationalVehicle',
    nullable: true,
    default: () => 'false',
  })
  isAddRecreationalVehicle: boolean | null;

  @Column('varchar', { name: 'filters', nullable: true, array: true })
  filters: string[] | null;

  @Column('character varying', {
    name: 'labelPosition',
    nullable: true,
    length: 255,
  })
  labelPosition: string | null;

  @Column('boolean', {
    name: 'isLoginWithFacebook',
    nullable: true,
    default: () => 'false',
  })
  isLoginWithFacebook: boolean | null;

  @Column('boolean', {
    name: 'isLoginWithGoogle',
    nullable: true,
    default: () => 'false',
  })
  isLoginWithGoogle: boolean | null;

  @Column('boolean', {
    name: 'stopTransition',
    nullable: true,
    default: () => 'false',
  })
  stopTransition: boolean | null;

  @Column('boolean', {
    name: 'isAddPolicy',
    nullable: true,
    default: () => 'false',
  })
  isAddPolicy: boolean | null;

  @Column('boolean', {
    name: 'isOccupation',
    nullable: true,
    default: () => 'false',
  })
  isOccupation: boolean | null;

  @Column('boolean', {
    name: 'isIndustry',
    nullable: true,
    default: () => 'false',
  })
  isIndustry: boolean | null;

  @Column('json', { name: 'validations', nullable: true, array: true })
  validations: object[] | null;

  @Column('json', { name: 'labeledSelectOptions', nullable: true, array: true })
  labeledSelectOptions: object[] | null;

  @Column('boolean', {
    name: 'hasLabeledSelectOptions',
    nullable: true,
    default: () => 'false',
  })
  hasLabeledSelectOptions: boolean | null;

  @Column('boolean', {
    name: 'hasLabeledSelectOptionsSearch',
    nullable: true,
    default: () => 'false',
  })
  hasLabeledSelectOptionsSearch: boolean | null;

  @Column('boolean', {
    name: 'hasEducationalDropdown',
    nullable: true,
    default: () => 'false',
  })
  hasEducationalDropdown: boolean | null;

  @Column('character varying', {
    name: 'educationalDropdownHeader',
    nullable: true,
    length: 255,
  })
  educationalDropdownHeader: string | null;

  @Column('boolean', {
    name: 'isScale',
    nullable: true,
    default: () => 'false',
  })
  isScale: boolean | null;

  @Column('text', { name: 'educationalDropdownDetails', nullable: true })
  educationalDropdownDetails: string | null;

  @Column('integer', {
    name: 'formAnswerId',
    nullable: true,
  })
  formAnswerId: number | null;

  @Column('integer', { name: 'pageAnswerId', nullable: true })
  pageAnswerId: number | null;

  @ManyToOne(() => Forms, (forms) => forms.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'formAnswerId', referencedColumnName: 'id' }])
  formAnswer: Forms[];

  @ManyToOne(() => Pages, (pages) => pages.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'pageAnswerId', referencedColumnName: 'id' }])
  pageAnswer: Pages;

  @ManyToOne(() => Questions, (questions) => questions.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'questionAnswerId', referencedColumnName: 'id' }])
  questionAnswer: Questions;

  @OneToMany(() => Conditions, (conditions) => conditions.answerCondition)
  conditions: Conditions[];

  @OneToMany(
    () => DynamicParameters,
    (dynamicParameters) => dynamicParameters.answerDynamicParameter
  )
  dynamicParameters: DynamicParameters[];

  @OneToMany(
    () => DynamicRateConditions,
    (dynamicRateConditions) => dynamicRateConditions.answers
  )
  dynamicRateConditions: DynamicRateConditions[];

  @OneToMany(() => Integrations, (integrations) => integrations.Answers)
  integrations: Integrations[];

  @OneToMany(() => Parameters, (parameters) => parameters.answerParameter)
  parameters: Parameters[];

  @Column('integer', {
    name: 'questionAnswerId',
    nullable: true,
  })
  questionAnswerId: number | null;
}
