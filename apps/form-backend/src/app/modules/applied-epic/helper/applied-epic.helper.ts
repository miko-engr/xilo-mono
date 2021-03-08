import { formatDate } from '../../../helpers/date.helper';

export async function returnAutoData(client) {
  const dataObj = {};
  async function assignObject(value, label) {
    if (value && typeof value != 'undefined') {
      dataObj[label] = value;
    } else {
      dataObj[label] = '';
    }
  }
  async function assignObjectWithArray(key, label, array) {
    if (client.hasOwnProperty(array) && client[array].length > 0) {
      const value = client[array][0][key];
      if (value && typeof value != 'undefined') {
        dataObj[label] = value;
      } else {
        dataObj[label] = '';
      }
    } else {
      dataObj[label] = '';
    }
  }
  await assignObject(
    client.firstName && client.lastName
      ? `${client.firstName} ${client.lastName}`
      : null,
    'Account Name'
  );
  await assignObject(
    client.streetName && client.streetNumber
      ? `${client.streetNumber} ${client.streetName}`
      : null,
    'Address 1'
  );
  await assignObject(client.city, 'City');
  await assignObject(client.stateCd, 'State/Province');
  await assignObject(client.postalCd, 'Zip/Postal Code');
  await assignObject(client.phone, 'Phone Number');
  await assignObject(client.firstName, 'First Name');
  await assignObject(client.lastName, 'Last Name');
  await assignObject(
    client.streetName && client.streetNumber
      ? `${client.streetNumber} ${client.streetName}`
      : null,
    'Address 1'
  );
  await assignObject(client.city, 'City');
  await assignObject(client.stateCd, 'State/Province');
  await assignObject(client.postalCd, 'Zip/Postal Code');
  await assignObject(client.email, 'Email');
  await assignObject(formatDate(client.birthDate), 'Date of Birth');
  await assignObject(client.gender, 'Gender');
  await assignObject(client.maritalStatus, 'Marital Status');
  await assignObjectWithArray(
    'driverLicenseNumber',
    "Driver's License Number",
    'drivers'
  );
  await assignObjectWithArray(
    'driverLicenseStateCd',
    'State Licensed',
    'drivers'
  );

  const newDataObj = [dataObj];

  return newDataObj;
}
export async function returnHomeData(client) {
  const dataObj = {};
  async function assignObject(value, label) {
    if (value && typeof value != 'undefined') {
      dataObj[label] = value;
    } else {
      dataObj[label] = '';
    }
  }
  async function assignObjectWithArray(key, label, array) {
    if (client.hasOwnProperty(array) && client[array].length > 0) {
      const value = client[array][0][key];
      if (value && typeof value != 'undefined') {
        dataObj[label] = value;
      } else {
        dataObj[label] = '';
      }
    } else {
      dataObj[label] = '';
    }
  }
  await assignObject(
    client.firstName && client.lastName
      ? `${client.firstName} ${client.lastName}`
      : null,
    'Account Name'
  );
  await assignObject(
    client.streetName && client.streetNumber
      ? `${client.streetNumber} ${client.streetName}`
      : null,
    'Address 1'
  );
  await assignObject(client.city, 'City');
  await assignObject(client.stateCd, 'State/Province');
  await assignObject(client.postalCd, 'Zip/Postal Code');
  await assignObject(client.phone, 'Phone Number');
  await assignObject(client.firstName, 'First Name');
  await assignObject(client.lastName, 'Last Name');
  await assignObject(
    client.streetName && client.streetNumber
      ? `${client.streetNumber} ${client.streetName}`
      : null,
    'Address 1'
  );
  await assignObject(client.city, 'City');
  await assignObject(client.stateCd, 'State/Province');
  await assignObject(client.postalCd, 'Zip/Postal Code');
  await assignObject(client.email, 'Email');
  await assignObject(formatDate(client.birthDate), 'Date of Birth');
  await assignObject(client.gender, 'Gender');
  await assignObject(client.maritalStatus, 'Marital Status');
  await assignObjectWithArray(
    'driverLicenseNumber',
    "Driver's License Number",
    'drivers'
  );
  await assignObjectWithArray(
    'driverLicenseStateCd',
    'State Licensed',
    'drivers'
  );

  const newDataObj = [dataObj];

  return newDataObj;
}
export async function returnCommercialData(client) {
  const dataObj = {};
  async function assignObject(value, label) {
    if (value && typeof value != 'undefined') {
      dataObj[label] = value;
    } else {
      dataObj[label] = '';
    }
  }
  async function assignObjectWithArray(key, label, array) {
    if (client.hasOwnProperty(array) && client[array].length > 0) {
      const value = client[array][0][key];
      if (value && typeof value != 'undefined') {
        dataObj[label] = value;
      } else {
        dataObj[label] = '';
      }
    } else {
      dataObj[label] = '';
    }
  }
  await assignObject(
    client.firstName && client.lastName
      ? `${client.firstName} ${client.lastName}`
      : null,
    'Account Name'
  );
  await assignObject(
    client.streetName && client.streetNumber
      ? `${client.streetNumber} ${client.streetName}`
      : null,
    'Address 1'
  );
  await assignObject(client.city, 'City');
  await assignObject(client.stateCd, 'State/Province');
  await assignObject(client.postalCd, 'Zip/Postal Code');
  await assignObject(client.phone, 'Phone Number');
  await assignObject(client.firstName, 'First Name');
  await assignObject(client.lastName, 'Last Name');
  await assignObject(
    client.streetName && client.streetNumber
      ? `${client.streetNumber} ${client.streetName}`
      : null,
    'Address 1'
  );
  await assignObject(client.city, 'City');
  await assignObject(client.stateCd, 'State/Province');
  await assignObject(client.postalCd, 'Zip/Postal Code');
  await assignObject(client.email, 'Email');
  await assignObject(formatDate(client.birthDate), 'Date of Birth');
  await assignObject(client.gender, 'Gender');
  await assignObject(client.maritalStatus, 'Marital Status');
  await assignObjectWithArray(
    'driverLicenseNumber',
    "Driver's License Number",
    'drivers'
  );
  await assignObjectWithArray(
    'driverLicenseStateCd',
    'State Licensed',
    'drivers'
  );

  const newDataObj = [dataObj];

  return newDataObj;
}
