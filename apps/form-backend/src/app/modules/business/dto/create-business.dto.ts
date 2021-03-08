import { IsNumber, IsString, IsDate, IsArray } from 'class-validator';

export class CreateBusinessDto {
  @IsNumber() readonly id?: number;
  @IsString() entityName: string;
  @IsString() entityType: string;
  @IsString() dba: string;
  @IsString() mcmxffNumbers: string;
  @IsString() streetNumber: string;
  @IsString() streetName: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() zipCode: string;
  @IsString() fullAddress: string;
  @IsString() usDotNumber: string;
  @IsString() numberOfTractors: string;
  @IsString() numberOfTrailers: string;
  @IsString() listOfTractors: string;
  @IsString() listOfTrailers: string;
  @IsString() numberOfDrivers: string;
  @IsString() listOfDrivers: string;
  @IsString() cargo: string;
  @IsString() cargoLimit: string;
  @IsString() autoLiabilityLimits: string;
  @IsString() hasLiabilityClaims: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsNumber() companyBusinessId: number;
  @IsNumber() clientBusinessId: number;
  @IsString() website: string;
  @IsString() leasedCompanyName: string;
  @IsString() yearsOfPrimaryLiabilityCoverage: string;
  @IsString() hasRelatedBroker: string;
  @IsString() relatedBrokerMcNumber: string;
  @IsDate() entityStartDate: Date;
  @IsString() annualMiles: string;
  @IsString() annualRevenue: string;
  @IsString() locationsEntered: string;
  @IsString() hasFilingsNeeded: string;
  @IsString() filingMcNumbers: string;
  @IsString() hasCancelled: string;
  @IsString() hasRiskCoveredByWorkersComp: string;
  @IsString() yearsOwnedCommercialEquipment: string;
  @IsString() pullLoad: string;
  @IsString() allowsNonEmployeePassengers: string;
  @IsString() umLimit: string;
  @IsString() pipLimit: string;
  @IsString() medPayments: string;
  @IsString() genLiabilityLimit: string;
  @IsString() hiredAutoLimit: string;
  @IsString() trailerInterchangeLimit: string;
  @IsString() businessType: string;
  @IsString() businessStartMonth: string;
  @IsString() businessStartYear: string;
  @IsString() yearsInBusiness: string;
  @IsString() numberOfEmployees: string;
  @IsString() industry: string;
  @IsString() hasHadCyberAttack: string;
  @IsString() hasSoftwareBusiness: string;
  @IsString() numberOfProtectedRecords: string;
  @IsString() hasCryptoCurrencyBusiness: string;
  @IsString() hasAntiVirus: string;
  @IsString() hasHippaCompliance: string;
  @IsString() cyberLimit: string;
  @IsString() ein: string;
  @IsString() description: string;
  @IsString() annualPayroll: string;
  @IsString() hasOtherBusinessPartners: string;
  @IsString() businessPartners: string;
  @IsString() hasOtherLocations: string;
  @IsString() otherLocations: string;
  @IsString() buildingSquareFt: string;
  @IsString() percentOfBusinessFromInternet: string;
  @IsString() hasSensitiveRecords: string;
  @IsString() sensitiveRecordsDescription: string;
  @IsString() certificateHolderName: string;
  @IsString() equipmentValue: string;
  @IsString() hasDamage: string;
  @IsString() collisionDamageValue: string;
  @IsString() nonCollisionDamageValue: string;
  @IsString() certificateHolderPreferredContact: string;
  @IsString() certificateHolderEmail: string;
  @IsString() certificateHolderWebsite: string;
  @IsString() certificateHolderFax: string;
  @IsString() certificateHolderAdditionalInsured: string;
  @IsString() certificateHolderCoiLanguage: string;
  @IsString() numberOfPartTimeEmployees: string;
  @IsString() percentOwnership: string;
  @IsString() annualGrossReceipts: string;
  @IsString() hasSubContractingExpenses: string;
  @IsString() isNewVenture: string;
  @IsString() ownOrLeaseOffice: string;
  @IsString() personalPropertyCoverage: string;
  @IsString() commonCertificateHolderName: string;
  @IsString() cargoLimitDeductible: string;
  @IsString() businessPlanDescription: string;
  @IsString() streetAddress: string;
  @IsString() statesEntered: string;
  @IsString() citiesEntered: string;
  @IsString() subcontractingExpenses: string;
  @IsString() constructionType: string;
  @IsString() yearBuilt: string;
  @IsString() renovationDetails: string;
  @IsString() hasCentralFireAlarm: string;
  @IsString() hasCentralSecurityAlarm: string;
  @IsString() buildingHasDangerousMaterial: string;
  @IsString() buildingLienHoldersDetails: string;
  @IsString() additionalInsuredDetails: string;
  @IsString() hasAutos: string;
  @IsString() autoDetails: string;
  @IsString() workerDetails: string;
  @IsString() equipmentDetails: string;
  @IsString() includeOwnerInCoverage: string;
  @IsString() reeferDeductible: string;
  @IsString() needsCargoCoverage: string;
  @IsString() hasHazardousCargo: string;
  @IsString() needsHiredAutoCoverage: string;
  @IsString() isOtherEntity: string;
  @IsString() hasOtherSubsidiaries: string;
  @IsString() hasSafetyProgram: string;
  @IsString() hasOtherInsuranceWithCompany: string;
  @IsString() hasHadMisconductClaims: string;
  @IsString() hasBeenConvicted: string;
  @IsString() hasSafetyViolations: string;
  @IsString() hadBankruptcy: string;
  @IsString() hadLien: string;
  @IsString() hasTrust: string;
  @IsString() hasForeignOperations: string;
  @IsString() hasOtherVentures: string;
  @IsString() uimLimit: string;
  @IsString() nonOwnedLimit: string;
  @IsString() glassCoverageLimit: string;
  @IsString() hadTailCoverage: string;
  @IsString() hasPriorCoverageExclusions: string;
  @IsArray() typesOfOperations: string[];
  @IsString() hasSubcontractorsCertOfInsurance: string;
  @IsString() hasMoreCoverageThanSubcontractors: string;
  @IsString() hasSafetyMarketing: string;
  @IsString() hadCrimeOnPremises: string;
  @IsString() hasDayCare: string;
  @IsString() hasPlansForDemolition: string;
  @IsString() hasPlansForStructurialChanges: string;
  @IsString() hasPools: string;
  @IsString() hasDocksOrFloats: string;
  @IsString() hasParkingFacilities: string;
  @IsString() hasFeeAtParkingFacilities: string;
  @IsString() hasRecreationalFacilities: string;
  @IsString() hasSportingOrSocialEvents: string;
  @IsString() requiresVendorsCoverage: string;
  @IsString() hadDiscontinuedOperations: string;
  @IsString() hasSalesWithApplicants: string;
  @IsString() hasLaborInterchange: string;
  @IsString() hasRepackagedProducts: string;
  @IsString() repackagesSoldProducts: string;
  @IsString() hasMedicalOperations: string;
  @IsString() hasExposureToRadioactives: string;
  @IsString() hasHazardousMaterial: string;
  @IsString() hasFormalWrittenSafetyPolicy: string;
  @IsString() hadProductsRecalled: string;
  @IsString() totalCoverage: string;
  @IsString() injuryCoverage: string;
  @IsString() eachOccurrenceCoverage: string;
  @IsString() rentedPremisesCoverage: string;
  @IsString() medicalExpenseCoverage: string;
  @IsString() employeeBenefitCoverage: string;
  @IsString() leasesAutos: string;
  @IsString() ownAutos: string;
  @IsString() certificateRequestDate: string;
  @IsString() certificateEffectiveDate: string;
  @IsString() regularRouteDetails: string;
  @IsArray() majorCitiesList: string[];
  @IsArray() hasEld: string[];
  @IsArray() eldProvider: string[];
  @IsString() minDrivingYearsRequired: string;
  @IsString() priorLiabilityLimits: string;
  @IsString() unitNumber: string;
  @IsString() phone: string;
  @IsString() yearsInIndustry: string;
  @IsString() percentOfWorkSubcontracted: string;
  @IsString() hasContractsWithSubcontractors: string;
  @IsString() isOnSubcontractorGlPolicies: string;
  @IsString() subcontractorsHaveWorkersComp: string;
  @IsString() systemsForProtectingPublicFromInjury: string;
  @IsString() materialLiftingEquipment: string;
  @IsString() maxBuildingHeight: string;
  @IsString() roofOpeningProtection: string;
  @IsString() nrcaMember: string;
  @IsArray() typesOfBuildings: string[];
  @IsString() percentOfProjectsResidential: string;
  @IsString() percentOfResidentialProjectsIsNew: string;
  @IsString() percentOfResidentialProjectsIsRepair: string;
  @IsString() percentOfResidentialProjectsIsPitchedRoof: string;
  @IsString() percentOfResidentialProjectsIsFlatRoof: string;
  @IsString() percentOfResidentialProjectsIsMetal: string;
  @IsString() percentOfResidentialProjectsIsClayConcreteTile: string;
  @IsString() percentOfResidentialProjectsIsColdAppliedMembranes: string;
  @IsString() percentOfResidentialProjectsIsHeatApplied: string;
  @IsString() percentOfProjectsCommercial: string;
  @IsString() percentOfCommercialProjectsIsNew: string;
  @IsString() percentOfCommercialProjectsIsRepair: string;
  @IsString() percentOfCommercialProjectsIsPitchedRoof: string;
  @IsString() percentOfCommercialProjectsIsFlatRoof: string;
  @IsString() percentOfCommercialProjectsIsMetal: string;
  @IsString() percentOfCommercialProjectsIsClayConcreteTile: string;
  @IsString() percentOfCommercialProjectsIsColdAppliedMembranes: string;
  @IsString() percentOfCommercialProjectsIsHeatApplied: string;
  @IsString() percentOfProjectsIndustrial: string;
  @IsString() percentOfIndustrialProjectsIsNew: string;
  @IsString() percentOfIndustrialProjectsIsRepair: string;
  @IsString() percentOfIndustrialProjectsIsPitchedRoof: string;
  @IsString() percentOfIndustrialProjectsIsFlatRoof: string;
  @IsString() percentOfIndustrialProjectsIsMetal: string;
  @IsString() percentOfIndustrialProjectsIsClayConcreteTile: string;
  @IsString() percentOfIndustrialProjectsIsColdAppliedMembranes: string;
  @IsString() percentOfIndustrialProjectsIsHeatApplied: string;
  @IsString() comments: string;
  @IsString() blanketInsurance: string;
  @IsString() hasLicense: string;
  @IsString() licenseYear: string;
  @IsString() licenseType: string;
  @IsString() licenseNumber: string;
  @IsString() generalContractorPercent: string;
  @IsString() subcontractorPercent: string;
  @IsString() constructionManagerPercent: string;
  @IsString() developerPercent: string;
  @IsString() withPenaltyClausePercent: string;
  @IsString() otherVentureDetails: string;
  @IsString() otherVenturesCovered: string;
  @IsString() hasRecruitingAgency: string;
  @IsString() recruitingAgencyDetails: string;
  @IsString() radiusOfOperations: string;
  @IsString() payrollOfOwners: string;
  @IsString() payrollOfEmployees: string;
  @IsString() hasLicensedLabor: string;
  @IsString() hasOperationsUnderOcp: string;
  @IsString() ocpOperationDetails: string;
  @IsString() commercialIndustrialPercent: string;
  @IsString() residentialApartmentsPercent: string;
  @IsString() commercialInstitutionalPercent: string;
  @IsString() residentialCondosPercent: string;
  @IsString() commercialMercantilePercent: string;
  @IsString() residentialCustomPercent: string;
  @IsString() commercialOfficePercent: string;
  @IsString() residentialTractPercent: string;
  @IsString() commercialStructuralPercent: string;
  @IsString() residentialStructuralPercent: string;
  @IsString() commercialNonstructuralPercent: string;
  @IsString() residentialNonstructuralPercent: string;
  @IsString() commercialOtherPercent: string;
  @IsString() residentialOtherPercent: string;
  @IsString() hasHoldHarmlessClause: string;
  @IsString() usesSameContractors: string;
  @IsString() hasCasualLabor: string;
  @IsString() hasWorkersComp: string;
  @IsString() projectsPlanned: string;
  @IsString() pastProjects: string;
  @IsString() averageJobCost: string;
  @IsString() equipmentRented: string;
  @IsString() leasesMobileEquipment: string;
  @IsString() mobileEquipmentWithOperators: string;
  @IsString() mobileEquipmentType: string;
  @IsString() usesCranes: string;
  @IsString() boomLength: string;
  @IsString() performedRepairs: string;
  @IsString() workWithPublicFacilities: string[];
  @IsString() hasTallProjects: string;
  @IsString() percentageOfTallWork: string;
  @IsString() tallestProjectHeight: string;
  @IsString() hasUndergroundProjects: string;
  @IsString() percentageOfUndergroundWork: string;
  @IsString() deepestProjectDepth: string;
  @IsString() hasSlopedWork: string;
  @IsString() steepestProjectDegree: string;
  @IsString() hasPlannedRoofRepair: string;
  @IsString() terminated: string;
  @IsString() replacedContractor: string;
  @IsString() replacedContractorDetails: string;
  @IsString() hasClaimsAgainstEntities: string;
  @IsString() hasPossibleClaim: string;
  @IsString() hasFaultyAccusation: string;
  @IsString() cancelDate: string;
  @IsString() binderNumber: string;
  @IsString() additionalInterestType: string;
  @IsString() otherInterestDescription: string;
  @IsString() retroDate: string;
  @IsString() aggregateCoverage: string;
  @IsString() productsCompletedAggregateCoverage: string;
  @IsString() generalLiabilityCoveragesDescription: string;
  @IsString() hasSubcontractors: string;
  @IsString() otherCoverageDescription: string;
  @IsString() waiverSubrogation: string;
  @IsString() otherCoverageLimit: string;
  @IsString() umbrellaDedType: string;
  @IsString() umbrellaDedAmount: string;
  @IsArray() typesOfAutoCoverages: string[];
  @IsString() autoCoveragesDescription: string;
  @IsString() combinedSingleLimitCoverage: string;
  @IsString() bodilyInjuryPersonCoverage: string;
  @IsString() bodilyInjuryAccidentCoverage: string;
  @IsString() propertyDamageCoverage: string;
  @IsString() uninsuredMotoristCoverage: string;
  @IsString() otherCoverage: string;
  @IsString() silverwareValue: string;
  @IsString() dateCoverageLapsed: string;
  @IsString() waterDamage: string;
  @IsString() vehicleCoverageType: string;
  @IsString() lossOfHeat: string;
  @IsString() deductible: string;
  @IsString() garageLiabilityCoverageType: string;
  @IsString() garageLiabilityCoveragesDescription: string;
  @IsString() autoOnlyAccidentCoverage: string;
  @IsString() otherThanAutoOnlyAccidentCoverage: string;
  @IsString() otherThanAutoOnlyAggregateCoverage: string;
  @IsString() excessLiabilityCoveragesDescription: string;
  @IsString() hasStatutoryLimits: string;
  @IsString() employerLiabilityAccidentCoverage: string;
  @IsString() employerLiabilityEmployeeCoverage: string;
  @IsString() employerLiabilityPolicyLimit: string;
  @IsString() workersCompensationCoveragesDescription: string;
  @IsString() specialConditionsCoveragesDescription: string;
  @IsString() specialConditionCoverageFees: string;
  @IsString() specialConditionsCoverageTaxes: string;
  @IsString() specialConditionsEstimatedPremium: string;
  @IsString() loanNumber: string;
  @IsString() authorizedRep: string;
  @IsString() previousYearsGross: string;
  @IsString() certificateHolderFullAddress: string;
  @IsString() billingPlan: string;
  @IsString() paymentPlan: string;
  @IsString() auditType: string;
  @IsString() largestProjects: string;
  @IsString() workType: string;
  @IsString() percentWorkAirConditioning: string;
  @IsString() percentWorkAppliance: string;
  @IsString() percentWorkCabinetry: string;
  @IsString() percentWorkCarpentry: string;
  @IsString() percentWorkCleaningCarpets: string;
  @IsString() percentWorkCleaningOffice: string;
  @IsString() percentWorkDoors: string;
  @IsString() percentWorkDriveway: string;
  @IsString() percentWorkDrywall: string;
  @IsString() percentWorkElectrical: string;
  @IsString() percentWorkExteriorPainting: string;
  @IsString() percentWorkInteriorPainting: string;
  @IsString() percentWorkFences: string;
  @IsString() percentWorkFlooring: string;
  @IsString() percentWorkLandscaping: string;
  @IsString() percentWorkPlaster: string;
  @IsString() percentWorkPlumbing: string;
  @IsString() percentWorkTile: string;
  @IsString() percentWorkMarble: string;
  @IsString() percentWorkWoodwork: string;
  @IsString() percentWorkMason: string;
  @IsString() wallMaterialDescription: string;
  @IsString() hasWarehouse: string;
  @IsString() hasStoreFront: string;
  @IsString() purchasePrice: string;
  @IsString() buildingOwned: string;
  @IsString() annualSubcontractorCost: string;
  @IsString() mailingAddress: string;
  @IsString() residentialWork: string;
  @IsString() outOfState: string;
  @IsString() outOfStatePercent: string;
  @IsString() workOverThreeStories: string;
  @IsString() excavationWork: string;
  @IsString() machineryWork: string;
  @IsString() depthOfExcavation: string;
  @IsString() demolitionWork: string;
  @IsString() roofRepairWork: string;
  @IsString() asbestosRemovalWork: string;
  @IsString() floorWork: string;
  @IsString() snowRemovalWork: string;
  @IsString() percentWorkSnowRemoval: string;
  @IsString() percentWorkSnowRemovalOther: string;
  @IsString() numberOfActiveOwners: string;
  @IsString() equipmentInsuranceType: string;
  @IsString() toolStorage: string;
  @IsString() rentalEquipmentCoverage: string;
  @IsString() rentalToolLimit: string;
  @IsString() toolRentalExpense: string;
  @IsString() hasToolsOnsite: string;
  @IsString() jobsiteSecuritySystems: string;
  @IsString() insuredUnderDifferentName: string;
  @IsString() alternateBusinessName: string;
  @IsString() alternateBusinessActive: string;
  @IsString() eCommerceSite: string;
  @IsString() productsSold: string;
  @IsString() wholesaleProducts: string;
  @IsString() hasWeaponProducts: string;
  @IsString() weaponProductsComment: string;
  @IsString() hasTobaccoProducts: string;
  @IsString() tobaccoProductsComment: string;
  @IsString() hasPharmaceuticals: string;
  @IsString() pharmaceuticalsComment: string;
  @IsString() confidentialInformation: string;
  @IsString() privateLabelProducts: string;
  @IsString() productDescription: string;
  @IsString() foreignLocation: string;
}
