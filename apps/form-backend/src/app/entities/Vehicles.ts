import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Incidents } from '../modules/incident/incidents.entity';
import { Rates } from '../modules/rate/Rates.entity';
import { Clients } from '../modules/client/client.entity';
import { Drivers } from '../modules/driver/drivers.entity';

@Entity('Vehicles', { schema: 'public' })
export class Vehicles {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'applicantAddrCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantAddrCd: string | null;

  @Column('character varying', {
    name: 'applicantAddrStreetName',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantAddrStreetName: string | null;

  @Column('character varying', {
    name: 'applicantAddrStreetNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantAddrStreetNumber: string | null;

  @Column('character varying', {
    name: 'applicantUnitNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantUnitNumber: string | null;

  @Column('character varying', {
    name: 'applicantAddrCity',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantAddrCity: string | null;

  @Column('character varying', {
    name: 'applicantStateCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantStateCd: string | null;

  @Column('character varying', {
    name: 'applicantPostalCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantPostalCd: string | null;

  @Column('character varying', {
    name: 'vehicleManufacturer',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleManufacturer: string | null;

  @Column('character varying', {
    name: 'vehicleManufacturerId',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleManufacturerId: string | null;

  @Column('character varying', {
    name: 'vehicleModel',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleModel: string | null;

  @Column('character varying', {
    name: 'vehicleModelYear',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleModelYear: string | null;

  @Column('character varying', {
    name: 'vehicleDaysDrivenPerWeek',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleDaysDrivenPerWeek: string | null;

  @Column('character varying', {
    name: 'vehicleAnnualDistance',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleAnnualDistance: string | null;

  @Column('character varying', {
    name: 'vehicleAnnualDistanceUnitCd',
    nullable: true,
    length: 255,
    default: () => "'1A'",
  })
  vehicleAnnualDistanceUnitCd: string | null;

  @Column('character varying', {
    name: 'vehicleVin',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleVin: string | null;

  @Column('character varying', {
    name: 'vehicleUseCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleUseCd: string | null;

  @Column('character varying', {
    name: 'liveNearCity',
    nullable: true,
    length: 255,
    default: () => null,
  })
  liveNearCity: string | null;

  @Column('character varying', {
    name: 'driveSportLuxury',
    nullable: true,
    length: 255,
    default: () => null,
  })
  driveSportLuxury: string | null;

  @Column('character varying', {
    name: 'ownOrLeaseVehicle',
    nullable: true,
    length: 255,
    default: () => null,
  })
  ownOrLeaseVehicle: string | null;

  @Column('integer', {
    name: 'vehicleScore',
    nullable: true,
    default: () => '0',
  })
  vehicleScore: number | null;

  @Column('character varying', {
    name: 'coverageLevel',
    nullable: true,
    length: 255,
    default: () => null,
  })
  coverageLevel: string | null;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('character varying', {
    name: 'vehicleModelId',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleModelId: string | null;

  @Column('integer', { name: 'estimatedQuote', nullable: true })
  estimatedQuote: number | null;

  @Column('integer', { name: 'premiumTotal', nullable: true })
  premiumTotal: number | null;

  @Column('integer', { name: 'premiumMonths', nullable: true })
  premiumMonths: number | null;

  @Column('timestamp with time zone', {
    name: 'premiumEndDate',
    nullable: true,
  })
  premiumEndDate: Date | null;

  @Column('character varying', {
    name: 'sfVehicleId',
    nullable: true,
    length: 255,
    default: () => null,
  })
  sfVehicleId: string | null;

  @Column('character varying', {
    name: 'vehicleMilesDrivenPerDay',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleMilesDrivenPerDay: string | null;

  @Column('boolean', { name: 'isGaragedNearCity', nullable: true })
  isGaragedNearCity: boolean | null;

  @Column('boolean', { name: 'isHighPerformanceVehicle', nullable: true })
  isHighPerformanceVehicle: boolean | null;

  @Column('boolean', {
    name: 'hasRatesCreated',
    nullable: true,
    default: () => 'false',
  })
  hasRatesCreated: boolean | null;

  @Column('boolean', {
    name: 'hasRideshare',
    nullable: true,
    default: () => 'false',
  })
  hasRideshare: boolean | null;

  @Column('character varying', {
    name: 'vehicleCommuteMilesDrivenOneWay',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleCommuteMilesDrivenOneWay: string | null;

  @Column('integer', { name: 'companyVehicleId', nullable: true })
  companyVehicleId: number | null;

  @Column('boolean', {
    name: 'hasAAAMemberDiscount',
    nullable: true,
    default: () => 'false',
  })
  hasAaaMemberDiscount: boolean | null;

  @Column('character varying', {
    name: 'vehicleBodyStyle',
    nullable: true,
    length: 255,
    default: () => null,
  })
  vehicleBodyStyle: string | null;

  @Column('character varying', {
    name: 'lengthOfOwnership',
    nullable: true,
    length: 255,
    default: () => null,
  })
  lengthOfOwnership: string | null;

  @Column('boolean', {
    name: 'hasAntiTheftDevices',
    nullable: true,
    default: () => 'false',
  })
  hasAntiTheftDevices: boolean | null;

  @Column('character varying', {
    name: 'purchaseDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  purchaseDate: string | null;

  @Column('character varying', {
    name: 'purchaseType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  purchaseType: string | null;

  @Column('character varying', {
    name: 'costNew',
    nullable: true,
    length: 255,
    default: () => null,
  })
  costNew: string | null;

  @Column('character varying', {
    name: 'priorOdometerReadingValue',
    nullable: true,
    length: 255,
    default: () => null,
  })
  priorOdometerReadingValue: string | null;

  @Column('character varying', {
    name: 'priorOdometerReadingDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  priorOdometerReadingDate: string | null;

  @Column('character varying', {
    name: 'currentOdometerReadingValue',
    nullable: true,
    length: 255,
    default: () => null,
  })
  currentOdometerReadingValue: string | null;

  @Column('character varying', {
    name: 'currentOdometerReadingDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  currentOdometerReadingDate: string | null;

  @Column('character varying', {
    name: 'workUnitNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  workUnitNumber: string | null;

  @Column('character varying', {
    name: 'workStreetNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  workStreetNumber: string | null;

  @Column('character varying', {
    name: 'workStreetName',
    nullable: true,
    length: 255,
    default: () => null,
  })
  workStreetName: string | null;

  @Column('character varying', {
    name: 'workStateCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  workStateCd: string | null;

  @Column('character varying', {
    name: 'workPostalCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  workPostalCd: string | null;

  @Column('character varying', {
    name: 'bodilyInjuryCoverage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  bodilyInjuryCoverage: string | null;

  @Column('character varying', {
    name: 'propertyDamageCoverage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  propertyDamageCoverage: string | null;

  @Column('character varying', {
    name: 'medicalCoverage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  medicalCoverage: string | null;

  @Column('character varying', {
    name: 'underInsuredMotoristCoverage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  underInsuredMotoristCoverage: string | null;

  @Column('character varying', {
    name: 'fullAddress',
    nullable: true,
    length: 255,
  })
  fullAddress: string | null;

  @Column('character varying', { name: 'value', nullable: true, length: 255 })
  value: string | null;

  @Column('character varying', {
    name: 'collision',
    nullable: true,
    length: 255,
  })
  collision: string | null;

  @Column('character varying', {
    name: 'comprehensive',
    nullable: true,
    length: 255,
  })
  comprehensive: string | null;

  @Column('character varying', {
    name: 'deductible',
    nullable: true,
    length: 255,
  })
  deductible: string | null;

  @Column('character varying', {
    name: 'isRideshare',
    nullable: true,
    length: 255,
  })
  isRideshare: string | null;

  @Column('character varying', { name: 'weight', nullable: true, length: 255 })
  weight: string | null;

  @Column('character varying', { name: 'radius', nullable: true, length: 255 })
  radius: string | null;

  @Column('character varying', { name: 'hasLien', nullable: true, length: 255 })
  hasLien: string | null;

  @Column('character varying', {
    name: 'personalInjuryCoverage',
    nullable: true,
    length: 255,
  })
  personalInjuryCoverage: string | null;

  @Column('character varying', {
    name: 'roadsideCoverage',
    nullable: true,
    length: 255,
  })
  roadsideCoverage: string | null;

  @Column('character varying', {
    name: 'rentalCoverage',
    nullable: true,
    length: 255,
  })
  rentalCoverage: string | null;

  @Column('character varying', {
    name: 'rideshareCoverage',
    nullable: true,
    length: 255,
  })
  rideshareCoverage: string | null;

  @Column('character varying', {
    name: 'uninsuredMotoristCoverage',
    nullable: true,
    length: 255,
  })
  uninsuredMotoristCoverage: string | null;

  @Column('character varying', {
    name: 'extraTransportationCoverage',
    nullable: true,
    length: 255,
  })
  extraTransportationCoverage: string | null;

  @Column('character varying', {
    name: 'fullGlassCoverage',
    nullable: true,
    length: 255,
  })
  fullGlassCoverage: string | null;

  @Column('character varying', {
    name: 'loanAndLeaseCoverage',
    nullable: true,
    length: 255,
  })
  loanAndLeaseCoverage: string | null;

  @Column('character varying', {
    name: 'priorLiabilityLimit',
    nullable: true,
    length: 255,
  })
  priorLiabilityLimit: string | null;

  @Column('character varying', {
    name: 'hasPackage',
    nullable: true,
    length: 255,
  })
  hasPackage: string | null;

  @Column('varchar', { name: 'discounts', nullable: true, array: true })
  discounts: string[] | null;

  @Column('character varying', {
    name: 'isUsedForFoodDelivery',
    nullable: true,
    length: 255,
  })
  isUsedForFoodDelivery: string | null;

  @Column('character varying', {
    name: 'isRentingVehicle',
    nullable: true,
    length: 255,
  })
  isRentingVehicle: string | null;

  @Column('text', { name: 'comments', nullable: true })
  comments: string | null;

  @Column('character varying', {
    name: 'isParkedAtHome',
    nullable: true,
    length: 255,
  })
  isParkedAtHome: string | null;

  @Column('character varying', {
    name: 'maxSpeed',
    nullable: true,
    length: 255,
  })
  maxSpeed: string | null;

  @Column('character varying', { name: 'length', nullable: true, length: 255 })
  length: string | null;

  @Column('character varying', { name: 'class', nullable: true, length: 255 })
  class: string | null;

  @Column('character varying', {
    name: 'construction',
    nullable: true,
    length: 255,
  })
  construction: string | null;

  @Column('character varying', {
    name: 'hullType',
    nullable: true,
    length: 255,
  })
  hullType: string | null;

  @Column('character varying', {
    name: 'additionalEquipment',
    nullable: true,
    length: 255,
  })
  additionalEquipment: string | null;

  @Column('character varying', {
    name: 'motorYear',
    nullable: true,
    length: 255,
  })
  motorYear: string | null;

  @Column('character varying', {
    name: 'motorMake',
    nullable: true,
    length: 255,
  })
  motorMake: string | null;

  @Column('character varying', {
    name: 'motorSerialNumber',
    nullable: true,
    length: 255,
  })
  motorSerialNumber: string | null;

  @Column('character varying', {
    name: 'motorType',
    nullable: true,
    length: 255,
  })
  motorType: string | null;

  @Column('character varying', {
    name: 'motorValue',
    nullable: true,
    length: 255,
  })
  motorValue: string | null;

  @Column('character varying', {
    name: 'trailerSerialNumber',
    nullable: true,
    length: 255,
  })
  trailerSerialNumber: string | null;

  @Column('character varying', {
    name: 'trailerMake',
    nullable: true,
    length: 255,
  })
  trailerMake: string | null;

  @Column('character varying', {
    name: 'trailerYear',
    nullable: true,
    length: 255,
  })
  trailerYear: string | null;

  @Column('character varying', {
    name: 'trailerValue',
    nullable: true,
    length: 255,
  })
  trailerValue: string | null;

  @Column('character varying', {
    name: 'lienholderName',
    nullable: true,
    length: 255,
  })
  lienholderName: string | null;

  @Column('character varying', {
    name: 'lienholderAddress',
    nullable: true,
    length: 255,
  })
  lienholderAddress: string | null;

  @Column('character varying', {
    name: 'loanNumber',
    nullable: true,
    length: 255,
  })
  loanNumber: string | null;

  @Column('character varying', {
    name: 'secondMotorSerialNumber',
    nullable: true,
    length: 255,
  })
  secondMotorSerialNumber: string | null;

  @Column('character varying', {
    name: 'secondMotorYear',
    nullable: true,
    length: 255,
  })
  secondMotorYear: string | null;

  @Column('character varying', {
    name: 'secondMotorMake',
    nullable: true,
    length: 255,
  })
  secondMotorMake: string | null;

  @Column('character varying', {
    name: 'secondMotorValue',
    nullable: true,
    length: 255,
  })
  secondMotorValue: string | null;

  @Column('character varying', {
    name: 'secondMotorType',
    nullable: true,
    length: 255,
  })
  secondMotorType: string | null;

  @Column('character varying', {
    name: 'garagingType',
    nullable: true,
    length: 255,
  })
  garagingType: string | null;

  @Column('character varying', {
    name: 'storageLocation',
    nullable: true,
    length: 255,
  })
  storageLocation: string | null;

  @Column('character varying', {
    name: 'driverIndex',
    nullable: true,
    length: 255,
  })
  driverIndex: string | null;

  @Column('character varying', {
    name: 'autoDeathIndemnity',
    nullable: true,
    length: 255,
  })
  autoDeathIndemnity: string | null;

  @Column('character varying', { name: 'umPd', nullable: true, length: 255 })
  umPd: string | null;

  @Column('character varying', {
    name: 'hasExistingDamage',
    nullable: true,
    length: 255,
  })
  hasExistingDamage: string | null;

  @Column('character varying', {
    name: 'eldProvider',
    nullable: true,
    length: 255,
  })
  eldProvider: string | null;

  @Column('character varying', { name: 'hasELD', nullable: true, length: 255 })
  hasEld: string | null;

  @Column('character varying', {
    name: 'hitchType',
    nullable: true,
    length: 255,
  })
  hitchType: string | null;

  @Column('character varying', {
    name: 'numberOfRearAxels',
    nullable: true,
    length: 255,
  })
  numberOfRearAxels: string | null;

  @Column('character varying', {
    name: 'horsePower',
    nullable: true,
    length: 255,
  })
  horsePower: string | null;

  @Column('character varying', {
    name: 'storageLocationSecured',
    nullable: true,
    length: 255,
  })
  storageLocationSecured: string | null;

  @Column('character varying', {
    name: 'hasSpateTowingCoverage',
    nullable: true,
    length: 255,
  })
  hasSpateTowingCoverage: string | null;

  @Column('character varying', {
    name: 'hasMarineCertifications',
    nullable: true,
    length: 255,
  })
  hasMarineCertifications: string | null;

  @Column('character varying', { name: 'clause', nullable: true, length: 255 })
  clause: string | null;

  @Column('character varying', {
    name: 'physicalDamage',
    nullable: true,
    length: 255,
  })
  physicalDamage: string | null;

  @Column('character varying', {
    name: 'removeVehicles',
    nullable: true,
    length: 255,
  })
  removeVehicles: string | null;

  @Column('varchar', { name: 'safteyFeatures', nullable: true, array: true })
  safteyFeatures: string[] | null;

  @Column('character varying', {
    name: 'cancellationDate',
    nullable: true,
    length: 255,
  })
  cancellationDate: string | null;

  @Column('character varying', {
    name: 'newVehicleYear',
    nullable: true,
    length: 255,
  })
  newVehicleYear: string | null;

  @Column('character varying', {
    name: 'newVehicleMake',
    nullable: true,
    length: 255,
  })
  newVehicleMake: string | null;

  @Column('character varying', {
    name: 'newVehicleModel',
    nullable: true,
    length: 255,
  })
  newVehicleModel: string | null;

  @Column('character varying', {
    name: 'newVehicleBodyStyle',
    nullable: true,
    length: 255,
  })
  newVehicleBodyStyle: string | null;

  @Column('character varying', {
    name: 'newVehicleVin',
    nullable: true,
    length: 255,
  })
  newVehicleVin: string | null;

  @Column('varchar', { name: 'extraPerksList', nullable: true, array: true })
  extraPerksList: string[] | null;

  @Column('varchar', {
    name: 'safetyFeaturesList',
    nullable: true,
    array: true,
  })
  safetyFeaturesList: string[] | null;

  @Column('character varying', {
    name: 'vehicleIsHighPerformance',
    nullable: true,
    length: 255,
  })
  vehicleIsHighPerformance: string | null;

  @Column('character varying', {
    name: 'isAAAMember',
    nullable: true,
    length: 255,
  })
  isAaaMember: string | null;

  @Column('character varying', {
    name: 'hasAntiTheft',
    nullable: true,
    length: 255,
  })
  hasAntiTheft: string | null;

  @Column('character varying', {
    name: 'hasTripInteruption',
    nullable: true,
    length: 255,
  })
  hasTripInteruption: string | null;

  @Column('character varying', {
    name: 'hasAccidentForgiveness',
    nullable: true,
    length: 255,
  })
  hasAccidentForgiveness: string | null;

  @Column('character varying', {
    name: 'hasTotalLossReplacement',
    nullable: true,
    length: 255,
  })
  hasTotalLossReplacement: string | null;

  @Column('character varying', {
    name: 'weeksPerMonthDriven',
    nullable: true,
    length: 255,
  })
  weeksPerMonthDriven: string | null;

  @Column('character varying', {
    name: 'coveragePlan',
    nullable: true,
    length: 255,
  })
  coveragePlan: string | null;

  @Column('character varying', {
    name: 'unknownCoverage',
    nullable: true,
    length: 255,
  })
  unknownCoverage: string | null;

  @Column('character varying', {
    name: 'titleHolder',
    nullable: true,
    length: 255,
  })
  titleHolder: string | null;

  @Column('character varying', { name: 'hasVIN', nullable: true, length: 255 })
  hasVin: string | null;

  @Column('character varying', {
    name: 'antiTheftType',
    nullable: true,
    length: 255,
  })
  antiTheftType: string | null;

  @Column('character varying', {
    name: 'passiveRestraintsType',
    nullable: true,
    length: 255,
  })
  passiveRestraintsType: string | null;

  @Column('character varying', {
    name: 'hasAntiLockBrakes',
    nullable: true,
    length: 255,
  })
  hasAntiLockBrakes: string | null;

  @Column('character varying', {
    name: 'hasDaytimeLights',
    nullable: true,
    length: 255,
  })
  hasDaytimeLights: string | null;

  @Column('character varying', {
    name: 'vehicleInspectionType',
    nullable: true,
    length: 255,
  })
  vehicleInspectionType: string | null;

  @Column('character varying', {
    name: 'waiverCollisionDamage',
    nullable: true,
    length: 255,
  })
  waiverCollisionDamage: string | null;

  @Column('character varying', {
    name: 'wantsReplacementCostCoverage',
    nullable: true,
    length: 255,
  })
  wantsReplacementCostCoverage: string | null;

  @Column('character varying', {
    name: 'liabilityNotRequired',
    nullable: true,
    length: 255,
  })
  liabilityNotRequired: string | null;

  @Column('character varying', {
    name: 'hasSnowPlow',
    nullable: true,
    length: 255,
  })
  hasSnowPlow: string | null;

  @Column('character varying', {
    name: 'toolManufacturer',
    nullable: true,
    length: 255,
  })
  toolManufacturer: string | null;

  @Column('character varying', {
    name: 'toolModel',
    nullable: true,
    length: 255,
  })
  toolModel: string | null;

  @Column('character varying', {
    name: 'toolModelYear',
    nullable: true,
    length: 255,
  })
  toolModelYear: string | null;

  @Column('character varying', {
    name: 'toolSerial',
    nullable: true,
    length: 255,
  })
  toolSerial: string | null;

  @Column('text', { name: 'toolDescription', nullable: true })
  toolDescription: string | null;

  @Column('character varying', {
    name: 'toolCoverageAmount',
    nullable: true,
    length: 255,
  })
  toolCoverageAmount: string | null;

  @Column('character varying', {
    name: 'toolDeductible',
    nullable: true,
    length: 255,
  })
  toolDeductible: string | null;

  @Column('character varying', {
    name: 'hasIncomeLoss',
    nullable: true,
    length: 255,
  })
  hasIncomeLoss: string | null;

  @Column('character varying', {
    name: 'hasAlarm',
    nullable: true,
    length: 255,
  })
  hasAlarm: string | null;

  @Column('character varying', {
    name: 'securityEndorsement',
    nullable: true,
    length: 255,
  })
  securityEndorsement: string | null;

  @Column('character varying', {
    name: 'autoEndorsement',
    nullable: true,
    length: 255,
  })
  autoEndorsement: string | null;

  @Column('character varying', {
    name: 'businessUse',
    nullable: true,
    length: 255,
  })
  businessUse: string | null;

  @Column('integer', { name: 'clientVehicleId', nullable: true })
  clientVehicleId: number | null;

  @Column('integer', { name: 'vehicleId', nullable: true })
  vehicleId: number | null;

  @OneToMany(() => Incidents, (incidents) => incidents.vehicle)
  incidents: Incidents[];

  @OneToMany(() => Rates, (rates) => rates.vehicleRate)
  rates: Rates[];

  @ManyToOne(() => Clients, (clients) => clients.vehicles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientVehicleId', referencedColumnName: 'id' }])
  clientVehicle: Clients;

  @ManyToOne(() => Drivers, (drivers) => drivers.vehicles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'vehicleId', referencedColumnName: 'id' }])
  driver: Drivers;
}
