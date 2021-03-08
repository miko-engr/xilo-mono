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
import { Companies } from '../company/company.entity';
import { Rates } from '../rate/Rates.entity';

@Entity('Homes', { schema: 'public' })
export class Homes {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'yearBuilt',
    nullable: true,
    length: 255,
    default: () => null,
  })
  yearBuilt: string | null;

  @Column('boolean', { name: 'hasCoverage', nullable: true })
  hasCoverage: boolean | null;

  @Column('character varying', {
    name: 'currentCarrier',
    nullable: true,
    length: 255,
    default: () => null,
  })
  currentCarrier: string | null;

  @Column('timestamp with time zone', {
    name: 'coverageExpiration',
    nullable: true,
  })
  coverageExpiration: Date | null;

  @Column('boolean', { name: 'hasCancelled', nullable: true })
  hasCancelled: boolean | null;

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
    name: 'purchasePrice',
    nullable: true,
    length: 255,
    default: () => null,
  })
  purchasePrice: string | null;

  @Column('character varying', {
    name: 'marketValue',
    nullable: true,
    length: 255,
    default: () => null,
  })
  marketValue: string | null;

  @Column('timestamp with time zone', { name: 'moveInDate', nullable: true })
  moveInDate: Date | null;

  @Column('character varying', {
    name: 'numOfStories',
    nullable: true,
    length: 255,
    default: () => null,
  })
  numOfStories: string | null;

  @Column('character varying', {
    name: 'totalSquareFootage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  totalSquareFootage: string | null;

  @Column('character varying', {
    name: 'primaryUse',
    nullable: true,
    length: 255,
    default: () => null,
  })
  primaryUse: string | null;

  @Column('character varying', {
    name: 'roofType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  roofType: string | null;

  @Column('character varying', {
    name: 'roofMaterial',
    nullable: true,
    length: 255,
    default: () => null,
  })
  roofMaterial: string | null;

  @Column('character varying', {
    name: 'homeType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  homeType: string | null;

  @Column('character varying', {
    name: 'distanceFromFireStation',
    nullable: true,
    length: 255,
    default: () => null,
  })
  distanceFromFireStation: string | null;

  @Column('character varying', {
    name: 'distanceFromFireHydrant',
    nullable: true,
    length: 255,
    default: () => null,
  })
  distanceFromFireHydrant: string | null;

  @Column('character varying', {
    name: 'numOfKitchens',
    nullable: true,
    length: 255,
    default: () => null,
  })
  numOfKitchens: string | null;

  @Column('character varying', {
    name: 'numOfBaths',
    nullable: true,
    length: 255,
    default: () => null,
  })
  numOfBaths: string | null;

  @Column('character varying', {
    name: 'numOfBeds',
    nullable: true,
    length: 255,
    default: () => null,
  })
  numOfBeds: string | null;

  @Column('character varying', {
    name: 'basementType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  basementType: string | null;

  @Column('boolean', { name: 'hasGarage', nullable: true })
  hasGarage: boolean | null;

  @Column('character varying', {
    name: 'garageSize',
    nullable: true,
    length: 255,
    default: () => null,
  })
  garageSize: string | null;

  @Column('character varying', {
    name: 'exteriorMaterials',
    nullable: true,
    length: 255,
    default: () => null,
  })
  exteriorMaterials: string | null;

  @Column('boolean', { name: 'hasBusinessConducted', nullable: true })
  hasBusinessConducted: boolean | null;

  @Column('boolean', { name: 'isCloseToTidalWater', nullable: true })
  isCloseToTidalWater: boolean | null;

  @Column('boolean', { name: 'hasConstructionRenovation', nullable: true })
  hasConstructionRenovation: boolean | null;

  @Column('boolean', { name: 'additionalHighEndItems', nullable: true })
  additionalHighEndItems: boolean | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('character varying', {
    name: 'streetNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  streetNumber: string | null;

  @Column('character varying', {
    name: 'roofBuilt',
    nullable: true,
    length: 255,
    default: () => null,
  })
  roofBuilt: string | null;

  @Column('character varying', {
    name: 'basementSize',
    nullable: true,
    length: 255,
    default: () => null,
  })
  basementSize: string | null;

  @Column('boolean', { name: 'hasBasement', nullable: true })
  hasBasement: boolean | null;

  @Column('varchar', {
    name: 'amentities',
    nullable: true,
    array: true,
    default: () => [],
  })
  amentities: string[] | null;

  @Column('character varying', {
    name: 'heatType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  heatType: string | null;

  @Column('character varying', {
    name: 'coolType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  coolType: string | null;

  @Column('character varying', {
    name: 'levelOfFinishes',
    nullable: true,
    length: 255,
    default: () => null,
  })
  levelOfFinishes: string | null;

  @Column('varchar', {
    name: 'safetySystems',
    nullable: true,
    array: true,
    default: () => [],
  })
  safetySystems: string[] | null;

  @Column('character varying', {
    name: 'distanceFromPoliceStation',
    nullable: true,
    length: 255,
    default: () => null,
  })
  distanceFromPoliceStation: string | null;

  @Column('character varying', {
    name: 'distanceFromTidalWater',
    nullable: true,
    length: 255,
    default: () => null,
  })
  distanceFromTidalWater: string | null;

  @Column('boolean', { name: 'hasPets', nullable: true })
  hasPets: boolean | null;

  @Column('boolean', { name: 'purchasedNew', nullable: true })
  purchasedNew: boolean | null;

  @Column('character varying', {
    name: 'purchaseDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  purchaseDate: string | null;

  @Column('character varying', {
    name: 'estimatedReplacementCost',
    nullable: true,
    length: 255,
    default: () => null,
  })
  estimatedReplacementCost: string | null;

  @Column('character varying', {
    name: 'residenceType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  residenceType: string | null;

  @Column('character varying', {
    name: 'structureType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  structureType: string | null;

  @Column('boolean', { name: 'hasPool', nullable: true })
  hasPool: boolean | null;

  @Column('boolean', { name: 'hasGatedCommunity', nullable: true })
  hasGatedCommunity: boolean | null;

  @Column('boolean', { name: 'hasRoofingImprovement', nullable: true })
  hasRoofingImprovement: boolean | null;

  @Column('character varying', {
    name: 'roofingImprovementYear',
    nullable: true,
    length: 255,
    default: () => null,
  })
  roofingImprovementYear: string | null;

  @Column('boolean', { name: 'hasWindMitigationForm', nullable: true })
  hasWindMitigationForm: boolean | null;

  @Column('character varying', {
    name: 'windMitigationInspectionDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  windMitigationInspectionDate: string | null;

  @Column('character varying', {
    name: 'sfPropertyId',
    nullable: true,
    length: 255,
    default: () => null,
  })
  sfPropertyId: string | null;

  @Column('character varying', {
    name: 'sfInsuredId',
    nullable: true,
    length: 255,
    default: () => null,
  })
  sfInsuredId: string | null;

  @Column('character varying', {
    name: 'unitNumber',
    nullable: true,
    length: 255,
    default: () => null,
  })
  unitNumber: string | null;

  @Column('boolean', { name: 'isNewlyPurchased', nullable: true })
  isNewlyPurchased: boolean | null;

  @Column('boolean', { name: 'hasUnitNumber', nullable: true })
  hasUnitNumber: boolean | null;

  @Column('boolean', { name: 'hasAutoBundle', nullable: true })
  hasAutoBundle: boolean | null;

  @Column('boolean', { name: 'hasNonSmoker', nullable: true })
  hasNonSmoker: boolean | null;

  @Column('boolean', { name: 'hasPayInFull', nullable: true })
  hasPayInFull: boolean | null;

  @Column('boolean', { name: 'hasImpactResistantRoof', nullable: true })
  hasImpactResistantRoof: boolean | null;

  @Column('boolean', { name: 'hasAlarmSystem', nullable: true })
  hasAlarmSystem: boolean | null;

  @Column('boolean', { name: 'isSmartHome', nullable: true })
  isSmartHome: boolean | null;

  @Column('character varying', {
    name: 'numberOfFireplaces',
    nullable: true,
    length: 255,
    default: () => null,
  })
  numberOfFireplaces: string | null;

  @Column('character varying', {
    name: 'numberOfWoodBurningStoves',
    nullable: true,
    length: 255,
  })
  numberOfWoodBurningStoves: string | null;

  @Column('character varying', {
    name: 'gargeType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  gargeType: string | null;

  @Column('character varying', {
    name: 'garageSizeByCar',
    nullable: true,
    length: 255,
    default: () => null,
  })
  garageSizeByCar: string | null;

  @Column('character varying', {
    name: 'otherHeatType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  otherHeatType: string | null;

  @Column('character varying', {
    name: 'otherCoolType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  otherCoolType: string | null;

  @Column('boolean', {
    name: 'hasRatesCreated',
    nullable: true,
    default: () => false,
  })
  hasRatesCreated: boolean | null;

  @Column('boolean', { name: 'hasTrampoline', nullable: true })
  hasTrampoline: boolean | null;

  @Column('character varying', {
    name: 'hasFencedPool',
    nullable: true,
    length: 255,
  })
  hasFencedPool: string | null;

  @Column('character varying', {
    name: 'petBreed',
    nullable: true,
    length: 255,
    default: () => null,
  })
  petBreed: string | null;

  @Column('integer', { name: 'companyHomeId', nullable: true })
  companyHomeId: number | null;

  @Column('boolean', { name: 'hasFireplaceOrWoodStove', nullable: true })
  hasFireplaceOrWoodStove: boolean | null;

  @Column('character varying', {
    name: 'petType',
    nullable: true,
    length: 255,
    default: () => null,
  })
  petType: string | null;

  @Column('boolean', { name: 'otherHouseMaterial', nullable: true })
  otherHouseMaterial: boolean | null;

  @Column('boolean', { name: 'otherRoofMaterial', nullable: true })
  otherRoofMaterial: boolean | null;

  @Column('boolean', { name: 'otherRoofType', nullable: true })
  otherRoofType: boolean | null;

  @Column('boolean', { name: 'hasFireAlarmDiscount', nullable: true })
  hasFireAlarmDiscount: boolean | null;

  @Column('character varying', {
    name: 'hasFencedTrampoline',
    nullable: true,
    length: 255,
  })
  hasFencedTrampoline: string | null;

  @Column('character varying', {
    name: 'hasNettedTrampoline',
    nullable: true,
    length: 255,
  })
  hasNettedTrampoline: string | null;

  @Column('character varying', {
    name: 'knobAndTubeWiring',
    nullable: true,
    length: 255,
    default: () => null,
  })
  knobAndTubeWiring: string | null;

  @Column('boolean', { name: 'hasDivingBoard', nullable: true })
  hasDivingBoard: boolean | null;

  @Column('character varying', {
    name: 'electricalUpdateDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  electricalUpdateDate: string | null;

  @Column('character varying', {
    name: 'plumbingUpdateDate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  plumbingUpdateDate: string | null;

  @Column('boolean', {
    name: 'hasGenerator',
    nullable: true,
    default: () => false,
  })
  hasGenerator: boolean | null;

  @Column('character varying', {
    name: 'hasSolarPanels',
    nullable: true,
    length: 255,
    default: () => null,
  })
  hasSolarPanels: string | null;

  @Column('character varying', {
    name: 'hasMortgage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  hasMortgage: string | null;

  @Column('character varying', {
    name: 'priorInsuranceYearsWithCarrier',
    nullable: true,
    length: 255,
    default: () => null,
  })
  priorInsuranceYearsWithCarrier: string | null;

  @Column('character varying', {
    name: 'homeUnderConstruction',
    nullable: true,
    length: 255,
  })
  homeUnderConstruction: string | null;

  @Column('character varying', {
    name: 'yearsSinceWiringUpdate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  yearsSinceWiringUpdate: string | null;

  @Column('character varying', {
    name: 'yearsSinceElectricalUpdate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  yearsSinceElectricalUpdate: string | null;

  @Column('character varying', {
    name: 'yearsSincePlumbingUpdate',
    nullable: true,
    length: 255,
    default: () => null,
  })
  yearsSincePlumbingUpdate: string | null;

  @Column('character varying', {
    name: 'homeHasGarage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  homeHasGarage: string | null;

  @Column('character varying', {
    name: 'homeHasBasement',
    nullable: true,
    length: 255,
    default: () => null,
  })
  homeHasBasement: string | null;

  @Column('character varying', {
    name: 'roofUpdateYear',
    nullable: true,
    length: 255,
  })
  roofUpdateYear: string | null;

  @Column('character varying', {
    name: 'plumbingUpdateYear',
    nullable: true,
    length: 255,
  })
  plumbingUpdateYear: string | null;

  @Column('character varying', {
    name: 'heatingUpdateYear',
    nullable: true,
    length: 255,
  })
  heatingUpdateYear: string | null;

  @Column('character varying', {
    name: 'electricalUpdateYear',
    nullable: true,
    length: 255,
  })
  electricalUpdateYear: string | null;

  @Column('character varying', {
    name: 'garageType',
    nullable: true,
    length: 255,
  })
  garageType: string | null;

  @Column('character varying', {
    name: 'hasSumpPump',
    nullable: true,
    length: 255,
  })
  hasSumpPump: string | null;

  @Column('character varying', {
    name: 'isInCity',
    nullable: true,
    length: 255,
  })
  isInCity: string | null;

  @Column('character varying', {
    name: 'landFoundationType',
    nullable: true,
    length: 255,
  })
  landFoundationType: string | null;

  @Column('character varying', {
    name: 'homeFoundationType',
    nullable: true,
    length: 255,
  })
  homeFoundationType: string | null;

  @Column('character varying', { name: 'hasDogs', nullable: true, length: 255 })
  hasDogs: string | null;

  @Column('character varying', {
    name: 'numberOfEmployeesWorkingInHome',
    nullable: true,
    length: 255,
  })
  numberOfEmployeesWorkingInHome: string | null;

  @Column('character varying', {
    name: 'fursAmount',
    nullable: true,
    length: 255,
  })
  fursAmount: string | null;

  @Column('character varying', {
    name: 'fineArtsAmount',
    nullable: true,
    length: 255,
  })
  fineArtsAmount: string | null;

  @Column('character varying', {
    name: 'gunsAmount',
    nullable: true,
    length: 255,
  })
  gunsAmount: string | null;

  @Column('character varying', {
    name: 'jewleryAmount',
    nullable: true,
    length: 255,
  })
  jewleryAmount: string | null;

  @Column('character varying', {
    name: 'hasPools',
    nullable: true,
    length: 255,
  })
  hasPools: string | null;

  @Column('character varying', {
    name: 'poolType',
    nullable: true,
    length: 255,
  })
  poolType: string | null;

  @Column('character varying', {
    name: 'poolHasFence',
    nullable: true,
    length: 255,
  })
  poolHasFence: string | null;

  @Column('character varying', {
    name: 'hasTrampolines',
    nullable: true,
    length: 255,
  })
  hasTrampolines: string | null;

  @Column('character varying', {
    name: 'hasFireplace',
    nullable: true,
    length: 255,
  })
  hasFireplace: string | null;

  @Column('character varying', {
    name: 'fireplaceType',
    nullable: true,
    length: 255,
  })
  fireplaceType: string | null;

  @Column('character varying', {
    name: 'fullAddress',
    nullable: true,
    length: 255,
  })
  fullAddress: string | null;

  @Column('character varying', {
    name: 'isInFireDistrict',
    nullable: true,
    length: 255,
  })
  isInFireDistrict: string | null;

  @Column('character varying', {
    name: 'hvacUpdateYear',
    nullable: true,
    length: 255,
  })
  hvacUpdateYear: string | null;

  @Column('character varying', {
    name: 'garageSeparatedFromHouse',
    nullable: true,
    length: 255,
  })
  garageSeparatedFromHouse: string | null;

  @Column('character varying', {
    name: 'numberOfFamilies',
    nullable: true,
    length: 255,
  })
  numberOfFamilies: string | null;

  @Column('character varying', {
    name: 'typeOfBusiness',
    nullable: true,
    length: 255,
  })
  typeOfBusiness: string | null;

  @Column('character varying', {
    name: 'ownerOrTenants',
    nullable: true,
    length: 255,
  })
  ownerOrTenants: string | null;

  @Column('character varying', {
    name: 'hasVehicles',
    nullable: true,
    length: 255,
  })
  hasVehicles: string | null;

  @Column('character varying', {
    name: 'hasWildPets',
    nullable: true,
    length: 255,
  })
  hasWildPets: string | null;

  @Column('character varying', {
    name: 'typeOfPlumbingPipes',
    nullable: true,
    length: 255,
  })
  typeOfPlumbingPipes: string | null;

  @Column('text', { name: 'floorFinishedDescription', nullable: true })
  floorFinishedDescription: string | null;

  @Column('text', { name: 'basementDescription', nullable: true })
  basementDescription: string | null;

  @Column('text', { name: 'amentitiesDescription', nullable: true })
  amentitiesDescription: string | null;

  @Column('boolean', {
    name: 'hasNewRoof',
    nullable: true,
    default: () => false,
  })
  hasNewRoof: boolean | null;

  @Column('boolean', {
    name: 'hasArchitecturalShingles',
    nullable: true,
    default: () => false,
  })
  hasArchitecturalShingles: boolean | null;

  @Column('character varying', {
    name: 'hasDogHidden',
    nullable: true,
    length: 255,
  })
  hasDogHidden: string | null;

  @Column('character varying', {
    name: 'hasTrampolineHidden',
    nullable: true,
    length: 255,
  })
  hasTrampolineHidden: string | null;

  @Column('character varying', {
    name: 'isNewBuild',
    nullable: true,
    length: 255,
  })
  isNewBuild: string | null;

  @Column('text', { name: 'otherHouseHoldMembersDescription', nullable: true })
  otherHouseHoldMembersDescription: string | null;

  @Column('text', { name: 'renovationHistoryDescription', nullable: true })
  renovationHistoryDescription: string | null;

  @Column('character varying', {
    name: 'hasMonitoredAlarmSystem',
    nullable: true,
    length: 255,
  })
  hasMonitoredAlarmSystem: string | null;

  @Column('character varying', {
    name: 'hasBusiness',
    nullable: true,
    length: 255,
  })
  hasBusiness: string | null;

  @Column('character varying', { name: 'hasHoa', nullable: true, length: 255 })
  hasHoa: string | null;

  @Column('character varying', {
    name: 'numberOfTenants',
    nullable: true,
    length: 255,
  })
  numberOfTenants: string | null;

  @Column('character varying', {
    name: 'isNewPurchase',
    nullable: true,
    length: 255,
  })
  isNewPurchase: string | null;

  @Column('character varying', {
    name: 'expectedClosingDate',
    nullable: true,
    length: 255,
  })
  expectedClosingDate: string | null;

  @Column('character varying', { name: 'deeded', nullable: true, length: 255 })
  deeded: string | null;

  @Column('character varying', {
    name: 'rentalManagementCompany',
    nullable: true,
    length: 255,
  })
  rentalManagementCompany: string | null;

  @Column('character varying', {
    name: 'crawlSpaceType',
    nullable: true,
    length: 255,
  })
  crawlSpaceType: string | null;

  @Column('character varying', {
    name: 'roofShape',
    nullable: true,
    length: 255,
  })
  roofShape: string | null;

  @Column('character varying', {
    name: 'hasOtherDetachedStructures',
    nullable: true,
    length: 255,
  })
  hasOtherDetachedStructures: string | null;

  @Column('character varying', {
    name: 'otherDetachedStructureType',
    nullable: true,
    length: 255,
  })
  otherDetachedStructureType: string | null;

  @Column('boolean', {
    name: 'hasGuardedCommunity',
    nullable: true,
    default: () => false,
  })
  hasGuardedCommunity: boolean | null;

  @Column('boolean', {
    name: 'hasHurricaneShutters',
    nullable: true,
    default: () => false,
  })
  hasHurricaneShutters: boolean | null;

  @Column('character varying', {
    name: 'streetAddress',
    nullable: true,
    length: 255,
  })
  streetAddress: string | null;

  @Column('character varying', { name: 'county', nullable: true, length: 255 })
  county: string | null;

  @Column('character varying', { name: 'premium', nullable: true, length: 255 })
  premium: string | null;

  @Column('character varying', { name: 'fees', nullable: true, length: 255 })
  fees: string | null;

  @Column('text', { name: 'mortgagees', nullable: true })
  mortgagees: string | null;

  @Column('character varying', {
    name: 'dwellingCoverage',
    nullable: true,
    length: 255,
  })
  dwellingCoverage: string | null;

  @Column('character varying', {
    name: 'personalPropertyCoverage',
    nullable: true,
    length: 255,
  })
  personalPropertyCoverage: string | null;

  @Column('character varying', {
    name: 'lossOfUseCoverage',
    nullable: true,
    length: 255,
  })
  lossOfUseCoverage: string | null;

  @Column('character varying', {
    name: 'personalLiabilityCoverage',
    nullable: true,
    length: 255,
  })
  personalLiabilityCoverage: string | null;

  @Column('character varying', {
    name: 'medicalPaymentsCoverage',
    nullable: true,
    length: 255,
  })
  medicalPaymentsCoverage: string | null;

  @Column('character varying', {
    name: 'allPerilsDeductible',
    nullable: true,
    length: 255,
  })
  allPerilsDeductible: string | null;

  @Column('character varying', {
    name: 'theftDeductible',
    nullable: true,
    length: 255,
  })
  theftDeductible: string | null;

  @Column('varchar', { name: 'discounts', nullable: true, array: true })
  discounts: string[] | null;

  @Column('character varying', {
    name: 'hasMultiPolicyDiscount',
    nullable: true,
    length: 255,
  })
  hasMultiPolicyDiscount: string | null;

  @Column('character varying', {
    name: 'nonSmokerDiscount',
    nullable: true,
    length: 255,
  })
  nonSmokerDiscount: string | null;

  @Column('character varying', {
    name: 'retireeDiscount',
    nullable: true,
    length: 255,
  })
  retireeDiscount: string | null;

  @Column('character varying', {
    name: 'matureDiscount',
    nullable: true,
    length: 255,
  })
  matureDiscount: string | null;

  @Column('character varying', {
    name: 'retirementCommunityDiscount',
    nullable: true,
    length: 255,
  })
  retirementCommunityDiscount: string | null;

  @Column('character varying', {
    name: 'gatedCommunityDiscount',
    nullable: true,
    length: 255,
  })
  gatedCommunityDiscount: string | null;

  @Column('character varying', {
    name: 'limitedAccessDiscount',
    nullable: true,
    length: 255,
  })
  limitedAccessDiscount: string | null;

  @Column('character varying', {
    name: 'costPerSquareFoot',
    nullable: true,
    length: 255,
  })
  costPerSquareFoot: string | null;

  @Column('character varying', {
    name: 'hasDeadBoltDiscount',
    nullable: true,
    length: 255,
  })
  hasDeadBoltDiscount: string | null;

  @Column('character varying', {
    name: 'hasVisibleToNeighborDiscount',
    nullable: true,
    length: 255,
  })
  hasVisibleToNeighborDiscount: string | null;

  @Column('character varying', {
    name: 'hasMannedSecurityDiscount',
    nullable: true,
    length: 255,
  })
  hasMannedSecurityDiscount: string | null;

  @Column('character varying', {
    name: 'hasInsurance',
    nullable: true,
    length: 255,
  })
  hasInsurance: string | null;

  @Column('character varying', {
    name: 'insuranceCompany',
    nullable: true,
    length: 255,
  })
  insuranceCompany: string | null;

  @Column('character varying', {
    name: 'yearsWithCompany',
    nullable: true,
    length: 255,
  })
  yearsWithCompany: string | null;

  @Column('character varying', {
    name: 'monthsWithCompany',
    nullable: true,
    length: 255,
  })
  monthsWithCompany: string | null;

  @Column('character varying', {
    name: 'yearsWithInsurance',
    nullable: true,
    length: 255,
  })
  yearsWithInsurance: string | null;

  @Column('character varying', {
    name: 'monthsWithInsurance',
    nullable: true,
    length: 255,
  })
  monthsWithInsurance: string | null;

  @Column('character varying', {
    name: 'identityTheft',
    nullable: true,
    length: 255,
  })
  identityTheft: string | null;

  @Column('character varying', {
    name: 'lossAssessment',
    nullable: true,
    length: 255,
  })
  lossAssessment: string | null;

  @Column('character varying', {
    name: 'ordinanceOrLaw',
    nullable: true,
    length: 255,
  })
  ordinanceOrLaw: string | null;

  @Column('character varying', {
    name: 'personalInjuryEndorsement',
    nullable: true,
    length: 255,
  })
  personalInjuryEndorsement: string | null;

  @Column('character varying', {
    name: 'increaseReplacementCostPercent',
    nullable: true,
    length: 255,
  })
  increaseReplacementCostPercent: string | null;

  @Column('character varying', {
    name: 'replacementCostContent',
    nullable: true,
    length: 255,
  })
  replacementCostContent: string | null;

  @Column('character varying', {
    name: 'waterBackupCoverage',
    nullable: true,
    length: 255,
  })
  waterBackupCoverage: string | null;

  @Column('character varying', {
    name: 'hasPackage',
    nullable: true,
    length: 255,
  })
  hasPackage: string | null;

  @Column('character varying', {
    name: 'insuranceExpirationDate',
    nullable: true,
    length: 255,
  })
  insuranceExpirationDate: string | null;

  @Column('character varying', { name: 'acres', nullable: true, length: 255 })
  acres: string | null;

  @Column('character varying', {
    name: 'within1000FtFireHydrant',
    nullable: true,
    length: 255,
  })
  within1000FtFireHydrant: string | null;

  @Column('character varying', {
    name: 'hurricaneDeductible',
    nullable: true,
    length: 255,
  })
  hurricaneDeductible: string | null;

  @Column('character varying', {
    name: 'hasCoInsured',
    nullable: true,
    length: 255,
  })
  hasCoInsured: string | null;

  @Column('character varying', {
    name: 'hasSecondMortgage',
    nullable: true,
    length: 255,
  })
  hasSecondMortgage: string | null;

  @Column('character varying', {
    name: 'hasDayCare',
    nullable: true,
    length: 255,
  })
  hasDayCare: string | null;

  @Column('character varying', {
    name: 'isShortTermRental',
    nullable: true,
    length: 255,
  })
  isShortTermRental: string | null;

  @Column('character varying', {
    name: 'typeOfDeck',
    nullable: true,
    length: 255,
  })
  typeOfDeck: string | null;

  @Column('character varying', {
    name: 'hasFinishedBasement',
    nullable: true,
    length: 255,
  })
  hasFinishedBasement: string | null;

  @Column('character varying', {
    name: 'hasSmoker',
    nullable: true,
    length: 255,
  })
  hasSmoker: string | null;

  @Column('character varying', {
    name: 'landlordRequiresCoverage',
    nullable: true,
    length: 255,
  })
  landlordRequiresCoverage: string | null;

  @Column('character varying', {
    name: 'needsCoverageForBasementProperty',
    nullable: true,
    length: 255,
  })
  needsCoverageForBasementProperty: string | null;

  @Column('character varying', {
    name: 'hasSupplementalHeat',
    nullable: true,
    length: 255,
  })
  hasSupplementalHeat: string | null;

  @Column('character varying', {
    name: 'currentDwellingLimit',
    nullable: true,
    length: 255,
  })
  currentDwellingLimit: string | null;

  @Column('character varying', {
    name: 'currentLiabilityLimit',
    nullable: true,
    length: 255,
  })
  currentLiabilityLimit: string | null;

  @Column('character varying', {
    name: 'currentDeductible',
    nullable: true,
    length: 255,
  })
  currentDeductible: string | null;

  @Column('character varying', {
    name: 'floorMaterial',
    nullable: true,
    length: 255,
  })
  floorMaterial: string | null;

  @Column('character varying', {
    name: 'burglarAlarmType',
    nullable: true,
    length: 255,
  })
  burglarAlarmType: string | null;

  @Column('character varying', { name: 'hasDeck', nullable: true, length: 255 })
  hasDeck: string | null;

  @Column('character varying', {
    name: 'brushClearance',
    nullable: true,
    length: 255,
  })
  brushClearance: string | null;

  @Column('character varying', {
    name: 'mortgageeAddress',
    nullable: true,
    length: 255,
  })
  mortgageeAddress: string | null;

  @Column('character varying', {
    name: 'loanNumber',
    nullable: true,
    length: 255,
  })
  loanNumber: string | null;

  @Column('character varying', {
    name: 'trustName',
    nullable: true,
    length: 255,
  })
  trustName: string | null;

  @Column('character varying', {
    name: 'riskMeterScore',
    nullable: true,
    length: 255,
  })
  riskMeterScore: string | null;

  @Column('character varying', {
    name: 'numOfFullBaths',
    nullable: true,
    length: 255,
  })
  numOfFullBaths: string | null;

  @Column('character varying', {
    name: 'numOfHalfBaths',
    nullable: true,
    length: 255,
  })
  numOfHalfBaths: string | null;

  @Column('text', { name: 'comments', nullable: true })
  comments: string | null;

  @Column('character varying', {
    name: 'hasSmokeDetector',
    nullable: true,
    length: 255,
  })
  hasSmokeDetector: string | null;

  @Column('character varying', {
    name: 'smokeDetectorType',
    nullable: true,
    length: 255,
  })
  smokeDetectorType: string | null;

  @Column('character varying', {
    name: 'hasFireExtinguisher',
    nullable: true,
    length: 255,
  })
  hasFireExtinguisher: string | null;

  @Column('character varying', {
    name: 'hasSprinklerSystem',
    nullable: true,
    length: 255,
  })
  hasSprinklerSystem: string | null;

  @Column('character varying', {
    name: 'sprinklerSystemType',
    nullable: true,
    length: 255,
  })
  sprinklerSystemType: string | null;

  @Column('character varying', {
    name: 'hasFireSystem',
    nullable: true,
    length: 255,
  })
  hasFireSystem: string | null;

  @Column('character varying', {
    name: 'fireSystemType',
    nullable: true,
    length: 255,
  })
  fireSystemType: string | null;

  @Column('character varying', {
    name: 'hasPoolHidden',
    nullable: true,
    length: 255,
  })
  hasPoolHidden: string | null;

  @Column('character varying', {
    name: 'ownershipType',
    nullable: true,
    length: 255,
  })
  ownershipType: string | null;

  @Column('character varying', {
    name: 'numberOfUnits',
    nullable: true,
    length: 255,
  })
  numberOfUnits: string | null;

  @Column('character varying', {
    name: 'hasTenants',
    nullable: true,
    length: 255,
  })
  hasTenants: string | null;

  @Column('character varying', {
    name: 'hasExoticPets',
    nullable: true,
    length: 255,
  })
  hasExoticPets: string | null;

  @Column('character varying', {
    name: 'hasMortgagee',
    nullable: true,
    length: 255,
  })
  hasMortgagee: string | null;

  @Column('character varying', {
    name: 'loanAmount',
    nullable: true,
    length: 255,
  })
  loanAmount: string | null;

  @Column('character varying', {
    name: 'hasCoveredPorch',
    nullable: true,
    length: 255,
  })
  hasCoveredPorch: string | null;

  @Column('character varying', {
    name: 'hasFrontPorch',
    nullable: true,
    length: 255,
  })
  hasFrontPorch: string | null;

  @Column('character varying', {
    name: 'otherFinishesAndAmentities',
    nullable: true,
    length: 255,
  })
  otherFinishesAndAmentities: string | null;

  @Column('character varying', {
    name: 'percentVaulted',
    nullable: true,
    length: 255,
  })
  percentVaulted: string | null;

  @Column('character varying', {
    name: 'numberOfSkylights',
    nullable: true,
    length: 255,
  })
  numberOfSkylights: string | null;

  @Column('character varying', {
    name: 'numberOfSlidingDoors',
    nullable: true,
    length: 255,
  })
  numberOfSlidingDoors: string | null;

  @Column('character varying', {
    name: 'numberOfFrenchDoors',
    nullable: true,
    length: 255,
  })
  numberOfFrenchDoors: string | null;

  @Column('character varying', {
    name: 'hasWetbar',
    nullable: true,
    length: 255,
  })
  hasWetbar: string | null;

  @Column('character varying', {
    name: 'hasPictureWindows',
    nullable: true,
    length: 255,
  })
  hasPictureWindows: string | null;

  @Column('character varying', {
    name: 'hasWoodTrim',
    nullable: true,
    length: 255,
  })
  hasWoodTrim: string | null;

  @Column('character varying', {
    name: 'hasSmartCamera',
    nullable: true,
    length: 255,
  })
  hasSmartCamera: string | null;

  @Column('character varying', {
    name: 'hasWaterLeakDetection',
    nullable: true,
    length: 255,
  })
  hasWaterLeakDetection: string | null;

  @Column('character varying', {
    name: 'hasGasLeakDetection',
    nullable: true,
    length: 255,
  })
  hasGasLeakDetection: string | null;

  @Column('character varying', {
    name: 'hasOtherSmartTechnology',
    nullable: true,
    length: 255,
  })
  hasOtherSmartTechnology: string | null;

  @Column('character varying', {
    name: 'hasClassFourShingles',
    nullable: true,
    length: 255,
  })
  hasClassFourShingles: string | null;

  @Column('character varying', {
    name: 'hasHeatUpdate',
    nullable: true,
    length: 255,
  })
  hasHeatUpdate: string | null;

  @Column('character varying', {
    name: 'hasElectricalUpdate',
    nullable: true,
    length: 255,
  })
  hasElectricalUpdate: string | null;

  @Column('character varying', {
    name: 'hasPlumbingUpdate',
    nullable: true,
    length: 255,
  })
  hasPlumbingUpdate: string | null;

  @Column('character varying', {
    name: 'hasCoolingUpdate',
    nullable: true,
    length: 255,
  })
  hasCoolingUpdate: string | null;

  @Column('character varying', {
    name: 'hasBackupForSumpPump',
    nullable: true,
    length: 255,
  })
  hasBackupForSumpPump: string | null;

  @Column('character varying', {
    name: 'mortgageInEscrow',
    nullable: true,
    length: 255,
  })
  mortgageInEscrow: string | null;

  @Column('character varying', {
    name: 'numberOfDogs',
    nullable: true,
    length: 255,
  })
  numberOfDogs: string | null;

  @Column('character varying', {
    name: 'hasHotTub',
    nullable: true,
    length: 255,
  })
  hasHotTub: string | null;

  @Column('character varying', {
    name: 'hasDivingBoardOnPool',
    nullable: true,
    length: 255,
  })
  hasDivingBoardOnPool: string | null;

  @Column('character varying', {
    name: 'hasScheduledProperty',
    nullable: true,
    length: 255,
  })
  hasScheduledProperty: string | null;

  @Column('character varying', {
    name: 'numberOfFloorsBelow',
    nullable: true,
    length: 255,
  })
  numberOfFloorsBelow: string | null;

  @Column('character varying', {
    name: 'numberOfFloorsAbove',
    nullable: true,
    length: 255,
  })
  numberOfFloorsAbove: string | null;

  @Column('character varying', {
    name: 'buildingCoverage',
    nullable: true,
    length: 255,
  })
  buildingCoverage: string | null;

  @Column('character varying', {
    name: 'monthlyRent',
    nullable: true,
    length: 255,
  })
  monthlyRent: string | null;

  @Column('varchar', { name: 'memberships', nullable: true, array: true })
  memberships: string[] | null;

  @Column('character varying', {
    name: 'hasSecondMortgagee',
    nullable: true,
    length: 255,
  })
  hasSecondMortgagee: string | null;

  @Column('character varying', {
    name: 'secondMortgageeAddress',
    nullable: true,
    length: 255,
  })
  secondMortgageeAddress: string | null;

  @Column('character varying', {
    name: 'hasLeinHolder',
    nullable: true,
    length: 255,
  })
  hasLeinHolder: string | null;

  @Column('character varying', {
    name: 'hasSecondLeinHolder',
    nullable: true,
    length: 255,
  })
  hasSecondLeinHolder: string | null;

  @Column('character varying', {
    name: 'leinHolderAddress',
    nullable: true,
    length: 255,
  })
  leinHolderAddress: string | null;

  @Column('character varying', {
    name: 'secondLeinHolderAddress',
    nullable: true,
    length: 255,
  })
  secondLeinHolderAddress: string | null;

  @Column('character varying', {
    name: 'hasAdditionalInsured',
    nullable: true,
    length: 255,
  })
  hasAdditionalInsured: string | null;

  @Column('character varying', {
    name: 'hasSecondAdditionalInsured',
    nullable: true,
    length: 255,
  })
  hasSecondAdditionalInsured: string | null;

  @Column('character varying', {
    name: 'additionalInsuredAddress',
    nullable: true,
    length: 255,
  })
  additionalInsuredAddress: string | null;

  @Column('character varying', {
    name: 'secondAdditionalInsuredAddress',
    nullable: true,
    length: 255,
  })
  secondAdditionalInsuredAddress: string | null;

  @Column('character varying', {
    name: 'hasPetBiteHistory',
    nullable: true,
    length: 255,
  })
  hasPetBiteHistory: string | null;

  @Column('character varying', {
    name: 'hasFarmAnimals',
    nullable: true,
    length: 255,
  })
  hasFarmAnimals: string | null;

  @Column('character varying', {
    name: 'smartHomeCompany',
    nullable: true,
    length: 255,
  })
  smartHomeCompany: string | null;

  @Column('character varying', {
    name: 'securitySystemCompany',
    nullable: true,
    length: 255,
  })
  securitySystemCompany: string | null;

  @Column('character varying', {
    name: 'hasFarming',
    nullable: true,
    length: 255,
  })
  hasFarming: string | null;

  @Column('character varying', {
    name: 'hasSportRamps',
    nullable: true,
    length: 255,
  })
  hasSportRamps: string | null;

  @Column('character varying', {
    name: 'basementFinishPercentage',
    nullable: true,
    length: 255,
  })
  basementFinishPercentage: string | null;

  @Column('character varying', {
    name: 'securitySystemRingDestination',
    nullable: true,
    length: 255,
  })
  securitySystemRingDestination: string | null;

  @Column('character varying', {
    name: 'hasWoodBurningInsert',
    nullable: true,
    length: 255,
  })
  hasWoodBurningInsert: string | null;

  @Column('character varying', {
    name: 'woodBurningStoveLocation',
    nullable: true,
    length: 255,
  })
  woodBurningStoveLocation: string | null;

  @Column('character varying', {
    name: 'circuitBreakerType',
    nullable: true,
    length: 255,
  })
  circuitBreakerType: string | null;

  @Column('character varying', {
    name: 'circuitBreakerAmps',
    nullable: true,
    length: 255,
  })
  circuitBreakerAmps: string | null;

  @Column('character varying', {
    name: 'roofCondition',
    nullable: true,
    length: 255,
  })
  roofCondition: string | null;

  @Column('character varying', {
    name: 'roofIsHailResistant',
    nullable: true,
    length: 255,
  })
  roofIsHailResistant: string | null;

  @Column('character varying', {
    name: 'hasOtherProperties',
    nullable: true,
    length: 255,
  })
  hasOtherProperties: string | null;

  @Column('character varying', {
    name: 'hasOtherStructures',
    nullable: true,
    length: 255,
  })
  hasOtherStructures: string | null;

  @Column('character varying', {
    name: 'otherStructureIsHeated',
    nullable: true,
    length: 255,
  })
  otherStructureIsHeated: string | null;

  @Column('character varying', {
    name: 'otherStructureHeatType',
    nullable: true,
    length: 255,
  })
  otherStructureHeatType: string | null;

  @Column('character varying', {
    name: 'otherStructurePrimaryUse',
    nullable: true,
    length: 255,
  })
  otherStructurePrimaryUse: string | null;

  @Column('character varying', {
    name: 'hasUnits',
    nullable: true,
    length: 255,
  })
  hasUnits: string | null;

  @Column('character varying', {
    name: 'isPrefabricatedHome',
    nullable: true,
    length: 255,
  })
  isPrefabricatedHome: string | null;

  @Column('character varying', {
    name: 'isMobileHome',
    nullable: true,
    length: 255,
  })
  isMobileHome: string | null;

  @Column('character varying', {
    name: 'mobileHomeYear',
    nullable: true,
    length: 255,
  })
  mobileHomeYear: string | null;

  @Column('character varying', {
    name: 'mobileHomeMake',
    nullable: true,
    length: 255,
  })
  mobileHomeMake: string | null;

  @Column('character varying', {
    name: 'mobileHomeLength',
    nullable: true,
    length: 255,
  })
  mobileHomeLength: string | null;

  @Column('character varying', {
    name: 'mobileHomeWidth',
    nullable: true,
    length: 255,
  })
  mobileHomeWidth: string | null;

  @Column('character varying', {
    name: 'landIsRented',
    nullable: true,
    length: 255,
  })
  landIsRented: string | null;

  @Column('character varying', {
    name: 'mortgageBilled',
    nullable: true,
    length: 255,
  })
  mortgageBilled: string | null;

  @Column('character varying', {
    name: 'firstMortgageDescription',
    nullable: true,
    length: 255,
  })
  firstMortgageDescription: string | null;

  @Column('character varying', {
    name: 'secondMortgageDescription',
    nullable: true,
    length: 255,
  })
  secondMortgageDescription: string | null;

  @Column('character varying', {
    name: 'needsFloodInsurance',
    nullable: true,
    length: 255,
  })
  needsFloodInsurance: string | null;

  @Column('character varying', {
    name: 'windDeductible',
    nullable: true,
    length: 255,
  })
  windDeductible: string | null;

  @Column('character varying', {
    name: 'isOwnGeneralContractor',
    nullable: true,
    length: 255,
  })
  isOwnGeneralContractor: string | null;

  @Column('character varying', {
    name: 'dateOfLastInspection',
    nullable: true,
    length: 255,
  })
  dateOfLastInspection: string | null;

  @Column('character varying', {
    name: 'fireDistrict',
    nullable: true,
    length: 255,
  })
  fireDistrict: string | null;

  @Column('character varying', {
    name: 'constructionType',
    nullable: true,
    length: 255,
  })
  constructionType: string | null;

  @Column('character varying', {
    name: 'woodBurnerType',
    nullable: true,
    length: 255,
  })
  woodBurnerType: string | null;

  @Column('character varying', {
    name: 'studOwnership',
    nullable: true,
    length: 255,
  })
  studOwnership: string | null;

  @Column('character varying', {
    name: 'personalPropertyAmount',
    nullable: true,
    length: 255,
  })
  personalPropertyAmount: string | null;

  @Column('character varying', {
    name: 'isRental',
    nullable: true,
    length: 255,
  })
  isRental: string | null;

  @Column('character varying', {
    name: 'hasPersonalPropertyOnSite',
    nullable: true,
    length: 255,
  })
  hasPersonalPropertyOnSite: string | null;

  @Column('character varying', {
    name: 'policyNumber',
    nullable: true,
    length: 255,
  })
  policyNumber: string | null;

  @Column('character varying', {
    name: 'constructionMethod',
    nullable: true,
    length: 255,
  })
  constructionMethod: string | null;

  @Column('character varying', {
    name: 'zillowLink',
    nullable: true,
    length: 255,
  })
  zillowLink: string | null;

  @Column('character varying', {
    name: 'hasSupplementalHeater',
    nullable: true,
    length: 255,
  })
  hasSupplementalHeater: string | null;

  @Column('character varying', {
    name: 'backupSystemType',
    nullable: true,
    length: 255,
  })
  backupSystemType: string | null;

  @Column('character varying', {
    name: 'priceRange',
    nullable: true,
    length: 255,
  })
  priceRange: string | null;

  @Column('character varying', {
    name: 'hasRealtor',
    nullable: true,
    length: 255,
  })
  hasRealtor: string | null;

  @Column('character varying', {
    name: 'improveCredit',
    nullable: true,
    length: 255,
  })
  improveCredit: string | null;

  @Column('character varying', {
    name: 'electricalType',
    nullable: true,
    length: 255,
  })
  electricalType: string | null;

  @Column('character varying', {
    name: 'typeOfFarmAnimals',
    nullable: true,
    length: 255,
  })
  typeOfFarmAnimals: string | null;

  @Column('character varying', {
    name: 'otherStructures',
    nullable: true,
    length: 255,
  })
  otherStructures: string | null;

  @Column('character varying', {
    name: 'premiumInEscrow',
    nullable: true,
    length: 255,
  })
  premiumInEscrow: string | null;

  @Column('character varying', {
    name: 'waterHeaterUpdateYear',
    nullable: true,
    length: 255,
  })
  waterHeaterUpdateYear: string | null;

  @Column('character varying', {
    name: 'solarPanelOwnership',
    nullable: true,
    length: 255,
  })
  solarPanelOwnership: string | null;

  @Column('character varying', {
    name: 'solarPanelValue',
    nullable: true,
    length: 255,
  })
  solarPanelValue: string | null;

  @Column('character varying', {
    name: 'hasPatios',
    nullable: true,
    length: 255,
  })
  hasPatios: string | null;

  @Column('text', { name: 'patioDescription', nullable: true })
  patioDescription: string | null;

  @Column('character varying', {
    name: 'tenantOccupancy',
    nullable: true,
    length: 255,
  })
  tenantOccupancy: string | null;

  @Column('character varying', {
    name: 'hasWinterPoolCoverage',
    nullable: true,
    length: 255,
  })
  hasWinterPoolCoverage: string | null;

  @Column('character varying', {
    name: 'furnaceAge',
    nullable: true,
    length: 255,
  })
  furnaceAge: string | null;

  @Column('character varying', {
    name: 'hasCircuitBreakers',
    nullable: true,
    length: 255,
  })
  hasCircuitBreakers: string | null;

  @Column('character varying', {
    name: 'hasVideoDoorbell',
    nullable: true,
    length: 255,
  })
  hasVideoDoorbell: string | null;

  @Column('character varying', {
    name: 'hasIndoorCamera',
    nullable: true,
    length: 255,
  })
  hasIndoorCamera: string | null;

  @Column('character varying', {
    name: 'hasOutdoorCamera',
    nullable: true,
    length: 255,
  })
  hasOutdoorCamera: string | null;

  @Column('character varying', {
    name: 'hasMinors',
    nullable: true,
    length: 255,
  })
  hasMinors: string | null;

  @Column('character varying', {
    name: 'numberOfMinors',
    nullable: true,
    length: 255,
  })
  numberOfMinors: string | null;

  @Column('character varying', {
    name: 'liabilityInsuranceProofRequired',
    nullable: true,
    length: 255,
  })
  liabilityInsuranceProofRequired: string | null;

  @Column('character varying', {
    name: 'desiredLiabilityLimit',
    nullable: true,
    length: 255,
  })
  desiredLiabilityLimit: string | null;

  @Column('character varying', {
    name: 'hasRoommates',
    nullable: true,
    length: 255,
  })
  hasRoommates: string | null;

  @Column('text', { name: 'roommatesDetails', nullable: true })
  roommatesDetails: string | null;

  @Column('character varying', {
    name: 'hasWoodBurningStove',
    nullable: true,
    length: 255,
  })
  hasWoodBurningStove: string | null;

  @Column('text', { name: 'homeownersCoverageItems', nullable: true })
  homeownersCoverageItems: string | null;

  @Column('character varying', {
    name: 'mortgageeEmail',
    nullable: true,
    length: 255,
  })
  mortgageeEmail: string | null;

  @Column('character varying', {
    name: 'coverageAmount',
    nullable: true,
    length: 255,
  })
  coverageAmount: string | null;

  @Column('character varying', {
    name: 'mortgageeName',
    nullable: true,
    length: 255,
  })
  mortgageeName: string | null;

  @Column('character varying', {
    name: 'priorEvidenceDate',
    nullable: true,
    length: 255,
  })
  priorEvidenceDate: string | null;

  @Column('character varying', {
    name: 'insuranceCarrierAddress',
    nullable: true,
    length: 255,
  })
  insuranceCarrierAddress: string | null;

  @Column('character varying', {
    name: 'effectiveDate',
    nullable: true,
    length: 255,
  })
  effectiveDate: string | null;

  @Column('text', { name: 'propertyDescription', nullable: true })
  propertyDescription: string | null;

  @Column('character varying', {
    name: 'typeOfCoverage',
    nullable: true,
    length: 255,
  })
  typeOfCoverage: string | null;

  @Column('character varying', {
    name: 'footTraffic',
    nullable: true,
    length: 255,
  })
  footTraffic: string | null;

  @Column('character varying', {
    name: 'constructionGrade',
    nullable: true,
    length: 255,
  })
  constructionGrade: string | null;

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
    name: 'blanketPersProp',
    nullable: true,
    length: 255,
  })
  blanketPersProp: string | null;

  @Column('character varying', {
    name: 'blanketBldg',
    nullable: true,
    length: 255,
  })
  blanketBldg: string | null;

  @Column('character varying', {
    name: 'homeStatus',
    nullable: true,
    length: 255,
  })
  homeStatus: string | null;

  @Column('character varying', {
    name: 'lengthAtAddress',
    nullable: true,
    length: 255,
  })
  lengthAtAddress: string | null;

  @Column('character varying', {
    name: 'noPriorReason',
    nullable: true,
    length: 255,
  })
  noPriorReason: string | null;

  @Column('character varying', {
    name: 'numberOfResidentsUnder21',
    nullable: true,
    length: 255,
  })
  numberOfResidentsUnder21: string | null;

  @Column('varchar', { name: 'securityDevices', nullable: true, array: true })
  securityDevices: string[] | null;

  @Column('character varying', {
    name: 'contentsProtection',
    nullable: true,
    length: 255,
  })
  contentsProtection: string | null;

  @Column('character varying', {
    name: 'securitySystem',
    nullable: true,
    length: 255,
  })
  securitySystem: string | null;

  @Column('character varying', {
    name: 'circuitBreakerAge',
    nullable: true,
    length: 255,
  })
  circuitBreakerAge: string | null;

  @Column('character varying', {
    name: 'localAlarm',
    nullable: true,
    length: 255,
  })
  localAlarm: string | null;

  @Column('character varying', { name: 'coins', nullable: true, length: 255 })
  coins: string | null;

  @Column('character varying', { name: 'china', nullable: true, length: 255 })
  china: string | null;

  @Column('character varying', { name: 'golf', nullable: true, length: 255 })
  golf: string | null;

  @Column('character varying', {
    name: 'cameraEquipment',
    nullable: true,
    length: 255,
  })
  cameraEquipment: string | null;

  @Column('character varying', {
    name: 'collectibles',
    nullable: true,
    length: 255,
  })
  collectibles: string | null;

  @Column('character varying', {
    name: 'smokeDetectorMaintenance',
    nullable: true,
    length: 255,
  })
  smokeDetectorMaintenance: string | null;

  @Column('character varying', {
    name: 'roofCost',
    nullable: true,
    length: 255,
  })
  roofCost: string | null;

  @Column('character varying', {
    name: 'waterDamage',
    nullable: true,
    length: 255,
  })
  waterDamage: string | null;

  @Column('character varying', {
    name: 'priorAddressUnitNumber',
    nullable: true,
    length: 255,
  })
  priorAddressUnitNumber: string | null;

  @Column('character varying', {
    name: 'undergroundOilTank',
    nullable: true,
    length: 255,
  })
  undergroundOilTank: string | null;

  @Column('character varying', {
    name: 'poolDepth',
    nullable: true,
    length: 255,
  })
  poolDepth: string | null;

  @Column('varchar', { name: 'highRiskDogList', nullable: true, array: true })
  highRiskDogList: string[] | null;

  @Column('character varying', {
    name: 'poolHasSlide',
    nullable: true,
    length: 255,
  })
  poolHasSlide: string | null;

  @Column('character varying', {
    name: 'fourPointInspection',
    nullable: true,
    length: 255,
  })
  fourPointInspection: string | null;

  @Column('character varying', {
    name: 'declarationPage',
    nullable: true,
    length: 255,
  })
  declarationPage: string | null;

  @Column('character varying', {
    name: 'poolScreenEnclousure',
    nullable: true,
    length: 255,
  })
  poolScreenEnclousure: string | null;

  @Column('character varying', {
    name: 'costScreenEnclosure',
    nullable: true,
    length: 255,
  })
  costScreenEnclosure: string | null;

  @Column('character varying', {
    name: 'hasAdditionalHighendItems',
    nullable: true,
    length: 255,
  })
  hasAdditionalHighendItems: string | null;

  @Column('character varying', {
    name: 'hasWindMitigation',
    nullable: true,
    length: 255,
  })
  hasWindMitigation: string | null;

  @Column('character varying', {
    name: 'hasFireAlarm',
    nullable: true,
    length: 255,
  })
  hasFireAlarm: string | null;

  @Column('character varying', {
    name: 'policyTerm',
    nullable: true,
    length: 255,
  })
  policyTerm: string | null;

  @Column('character varying', {
    name: 'hasCoins',
    nullable: true,
    length: 255,
  })
  hasCoins: string | null;

  @Column('character varying', {
    name: 'hasSilverware',
    nullable: true,
    length: 255,
  })
  hasSilverware: string | null;

  @Column('character varying', {
    name: 'hasCameraEquipment',
    nullable: true,
    length: 255,
  })
  hasCameraEquipment: string | null;

  @Column('character varying', {
    name: 'hasGolfEquipment',
    nullable: true,
    length: 255,
  })
  hasGolfEquipment: string | null;

  @Column('character varying', {
    name: 'hasChina',
    nullable: true,
    length: 255,
  })
  hasChina: string | null;

  @Column('character varying', {
    name: 'hasCollectibles',
    nullable: true,
    length: 255,
  })
  hasCollectibles: string | null;

  @Column('character varying', {
    name: 'smokeDetectorInspected',
    nullable: true,
    length: 255,
  })
  smokeDetectorInspected: string | null;

  @Column('character varying', {
    name: 'smokeDetectorCompliant',
    nullable: true,
    length: 255,
  })
  smokeDetectorCompliant: string | null;

  @Column('character varying', {
    name: 'tenantResponsibleForSmokeDetectorMaintenance',
    nullable: true,
    length: 255,
  })
  tenantResponsibleForSmokeDetectorMaintenance: string | null;

  @Column('character varying', {
    name: 'hasWaterBackupCoverage',
    nullable: true,
    length: 255,
  })
  hasWaterBackupCoverage: string | null;

  @Column('character varying', {
    name: 'mainSquareFeet',
    nullable: true,
    length: 255,
  })
  mainSquareFeet: string | null;

  @Column('character varying', {
    name: 'priorPolicyPremium',
    nullable: true,
    length: 255,
  })
  priorPolicyPremium: string | null;

  @Column('character varying', {
    name: 'hasSmartHome',
    nullable: true,
    length: 255,
  })
  hasSmartHome: string | null;

  @Column('character varying', {
    name: 'hasAlarm',
    nullable: true,
    length: 255,
  })
  hasAlarm: string | null;

  @Column('character varying', {
    name: 'hasBatteryBackup',
    nullable: true,
    length: 255,
  })
  hasBatteryBackup: string | null;

  @Column('character varying', {
    name: 'hasPoolGateLatch',
    nullable: true,
    length: 255,
  })
  hasPoolGateLatch: string | null;

  @Column('character varying', {
    name: 'protectionClass',
    nullable: true,
    length: 255,
  })
  protectionClass: string | null;

  @Column('character varying', {
    name: 'roofUpdateType',
    nullable: true,
    length: 255,
  })
  roofUpdateType: string | null;

  @Column('character varying', {
    name: 'electricalUpdateType',
    nullable: true,
    length: 255,
  })
  electricalUpdateType: string | null;

  @Column('character varying', {
    name: 'plumbingUpdateType',
    nullable: true,
    length: 255,
  })
  plumbingUpdateType: string | null;

  @Column('character varying', {
    name: 'heatUpdateType',
    nullable: true,
    length: 255,
  })
  heatUpdateType: string | null;

  @Column('character varying', {
    name: 'basementFinishType',
    nullable: true,
    length: 255,
  })
  basementFinishType: string | null;

  @Column('character varying', {
    name: 'wantsLossAssessment',
    nullable: true,
    length: 255,
  })
  wantsLossAssessment: string | null;

  @Column('character varying', {
    name: 'wantsOrdinanceOrLawIncrease',
    nullable: true,
    length: 255,
  })
  wantsOrdinanceOrLawIncrease: string | null;

  @Column('character varying', {
    name: 'monthsAtAddress',
    nullable: true,
    length: 255,
  })
  monthsAtAddress: string | null;

  @Column('character varying', {
    name: 'addressCode',
    nullable: true,
    length: 255,
  })
  addressCode: string | null;

  @Column('character varying', {
    name: 'roofPitch',
    nullable: true,
    length: 255,
  })
  roofPitch: string | null;

  @Column('character varying', {
    name: 'numberOfThreeQuarterBaths',
    nullable: true,
    length: 255,
  })
  numberOfThreeQuarterBaths: string | null;

  @Column('character varying', {
    name: 'shapeOfDwelling',
    nullable: true,
    length: 255,
  })
  shapeOfDwelling: string | null;

  @Column('character varying', {
    name: 'windSpeed',
    nullable: true,
    length: 255,
  })
  windSpeed: string | null;

  @Column('character varying', {
    name: 'numberOfInterests',
    nullable: true,
    length: 255,
  })
  numberOfInterests: string | null;

  @Column('character varying', {
    name: 'hasCoSigner',
    nullable: true,
    length: 255,
  })
  hasCoSigner: string | null;

  @Column('character varying', {
    name: 'hasLineOfCredit',
    nullable: true,
    length: 255,
  })
  hasLineOfCredit: string | null;

  @Column('character varying', {
    name: 'hasThirdMortgagee',
    nullable: true,
    length: 255,
  })
  hasThirdMortgagee: string | null;

  @Column('character varying', {
    name: 'hasSecondaryHeatSource',
    nullable: true,
    length: 255,
  })
  hasSecondaryHeatSource: string | null;

  @Column('character varying', {
    name: 'coinsHasBreakage',
    nullable: true,
    length: 255,
  })
  coinsHasBreakage: string | null;

  @Column('character varying', {
    name: 'fursHasBreakage',
    nullable: true,
    length: 255,
  })
  fursHasBreakage: string | null;

  @Column('character varying', {
    name: 'fineArtsHasBreakage',
    nullable: true,
    length: 255,
  })
  fineArtsHasBreakage: string | null;

  @Column('character varying', {
    name: 'gunsHasBreakage',
    nullable: true,
    length: 255,
  })
  gunsHasBreakage: string | null;

  @Column('character varying', {
    name: 'jewleryHasBreakage',
    nullable: true,
    length: 255,
  })
  jewleryHasBreakage: string | null;

  @Column('character varying', {
    name: 'musicAmount',
    nullable: true,
    length: 255,
  })
  musicAmount: string | null;

  @Column('character varying', {
    name: 'musicHasBreakage',
    nullable: true,
    length: 255,
  })
  musicHasBreakage: string | null;

  @Column('character varying', {
    name: 'silverwareAmount',
    nullable: true,
    length: 255,
  })
  silverwareAmount: string | null;

  @Column('character varying', {
    name: 'silverwareHasBreakage',
    nullable: true,
    length: 255,
  })
  silverwareHasBreakage: string | null;

  @Column('character varying', {
    name: 'temparatureControlDeviceType',
    nullable: true,
    length: 255,
  })
  temparatureControlDeviceType: string | null;

  @Column('character varying', {
    name: 'policyType',
    nullable: true,
    length: 255,
  })
  policyType: string | null;

  @Column('character varying', {
    name: 'counterTopMaterial',
    nullable: true,
    length: 255,
  })
  counterTopMaterial: string | null;

  @Column('character varying', {
    name: 'additionalKitchen',
    nullable: true,
    length: 255,
  })
  additionalKitchen: string | null;

  @Column('character varying', {
    name: 'hasCustomCabinets',
    nullable: true,
    length: 255,
  })
  hasCustomCabinets: string | null;

  @Column('character varying', {
    name: 'numberOfSolarPanels',
    nullable: true,
    length: 255,
  })
  numberOfSolarPanels: string | null;

  @Column('varchar', { name: 'floorMaterialList', nullable: true, array: true })
  floorMaterialList: string[] | null;

  @Column('character varying', {
    name: 'seismicGasShutoff',
    nullable: true,
    length: 255,
  })
  seismicGasShutoff: string | null;

  @Column('character varying', {
    name: 'paintYear',
    nullable: true,
    length: 255,
  })
  paintYear: string | null;

  @Column('character varying', {
    name: 'waterType',
    nullable: true,
    length: 255,
  })
  waterType: string | null;

  @Column('character varying', {
    name: 'earthquakeCoverage',
    nullable: true,
    length: 255,
  })
  earthquakeCoverage: string | null;

  @Column('character varying', {
    name: 'excessLiabilityCoverage',
    nullable: true,
    length: 255,
  })
  excessLiabilityCoverage: string | null;

  @Column('character varying', {
    name: 'roofCoverageLimit',
    nullable: true,
    length: 255,
  })
  roofCoverageLimit: string | null;

  @Column('character varying', {
    name: 'homeInspection',
    nullable: true,
    length: 255,
  })
  homeInspection: string | null;

  @Column('character varying', {
    name: 'homeInspectionDate',
    nullable: true,
    length: 255,
  })
  homeInspectionDate: string | null;

  @Column('character varying', {
    name: 'billingPlan',
    nullable: true,
    length: 255,
  })
  billingPlan: string | null;

  @Column('character varying', {
    name: 'numberOfWindows',
    nullable: true,
    length: 255,
  })
  numberOfWindows: string | null;

  @Column('character varying', {
    name: 'numberOfDoors',
    nullable: true,
    length: 255,
  })
  numberOfDoors: string | null;

  @Column('text', { name: 'wallMaterialDescription', nullable: true })
  wallMaterialDescription: string | null;

  @Column('number', { name: 'clientHomeId', nullable: true })
  clientHomeId: number;

  @ManyToOne(() => Clients, (clients) => clients.homes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientHomeId', referencedColumnName: 'id' }])
  client: Clients;

  @ManyToOne(() => Companies, (companies) => companies.homes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyHomeId', referencedColumnName: 'id' }])
  company: Companies;

  @OneToMany(() => Rates, (rates) => rates.homeRate)
  rates: Rates[];
}
