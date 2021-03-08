import { IsString, IsInt, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class LocationDto  {
  @IsOptional() @IsNumber() @IsNotEmpty() readonly id: number;
  @IsNotEmpty() createdAt: Date = new Date();
  @IsNotEmpty() updatedAt: Date = new Date();
  @IsOptional() @IsString() streetNumber: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly streetName: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly unit: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly streetAddress: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly city: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly county: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly state: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly zipCode: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly fullAddress: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly locationNumber: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly buildingNumber: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly isWithinCityLimits: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly occupancyType: string;
  @IsInt() readonly companyLocationId: number;
  @IsOptional() @IsString() @IsNotEmpty() readonly classCode: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly classification: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly premiumCode: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly exposure: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly territoryCode: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly premisesOperationsRate: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly productsRate: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly premisesOperationPremium: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly productsPremium: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly constructionType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly distanceToFireHydrant: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly distanceToFireStation: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly fireDistrict: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly numberOfStories: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly numberOfBasements: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly yearBuilt: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly totalSquareFootage: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly hasUpdatedWiring: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly updatedWiringYear: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly hasUpdatedRoofing: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly updatedRoofingYear: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly hasUpdatedPlumbing: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly updatedPlumbingYear: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly hadUpdatedHeating: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly updatedHeatingYear: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly roofType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly hasWoodBurningStoves: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly heatType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly coolType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly burglarAlarmType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly fireProtectionType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly percentOfSprinklerFireProtection: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly loanNumber: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly stakeholderType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly stakeholderName: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly stakeholderAddress: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly secondaryHeatType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly needsFloodInsurance: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly causeOfLoss: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly deductible: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly percentCoInsured: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly coverageAmount: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly coveragesDescription: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly buildingDeductible: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly contentsDeductible: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly buildingLimit: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly personalPropLimit: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly businessIncome: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly extraExpense: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly rentalValue: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly blanketBuilding: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly blanketPersonalProp: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly blanketBuildingAndPp: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly otherCoverageDescription: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly otherCoverageLimit: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly inlandmarineLimitDescription: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly inlandmarineLimitAmount: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly crimeLimitDescription: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly crimeLimitAmount: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly boilerLimitDescription: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly boilerLimitAmount: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentMonthsStorage: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly maxValueInBuilding: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly maxValueOutside: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentDescription: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly maxItemValue: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly coinsurancePercent: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentNumber: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentGroup: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentSerial: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentNewUsed: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentDatePurchased: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly equipmentCapacity: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly generalInfo1: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly generalInfo2: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly generalInfo3: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly generalInfo4: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly explaination1: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly itemNumber: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly itemOtherDescription: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly optionalCauseOfLoss: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly earthquakeLimit: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly earthquakeDed: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly floodLimit: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly floodDed: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly describeOperations: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly materialsValue: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly jobSiteSecurity: string;
  @IsOptional() decodedUser: object;
}
