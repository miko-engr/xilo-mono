import { formatDate } from '../../../helpers/date.helper';
export async function returnAutoData(client) {
  const dataObj = {};
  async function assignObject(value, label) {
    if (value && typeof value != 'undefined') {
      dataObj[label] = value;
    }
    return null;
  }
  await assignObject('AUTOP', 'TransactionLineOfBusiness');
  await assignObject('NewBusiness', 'TransactionType');
  await assignObject(client.firstName, 'CustomerFirstName');
  await assignObject(client.lastName, 'CustomerLastName');
  await assignObject(
    client.firstName && client.lastName
      ? `${client.firstName} ${client.lastName}`
      : null,
    'CustomerFullName'
  );
  await assignObject(
    client.streetName && client.streetNumber
      ? `${client.streetNumber} ${client.streetName}`
      : null,
    'CustomerAddress1'
  );
  await assignObject(client.unitNumber, 'CustomerAddress2');
  await assignObject(client.city, 'CustomerCity');
  await assignObject(client.stateCd, 'CustomerState');
  await assignObject(client.postalCd, 'CustomerZipCode');
  await assignObject(client.phone, 'CustomerHomePhone');
  await assignObject(client.email, 'CustomerEmailAddress1');

  await assignObject(formatDate(client.effectiveDate), 'PolicyEffectiveDate');
  if (client.hasOwnProperty('drivers') && client.drivers.length > 0) {
    for (const j in client.drivers) {
      const driver = client.drivers[j];
      const index = +j + 1;
      await assignObject(driver.applicantGivenName, `DriverFirstName${index}`);
      await assignObject(driver.applicantSurname, `DriverLastName${index}`);
      await assignObject(driver.applicantGenderCd, `DriverSex${index}`);
      await assignObject(
        driver.applicantMaritalStatusCd,
        `DriverMaritalStatus${index}`
      );
      await assignObject(driver.relationship, `DriverRelationship${index}`);
      await assignObject(
        driver.applicantOccupationClassCd,
        `DriverOccupation${index}`
      );
      await assignObject(
        driver.driverLicenseStateCd,
        `DriverLicenseState${index}`
      );
      await assignObject(
        driver.driverLicenseNumber,
        `DriverLicenseNumber${index}`
      );
      await assignObject(
        formatDate(driver.applicantBirthDt),
        `DriverDOB${index}`
      );
    }
  }

  if (client.hasOwnProperty('vehicles') && client.vehicles.length > 0) {
    for (const j in client.vehicles) {
      const vehicle = client.vehicles[j];
      const index = +j + 1;
      await assignObject(vehicle.vehicleModelYear, `VehicleYear${index}`);
      await assignObject(vehicle.vehicleManufacturer, `VehicleMake${index}`);
      await assignObject(vehicle.vehicleModel, `VehicleModel${index}`);
      await assignObject(vehicle.vehicleBodyStyle, `VehicleBody${index}`);
      await assignObject(vehicle.vehicleVin, `VehicleVIN${index}`);
    }
  }

  const newDataObj = [dataObj];

  return newDataObj;
}
export async function returnHomeData(client) {
  const dataObj = {};
  async function assignObject(value, label) {
    if (value && typeof value != 'undefined') {
      dataObj[label] = value;
    }
    return null;
  }
  await assignObject('HOME', 'TransactionLineOfBusiness');
  await assignObject('NewBusiness', 'TransactionType');
  await assignObject(client.firstName, 'CustomerFirstName');
  await assignObject(client.lastName, 'CustomerLastName');
  await assignObject(
    client.firstName && client.lastName
      ? `${client.firstName} ${client.lastName}`
      : null,
    'CustomerFullName'
  );
  const streetAddress = client.streetAddress
    ? client.streetAddress
    : client.streetName && client.streetNumber
    ? `${client.streetName} ${client.streetNumber}`
    : null;
  await assignObject(streetAddress, 'CustomerAddress1');
  await assignObject(client.unitNumber, 'CustomerAddress2');
  await assignObject(client.city, 'CustomerCity');
  await assignObject(client.stateCd, 'CustomerState');
  await assignObject(client.postalCd, 'CustomerZipCode');
  await assignObject(client.phone, 'CustomerHomePhone');
  await assignObject(client.email, 'CustomerEmailAddress1');

  await assignObject('12', 'PolicyTerm');
  await assignObject('3', 'HomeOwnerPolicyTypeCode'); //TODO Make dynamic
  await assignObject('1', 'HomeOwnerConstructionTypeCode'); // TODO Make dynamic
  // await assignObject('12 months after Eff Date', 'PolicyTerm'); //TODO
  await assignObject(formatDate(client.effectiveDate), 'PolicyEffectiveDate');
  const home = client.homes[0];
  await assignObject(home.yearBuilt, 'HomeOwnerYearBuilt');
  await assignObject(home.numberOfBedrooms, 'HomeOwnerNumberOfRooms');
  await assignObject('DW', 'HomeOwnerResidenceTypeCode'); //TODO Make dynamic
  await assignObject('1', 'HomeOwnerProtectionClassGrade'); //TODO Make dynamic
  // await assignObject(home.distanceFromFireHydrant, 'HomeOwnerHydrantDistance'); // TODO Fix form for 2 digits
  await assignObject(
    home.distanceFromFireStation,
    'HomeOwnerFireStationDistance'
  );
  await assignObject(
    home.hasPools ? home.hasPools.charAt(0) : null,
    'HomeOwnerSwimmingPoolCode'
  );
  await assignObject('A', 'HomeOwnerPrimaryHeatSourceCode'); // TODO Make dynamic
  await assignObject('A', 'HomeOwnerRoofTypeCode'); // TODO Make dynamic
  await assignObject(formatDate(home.purchaseDate), 'HomeOwnerPurchaseDate');
  await assignObject(
    home.primaryUse ? home.primaryUse.charAt(0) : null,
    'HomeOwnerOccupancyTypeCode'
  );

  const newDataObj = [dataObj];

  return newDataObj;
}
export async function returnCommercialData(client) {
  const dataObj = {};
  dataObj['gen_bBusinessType'] = client.business.entityType;
  dataObj['gen_sCustType'] = 'Commercial';
  dataObj['gen_sBusinessName'] = client.business.entityName;
  dataObj['gen_sDBAName'] = client.business.dba;
  // dataObj['gen_sBusinessLicense'] = '';
  dataObj['gen_sWebsite'] = client.business.website;
  dataObj['gen_lClientOffice'] = client.phone;
  // dataObj['gen_sPolicyType'] = 'XXXXX';
  dataObj['gen_sACORDTypeCode'] = 'BOP';
  dataObj['gen_sLastName'] = client.lastName;
  dataObj['gen_sFirstName'] = client.firstName;
  dataObj['gen_sAddress1'] =
    client.streetNumber && client.streetName
      ? `${client.streetNumber} ${client.streetName}`
      : null;
  dataObj['gen_sCity'] = client.city;
  dataObj['gen_sState'] = client.stateCd;
  dataObj['gen_sZip'] = client.postalCd;
  dataObj['gen_sClientSource'] = 'XILO';
  // dataObj['gen_sPhone'] = client.phone;
  // dataObj['gen_sWorkPhone'] = client.phone;
  dataObj['gen_sCellPhone'] = client.phone;
  // dataObj['gen_sMsgPhone'] = client.phone;
  dataObj['gen_sEmail'] = client.email;
  dataObj['gen_sCMSPolicyType'] = 'ENHANCED';
  dataObj['gen_tProductionDate'] = formatDate(new Date());
  dataObj['gen_sLeadSource'] = 'XILO';
  dataObj['gen_nClientStatus'] = 'New Client';
  dataObj['gen_sStatus'] = 'New';
  // dataObj['gen_sFSCNotes'] ='XXXXX';
  dataObj['gen_sGAddress'] =
    client.streetNumber && client.streetName
      ? `${client.streetNumber} ${client.streetName}`
      : null;
  dataObj['gen_sGCity'] = client.city;
  dataObj['gen_sGState'] = client.stateCd;
  dataObj['gen_sGZip'] = client.postalCd;
  dataObj['gen_sTypeOfPolicy'] = 'Regular';
  // dataObj['gen_sLOBCode'] = 'XXXXX';
  dataObj['gen_sCompany'] = client.business.entityName;

  return dataObj;
}
