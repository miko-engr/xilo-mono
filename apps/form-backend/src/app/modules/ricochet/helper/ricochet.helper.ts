import { formatDateYY } from '../../../helpers/date.helper';
import { set } from 'lodash';
import * as stringSimilarity from 'string-similarity';
import request from 'request-promise';
import { ezLynx, encryption } from '../../../constants/appconstant';
import * as parser from 'xml2js';
import * as simpleencryptor from 'simple-encryptor';
import { HttpException, HttpStatus } from '@nestjs/common';
const encryptor = simpleencryptor.createEncryptor(encryption.key);

export async function returnData(client, company?) {
  try {
    function returnValueIfExists(value) {
      if (
        value &&
        value !== 'undefined' &&
        typeof value !== 'undefined' &&
        value !== null
      ) {
        if (value === 'true' || value === true) {
          return 'Yes';
        }
        if (value === false || value === 'false') {
          return 'No';
        }
        return value;
      }
      if (value === false) {
        return 'No';
      }
      return false;
    }
    function returnExists(value) {
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
    function returnValue(value) {
      if (returnValueIfExists(value)) {
        return value;
      }
      return false;
    }
    function returnDateValue(value, defaultDate) {
      if (returnValueIfExists(value)) {
        return formatDateYY(value);
      } else if (returnValueIfExists(defaultDate)) {
        return formatDateYY(defaultDate);
      }
      return undefined;
    }
    async function assignObject(object, key, value) {
      if (returnValue(value)) {
        set(object, key, returnValue(value));
      }
      return undefined;
    }
    function returnExistsWithArray(key, array) {
      if (array && array.length > 0) {
        return returnExists(array[0][key]);
      } else {
        return false;
      }
    }

    const dataFile: any = {};
    dataFile.Applicant = {};
    dataFile.Applicant.ApplicantType = 'Applicant';
    dataFile.Applicant.PersonalInfo = {};
    dataFile.Applicant.PersonalInfo.Name = {};

    dataFile.Applicant.PersonalInfo.Name = {};
    const insured = await returnInsured(client);
    await assignObject(
      dataFile.Applicant.PersonalInfo.Name,
      'FirstName',
      insured.firstName
    );
    //   await assignObject(dataFile.Applicant.PersonalInfo.Name, 'MiddleName', client.firstName);
    await assignObject(
      dataFile.Applicant.PersonalInfo.Name,
      'LastName',
      insured.lastName
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'DOB',
      returnDateValue(insured.birthday, null)
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'SSN',
      await returnSSN(client, 'client', 0)
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Gender',
      insured.gender
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'MaritalStatus',
      insured.maritalStatus
    );

    const bestOccupation = await returnClosestValue(
      insured.industry,
      await returnArray('occupations'),
      null
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Industry',
      bestOccupation
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Occupation',
      await returnOccupation(bestOccupation)
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Education',
      await returnClosestValue(
        insured.education,
        await returnArray('education'),
        null
      )
    );
    await assignObject(dataFile.Applicant.PersonalInfo, 'Relation', 'Insured');

    dataFile.Applicant.Address = {};
    if (returnValueIfExists(client.city)) {
      dataFile.Applicant.Address.AddressCode = 'StreetAddress';
      dataFile.Applicant.Address.Addr1 = {};
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'StreetName',
        client.streetName
      );
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'StreetNumber',
        client.streetNumber
      );
      await assignObject(dataFile.Applicant.Address, 'City', client.city);
      await assignObject(
        dataFile.Applicant.Address,
        'StateCode',
        client.stateCd
      );
      await assignObject(dataFile.Applicant.Address, 'Zip5', client.postalCd);
    }
    if (returnValueIfExists(client.phone)) {
      dataFile.Applicant.Address.Phone = {};
      dataFile.Applicant.Address.Phone.PhoneType = 'Mobile';
      await assignObject(
        dataFile.Applicant.Address.Phone,
        'PhoneNumber',
        client.phone
      );
    }
    await assignObject(dataFile.Applicant.Address, 'Email', client.email);
    await assignObject(
      dataFile.Applicant.Address,
      'YearsAtAddress',
      client.lengthAtAddress
    );
    if (
      (client.hasOwnProperty('drivers') && client.drivers.length > 1) ||
      client.spouseFirstName
    ) {
      // && client.drivers[1].relationship === 'Spouse' || client.drivers[1].relationship === 'Domestic Partner'
      if (client.drivers && client.drivers.length > 1) {
        const coApp = client.drivers[1];

        dataFile.CoApplicant = {};
        dataFile.CoApplicant.ApplicantType = 'CoApplicant';
        dataFile.CoApplicant.PersonalInfo = {};
        dataFile.CoApplicant.PersonalInfo.Name = {};
        dataFile.CoApplicant.PersonalInfo.Name = {};
        await assignObject(
          dataFile.CoApplicant.PersonalInfo.Name,
          'FirstName',
          coApp.applicantGivenName
        );
        //   await assignObject(dataFile.CoApplicant.PersonalInfo.Name, 'MiddleName', coApp.firstName);
        await assignObject(
          dataFile.CoApplicant.PersonalInfo.Name,
          'LastName',
          coApp.applicantSurname
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'DOB',
          returnDateValue(coApp.applicantBirthDt, null)
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Gender',
          coApp.applicantGenderCd
        );
        await assignObject(
          dataFile.Applicant.PersonalInfo,
          'SSN',
          await returnSSN(client, 'driver', 1)
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'MaritalStatus',
          coApp.applicantMaritalStatusCd
        );

        const bestOccupation = coApp.applicantOccupationClassCd
          ? await returnClosestValue(
              coApp.applicantOccupationClassCd,
              await returnArray('occupations'),
              null
            )
          : null;
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Industry',
          bestOccupation
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Occupation',
          await returnOccupation(bestOccupation)
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Education',
          coApp.educationLevel
            ? await returnClosestValue(
                coApp.educationLevel,
                await returnArray('education'),
                null
              )
            : null
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Relation',
          coApp.relationship
        );
      } else if (client.spouseFirstName) {
        dataFile.CoApplicant = {};
        dataFile.CoApplicant.ApplicantType = 'CoApplicant';
        dataFile.CoApplicant.PersonalInfo = {};
        dataFile.CoApplicant.PersonalInfo.Name = {};
        dataFile.CoApplicant.PersonalInfo.Name = {};
        await assignObject(
          dataFile.CoApplicant.PersonalInfo.Name,
          'FirstName',
          client.spouseFirstName
        );
        //   await assignObject(dataFile.CoApplicant.PersonalInfo.Name, 'MiddleName', coApp.firstName);
        await assignObject(
          dataFile.CoApplicant.PersonalInfo.Name,
          'LastName',
          client.spouseLastName
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'DOB',
          returnDateValue(client.spouseBirthdate, null)
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Gender',
          client.spouseGender
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'MaritalStatus',
          client.spouseMaritalStatus
        );

        const bestOccupation = client.spouseOccupation
          ? await returnClosestValue(
              client.spouseOccupation,
              await returnArray('occupations'),
              null
            )
          : null;
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Industry',
          bestOccupation
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Occupation',
          await returnOccupation(bestOccupation)
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Education',
          client.spouseEducationLevel
            ? await returnClosestValue(
                client.spouseEducationLevel,
                await returnArray('education'),
                null
              )
            : null
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Relation',
          'Spouse'
        );
      }

      dataFile.CoApplicant.Address = {};
      if (returnValueIfExists(client.city)) {
        dataFile.CoApplicant.Address.AddressCode = 'StreetAddress';
        dataFile.CoApplicant.Address.Addr1 = {};
        await assignObject(
          dataFile.CoApplicant.Address.Addr1,
          'StreetName',
          client.streetName
        );
        await assignObject(
          dataFile.CoApplicant.Address.Addr1,
          'StreetNumber',
          client.streetNumber
        );
        await assignObject(dataFile.CoApplicant.Address, 'City', client.city);
        await assignObject(
          dataFile.CoApplicant.Address,
          'StateCode',
          client.stateCd
        );
        await assignObject(
          dataFile.CoApplicant.Address,
          'Zip5',
          client.postalCd
        );
      }
      if (returnValueIfExists(client.phone)) {
        dataFile.CoApplicant.Address.Phone = {};
        dataFile.CoApplicant.Address.Phone.PhoneType = 'Mobile';
        await assignObject(
          dataFile.CoApplicant.Address.Phone,
          'PhoneNumber',
          client.phone
        );
      }
      await assignObject(dataFile.CoApplicant.Address, 'Email', client.email);
    }
    if (returnValueIfExists(client.priorInsuranceCompany)) {
      dataFile.PriorPolicyInfo = {};
      const priorInsuranceArray = await returnArray('autoInsuranceCompanies');
      await assignObject(
        dataFile.PriorPolicyInfo,
        'PriorCarrier',
        await returnClosestValue(
          client.priorInsuranceCompany,
          priorInsuranceArray,
          null
        )
      );
      await assignObject(
        dataFile.PriorPolicyInfo,
        'Expiration',
        returnDateValue(client.priorInsuranceExpirationDate, new Date())
      );
      dataFile.PriorPolicyInfo.YearsWithPriorCarrier = {};
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithPriorCarrier,
        'Years',
        client.yearsWithCarrier
      );
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithPriorCarrier,
        'Months',
        client.monthsWithCarrier
      );
      dataFile.PriorPolicyInfo.YearsWithContinuousCoverage = {};
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithContinuousCoverage,
        'Years',
        client.priorInsuranceYears
      );
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithContinuousCoverage,
        'Months',
        client.priorInsuranceMonths
      );
      let bi = null;
      if (returnExistsWithArray('priorLiabilityLimit', client.vehicles)) {
        bi = await returnClosestValue(
          client.vehicles[0].priorLiabilityLimit,
          await returnArray('priorLiabilityLimit'),
          null
        );
      } else if (
        returnExistsWithArray('bodilyInjuryCoverage', client.vehicles)
      ) {
        bi = await returnClosestValue(
          client.vehicles[0].bodilyInjuryCoverage,
          await returnArray('priorLiabilityLimit'),
          null
        );
      } else if (returnValueIfExists(client.liabilityLimits)) {
        bi = await returnClosestValue(
          client.liabilityLimits,
          await returnArray('priorLiabilityLimit'),
          null
        );
      }
      await assignObject(dataFile.PriorPolicyInfo, 'PriorLiabilityLimit', bi);
    }
    dataFile.PolicyInfo = {};
    const coverageTerm = client.autoCoverageTerm
      ? client.autoCoverageTerm
      : '6 Month';
    dataFile.PolicyInfo.PolicyTerm = coverageTerm;
    await assignObject(
      dataFile.PolicyInfo,
      'Package',
      returnExistsWithArray('hasPackage', client.vehicles)
        ? client.vehicles[0].hasPackage
        : 'No'
    );
    let effDate = null;
    if (client.effectiveDate === 'empty') {
      effDate = null;
    } else if (client.effectiveDate) {
      effDate = formatDateYY(client.effectiveDate);
    } else if (client.priorInsuranceExpirationDate) {
      effDate = formatDateYY(client.priorInsuranceExpirationDate);
    } else {
      effDate = formatDateYY(new Date());
    }
    await assignObject(dataFile.PolicyInfo, 'Effective', effDate);
    dataFile.PolicyInfo.CreditCheckAuth = 'Yes';
    const home =
      client.homes && client.homes[0] && client.homes[0].city
        ? client.homes[0]
        : null;
    if (
      returnValueIfExists(client.homeownership) ||
      returnValueIfExists(client.lengthAtAddress) ||
      home
    ) {
      dataFile.ResidenceInfo = {};
      dataFile.ResidenceInfo.CurrentAddress = {};
      if (returnValueIfExists(client.lengthAtAddress)) {
        dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent = {};
        await assignObject(
          dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent,
          'Years',
          client.lengthAtAddress
        );
      }
      const homeownership = returnExists(client.homeownership)
        ? client.homeownership
        : home
        ? 'Home (owned)'
        : null;
      const homeArray = await returnArray('homeownership');
      const ownership = await returnClosestValue(
        homeownership,
        homeArray,
        null
      );
      await assignObject(
        dataFile.ResidenceInfo.CurrentAddress,
        'Ownership',
        ownership
      );
    }
    if (
      client.hasOwnProperty('drivers') &&
      client.drivers.length > 0 &&
      returnValueIfExists(client.drivers[0].applicantSurname)
    ) {
      dataFile.Drivers = [];
      for (const j in client.drivers) {
        const driver = client.drivers[j];
        dataFile.Drivers.push({ [`Driver-${j}`]: {} });
        if (driver.applicantGivenName) {
          dataFile.Drivers[j][`Driver-${j}`].Name = {};
          await assignObject(
            dataFile.Drivers[j][`Driver-${j}`].Name,
            'FirstName',
            driver.applicantGivenName
          );
          await assignObject(
            dataFile.Drivers[j][`Driver-${j}`].Name,
            'LastName',
            driver.applicantSurname
          );
        }
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'Gender',
          driver.applicantGenderCd
        );
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'DOB',
          returnDateValue(driver.applicantBirthDt, null)
        );
        await assignObject(
          dataFile.Applicant.PersonalInfo,
          'SSN',
          await returnSSN(client, 'driver', j)
        );
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'DLNumber',
          driver.driverLicenseNumber
        );
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'DLState',
          driver.driverLicenseStateCd
        );
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'DateLicensed',
          returnDateValue(driver.driverLicensedDt, null)
        );
        dataFile.Drivers[j][`Driver-${j}`].DLStatus = 'Valid';
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'AgeLicensed',
          driver.drivingExperience
        );
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'MaritalStatus',
          driver.applicantMaritalStatusCd
        );
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'Relation',
          driver.relationship
        );

        const bestOccupation = driver.applicantOccupationClassCd
          ? await returnClosestValue(
              driver.applicantOccupationClassCd,
              await returnArray('occupations'),
              null
            )
          : null;
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'Industry',
          bestOccupation
        );
        await assignObject(
          dataFile.Drivers[j][`Driver-${j}`],
          'Occupation',
          await returnOccupation(bestOccupation)
        );
        if (client.hasAccidents === 'Yes') {
          dataFile.Drivers[0][`Driver-${j}`].Accident = {};
          await assignObject(
            dataFile.Drivers[0][`Driver-${j}`].Accident,
            'Date',
            returnDateValue(client.accidentDate, null)
          );
          await assignObject(
            dataFile.Drivers[0][`Driver-${j}`].Accident,
            'Description',
            client.accidentType
          );
        }
        if (client.hasViolations === 'Yes') {
          dataFile.Drivers[0][`Driver-${j}`].Violation = {};
          await assignObject(
            dataFile.Drivers[0][`Driver-${j}`].Violation,
            'Date',
            returnDateValue(client.violationDate, null)
          );
          await assignObject(
            dataFile.Drivers[0][`Driver-${j}`].Violation,
            'Description',
            client.violationType
          );
        }
        if (client.hasCompLoss === 'Yes') {
          dataFile.Drivers[0][`Driver-${j}`].CompLoss = {};
          await assignObject(
            dataFile.Drivers[0][`Driver-${j}`].CompLoss,
            'Date',
            returnDateValue(client.compLossDate, null)
          );
          await assignObject(
            dataFile.Drivers[0][`Driver-${j}`].CompLoss,
            'Description',
            client.compLossType ? client.compLossType.toUpperCase() : null
          );
        }
      }
    } else if (returnValueIfExists(client.driversList)) {
      dataFile.Drivers = [];
      const driversList = client.driversList.replace(/\r?\n|\r/g, ' ');
      const nameArray = driversList.split(' ');
      let driverIndex = 0;
      async function addDriver(index) {
        const nameIndex = index * 2;
        const firstName = nameArray[nameIndex];
        const lastName = nameArray[nameIndex + 1];
        const j = 0; // TODO j is not define
        dataFile.Drivers.push({ [`Driver-${nameIndex}`]: {} });
        dataFile.Drivers[nameIndex][`Driver-${nameIndex}`].Name = {};
        await assignObject(
          dataFile.Drivers[nameIndex][`Driver-${j}`].Name,
          'FirstName',
          firstName
        );
        await assignObject(
          dataFile.Drivers[nameIndex][`Driver-${j}`].Name,
          'LastName',
          lastName
        );
      }
      await addDriver(0);
      for (let i = 0; i < nameArray.length; i++) {
        if (i > 1 && i % 2 === 1) {
          driverIndex += 1;
          await addDriver(driverIndex);
        }
      }
    }
    if (
      client.hasOwnProperty('vehicles') &&
      client.vehicles.length > 0 &&
      returnValueIfExists(client.vehicles[0].vehicleModel)
    ) {
      dataFile.Vehicles = [];
      for (const j in client.vehicles) {
        const vehicle = client.vehicles[j];
        dataFile.Vehicles.push({ [`Vehicle${j}`]: {} });
        dataFile.Vehicles[j][`Vehicle${j}`].UseVinLookup = 'Yes';
        await assignObject(
          dataFile.Vehicles[j][`Vehicle${j}`],
          'Year',
          vehicle.vehicleModelYear
        );
        await assignObject(
          dataFile.Vehicles[j][`Vehicle${j}`],
          'Vin',
          vehicle.vehicleVin
        );
        await assignObject(
          dataFile.Vehicles[j][`Vehicle${j}`],
          'Make',
          vehicle.vehicleManufacturer
        );
        await assignObject(
          dataFile.Vehicles[j][`Vehicle${j}`],
          'Model',
          vehicle.vehicleModel
        );
        await assignObject(
          dataFile.Vehicles[j][`Vehicle${j}`],
          'Sub-Model',
          vehicle.vehicleBodyStyle
        );
      }
    } else if (returnValueIfExists(client.vehiclesList)) {
      dataFile.Vehicles = [];
      const vehiclesList = client.vehiclesList.replace(/\r?\n|\r/g, ' ');
      const vehicleArray = vehiclesList.split(' ');
      let vehicleIndex = 0;
      async function addVehicle(index) {
        const newIndex = index * 3;
        const year = vehicleArray[newIndex];
        const make = vehicleArray[newIndex + 1];
        const model = vehicleArray[newIndex + 2];
        dataFile.Vehicles.push({ [`Vehicle${newIndex}`]: {} });
        dataFile.Vehicles[newIndex][`Vehicle${newIndex}`].UseVinLookup = 'Yes';
        let vehicleData = await returnEZLynxVehicle(year, make, model);
        if (!vehicleData) {
          vehicleData = {
            year: null,
            make: null,
            model: null,
            vin: null,
          };
        }
        await assignObject(
          dataFile.Vehicles[newIndex][`Vehicle${newIndex}`],
          'Year',
          year
        );
        await assignObject(
          dataFile.Vehicles[newIndex][`Vehicle${newIndex}`],
          'Vin',
          vehicleData.vin
        );
        await assignObject(
          dataFile.Vehicles[newIndex][`Vehicle${newIndex}`],
          'Make',
          vehicleData.make
        );
        await assignObject(
          dataFile.Vehicles[newIndex][`Vehicle${newIndex}`],
          'Model',
          vehicleData.model
        );
      }
      await addVehicle(0);
      for (let i = 0; i < vehicleArray.length; i++) {
        if (i > 1 && i % 3 === 1) {
          vehicleIndex += 1;
          await addVehicle(vehicleIndex);
        }
      }
    }
    if (
      client.hasOwnProperty('vehicles') &&
      client.vehicles.length > 0 &&
      returnValueIfExists(client.vehicles[0].vehicleUseCd)
    ) {
      dataFile.VehiclesUse = [];
      for (const j in client.vehicles) {
        const vehicle = client.vehicles[j];
        dataFile.VehiclesUse.push({ [`Vehicle${j}`]: {} });
        await assignObject(
          dataFile.VehiclesUse[j][`Vehicle${j}`],
          'Useage',
          vehicle.vehicleUseCd
        );
        await assignObject(
          dataFile.VehiclesUse[j][`Vehicle${j}`],
          'OneWayMiles',
          vehicle.vehicleCommuteMilesDrivenOneWay
        );
        await assignObject(
          dataFile.VehiclesUse[j][`Vehicle${j}`],
          'DaysPerWeek',
          vehicle.vehicleDaysDrivenPerWeek
        );
        //   dataFile.VehiclesUseUse[j][`Vehicle${j}`].WeeksPerMonth = {};
        await assignObject(
          dataFile.VehiclesUse[j][`Vehicle${j}`],
          'AnnualMiles',
          vehicle.vehicleAnnualDistance
        );
        await assignObject(
          dataFile.VehiclesUse[j][`Vehicle${j}`],
          'Ownership',
          vehicle.ownOrLeaseVehicle
        );
        //   dataFile.VehiclesUse[j][`Vehicle${j}`].PrincipalOperator = {};
        //   dataFile.VehiclesUse[j][`Vehicle${j}`].UsedForDelivery = {};
        //   dataFile.VehiclesUse[j][`Vehicle${j}`].PriorDamagePresent = {};
      }
    }
    if (client.homes && client.homes[0]) {
      dataFile.RatingInfo = {};
      const home = client.homes[0];
      const hasCancelled = client.homeInsurancePreviouslyCancelled
        ? client.homeInsurancePreviouslyCancelled
        : 'No';
      await assignObject(
        dataFile.RatingInfo,
        'PropertyInsCancelledLapsed',
        hasCancelled
      );
      await assignObject(dataFile.RatingInfo, 'YearBuilt', home.yearBuilt);
      await assignObject(
        dataFile.RatingInfo,
        'Dwelling',
        await returnClosestValue(
          home.residenceType,
          await returnArray('dwellingType'),
          'One Family'
        )
      );
      await assignObject(
        dataFile.RatingInfo,
        'DwellingUse',
        await returnClosestValue(
          home.primaryUse,
          await returnArray('homePrimaryUse'),
          null
        )
      );
      await assignObject(
        dataFile.RatingInfo,
        'DistanceToFireHydrant',
        home.distanceFromFireHydrant
      );
      await assignObject(
        dataFile.RatingInfo,
        'WithinCityLimits',
        home.isInCity
      );
      await assignObject(
        dataFile.RatingInfo,
        'WithinFireDistrict',
        home.isInFireDistrict
      );
      dataFile.RatingInfo.ProtectionClass = '1';
      await assignObject(
        dataFile.RatingInfo,
        'DistanceToFireStation',
        home.distanceFromFireStation
      );
      await assignObject(
        dataFile.RatingInfo,
        'NumberOfStories',
        home.numOfStories
      );
      await assignObject(
        dataFile.RatingInfo,
        'Construction',
        await returnClosestValue(
          home.exteriorMaterials,
          await returnArray('constructionType'),
          null
        )
      );
      await assignObject(
        dataFile.RatingInfo,
        'Structure',
        await returnClosestValue(
          home.structureType,
          await returnArray('structureType'),
          null
        )
      );
      await assignObject(
        dataFile.RatingInfo,
        'Roof',
        await returnClosestValue(
          home.roofType ? home.roofType.toUpperCase() : null,
          await returnArray('roofType'),
          null
        )
      );
      const hasPool = home.hasPoolHidden ? home.hasPoolHidden : home.hasPools;
      await assignObject(dataFile.RatingInfo, 'SwimmingPool', hasPool);
      if (hasPool === 'Yes') {
        await assignObject(
          dataFile.RatingInfo,
          'SwimmingPoolFenced',
          home.poolHasFence
        );
        if (home.poolType) {
          const poolType = await returnClosestValue(
            home.poolType,
            await returnArray('poolTypes'),
            null
          );
          if (poolType) {
            await assignObject(
              dataFile.RatingInfo,
              'SwimmingPoolType',
              poolType
            );
          }
        }
      }
      await assignObject(
        dataFile.RatingInfo,
        'DogOnPremises',
        home.hasDogHidden ? home.hasDogHidden : home.hasDogs
      );
      await assignObject(
        dataFile.RatingInfo,
        'HeatingType',
        await returnClosestValue(
          home.heatType,
          await returnArray('heatType'),
          'Other'
        )
      );
      await assignObject(
        dataFile.RatingInfo,
        'WoodBurningStove',
        +home.numberOfWoodBurningStoves > 0 ? 'Yes' : 'No'
      );
      if (+home.numberOfWoodBurningStoves > 0) {
        await assignObject(
          dataFile.RatingInfo,
          'NumberOfWoodBurningStoves',
          home.numberOfWoodBurningStoves
        );
      }
      if (home.roofUpdateYear) {
        await assignObject(
          dataFile.RatingInfo,
          'RoofingUpdate',
          'COMPLETE UPDATE'
        );
        await assignObject(
          dataFile.RatingInfo,
          'RoofingUpdateYear',
          home.roofUpdateYear
        );
      }
      if (home.electricalUpdateYear) {
        await assignObject(
          dataFile.RatingInfo,
          'ElectricalUpdate',
          'COMPLETE UPDATE'
        );
        await assignObject(
          dataFile.RatingInfo,
          'ElectricalUpdateYear',
          home.electricalUpdateYear
        );
      }
      if (home.plumbingUpdateYear) {
        await assignObject(
          dataFile.RatingInfo,
          'PlumbingUpdate',
          'COMPLETE UPDATE'
        );
        await assignObject(
          dataFile.RatingInfo,
          'PlumbingUpdateYear',
          home.plumbingUpdateYear
        );
      }
      if (home.heatingUpdateYear) {
        await assignObject(
          dataFile.RatingInfo,
          'HeatingUpdate',
          'COMPLETE UPDATE'
        );
        await assignObject(
          dataFile.RatingInfo,
          'HeatingUpdateYear',
          home.heatingUpdateYear
        );
      }
      const underConstruction = home.underConstruction
        ? home.underConstruction
        : 'No';
      await assignObject(
        dataFile.RatingInfo,
        'UnderConstruction',
        underConstruction
      );
      await assignObject(
        dataFile.RatingInfo,
        'SquareFootage',
        home.totalSquareFootage
      );
      await assignObject(
        dataFile.RatingInfo,
        'PurchaseDate',
        returnDateValue(home.purchaseDate, null)
      );
      await assignObject(
        dataFile.RatingInfo,
        'PurchasePrice',
        home.purchasePrice
      );
      await assignObject(
        dataFile.RatingInfo,
        'Trampoline',
        home.hasTrampolineHidden
          ? home.hasTrampolineHidden
          : home.hasTrampolines
      );
      await assignObject(
        dataFile.RatingInfo,
        'BusinessOnPremises',
        home.hasBusinessConducted ? 'Yes' : 'No'
      );
      await assignObject(
        dataFile.RatingInfo,
        'NumberOfEmployees',
        home.numberOfEmployeesWorkingInHome
      );
      dataFile.RatingInfo.ReplacementCostExtended = {};
      if (
        returnValueIfExists(home.homeFoundationType) ||
        home.homeHasBasement === 'Yes'
      ) {
        dataFile.RatingInfo.ReplacementCostExtended.Foundations = {};
        if (home.homeHasBasement === 'Yes') {
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Foundations,
            'Basement',
            100
          );
          dataFile.RatingInfo.ReplacementCostExtended.Foundations.BasementInformation = {};
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Foundations
              .BasementInformation,
            'BasementFinish',
            home.basementType
          );
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Foundations
              .BasementInformation,
            'BasementTypeInfo',
            home.homeHasBasement === 'Yes'
              ? +home.basementType >= 25
                ? 'Daylight/Walkout'
                : 'Below Grade'
              : null
          );
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Foundations
              .BasementInformation,
            'BasementFinishedType',
            home.homeHasBasement === 'Yes'
              ? home.basementType === '100'
                ? 'Custom'
                : 'Standard'
              : null
          );
        } else {
          const foundation = await returnClosestValue(
            home.homeFoundationType,
            await returnArray('foundations'),
            null
          );
          if (foundation) {
            await assignObject(
              dataFile.RatingInfo.ReplacementCostExtended.Foundations,
              foundation,
              '99'
            );
          }
        }
      }
      await assignObject(
        dataFile.RatingInfo.ReplacementCostExtended,
        'LandUnderFoundationType',
        home.landFoundationType
      );
      if (returnValueIfExists(home.coolType)) {
        dataFile.RatingInfo.ReplacementCostExtended.HeatingAndCoolingType = {};
        await assignObject(
          dataFile.RatingInfo.ReplacementCostExtended.HeatingAndCoolingType,
          'AirConditioning',
          home.coolType
        );
        if (returnValueIfExists(home.numberOfFireplaces)) {
          dataFile.RatingInfo.ReplacementCostExtended.HeatingAndCoolingType.FirePlace = {};
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.HeatingAndCoolingType
              .FirePlace,
            'FirePlace',
            home.fireplaceType
          );
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.HeatingAndCoolingType
              .FirePlace,
            'NumberOfFirePlaces',
            home.numberOfFireplaces
          );
        }
        if (
          returnValueIfExists(home.garageSize) &&
          returnExists(home.garageType)
        ) {
          const garageTypes = [
            'Attached Garage',
            'Detached Garage',
            'Built - In Garage',
            'Basement Garage',
            'Carport',
            'None',
          ];
          dataFile.RatingInfo.ReplacementCostExtended.GaragesAndCarports = {};
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.GaragesAndCarports,
            'GaragesAndCarports',
            await returnClosestValue(home.garageType, garageTypes, null)
          );
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.GaragesAndCarports,
            'NumberOfCars',
            home.garageSize
          );
        }
        if (
          returnValueIfExists(home.numOfBaths) ||
          returnValueIfExists(home.numOfFullBaths) ||
          returnValueIfExists(home.numOfHalfBaths)
        ) {
          dataFile.RatingInfo.ReplacementCostExtended.Baths = {};
          switch (true) {
            case returnValueIfExists(home.numOfBaths):
              const halfBaths = home.numOfBaths % 1;
              const fullBaths = home.numOfBaths - halfBaths;
              await assignObject(
                dataFile.RatingInfo.ReplacementCostExtended.Baths,
                'FullBaths',
                fullBaths
              );
              await assignObject(
                dataFile.RatingInfo.ReplacementCostExtended.Baths,
                'HalfBaths',
                halfBaths
              );
            case returnValueIfExists(home.numOfFullBaths):
              await assignObject(
                dataFile.RatingInfo.ReplacementCostExtended.Baths,
                'FullBaths',
                home.numOfFullBaths
              );
            case returnValueIfExists(home.numOfHalfBaths):
              await assignObject(
                dataFile.RatingInfo.ReplacementCostExtended.Baths,
                'HalfBaths',
                home.numOfHalfBaths
              );
          }
        }
      }
      dataFile.ReplacementCost = {};
      if (home.estimatedReplacementCost) {
        await assignObject(
          dataFile.ReplacementCost,
          'ReplacementCost',
          home.estimatedReplacementCost
        );
      } else if (home.totalSquareFootage && home.costPerSquareFoot) {
        const replacementCost =
          +home.totalSquareFootage * +home.costPerSquareFoot;
        await assignObject(
          dataFile.ReplacementCost,
          'ReplacementCost',
          replacementCost
        );
      }
      if (home.dwellingCoverage) {
        await assignObject(
          dataFile.ReplacementCost,
          'Dwelling',
          home.dwellingCoverage
        );
      } else if (home.totalSquareFootage && home.costPerSquareFoot) {
        const dwellingCoverage =
          +home.totalSquareFootage * +home.costPerSquareFoot;
        await assignObject(
          dataFile.ReplacementCost,
          'Dwelling',
          dwellingCoverage
        );
      }
      await assignObject(
        dataFile.ReplacementCost,
        'LossOfUse',
        home.lossOfUseCoverage
      );
      await assignObject(
        dataFile.ReplacementCost,
        'PersonalProperty',
        home.personalPropertyCoverage
      );
      if (home.personalLiabilityCoverage) {
        const personalLiabilityCoverages = [
          '25000',
          '50000',
          '100000',
          '200000',
          '300000',
          '400000',
          '500000',
        ];
        const bestValue = await returnClosestValue(
          home.personalLiabilityCoverage,
          personalLiabilityCoverages,
          null
        );
        if (bestValue) {
          await assignObject(
            dataFile.ReplacementCost,
            'PersonalLiability',
            bestValue
          );
        }
      }
      if (home.medicalPaymentsCoverage) {
        const medicalPaymentsCoverages = [
          '1000',
          '2000',
          '3000',
          '4000',
          '5000',
        ];
        const bestValue = await returnClosestValue(
          home.medicalPaymentsCoverage,
          medicalPaymentsCoverages,
          null
        );
        if (bestValue) {
          await assignObject(
            dataFile.ReplacementCost,
            'MedicalPayments',
            bestValue
          );
        }
      }
      if (
        home.allPerilsDeductible ||
        home.theftDeductible ||
        home.windDeductible
      ) {
        dataFile.ReplacementCost.DeductibeInfo = {};
        if (home.allPerilsDeductible) {
          const allPerilsDeductibles = [
            '1/2%',
            '1%',
            '100',
            '250',
            '500',
            '750',
            '1000',
            '2000',
            '2500',
            '4000',
            '5000',
          ];
          const bestValue = await returnClosestValue(
            home.allPerilsDeductible,
            allPerilsDeductibles,
            null
          );
          if (bestValue) {
            await assignObject(
              dataFile.ReplacementCost.DeductibeInfo,
              'Deductible',
              bestValue
            );
          }
        }
        if (home.windDeductible) {
          const windDeductibles = [
            '5%',
            '4%',
            '3%',
            '2%',
            '1%',
            '10000',
            '5000',
            '2500',
            '2000',
            '1500',
            '1000',
            '500',
            '250',
            '100',
          ];
          const bestValue = await returnClosestValue(
            home.windDeductible,
            windDeductibles,
            null
          );
          if (bestValue) {
            await assignObject(
              dataFile.ReplacementCost.DeductibeInfo,
              'WindDeductible',
              bestValue
            );
          }
        }
        if (home.theftDeductible) {
          const theftDeductibles = ['500', '1500'];
          const bestValue = await returnClosestValue(
            home.theftDeductible,
            theftDeductibles,
            null
          );
          if (bestValue) {
            await assignObject(
              dataFile.ReplacementCost.DeductibeInfo,
              'TheftDeductible',
              bestValue
            );
          }
        }
      }
      dataFile.ReplacementCost.RatingCredits = {};
      await assignObject(
        dataFile.ReplacementCost.RatingCredits,
        'RetireesCredit',
        home.retireeDiscount
      );
      await assignObject(
        dataFile.ReplacementCost.RatingCredits,
        'MatureDiscount',
        home.matureDiscount
      );
      await assignObject(
        dataFile.ReplacementCost.RatingCredits,
        'RetirementCommunity',
        home.retirementCommunityDiscount
      );
      await assignObject(
        dataFile.ReplacementCost.RatingCredits,
        'LimitedAccessCommunity',
        home.limitedAccessDiscount
      );
      await assignObject(
        dataFile.ReplacementCost.RatingCredits,
        'GatedCommunity',
        home.gatedCommunityDiscount
      );
      await assignObject(
        dataFile.ReplacementCost.RatingCredits,
        'Multipolicy',
        home.hasMultiPolicyDiscount
      );
      await assignObject(
        dataFile.ReplacementCost.RatingCredits,
        'NonSmoker',
        home.nonSmokerDiscount
      );
      dataFile.Endorsements = {};
      if (home.identityTheft == 'Yes') {
        dataFile.Endorsements.IdentityTheft = {};
        await assignObject(
          dataFile.Endorsements.IdentityTheft,
          'IdentityTheft',
          'Yes'
        );
      }
      if (home.lossAssessment) {
        dataFile.Endorsements.LossAssessment = {};
        await assignObject(
          dataFile.Endorsements.LossAssessment,
          'LossAssessment',
          'Yes'
        );
        await assignObject(
          dataFile.Endorsements.LossAssessment,
          'Amount',
          home.lossAssessment
        );
      }
      if (home.ordinanceOrLaw) {
        dataFile.Endorsements.OrdinanceOrLaw = {};
        await assignObject(
          dataFile.Endorsements.OrdinanceOrLaw,
          'OrdinanceOrLaw',
          'Yes'
        );
        await assignObject(
          dataFile.Endorsements.OrdinanceOrLaw,
          'Percent',
          home.ordinanceOrLaw
        );
      }
      if (
        home.hasDeadBoltDiscount ||
        home.hasVisibleToNeighborDiscount ||
        home.hasMannedSecurityDiscount ||
        home.burglarAlarmType ||
        home.sprinklerSystemType ||
        home.fireSystemType ||
        home.hasFireExtinguisher ||
        home.smokeDetectorType
      ) {
        dataFile.Endorsements.ProtectiveDevices = {};
        dataFile.Endorsements.ProtectiveDevices.SmokeDetector = {};
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices.SmokeDetector,
          'BaseProtectionDevice',
          home.smokeDetectorType
        );
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices.SmokeDetector,
          'FireExtinguisher',
          home.hasFireExtinguisher
        );
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices,
          'Fire',
          home.fireSystemType
        );
        dataFile.Endorsements.ProtectiveDevices.BurglarAlarm = {};
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices.BurglarAlarm,
          'BaseProtectionDevice',
          home.burglarAlarmType
        );
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices.BurglarAlarm,
          'DeadBolt',
          home.hasDeadBoltDiscount
        );
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices.BurglarAlarm,
          'VisibleToNeighbor',
          home.hasVisibleToNeighborDiscount
        );
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices.BurglarAlarm,
          'MannedSecurity',
          home.hasMannedSecurityDiscount
        );
        await assignObject(
          dataFile.Endorsements.ProtectiveDevices,
          'Sprinkler',
          home.sprinklerSystemType
        );
      }
      if (home.personalInjuryEndorsement == 'Yes') {
        dataFile.Endorsements.PersonalInjury = {};
        await assignObject(
          dataFile.Endorsements.PersonalInjury,
          'PersonalInjury',
          'Yes'
        );
      }
      if (home.additionalHighEndItems) {
        dataFile.Endorsements.ScheduledPersonalProperty = {};
        await assignObject(
          dataFile.Endorsements.ScheduledPersonalProperty,
          'ScheduledPersonalProperty',
          'Yes'
        );
        if (returnExists(home.fursAmount)) {
          dataFile.Endorsements.ScheduledPersonalProperty.Furs = {};
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.Furs,
            'Amount',
            home.fursAmount
          );
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.Furs,
            'Breakage',
            'Yes'
          );
        }
        if (returnExists(home.fineArtsAmount)) {
          dataFile.Endorsements.ScheduledPersonalProperty.FineArts = {};
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.FineArts,
            'Amount',
            home.fineArtsAmount
          );
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.FineArts,
            'Breakage',
            'Yes'
          );
        }
        if (returnExists(home.gunsAmount)) {
          dataFile.Endorsements.ScheduledPersonalProperty.Guns = {};
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.Guns,
            'Amount',
            home.gunsAmount
          );
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.Guns,
            'Breakage',
            'Yes'
          );
        }
        if (returnExists(home.jewleryAmount)) {
          dataFile.Endorsements.ScheduledPersonalProperty.Jewelry = {};
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.Jewelry,
            'Amount',
            home.jewleryAmount
          );
          await assignObject(
            dataFile.Endorsements.ScheduledPersonalProperty.Jewelry,
            'Breakage',
            'Yes'
          );
        }
      }
    }
    return { status: true, data: dataFile };
  } catch (error) {
    return { status: false, error: error };
  }
}

async function returnClosestValue(value, array, defaultValue) {
  try {
    async function returnValueIfExists(val) {
      if (
        val &&
        val !== 'undefined' &&
        typeof val !== 'undefined' &&
        val !== null
      ) {
        return val;
      }
      return null;
    }
    const returnBestValue = async (arr, val, defaultVal) => {
      try {
        if (returnValueIfExists(val)) {
          const bestValue = val
            ? arr[stringSimilarity.findBestMatch(val, arr).bestMatchIndex]
            : null;
          return bestValue;
        } else if (returnValueIfExists(defaultVal)) {
          return defaultVal;
        } else {
          return val;
        }
      } catch (error) {
        return null;
      }
    };

    const bestValue = await returnBestValue(array, value, defaultValue);

    return bestValue;
  } catch (error) {
    return null;
  }
}

async function returnArray(value) {
  switch (value) {
    case 'autoInsuranceCompanies':
      return [
        'Other Standard',
        'Other Non-Standard',
        'No Prior Insurance',
        '21st Century',
        'A.Central',
        'AAA',
        'AARP',
        'Acadia',
        'Access General',
        'Ace',
        'Acuity',
        'Adirondack Ins Exchange',
        'Aegis',
        'Affirmative',
        'AIC',
        'AIG',
        'Alfa Alliance',
        'Allied',
        'Allstate',
        'America First',
        'American Commerce',
        'American Family',
        'American Freedom Insurance Company',
        'American National',
        'Amerisure',
        'Amica',
        'Anchor General',
        'Arrowhead',
        'ASI Lloyds',
        'Atlantic Mutual',
        'Austin Mutual',
        'Autoone',
        'Auto-Owners',
        'AutoTex',
        'Badger Mutual',
        'Balboa',
        'Bankers',
        'Beacon National',
        'Bear River Mutual',
        'Brethern Mutual',
        'Bristol West',
        'Buckeye',
        'California Casualty',
        'Cameron Mutual',
        'Capital Insurance Group',
        'Celina',
        'Centennial',
        'Central Mutual of OH',
        'Charter',
        'Chubb',
        'Cincinnati',
        'Citizens',
        'CNA',
        'Colonial Penn',
        'Colorado Casualty',
        'Columbia',
        'Commerce West',
        'Constitutional Casualty',
        'Consumers',
        'Cornerstone',
        'Countrywide',
        'Country Insurance',
        'CSE',
        'Cumberland',
        'Dairyland',
        'Deerbrook',
        'Delta Lloyds Insurance Company',
        'Depositors',
        'Direct',
        'Direct General',
        'Discovery',
        'Donegal',
        'Drive',
        'Electric',
        'EMC',
        'Encompass',
        'Erie',
        'Esurance',
        'Eveready',
        'Explorer',
        'Farm Bureau',
        'Farmers',
        'Federated',
        'Fidelity',
        'Financial Indemnity',
        'Firemans Fund',
        'First Acceptance',
        'First American',
        'First Auto',
        'First Chicago',
        'First Connect',
        'Flagship Insurance',
        'Foremost',
        'Founders',
        'Frankenmuth',
        'Fred Loya',
        'Gateway',
        'Geico',
        'General Casualty',
        'Germantown Mutual',
        'GMAC',
        'Grange',
        'Great American',
        'GRE/Go America',
        'Grinnell',
        'Guide One',
        'Hallmark Insurance Company',
        'Hanover',
        'Harbor',
        'Harleysville',
        'Hartford OMNI',
        'Hartford',
        'Hastings Mutual',
        'Hawkeye Security',
        'HDI',
        'Horace Mann',
        'Houston General',
        'IFA',
        'Imperial Casualty',
        'IMT Ins',
        'Indiana Farmers',
        'Indiana',
        'Infinity',
        'Insuremax',
        'Insurequest',
        'Integon',
        'Integrity',
        'Kemper',
        'Kingsway',
        'Liberty Mutual',
        'Liberty Northwest',
        'MAIF',
        'Main Street America',
        'Mapfre',
        'Markel',
        'Maryland Auto Insurance',
        'Mendakota',
        'Mendota',
        'Merchants Group',
        'Mercury',
        'MetLife',
        'Metropolitan',
        'Mid-Continent',
        'Midwestern Indemnity',
        'Montgomery',
        'Motorists Mutual',
        'MSA',
        'Mt. Washington',
        'Mutual Benefit',
        'Mutual of Enumclaw',
        'National Lloyds Insurance Company',
        'Nationwide',
        'National General',
        'New York Central Mutual',
        'NJ Manufacturers',
        'NJ Skylands',
        'Nodak Mutual',
        'Northstar',
        'NYAIP',
        'Occidental',
        'Ocean Harbor',
        'Ohio Casualty',
        'Omaha P/C',
        'Omni Insurance Co',
        'One Beacon',
        'Oregon Mutual',
        'Palisades',
        'Patriot',
        'Patrons Oxford',
        'Peerless/Montgomery',
        'Pekin',
        'Pemco',
        'Penn National',
        'Phoenix Indemnity',
        'Plymouth Rock',
        'Preferred Mutual',
        'Proformance',
        'Progressive',
        'Prudential',
        'Republic',
        'Response',
        'Rockford Mutual',
        'Royal and Sun Alliance',
        'Safeco',
        'Safe Auto',
        'Safeway',
        'Sagamore',
        'SECURA',
        'Selective',
        'Sentry Ins',
        'Shelter Insurance',
        'Southern County',
        'Southern Mutual',
        'Southern Trust',
        'St. Paul/Travelers',
        'Standard Mutual',
        'Star Casualty',
        'State Auto',
        'State Farm',
        'StillWater',
        'Stonegate',
        'Titan',
        'Topa',
        'Tower',
        'Travelers',
        'TWFG',
        'Unigard',
        'United Automobile',
        'United Fire and Casualty',
        'Unitrin',
        'Universal',
        'USAA',
        'Utica National',
        'Victoria',
        'West Bend',
        'Western National',
        'Western Reserve Group',
        'Westfield',
        'White Mountains',
        'Wilshire',
        'Wilson Mutual',
        'Wisconsin Mutual',
        'Windsor',
        'Wind Haven',
        'Zurich',
      ];
    case 'homeInsuranceCompanies':
      return [
        'Other Standard',
        'Other Non-Standard',
        'No Prior Insurance',
        '21st Century',
        'AAA',
        'AAANCNU',
        'AARP',
        'Acuity',
        'Adirondack Ins Exchange',
        'Aegis',
        'AIG',
        'Alfa Alliance',
        'Allianz of America',
        'Allianz of America-Jefferson',
        'Allied',
        'Allied Trust',
        'Allmerica',
        'Allstate',
        'America First',
        'American Commerce',
        'American Family',
        'American Freedom Insurance Company',
        'American Traditions',
        'Amica',
        'Anchor Insurance',
        'ASI Lloyds',
        'Atlantic Mutual',
        'Atlas General Agency',
        'Austin Mutual',
        'Auto-Owners',
        'Badger Mutual',
        'Balboa',
        'Bankers',
        'Beacon National',
        'Bear River Mutual',
        'Bunker Hill',
        'California Casualty',
        'Capital Insurance Group',
        'Capitol Preferred',
        'Central Mutual of OH',
        'Celina',
        'Centauri',
        'Chubb',
        'Cincinnati',
        'Citizens',
        'CNA',
        'Colorado Casualty',
        'CSE',
        'Cumberland',
        'Cypress',
        'Dairyland',
        'Delta Lloyds Insurance Company',
        'Donegal',
        'Electric',
        'EMC',
        'Encompass',
        'Erie',
        'Esurance',
        'Excelsior Insurance Company',
        'Fair Plan',
        'Farm Bureau',
        'Farmers',
        'Flagship Insurance',
        'Fidelity',
        'Firemans Fund',
        'First American',
        'Florida Family',
        'Florida Peninsula',
        'Geico',
        'General Casualty',
        'Germantown Mutual',
        'GMAC',
        'Goodville Mutual',
        'Grange',
        'Great American',
        'GRE/Go America',
        'Grinnell',
        'Guide One',
        'GulfStream',
        'Hallmark Insurance Company',
        'Hanover',
        'Harleysville',
        'Hartford',
        'Hartford OMNI',
        'Hawkeye Security',
        'Heritage P/C',
        'Homeowners of America',
        'Horace Mann',
        'Houston General',
        'Integon',
        'Indiana',
        'Indiana Farmers',
        'Integrity',
        'Kemper',
        'Liberty Mutual',
        'Liberty Northwest',
        'LightHouse',
        'Lloyds',
        'Main Street America',
        'Merchants Group',
        'Mercury',
        'MetLife',
        'Midwestern Indemnity',
        'Modern USA',
        'Montgomery',
        'Motorists Mutual',
        'MSA',
        'Mutual Benefit',
        'Mutual of Enumclaw',
        'National Lloyds Insurance Company',
        'Nationwide',
        'Nationwide-Scottsdale',
        'New York Central Mutual',
        'NJ Skylands',
        'Northstar',
        'Ohio Casualty',
        'Omaha P/C',
        'One Beacon',
        'Oregon Mutual',
        'Peerless/Montgomery',
        'Pekin',
        'Penn National',
        'Plymouth Rock',
        'Preferred Mutual',
        'Progressive',
        'Prudential',
        'Republic',
        'Royal and Sun Alliance',
        'Safeco',
        'SECURA',
        'Selective',
        'Shelter Insurance',
        'Southern Fidelity',
        'Southern Fidelity P/C',
        'Southern Mutual',
        'Southern Trust',
        'St. Johns',
        'St. Paul/Travelers',
        'Standard Mutual',
        'State Auto',
        'State Farm',
        'Titan',
        'Tower',
        'Towerhill',
        'Travelers',
        'TWFG',
        'Unigard',
        'United Fire and Casualty',
        'Unitrin',
        'Universal',
        'UPCIC',
        'USAA',
        'Utica National',
        'Vermont Mutual',
        'Wellington Select',
        'Wellington Standard',
        'West Bend',
        'Western National',
        'Western Reserve Group',
        'Westfield',
        'White Mountains',
        'Wilson Mutual',
        'Windsor',
        'Zurich',
      ];
    case 'occupations':
      return [
        'Homemaker/Houseprsn',
        'Retired',
        'Disabled',
        'Unemployed',
        'Student',
        'Agriclt/Forestry/Fish',
        'Art/Design/Media',
        'Banking/Finance/RE',
        'Business/Sales/Offi',
        'Construct/EnrgyTrds',
        'Education/Library',
        'Engr/Archt/Sci/Math',
        'Government/Military',
        'Info Tech',
        'Insurance',
        'Lgl/Law Enfcmt/Sec',
        'Maint/Rpr/Hsekeep',
        'Mfg/Production',
        'Med/Soc Svcs/Relig',
        'Person.Care/Service',
        'Sports/Recreation',
        'Other',
      ];
    case 'poolTypes':
      return [
        'Above Ground with Slide',
        'Above Ground without Slide',
        'In Ground with Slide',
        'In Ground without Slide',
      ];
    case 'foundations':
      return ['Slab', 'Crawlspace', 'PiersOrPile', 'SuspendedOverHillside'];
    case 'education':
      return [
        'No High School Diploma',
        'High School Diploma',
        'Some College - No Degree',
        'Vocational/Technical Degree',
        'Associates Degree',
        'Bachelors',
        'Masters',
        'Phd',
        'Medical Degree',
        'Law Degree',
      ];
    case 'lengthAtAddress':
      return [
        '6 months or less',
        '6-12 months',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'More than 10',
      ];
    case 'bodilyInjuryCoverage':
      return [
        'State Minimum',
        '10/20',
        '12/25',
        '12.5/25',
        '15/30',
        '20/40',
        '20/50',
        '25/25',
        '25/50',
        '25/65',
        '30/60',
        '50/50',
        '50/100',
        '100/100',
        '100/300',
        '200/600',
        '250/500',
        '300/300',
        '500/500',
        '500/1000',
        '1000/1000',
        '35 CSL',
        '50 CSL',
        '55 CSL',
        '100 CSL',
        '115 CSL',
        '300 CSL',
        '500 CSL',
        '1000 CSL',
      ];
    case 'priorLiabilityLimit':
      return [
        'State Minimum',
        '10/20',
        '12/25',
        '15/30',
        '25/25',
        '25/50',
        '50/50',
        '50/100',
        '100/100',
        '100/300',
        '250/500',
        '300/300',
        '500/500',
        '1000/1000',
        '55CSL',
        '100CSL',
        '300CSL',
        '500CSL',
        'None',
      ];
    case 'homeownership':
      return [
        'Home (owned)',
        'Condo (owned)',
        'Apartment',
        'Rental Home/Condo',
        'Mobile Home',
        'Live With Parents',
        'Other',
      ];
    case 'roadsideCoverage':
      return ['No Coverage', '25', '40', '50', '75', '80', '100', '120', '200'];
    case 'collisionDeductible':
      return [
        'No Coverage',
        '0',
        '50',
        '100',
        '200',
        '250',
        '300',
        '500',
        '750',
        '1000',
        '1500',
        '2000',
        '2500',
      ];
    case 'rentalDeductible':
      return [
        'No Coverage',
        '15/450',
        '20/600',
        '25/750',
        '30/900',
        '35/1050',
        '40/1200',
        '45/1350',
        '50/1500',
        '75/2250',
        '100/3000',
      ];
    case 'roofType':
      return [
        'ARCHITECTURAL SHINGLES',
        'ASBESTOS',
        'ASPHALT SHINGLES',
        'COMPOSITION',
        'COPPER(FLAT)',
        'COPPER(PITCHED)',
        'CORRUGATED STEEL(FLAT)',
        'CORRUGATED STEEL(PITCHED)',
        'FIBERGLASS',
        'FOAM',
        'GRAVEL',
        'METAL(FLAT)',
        'METAL(PITCHED)',
        'MINERAL FIBER SHAKE',
        'OTHER',
        'PLASTIC(FLAT)',
        'PLASTIC(PITCHED)',
        'ROCK',
        'ROLLED PAPER(FLAT)',
        'ROLLED PAPER(PITCHED)',
        'RUBBER FLAT',
        'RUBBER(PITCHED)',
        'SLATE',
        'TAR',
        'TAR and GRAVEL',
        'TILE(CLAY)',
        'TILE(CONCRETE)',
        'TILE(SPANISH)',
        'TIN(FLAT)',
        'TIN(PITCHED)',
        'WOOD FIBERGLASS SHINGLES',
        'WOOD SHAKE',
        'WOOD SHINGLES',
      ];
    case 'structureType':
      return [
        'Apartment',
        'Backsplit',
        'Bi-Level',
        'Bi-Level/Row Center',
        'Bi-Level/Row End',
        'Bungalow',
        'Cape Cod',
        'Colonial',
        'Condo',
        'Coop',
        'Contemporary',
        'Cottage',
        'Dwelling',
        'Federal Colonial',
        'Mediterranean',
        'Ornate Victorian',
        'Queen Anne',
        'Raised Ranch',
        'Rambler',
        'Ranch',
        'Rowhouse',
        'Rowhouse Center',
        'Rowhouse End',
        'Southwest Adobe',
        'Split Foyer',
        'Split Level',
        'Substandard',
        'Townhouse',
        'Townhouse Center',
        'Townhouse End',
        'Tri-Level',
        'Tri-Level Center',
        'Victorian',
      ];
    case 'constructionType':
      return [
        'Adobe',
        'Aluminum/Vinyl',
        'Barn Plank',
        'Brick',
        'Brick on Block',
        'Brick on Block, Custom',
        'Brick Veneer',
        'Brick Veneer, Custom',
        'Cement Fiber Shingles',
        'Clapboard',
        'Concrete Decorative Block, Painted',
        'Exterior Insulation and Finish System (EIFS)',
        'Fire Resistant',
        'Frame',
        'Logs',
        'Poured Concrete',
        'Siding, Aluminum',
        'Siding, Hardboard',
        'Siding, Plywood',
        'Siding, Steel',
        'Siding, T-111',
        'Siding, Vinyl',
        'Siding, Wood',
        'Slump Block',
        'Solid Brick',
        'Solid Brick, Custom',
        'Solid Brownstone',
        'Solid Stone',
        'Solid Stone, Custom',
        'Stone on Block',
        'Stone on Block, Custom Stone',
        'Stone Veneer',
        'Stone Veneer, Custom',
        'Stucco',
        'Stucco on Block',
        'Stucco on Frame',
        'Victorian Scalloped Shakes',
        'Window Wall',
        'Wood Shakes',
      ];
    case 'dwellingType':
      return ['One Family', 'Two Family', 'Three Family', 'Four Family'];
    case 'heatType':
      return [
        'Electric',
        'Gas',
        'Gas - Forced Air',
        'Gas - Hot Water',
        'Oil',
        'Oil - Forced Air',
        'Oil - Hot Water',
        'Other',
        'Solid Fuel',
      ];
    case 'foundationType':
      return [
        'Basement',
        'Closed',
        'Concrete Slab',
        'Concrete Stilts/Pilings',
        'Crawlspace',
        'Crawlspace/Foundations and Piers &gt; 6&apos; elevations',
        'Crawlspace/Enclosed Piers up to 6&apos; elevations',
        'Deep Pilings',
        'Elevated Post/Pier&amp;Beam',
        'Open',
        'Open-Enclosed with Lattice',
        'Open Foundations/Open Piers &gt; 6&apos; elevations',
        'Open Foundations/Open Piers up to 6&apos; elevations',
        'Pier&amp;Grade Beam',
        'Pilings-Other',
        'Pilings-Wood',
        'Pilings/Stilts of Reinforced Masonry Construction',
        'Shallow Basement',
        'Slab',
        'Stilts/Pilings 8&apos;-10&apos; elevations',
        'Stilts/Pilings other',
        'Stilts with Sweep Away Walls',
        'Wood Stilts/Pilings',
      ];
    case 'pipType':
      return [
        'No Coverage',
        '2500',
        '5000',
        '10000',
        '25000',
        '50000',
        '100000',
      ];
    case 'homePrimaryUse':
      return [
        'Primary',
        'Secondary',
        'Seasonal',
        'Farm',
        'Unoccupied',
        'Vacant',
        'COC',
      ];
  }
}

async function returnOccupation(value) {
  const staticOccs = [
    'Homemaker/Houseprsn',
    'Retired',
    'Disabled',
    'Unemployed',
  ];
  if (staticOccs.includes(value)) {
    return value;
  } else {
    return 'Other';
  }
}

async function returnInsured(client) {
  try {
    async function returnValue(client, cKey, dKey) {
      if (client[cKey]) {
        return client[cKey];
      } else if (
        client &&
        client.drivers &&
        client.drivers[0] &&
        client.drivers[0][dKey]
      ) {
        return client.drivers[0][dKey];
      } else {
        return null;
      }
    }
    const insured = {
      firstName: null,
      lastName: null,
      birthday: null,
      gender: null,
      maritalStatus: null,
      industry: null,
      education: null,
    };
    insured.firstName = await returnValue(
      client,
      'firstName',
      'applicantGivenName'
    );
    insured.lastName = await returnValue(
      client,
      'lastName',
      'applicantSurname'
    );
    insured.birthday = await returnValue(
      client,
      'birthDate',
      'applicantBirthDt'
    );
    insured.gender = await returnValue(client, 'gender', 'applicantGenderCd');
    insured.maritalStatus = await returnValue(
      client,
      'maritalStatus',
      'applicantMaritalStatusCd'
    );
    insured.industry = await returnValue(
      client,
      'occupation',
      'applicantOccupationClassCd'
    );
    insured.education = await returnValue(
      client,
      'educationLevel',
      'educationLevel'
    );
    return insured;
  } catch (error) {
    return {
      firstName: null,
      lastName: null,
      birthday: null,
      gender: null,
      maritalStatus: null,
      industry: null,
      education: null,
    };
  }
}

async function returnEZLynxVehicle(vehicleYear, vehicleMake, vehicleModel) {
  async function getList(type, body) {
    const xml_authentication_header = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">  <soap:Header><AuthenticationHeader  xmlns="http://www.ezlynx.com/"> <Username>${ezLynx.USERNAME}</Username>  <Password>${ezLynx.PASSWORD}</Password><Function></Function><TimeOutMilliSec>30000</TimeOutMilliSec></AuthenticationHeader> </soap:Header>`;
    const xml_soap_body_opens = `<soap:Body><${type} xmlns="http://www.ezlynx.com/">${body}</${type}>`;
    const xml_soap_body_close = '</soap:Body></soap:Envelope>';
    const xml_body_center = '';
    const xml_string = xml_authentication_header.concat(
      xml_soap_body_opens,
      xml_body_center,
      xml_soap_body_close
    );
    const action =
      type === 'getAutoMakes'
        ? 'GET_AUTO_MAKES_ACTION'
        : type === 'getAutoModels'
        ? 'GET_AUTO_MODELS_ACTION'
        : '';

    const options = {
      method: 'POST',
      url: ezLynx.GET_VEHICLES_PATH,
      qs: { WSDL: '' },
      headers: {
        SOAPAction: ezLynx[action],
        'Content-Type': 'text/xml',
      },
      body: xml_string,
    };

    const response = await request(options);

    let json = {};

    await parser(response, async (err, result) => {
      if (err) {
        throw new HttpException('Error parsing makes', HttpStatus.BAD_REQUEST);
      }
      json = result;
    });

    const array =
      json['soap:Envelope']['soap:Body'][0][`${type}Response`][0][
        `${type}Result`
      ][0].string;

    return array;
  }

  const year = vehicleYear;
  const make = vehicleMake
    ? await returnClosestValue(
        vehicleMake.toUpperCase(),
        await getList('getAutoMakes', `<Year>${year}</Year>`),
        null
      )
    : null;
  const model = vehicleModel
    ? await returnClosestValue(
        vehicleModel.toUpperCase(),
        await getList(
          'getAutoModels',
          `<Year>${year}</Year><Make>${make}</Make>`
        ),
        null
      )
    : null;
  let vin = null;
  if (model) {
    const subModels = await getList(
      'getAutoSubModels',
      `<Year>${year}</Year><Make>${make}</Make><Model>${model}</Model>`
    );
    if (subModels[0]) {
      vin = subModels[0].split(' |')[1];
    }
  }

  const data = {
    year: year,
    make: make,
    model: model,
    vin: vin,
  };

  return data;
}

async function returnSSN(client, type, index) {
  try {
    if (type === 'client' && client.ssn === 'Answered') {
      return encryptor.decrypt(client.ssnHash);
    } else if (
      index &&
      client.drivers &&
      client.drivers[index] &&
      client.drivers[index].ssnU === 'Answered'
    ) {
      return encryptor.decrypt(client.drivers[index].ssnUHash);
    }

    return null;
  } catch (error) {
    return null;
  }
}
