import * as stringSimilarity from 'string-similarity';
import * as moment from 'moment';

export async function calculateDwelling(home) {
  if (home.totalSquareFootage && home.levelOfFinishes) {
    const fin = home.levelOfFinishes;
    const cpsf =
      fin === 'Builders Grade'
        ? 140
        : fin === 'Semi-Custom'
        ? 160
        : fin === 'Designer'
        ? 180
        : 125;
    const dwelling = +home.totalSquareFootage * cpsf;
    return dwelling;
  } else if (home.totalSquareFootage) {
    const dwelling = +home.totalSquareFootage * 125;
    return dwelling;
  } else {
    return 350000;
  }
}

export async function returnExists(value) {
  if (
    (value &&
      value !== 'undefined' &&
      typeof value !== 'undefined' &&
      value !== null) ||
    value === false
  ) {
    return true;
  }
  return false;
}

export async function returnValueIfExists(value, defaultValue) {
  if (
    (value &&
      value !== 'undefined' &&
      typeof value !== 'undefined' &&
      value !== null) ||
    value === false
  ) {
    return value;
  }
  return defaultValue;
}

export async function returnQuteRushVehicles(client) {
  const vehicleObj = client.vehicles.map((item) => {
    return {
      Year: item['vehicleModelYear'] || 0,
      Make: '',
      Model: item['vehicleModel'],
      ModelDetails: '',
      VIN: item['vehicleVin'],
      AntiTheft: '',
      PassiveRestraints: '',
      AntiLockBrakes: false,
      OwnershipStatus: '',
      AnnualMileage: '',
      LengthOfOwnership: item['lengthOfOwnership'],
      PrimaryDriver: '',
      UseType: item['vehicleUseCd'],
      MilesOneWay: item['vehicleCommuteMilesDrivenOneWay'],
      DaysPerWeek: item['vehicleDaysDrivenPerWeek'],
      WeeksPerMonth: '',
      DaytimeRunningLights: '',
      Comprehensive: item['comprehensive'],
      Collision: item['Collision'],
      UMPDLimit: null,
      UMPDDed: '',
      Towing: '',
      EAP: false,
      Rental: '',
      CostNewValue: item['costNew'],
      OdometerReading: '',
      Deleted: false,
      BodyStyle: item['vehicleBodyStyle'],
      Drive: '',
      EngineInfo: '',
      Fuel: '',
      Transmission: '',
      DayLights: '',
      ABS: '',
      Notes: '',
      GarageLocation: '',
      GarageIndex: '',
    };
  });
  return vehicleObj;
}

export async function returnNewDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

export async function returnNewDate2(date, daysAfter) {
  const newDate = new Date(date);
  const dd = newDate.getDate() + daysAfter;
  const mm = newDate.getMonth() + 1;
  const y = newDate.getFullYear();

  return y + '-' + mm + '-' + dd;
}

export async function returnQuteRushDrivers(client) {
  try {
    const driverObj = client.drivers.map((item) => {
      return {
        NamePrefix: '',
        NameFirst: item['applicantGivenName'],
        NameMiddle: item['applicantMiddleInitial'],
        NameLast: item['applicantSurname'],
        NameSuffix: item['applicantNameSuffix'],
        Gender: item['applicantGenderCd'],
        MaritalStatus: item['applicantMaritalStatusCd'],
        EducationLevel: item['educationLevel'],
        DateOfBirth: returnExists(item['applicantBirthDt'])
          ? returnNewDate2(new Date(item['applicantBirthDt']), 0)
          : null,
        Occupation: item['applicantOccupationClassCd'],
        OccupationTitle: '',
        OccupationYears: '',
        SSN: item['ssnU'],
        Relationship: item['relationship'],
        RatedDriver: '',
        LicenseStatus: '',
        DateFirstLicensed: item['driverLicensedDt'],
        AgeFirstLicensed: '',
        LicenseNumber: item['driverLicenseNumber'],
        LicenseState: item['driverLicenseStateCd'],
        SuspendRevoked5: '',
        DefensiveDriverCourseDate: '',
        SR22FR44: '',
        Points: item['driverScore'],
        GoodStudent: false,
        Training: false,
        StudentOver100MilesAway: false,
        Deleted: false,
        Notes: '',
        DriverViolationsList: null,
        MatureDriver: false,
        GoodDriver: false,
      };
    });

    return driverObj;
  } catch (error) {
    return error;
  }
}

export async function returnBestValueRating(array, value) {
  try {
    const bestMatch = stringSimilarity.findBestMatch(value, array);
    let bestMatchRating = null;
    if (bestMatch) {
      bestMatchRating = bestMatch.bestMatch.rating;
    } else {
      return null;
    }
    if (bestMatchRating > 0.3) {
      const bestValue = array[bestMatch.bestMatchIndex];
      return bestValue;
    }
    return null;
  } catch (error) {
    return error.message;
  }
}

export async function returnQuoteRushAttrValue(type) {
  switch (true) {
    case type === 'policyType':
      return [
        'HO-3: Home Owners Policy',
        'HO-4: Renters Policy. (Renting property and just insuring contents.)',
        'HO-6: Condo Owners Policy',
        'HO-8: Actual Cash Value',
        'DP-1: Dwelling Fire (Basic)',
        'DP-3 Dwelling Fire/Renters',
        'MHO: Mobile Home Owners Policy',
        'MDP: Mobile Home Dwelling Fire/Renters',
      ];
    case type === 'creditScore':
      return ['Poor', 'Below Average', 'Average', 'Very Good', 'Excellent'];
    case type === 'roofShape':
      return ['Hip', 'Gable', 'Flat', 'N/A'];
    case type === 'roofType':
      return [
        'Tar Shingle',
        'Superior Construction w/Poured Concrete',
        'Wood Shingle',
        'Composite Shingle',
        'Architectural Shingles',
        'Barrel Tile',
        'Flat Tile',
        'Tile',
        'Tile-Concrete',
        'Metal',
        'Tar and Gravel',
        'Poured Concrete',
        'Rubber',
        'Rolled Roofing',
        'Other',
      ];
    case type === 'structureType':
      return [
        'Single Family',
        'Townhouse (End Unit)',
        'Townhouse (Center Unit)',
        'Rowhouse(End Unit)',
        'Rowhouse(Center Unit)',
        'Duplex',
        'Triplex',
        'Quadplex',
        'Condo',
        'Apartment',
      ];
    case type === 'county':
      return [
        'Alachua',
        'Baker',
        'Bay',
        'Bradford',
        'Brevard',
        'Broward',
        'Calhoun',
        'Charlotte',
        'Citrus',
        'Clay',
        'Collier',
        'Columbia',
        'DeSoto',
        'Dixie',
        'Duval',
        'Escambia',
        'Flagler',
        'Franklin',
        'Gadsden',
        'Gilchrist',
        'Glades',
        'Gulf',
        'Hamilton',
        'Hardee',
        'Hendry',
        'Hernando',
        'Highlands',
        'Hillsborough',
        'Holmes',
        'Indian River',
        'Jackson',
        'Jefferson',
        'Lafayette',
        'Lake',
        'Lee',
        'Leon',
        'Levy',
        'Liberty',
        'Madison',
        'Manatee',
        'Marion',
        'Martin',
        'Miami-dade',
        'Monroe',
        'Nassau',
        'Okaloosa',
        'Okeechobee',
        'Orange',
        'Osceola',
        'Palm Beach',
        'Pasco',
        'Pinellas',
        'Polk',
        'Putnam',
        'St. Johns',
        'St. Lucie',
        'Santa Rosa',
        'Sarasota',
        'Seminole',
        'Sumter',
        'Suwannee',
        'Taylor',
        'Union',
        'Volusia',
        'Wakulla',
        'Walton',
        'Washington',
      ];
    case type === 'masonry':
      return [
        'Concrete Block',
        'Concrete Block - Stucco',
        'Solid Brick',
        'Solid Stone',
        'Superior',
      ];
    case type === 'frames':
      return [
        'Frame',
        'Frame - Stucco',
        'Aluminum Siding',
        'Vinyl Siding',
        'Wood Siding',
        'Hardiplank Siding',
        'Masonry Veneer',
        'Brick Veneer',
        'Stone Veneer',
        'Logs',
        'Asbestos',
      ];
    case type === 'wallTypes':
      return [
        'Concrete Block',
        'Concrete Block - Stucco',
        'Solid Brick',
        'Solid Stone',
        'Superior',
        'Frame',
        'Frame - Stucco',
        'Aluminum Siding',
        'Vinyl Siding',
        'Wood Siding',
        'Hardiplank Siding',
        'Masonry Veneer',
        'Brick Veneer',
        'Stone Veneer',
        'Logs',
        'Asbestos',
      ];
    case type === 'foundations':
      return [
        'Slab',
        'Open Foundation',
        'Crawl Space (100%)',
        'Piers (elevated)',
        'Basement',
      ];
    case type === 'poolType':
      return [
        'None',
        'Inground - 300 - 600 sq. ft.',
        'Above Ground - Detached',
      ];
    case type === 'personalLiability':
      return [
        '$0',
        '$100,000',
        '$200,000',
        '$300,000',
        '$400,000',
        '$500,000',
        '$1,000,000',
      ];
    case type === 'medicalCoverage':
      return ['$0', '$1,000', '$2,000', '$3,000', '$4,000', '$5,000'];
    case type === 'hurricaneDeductible':
      return ['Excluded ', '$500', '$1,000', '1%', '2%', '3%', '5%', '10%'];
    case type === 'allPerilsDeductible':
      return ['Excluded ', '$500', '$1,000', '$2,500', '$5,000'];
  }
}

export async function returnBestValueIfExists(value, key, defaultValue) {
  try {
    if (returnExists(value)) {
      const bestValue = await returnBestValueRating(
        returnQuoteRushAttrValue(key),
        value
      );
      if (bestValue) {
        return bestValue;
      }
      return defaultValue;
    } else {
      return defaultValue;
    }
  } catch (error) {
    return defaultValue;
  }
}

export async function returnClientJSON(client) {
  const home =
    Object.prototype.hasOwnProperty.call(client, 'homes') && client.homes.length > 0
      ? client.homes[0]
      : null;
  const coAppDriver =
    Object.prototype.hasOwnProperty.call(client, 'drivers') && client.drivers.length > 1
      ? client.drivers[1]
      : null;

  function returnAddressParam(cKey, hKey) {
    return client[cKey] ? client[cKey] : home && home[hKey] ? home[hKey] : '';
  }

  function returnCoAppParam(cKey, dKey, isDate) {
    let value = client[cKey]
      ? client[cKey]
      : coAppDriver && coAppDriver[dKey]
      ? coAppDriver[dKey]
      : '';
    if (isDate) {
      value = returnNewDate(value);
    }
    return value;
  }

  return {
    NameFirst: client.firstName,
    NamePrefix: '',
    NameMiddle: '',
    NameLast: client.lastName,
    NameSuffix: '',
    EntityType: 'Individual', // required
    EntityName: client.business ? client.business.entityName : '',
    DateOfBirth: returnExists(client.birthDate)
      ? returnNewDate2(new Date(client.birthDate), 0)
      : null,
    Gender: client.gender,
    MaritalStatus: client.maritalStatus,
    EducationLevel: client.educationLevel,
    Industry: client.occupation,
    Occupation: client.occupation,
    CreditPermission: '',
    AssumedCreditScore: await returnBestValueIfExists(
      client.creditScore,
      'creditScore',
      'Average'
    ),
    PhoneNumber: client.phone,
    PhoneNumberAlt: client.referrersPhone,
    PhoneCell: '',
    EmailAddress: client.email,
    Address: returnAddressParam('streetAddress', 'streetAddress'),
    Address2: returnAddressParam('unitNumber', 'unitNumber'),
    City: returnAddressParam('city', 'city'),
    State: returnAddressParam('stateCd', 'state'),
    Zip: returnAddressParam('postalCd', 'zipCode'),
    County: returnAddressParam('county', 'county'),
    Province: '',
    International: false,
    Country: 'USA',
    CoApplicantNamePrefix: '',
    CoApplicantNameFirst: returnCoAppParam(
      'spouseFirstName',
      'applicantGivenName',
      false
    ),
    CoApplicantNameMiddle: '',
    CoApplicantNameLast: returnCoAppParam(
      'spouseLastName',
      'applicantSurname',
      false
    ),
    CoApplicantNameSuffix: '',
    CoApplicantDateOfBirth: returnCoAppParam(
      'spouseBirthdate',
      'applicantBirthDt',
      true
    ),
    CoApplicantGender: returnCoAppParam(
      'spouseGender',
      'applicantGenderCd',
      false
    ),
    CoApplicantMaritalStatus: returnCoAppParam(
      'spouseMaritalStatus',
      'applicantMaritalStatusCd',
      false
    ),
    CoApplicantEducation: returnCoAppParam(
      'spouseEducationLevel',
      'educationLevel',
      false
    ),
    CoApplicantIndustry: returnCoAppParam(
      'spouseOccupation',
      'applicantOccupationClassCd',
      false
    ),
    CoApplicantOccupation: returnCoAppParam(
      'spouseOccupation',
      'applicantOccupationClassCd',
      false
    )
      ? 'Other'
      : '',
    CoApplicantRelationship: returnCoAppParam(
      'spouseFirstName',
      'applicantGivenName',
      false
    )
      ? 'Spouse'
      : '',
    Notes: '',
    OverviewNotes: '',
    DateEntered: '',
    DateModified: '',
    Assigned: '',
    LeadSource: '',
    LeadStatus: '',
  };
}

export async function returnCounty(county) {
  if (returnExists(county) && county.toLowerCase().includes('county')) {
    return county.replace(' County', '');
  } else {
    return county;
  }
}

export async function returnDistanceToHydrant(distance) {
  if (distance && distance.includes('-')) {
    const values = distance.split('-');
    if (
      (values && values[0] && values[1] && +values[0] >= 1000) ||
      +values[1] >= 1000
    ) {
      return 'More than 1000 Feet';
    } else {
      return 'Within 1000 Feet';
    }
  } else {
    const nums = distance && distance.replace(/[^0-9]/g, '');
    if (nums && +nums >= 1000) {
      return 'More than 1000 Feet';
    }
    return 'Within 1000 Feet';
  }
}

export async function returnDistanceToFireStations(distance) {
  const dist = distance && distance.replace(/[^0-9]/g, '');
  if (+dist > 5) {
    return 'More than 5 Miles';
  }
  return 'Within 5 Miles';
}

export async function returnFamilies(family) {
  if (returnExists(family) && family.toLowerCase().includes('family')) {
    const lowFamily = family.toLowerCase();
    switch (true) {
      case lowFamily.includes('one'):
        return 1;
      case lowFamily.includes('two'):
        return 2;
      case lowFamily.includes('three'):
        return 3;
      case lowFamily.includes('four'):
        return 4;
    }
    return '';
  } else {
    return family;
  }
}

export async function returnWallType(value) {
  const construction = await returnBestValueIfExists(
    value,
    'wallTypes',
    'Frame'
  );
  const masonryArray = await returnQuoteRushAttrValue('masonry');
  const frameArray = await returnQuoteRushAttrValue('frames');
  if (masonryArray.includes(construction)) {
    return 'Masonry';
  } else if (frameArray.includes(construction)) {
    return 'Frame';
  }
  return 'Masonry';
}

export async function returnData(client) {
  const data: any = {};
  try {
    data.client = await returnClientJSON(client);
    if (Object.prototype.hasOwnProperty.call(client, 'homes') && client.homes.length > 0) {
      const home = client.homes[0];
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      data.ho = {
        FormType: home.policyType
          ? home.policyType
          : client.policyType
          ? returnBestValueIfExists(
              client.policyType,
              'policyType',
              'HO-3: Home Owners Policy'
            )
          : home.unitNumber
          ? 'HO-6: Condo Owners Policy'
          : 'HO-3: Home Owners Policy', // required
        Address: returnValueIfExists(
          home.streetAddress,
          `${home.streetNumber} ${home.streetName}`
        ),
        Address2: home.unitNumber ? home.unitNumber : '',
        City: home.city,
        State: home.state,
        Zip: home.zipCode,
        County: home.county
          ? await returnBestValueIfExists(
              returnCounty(home.county),
              'county',
              ''
            )
          : '',
        WithinCityLimits: home.isInCity == 'Yes' ? true : false,
        NewPurchase: home.purchasedNew ? 'Yes' : 'No',
        PurchaseDate: home.purchaseDate,
        PurchasePrice: home.purchasePrice,
        UsageType: home.primaryUse, // required
        MonthsOwnerOccupied: '', // required
        MilesToCoast: '',
        BCEG: '',
        Territory: '',
        ProtectionClass: '',
        FloodZone: '',
        FloodPolicy: false,
        WindOnlyEligible: 'No',
        Notes: client.notes,
        YearBuilt: home.yearBuilt,
        StructureType: await returnBestValueIfExists(
          home.structureType,
          'structureType',
          'Single Family'
        ),
        Families: home.residenceType
          ? returnFamilies(home.residenceType)
          : '',
        Stories: home.numOfStories || 0,
        Floor: '',
        SquareFeet: home.totalSquareFootage,
        UnitsInFirewall: '', // required
        UnitsInBuilding: '',
        ConstructionType: home.exteriorMaterials
          ? await returnWallType(home.exteriorMaterials)
          : 'Masonry', // required
        Construction: await returnBestValueIfExists(
          home.exteriorMaterials,
          'wallTypes',
          'Concrete Block'
        ),
        FrameConstruction: '', // required
        MasonryConstruction: '', // required
        FoundationType: await returnBestValueIfExists(
          home.homeFoundationType,
          'foundations',
          'Slab'
        ),
        BasementPercentFinished: '',
        RoofShape: await returnBestValueIfExists(
          home.roofShape,
          'roofShape',
          'Gable'
        ), // required
        RoofPortionFlat: false,
        RoofHipPercent: '',
        RoofMaterial: await returnBestValueIfExists(
          home.roofType,
          'roofType',
          'Composite Shingle'
        ),
        Pool: await returnBestValueIfExists(
          home.poolType,
          'poolType',
          'None'
        ),
        PoolScreenedEnclosure: false,
        PoolFence: home.poolHasFence == 'Yes' ? true : false,
        PoolDivingboardSlide: false,
        ScreenedEnclosureSquareFeet: '',
        ScreenedCoverage: '',
        Jacuzzi: false,
        HotTub: false,
        UnderRenovation: home.hasConstructionRenovation ? true : false,
        UnderConstruction: home.homeUnderConstruction == 'Yes' ? true : false,
        UpdateRoofYear: home.roofUpdateYear,
        UpdateRoofType: '',
        UpdatePlumbingYear: home.plumbingUpdateYear,
        PlumbingType: '',
        UpdateElectricalYear: home.electricalUpdateYear,
        ElectricalType: '',
        UpdateHeatingYear: home.heatingUpdateYear,
        PrimaryHeatSource: home.heatType,
        WaterHeaterYear: '',
        RoofAge: currentYear - home.roofUpdateYear,
        CoverageA: calculateDwelling(home),
        CoverageB: '',
        CoverageBPercent: '',
        CoverageC: '',
        CoverageCPercent: '',
        CoverageD: '',
        CoverageDPercent: '',
        CoverageE: await returnBestValueIfExists(
          home.personalLiabilityCoverage,
          'personalLiability',
          '$300,000'
        ), // required
        CoverageF: await returnBestValueIfExists(
          home.medicalPaymentsCoverage,
          'medicalCoverage',
          '$5,000'
        ), // required
        AllOtherPerilsDeductible: await returnBestValueIfExists(
          home.allPerilsDeductible,
          'allPerilsDeductible',
          '$1,000'
        ), // required
        HurricaneDeductible: await returnBestValueIfExists(
          home.hurricaneDeductible,
          'hurricaneDeductible',
          '2%'
        ), // required
        NamedStormDeductible: '',
        WindHailDeductible: '',
        CurrentlyInsured: returnValueIfExists(
          client.hasPriorInsurance,
          'Yes'
        ), // required
        AnyLapses: returnValueIfExists(client.hadLapseInInsurance, 'No'), // required
        CurrentCarrier: home.currentCarrier,
        CurrentAnnualPremium: home.premium,
        CurrentPolicyNumber: home.policyNumber,
        PolicyEffectiveDate: home.effectiveDate
          ? returnNewDate(new Date(home.effectiveDate))
          : client.effectiveDate
          ? returnNewDate(new Date(client.effectiveDate))
          : returnNewDate(new Date()), // required
        PropertyCurrentPolicyExpDate: '',
        Mortgage: '',
        BillTo: '',
        Claims: returnValueIfExists(client.hasHomeLoss, 'No'), // required
        ClaimsInfo: '',
        PriorLiabilityLimits: '',
        LuxuryItems: '',
        HaveWindMitForm: home.hasWindMitigationForm ? true : false,
        WindMitFormType: '',
        RoofCovering: '',
        RoofDeckAttachment: '',
        RoofWallConnection: '',
        SecondaryWaterResistance: '',
        OpeningProtection: '',
        OpeningProtectionA3: false,
        Terrain: '',
        WindSpeedDesign: '',
        BuildingCode: '',
        WindMitInspectionCompany: '',
        WindMitInspectorName: '',
        WindMitInspectorLicenseNumber: '',
        WindMitigationInspectionDate: home.windMitigationInspectionDate,
        BurglarAlarm:
          returnExists(home.hasMonitoredAlarmSystem) ||
          returnExists(home.hasAlarmSystem)
            ? 'Rep to Central Station'
            : 'None', // required
        FireAlarm: returnExists(home.hasFireAlarmDiscount)
          ? 'Rep to Central Station'
          : 'None', // required
        FireHydrant: returnExists(home.distanceFromFireHydrant)
          ? returnDistanceToHydrant(home.distanceFromFireHydrant)
          : 'Within 1000 Feet',
        FireStation: returnExists(home.distanceFromFireStation)
          ? returnDistanceToFireStations(home.distanceFromFireStation)
          : 'Within 5 Miles',
        GatedCommunity:
          returnExists(home.hasGatedCommunity) ||
          home.hasGuardedCommunity ||
          home.gatedCommunityDiscount === 'Yes'
            ? '24 hr Manned Gate'
            : 'No', // required
        Sprinklers: '',
        BusinessOnPremises:
          home.hasBusiness || home.hasBusinessConducted === 'Yes'
            ? 'Business'
            : 'No',
        Subdivision: '',
        ProtectedSubdivision: false,
        DogLiability: false,
        EPolicy: false,
        EquipmentBreakdown: false,
        FloodEndorsement: false,
        HardiPlankSiding: false,
        IdentityTheft: false,
        IncreaseReplacementCostOnDwelling: false,
        OpenWaterExposure: false,
        PersonalInjuryCoverage: false,
        OptionalPersonalPropertyReplacementCost: false,
        RefrigeratedContents: false,
        Smokers: false,
        ServiceLine: false,
        SinkholeCoverage: false,
        WaterDamageExclusion: false,
        WoodBurningStove: parseInt(home.numberOfWoodBurningStoves) > 0 ? 1 : 0, // required
        AccreditedBuilder: false,
        AccreditedBuilderName: '',
        AdditionalLawOrdinance: '',
        ComputerCoverage: '',
        FungusMold: '',
        LossAssessment: '',
        WaterBackup: false,
        WaterBackupAmount: '',
        EarthquakeDeductible: '',
        IBHS: '',
        ImpactResistantRoof: home.hasImpactResistantRoof,
        WaterDamageFoundation: false,
        Kitchen1Type: 'Basic',
        Kitchen1Count: home.numOfKitchens,
        FullBathType: 'Full Basic',
        FullBathCount: home.numOfBaths ? Math.floor(+home.numOfBaths) : '',
        HalfBathType: 'Half Basic',
        HalfBathCount: home.numOfBaths ? +home.numOfBaths % 2 : '',
        Garage1Type: home.garageType,
        Garage1Capacity: '',
        Garage1SqFt: home.garageSize,
        GarageList: [
          {
            Type: '',
            Capacity: '',
            SquareFeet: '',
            Deleted: false,
          },
          {
            Type: '',
            Capacity: '',
            SquareFeet: '',
            Deleted: false,
          },
        ],
        WallHeight: '8',
        CentralHeatAndAir: home.coolType
          ? home.coolType.toLowerCase().includes('central')
            ? 'Yes'
            : 'No'
          : '',
        Fireplaces:
          returnExists(home.numberOfFireplaces) &&
          home.numberOfFireplaces != '0'
            ? home.numberOfFireplaces
            : 'None',
        Stoves: home.numberOfWoodBurningStoves,
        Carpet: '50',
        Hardwood: '50',
        Vinyl: '',
        Tile: '',
        Marble: '',
        Laminate: '',
        Terrazzo: '',
        QualityGrade: 'Economy',
        FoundationShape: '6-7 Corners - L Shape',
        SiteAccess: '',
        RCEStyle: '',
        PorchDeckPatio: '',
        underwriting: {
          Bankruptcy: false,
          BankruptcyYears: '',
          InsuranceCanceled: false,
          Conviction: false,
          MoreThan5Acres: false,
          NotVisible: false,
          NearIndustrial: false,
          SinkholeActivity: false,
          ExistingDamage: false,
          FireViolations: false,
          PolybutylenePlumbing: false,
          CircuitBreakerType: false,
          ElectricAmps: '',
          PropertyConverted: false,
          GarageConverted: false,
          OilStorage: false,
          DogWithBiteHistory: false,
          ViciousDog: false,
          FarmAnimals: false,
          FarmAnimalDesc: '',
          ExoticAnimals: false,
          ExoticAnimalDesc: '',
          DogBreeds: home.petBreed,
          AbandonedVehicle: false,
          RoommatesBoarders: false,
          DomesticEmployee: false,
          Trampoline: home.hasTrampolines == 'Yes' ? true : false,
          SkateboardRamp: false,
          Rented: false,
          Unoccupied8Weeks: false,
          RentalTerm:
            home.primaryUse && home.primaryUse.includes('Rent')
              ? 'Monthly'
              : '', // required
          FireExtinguisher: false,
          Deadbolts: false,
          OverWater: false,
          ForSale: false,
          Foreclosure: false,
          DaysVacant: '',
          FoundationNotSecured: false,
          WaterHeaterNotSecured: false,
          CrippleWalls: false,
          CrippleWallsBraced: false,
          OnCliff: false,
          OverEarthquake: false,
        },
      };
      data.previousAddress = {
        Address: '',
        Address2: '',
        City: '',
        State: '',
        Zip: '',
        County: '',
        LastMonth: '',
        LastYear: '',
      };
      data.claims = [];
      data.flood = {
        FloodZone: '',
        CommunityNumber: '',
        CommunityDescription: '',
        MapPanel: '',
        MapPanelSuffix: '',
        FloodDeductible: '',
        PolicyType: '',
        WaitingPeriod: '',
        PriorFloodLoss: '',
        Grandfathering: false,
        HaveFloodElevationCert: false,
        ElevationCertDate: '',
        PhotographDate: '',
        Diagram: '',
        BuildingCoverage: '',
        ContentsCoverage: '',
        ElevationDifference: '',
        NonParticipatingFloodCommunity: false,
        CBRAZone: false,
        FloodCarrier: '',
        CarrierType: '',
        FloodExpirationDate: '',
      };
    }
    if (Object.prototype.hasOwnProperty.call(client, 'drivers') && client.drivers.length > 0) {
      data.autoPolicy = {
        BodilyInjury: client.vehicles.length
          ? client.vehicles[0].bodilyInjuryCoverage
          : '', // required
        CurrentAnnualPremium: '',
        CurrentCarrier: '',
        CurrentExpirationDate: '',
        CurrentlyInsured: '',
        CurrentPolicyTerm: '',
        EffectiveDate: returnExists(client.effectiveDate)
          ? returnNewDate(client.effectiveDate)
          : returnNewDate(new Date()),
        OwnOrRentHome: '',
        ResidenceType: '',
        PriorLiabilityLimits: client.liabilityLimits, // required
        PropertyDamage: client.vehicles.length
          ? client.vehicles[0].propertyDamageCoverage
          : '', // required
        UninsuredMotorist: client.vehicles.length
          ? client.vehicles[0].underInsuredMotoristCoverage
          : '', // required
        UninsuredMotoristsPropertyDamage: client.vehicles.length
          ? client.vehicles[0].uninsuredMotoristCoverage
          : '',
        YearsAtCurrentResidence: '',
        YearsContinuouslyInsured: client.priorInsuranceYears,
        YearsWithCurrentCarrier: client.yearsWithCarrier,
        MedicalPayments: client.vehicles.length
          ? client.vehicles[0].medicalCoverage
          : '', // required
        PIPDeductible: '', // required
        PIPCoverge: '',
        WageLoss: '', // required
        AAAMember: '',
        Notes: '',
        StackedCoverage: false,
        PIPMedicalDeductible: '',
        PIPMedicalCoverage: '',
        CombatTheft: false,
        SpousalLiability: false,
        OBEL: false,
        PIPAddlCoverage: '',
        GarageState: client.vehicles.length
          ? client.vehicles[0].applicantPostalCd
          : '',
      };
      data.driversList = returnQuteRushDrivers(client);
      if (Object.prototype.hasOwnProperty.call(client, 'vehicles') && client.vehicles.length > 0) {
        data.autosList = returnQuteRushVehicles(client);
      }
    }

    return { status: true, data: data };
  } catch (error) {
    console.log(error);
    return { status: false, error: error };
  }
}