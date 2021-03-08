import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Clients } from '../client/client.entity';
@Entity('Businesses', { schema: 'public' })
export class Businesses {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'entityName',
    nullable: true,
    length: 255,
  })
  entityName: string | null;

  @Column('character varying', {
    name: 'entityType',
    nullable: true,
    length: 255,
  })
  entityType: string | null;

  @Column('character varying', { name: 'dba', nullable: true, length: 255 })
  dba: string | null;

  @Column('character varying', {
    name: 'MCMXFFNumbers',
    nullable: true,
    length: 255,
  })
  mcmxffNumbers: string | null;

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

  @Column('character varying', { name: 'city', nullable: true, length: 255 })
  city: string | null;

  @Column('character varying', { name: 'state', nullable: true, length: 255 })
  state: string | null;

  @Column('character varying', { name: 'zipCode', nullable: true, length: 255 })
  zipCode: string | null;

  @Column('character varying', {
    name: 'fullAddress',
    nullable: true,
    length: 255,
  })
  fullAddress: string | null;

  @Column('character varying', {
    name: 'usDotNumber',
    nullable: true,
    length: 255,
  })
  usDotNumber: string | null;

  @Column('character varying', {
    name: 'numberOfTractors',
    nullable: true,
    length: 255,
  })
  numberOfTractors: string | null;

  @Column('character varying', {
    name: 'numberOfTrailers',
    nullable: true,
    length: 255,
  })
  numberOfTrailers: string | null;

  @Column('character varying', {
    name: 'listOfTractors',
    nullable: true,
    length: 255,
  })
  listOfTractors: string | null;

  @Column('character varying', {
    name: 'listOfTrailers',
    nullable: true,
    length: 255,
  })
  listOfTrailers: string | null;

  @Column('character varying', {
    name: 'numberOfDrivers',
    nullable: true,
    length: 255,
  })
  numberOfDrivers: string | null;

  @Column('character varying', {
    name: 'listOfDrivers',
    nullable: true,
    length: 255,
  })
  listOfDrivers: string | null;

  @Column('character varying', { name: 'cargo', nullable: true, length: 255 })
  cargo: string | null;

  @Column('character varying', {
    name: 'cargoLimit',
    nullable: true,
    length: 255,
  })
  cargoLimit: string | null;

  @Column('character varying', {
    name: 'autoLiabilityLimits',
    nullable: true,
    length: 255,
  })
  autoLiabilityLimits: string | null;

  @Column('character varying', {
    name: 'hasLiabilityClaims',
    nullable: true,
    length: 255,
  })
  hasLiabilityClaims: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'companyBusinessId', nullable: true })
  companyBusinessId: number | null;

  @Column('integer', { name: 'clientBusinessId', nullable: true })
  clientBusinessId: number | null;

  @Column('character varying', { name: 'website', nullable: true, length: 255 })
  website: string | null;

  @Column('character varying', {
    name: 'leasedCompanyName',
    nullable: true,
    length: 255,
  })
  leasedCompanyName: string | null;

  @Column('character varying', {
    name: 'yearsOfPrimaryLiabilityCoverage',
    nullable: true,
    length: 255,
  })
  yearsOfPrimaryLiabilityCoverage: string | null;

  @Column('character varying', {
    name: 'hasRelatedBroker',
    nullable: true,
    length: 255,
  })
  hasRelatedBroker: string | null;

  @Column('character varying', {
    name: 'relatedBrokerMCNumber',
    nullable: true,
    length: 255,
  })
  relatedBrokerMcNumber: string | null;

  @Column('timestamp with time zone', {
    name: 'entityStartDate',
    nullable: true,
  })
  entityStartDate: Date | null;

  @Column('character varying', {
    name: 'annualMiles',
    nullable: true,
    length: 255,
  })
  annualMiles: string | null;

  @Column('character varying', {
    name: 'annualRevenue',
    nullable: true,
    length: 255,
  })
  annualRevenue: string | null;

  @Column('character varying', {
    name: 'locationsEntered',
    nullable: true,
    length: 255,
  })
  locationsEntered: string | null;

  @Column('character varying', {
    name: 'hasFilingsNeeded',
    nullable: true,
    length: 255,
  })
  hasFilingsNeeded: string | null;

  @Column('character varying', {
    name: 'filingMCNumbers',
    nullable: true,
    length: 255,
  })
  filingMcNumbers: string | null;

  @Column('character varying', {
    name: 'hasCancelled',
    nullable: true,
    length: 255,
  })
  hasCancelled: string | null;

  @Column('character varying', {
    name: 'hasRiskCoveredByWorkersComp',
    nullable: true,
    length: 255,
  })
  hasRiskCoveredByWorkersComp: string | null;

  @Column('character varying', {
    name: 'yearsOwnedCommercialEquipment',
    nullable: true,
    length: 255,
  })
  yearsOwnedCommercialEquipment: string | null;

  @Column('character varying', {
    name: 'pullLoad',
    nullable: true,
    length: 255,
  })
  pullLoad: string | null;

  @Column('character varying', {
    name: 'allowsNonEmployeePassengers',
    nullable: true,
    length: 255,
  })
  allowsNonEmployeePassengers: string | null;

  @Column('character varying', { name: 'umLimit', nullable: true, length: 255 })
  umLimit: string | null;

  @Column('character varying', {
    name: 'pipLimit',
    nullable: true,
    length: 255,
  })
  pipLimit: string | null;

  @Column('character varying', {
    name: 'medPayments',
    nullable: true,
    length: 255,
  })
  medPayments: string | null;

  @Column('character varying', {
    name: 'genLiabilityLimit',
    nullable: true,
    length: 255,
  })
  genLiabilityLimit: string | null;

  @Column('character varying', {
    name: 'hiredAutoLimit',
    nullable: true,
    length: 255,
  })
  hiredAutoLimit: string | null;

  @Column('character varying', {
    name: 'trailerInterchangeLimit',
    nullable: true,
    length: 255,
  })
  trailerInterchangeLimit: string | null;

  @Column('character varying', {
    name: 'businessType',
    nullable: true,
    length: 255,
  })
  businessType: string | null;

  @Column('character varying', {
    name: 'businessStartMonth',
    nullable: true,
    length: 255,
  })
  businessStartMonth: string | null;

  @Column('character varying', {
    name: 'businessStartYear',
    nullable: true,
    length: 255,
  })
  businessStartYear: string | null;

  @Column('character varying', {
    name: 'yearsInBusiness',
    nullable: true,
    length: 255,
  })
  yearsInBusiness: string | null;

  @Column('character varying', {
    name: 'numberOfEmployees',
    nullable: true,
    length: 255,
  })
  numberOfEmployees: string | null;

  @Column('character varying', {
    name: 'industry',
    nullable: true,
    length: 255,
  })
  industry: string | null;

  @Column('character varying', {
    name: 'hasHadCyberAttack',
    nullable: true,
    length: 255,
  })
  hasHadCyberAttack: string | null;

  @Column('character varying', {
    name: 'hasSoftwareBusiness',
    nullable: true,
    length: 255,
  })
  hasSoftwareBusiness: string | null;

  @Column('character varying', {
    name: 'numberOfProtectedRecords',
    nullable: true,
    length: 255,
  })
  numberOfProtectedRecords: string | null;

  @Column('character varying', {
    name: 'hasCryptoCurrencyBusiness',
    nullable: true,
    length: 255,
  })
  hasCryptoCurrencyBusiness: string | null;

  @Column('character varying', {
    name: 'hasAntiVirus',
    nullable: true,
    length: 255,
  })
  hasAntiVirus: string | null;

  @Column('character varying', {
    name: 'hasHippaCompliance',
    nullable: true,
    length: 255,
  })
  hasHippaCompliance: string | null;

  @Column('character varying', {
    name: 'cyberLimit',
    nullable: true,
    length: 255,
  })
  cyberLimit: string | null;

  @Column('character varying', { name: 'ein', nullable: true, length: 255 })
  ein: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('character varying', {
    name: 'annualPayroll',
    nullable: true,
    length: 255,
  })
  annualPayroll: string | null;

  @Column('character varying', {
    name: 'hasOtherBusinessPartners',
    nullable: true,
    length: 255,
  })
  hasOtherBusinessPartners: string | null;

  @Column('text', { name: 'businessPartners', nullable: true })
  businessPartners: string | null;

  @Column('character varying', {
    name: 'hasOtherLocations',
    nullable: true,
    length: 255,
  })
  hasOtherLocations: string | null;

  @Column('text', { name: 'otherLocations', nullable: true })
  otherLocations: string | null;

  @Column('character varying', {
    name: 'buildingSquareFt',
    nullable: true,
    length: 255,
  })
  buildingSquareFt: string | null;

  @Column('character varying', {
    name: 'percentOfBusinessFromInternet',
    nullable: true,
    length: 255,
  })
  percentOfBusinessFromInternet: string | null;

  @Column('character varying', {
    name: 'hasSensitiveRecords',
    nullable: true,
    length: 255,
  })
  hasSensitiveRecords: string | null;

  @Column('character varying', {
    name: 'sensitiveRecordsDescription',
    nullable: true,
    length: 255,
  })
  sensitiveRecordsDescription: string | null;

  @Column('character varying', {
    name: 'certificateHolderName',
    nullable: true,
    length: 255,
  })
  certificateHolderName: string | null;

  @Column('character varying', {
    name: 'equipmentValue',
    nullable: true,
    length: 255,
  })
  equipmentValue: string | null;

  @Column('character varying', {
    name: 'hasDamage',
    nullable: true,
    length: 255,
  })
  hasDamage: string | null;

  @Column('character varying', {
    name: 'collisionDamageValue',
    nullable: true,
    length: 255,
  })
  collisionDamageValue: string | null;

  @Column('character varying', {
    name: 'nonCollisionDamageValue',
    nullable: true,
    length: 255,
  })
  nonCollisionDamageValue: string | null;

  @Column('character varying', {
    name: 'certificateHolderPreferredContact',
    nullable: true,
    length: 255,
  })
  certificateHolderPreferredContact: string | null;

  @Column('character varying', {
    name: 'certificateHolderEmail',
    nullable: true,
    length: 255,
  })
  certificateHolderEmail: string | null;

  @Column('character varying', {
    name: 'certificateHolderWebsite',
    nullable: true,
    length: 255,
  })
  certificateHolderWebsite: string | null;

  @Column('character varying', {
    name: 'certificateHolderFax',
    nullable: true,
    length: 255,
  })
  certificateHolderFax: string | null;

  @Column('character varying', {
    name: 'certificateHolderAdditionalInsured',
    nullable: true,
    length: 255,
  })
  certificateHolderAdditionalInsured: string | null;

  @Column('character varying', {
    name: 'certificateHolderCoiLanguage',
    nullable: true,
    length: 255,
  })
  certificateHolderCoiLanguage: string | null;

  @Column('character varying', {
    name: 'numberOfPartTimeEmployees',
    nullable: true,
    length: 255,
  })
  numberOfPartTimeEmployees: string | null;

  @Column('character varying', {
    name: 'percentOwnership',
    nullable: true,
    length: 255,
  })
  percentOwnership: string | null;

  @Column('character varying', {
    name: 'annualGrossReceipts',
    nullable: true,
    length: 255,
  })
  annualGrossReceipts: string | null;

  @Column('character varying', {
    name: 'hasSubContractingExpenses',
    nullable: true,
    length: 255,
  })
  hasSubContractingExpenses: string | null;

  @Column('character varying', {
    name: 'isNewVenture',
    nullable: true,
    length: 255,
  })
  isNewVenture: string | null;

  @Column('character varying', {
    name: 'ownOrLeaseOffice',
    nullable: true,
    length: 255,
  })
  ownOrLeaseOffice: string | null;

  @Column('character varying', {
    name: 'personalPropertyCoverage',
    nullable: true,
    length: 255,
  })
  personalPropertyCoverage: string | null;

  @Column('character varying', {
    name: 'commonCertificateHolderName',
    nullable: true,
    length: 255,
  })
  commonCertificateHolderName: string | null;

  @Column('character varying', {
    name: 'cargoLimitDeductible',
    nullable: true,
    length: 255,
  })
  cargoLimitDeductible: string | null;

  @Column('text', { name: 'businessPlanDescription', nullable: true })
  businessPlanDescription: string | null;

  @Column('character varying', {
    name: 'streetAddress',
    nullable: true,
    length: 255,
  })
  streetAddress: string | null;

  @Column('character varying', {
    name: 'statesEntered',
    nullable: true,
    length: 255,
  })
  statesEntered: string | null;

  @Column('character varying', {
    name: 'citiesEntered',
    nullable: true,
    length: 255,
  })
  citiesEntered: string | null;

  @Column('character varying', {
    name: 'subcontractingExpenses',
    nullable: true,
    length: 255,
  })
  subcontractingExpenses: string | null;

  @Column('character varying', {
    name: 'constructionType',
    nullable: true,
    length: 255,
  })
  constructionType: string | null;

  @Column('character varying', {
    name: 'yearBuilt',
    nullable: true,
    length: 255,
  })
  yearBuilt: string | null;

  @Column('text', { name: 'renovationDetails', nullable: true })
  renovationDetails: string | null;

  @Column('character varying', {
    name: 'hasCentralFireAlarm',
    nullable: true,
    length: 255,
  })
  hasCentralFireAlarm: string | null;

  @Column('character varying', {
    name: 'hasCentralSecurityAlarm',
    nullable: true,
    length: 255,
  })
  hasCentralSecurityAlarm: string | null;

  @Column('character varying', {
    name: 'buildingHasDangerousMaterial',
    nullable: true,
    length: 255,
  })
  buildingHasDangerousMaterial: string | null;

  @Column('text', { name: 'buildingLienHoldersDetails', nullable: true })
  buildingLienHoldersDetails: string | null;

  @Column('text', { name: 'additionalInsuredDetails', nullable: true })
  additionalInsuredDetails: string | null;

  @Column('character varying', {
    name: 'hasAutos',
    nullable: true,
    length: 255,
  })
  hasAutos: string | null;

  @Column('text', { name: 'autoDetails', nullable: true })
  autoDetails: string | null;

  @Column('text', { name: 'workerDetails', nullable: true })
  workerDetails: string | null;

  @Column('text', { name: 'equipmentDetails', nullable: true })
  equipmentDetails: string | null;

  @Column('character varying', {
    name: 'includeOwnerInCoverage',
    nullable: true,
    length: 255,
  })
  includeOwnerInCoverage: string | null;

  @Column('character varying', {
    name: 'reeferDeductible',
    nullable: true,
    length: 255,
  })
  reeferDeductible: string | null;

  @Column('character varying', {
    name: 'needsCargoCoverage',
    nullable: true,
    length: 255,
  })
  needsCargoCoverage: string | null;

  @Column('character varying', {
    name: 'hasHazardousCargo',
    nullable: true,
    length: 255,
  })
  hasHazardousCargo: string | null;

  @Column('character varying', {
    name: 'needsHiredAutoCoverage',
    nullable: true,
    length: 255,
  })
  needsHiredAutoCoverage: string | null;

  @Column('character varying', {
    name: 'isOtherEntity',
    nullable: true,
    length: 255,
  })
  isOtherEntity: string | null;

  @Column('character varying', {
    name: 'hasOtherSubsidiaries',
    nullable: true,
    length: 255,
  })
  hasOtherSubsidiaries: string | null;

  @Column('character varying', {
    name: 'hasSafetyProgram',
    nullable: true,
    length: 255,
  })
  hasSafetyProgram: string | null;

  @Column('character varying', {
    name: 'hasOtherInsuranceWithCompany',
    nullable: true,
    length: 255,
  })
  hasOtherInsuranceWithCompany: string | null;

  @Column('character varying', {
    name: 'hasHadMisconductClaims',
    nullable: true,
    length: 255,
  })
  hasHadMisconductClaims: string | null;

  @Column('character varying', {
    name: 'hasBeenConvicted',
    nullable: true,
    length: 255,
  })
  hasBeenConvicted: string | null;

  @Column('character varying', {
    name: 'hasSafetyViolations',
    nullable: true,
    length: 255,
  })
  hasSafetyViolations: string | null;

  @Column('character varying', {
    name: 'hadBankruptcy',
    nullable: true,
    length: 255,
  })
  hadBankruptcy: string | null;

  @Column('character varying', { name: 'hadLien', nullable: true, length: 255 })
  hadLien: string | null;

  @Column('character varying', {
    name: 'hasTrust',
    nullable: true,
    length: 255,
  })
  hasTrust: string | null;

  @Column('character varying', {
    name: 'hasForeignOperations',
    nullable: true,
    length: 255,
  })
  hasForeignOperations: string | null;

  @Column('character varying', {
    name: 'hasOtherVentures',
    nullable: true,
    length: 255,
  })
  hasOtherVentures: string | null;

  @Column('character varying', {
    name: 'uimLimit',
    nullable: true,
    length: 255,
  })
  uimLimit: string | null;

  @Column('character varying', {
    name: 'nonOwnedLimit',
    nullable: true,
    length: 255,
  })
  nonOwnedLimit: string | null;

  @Column('character varying', {
    name: 'glassCoverageLimit',
    nullable: true,
    length: 255,
  })
  glassCoverageLimit: string | null;

  @Column('character varying', {
    name: 'hadTailCoverage',
    nullable: true,
    length: 255,
  })
  hadTailCoverage: string | null;

  @Column('character varying', {
    name: 'hasPriorCoverageExclusions',
    nullable: true,
    length: 255,
  })
  hasPriorCoverageExclusions: string | null;

  @Column('varchar', { name: 'typesOfOperations', nullable: true, array: true })
  typesOfOperations: string[] | null;

  @Column('character varying', {
    name: 'hasSubcontractorsCertOfInsurance',
    nullable: true,
    length: 255,
  })
  hasSubcontractorsCertOfInsurance: string | null;

  @Column('character varying', {
    name: 'hasMoreCoverageThanSubcontractors',
    nullable: true,
    length: 255,
  })
  hasMoreCoverageThanSubcontractors: string | null;

  @Column('character varying', {
    name: 'hasSafetyMarketing',
    nullable: true,
    length: 255,
  })
  hasSafetyMarketing: string | null;

  @Column('character varying', {
    name: 'hadCrimeOnPremises',
    nullable: true,
    length: 255,
  })
  hadCrimeOnPremises: string | null;

  @Column('character varying', {
    name: 'hasDayCare',
    nullable: true,
    length: 255,
  })
  hasDayCare: string | null;

  @Column('character varying', {
    name: 'hasPlansForDemolition',
    nullable: true,
    length: 255,
  })
  hasPlansForDemolition: string | null;

  @Column('character varying', {
    name: 'hasPlansForStructurialChanges',
    nullable: true,
    length: 255,
  })
  hasPlansForStructurialChanges: string | null;

  @Column('character varying', {
    name: 'hasPools',
    nullable: true,
    length: 255,
  })
  hasPools: string | null;

  @Column('character varying', {
    name: 'hasDocksOrFloats',
    nullable: true,
    length: 255,
  })
  hasDocksOrFloats: string | null;

  @Column('character varying', {
    name: 'hasParkingFacilities',
    nullable: true,
    length: 255,
  })
  hasParkingFacilities: string | null;

  @Column('character varying', {
    name: 'hasFeeAtParkingFacilities',
    nullable: true,
    length: 255,
  })
  hasFeeAtParkingFacilities: string | null;

  @Column('character varying', {
    name: 'hasRecreationalFacilities',
    nullable: true,
    length: 255,
  })
  hasRecreationalFacilities: string | null;

  @Column('character varying', {
    name: 'hasSportingOrSocialEvents',
    nullable: true,
    length: 255,
  })
  hasSportingOrSocialEvents: string | null;

  @Column('character varying', {
    name: 'requiresVendorsCoverage',
    nullable: true,
    length: 255,
  })
  requiresVendorsCoverage: string | null;

  @Column('character varying', {
    name: 'hadDiscontinuedOperations',
    nullable: true,
    length: 255,
  })
  hadDiscontinuedOperations: string | null;

  @Column('character varying', {
    name: 'hasSalesWithApplicants',
    nullable: true,
    length: 255,
  })
  hasSalesWithApplicants: string | null;

  @Column('character varying', {
    name: 'hasLaborInterchange',
    nullable: true,
    length: 255,
  })
  hasLaborInterchange: string | null;

  @Column('character varying', {
    name: 'hasRepackagedProducts',
    nullable: true,
    length: 255,
  })
  hasRepackagedProducts: string | null;

  @Column('character varying', {
    name: 'repackagesSoldProducts',
    nullable: true,
    length: 255,
  })
  repackagesSoldProducts: string | null;

  @Column('character varying', {
    name: 'hasMedicalOperations',
    nullable: true,
    length: 255,
  })
  hasMedicalOperations: string | null;

  @Column('character varying', {
    name: 'hasExposureToRadioactives',
    nullable: true,
    length: 255,
  })
  hasExposureToRadioactives: string | null;

  @Column('character varying', {
    name: 'hasHazardousMaterial',
    nullable: true,
    length: 255,
  })
  hasHazardousMaterial: string | null;

  @Column('character varying', {
    name: 'hasFormalWrittenSafetyPolicy',
    nullable: true,
    length: 255,
  })
  hasFormalWrittenSafetyPolicy: string | null;

  @Column('character varying', {
    name: 'hadProductsRecalled',
    nullable: true,
    length: 255,
  })
  hadProductsRecalled: string | null;

  @Column('character varying', {
    name: 'totalCoverage',
    nullable: true,
    length: 255,
  })
  totalCoverage: string | null;

  @Column('character varying', {
    name: 'injuryCoverage',
    nullable: true,
    length: 255,
  })
  injuryCoverage: string | null;

  @Column('character varying', {
    name: 'eachOccurrenceCoverage',
    nullable: true,
    length: 255,
  })
  eachOccurrenceCoverage: string | null;

  @Column('character varying', {
    name: 'rentedPremisesCoverage',
    nullable: true,
    length: 255,
  })
  rentedPremisesCoverage: string | null;

  @Column('character varying', {
    name: 'medicalExpenseCoverage',
    nullable: true,
    length: 255,
  })
  medicalExpenseCoverage: string | null;

  @Column('character varying', {
    name: 'employeeBenefitCoverage',
    nullable: true,
    length: 255,
  })
  employeeBenefitCoverage: string | null;

  @Column('character varying', {
    name: 'leasesAutos',
    nullable: true,
    length: 255,
  })
  leasesAutos: string | null;

  @Column('character varying', {
    name: 'ownAutos',
    nullable: true,
    length: 255,
  })
  ownAutos: string | null;

  @Column('character varying', {
    name: 'certificateRequestDate',
    nullable: true,
    length: 255,
  })
  certificateRequestDate: string | null;

  @Column('character varying', {
    name: 'certificateEffectiveDate',
    nullable: true,
    length: 255,
  })
  certificateEffectiveDate: string | null;

  @Column('text', { name: 'regularRouteDetails', nullable: true })
  regularRouteDetails: string | null;

  @Column('varchar', { name: 'majorCitiesList', nullable: true, array: true })
  majorCitiesList: string[] | null;

  @Column('varchar', { name: 'hasELD', nullable: true, array: true })
  hasEld: string[] | null;

  @Column('varchar', { name: 'eldProvider', nullable: true, array: true })
  eldProvider: string[] | null;

  @Column('character varying', {
    name: 'minDrivingYearsRequired',
    nullable: true,
    length: 255,
  })
  minDrivingYearsRequired: string | null;

  @Column('character varying', {
    name: 'priorLiabilityLimits',
    nullable: true,
    length: 255,
  })
  priorLiabilityLimits: string | null;

  @Column('character varying', {
    name: 'unitNumber',
    nullable: true,
    length: 255,
  })
  unitNumber: string | null;

  @Column('character varying', { name: 'phone', nullable: true, length: 255 })
  phone: string | null;

  @Column('character varying', {
    name: 'yearsInIndustry',
    nullable: true,
    length: 255,
  })
  yearsInIndustry: string | null;

  @Column('character varying', {
    name: 'percentOfWorkSubcontracted',
    nullable: true,
    length: 255,
  })
  percentOfWorkSubcontracted: string | null;

  @Column('character varying', {
    name: 'hasContractsWithSubcontractors',
    nullable: true,
    length: 255,
  })
  hasContractsWithSubcontractors: string | null;

  @Column('character varying', {
    name: 'isOnSubcontractorGLPolicies',
    nullable: true,
    length: 255,
  })
  isOnSubcontractorGlPolicies: string | null;

  @Column('character varying', {
    name: 'subcontractorsHaveWorkersComp',
    nullable: true,
    length: 255,
  })
  subcontractorsHaveWorkersComp: string | null;

  @Column('character varying', {
    name: 'systemsForProtectingPublicFromInjury',
    nullable: true,
    length: 255,
  })
  systemsForProtectingPublicFromInjury: string | null;

  @Column('character varying', {
    name: 'materialLiftingEquipment',
    nullable: true,
    length: 255,
  })
  materialLiftingEquipment: string | null;

  @Column('character varying', {
    name: 'maxBuildingHeight',
    nullable: true,
    length: 255,
  })
  maxBuildingHeight: string | null;

  @Column('character varying', {
    name: 'roofOpeningProtection',
    nullable: true,
    length: 255,
  })
  roofOpeningProtection: string | null;

  @Column('character varying', {
    name: 'nrcaMember',
    nullable: true,
    length: 255,
  })
  nrcaMember: string | null;

  @Column('varchar', { name: 'typesOfBuildings', nullable: true, array: true })
  typesOfBuildings: string[] | null;

  @Column('character varying', {
    name: 'percentOfProjectsResidential',
    nullable: true,
    length: 255,
  })
  percentOfProjectsResidential: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsNew',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsNew: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsRepair',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsRepair: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsPitchedRoof',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsPitchedRoof: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsFlatRoof',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsFlatRoof: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsMetal',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsMetal: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsClayConcreteTile',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsClayConcreteTile: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsColdAppliedMembranes',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsColdAppliedMembranes: string | null;

  @Column('character varying', {
    name: 'percentOfResidentialProjectsIsHeatApplied',
    nullable: true,
    length: 255,
  })
  percentOfResidentialProjectsIsHeatApplied: string | null;

  @Column('character varying', {
    name: 'percentOfProjectsCommercial',
    nullable: true,
    length: 255,
  })
  percentOfProjectsCommercial: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsNew',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsNew: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsRepair',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsRepair: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsPitchedRoof',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsPitchedRoof: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsFlatRoof',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsFlatRoof: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsMetal',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsMetal: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsClayConcreteTile',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsClayConcreteTile: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsColdAppliedMembranes',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsColdAppliedMembranes: string | null;

  @Column('character varying', {
    name: 'percentOfCommercialProjectsIsHeatApplied',
    nullable: true,
    length: 255,
  })
  percentOfCommercialProjectsIsHeatApplied: string | null;

  @Column('character varying', {
    name: 'percentOfProjectsIndustrial',
    nullable: true,
    length: 255,
  })
  percentOfProjectsIndustrial: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsNew',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsNew: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsRepair',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsRepair: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsPitchedRoof',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsPitchedRoof: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsFlatRoof',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsFlatRoof: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsMetal',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsMetal: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsClayConcreteTile',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsClayConcreteTile: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsColdAppliedMembranes',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsColdAppliedMembranes: string | null;

  @Column('character varying', {
    name: 'percentOfIndustrialProjectsIsHeatApplied',
    nullable: true,
    length: 255,
  })
  percentOfIndustrialProjectsIsHeatApplied: string | null;

  @Column('text', { name: 'comments', nullable: true })
  comments: string | null;

  @Column('character varying', {
    name: 'blanketInsurance',
    nullable: true,
    length: 255,
  })
  blanketInsurance: string | null;

  @Column('character varying', {
    name: 'hasLicense',
    nullable: true,
    length: 255,
  })
  hasLicense: string | null;

  @Column('character varying', {
    name: 'licenseYear',
    nullable: true,
    length: 255,
  })
  licenseYear: string | null;

  @Column('character varying', {
    name: 'licenseType',
    nullable: true,
    length: 255,
  })
  licenseType: string | null;

  @Column('character varying', {
    name: 'licenseNumber',
    nullable: true,
    length: 255,
  })
  licenseNumber: string | null;

  @Column('character varying', {
    name: 'generalContractorPercent',
    nullable: true,
    length: 255,
  })
  generalContractorPercent: string | null;

  @Column('character varying', {
    name: 'subcontractorPercent',
    nullable: true,
    length: 255,
  })
  subcontractorPercent: string | null;

  @Column('character varying', {
    name: 'constructionManagerPercent',
    nullable: true,
    length: 255,
  })
  constructionManagerPercent: string | null;

  @Column('character varying', {
    name: 'developerPercent',
    nullable: true,
    length: 255,
  })
  developerPercent: string | null;

  @Column('character varying', {
    name: 'withPenaltyClausePercent',
    nullable: true,
    length: 255,
  })
  withPenaltyClausePercent: string | null;

  @Column('character varying', {
    name: 'otherVentureDetails',
    nullable: true,
    length: 255,
  })
  otherVentureDetails: string | null;

  @Column('character varying', {
    name: 'otherVenturesCovered',
    nullable: true,
    length: 255,
  })
  otherVenturesCovered: string | null;

  @Column('character varying', {
    name: 'hasRecruitingAgency',
    nullable: true,
    length: 255,
  })
  hasRecruitingAgency: string | null;

  @Column('text', { name: 'recruitingAgencyDetails', nullable: true })
  recruitingAgencyDetails: string | null;

  @Column('character varying', {
    name: 'radiusOfOperations',
    nullable: true,
    length: 255,
  })
  radiusOfOperations: string | null;

  @Column('character varying', {
    name: 'payrollOfOwners',
    nullable: true,
    length: 255,
  })
  payrollOfOwners: string | null;

  @Column('character varying', {
    name: 'payrollOfEmployees',
    nullable: true,
    length: 255,
  })
  payrollOfEmployees: string | null;

  @Column('character varying', {
    name: 'hasLicensedLabor',
    nullable: true,
    length: 255,
  })
  hasLicensedLabor: string | null;

  @Column('character varying', {
    name: 'hasOperationsUnderOCP',
    nullable: true,
    length: 255,
  })
  hasOperationsUnderOcp: string | null;

  @Column('character varying', {
    name: 'OCPOperationDetails',
    nullable: true,
    length: 255,
  })
  ocpOperationDetails: string | null;

  @Column('character varying', {
    name: 'commercialIndustrialPercent',
    nullable: true,
    length: 255,
  })
  commercialIndustrialPercent: string | null;

  @Column('character varying', {
    name: 'residentialApartmentsPercent',
    nullable: true,
    length: 255,
  })
  residentialApartmentsPercent: string | null;

  @Column('character varying', {
    name: 'commercialInstitutionalPercent',
    nullable: true,
    length: 255,
  })
  commercialInstitutionalPercent: string | null;

  @Column('character varying', {
    name: 'residentialCondosPercent',
    nullable: true,
    length: 255,
  })
  residentialCondosPercent: string | null;

  @Column('character varying', {
    name: 'commercialMercantilePercent',
    nullable: true,
    length: 255,
  })
  commercialMercantilePercent: string | null;

  @Column('character varying', {
    name: 'residentialCustomPercent',
    nullable: true,
    length: 255,
  })
  residentialCustomPercent: string | null;

  @Column('character varying', {
    name: 'commercialOfficePercent',
    nullable: true,
    length: 255,
  })
  commercialOfficePercent: string | null;

  @Column('character varying', {
    name: 'residentialTractPercent',
    nullable: true,
    length: 255,
  })
  residentialTractPercent: string | null;

  @Column('character varying', {
    name: 'commercialStructuralPercent',
    nullable: true,
    length: 255,
  })
  commercialStructuralPercent: string | null;

  @Column('character varying', {
    name: 'residentialStructuralPercent',
    nullable: true,
    length: 255,
  })
  residentialStructuralPercent: string | null;

  @Column('character varying', {
    name: 'commercialNonstructuralPercent',
    nullable: true,
    length: 255,
  })
  commercialNonstructuralPercent: string | null;

  @Column('character varying', {
    name: 'residentialNonstructuralPercent',
    nullable: true,
    length: 255,
  })
  residentialNonstructuralPercent: string | null;

  @Column('character varying', {
    name: 'commercialOtherPercent',
    nullable: true,
    length: 255,
  })
  commercialOtherPercent: string | null;

  @Column('character varying', {
    name: 'residentialOtherPercent',
    nullable: true,
    length: 255,
  })
  residentialOtherPercent: string | null;

  @Column('character varying', {
    name: 'hasHoldHarmlessClause',
    nullable: true,
    length: 255,
  })
  hasHoldHarmlessClause: string | null;

  @Column('character varying', {
    name: 'usesSameContractors',
    nullable: true,
    length: 255,
  })
  usesSameContractors: string | null;

  @Column('character varying', {
    name: 'hasCasualLabor',
    nullable: true,
    length: 255,
  })
  hasCasualLabor: string | null;

  @Column('character varying', {
    name: 'hasWorkersComp',
    nullable: true,
    length: 255,
  })
  hasWorkersComp: string | null;

  @Column('character varying', {
    name: 'projectsPlanned',
    nullable: true,
    length: 255,
  })
  projectsPlanned: string | null;

  @Column('character varying', {
    name: 'pastProjects',
    nullable: true,
    length: 255,
  })
  pastProjects: string | null;

  @Column('character varying', {
    name: 'averageJobCost',
    nullable: true,
    length: 255,
  })
  averageJobCost: string | null;

  @Column('character varying', {
    name: 'equipmentRented',
    nullable: true,
    length: 255,
  })
  equipmentRented: string | null;

  @Column('character varying', {
    name: 'leasesMobileEquipment',
    nullable: true,
    length: 255,
  })
  leasesMobileEquipment: string | null;

  @Column('character varying', {
    name: 'mobileEquipmentWithOperators',
    nullable: true,
    length: 255,
  })
  mobileEquipmentWithOperators: string | null;

  @Column('character varying', {
    name: 'mobileEquipmentType',
    nullable: true,
    length: 255,
  })
  mobileEquipmentType: string | null;

  @Column('character varying', {
    name: 'usesCranes',
    nullable: true,
    length: 255,
  })
  usesCranes: string | null;

  @Column('character varying', {
    name: 'boomLength',
    nullable: true,
    length: 255,
  })
  boomLength: string | null;

  @Column('character varying', {
    name: 'performedRepairs',
    nullable: true,
    length: 255,
  })
  performedRepairs: string | null;

  @Column('varchar', {
    name: 'workWithPublicFacilities',
    nullable: true,
    array: true,
  })
  workWithPublicFacilities: string[] | null;

  @Column('character varying', {
    name: 'hasTallProjects',
    nullable: true,
    length: 255,
  })
  hasTallProjects: string | null;

  @Column('character varying', {
    name: 'percentageOfTallWork',
    nullable: true,
    length: 255,
  })
  percentageOfTallWork: string | null;

  @Column('character varying', {
    name: 'tallestProjectHeight',
    nullable: true,
    length: 255,
  })
  tallestProjectHeight: string | null;

  @Column('character varying', {
    name: 'hasUndergroundProjects',
    nullable: true,
    length: 255,
  })
  hasUndergroundProjects: string | null;

  @Column('character varying', {
    name: 'percentageOfUndergroundWork',
    nullable: true,
    length: 255,
  })
  percentageOfUndergroundWork: string | null;

  @Column('character varying', {
    name: 'deepestProjectDepth',
    nullable: true,
    length: 255,
  })
  deepestProjectDepth: string | null;

  @Column('character varying', {
    name: 'hasSlopedWork',
    nullable: true,
    length: 255,
  })
  hasSlopedWork: string | null;

  @Column('character varying', {
    name: 'steepestProjectDegree',
    nullable: true,
    length: 255,
  })
  steepestProjectDegree: string | null;

  @Column('character varying', {
    name: 'hasPlannedRoofRepair',
    nullable: true,
    length: 255,
  })
  hasPlannedRoofRepair: string | null;

  @Column('character varying', {
    name: 'terminated',
    nullable: true,
    length: 255,
  })
  terminated: string | null;

  @Column('character varying', {
    name: 'replacedContractor',
    nullable: true,
    length: 255,
  })
  replacedContractor: string | null;

  @Column('text', { name: 'replacedContractorDetails', nullable: true })
  replacedContractorDetails: string | null;

  @Column('character varying', {
    name: 'hasClaimsAgainstEntities',
    nullable: true,
    length: 255,
  })
  hasClaimsAgainstEntities: string | null;

  @Column('character varying', {
    name: 'hasPossibleClaim',
    nullable: true,
    length: 255,
  })
  hasPossibleClaim: string | null;

  @Column('character varying', {
    name: 'hasFaultyAccusation',
    nullable: true,
    length: 255,
  })
  hasFaultyAccusation: string | null;

  @Column('character varying', {
    name: 'cancelDate',
    nullable: true,
    length: 255,
  })
  cancelDate: string | null;

  @Column('character varying', {
    name: 'binderNumber',
    nullable: true,
    length: 255,
  })
  binderNumber: string | null;

  @Column('character varying', {
    name: 'additionalInterestType',
    nullable: true,
    length: 255,
  })
  additionalInterestType: string | null;

  @Column('text', { name: 'otherInterestDescription', nullable: true })
  otherInterestDescription: string | null;

  @Column('character varying', {
    name: 'retroDate',
    nullable: true,
    length: 255,
  })
  retroDate: string | null;

  @Column('character varying', {
    name: 'aggregateCoverage',
    nullable: true,
    length: 255,
  })
  aggregateCoverage: string | null;

  @Column('character varying', {
    name: 'productsCompletedAggregateCoverage',
    nullable: true,
    length: 255,
  })
  productsCompletedAggregateCoverage: string | null;

  @Column('text', {
    name: 'generalLiabilityCoveragesDescription',
    nullable: true,
  })
  generalLiabilityCoveragesDescription: string | null;

  @Column('character varying', {
    name: 'hasSubcontractors',
    nullable: true,
    length: 255,
  })
  hasSubcontractors: string | null;

  @Column('text', { name: 'otherCoverageDescription', nullable: true })
  otherCoverageDescription: string | null;

  @Column('character varying', {
    name: 'waiverSubrogation',
    nullable: true,
    length: 255,
  })
  waiverSubrogation: string | null;

  @Column('character varying', {
    name: 'otherCoverageLimit',
    nullable: true,
    length: 255,
  })
  otherCoverageLimit: string | null;

  @Column('character varying', {
    name: 'umbrellaDedType',
    nullable: true,
    length: 255,
  })
  umbrellaDedType: string | null;

  @Column('character varying', {
    name: 'umbrellaDedAmount',
    nullable: true,
    length: 255,
  })
  umbrellaDedAmount: string | null;

  @Column('varchar', {
    name: 'typesOfAutoCoverages',
    nullable: true,
    array: true,
  })
  typesOfAutoCoverages: string[] | null;

  @Column('text', { name: 'autoCoveragesDescription', nullable: true })
  autoCoveragesDescription: string | null;

  @Column('character varying', {
    name: 'combinedSingleLimitCoverage',
    nullable: true,
    length: 255,
  })
  combinedSingleLimitCoverage: string | null;

  @Column('character varying', {
    name: 'bodilyInjuryPersonCoverage',
    nullable: true,
    length: 255,
  })
  bodilyInjuryPersonCoverage: string | null;

  @Column('character varying', {
    name: 'bodilyInjuryAccidentCoverage',
    nullable: true,
    length: 255,
  })
  bodilyInjuryAccidentCoverage: string | null;

  @Column('character varying', {
    name: 'propertyDamageCoverage',
    nullable: true,
    length: 255,
  })
  propertyDamageCoverage: string | null;

  @Column('character varying', {
    name: 'uninsuredMotoristCoverage',
    nullable: true,
    length: 255,
  })
  uninsuredMotoristCoverage: string | null;

  @Column('character varying', {
    name: 'otherCoverage',
    nullable: true,
    length: 255,
  })
  otherCoverage: string | null;

  @Column('character varying', {
    name: 'silverwareValue',
    nullable: true,
    length: 255,
  })
  silverwareValue: string | null;

  @Column('character varying', {
    name: 'dateCoverageLapsed',
    nullable: true,
    length: 255,
  })
  dateCoverageLapsed: string | null;

  @Column('character varying', {
    name: 'waterDamage',
    nullable: true,
    length: 255,
  })
  waterDamage: string | null;

  @Column('character varying', {
    name: 'vehicleCoverageType',
    nullable: true,
    length: 255,
  })
  vehicleCoverageType: string | null;

  @Column('character varying', {
    name: 'lossOfHeat',
    nullable: true,
    length: 255,
  })
  lossOfHeat: string | null;

  @Column('character varying', {
    name: 'deductible',
    nullable: true,
    length: 255,
  })
  deductible: string | null;

  @Column('character varying', {
    name: 'garageLiabilityCoverageType',
    nullable: true,
    length: 255,
  })
  garageLiabilityCoverageType: string | null;

  @Column('text', {
    name: 'garageLiabilityCoveragesDescription',
    nullable: true,
  })
  garageLiabilityCoveragesDescription: string | null;

  @Column('character varying', {
    name: 'autoOnlyAccidentCoverage',
    nullable: true,
    length: 255,
  })
  autoOnlyAccidentCoverage: string | null;

  @Column('character varying', {
    name: 'otherThanAutoOnlyAccidentCoverage',
    nullable: true,
    length: 255,
  })
  otherThanAutoOnlyAccidentCoverage: string | null;

  @Column('character varying', {
    name: 'otherThanAutoOnlyAggregateCoverage',
    nullable: true,
    length: 255,
  })
  otherThanAutoOnlyAggregateCoverage: string | null;

  @Column('text', {
    name: 'excessLiabilityCoveragesDescription',
    nullable: true,
  })
  excessLiabilityCoveragesDescription: string | null;

  @Column('character varying', {
    name: 'hasStatutoryLimits',
    nullable: true,
    length: 255,
  })
  hasStatutoryLimits: string | null;

  @Column('character varying', {
    name: 'employerLiabilityAccidentCoverage',
    nullable: true,
    length: 255,
  })
  employerLiabilityAccidentCoverage: string | null;

  @Column('character varying', {
    name: 'employerLiabilityEmployeeCoverage',
    nullable: true,
    length: 255,
  })
  employerLiabilityEmployeeCoverage: string | null;

  @Column('character varying', {
    name: 'employerLiabilityPolicyLimit',
    nullable: true,
    length: 255,
  })
  employerLiabilityPolicyLimit: string | null;

  @Column('text', {
    name: 'workersCompensationCoveragesDescription',
    nullable: true,
  })
  workersCompensationCoveragesDescription: string | null;

  @Column('text', {
    name: 'specialConditionsCoveragesDescription',
    nullable: true,
  })
  specialConditionsCoveragesDescription: string | null;

  @Column('character varying', {
    name: 'specialConditionCoverageFees',
    nullable: true,
    length: 255,
  })
  specialConditionCoverageFees: string | null;

  @Column('character varying', {
    name: 'specialConditionsCoverageTaxes',
    nullable: true,
    length: 255,
  })
  specialConditionsCoverageTaxes: string | null;

  @Column('character varying', {
    name: 'specialConditionsEstimatedPremium',
    nullable: true,
    length: 255,
  })
  specialConditionsEstimatedPremium: string | null;

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
    name: 'previousYearsGross',
    nullable: true,
    length: 255,
  })
  previousYearsGross: string | null;

  @Column('character varying', {
    name: 'certificateHolderFullAddress',
    nullable: true,
    length: 255,
  })
  certificateHolderFullAddress: string | null;

  @Column('character varying', {
    name: 'billingPlan',
    nullable: true,
    length: 255,
  })
  billingPlan: string | null;

  @Column('character varying', {
    name: 'paymentPlan',
    nullable: true,
    length: 255,
  })
  paymentPlan: string | null;

  @Column('character varying', {
    name: 'auditType',
    nullable: true,
    length: 255,
  })
  auditType: string | null;

  @Column('text', { name: 'largestProjects', nullable: true })
  largestProjects: string | null;

  @Column('character varying', {
    name: 'workType',
    nullable: true,
    length: 255,
  })
  workType: string | null;

  @Column('character varying', {
    name: 'percentWorkAirConditioning',
    nullable: true,
    length: 255,
  })
  percentWorkAirConditioning: string | null;

  @Column('character varying', {
    name: 'percentWorkAppliance',
    nullable: true,
    length: 255,
  })
  percentWorkAppliance: string | null;

  @Column('character varying', {
    name: 'percentWorkCabinetry',
    nullable: true,
    length: 255,
  })
  percentWorkCabinetry: string | null;

  @Column('character varying', {
    name: 'percentWorkCarpentry',
    nullable: true,
    length: 255,
  })
  percentWorkCarpentry: string | null;

  @Column('character varying', {
    name: 'percentWorkCleaningCarpets',
    nullable: true,
    length: 255,
  })
  percentWorkCleaningCarpets: string | null;

  @Column('character varying', {
    name: 'percentWorkCleaningOffice',
    nullable: true,
    length: 255,
  })
  percentWorkCleaningOffice: string | null;

  @Column('character varying', {
    name: 'percentWorkDoors',
    nullable: true,
    length: 255,
  })
  percentWorkDoors: string | null;

  @Column('character varying', {
    name: 'percentWorkDriveway',
    nullable: true,
    length: 255,
  })
  percentWorkDriveway: string | null;

  @Column('character varying', {
    name: 'percentWorkDrywall',
    nullable: true,
    length: 255,
  })
  percentWorkDrywall: string | null;

  @Column('character varying', {
    name: 'percentWorkElectrical',
    nullable: true,
    length: 255,
  })
  percentWorkElectrical: string | null;

  @Column('character varying', {
    name: 'percentWorkExteriorPainting',
    nullable: true,
    length: 255,
  })
  percentWorkExteriorPainting: string | null;

  @Column('character varying', {
    name: 'percentWorkInteriorPainting',
    nullable: true,
    length: 255,
  })
  percentWorkInteriorPainting: string | null;

  @Column('character varying', {
    name: 'percentWorkFences',
    nullable: true,
    length: 255,
  })
  percentWorkFences: string | null;

  @Column('character varying', {
    name: 'percentWorkFlooring',
    nullable: true,
    length: 255,
  })
  percentWorkFlooring: string | null;

  @Column('character varying', {
    name: 'percentWorkLandscaping',
    nullable: true,
    length: 255,
  })
  percentWorkLandscaping: string | null;

  @Column('character varying', {
    name: 'percentWorkPlaster',
    nullable: true,
    length: 255,
  })
  percentWorkPlaster: string | null;

  @Column('character varying', {
    name: 'percentWorkPlumbing',
    nullable: true,
    length: 255,
  })
  percentWorkPlumbing: string | null;

  @Column('character varying', {
    name: 'percentWorkTile',
    nullable: true,
    length: 255,
  })
  percentWorkTile: string | null;

  @Column('character varying', {
    name: 'percentWorkMarble',
    nullable: true,
    length: 255,
  })
  percentWorkMarble: string | null;

  @Column('character varying', {
    name: 'percentWorkWoodwork',
    nullable: true,
    length: 255,
  })
  percentWorkWoodwork: string | null;

  @Column('character varying', {
    name: 'percentWorkMason',
    nullable: true,
    length: 255,
  })
  percentWorkMason: string | null;

  @Column('character varying', {
    name: 'wallMaterialDescription',
    nullable: true,
    length: 255,
  })
  wallMaterialDescription: string | null;

  @Column('character varying', {
    name: 'hasWarehouse',
    nullable: true,
    length: 255,
  })
  hasWarehouse: string | null;

  @Column('character varying', {
    name: 'hasStoreFront',
    nullable: true,
    length: 255,
  })
  hasStoreFront: string | null;

  @Column('character varying', {
    name: 'purchasePrice',
    nullable: true,
    length: 255,
  })
  purchasePrice: string | null;

  @Column('character varying', {
    name: 'buildingOwned',
    nullable: true,
    length: 255,
  })
  buildingOwned: string | null;

  @Column('character varying', {
    name: 'annualSubcontractorCost',
    nullable: true,
    length: 255,
  })
  annualSubcontractorCost: string | null;

  @Column('character varying', {
    name: 'mailingAddress',
    nullable: true,
    length: 255,
  })
  mailingAddress: string | null;

  @Column('character varying', {
    name: 'residentialWork',
    nullable: true,
    length: 255,
  })
  residentialWork: string | null;

  @Column('character varying', {
    name: 'outOfState',
    nullable: true,
    length: 255,
  })
  outOfState: string | null;

  @Column('character varying', {
    name: 'outOfStatePercent',
    nullable: true,
    length: 255,
  })
  outOfStatePercent: string | null;

  @Column('character varying', {
    name: 'workOverThreeStories',
    nullable: true,
    length: 255,
  })
  workOverThreeStories: string | null;

  @Column('character varying', {
    name: 'excavationWork',
    nullable: true,
    length: 255,
  })
  excavationWork: string | null;

  @Column('character varying', {
    name: 'machineryWork',
    nullable: true,
    length: 255,
  })
  machineryWork: string | null;

  @Column('character varying', {
    name: 'depthOfExcavation',
    nullable: true,
    length: 255,
  })
  depthOfExcavation: string | null;

  @Column('character varying', {
    name: 'demolitionWork',
    nullable: true,
    length: 255,
  })
  demolitionWork: string | null;

  @Column('character varying', {
    name: 'roofRepairWork',
    nullable: true,
    length: 255,
  })
  roofRepairWork: string | null;

  @Column('character varying', {
    name: 'asbestosRemovalWork',
    nullable: true,
    length: 255,
  })
  asbestosRemovalWork: string | null;

  @Column('character varying', {
    name: 'floorWork',
    nullable: true,
    length: 255,
  })
  floorWork: string | null;

  @Column('character varying', {
    name: 'snowRemovalWork',
    nullable: true,
    length: 255,
  })
  snowRemovalWork: string | null;

  @Column('character varying', {
    name: 'percentWorkSnowRemoval',
    nullable: true,
    length: 255,
  })
  percentWorkSnowRemoval: string | null;

  @Column('character varying', {
    name: 'percentWorkSnowRemovalOther',
    nullable: true,
    length: 255,
  })
  percentWorkSnowRemovalOther: string | null;

  @Column('character varying', {
    name: 'numberOfActiveOwners',
    nullable: true,
    length: 255,
  })
  numberOfActiveOwners: string | null;

  @Column('character varying', {
    name: 'equipmentInsuranceType',
    nullable: true,
    length: 255,
  })
  equipmentInsuranceType: string | null;

  @Column('character varying', {
    name: 'toolStorage',
    nullable: true,
    length: 255,
  })
  toolStorage: string | null;

  @Column('character varying', {
    name: 'rentalEquipmentCoverage',
    nullable: true,
    length: 255,
  })
  rentalEquipmentCoverage: string | null;

  @Column('character varying', {
    name: 'rentalToolLimit',
    nullable: true,
    length: 255,
  })
  rentalToolLimit: string | null;

  @Column('character varying', {
    name: 'toolRentalExpense',
    nullable: true,
    length: 255,
  })
  toolRentalExpense: string | null;

  @Column('character varying', {
    name: 'hasToolsOnsite',
    nullable: true,
    length: 255,
  })
  hasToolsOnsite: string | null;

  @Column('character varying', {
    name: 'jobsiteSecuritySystems',
    nullable: true,
    length: 255,
  })
  jobsiteSecuritySystems: string | null;

  @Column('character varying', {
    name: 'insuredUnderDifferentName',
    nullable: true,
    length: 255,
  })
  insuredUnderDifferentName: string | null;

  @Column('character varying', {
    name: 'alternateBusinessName',
    nullable: true,
    length: 255,
  })
  alternateBusinessName: string | null;

  @Column('character varying', {
    name: 'alternateBusinessActive',
    nullable: true,
    length: 255,
  })
  alternateBusinessActive: string | null;

  @Column('character varying', {
    name: 'eCommerceSite',
    nullable: true,
    length: 255,
  })
  eCommerceSite: string | null;

  @Column('character varying', {
    name: 'productsSold',
    nullable: true,
    length: 255,
  })
  productsSold: string | null;

  @Column('character varying', {
    name: 'wholesaleProducts',
    nullable: true,
    length: 255,
  })
  wholesaleProducts: string | null;

  @Column('character varying', {
    name: 'hasWeaponProducts',
    nullable: true,
    length: 255,
  })
  hasWeaponProducts: string | null;

  @Column('text', { name: 'weaponProductsComment', nullable: true })
  weaponProductsComment: string | null;

  @Column('character varying', {
    name: 'hasTobaccoProducts',
    nullable: true,
    length: 255,
  })
  hasTobaccoProducts: string | null;

  @Column('text', { name: 'tobaccoProductsComment', nullable: true })
  tobaccoProductsComment: string | null;

  @Column('character varying', {
    name: 'hasPharmaceuticals',
    nullable: true,
    length: 255,
  })
  hasPharmaceuticals: string | null;

  @Column('text', { name: 'pharmaceuticalsComment', nullable: true })
  pharmaceuticalsComment: string | null;

  @Column('character varying', {
    name: 'confidentialInformation',
    nullable: true,
    length: 255,
  })
  confidentialInformation: string | null;

  @Column('character varying', {
    name: 'privateLabelProducts',
    nullable: true,
    length: 255,
  })
  privateLabelProducts: string | null;

  @Column('text', { name: 'productDescription', nullable: true })
  productDescription: string | null;

  @Column('character varying', {
    name: 'foreignLocation',
    nullable: true,
    length: 255,
  })
  foreignLocation: string | null;

  @ManyToOne(() => Clients, (clients) => clients.businesses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientBusinessId', referencedColumnName: 'id' }])
  clients: Clients;
}
