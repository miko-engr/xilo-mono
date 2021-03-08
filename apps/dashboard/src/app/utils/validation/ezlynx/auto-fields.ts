import { returnArrayByKey } from './ez-arrays';

export const fields = [
    { type: 'Applicant', keys: [
        {key: 'FirstName', label: 'First Name', xiloKey: 'applicantGivenName', xiloObject: 'drivers', index: 0, fieldType: 'text', required: true },
        {key: 'LastName', label: 'Last Name', xiloKey: 'applicantSurname', xiloObject: 'drivers', index: 0, fieldType: 'text', required: true },
        {key: 'DOB', label: 'DOB', xiloKey: 'applicantBirthDt', xiloObject: 'drivers', index: 0, fieldType: 'date', startDate: '01/01/1993' },
        {key: 'SSN', label: 'SSN', xiloKey: 'ssnU', xiloObject: 'drivers', index: 0, fieldType: 'password' },
        {key: 'Gender', label: 'Gender', xiloKey: 'applicantGenderCd', xiloObject: 'drivers', index: 0, fieldType: 'select', options: returnArrayByKey('gender') },
        {key: 'MaritalStatus', label: 'Marital Status', xiloKey: 'applicantMaritalStatusCd', xiloObject: 'drivers', index: 0, fieldType: 'select', options: returnArrayByKey('maritalStatus') },
        {key: 'Industry', label: 'Industry', xiloKey: 'industry', xiloObject: 'drivers', index: 0, fieldType: 'industry' },
        {key: 'Occupation', label: 'Occupation', xiloKey: 'applicantOccupationClassCd', xiloObject: 'drivers', index: 0, fieldType: 'occupation' },
        {key: 'Education', label: 'Education', xiloKey: 'educationLevel', xiloObject: 'drivers', index: 0, fieldType: 'select', options: returnArrayByKey('educationLevel') },
        {key: 'Relation', label: 'Relation', xiloKey: 'relationship', xiloObject: 'drivers', index: 0, fieldType: 'select', options: returnArrayByKey('relationship') },
        {key: 'Email', label: 'Email', xiloKey: 'email', xiloObject: 'client', fieldType: 'email' },
        {key: 'PhoneNumber', label: 'Phone', xiloKey: 'phone', xiloObject: 'client', fieldType: 'number', events: ['fireNewLead'] },
    ]},
    { type: 'CoApplicant', keys: [
        {key: 'FirstName', label: 'First Name', xiloKey: 'applicantGivenName', xiloObject: 'drivers', index: 1, fieldType: 'text', required: true },
        {key: 'LastName', label: 'Last Name', xiloKey: 'applicantSurname', xiloObject: 'drivers', index: 1, fieldType: 'text', required: true },
        {key: 'DOB', label: 'DOB', xiloKey: 'applicantBirthDt', xiloObject: 'drivers', index: 1, fieldType: 'date', startDate: '01/01/1993' },
        {key: 'SSN', label: 'SSN', xiloKey: 'ssnU', xiloObject: 'drivers', index: 1, fieldType: 'password' },
        {key: 'Gender', label: 'Gender', xiloKey: 'applicantGenderCd', xiloObject: 'drivers', index: 1, fieldType: 'select', options: returnArrayByKey('gender')},
        {key: 'MaritalStatus', label: 'Marital Status', xiloKey: 'applicantMaritalStatusCd', xiloObject: 'drivers', index: 1, fieldType: 'select', options: returnArrayByKey('maritalStatus')},
        {key: 'Industry', label: 'Industry', xiloKey: 'industry', xiloObject: 'drivers', index: 1, fieldType: 'industry' },
        {key: 'Occupation', label: 'Occupation', xiloKey: 'applicantOccupationClassCd', xiloObject: 'drivers', index: 1, fieldType: 'occupation' },
        {key: 'Education', label: 'Education', xiloKey: 'educationLevel', xiloObject: 'drivers', index: 1, fieldType: 'select', options: returnArrayByKey('educationLevel') },
        {key: 'Relation', label: 'Relation', xiloKey: 'relationship', xiloObject: 'drivers', index: 1, fieldType: 'select', options: returnArrayByKey('relationship') },
        {key: 'Email', label: 'Email'},
        {key: 'PhoneNumber', label: 'Phone'},
    ]},
    { type: 'Address', keys: [
        { key: 'FullAddress', label: 'Full Address', xiloKey: 'fullAddress', xiloObject: 'client', fieldType: 'text', events: ['isAddressSearch']  },
        { key: 'StreetName', label: 'Address Street Name', xiloKey: 'streetName', xiloObject: 'client', fieldType: 'text' },
        { key: 'StreetNumber', label: 'Address Street Number', xiloKey: 'streetNumber', xiloObject: 'client', fieldType: 'text' },
        { key: 'UnitNumber', label: 'Address Unit Number', xiloKey: 'unitNumber', xiloObject: 'client', fieldType: 'text' },
        { key: 'City', label: 'Address City', xiloKey: 'city', xiloObject: 'client', fieldType: 'text' },
        { key: 'StateCode', label: 'Address State Code', xiloKey: 'stateCd', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('state') },
        { key: 'County', label: 'Address County', xiloKey: 'county', xiloObject: 'client', fieldType: 'text' },
        { key: 'Zip5', label: 'Address Zip5', xiloKey: 'postalCd', xiloObject: 'client', fieldType: 'number' },
        { key: 'YearsAtCurrent.Years', label: 'Years At Address', xiloKey: 'yearsAtCurrentAddress', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('yearsAtCurrentAddress') },
        { key: 'YearsAtCurrent.Months', label: 'Months At Address', fieldType: 'select', xiloKey: 'monthsAtCurrentAddress', xiloObject: 'client', options: returnArrayByKey('monthsAtCurrentAddress') },
        { key: 'Ownership', label: 'Ownership', xiloKey: 'homeownership', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('homeownership') },
    ]},
    { type: 'PreviousAddress', keys: [
        { key: 'FullAddress', label: 'Full Address', xiloKey: 'previousAddress', xiloObject: 'client', fieldType: 'text', events: ['isAddressSearch'] },
        // { key: 'StreetName', label: 'PreviousAddress Street Name'},
        // { key: 'StreetNumber', label: 'PreviousAddress Street Number'},
        // { key: 'UnitNumber', label: 'PreviousAddress Unit Number'},
        // { key: 'City', label: 'PreviousAddress City'},
        // { key: 'StateCode', label: 'PreviousAddress State Code'},
        // { key: 'County', label: 'PreviousAddress County'},
        // { key: 'Zip5', label: 'PreviousAddress Zip5'},
        // { key: 'Zip5', label: 'PreviousAddress Zip5'},
        // { key: 'Zip5', label: 'PreviousAddress Zip5'},
        { key: 'YearsAtPrevious.Years', label: 'Years At Address', xiloKey: 'yearsAtPreviousAddress', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('yearsAtPreviousAddress')},
        { key: 'YearsAtPrevious.Months', label: 'Months At Address', xiloKey: 'monthsAtPreviousAddress', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('monthsAtPreviousAddress')},
    ]},
    { type: 'GarageLocation', keys: [
        { key: 'FullAddress', label: 'Garage Full Address', xiloKey: 'fullAddress', xiloObject: 'vehicles', fieldType: 'text', events: ['isAddressSearch'] },
        // { key: 'StreetName', label: 'Garage Street Name'},
        // { key: 'StreetNumber', label: 'Garage Street Number'},
        // { key: 'UnitNumber', label: 'Garage Unit Number'},
        // { key: 'City', label: 'Garage City'},
        // { key: 'StateCode', label: 'Garage State Code'},
        // { key: 'County', label: 'Garage County'},
        // { key: 'Zip5', label: 'Garage Zip5'},
    ]},
    { type: 'Home', keys: [
        { key: 'FullAddress', label: 'Full Address', xiloKey: 'fullAddress', xiloObject: 'homes', fieldType: 'address', events: ['isAddressSearch', 'getHomeData'] },
        { key: 'StreetName', label: 'Home Street Name', xiloKey: 'streetName', xiloObject: 'homes', fieldType: 'text' },
        { key: 'StreetNumber', label: 'Home Street Number', xiloKey: 'streetNumber', xiloObject: 'homes', fieldType: 'text' },
        { key: 'UnitNumber', label: 'Home Unit Number', xiloKey: 'unitNumber', xiloObject: 'homes', fieldType: 'text' },
        { key: 'City', label: 'Home City', xiloKey: 'city', xiloObject: 'homes', fieldType: 'text' },
        { key: 'StateCode', label: 'Home State Code', xiloKey: 'state', xiloObject: 'homes', fieldType: 'text' },
        { key: 'County', label: 'Home County', xiloKey: 'county', xiloObject: 'homes', fieldType: 'text' },
        { key: 'Zip5', label: 'Home Zip5', xiloKey: 'zipCode', xiloObject: 'homes', fieldType: 'number' },
    ]},
    { type: 'PriorPolicyInfo', keys: [
      {key: 'PriorCarrier', label: 'Prior Carrier', xiloKey: 'priorInsuranceCompany', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('priorInsuranceCompany')},
      {key: 'Expiration', label: 'Expiration Date', xiloKey: 'priorInsuranceExpirationDate', xiloObject: 'client', fieldType: 'date'},
      {key: 'YearsWithPriorCarrier.Years', label: 'Years With Prior Carrier', xiloKey: 'yearsWithCarrier', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('yearsWithCarrier') },
      {key: 'YearsWithPriorCarrier.Months', label: 'Months With Prior Carrier', xiloKey: 'monthsWithCarrier', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('monthsWithCarrier') },
      {key: 'YearsWithContinuousCoverage.Years', label: 'Years With Auto Coverage', xiloKey: 'priorInsuranceYears', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('priorInsuranceYears') },
      {key: 'YearsWithContinuousCoverage.Months', label: 'Months With Auto Coverage', xiloKey: 'priorInsuranceMonths', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('priorInsuranceMonths') },
      {key: 'PriorLiabilityLimit', label: 'Prior Liability Limits', xiloKey: 'priorLiabilityLimit', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('priorLiabilityLimit') },
      {key: 'PriorPolicyPremium', label: 'Prior Premium', xiloKey: 'priorInsurancePremium', xiloObject: 'client', fieldType: 'number'},
      {key: 'PriorPolicyTerm', label: 'Prior Policy Term', xiloKey: 'priorPolicyTerm', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('priorPolicyTerm')},
    ]},
    { type: 'PolicyInfo', keys: [
      {key: 'PolicyTerm', label: 'Policy Term', xiloKey: 'autoCoverageTerm', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('autoCoverageTerm')},
      {key: 'Package', label: 'Has Package', xiloKey: 'hasPackage', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('hasPackage')},
      {key: 'Effective', label: 'Effective Date', xiloKey: 'effectiveDate', xiloObject: 'client', fieldType: 'date'}
    ]},
    { type: 'Drivers', keys: [
      {key: 'FirstName', label: 'First Name', xiloKey: 'applicantGivenName', xiloObject: 'drivers', fieldType: 'text', required: true },
      {key: 'LastName', label: 'Last Name', xiloKey: 'applicantSurname', xiloObject: 'drivers', fieldType: 'text', required: true },
      {key: 'Gender', label: 'Gender', xiloKey: 'applicantGenderCd', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('applicantGenderCd') },
      {key: 'DOB', label: 'DOB', xiloKey: 'applicantBirthDt', xiloObject: 'drivers', fieldType: 'date', startDate: '01/01/1993' },
      {key: 'SSN', label: 'SSN', xiloKey: 'ssnU', xiloObject: 'drivers', fieldType: 'password' },
      {key: 'DLNumber', label: 'Drivers License Number', xiloKey: 'driverLicenseNumber', xiloObject: 'drivers', fieldType: 'text'},
      {key: 'DLState', label: 'Drivers License State', xiloKey: 'driverLicenseStateCd', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('driverLicenseStateCd') },
      {key: 'AgeLicensed', label: 'Age Licensed', xiloKey: 'drivingExperience', xiloObject: 'drivers', fieldType: 'number' },
      {key: 'DateLicensed', label: 'Date Licensed', xiloKey: 'driverLicensedDt', xiloObject: 'drivers', fieldType: 'date', startDate: '01/01/2000' },
      {key: 'MaritalStatus', label: 'Marital Status', xiloKey: 'applicantMaritalStatusCd', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('applicantMaritalStatusCd') },
      {key: 'Industry', label: 'Industry', xiloKey: 'industry', xiloObject: 'drivers', fieldType: 'industry' },
      {key: 'Occupation', label: 'Occupation', xiloKey: 'applicantOccupationClassCd', xiloObject: 'drivers', fieldType: 'occupation' },
      {key: 'Relation', label: 'Relation', xiloKey: 'relationship', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('relationship') },
      {key: 'GoodStudent', label: 'Good Student Discount', xiloKey: 'isGoodStudent', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('isGoodStudent')},
      {key: 'DriverTraining', label: 'Driver Training Discount', xiloKey: 'hasDriversTrainingDiscount', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('hasDriversTrainingDiscount')},
      {key: 'GoodDriver', label: 'Good Driver Discount', xiloKey: 'isSafeDriver', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('isSafeDriver') },
      {key: 'PrincipalVehicle', label: 'Principal Vehicle', xiloKey: 'vehicleIndex', xiloObject: 'drivers', fieldType: 'selectassignment.vehicles' },
      {key: 'SR22', label: 'Needs SR22', xiloKey: 'needsSR22', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('needsSR22') },
      {key: 'LicenseRevokedSuspended', label: 'Had License Revoked or Suspended', xiloKey: 'hadLicenseSuspended', xiloObject: 'drivers', fieldType: 'select', options: returnArrayByKey('hadLicenseSuspended')},
    ]},
    { type: 'Accidents', keys: [
      {key: 'Date', label: 'Date', xiloKey: 'date', xiloObject: 'incidents', fieldType: 'date'},
      {key: 'Description', label: 'Description', xiloKey: 'description', xiloObject: 'incidents', fieldType: 'select', options: returnArrayByKey('accidentDescription')},
      {key: 'PD', label: 'PD', xiloKey: 'propertyDamage', xiloObject: 'incidents', fieldType: 'number'},
      {key: 'BI', label: 'BI', xiloKey: 'bodilyInjury', xiloObject: 'incidents', fieldType: 'number' },
      {key: 'Collision', label: 'Collision', xiloKey: 'collision', xiloObject: 'incidents', fieldType: 'number' },
      {key: 'MP', label: 'MP', xiloKey: 'medicalPayment', xiloObject: 'incidents', fieldType: 'number' },
      {key: 'VehicleInvolved', label: 'Vehicle Involved', xiloKey: 'vehicleIndex', xiloObject: 'incidents', fieldType: 'selectassignment.vehicles'},
    ]},
    { type: 'Violations', keys: [
      {key: 'Date', label: 'Date', xiloKey: 'date', xiloObject: 'incidents', fieldType: 'date' },
      {key: 'Description', label: 'Description', xiloKey: 'description', xiloObject: 'incidents', fieldType: 'select', options: returnArrayByKey('violationDescription') },
    ]},
    { type: 'CompLoss', keys: [
      {key: 'Date', label: 'Date', xiloKey: 'date', xiloObject: 'incidents', fieldType: 'date' },
      {key: 'Description', label: 'Description', xiloKey: 'description', xiloObject: 'incidents', fieldType: 'select', options: returnArrayByKey('damageClaimDescription')},
      {key: 'Value', label: 'Value', xiloKey: 'amount', xiloObject: 'incidents', fieldType: 'number' },
      {key: 'VehicleInvolved', label: 'Vehicle Involved', xiloKey: 'vehicleIndex', xiloObject: 'incidents', fieldType: 'selectassignment.vehicles' },
    ]},
    { type: 'Vehicles', keys: [
      {key: 'Vin', label: 'Vin', xiloKey: 'vehicleVin', xiloObject: 'vehicles', fieldType: 'text', events: ['isVehicleVIN']},
      {key: 'Year', label: 'Year', xiloKey: 'vehicleModelYear', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('vehicleModelYear'), events: ['isVehicleYear']},
      {key: 'Make', label: 'Make', xiloKey: 'vehicleManufacturer', xiloObject: 'vehicles', fieldType: 'select', events: ['isVehicleMake']},
      {key: 'Model', label: 'Model', xiloKey: 'vehicleModel', xiloObject: 'vehicles', fieldType: 'select', events: ['isVehicleModel']},
      {key: 'SubModel', label: 'SubModel', xiloKey: 'vehicleBodyStyle', xiloObject: 'vehicles', fieldType: 'select', events: ['isVehicleBodyStyle']},
      {key: 'Anti-Theft', label: 'Anti-Theft', xiloKey: 'antiTheftType', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('antiTheftType')},
      {key: 'PassiveRestraints', label: 'PassiveRestraints', xiloKey: 'passiveRestraintsType', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('passiveRestraintsType')},
      {key: 'AntiLockBrake', label: 'AntiLockBrake', xiloKey: 'hasAntiLockBrakes', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('hasAntiLockBrakes')},
      {key: 'DaytimeRunningLights', label: 'DaytimeRunningLights', xiloKey: 'hasDaytimeLights', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('hasDaytimeLights')},
      {key: 'VehicleInspection', label: 'VehicleInspection', fieldType: 'select', options: returnArrayByKey('vehicleInspectionType')},
      {key: 'Useage', label: 'Useage', xiloKey: 'vehicleUseCd', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('vehicleUseCd')},
      {key: 'OneWayMiles', label: 'One Way Miles', xiloKey: 'vehicleCommuteMilesDrivenOneWay', xiloObject: 'vehicles', fieldType: 'number'},
      {key: 'DaysPerWeek', label: 'Days Per Week', xiloKey: 'vehicleDaysDrivenPerWeek', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('vehicleDaysDrivenPerWeek') },
      {key: 'WeeksPerMonth', label: 'Weeks Per Month', xiloKey: 'weeksPerMonthDriven', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('weeksPerMonthDriven') },
      {key: 'AnnualMiles', label: 'Annual Miles', xiloKey: 'vehicleAnnualDistance', xiloObject: 'vehicles', fieldType: 'number' },
      {key: 'Ownership', label: 'Ownership', xiloKey: 'ownOrLeaseVehicle', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('ownOrLeaseVehicle') },
      {key: 'Carpool', label: 'Carpool', fieldType: 'select', options: returnArrayByKey('doesCarpool')},
      {key: 'Odometer', label: 'Odometer', xiloKey: 'currentOdometerReadingValue', xiloObject: 'vehicles', fieldType: 'number' },
      {key: 'Performance', label: 'Performance', fieldType: 'select', options: returnArrayByKey('performanceType')},
      {key: 'NewVehicle', label: 'New Vehicle', fieldType: 'select', options: returnArrayByKey('isNewVehicle')},
      {key: 'AdditionalModificationValue', label: 'Additional Modification Value', xiloKey: 'aftermarketEquipmentValue', xiloObject: 'vehicles', fieldType: 'number' },
      {key: 'AlternateGarage', label: 'Alternate Garage', fieldType: 'select', options: returnArrayByKey('hasAlternateGarage')},
      {key: 'PrincipalOperator', label: 'Principal Operator', xiloKey: 'vehicleId', xiloObject: 'vehicles', fieldType: 'selectassignment.drivers'},
      {key: 'CostNew', label: 'Cost New', xiloKey: 'costNew', xiloObject: 'vehicles', fieldType: 'number' },
      {key: 'UsedForDelivery', label: 'Used For Delivery', xiloKey: 'isUsedForFoodDelivery', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('isUsedForFoodDelivery')},
      {key: 'PriorDamagePresent', label: 'Prior Damage Present', xiloKey: 'hasExistingDamage', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('hasExistingDamage')},
      {key: 'SnowPlow', label: 'Snow Plow', fieldType: 'select', options: returnArrayByKey('hasSnowPlow')},
      {key: 'OtherCollisionDeductible', label: 'Comprehensive Deductible', xiloKey: 'comprehensive', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('comprehensive') },
      {key: 'CollisionDeductible', label: 'Collision Deductible', xiloKey: 'collision', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('collision') },
      {key: 'FullGlass', label: 'Full Glass', xiloKey: 'fullGlassCoverage', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('fullGlassCoverage')},
      {key: 'TowingDeductible', label: 'Towing Deductible', xiloKey: 'roadsideCoverage', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('roadsideCoverage') },
      {key: 'RentalDeductible', label: 'Rental Deductible', xiloKey: 'rentalCoverage', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('rentalCoverage') },
      {key: 'LiabilityNotRequired', label: 'Liability Not Required', options: returnArrayByKey('liabilityNotRequired')},
      {key: 'LoanLeaseCoverage', label: 'Loan Lease Coverage', xiloKey: 'loanAndLeaseCoverage', xiloObject: 'vehicles', fieldType: 'select', options: returnArrayByKey('loanAndLeaseCoverage')},
      {key: 'StatedAmount', label: 'Stated Amount', xiloKey: 'value', xiloObject: 'vehicles', fieldType: 'number' },
      {key: 'ReplacementCost', label: 'Replacement Cost', options: returnArrayByKey('wantsReplacementCostCoverage')},
      {key: 'WaiverCollisionDamage', label: 'Waiver Collision Damage', options: returnArrayByKey('waiverCollisionDamage')},
    ]},
    { type: 'GeneralCoverage', keys: [
      {key: 'BI', label: 'Bodily Injury', xiloKey: 'bodilyInjuryCoverage', xiloObject: 'vehicles', index: 0, fieldType: 'select', options: returnArrayByKey('bodilyInjuryCoverage')},
      {key: 'PD', label: 'Property Damage', xiloKey: 'propertyDamageCoverage', xiloObject: 'vehicles', index: 0, fieldType: 'select', options: returnArrayByKey('propertyDamageCoverage')},
      {key: 'MD', label: 'Medical Damage', xiloKey: 'medicalCoverage', xiloObject: 'vehicles', index: 0, fieldType: 'select', options: returnArrayByKey('medicalCoverage')},
      {key: 'UM', label: 'Uninsured Motorist', xiloKey: 'uninsuredMotoristCoverage', xiloObject: 'vehicles', index: 0, fieldType: 'select', options: returnArrayByKey('uninsuredMotoristCoverage')},
      {key: 'UIM', label: 'Under Insured Motorist', xiloKey: 'underInsuredMotoristCoverage', xiloObject: 'vehicles', index: 0, fieldType: 'select', options: returnArrayByKey('underInsuredMotoristCoverage')},
      {key: 'Multipolicy', label: 'Multipolicy', fieldType: 'select', options: returnArrayByKey('hasMultiPolicy')},
      {key: 'RetirementCommunity', label: 'Retirement Community Discount', fieldType: 'select', options: returnArrayByKey('isInRetirementCommunity')},
      {key: 'AAADiscount', label: 'AAA Discount', xiloKey: 'isAAAMember', xiloObject: 'client', fieldType: 'select', options: returnArrayByKey('isAAAMember')},
      {key: 'Multicar', label: 'Multicar Discount', fieldType: 'select', options: returnArrayByKey('hasMultiCarDiscount')},
    ]},
    { type: 'GeneralInfo', keys: [
      {key: 'RatingStateCode', label: 'Rating State' },
      {key: 'Comments', label: 'Comments', xiloKey: 'comments', xiloObject: 'client', fieldType: 'textarea'}
    ]},
    { type: 'TX-Coverages', keys: [
      {key: 'TX-PIP', label: 'Personal Injury Protection', xiloKey: 'personalInjuryCoverage', options: returnArrayByKey('personalInjuryCoverage')  },
      {key: 'TX-AutoDeathIndemnity', label: 'Auto Death Indemnity', xiloKey: 'autoDeathIndemnity', xiloObject: 'vehicles', index: 0, fieldType: 'select', options: returnArrayByKey('autoDeathIndemnity') },
      {key: 'TX-UMPD', label: 'UMPD', xiloKey: 'umPd', options: returnArrayByKey('umPd') },
    ]},
    { type: 'KY-Coverages', keys: [
      {key: 'KY-PIP', label: 'Personal Injury Protection', xiloKey: 'personalInjuryCoverage', options: returnArrayByKey('personalInjuryCoverage') },
      {key: 'KY-APIP', label: 'APIP', options: returnArrayByKey('apip')},
      {key: 'KY-PIPDeductible', label: 'PIP Deductible', options: returnArrayByKey('pipDeductible') },
      {key: 'KY-TortLimitation', label: 'Tort Limitation', options: returnArrayByKey('tortLimitation') },
    ]}
]