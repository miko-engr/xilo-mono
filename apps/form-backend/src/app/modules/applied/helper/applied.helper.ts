import { formatDateYear, formatDateMonth, formatDateDay } from '../../../helpers/date.helper';
import { formatAge } from '../../../helpers/date.helper';

export async function returnData(client) {
  const dataObj = {};
  const home = client.homes[0];
  function returnExists(key) {
    return typeof key !== 'undefined' && key && key !== null;
  }
  function assignObject(hsKey, xiloKey) {
    if (returnExists(xiloKey)) {
      dataObj[hsKey] = xiloKey;
    }
  }

  function firstObject(array, key) {
    return array && array.length > 0 ? array[0][key] : null;
  }

  function firstChar(value) {
    return value ? value.charAt(0) : null;
  }

  assignObject('ApplicantGivenName', client.firstName);
  assignObject('ApplicantLastName', client.lastName);
  assignObject(
    'ApplicantDLState',
    firstObject(client.drivers, 'driverLicenseStateCd')
  );
  assignObject(
    'ApplicantAgeFirstLicensed',
    firstObject(client.drivers, 'drivingExperience')
  );
  assignObject(
    'ApplicantRelationship',
    firstObject(client.drivers, 'relationship')
  );
  assignObject('ApplicantSR22', firstObject(client.drivers, 'sr22Needed'));
  assignObject('DefaultPhoneNumber', client.phone);
  assignObject('InsuranceType', 'AUTO');
  assignObject('HomeRatingState', client.stateCd);
  assignObject('FireSprinkler', home ? home.hasSprinklerSystem : null);
  assignObject('ConstructionType', home ? home.homeType : null);
  assignObject('RoofType', home ? home.roofType : null);
  assignObject('StructureType', home ? home.structureType : null);
  assignObject('UnitStory', home ? home.numOfStories : null);
  assignObject('BusinessOnPremise', home ? home.hasBusiness : null);
  assignObject('HeatSystem', home ? home.heatType : null);
  assignObject('SmokeAlarm', home ? home.hasSmokeDetector : null);
  assignObject(
    'FireHydrantDistance',
    home ? home.distanceFromFireHydrant : null
  );
  assignObject(
    'FireStationDistance',
    home ? home.distanceFromFireStation : null
  );
  assignObject('SwimmingPool', home ? home.hasPools : null);
  assignObject('SwimmingPoolFenced', home ? home.poolHasFence : null);
  assignObject('DogsAtHome', home ? home.petType : null);
  assignObject('DogsBitten', home ? home.petBreed : null);
  assignObject('RatingState', client.stateCd);
  assignObject(
    `ApplicantBirthDtYear`,
    formatDateYear(firstObject(client.drivers, 'applicantBirthDt'))
  );
  assignObject(
    `ApplicantBirthDtMonth`,
    formatDateMonth(firstObject(client.drivers, 'applicantBirthDt'))
  );
  assignObject(
    `ApplicantBirthDtDay`,
    formatDateDay(firstObject(client.drivers, 'applicantBirthDt'))
  );
  assignObject(
    `ApplicantDateLicensedMonthh`,
    formatDateMonth(firstObject(client.drivers, 'driverLicensedDt'))
  );
  assignObject(
    `ApplicantDateLicensedDay`,
    formatDateDay(firstObject(client.drivers, 'driverLicensedDt'))
  );
  assignObject(
    `ApplicantDateLicensedYear`,
    formatDateYear(firstObject(client.drivers, 'driverLicensedDt'))
  );
  assignObject(`ApplicantAge`, formatAge(client.birthDate));
  assignObject('ApplicantMaritalStatus', firstChar(client.maritalStatus));
  assignObject('ApplicantOccupation', client.occupation);
  assignObject('ApplicantGender', firstChar(client.gender));
  assignObject('CustomerPhoneNumber', client.phone);
  assignObject('CustomerEmail', client.email);
  assignObject('RoofShape', home ? home.roofShape : null);
  assignObject('NumStories', home ? home.NumOfStories : null);
  assignObject('TotalSqFt', home ? home.totalSquareFootage : null);
  assignObject('WiringYear', home ? home.yearsSinceWiringUpdate : null);
  assignObject('PlumbingYear', home ? home.plumbingUpdateYear : null);
  assignObject('HeatingYear', home ? home.heatingUpdateYear : null);
  assignObject('RoofingYear', home ? home.roofOfUpdateYear : null);
  assignObject('DogBreed', home ? home.petBreed : null);
  assignObject('BasementType', home ? home.basementType : null);
  assignObject('BasementFinished', home ? home.hasFinishedBasement : null);
  assignObject('BasementFinishType', home ? home.basementDescription : null);
  const copApplicantAdded = false;
  if (client.hasOwnProperty('drivers') && client.drivers.length > 0) {
    for (const j in client.drivers) {
      const driver = client.drivers[j];
      if (!copApplicantAdded) {
        if (+j === 2) {
          assignObject(`CoApplicantAgeFirstLicensed`, driver.drivingExperience);
          assignObject('CoApplicantDLState', driver.driverLicenseStateCd);
          assignObject(`CoApplicantSR22`, driver.needsSR22);
          assignObject('CoApplicantGivenName', driver.applicantGivenName);
          assignObject(`CoApplicantGivenName`, driver.applicantSurname);
          assignObject(`CoApplicantRelationship`, driver.relationship);
          assignObject(
            `CoApplicantBirthDtYear`,
            formatDateYear(driver.applicantBirthDt)
          );
          assignObject(
            `CoApplicantBirthDtMonth`,
            formatDateMonth(driver.applicantBirthDt)
          );
          assignObject(
            `CoApplicantBirthDtDay`,
            formatDateDay(driver.applicantBirthDt)
          );
          assignObject(
            `CoApplicantDateLicensedMonth`,
            formatDateMonth(driver.driverLicensedDt)
          );
          assignObject(
            `CoApplicantDateLicensedDay`,
            formatDateDay(driver.driverLicensedDt)
          );
          assignObject(
            `CoApplicantDateLicensedYear`,
            formatDateYear(driver.driverLicensedDt)
          );
          assignObject(
            `CoApplicantAge`,
            formatAge(driver.applicantBirthDt)
          );
          assignObject(
            `CoApplicantMaritalStatus`,
            firstChar(driver.applicantMaritalStatusCd)
          );
          assignObject(
            `CoApplicantGender`,
            firstChar(driver.applicantGenderCd)
          );
          assignObject(
            `CoApplicantOccupation`,
            driver.applicantOccupationClassCd
          );
          assignObject(`CoApplicantEducation`, driver.educationLevel);
        }
      }
      const i = parseInt(j) + 1;
      assignObject(`Driver${i}Relationship`, driver.relationship);
      assignObject(`Driver${i}GivenName`, driver.applicantGivenName);
      assignObject(`Driver${i}LastName`, driver.applicantSurname);
      assignObject(`Driver${i}DLState`, driver.driverLicenseStateCd);
      assignObject(`Driver${i}AgeFirstLicensed`, driver.drivingExperience);
      assignObject(`Driver${i}SR22`, driver.needsSR22);
      assignObject(
        `Driver${i}BirthDtYear`,
        formatDateYear(driver.applicantBirthDt)
      );
      assignObject(
        `Driver${i}BirthDtMonth`,
        formatDateMonth(driver.applicantBirthDt)
      );
      assignObject(
        `Driver${i}BirthDtDay`,
        formatDateDay(driver.applicantBirthDt)
      );
      assignObject(
        `Driver${i}DateLicensedMonth`,
        formatDateMonth(driver.driverLicensedDt)
      );
      assignObject(
        `Driver${i}DateLicensedDay`,
        formatDateDay(driver.driverLicensedDt)
      );
      assignObject(
        `Driver${i}DateLicensedYear`,
        formatDateYear(driver.driverLicensedDt)
      );
      assignObject(
        `Driver${i}Age`,
        formatAge(driver.applicantBirthDt)
      );
      assignObject(
        `Driver${i}MaritalStatus`,
        firstChar(driver.applicantMaritalStatusCd)
      );
      assignObject(`Driver${i}Occupation`, driver.applicantOccupationClassCd);
      assignObject(`Driver${i}Gender`, firstChar(driver.applicantGenderCd));
      assignObject(`Driver${i}DL`, driver.driverLicenseNumber);
      assignObject(`Driver${i}Education`, driver.educationLevel);
      assignObject(`Driver${i}GoodStudent`, driver.hasGoodStudentDiscount);
    }
  }

  if (client.hasOwnProperty('vehicles') && client.vehicles.length > 0) {
    for (const j in client.vehicles) {
      const vehicle = client.vehicles[j];
      const i = parseInt(j) + 1;
      assignObject(`Vehicle${i}RegisteredState`, vehicle.applicantStateCd);
      assignObject(`Vehicle${i}Collision`, vehicle.collision);
      assignObject(`Vehicle${i}CustomEquip`, vehicle.additionalEquipment);
      assignObject(`Vehicle${i}FullGlass`, vehicle.fullGlassCoverage);
      assignObject(`Vehicle${i}BodyType`, vehicle.vehicleBodyStyle);
      assignObject(`Vehicle${i}Year`, vehicle.vehicleModelYear);
      assignObject(`Vehicle${i}Manufacturer`, vehicle.vehicleManufacturer);
      assignObject(`Vehicle${i}Model`, vehicle.vehicleModel);
      assignObject(`Vehicle${i}VIN`, vehicle.vehicleVin);
      assignObject(`Vehicle${i}Use`, vehicle.vehicleUseCd);
      assignObject(`Vehicle${i}Ridesharing`, vehicle.hasRideShare);
      assignObject(`Vehicle${i}DistanceOneWay`, vehicle.vehicleAnnualDistance);
      assignObject(
        `Vehicle${i}EstAnnualDistance`,
        vehicle.vehicleAnnualDistance
      );
      assignObject(`Vehicle${i}OwnershipStatus`, vehicle.ownOrLeaseVehicle);
      assignObject(`Vehicle${i}AntiLockBrakes`, vehicle.antiLockBrakes);
      assignObject(`Vehicle${i}AntiTheftDevice`, vehicle.hasAntiTheftDevice);
    }
  }

  assignObject('CurrentAddressHouseNumber', client.streetNumber);
  assignObject('CurrentAddressStreetName', client.streetName);
  assignObject('CurrentAddressUnitType', client.unitNumber ? 'Unit' : null);
  assignObject('CurrentAddressUnitNumber', client.unitNumber);
  assignObject('CurrentAddressCity', client.city);
  assignObject('CurrentAddressState', client.stateCd);
  assignObject('CurrentAddressPostalCode', client.postalCd);

  return dataObj;
}
