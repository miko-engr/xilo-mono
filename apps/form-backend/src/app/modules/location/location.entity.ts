import { Column, Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clients } from '../client/client.entity';

@Entity('Locations')
export class Locations {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column("timestamp with time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;

  @Column("timestamp with time zone", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @Column('character varying', { name: 'streetNumber', nullable: true, length: 255 })
  streetNumber: string | null;

  @Column('character varying', { name: 'streetName', nullable: true, length: 255 })
  streetName: string | null;

  @Column('character varying', { name: 'unit', nullable: true, length: 255 })
  unit: string | null;

  @Column('character varying', { name: 'streetAddress', nullable: true, length: 255 })
  streetAddress: string | null;

  @Column('character varying', { name: 'city', nullable: true, length: 255 })
  city: string | null;

  @Column('character varying', { name: 'county', nullable: true, length: 255 })
  county: string | null;

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
    name: 'locationNumber',
    nullable: true,
    length: 255,
  })
  locationNumber: string | null;

  @Column('character varying', {
    name: 'buildingNumber',
    nullable: true,
    length: 255,
  })
  buildingNumber: string | null;

  @Column('character varying', {
    name: 'isWithinCityLimits',
    nullable: true,
    length: 255,
  })
  isWithinCityLimits: string | null;

  @Column('character varying', {
    name: 'occupancyType',
    nullable: true,
    length: 255,
  })
  occupancyType: string | null;

  @Column('integer', { name: 'companyLocationId', nullable: true })
  companyLocationId: number | null;

  @Column('integer', { name: 'clientLocationId', nullable: true })
  clientLocationId: number | null;

  @Column('character varying', { name: 'classCode', nullable: true, length: 255 })
  classCode: string | null;

  @Column('character varying', {
    name: 'classification',
    nullable: true,
    length: 255,
  })
  classification: string | null;

  @Column('character varying', {
    name: 'premiumCode',
    nullable: true,
    length: 255,
  })
  premiumCode: string | null;

  @Column('character varying', { name: 'exposure', nullable: true, length: 255 })
  exposure: string | null;

  @Column('character varying', {
    name: 'territoryCode',
    nullable: true,
    length: 255,
  })
  territoryCode: string | null;

  @Column('character varying', {
    name: 'premisesOperationsRate',
    nullable: true,
    length: 255,
  })
  premisesOperationsRate: string | null;

  @Column('character varying', {
    name: 'productsRate',
    nullable: true,
    length: 255,
  })
  productsRate: string | null;

  @Column('character varying', {
    name: 'premisesOperationPremium',
    nullable: true,
    length: 255,
  })
  premisesOperationPremium: string | null;

  @Column('character varying', {
    name: 'productsPremium',
    nullable: true,
    length: 255,
  })
  productsPremium: string | null;

  @Column('character varying', {
    name: 'constructionType',
    nullable: true,
    length: 255,
  })
  constructionType: string | null;

  @Column('character varying', {
    name: 'distanceToFireHydrant',
    nullable: true,
    length: 255,
  })
  distanceToFireHydrant: string | null;

  @Column('character varying', {
    name: 'distanceToFireStation',
    nullable: true,
    length: 255,
  })
  distanceToFireStation: string | null;

  @Column('character varying', {
    name: 'fireDistrict',
    nullable: true,
    length: 255,
  })
  fireDistrict: string | null;

  @Column('character varying', {
    name: 'numberOfStories',
    nullable: true,
    length: 255,
  })
  numberOfStories: string | null;

  @Column('character varying', {
    name: 'numberOfBasements',
    nullable: true,
    length: 255,
  })
  numberOfBasements: string | null;

  @Column('character varying', {
    name: 'yearBuilt',
    nullable: true,
    length: 255,
  })
  yearBuilt: string | null;

  @Column('character varying', {
    name: 'totalSquareFootage',
    nullable: true,
    length: 255,
  })
  totalSquareFootage: string | null;

  @Column('character varying', {
    name: 'hasUpdatedWiring',
    nullable: true,
    length: 255,
  })
  hasUpdatedWiring: string | null;

  @Column('character varying', {
    name: 'updatedWiringYear',
    nullable: true,
    length: 255,
  })
  updatedWiringYear: string | null;

  @Column('character varying', {
    name: 'hasUpdatedRoofing',
    nullable: true,
    length: 255,
  })
  hasUpdatedRoofing: string | null;

  @Column('character varying', {
    name: 'updatedRoofingYear',
    nullable: true,
    length: 255,
  })
  updatedRoofingYear: string | null;

  @Column('character varying', {
    name: 'hasUpdatedPlumbing',
    nullable: true,
    length: 255,
  })
  hasUpdatedPlumbing: string | null;

  @Column('character varying', {
    name: 'updatedPlumbingYear',
    nullable: true,
    length: 255,
  })
  updatedPlumbingYear: string | null;

  @Column('character varying', {
    name: 'hadUpdatedHeating',
    nullable: true,
    length: 255,
  })
  hadUpdatedHeating: string | null;

  @Column('character varying', {
    name: 'updatedHeatingYear',
    nullable: true,
    length: 255,
  })
  updatedHeatingYear: string | null;

  @Column('character varying', {
    name: 'roofType',
    nullable: true,
    length: 255,
  })
  roofType: string | null;

  @Column('character varying', {
    name: 'hasWoodBurningStoves',
    nullable: true,
    length: 255,
  })
  hasWoodBurningStoves: string | null;

  @Column('character varying', {
    name: 'heatType',
    nullable: true,
    length: 255,
  })
  heatType: string | null;

  @Column('character varying', {
    name: 'coolType',
    nullable: true,
    length: 255,
  })
  coolType: string | null;

  @Column('character varying', {
    name: 'burglarAlarmType',
    nullable: true,
    length: 255,
  })
  burglarAlarmType: string | null;

  @Column('character varying', {
    name: 'fireProtectionType',
    nullable: true,
    length: 255,
  })
  fireProtectionType: string | null;

  @Column('character varying', {
    name: 'percentOfSprinklerFireProtection',
    nullable: true,
    length: 255,
  })
  percentOfSprinklerFireProtection: string | null;

  @Column('character varying', {
    name: 'loanNumber',
    nullable: true,
    length: 255,
  })
  loanNumber: string | null;

  @Column('character varying', {
    name: 'stakeholderType',
    nullable: true,
    length: 255,
  })
  stakeholderType: string | null;

  @Column('character varying', {
    name: 'stakeholderName',
    nullable: true,
    length: 255,
  })
  stakeholderName: string | null;

  @Column('character varying', {
    name: 'stakeholderAddress',
    nullable: true,
    length: 255,
  })
  stakeholderAddress: string | null;

  @Column('character varying', {
    name: 'secondaryHeatType',
    nullable: true,
    length: 255,
  })
  secondaryHeatType: string | null;

  @Column('character varying', {
    name: 'needsFloodInsurance',
    nullable: true,
    length: 255,
  })
  needsFloodInsurance: string | null;

  @Column('character varying', {
    name: 'causeOfLoss',
    nullable: true,
    length: 255,
  })
  causeOfLoss: string | null;

  @Column('character varying', {
    name: 'deductible',
    nullable: true,
    length: 255,
  })
  deductible: string | null;

  @Column('character varying', {
    name: 'percentCoInsured',
    nullable: true,
    length: 255,
  })
  percentCoInsured: string | null;

  @Column('character varying', {
    name: 'coverageAmount',
    nullable: true,
    length: 255,
  })
  coverageAmount: string | null;

  @Column('text', { name: 'coveragesDescription', nullable: true })
  coveragesDescription: string | null;

  @Column('character varying', {
    name: 'buildingDeductible',
    nullable: true,
    length: 255,
  })
  buildingDeductible: string | null;

  @Column('character varying', {
    name: 'contentsDeductible',
    nullable: true,
    length: 255,
  })
  contentsDeductible: string | null;

  @Column('character varying', {
    name: 'buildingLimit',
    nullable: true,
    length: 255,
  })
  buildingLimit: string | null;

  @Column('character varying', {
    name: 'personalPropLimit',
    nullable: true,
    length: 255,
  })
  personalPropLimit: string | null;

  @Column('character varying', {
    name: 'businessIncome',
    nullable: true,
    length: 255,
  })
  businessIncome: string | null;

  @Column('character varying', {
    name: 'extraExpense',
    nullable: true,
    length: 255,
  })
  extraExpense: string | null;

  @Column('character varying', {
    name: 'rentalValue',
    nullable: true,
    length: 255,
  })
  rentalValue: string | null;

  @Column('character varying', {
    name: 'blanketBuilding',
    nullable: true,
    length: 255,
  })
  blanketBuilding: string | null;

  @Column('character varying', {
    name: 'blanketPersonalProp',
    nullable: true,
    length: 255,
  })
  blanketPersonalProp: string | null;

  @Column('character varying', {
    name: 'blanketBuildingAndPp',
    nullable: true,
    length: 255,
  })
  blanketBuildingAndPp: string | null;

  @Column('text', { name: 'otherCoverageDescription', nullable: true })
  otherCoverageDescription: string | null;

  @Column('character varying', {
    name: 'otherCoverageLimit',
    nullable: true,
    length: 255,
  })
  otherCoverageLimit: string | null;

  @Column('text', { name: 'inlandmarineLimitDescription', nullable: true })
  inlandmarineLimitDescription: string | null;

  @Column('character varying', {
    name: 'inlandmarineLimitAmount',
    nullable: true,
    length: 255,
  })
  inlandmarineLimitAmount: string | null;

  @Column('text', { name: 'crimeLimitDescription', nullable: true })
  crimeLimitDescription: string | null;

  @Column('character varying', {
    name: 'crimeLimitAmount',
    nullable: true,
    length: 255,
  })
  crimeLimitAmount: string | null;

  @Column('text', { name: 'boilerLimitDescription', nullable: true })
  boilerLimitDescription: string | null;

  @Column('character varying', {
    name: 'boilerLimitAmount',
    nullable: true,
    length: 255,
  })
  boilerLimitAmount: string | null;

  @Column('character varying', {
    name: 'equipmentMonthsStorage',
    nullable: true,
    length: 255,
  })
  equipmentMonthsStorage: string | null;

  @Column('character varying', {
    name: 'maxValueInBuilding',
    nullable: true,
    length: 255,
  })
  maxValueInBuilding: string | null;

  @Column('character varying', {
    name: 'maxValueOutside',
    nullable: true,
    length: 255,
  })
  maxValueOutside: string | null;

  @Column('text', { name: 'equipmentDescription', nullable: true })
  equipmentDescription: string | null;

  @Column('character varying', {
    name: 'maxItemValue',
    nullable: true,
    length: 255,
  })
  maxItemValue: string | null;

  @Column('character varying', {
    name: 'coinsurancePercent',
    nullable: true,
    length: 255,
  })
  coinsurancePercent: string | null;

  @Column('character varying', {
    name: 'equipmentNumber',
    nullable: true,
    length: 255,
  })
  equipmentNumber: string | null;

  @Column('character varying', {
    name: 'equipmentGroup',
    nullable: true,
    length: 255,
  })
  equipmentGroup: string | null;

  @Column('character varying', {
    name: 'equipmentSerial',
    nullable: true,
    length: 255,
  })
  equipmentSerial: string | null;

  @Column('character varying', {
    name: 'equipmentNewUsed',
    nullable: true,
    length: 255,
  })
  equipmentNewUsed: string | null;

  @Column('character varying', {
    name: 'equipmentDatePurchased',
    nullable: true,
    length: 255,
  })
  equipmentDatePurchased: string | null;

  @Column('character varying', {
    name: 'equipmentCapacity',
    nullable: true,
    length: 255,
  })
  equipmentCapacity: string | null;

  @Column('text', { name: 'generalInfo1', nullable: true })
  generalInfo1: string | null;

  @Column('text', { name: 'generalInfo2', nullable: true })
  generalInfo2: string | null;

  @Column('text', { name: 'generalInfo3', nullable: true })
  generalInfo3: string | null;

  @Column('text', { name: 'generalInfo4', nullable: true })
  generalInfo4: string | null;

  @Column('text', { name: 'explaination1', nullable: true })
  explaination1: string | null;

  @Column('character varying', {
    name: 'itemNumber',
    nullable: true,
    length: 255,
  })
  itemNumber: string | null;

  @Column('text', { name: 'itemOtherDescription', nullable: true })
  itemOtherDescription: string | null;

  @Column('character varying', {
    name: 'optionalCauseOfLoss',
    nullable: true,
    length: 255,
  })
  optionalCauseOfLoss: string | null;

  @Column('character varying', {
    name: 'earthquakeLimit',
    nullable: true,
    length: 255,
  })
  earthquakeLimit: string | null;

  @Column('character varying', {
    name: 'earthquakeDed',
    nullable: true,
    length: 255,
  })
  earthquakeDed: string | null;

  @Column('character varying', {
    name: 'floodLimit',
    nullable: true,
    length: 255,
  })
  floodLimit: string | null;

  @Column('character varying', {
    name: 'floodDed',
    nullable: true,
    length: 255,
  })
  floodDed: string | null;

  @Column('text', { name: 'describeOperations', nullable: true })
  describeOperations: string | null;

  @Column('character varying', {
    name: 'materialsValue',
    nullable: true,
    length: 255,
  })
  materialsValue: string | null;

  @Column('character varying', {
    name: 'jobSiteSecurity',
    nullable: true,
    length: 255,
  })
  jobSiteSecurity: string | null;

  @ManyToOne(() => Clients, (clients) => clients.locations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientLocationId', referencedColumnName: 'id' }])
  clientLocation: Clients[];

}
