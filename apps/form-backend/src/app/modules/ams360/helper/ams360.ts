import { formatDate } from '../../../helpers/date.helper';
import * as stringSimilarity from 'string-similarity';

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

async function returnInsured(client) {
  try {
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

async function returnClosestValue(value, array, defaultValue) {
  try {
    const returnBestValue = async (arr, val, defaultVal) => {
      try {
        if (returnValueIfExists(val)) {
          const bestValue = val
            ? arr[stringSimilarity.findBestMatch(val, array).bestMatchIndex]
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
    case 'bodyTypes':
      return [
        'Two door sedan',
        '2 Door hardtop',
        'Two door hatchback',
        'Two door liftback',
        'Two door wagon',
        '4 Door hardtop',
        'Four door hatchback',
        'Four door liftback',
        'Four door wagon',
        'Five door sedan',
        'Eight passenger sport van',
        'CONFA',
        'Convertible',
        'Extended cargo van',
        'Extended sport van',
        'Extended window van',
        'Suburban or carry-all',
        'Mini-bike',
        'Motor scooter',
        'Pickup truck',
        'Recreation trailer',
        'Sport coupe',
        'Sedan',
        'Sport van',
        'Trail bike',
        'Truck-Tractor',
        'Van camper',
        '3 door extended cab/chassis',
        '3 door extended cab',
        '4 door extended cab/chassis',
        '4 door extended cab',
        'Antique auto (P)',
        'Amphibious auto',
        'All terrain vehicle',
        'Boat/horse trailer/similar vehicle',
        'Detachable camper body',
        'Compact car',
        'Classic auto',
        'Coupe',
        'Camper trailer',
        'Dune buggy',
        'Electric auto',
        'Golf cart',
        'Go cart',
        'Hardtop',
        'Limousine (P)',
        'Motorbike',
        'Motorcycle (P)',
        'Motor home (P)',
        'All other motorized cycles',
        'Moped',
        'Mobile home trailer (P)',
        'Motor-cycles scooters, bikes',
        'Mini van',
        'Other',
        'Pickup with camper body',
        'Panel van (P)',
        'Private passenger auto make',
        'Recreational vehicle',
        'Snowmobile',
        'Step van (P)',
        'Sport utility',
        'Station wagon',
        'Unregistered vehicle',
        'Utility trailer',
        'Van (P)',
        'Window van (P)',
        'Utility/4 wheel drive',
        'Ambulance (emergency)',
        'Ambulance (non emergency)',
        'Antique auto (C)',
        'Airport bus',
        'Airport limousine',
        'Comml drv school w/dual controls',
        'Comml drv school w/o dual controls',
        'Church bus',
        'Charter bus',
        'Cargo van',
        'Dump semi-trailer',
        'Dump trailer',
        'Dump truck',
        'Fire departments (non-PPT)',
        'Fire departments (PPT)',
        'Funeral, hearse-amb, emergency',
        'Funeral flower car',
        'Funeral hearse',
        'Funeral limousine',
        'Funeral, hearse-amb, non-emergency',
        'Folding/pop-up camper',
        'Hatch back',
        'Inter city bus',
        'Limousine',
        'Law enforcement agcy (motorcycle)',
        'Law enforcement agcy (PPT)',
        'Law enf agcy (non-PPT/motorcycle)',
        'Motorcycle (C)',
        'Mobile home (22 feet or less)',
        'Mobile home (over 22 feet)',
        'Mobile home trailer (C)',
        'Motor home (C)',
        'Buses, not classified',
        'School bus, other',
        'Panel van',
        'Priv Passenger rated, pleasure use',
        'Priv Passenger rated, business use',
        'Private Passenger rated',
        'Priv Passenger rated, farm use',
        'School bus, school district owned',
        'PU used to transport camper bodies',
        'Public vehicle, not classified',
        'School drv trng w/dual controls',
        'School drv trng w/o dual controls',
        'Showroom trailer',
        'Special/mobile farm equipment',
        'Special/mobile non-farm equipment',
        'Service/utility trailer',
        'Sightseeing bus',
        'Social serv auto (employee oper)',
        'Social services auto (all other)',
        'Semi-trailer',
        'Station wagon (C)',
        'Step van',
        'Trailer',
        'Taxi',
        'Comml truck drv sch w/dual contr',
        'Comml truck drv sch w/o dual contr',
        'Truck',
        'Transp of athletes & entertainers',
        'Transp of employees (all others)',
        'Transportation of employees (PPT)',
        'Urban bus',
        'Utility van',
        'Van (C)',
        'Van pool (employer furnished)',
        'Van pool (all others)',
        'Window van',
      ];
    case 'primaryVehicleUse':
      return [
        'Service',
        'Commercial',
        'Retail',
        'Wk/sch-15',
        'Wk/sch+15',
        'Pleasure',
        'Farm',
        'Business',
        'Clergy',
        'Commute',
        'Other',
        'Show restricted use',
      ];
  }
}

export async function returnDriverData(client) {
  const dataObj = [];
  const driverObj = {};
  async function assignObject(value, label) {
    if (value && typeof value != 'undefined') {
      driverObj[label] = value;
    }
    return null;
  }
  if (client.hasOwnProperty('drivers') && client.drivers.length > 0) {
    for (const j in client.drivers) {
      const driver = client.drivers[j];
      const index = +j + 1;
      await assignObject(index, 'Driver#');
      const fullName = driver.fullName
        ? driver.fullName
        : `${driver.applicantGivenName} ${driver.applicantSurname}`;
      await assignObject(fullName, `Name`);
      const streetAddress = client.streetAddress
        ? client.streetAddress
        : `${client.streetNumber} ${client.streetName}${
            client.unitNumber ? ` Unit ${client.unitNumber}` : ''
          }`;
      await assignObject(streetAddress, `Address`);
      await assignObject(client.city, `City`);
      await assignObject(client.stateCd, `State`);
      await assignObject(client.postalCd, `Zip`);
      await assignObject(formatDate(driver.applicantBirthDt), `Date of Birth`);
      await assignObject(driver.applicantGenderCd, `Sex`);
      await assignObject(driver.applicantMaritalStatusCd, `Marital Status`);
      await assignObject(driver.driverLicenseStateCd, `State Licensed`);
      await assignObject(driver.yearLicenseIssued, `Year Licensed`);
      await assignObject(driver.driverLicenseNumber, `Driver License#`);
      await assignObject(formatDate(driver.hireDate), `Hire Date`);
      dataObj.push(driverObj);
    }
  }
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

  return dataObj;
}

export async function returnVehicleData(client) {
  const dataObj = [];
  const vehicleObj = {};
  async function assignObject(value, label) {
    if (value && typeof value != 'undefined') {
      vehicleObj[label] = value;
    }
    return null;
  }
  if (client.hasOwnProperty('vehicles') && client.vehicles.length > 0) {
    for (const j in client.vehicles) {
      const vehicle = client.vehicles[j];
      const index = +j + 1;
      await assignObject(index, 'Vehicle #');
      await assignObject(vehicle.vehicleModelYear, `Year`);
      await assignObject(vehicle.vehicleManufacturer, `Make`);
      await assignObject(vehicle.vehicleModel, `Model`);
      await assignObject(
        await returnClosestValue(
          vehicle.vehicleBodyStyle,
          await returnArray('bodyTypes'),
          null
        ),
        `Body Type`
      );
      await assignObject(vehicle.vehicleVin, `VIN`);
      await assignObject(vehicle.costNew, `Cost New`);
      await assignObject(formatDate(vehicle.purchaseDate), `Purchase Date`);
      await assignObject(client.stateCd, `License State`);
      await assignObject(
        await returnClosestValue(
          vehicle.vehicleUseCd,
          await returnArray('primaryVehicleUse'),
          'Pleasure'
        ),
        `Usage`
      );
      await assignObject(vehicle.weight, `GVW/GCW`);
      await assignObject(vehicle.radius, `Radius`);
      dataObj.push(vehicleObj);
    }
  }
  return dataObj;
}

export async function returnClientData(client, company, agent) {
  const dataObj = {};
  const insured = await returnInsured(client);
  dataObj['CustomerId'] = client.amsCustomerId;
  dataObj['LastName'] = insured.lastName;
  dataObj['FirstName'] = insured.firstName;
  dataObj['FirmName'] = client.business
    ? client.business.entityName
    : client.business;
  const address = {
    streetName: null,
    streetNumber: null,
    unit: null,
    city: null,
    state: null,
    county: null,
    zip: null,
  };
  if (
    client.homes &&
    client.homes.length &&
    client.homes.length > 0 &&
    client.homes[0].city
  ) {
    const home = client.homes[0];
    address.streetName = home.streetName;
    address.streetNumber = home.streetNumber;
    address.unit = home.unitNumber;
    address.city = home.city;
    address.state = home.state;
    address.county = home.county;
    address.zip = home.zipCode;
  } else {
    address.streetName = client.streetName;
    address.streetNumber = client.streetNumber;
    address.unit = client.unitNumber;
    address.city = client.city;
    address.state = client.stateCd;
    address.county = client.county;
    address.zip = client.postalCd;
  }
  dataObj['AddressLine1'] =
    address.streetNumber && address.streetName
      ? `${address.streetNumber} ${address.streetName}`
      : null;
  dataObj['AddressLine2'] = address.unit ? address.unit : null;
  dataObj['City'] = address.city ? address.city : null;
  dataObj['State'] = address.state ? address.state : null;
  dataObj['County'] = address.county ? address.county : null;
  dataObj['ZipCode'] = address.zip ? address.zip : null;
  const phoneDig = client.phone ? client.phone.replace(/\D/g, '') : null;
  const areaCodeHasOne =
    phoneDig && phoneDig.substring(0, 1) === '1' ? true : false;
  const areaCode = phoneDig
    ? phoneDig.substring(areaCodeHasOne ? 1 : 0, areaCodeHasOne ? 4 : 3)
    : null;
  const phone = phoneDig ? phoneDig.substring(areaCodeHasOne ? 4 : 3) : null;
  dataObj['HomeAreaCode'] = areaCode ? areaCode : null;
  dataObj['HomePhone'] = phone ? phone : null;
  // dataObj['HomeExtension'] =
  const businessAreaCodeHasOne =
    client.business &&
    client.business.phone &&
    client.business.phone.substring(0, 1) === '1'
      ? true
      : false;
  const businessAreaCode =
    client.business && client.business.phone
      ? client.business.phone.substring(businessAreaCodeHasOne ? 1 : 0, 3)
      : null;
  const businessPhone =
    client.business && client.business.phone
      ? client.business.phone.substring(businessAreaCodeHasOne ? 4 : 3)
      : null;
  dataObj['BusinessAreaCode'] = businessAreaCode;
  dataObj['BusinessPhone'] = businessPhone;
  dataObj['CellAreaCode'] = areaCode;
  dataObj['CellPhone'] = phone;
  dataObj['Email'] = client.email;
  dataObj['WebAddress'] =
    client.business && client.business.website ? client.business.website : null;
  dataObj['DateOfBirth'] = client.birthDate
    ? formatDate(client.birthDate)
    : null;
  dataObj['MaritalStatus'] = insured.maritalStatus;
  if (client.business) {
    dataObj['InBusinessSince'] = client.business.businessStartYear;
    dataObj['BusinessEntityType'] = client.business.entityType;
    dataObj['DoingBusinessAs'] = client.business.dba;
    dataObj['FederalTaxIdNumber'] = client.business.ein;
  }
  dataObj['CustomerType'] = client.customerType ? client.customerType : 'P';
  dataObj['IsActive'] = true;
  dataObj['AccountExecCode'] = agent
    ? agent.executiveCode
    : company.mainExecutiveCode;
  dataObj['AccountRepCode'] = agent
    ? agent.producerCode
    : company.producerNumber;
  dataObj['GLDivisionCode'] = company.division;
  dataObj['GLDepartmentCode'] = company.department;
  dataObj['GLBranchCode'] = company.branch;
  dataObj['GLGroupCode'] = company.group;
  dataObj['DateCustomerAdded'] = formatDate(new Date());
  const IsCommercial =
    client.business && client.business.entityName ? true : false;
  dataObj['IsPersonal'] = !IsCommercial;
  dataObj['IsCommercial'] = IsCommercial;
  dataObj['IsLife'] = false;
  dataObj['IsHealth'] = false;
  dataObj['IsNonPropertyAndCasualty'] = false;
  dataObj['IsFinancial'] = false;
  dataObj['IsBenefits'] = false;
  return dataObj;
}
