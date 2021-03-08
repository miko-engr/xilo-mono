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
import { Clients } from '../client/client.entity';
import { Incidents } from '../incident/incidents.entity';
import { Vehicles } from '../../entities/Vehicles';

@Entity('Drivers', { schema: 'public' })
export class Drivers {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'applicantSurname',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantSurname: string | null;

  @Column('character varying', {
    name: 'applicantGivenName',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantGivenName: string | null;

  @Column('character varying', {
    name: 'applicantMiddleInitial',
    nullable: true,
    length: 255,
  })
  applicantMiddleInitial: string | null;

  @Column('character varying', {
    name: 'applicantNameSuffix',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantNameSuffix: string | null;

  @Column('character varying', {
    name: 'applicantCommUsedCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantCommUsedCd: string | null;

  @Column('character varying', {
    name: 'applicantCommPhoneNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantCommPhoneNumber: string | null;

  @Column('character varying', {
    name: 'applicantCommEmailAddress',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantCommEmailAddress: string | null;

  @Column('character varying', {
    name: 'applicantGenderCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantGenderCd: string | null;

  @Column('timestamp with time zone', {
    name: 'applicantBirthDt',
    nullable: true,
  })
  applicantBirthDt: Date | null;

  @Column('character varying', {
    name: 'applicantMaritalStatusCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantMaritalStatusCd: string | null;

  @Column('character varying', {
    name: 'applicantOccupationClassCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantOccupationClassCd: string | null;

  @Column('timestamp with time zone', {
    name: 'driverLicensedDt',
    nullable: true,
  })
  driverLicensedDt: Date | null;

  @Column('character varying', {
    name: 'driverLicenseNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  driverLicenseNumber: string | null;

  @Column('character varying', {
    name: 'driverLicenseStateCd',
    nullable: true,
    length: 255,
    default: () => null,
  })
  driverLicenseStateCd: string | null;

  @Column('integer', {
    name: 'driverScore',
    nullable: true,
    default: () => 0,
  })
  driverScore: number | null;

  @Column('character varying', {
    name: 'ownOrRent',
    nullable: true,
    length: 255,
    default: () => null,
  })
  ownOrRent: string | null;

  @Column('boolean', { name: 'currentlyInsured', nullable: true })
  currentlyInsured: boolean | null;

  @Column('character varying', {
    name: 'creditScore',
    nullable: true,
    length: 255,
    default: () => null,
  })
  creditScore: string | null;

  @Column('character varying', {
    name: 'priorPenalties',
    nullable: true,
    length: 255,
    default: () => null,
  })
  priorPenalties: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('text', { name: 'priorPenaltiesText', nullable: true })
  priorPenaltiesText: string | null;

  @Column('character varying', {
    name: 'applicantPreviousInsurance',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantPreviousInsurance: string | null;

  @Column('character varying', {
    name: 'applicantPreviousInsuranceYears',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantPreviousInsuranceYears: string | null;

  @Column('character varying', {
    name: 'applicantPreviousInsuranceMonths',
    nullable: true,
    length: 255,
    default: () => null,
  })
  applicantPreviousInsuranceMonths: string | null;

  @Column('boolean', { name: 'priorClient', nullable: true })
  priorClient: boolean | null;

  @Column('character varying', {
    name: 'sfInsuredId',
    nullable: true,
    length: 255,
    default: () => null,
  })
  sfInsuredId: string | null;

  @Column('boolean', { name: 'hasCancelled', nullable: true })
  hasCancelled: boolean | null;

  @Column('boolean', {
    name: 'hasHomeBundle',
    nullable: true,
    default: () => false,
  })
  hasHomeBundle: boolean | null;

  @Column('boolean', {
    name: 'hasRentersBundle',
    nullable: true,
    default: () => false,
  })
  hasRentersBundle: boolean | null;

  @Column('boolean', {
    name: 'hasHomeownersDiscount',
    nullable: true,
    default: () => false,
  })
  hasHomeownersDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasMilitaryDiscount',
    nullable: true,
    default: () => false,
  })
  hasMilitaryDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasPayInFullDiscount',
    nullable: true,
    default: () => false,
  })
  hasPayInFullDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasAutoPayDiscount',
    nullable: true,
    default: () => false,
  })
  hasAutoPayDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasDefensiveDriverDiscount',
    nullable: true,
    default: () => false,
  })
  hasDefensiveDriverDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasGoodStudentDiscount',
    nullable: true,
    default: () => false,
  })
  hasGoodStudentDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasRideshare',
    nullable: true,
    default: () => false,
  })
  hasRideshare: boolean | null;

  @Column('integer', { name: 'age', nullable: true })
  age: number | null;

  @Column('character varying', {
    name: 'drivingExperience',
    nullable: true,
    length: 255,
    default: () => null,
  })
  drivingExperience: string | null;

  @Column('character varying', {
    name: 'preferredContactMethod',
    nullable: true,
    length: 255,
    default: () => null,
  })
  preferredContactMethod: string | null;

  @Column('boolean', {
    name: 'hasCommercialBundle',
    nullable: true,
    default: () => false,
  })
  hasCommercialBundle: boolean | null;

  @Column('boolean', {
    name: 'hasLifeBundle',
    nullable: true,
    default: () => false,
  })
  hasLifeBundle: boolean | null;

  @Column('character varying', {
    name: 'educationLevel',
    nullable: true,
    length: 255,
    default: () => null,
  })
  educationLevel: string | null;

  @Column('character varying', {
    name: 'needsSR22',
    nullable: true,
    length: 255,
  })
  needsSr22: string | null;

  @Column('integer', { name: 'companyDriverId', nullable: true })
  companyDriverId: number | null;

  @Column('character varying', {
    name: 'numberOfResidentsInHome',
    nullable: true,
    length: 255,
    default: () => null,
  })
  numberOfResidentsInHome: string | null;

  @Column('character varying', {
    name: 'rentersLimits',
    nullable: true,
    length: 255,
    default: () => null,
  })
  rentersLimits: string | null;

  @Column('character varying', {
    name: 'yearsWithPriorInsurance',
    nullable: true,
    length: 255,
    default: () => null,
  })
  yearsWithPriorInsurance: string | null;

  @Column('character varying', {
    name: 'priorPenaltiesDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  priorPenaltiesDate: string | null;

  @Column('character varying', {
    name: 'priorPenaltiesCode',
    nullable: true,
    length: 255,
    default: () => null,
  })
  priorPenaltiesCode: string | null;

  @Column('boolean', {
    name: 'hasMulticarDiscount',
    nullable: true,
    default: () => false,
  })
  hasMulticarDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasSafeDriverDiscount',
    nullable: true,
    default: () => false,
  })
  hasSafeDriverDiscount: boolean | null;

  @Column('boolean', {
    name: 'hasOver55Discount',
    nullable: true,
    default: () => false,
  })
  hasOver55Discount: boolean | null;

  @Column('character varying', {
    name: 'currentPremium',
    nullable: true,
    length: 255,
    default: () => null,
  })
  currentPremium: string | null;

  @Column('boolean', {
    name: 'hasUmbrellaBundle',
    nullable: true,
    default: () => false,
  })
  hasUmbrellaBundle: boolean | null;

  @Column('character varying', {
    name: 'lengthAtAddress',
    nullable: true,
    length: 255,
    default: () => null,
  })
  lengthAtAddress: string | null;

  @Column('character varying', {
    name: 'streetNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  streetNumber: string | null;

  @Column('character varying', {
    name: 'streetName',
    nullable: true,
    length: 255,
    default: () => null,
  })
  streetName: string | null;

  @Column('character varying', {
    name: 'city',
    nullable: true,
    length: 255,
    default: () => null,
  })
  city: string | null;

  @Column('character varying', {
    name: 'state',
    nullable: true,
    length: 255,
    default: () => null,
  })
  state: string | null;

  @Column('character varying', {
    name: 'zipCode',
    nullable: true,
    length: 255,
    default: () => null,
  })
  zipCode: string | null;

  @Column('character varying', {
    name: 'fullAddress',
    nullable: true,
    length: 255,
    default: () => null,
  })
  fullAddress: string | null;

  @Column('character varying', {
    name: 'hasPriorInsurance',
    nullable: true,
    length: 255,
    default: () => null,
  })
  hasPriorInsurance: string | null;

  @Column('character varying', {
    name: 'relationship',
    nullable: true,
    length: 255,
  })
  relationship: string | null;

  @Column('character varying', {
    name: 'sr22Needed',
    nullable: true,
    length: 255,
  })
  sr22Needed: string | null;

  @Column('character varying', { name: 'ssnU', nullable: true, length: 255 })
  ssnU: string | null;

  @Column('character varying', {
    name: 'hireDate',
    nullable: true,
    length: 255,
  })
  hireDate: string | null;

  @Column('character varying', {
    name: 'yearLicenseIssued',
    nullable: true,
    length: 255,
  })
  yearLicenseIssued: string | null;

  @Column('character varying', {
    name: 'numberOfAccidents',
    nullable: true,
    length: 255,
  })
  numberOfAccidents: string | null;

  @Column('character varying', {
    name: 'numberOfViolations',
    nullable: true,
    length: 255,
  })
  numberOfViolations: string | null;

  @Column('character varying', {
    name: 'hasAdditionalLicense',
    nullable: true,
    length: 255,
  })
  hasAdditionalLicense: string | null;

  @Column('character varying', {
    name: 'additionalLicenseType',
    nullable: true,
    length: 255,
  })
  additionalLicenseType: string | null;

  @Column('character varying', {
    name: 'additionalLicenseNumber',
    nullable: true,
    length: 255,
  })
  additionalLicenseNumber: string | null;

  @Column('character varying', {
    name: 'fullName',
    nullable: true,
    length: 255,
  })
  fullName: string | null;

  @Column('character varying', {
    name: 'hasCommercialLicense',
    nullable: true,
    length: 255,
  })
  hasCommercialLicense: string | null;

  @Column('character varying', {
    name: 'commercialLicenseNumber',
    nullable: true,
    length: 255,
  })
  commercialLicenseNumber: string | null;

  @Column('character varying', {
    name: 'hadLicenseSuspended',
    nullable: true,
    length: 255,
  })
  hadLicenseSuspended: string | null;

  @Column('character varying', {
    name: 'hasMotorcycleLicenseEndorsements',
    nullable: true,
    length: 255,
  })
  hasMotorcycleLicenseEndorsements: string | null;

  @Column('character varying', {
    name: 'hasDriversTrainingDiscount',
    nullable: true,
    length: 255,
  })
  hasDriversTrainingDiscount: string | null;

  @Column('character varying', {
    name: 'hasAwayAtSchoolDiscount',
    nullable: true,
    length: 255,
  })
  hasAwayAtSchoolDiscount: string | null;

  @Column('character varying', {
    name: 'industry',
    nullable: true,
    length: 255,
  })
  industry: string | null;

  @Column('character varying', {
    name: 'licenseStatus',
    nullable: true,
    length: 255,
  })
  licenseStatus: string | null;

  @Column('character varying', {
    name: 'employer',
    nullable: true,
    length: 255,
  })
  employer: string | null;

  @Column('character varying', {
    name: 'hasClaims',
    nullable: true,
    length: 255,
  })
  hasClaims: string | null;

  @Column('character varying', {
    name: 'hasViolations',
    nullable: true,
    length: 255,
  })
  hasViolations: string | null;

  @Column('character varying', {
    name: 'hasAccidents',
    nullable: true,
    length: 255,
  })
  hasAccidents: string | null;

  @Column('character varying', {
    name: 'accidentType',
    nullable: true,
    length: 255,
  })
  accidentType: string | null;

  @Column('character varying', {
    name: 'accidentDate',
    nullable: true,
    length: 255,
  })
  accidentDate: string | null;

  @Column('character varying', {
    name: 'hasCompLoss',
    nullable: true,
    length: 255,
  })
  hasCompLoss: string | null;

  @Column('character varying', {
    name: 'compLossType',
    nullable: true,
    length: 255,
  })
  compLossType: string | null;

  @Column('character varying', {
    name: 'compLossDate',
    nullable: true,
    length: 255,
  })
  compLossDate: string | null;

  @Column('text', { name: 'ssnUHash', nullable: true })
  ssnUHash: string | null;

  @Column('character varying', { name: 'cdlType', nullable: true, length: 255 })
  cdlType: string | null;

  @Column('character varying', {
    name: 'vehicleLicenseType',
    nullable: true,
    length: 255,
  })
  vehicleLicenseType: string | null;

  @Column('character varying', {
    name: 'hadSafetyCourse',
    nullable: true,
    length: 255,
  })
  hadSafetyCourse: string | null;

  @Column('text', { name: 'licenseSuspensionDetails', nullable: true })
  licenseSuspensionDetails: string | null;

  @Column('character varying', {
    name: 'commercialLicenseYear',
    nullable: true,
    length: 255,
  })
  commercialLicenseYear: string | null;

  @Column('character varying', {
    name: 'licenseType',
    nullable: true,
    length: 255,
  })
  licenseType: string | null;

  @Column('character varying', {
    name: 'disclosedDrivers',
    nullable: true,
    length: 255,
  })
  disclosedDrivers: string | null;

  @Column('character varying', {
    name: 'uninsuredMotorist',
    nullable: true,
    length: 255,
  })
  uninsuredMotorist: string | null;

  @Column('character varying', {
    name: 'extraPerks',
    nullable: true,
    length: 255,
  })
  extraPerks: string | null;

  @Column('character varying', {
    name: 'isRideshareDriver',
    nullable: true,
    length: 255,
  })
  isRideshareDriver: string | null;

  @Column('character varying', { name: 'payPlan', nullable: true, length: 255 })
  payPlan: string | null;

  @Column('character varying', {
    name: 'hasInsurance',
    nullable: true,
    length: 255,
  })
  hasInsurance: string | null;

  @Column('character varying', {
    name: 'isPriorClient',
    nullable: true,
    length: 255,
  })
  isPriorClient: string | null;

  @Column('character varying', {
    name: 'hasCancelledInsurance',
    nullable: true,
    length: 255,
  })
  hasCancelledInsurance: string | null;

  @Column('character varying', {
    name: 'wantsHomeBundle',
    nullable: true,
    length: 255,
  })
  wantsHomeBundle: string | null;

  @Column('character varying', {
    name: 'wantsRentersBundle',
    nullable: true,
    length: 255,
  })
  wantsRentersBundle: string | null;

  @Column('character varying', {
    name: 'isMilitary',
    nullable: true,
    length: 255,
  })
  isMilitary: string | null;

  @Column('character varying', {
    name: 'hasDefensiveDriverCourse',
    nullable: true,
    length: 255,
  })
  hasDefensiveDriverCourse: string | null;

  @Column('character varying', {
    name: 'isGoodStudent',
    nullable: true,
    length: 255,
  })
  isGoodStudent: string | null;

  @Column('character varying', {
    name: 'wantsCommercialBundle',
    nullable: true,
    length: 255,
  })
  wantsCommercialBundle: string | null;

  @Column('character varying', {
    name: 'wantsLifeBundle',
    nullable: true,
    length: 255,
  })
  wantsLifeBundle: string | null;

  @Column('character varying', {
    name: 'isSafeDriver',
    nullable: true,
    length: 255,
  })
  isSafeDriver: string | null;

  @Column('character varying', {
    name: 'wantsUmbrellaBundle',
    nullable: true,
    length: 255,
  })
  wantsUmbrellaBundle: string | null;

  @Column('character varying', {
    name: 'rideshareCompany',
    nullable: true,
    length: 255,
  })
  rideshareCompany: string | null;

  @Column('character varying', {
    name: 'liabilityLimits',
    nullable: true,
    length: 255,
  })
  liabilityLimits: string | null;

  @Column('character varying', {
    name: 'yearsInIndustry',
    nullable: true,
    length: 255,
  })
  yearsInIndustry: string | null;

  @Column('character varying', {
    name: 'hasRefusedTesting',
    nullable: true,
    length: 255,
  })
  hasRefusedTesting: string | null;
  @Column('integer', { name: 'clientDriverId', nullable: true })
  clientDriverId: number | null;

  @ManyToOne(() => Clients, (clients) => clients.drivers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientDriverId', referencedColumnName: 'id' }])
  client: Clients;

  @OneToMany(() => Incidents, (incidents) => incidents.driver)
  incidents: Incidents[];

  @OneToMany(() => Vehicles, (vehicles) => vehicles.vehicleId)
  vehicles: Vehicles[];
}
