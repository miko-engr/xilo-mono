import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Businesses } from '../business/businesses.entity';
import { Agents } from '../agent/agent.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Flows } from '../flow/flows.entity';
import { Drivers } from '../driver/drivers.entity';
import { Emails } from '../email/emails.entity';
import { Homes } from '../home/homes.entity';
import { Incidents } from '../incident/incidents.entity';
import { LifecycleAnalytics } from '../lifecycle-analytics/LifecycleAnalytics.entity';
import { Locations } from '../location/location.entity';
import { Notes } from '../note/note.entity';
import { Policies } from '../../entities/Policies';
import { Rates } from '../rate/Rates.entity';
import { RecreationalVehicles } from '../recreational-vehicle/recreational-vehicles.entity';
import { TextMessages } from '../text-messages/TextMessages.entity';
import { Tasks } from '../task/tasks.entity';
import { Vehicles } from '../../entities/Vehicles';
import { FormAnalytics } from '../analyticsv2/FormAnalytics.entity';
import { Companies } from '../company/company.entity';

@Entity('Clients', { schema: 'public' })
export class Clients {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp with time zone', { name: 'clientDt', nullable: true })
  clientDt: Date | null;

  @Column('timestamp with time zone', {
    name: 'transactionRqDt',
    nullable: true,
    default: () => "'2019-09-11 19:58:25.828-07'",
  })
  transactionRqDt: Date | null;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'premiumTotal', nullable: true })
  premiumTotal: number | null;

  @Column('integer', { name: 'premiumMonths', nullable: true })
  premiumMonths: number | null;

  @Column('character varying', {
    name: 'pipedriveDealId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedriveDealId: string | null;

  @Column('character varying', {
    name: 'pipedriveNoteId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  pipedriveNoteId: string | null;

  @Column('character varying', {
    name: 'firstName',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  firstName: string | null;

  @Column('character varying', {
    name: 'lastName',
    nullable: true,
    length: 255,
    default: () => "''",
  })
  lastName: string | null;

  @Column('character varying', {
    name: 'phone',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  phone: string | null;

  @Column('character varying', {
    name: 'email',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  email: string | null;

  @Column('character varying', {
    name: 'streetName',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  streetName: string | null;

  @Column('character varying', {
    name: 'streetNumber',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  streetNumber: string | null;

  @Column('character varying', {
    name: 'city',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  city: string | null;

  @Column('character varying', {
    name: 'stateCd',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  stateCd: string | null;

  @Column('character varying', {
    name: 'postalCd',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  postalCd: string | null;

  @Column('integer', { name: 'companyClientId', nullable: true })
  companyClientId: number | null;

  @Column('boolean', {
    name: 'completedAutoForm',
    nullable: true,
    default: () => 'false',
  })
  completedAutoForm: boolean | null;

  @Column('double precision', {
    name: 'latitude',
    nullable: true,
    precision: 53,
  })
  latitude: number | null;

  @Column('double precision', {
    name: 'longitude',
    nullable: true,
    precision: 53,
  })
  longitude: number | null;

  @Column('character varying', {
    name: 'gender',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  gender: string | null;

  @Column('timestamp with time zone', { name: 'birthDate', nullable: true })
  birthDate: Date | null;

  @Column('character varying', {
    name: 'tag',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  tag: string | null;

  @Column('boolean', { name: 'hasCancelled', nullable: true })
  hasCancelled: boolean | null;

  @Column('character varying', {
    name: 'educationLevel',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  educationLevel: string | null;

  @Column('boolean', { name: 'priorClient', nullable: true })
  priorClient: boolean | null;

  @Column('character varying', {
    name: 'maritalStatus',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  maritalStatus: string | null;

  @Column('character varying', {
    name: 'occupation',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  occupation: string | null;

  @Column('character varying', {
    name: 'sfAccountId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  sfAccountId: string | null;

  @Column('character varying', {
    name: 'sfContactId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  sfContactId: string | null;

  @Column('character varying', {
    name: 'sfInsuranceId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  sfInsuranceId: string | null;

  @Column('integer', {
    name: 'sequenceNumber',
    nullable: true,
    default: () => '0',
  })
  sequenceNumber: number | null;

  @Column('boolean', {
    name: 'hasFollowUpEmail',
    nullable: true,
    default: () => 'false',
  })
  hasFollowUpEmail: boolean | null;

  @Column('character varying', {
    name: 'numOfLosses',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  numOfLosses: string | null;

  @Column('character varying', {
    name: 'creditScore',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  creditScore: string | null;

  @Column('boolean', {
    name: 'newLeadFired',
    nullable: true,
    default: () => 'false',
  })
  newLeadFired: boolean | null;

  @Column('character varying', {
    name: 'lengthAtAddress',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  lengthAtAddress: string | null;

  @Column('character varying', {
    name: 'raterResponseStatus',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  raterResponseStatus: string | null;

  @Column('character varying', {
    name: 'raterResponse',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  raterResponse: string | null;

  @Column('character varying', {
    name: 'qqContactId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  qqContactId: string | null;

  @Column('character varying', {
    name: 'qqPolicyId',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  qqPolicyId: string | null;

  @Column('character varying', {
    name: 'unitNumber',
    nullable: true,
    length: 255,
  })
  unitNumber: string | null;

  @Column('character varying', {
    name: 'ezlynxUrl',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  ezlynxUrl: string | null;

  @Column('character varying', {
    name: 'hasPriorInsurance',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  hasPriorInsurance: string | null;

  @Column('character varying', {
    name: 'priorInsuranceCompany',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  priorInsuranceCompany: string | null;

  @Column('character varying', {
    name: 'priorInsuranceDuration',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  priorInsuranceDuration: string | null;

  @Column('character varying', {
    name: 'fullAddress',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  fullAddress: string | null;

  @Column('character varying', {
    name: 'priorPenalties',
    nullable: true,
    length: 255,
  })
  priorPenalties: string | null;

  @Column('character varying', {
    name: 'priorPenaltiesCode',
    nullable: true,
    length: 255,
  })
  priorPenaltiesCode: string | null;

  @Column('character varying', {
    name: 'priorPenaltiesDate',
    nullable: true,
    length: 255,
  })
  priorPenaltiesDate: string | null;

  @Column('character varying', {
    name: 'priorInsuranceYears',
    nullable: true,
    length: 255,
  })
  priorInsuranceYears: string | null;

  @Column('character varying', {
    name: 'priorInsuranceMonths',
    nullable: true,
    length: 255,
  })
  priorInsuranceMonths: string | null;

  @Column('character varying', {
    name: 'yearsWithCarrier',
    nullable: true,
    length: 255,
  })
  yearsWithCarrier: string | null;

  @Column('character varying', {
    name: 'monthsWithCarrier',
    nullable: true,
    length: 255,
  })
  monthsWithCarrier: string | null;

  @Column('character varying', {
    name: 'priorInsuranceExpirationDate',
    nullable: true,
    length: 255,
  })
  priorInsuranceExpirationDate: string | null;

  @Column('character varying', {
    name: 'homeownership',
    nullable: true,
    length: 255,
  })
  homeownership: string | null;

  @Column('character varying', {
    name: 'hasAccidents',
    nullable: true,
    length: 255,
  })
  hasAccidents: string | null;

  @Column('character varying', {
    name: 'accidentDate',
    nullable: true,
    length: 255,
  })
  accidentDate: string | null;

  @Column('character varying', {
    name: 'accidentType',
    nullable: true,
    length: 255,
  })
  accidentType: string | null;

  @Column('character varying', {
    name: 'hasViolations',
    nullable: true,
    length: 255,
  })
  hasViolations: string | null;

  @Column('character varying', {
    name: 'violationDate',
    nullable: true,
    length: 255,
  })
  violationDate: string | null;

  @Column('character varying', {
    name: 'violationType',
    nullable: true,
    length: 255,
  })
  violationType: string | null;

  @Column('character varying', {
    name: 'hasCompLoss',
    nullable: true,
    length: 255,
  })
  hasCompLoss: string | null;

  @Column('character varying', {
    name: 'compLossDate',
    nullable: true,
    length: 255,
  })
  compLossDate: string | null;

  @Column('character varying', {
    name: 'compLossType',
    nullable: true,
    length: 255,
  })
  compLossType: string | null;

  @Column('character varying', {
    name: 'isFirstTimeHomeBuyer',
    nullable: true,
    length: 255,
  })
  isFirstTimeHomeBuyer: string | null;

  @Column('character varying', {
    name: 'homeInsurancePreviouslyCancelled',
    nullable: true,
    length: 255,
  })
  homeInsurancePreviouslyCancelled: string | null;

  @Column('character varying', {
    name: 'hasSecondAddress',
    nullable: true,
    length: 255,
  })
  hasSecondAddress: string | null;

  @Column('character varying', {
    name: 'hasHomeLoss',
    nullable: true,
    length: 255,
  })
  hasHomeLoss: string | null;

  @Column('character varying', {
    name: 'homeLossDate',
    nullable: true,
    length: 255,
  })
  homeLossDate: string | null;

  @Column('character varying', {
    name: 'homeLossType',
    nullable: true,
    length: 255,
  })
  homeLossType: string | null;

  @Column('character varying', {
    name: 'homeLossAmount',
    nullable: true,
    length: 255,
  })
  homeLossAmount: string | null;

  @Column('character varying', {
    name: 'hasUnitNumber',
    nullable: true,
    length: 255,
  })
  hasUnitNumber: string | null;

  @Column('character varying', {
    name: 'priorPolicyPaidInFull',
    nullable: true,
    length: 255,
  })
  priorPolicyPaidInFull: string | null;

  @Column('character varying', {
    name: 'priorPolicyPaymentMethod',
    nullable: true,
    length: 255,
  })
  priorPolicyPaymentMethod: string | null;

  @Column('character varying', {
    name: 'payThroughEscrow',
    nullable: true,
    length: 255,
  })
  payThroughEscrow: string | null;

  @Column('character varying', {
    name: 'numberOfResidentsInHome',
    nullable: true,
    length: 255,
  })
  numberOfResidentsInHome: string | null;

  @Column('character varying', {
    name: 'rentersLimits',
    nullable: true,
    length: 255,
  })
  rentersLimits: string | null;

  @Column('character varying', {
    name: 'homeHasMortgage',
    nullable: true,
    length: 255,
  })
  homeHasMortgage: string | null;

  @Column('character varying', {
    name: 'isPriorClient',
    nullable: true,
    length: 255,
  })
  isPriorClient: string | null;

  @Column('character varying', {
    name: 'authCreditCheck',
    nullable: true,
    length: 255,
  })
  authCreditCheck: string | null;

  @Column('character varying', {
    name: 'priorBodilyInjuryLimits',
    nullable: true,
    length: 255,
  })
  priorBodilyInjuryLimits: string | null;

  @Column('character varying', {
    name: 'preferredContactMethod',
    nullable: true,
    length: 255,
  })
  preferredContactMethod: string | null;

  @Column('character varying', {
    name: 'vehicleCoverageLevel',
    nullable: true,
    length: 255,
  })
  vehicleCoverageLevel: string | null;

  @Column('character varying', { name: 'height', nullable: true, length: 255 })
  height: string | null;

  @Column('character varying', { name: 'weight', nullable: true, length: 255 })
  weight: string | null;

  @Column('character varying', {
    name: 'nicotineUse',
    nullable: true,
    length: 255,
  })
  nicotineUse: string | null;

  @Column('character varying', {
    name: 'healthRating',
    nullable: true,
    length: 255,
  })
  healthRating: string | null;

  @Column('character varying', {
    name: 'typeOfInsurance',
    nullable: true,
    length: 255,
  })
  typeOfInsurance: string | null;

  @Column('character varying', {
    name: 'coverageTerm',
    nullable: true,
    length: 255,
  })
  coverageTerm: string | null;

  @Column('character varying', {
    name: 'coverageNeeded',
    nullable: true,
    length: 255,
  })
  coverageNeeded: string | null;

  @Column('character varying', {
    name: 'referredBy',
    nullable: true,
    length: 255,
  })
  referredBy: string | null;

  @Column('character varying', {
    name: 'preferredAgent',
    nullable: true,
    length: 255,
  })
  preferredAgent: string | null;

  @Column('character varying', {
    name: 'permissionToContact',
    nullable: true,
    length: 255,
  })
  permissionToContact: string | null;

  @Column('character varying', {
    name: 'marriedOrHasCoBorrower',
    nullable: true,
    length: 255,
  })
  marriedOrHasCoBorrower: string | null;

  @Column('character varying', {
    name: 'spouseName',
    nullable: true,
    length: 255,
  })
  spouseName: string | null;

  @Column('character varying', {
    name: 'spouseBirthdate',
    nullable: true,
    length: 255,
  })
  spouseBirthdate: string | null;

  @Column('character varying', {
    name: 'referrersFirstName',
    nullable: true,
    length: 255,
  })
  referrersFirstName: string | null;

  @Column('character varying', {
    name: 'referrersLastName',
    nullable: true,
    length: 255,
  })
  referrersLastName: string | null;

  @Column('character varying', {
    name: 'referrersEmail',
    nullable: true,
    length: 255,
  })
  referrersEmail: string | null;

  @Column('character varying', {
    name: 'reasonForShopping',
    nullable: true,
    length: 255,
  })
  reasonForShopping: string | null;

  @Column('character varying', {
    name: 'referrersPhone',
    nullable: true,
    length: 255,
  })
  referrersPhone: string | null;

  @Column('varchar', { name: 'tags', nullable: true, array: true })
  tags: string[] | null;

  @Column('character varying', {
    name: 'wantsLiabilityCoverage',
    nullable: true,
    length: 255,
  })
  wantsLiabilityCoverage: string | null;

  @Column('character varying', {
    name: 'timeToQuote',
    nullable: true,
    length: 255,
  })
  timeToQuote: string | null;

  @Column('character varying', {
    name: 'hasOtherLicensedDrivers',
    nullable: true,
    length: 255,
  })
  hasOtherLicensedDrivers: string | null;

  @Column('character varying', { name: 'hadLoss', nullable: true, length: 255 })
  hadLoss: string | null;

  @Column('character varying', {
    name: 'lossExplanation',
    nullable: true,
    length: 255,
  })
  lossExplanation: string | null;

  @Column('character varying', {
    name: 'priorInsurancePremium',
    nullable: true,
    length: 255,
  })
  priorInsurancePremium: string | null;

  @Column('character varying', {
    name: 'yearsWithLapseInInsurance',
    nullable: true,
    length: 255,
  })
  yearsWithLapseInInsurance: string | null;

  @Column('character varying', {
    name: 'monthsWithLapseInInsurance',
    nullable: true,
    length: 255,
  })
  monthsWithLapseInInsurance: string | null;

  @Column('character varying', {
    name: 'hasMedicare',
    nullable: true,
    length: 255,
  })
  hasMedicare: string | null;

  @Column('varchar', { name: 'medications', nullable: true, array: true })
  medications: string[] | null;

  @Column('character varying', {
    name: 'hasFamilyWithDiseases',
    nullable: true,
    length: 255,
  })
  hasFamilyWithDiseases: string | null;

  @Column('character varying', {
    name: 'hadLicenseSuspended',
    nullable: true,
    length: 255,
  })
  hadLicenseSuspended: string | null;

  @Column('character varying', {
    name: 'isBusinessPartner',
    nullable: true,
    length: 255,
  })
  isBusinessPartner: string | null;

  @Column('character varying', {
    name: 'hadLapseInInsurance',
    nullable: true,
    length: 255,
  })
  hadLapseInInsurance: string | null;

  @Column('character varying', {
    name: 'wantsCyberLiability',
    nullable: true,
    length: 255,
  })
  wantsCyberLiability: string | null;

  @Column('character varying', {
    name: 'priorInsuranceStartDate',
    nullable: true,
    length: 255,
  })
  priorInsuranceStartDate: string | null;

  @Column('character varying', {
    name: 'liabilityLimits',
    nullable: true,
    length: 255,
  })
  liabilityLimits: string | null;

  @Column('character varying', {
    name: 'hadLiabilityClaims',
    nullable: true,
    length: 255,
  })
  hadLiabilityClaims: string | null;

  @Column('character varying', {
    name: 'liabilityClaimExplanation',
    nullable: true,
    length: 255,
  })
  liabilityClaimExplanation: string | null;

  @Column('text', { name: 'reasonForInsuranceExplanation', nullable: true })
  reasonForInsuranceExplanation: string | null;

  @Column('character varying', {
    name: 'nicotineFrequency',
    nullable: true,
    length: 255,
  })
  nicotineFrequency: string | null;

  @Column('character varying', {
    name: 'infusionsoftClientId',
    nullable: true,
    length: 255,
  })
  infusionsoftClientId: string | null;

  @Column('integer', { name: 'formClientId', nullable: true })
  formClientId: number | null;

  @Column('boolean', {
    name: 'finishedFormEmailFired',
    nullable: true,
    default: () => 'false',
  })
  finishedFormEmailFired: boolean | null;

  @Column('character varying', {
    name: 'entityName',
    nullable: true,
    length: 255,
  })
  entityName: string | null;

  @Column('character varying', {
    name: 'effectiveDate',
    nullable: true,
    length: 255,
  })
  effectiveDate: string | null;

  @Column('character varying', {
    name: 'policyType',
    nullable: true,
    length: 255,
  })
  policyType: string | null;

  @Column('text', { name: 'goalsWithNewInsurance', nullable: true })
  goalsWithNewInsurance: string | null;

  @Column('text', { name: 'businessDecisionsDescription', nullable: true })
  businessDecisionsDescription: string | null;

  @Column('character varying', {
    name: 'hasCompletedQuoteForm',
    nullable: true,
    length: 255,
  })
  hasCompletedQuoteForm: string | null;

  @Column('character varying', {
    name: 'hasPreviousAddress',
    nullable: true,
    length: 255,
  })
  hasPreviousAddress: string | null;

  @Column('character varying', {
    name: 'previousAddress',
    nullable: true,
    length: 255,
  })
  previousAddress: string | null;

  @Column('text', { name: 'coverageDescription', nullable: true })
  coverageDescription: string | null;

  @Column('character varying', {
    name: 'desiredPremium',
    nullable: true,
    length: 255,
  })
  desiredPremium: string | null;

  @Column('character varying', {
    name: 'wantsLifeBundle',
    nullable: true,
    length: 255,
  })
  wantsLifeBundle: string | null;

  @Column('character varying', { name: 'hasLLC', nullable: true, length: 255 })
  hasLlc: string | null;

  @Column('character varying', {
    name: 'streetAddress',
    nullable: true,
    length: 255,
  })
  streetAddress: string | null;

  @Column('character varying', {
    name: 'fullName',
    nullable: true,
    length: 255,
  })
  fullName: string | null;

  @Column('character varying', {
    name: 'isMarried',
    nullable: true,
    length: 255,
  })
  isMarried: string | null;

  @Column('character varying', {
    name: 'yearsAtCurrentAddress',
    nullable: true,
    length: 255,
  })
  yearsAtCurrentAddress: string | null;

  @Column('character varying', {
    name: 'isUSCitizen',
    nullable: true,
    length: 255,
  })
  isUsCitizen: string | null;

  @Column('character varying', {
    name: 'hasBeneficiaries',
    nullable: true,
    length: 255,
  })
  hasBeneficiaries: string | null;

  @Column('character varying', {
    name: 'numberOfBeneficiaries',
    nullable: true,
    length: 255,
  })
  numberOfBeneficiaries: string | null;

  @Column('character varying', {
    name: 'valueOfAssets',
    nullable: true,
    length: 255,
  })
  valueOfAssets: string | null;

  @Column('character varying', {
    name: 'hasRealEstate',
    nullable: true,
    length: 255,
  })
  hasRealEstate: string | null;

  @Column('character varying', {
    name: 'numberOfProperties',
    nullable: true,
    length: 255,
  })
  numberOfProperties: string | null;

  @Column('character varying', {
    name: 'hasVehicles',
    nullable: true,
    length: 255,
  })
  hasVehicles: string | null;

  @Column('character varying', {
    name: 'numberOfVehicles',
    nullable: true,
    length: 255,
  })
  numberOfVehicles: string | null;

  @Column('character varying', {
    name: 'hasLifeInsurance',
    nullable: true,
    length: 255,
  })
  hasLifeInsurance: string | null;

  @Column('character varying', {
    name: 'typeOfLifeInsurance',
    nullable: true,
    length: 255,
  })
  typeOfLifeInsurance: string | null;

  @Column('character varying', {
    name: 'hasRetirementAccounts',
    nullable: true,
    length: 255,
  })
  hasRetirementAccounts: string | null;

  @Column('varchar', {
    name: 'typeOfRetirementAccounts',
    nullable: true,
    array: true,
  })
  typeOfRetirementAccounts: string[] | null;

  @Column('text', { name: 'comments', nullable: true })
  comments: string | null;

  @Column('character varying', {
    name: 'primaryPowerOfAttorney',
    nullable: true,
    length: 255,
  })
  primaryPowerOfAttorney: string | null;

  @Column('character varying', {
    name: 'secondaryPowerOfAttorney',
    nullable: true,
    length: 255,
  })
  secondaryPowerOfAttorney: string | null;

  @Column('character varying', {
    name: 'contingencyPowerOfAttorney',
    nullable: true,
    length: 255,
  })
  contingencyPowerOfAttorney: string | null;

  @Column('varchar', { name: 'typesOfInsurances', nullable: true, array: true })
  typesOfInsurances: string[] | null;

  @Column('character varying', { name: 'county', nullable: true, length: 255 })
  county: string | null;

  @Column('character varying', { name: 'ssn', nullable: true, length: 255 })
  ssn: string | null;

  @Column('text', { name: 'additionalInsured', nullable: true })
  additionalInsured: string | null;

  @Column('character varying', {
    name: 'policyNumber',
    nullable: true,
    length: 255,
  })
  policyNumber: string | null;

  @Column('varchar', { name: 'otherInsurances', nullable: true, array: true })
  otherInsurances: string[] | null;

  @Column('character varying', {
    name: 'spouseOccupation',
    nullable: true,
    length: 255,
  })
  spouseOccupation: string | null;

  @Column('character varying', {
    name: 'numberOfResidentsUnder14',
    nullable: true,
    length: 255,
  })
  numberOfResidentsUnder14: string | null;

  @Column('character varying', {
    name: 'numberOfResidentsOver13',
    nullable: true,
    length: 255,
  })
  numberOfResidentsOver13: string | null;

  @Column('text', { name: 'membershipDiscounts', nullable: true })
  membershipDiscounts: string | null;

  @Column('character varying', { name: 'today', nullable: true, length: 255 })
  today: string | null;

  @Column('character varying', {
    name: 'expirationDate',
    nullable: true,
    length: 255,
  })
  expirationDate: string | null;

  @Column('character varying', {
    name: 'hasMinorDrivers',
    nullable: true,
    length: 255,
  })
  hasMinorDrivers: string | null;

  @Column('character varying', {
    name: 'hasFarms',
    nullable: true,
    length: 255,
  })
  hasFarms: string | null;

  @Column('character varying', {
    name: 'hasWatercrafts',
    nullable: true,
    length: 255,
  })
  hasWatercrafts: string | null;

  @Column('character varying', {
    name: 'hasRecreationalVehicles',
    nullable: true,
    length: 255,
  })
  hasRecreationalVehicles: string | null;

  @Column('character varying', {
    name: 'hasRentals',
    nullable: true,
    length: 255,
  })
  hasRentals: string | null;

  @Column('character varying', {
    name: 'numberOfHomes',
    nullable: true,
    length: 255,
  })
  numberOfHomes: string | null;

  @Column('timestamp with time zone', {
    name: 'clientAgentIdUpdatedAt',
    nullable: true,
  })
  clientAgentIdUpdatedAt: Date | null;

  @Column('integer', {
    name: 'clientAgentId',
    nullable: true,
  })
  clientAgentId: number | null;

  @Column('text', { name: 'clubMembershipsText', nullable: true })
  clubMembershipsText: string | null;

  @Column('text', { name: 'amsCustomerId', nullable: true })
  amsCustomerId: string | null;

  @Column('character varying', {
    name: 'referralType',
    nullable: true,
    length: 255,
  })
  referralType: string | null;

  @Column('character varying', {
    name: 'referralName',
    nullable: true,
    length: 255,
  })
  referralName: string | null;

  @Column('character varying', {
    name: 'referralEmail',
    nullable: true,
    length: 255,
  })
  referralEmail: string | null;

  @Column('character varying', {
    name: 'referralPhone',
    nullable: true,
    length: 255,
  })
  referralPhone: string | null;

  @Column('varchar', { name: 'vehicleDiscounts', nullable: true, array: true })
  vehicleDiscounts: string[] | null;

  @Column('varchar', { name: 'homeDiscounts', nullable: true, array: true })
  homeDiscounts: string[] | null;

  @Column('character varying', {
    name: 'priorPolicyTerm',
    nullable: true,
    length: 255,
  })
  priorPolicyTerm: string | null;

  @Column('character varying', {
    name: 'wantsUmbrellaCoverage',
    nullable: true,
    length: 255,
  })
  wantsUmbrellaCoverage: string | null;

  @Column('character varying', {
    name: 'wantsHomeBundle',
    nullable: true,
    length: 255,
  })
  wantsHomeBundle: string | null;

  @Column('character varying', {
    name: 'beneficiary',
    nullable: true,
    length: 255,
  })
  beneficiary: string | null;

  @Column('character varying', {
    name: 'hasAppliedForInsurance',
    nullable: true,
    length: 255,
  })
  hasAppliedForInsurance: string | null;

  @Column('character varying', {
    name: 'annualIncome',
    nullable: true,
    length: 255,
  })
  annualIncome: string | null;

  @Column('character varying', {
    name: 'networth',
    nullable: true,
    length: 255,
  })
  networth: string | null;

  @Column('character varying', {
    name: 'totalSavings',
    nullable: true,
    length: 255,
  })
  totalSavings: string | null;

  @Column('character varying', {
    name: 'totalExpenses',
    nullable: true,
    length: 255,
  })
  totalExpenses: string | null;

  @Column('character varying', {
    name: 'yearsUntilRetirement',
    nullable: true,
    length: 255,
  })
  yearsUntilRetirement: string | null;

  @Column('text', { name: 'driversList', nullable: true })
  driversList: string | null;

  @Column('text', { name: 'vehiclesList', nullable: true })
  vehiclesList: string | null;

  @Column('character varying', {
    name: 'mailingAddress',
    nullable: true,
    length: 255,
  })
  mailingAddress: string | null;

  @Column('text', { name: 'additionalCommentOne', nullable: true })
  additionalCommentOne: string | null;

  @Column('text', { name: 'additionalCommentTwo', nullable: true })
  additionalCommentTwo: string | null;

  @Column('text', { name: 'additionalCommentThree', nullable: true })
  additionalCommentThree: string | null;

  @Column('text', { name: 'additionalCommentFour', nullable: true })
  additionalCommentFour: string | null;

  @Column('character varying', {
    name: 'hasCreditCheckAuthorization',
    nullable: true,
    length: 255,
  })
  hasCreditCheckAuthorization: string | null;

  @Column('character varying', {
    name: 'spouseFirstName',
    nullable: true,
    length: 255,
  })
  spouseFirstName: string | null;

  @Column('character varying', {
    name: 'spouseLastName',
    nullable: true,
    length: 255,
  })
  spouseLastName: string | null;

  @Column('character varying', {
    name: 'spouseGender',
    nullable: true,
    length: 255,
  })
  spouseGender: string | null;

  @Column('character varying', {
    name: 'spouseMaritalStatus',
    nullable: true,
    length: 255,
  })
  spouseMaritalStatus: string | null;

  @Column('character varying', {
    name: 'spouseEducationLevel',
    nullable: true,
    length: 255,
  })
  spouseEducationLevel: string | null;

  @Column('character varying', {
    name: 'wealthboxId',
    nullable: true,
    length: 255,
  })
  wealthboxId: string | null;

  @Column('character varying', {
    name: 'customerType',
    nullable: true,
    length: 255,
  })
  customerType: string | null;

  @Column('character varying', {
    name: 'hasMedicalConditions',
    nullable: true,
    length: 255,
  })
  hasMedicalConditions: string | null;

  @Column('character varying', {
    name: 'conditionDuration',
    nullable: true,
    length: 255,
  })
  conditionDuration: string | null;

  @Column('character varying', {
    name: 'conditionOutcome',
    nullable: true,
    length: 255,
  })
  conditionOutcome: string | null;

  @Column('text', { name: 'ssnHash', nullable: true })
  ssnHash: string | null;

  @Column('character varying', {
    name: 'autoCoverageTerm',
    nullable: true,
    length: 255,
  })
  autoCoverageTerm: string | null;

  @Column('character varying', {
    name: 'amsPolicyId',
    nullable: true,
    length: 255,
  })
  amsPolicyId: string | null;

  @Column('character varying', {
    name: 'ezlynxId',
    nullable: true,
    length: 255,
  })
  ezlynxId: string | null;

  @Column('character varying', {
    name: 'umbrellaCoverageAmount',
    nullable: true,
    length: 255,
  })
  umbrellaCoverageAmount: string | null;

  @Column('character varying', { name: 'consent', nullable: true, length: 255 })
  consent: string | null;

  @Column('character varying', {
    name: 'ownerIsDriver',
    nullable: true,
    length: 255,
  })
  ownerIsDriver: string | null;

  @Column('character varying', {
    name: 'wantsGeneralLiability',
    nullable: true,
    length: 255,
  })
  wantsGeneralLiability: string | null;

  @Column('character varying', {
    name: 'hasLaneKeepAssistance',
    nullable: true,
    length: 255,
  })
  hasLaneKeepAssistance: string | null;

  @Column('character varying', {
    name: 'hasSelfDrivingCar',
    nullable: true,
    length: 255,
  })
  hasSelfDrivingCar: string | null;

  @Column('character varying', {
    name: 'hasLowMileageVehicle',
    nullable: true,
    length: 255,
  })
  hasLowMileageVehicle: string | null;

  @Column('character varying', {
    name: 'hasDrivingMonitor',
    nullable: true,
    length: 255,
  })
  hasDrivingMonitor: string | null;

  @Column('character varying', {
    name: 'expectedValue',
    nullable: true,
    length: 255,
  })
  expectedValue: string | null;

  @Column('character varying', {
    name: 'hasCancelledPriorPolicy',
    nullable: true,
    length: 255,
  })
  hasCancelledPriorPolicy: string | null;

  @Column('timestamp with time zone', {
    name: 'lifecycleUpdatedAt',
    nullable: true,
  })
  lifecycleUpdatedAt: Date | null;

  @Column('int4', { name: 'triggeredFormIds', nullable: true, array: true })
  triggeredFormIds: number[] | null;

  @Column('character varying', {
    name: 'employer',
    nullable: true,
    length: 255,
  })
  employer: string | null;

  @Column('varchar', {
    name: 'currentInsurancePolicies',
    nullable: true,
    array: true,
  })
  currentInsurancePolicies: string[] | null;

  @Column('character varying', {
    name: 'wantsRentalReimbursementCoverage',
    nullable: true,
    length: 255,
  })
  wantsRentalReimbursementCoverage: string | null;

  @Column('character varying', {
    name: 'isPregnant',
    nullable: true,
    length: 255,
  })
  isPregnant: string | null;

  @Column('character varying', {
    name: 'numberOfDependents',
    nullable: true,
    length: 255,
  })
  numberOfDependents: string | null;

  @Column('character varying', { name: 'hasToys', nullable: true, length: 255 })
  hasToys: string | null;

  @Column('character varying', {
    name: 'spouseEmployer',
    nullable: true,
    length: 255,
  })
  spouseEmployer: string | null;

  @Column('character varying', {
    name: 'doctorsVisitReason',
    nullable: true,
    length: 255,
  })
  doctorsVisitReason: string | null;

  @Column('character varying', {
    name: 'authorizedHealthRelease',
    nullable: true,
    length: 255,
  })
  authorizedHealthRelease: string | null;

  @Column('character varying', {
    name: 'hasContingentBeneficiaries',
    nullable: true,
    length: 255,
  })
  hasContingentBeneficiaries: string | null;

  @Column('character varying', {
    name: 'contingentBeneficiaries',
    nullable: true,
    length: 255,
  })
  contingentBeneficiaries: string | null;

  @Column('character varying', {
    name: 'appliedForDisability',
    nullable: true,
    length: 255,
  })
  appliedForDisability: string | null;

  @Column('text', { name: 'disabilityDetails', nullable: true })
  disabilityDetails: string | null;

  @Column('character varying', {
    name: 'insuranceDeclined',
    nullable: true,
    length: 255,
  })
  insuranceDeclined: string | null;

  @Column('text', { name: 'insuranceDeclineDetails', nullable: true })
  insuranceDeclineDetails: string | null;

  @Column('character varying', {
    name: 'inAviation',
    nullable: true,
    length: 255,
  })
  inAviation: string | null;

  @Column('character varying', {
    name: 'doesExtremeSports',
    nullable: true,
    length: 255,
  })
  doesExtremeSports: string | null;

  @Column('character varying', {
    name: 'extremeSports',
    nullable: true,
    length: 255,
  })
  extremeSports: string | null;

  @Column('character varying', {
    name: 'inMilitary',
    nullable: true,
    length: 255,
  })
  inMilitary: string | null;

  @Column('text', { name: 'militaryDetails', nullable: true })
  militaryDetails: string | null;

  @Column('character varying', {
    name: 'criminal',
    nullable: true,
    length: 255,
  })
  criminal: string | null;

  @Column('text', { name: 'criminalDetails', nullable: true })
  criminalDetails: string | null;

  @Column('character varying', {
    name: 'hasOtherClaims',
    nullable: true,
    length: 255,
  })
  hasOtherClaims: string | null;

  @Column('character varying', {
    name: 'otherClaimDetails',
    nullable: true,
    length: 255,
  })
  otherClaimDetails: string | null;

  @Column('character varying', {
    name: 'receiveAtAddress',
    nullable: true,
    length: 255,
  })
  receiveAtAddress: string | null;

  @Column('character varying', { name: 'country', nullable: true, length: 255 })
  country: string | null;

  @Column('character varying', {
    name: 'billPlan',
    nullable: true,
    length: 255,
  })
  billPlan: string | null;

  @Column('character varying', {
    name: 'faceAmount',
    nullable: true,
    length: 255,
  })
  faceAmount: string | null;

  @Column('character varying', {
    name: 'hasScheduledProperty',
    nullable: true,
    length: 255,
  })
  hasScheduledProperty: string | null;

  @Column('character varying', {
    name: 'hasUmbrellaPolicy',
    nullable: true,
    length: 255,
  })
  hasUmbrellaPolicy: string | null;

  @Column('character varying', {
    name: 'naicCode',
    nullable: true,
    length: 255,
  })
  naicCode: string | null;

  @Column('character varying', {
    name: 'spousePhoneNumber',
    nullable: true,
    length: 255,
  })
  spousePhoneNumber: string | null;

  @Column('character varying', {
    name: 'spouseEmail',
    nullable: true,
    length: 255,
  })
  spouseEmail: string | null;

  @Column('varchar', {
    name: 'listOfTimesToContact',
    nullable: true,
    array: true,
  })
  listOfTimesToContact: string[] | null;

  @Column('character varying', {
    name: 'insuranceCarrierAddress',
    nullable: true,
    length: 255,
  })
  insuranceCarrierAddress: string | null;

  @Column('character varying', {
    name: 'cancellationDate',
    nullable: true,
    length: 255,
  })
  cancellationDate: string | null;

  @Column('character varying', {
    name: 'interestType',
    nullable: true,
    length: 255,
  })
  interestType: string | null;

  @Column('character varying', {
    name: 'interestsMailingAddress',
    nullable: true,
    length: 255,
  })
  interestsMailingAddress: string | null;

  @Column('character varying', {
    name: 'cancelReason',
    nullable: true,
    length: 255,
  })
  cancelReason: string | null;

  @Column('character varying', {
    name: 'cancelReasonOther',
    nullable: true,
    length: 255,
  })
  cancelReasonOther: string | null;

  @Column('character varying', {
    name: 'newCarrier',
    nullable: true,
    length: 255,
  })
  newCarrier: string | null;

  @Column('character varying', {
    name: 'newPolicyNumber',
    nullable: true,
    length: 255,
  })
  newPolicyNumber: string | null;

  @Column('character varying', {
    name: 'newEffectiveDate',
    nullable: true,
    length: 255,
  })
  newEffectiveDate: string | null;

  @Column('character varying', {
    name: 'cancelMethod',
    nullable: true,
    length: 255,
  })
  cancelMethod: string | null;

  @Column('character varying', {
    name: 'premiumFactor',
    nullable: true,
    length: 255,
  })
  premiumFactor: string | null;

  @Column('character varying', {
    name: 'returnPremium',
    nullable: true,
    length: 255,
  })
  returnPremium: string | null;

  @Column('character varying', {
    name: 'premiumAudit',
    nullable: true,
    length: 255,
  })
  premiumAudit: string | null;

  @Column('character varying', {
    name: 'interestFullName',
    nullable: true,
    length: 255,
  })
  interestFullName: string | null;

  @Column('character varying', {
    name: 'priorEvidenceDate',
    nullable: true,
    length: 255,
  })
  priorEvidenceDate: string | null;

  @Column('character varying', {
    name: 'typeOfCoverage',
    nullable: true,
    length: 255,
  })
  typeOfCoverage: string | null;

  @Column('character varying', {
    name: 'insurerLetterCode',
    nullable: true,
    length: 255,
  })
  insurerLetterCode: string | null;

  @Column('character varying', {
    name: 'aggregateCoverage',
    nullable: true,
    length: 255,
  })
  aggregateCoverage: string | null;

  @Column('character varying', {
    name: 'umbrellaPolicyType',
    nullable: true,
    length: 255,
  })
  umbrellaPolicyType: string | null;

  @Column('character varying', {
    name: 'coverageBasis',
    nullable: true,
    length: 255,
  })
  coverageBasis: string | null;

  @Column('character varying', {
    name: 'officerExcludeInclude',
    nullable: true,
    length: 255,
  })
  officerExcludeInclude: string | null;

  @Column('character varying', {
    name: 'eachAccidentLimit',
    nullable: true,
    length: 255,
  })
  eachAccidentLimit: string | null;

  @Column('character varying', {
    name: 'eachEmpLimit',
    nullable: true,
    length: 255,
  })
  eachEmpLimit: string | null;

  @Column('character varying', {
    name: 'workcompPolicyLimit',
    nullable: true,
    length: 255,
  })
  workcompPolicyLimit: string | null;

  @Column('character varying', {
    name: 'otherCoverageDescription',
    nullable: true,
    length: 255,
  })
  otherCoverageDescription: string | null;

  @Column('character varying', {
    name: 'liabilityLimitsDescription',
    nullable: true,
    length: 255,
  })
  liabilityLimitsDescription: string | null;

  @Column('character varying', {
    name: 'loanNumber',
    nullable: true,
    length: 255,
  })
  loanNumber: string | null;

  @Column('character varying', {
    name: 'authorizedRep',
    nullable: true,
    length: 255,
  })
  authorizedRep: string | null;

  @Column('character varying', {
    name: 'attachmentLink',
    nullable: true,
    length: 255,
  })
  attachmentLink: string | null;

  @Column('character varying', {
    name: 'infusionsoftTagId',
    nullable: true,
    length: 255,
  })
  infusionsoftTagId: string | null;

  @Column('character varying', {
    name: 'approver',
    nullable: true,
    length: 255,
  })
  approver: string | null;

  @Column('character varying', {
    name: 'reinstatementAmount',
    nullable: true,
    length: 255,
  })
  reinstatementAmount: string | null;

  @Column('character varying', {
    name: 'producer',
    nullable: true,
    length: 255,
  })
  producer: string | null;

  @Column('character varying', {
    name: 'monthsAtAddress',
    nullable: true,
    length: 255,
  })
  monthsAtAddress: string | null;

  @Column('character varying', {
    name: 'changeOfResidency',
    nullable: true,
    length: 255,
  })
  changeOfResidency: string | null;

  @Column('character varying', { name: 'witness', nullable: true, length: 255 })
  witness: string | null;

  @Column('character varying', {
    name: 'dateReinstatementFeePaid',
    nullable: true,
    length: 255,
  })
  dateReinstatementFeePaid: string | null;

  @Column('character varying', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @Column('character varying', {
    name: 'agencyName',
    nullable: true,
    length: 255,
  })
  agencyName: string | null;

  @Column('character varying', {
    name: 'newProducer',
    nullable: true,
    length: 255,
  })
  newProducer: string | null;

  @Column('character varying', {
    name: 'newAgencyName',
    nullable: true,
    length: 255,
  })
  newAgencyName: string | null;

  @Column('character varying', {
    name: 'newProducerCode',
    nullable: true,
    length: 255,
  })
  newProducerCode: string | null;

  @Column('character varying', {
    name: 'newAgencyAppointmentDate',
    nullable: true,
    length: 255,
  })
  newAgencyAppointmentDate: string | null;

  @Column('character varying', {
    name: 'zapStatus',
    nullable: true,
    length: 255,
  })
  zapStatus: string | null;

  @Column('character varying', {
    name: 'agencyFullAddress',
    nullable: true,
    length: 255,
  })
  agencyFullAddress: string | null;

  @Column('character varying', {
    name: 'agencyStreetAddress',
    nullable: true,
    length: 255,
  })
  agencyStreetAddress: string | null;

  @Column('character varying', {
    name: 'agencyStreetName',
    nullable: true,
    length: 255,
  })
  agencyStreetName: string | null;

  @Column('character varying', {
    name: 'agencyStreetNumber',
    nullable: true,
    length: 255,
  })
  agencyStreetNumber: string | null;

  @Column('character varying', {
    name: 'agencyUnitNumber',
    nullable: true,
    length: 255,
  })
  agencyUnitNumber: string | null;

  @Column('character varying', {
    name: 'agencyCity',
    nullable: true,
    length: 255,
  })
  agencyCity: string | null;

  @Column('character varying', {
    name: 'agencyState',
    nullable: true,
    length: 255,
  })
  agencyState: string | null;

  @Column('character varying', {
    name: 'agencyZipCode',
    nullable: true,
    length: 255,
  })
  agencyZipCode: string | null;

  @Column('text', { array: true, name: 'ezlynxValidationLogs' })
  ezlynxValidationLogs: string[] | null;

  @Column('character varying', {
    name: 'informationRelease',
    nullable: true,
    length: 255,
  })
  informationRelease: string | null;

  @Column('character varying', {
    name: 'roommateRelationship',
    nullable: true,
    length: 255,
  })
  roommateRelationship: string | null;

  @Column('character varying', {
    name: 'changeRequest',
    nullable: true,
    length: 255,
  })
  changeRequest: string | null;

  @Column('character varying', {
    name: 'ezlynxStatus',
    nullable: true,
    length: 255,
  })
  ezlynxStatus: string | null;

  @Column('character varying', {
    name: 'industry',
    nullable: true,
    length: 255,
  })
  industry: string | null;

  @Column('character varying', {
    name: 'spouseIndustry',
    nullable: true,
    length: 255,
  })
  spouseIndustry: string | null;

  @Column('character varying', {
    name: 'disclose',
    nullable: true,
    length: 255,
  })
  disclose: string | null;

  @Column('varchar', { name: 'paymentMethodList', nullable: true, array: true })
  paymentMethodList: string[] | null;

  @Column('character varying', {
    name: 'hasSameBIAndUM',
    nullable: true,
    length: 255,
  })
  hasSameBiAndUm: string | null;

  @Column('character varying', {
    name: 'previousAddressUnit',
    nullable: true,
    length: 255,
  })
  previousAddressUnit: string | null;

  @Column('character varying', {
    name: 'wantsPetInsurance',
    nullable: true,
    length: 255,
  })
  wantsPetInsurance: string | null;

  @Column('character varying', {
    name: 'billPlanList',
    nullable: true,
    length: 255,
  })
  billPlanList: string | null;

  @Column('character varying', {
    name: 'preferredContactTime',
    nullable: true,
    length: 255,
  })
  preferredContactTime: string | null;

  @Column('character varying', {
    name: 'beneficiaryName',
    nullable: true,
    length: 255,
  })
  beneficiaryName: string | null;

  @Column('character varying', {
    name: 'yearsAtPreviousAddress',
    nullable: true,
    length: 255,
  })
  yearsAtPreviousAddress: string | null;

  @Column('character varying', {
    name: 'monthsAtPreviousAddress',
    nullable: true,
    length: 255,
  })
  monthsAtPreviousAddress: string | null;

  @Column('character varying', {
    name: 'monthsAtCurrentAddress',
    nullable: true,
    length: 255,
  })
  monthsAtCurrentAddress: string | null;

  @Column('character varying', {
    name: 'addressCode',
    nullable: true,
    length: 255,
  })
  addressCode: string | null;

  @Column('character varying', {
    name: 'spouseSsn',
    nullable: true,
    length: 255,
  })
  spouseSsn: string | null;

  @Column('character varying', {
    name: 'spouseSsnHash',
    nullable: true,
    length: 255,
  })
  spouseSsnHash: string | null;

  @Column('character varying', {
    name: 'spouseRelationship',
    nullable: true,
    length: 255,
  })
  spouseRelationship: string | null;

  @Column('character varying', {
    name: 'hasAdditionalVehiclesNotInsured',
    nullable: true,
    length: 255,
  })
  hasAdditionalVehiclesNotInsured: string | null;

  @Column('boolean', {
    name: 'isExistingEZLynxApplicant',
    nullable: true,
    default: () => 'false',
  })
  isExistingEzLynxApplicant: boolean | null;

  @Column('character varying', {
    name: 'relationship',
    nullable: true,
    length: 255,
  })
  relationship: string | null;

  @Column('character varying', {
    name: 'yearsSinceHospittalized',
    nullable: true,
    length: 255,
  })
  yearsSinceHospittalized: string | null;

  @Column('json', { name: 'validations', nullable: true })
  validations: any | null;

  @Column('boolean', {
    name: 'integrationsAreValid',
    nullable: true,
    default: () => 'false',
  })
  integrationsAreValid: boolean | null;

  @Column('character varying', {
    name: 'formStatus',
    nullable: true,
    length: 255,
  })
  formStatus: string | null;

  @Column('timestamp with time zone', {
    name: 'cronTriggerFireDate',
    nullable: true,
  })
  cronTriggerFireDate: Date | null;

  @Column('varchar', { name: 'cronTriggerLog', nullable: true, array: true })
  cronTriggerLog: string[] | null;

  @Column('integer', { name: 'clientLifecycleId' })
  clientLifecycleId: number;

  @Column('integer', { name: 'flowClientId' })
  flowClientId: number;

  @Column('boolean', { name: 'validationsPassed' })
  validationsPassed: boolean;

  @OneToMany(() => Businesses, (businesses) => businesses.clients)
  businesses: Businesses[];

  @OneToMany(() => FormAnalytics, (formAnalytics) => formAnalytics.client)
  formAnalytics: FormAnalytics[];

  @ManyToOne(() => Agents, (agents) => agents.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientAgentId', referencedColumnName: 'id' }])
  agents: Agents[];

  @ManyToOne(() => Companies, (companies) => companies.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyClientId', referencedColumnName: 'id' }])
  companies: Companies[];

  @ManyToOne(() => Lifecycles, (lifecycles) => lifecycles.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'clientLifecycleId', referencedColumnName: 'id' })
  lifecycles: Lifecycles[];

  @ManyToOne(() => Flows, (flows) => flows.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'flowClientId', referencedColumnName: 'id' }])
  flows: Flows;

  @OneToMany(() => Drivers, (drivers) => drivers.client)
  drivers: Drivers[];

  @OneToMany(() => Emails, (emails) => emails.clientEmail)
  emails: Emails[];

  @OneToMany(() => Homes, (homes) => homes.client)
  homes: Homes[];

  @OneToMany(() => Incidents, (incidents) => incidents.client)
  incidents: Incidents[];

  @OneToMany(
    () => LifecycleAnalytics,
    (lifecycleAnalytics) => lifecycleAnalytics.clientLifecycleAnalytic
  )
  lifecycleAnalytics: LifecycleAnalytics[];

  @OneToMany(() => Locations, (locations) => locations.clientLocation)
  locations: Locations[];

  @OneToMany(() => Notes, (notes) => notes.clients)
  notes: Notes[];

  @OneToMany(() => Policies, (policies) => policies.clientPolicy)
  policies: Policies[];

  @OneToMany(() => Rates, (rates) => rates.clientRate)
  rates: Rates[];

  @OneToMany(
    () => RecreationalVehicles,
    (recreationalVehicles) => recreationalVehicles.client
  )
  recreationalVehicles: RecreationalVehicles[];

  @OneToMany(() => Tasks, (tasks) => tasks.client)
  tasks: Tasks[];

  @OneToMany(
    () => TextMessages,
    (textMessages) => textMessages.clientTextMessage
  )
  textMessages: TextMessages[];

  @OneToMany(() => Vehicles, (vehicles) => vehicles.clientVehicle)
  vehicles: Vehicles[];
}
