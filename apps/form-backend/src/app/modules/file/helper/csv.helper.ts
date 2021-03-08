import * as companyHelper from '../../company/helper/company.helper';
import * as moment from 'moment';

export async function returnData(clients) {
  try {
    const dataObj = [];
    const pairs = await companyHelper.returnArrayOfKeyPairs();
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      async function assignObject(value, label, key) {
        if (value && typeof value != 'undefined') {
          clientObj[label] = this.isDate(key)
            ? this.returnNewDate(value)
            : value;
        }
        return null;
      }
      const clientObj = {};
      for (let j = 0; j < pairs.length; j++) {
        const pair = pairs[j];
        const key = pair.pair.key;
        if (pair.type === 'client' && this.returnExists(client[key])) {
          const clientValue = `Insured_${key}`;
          await assignObject(client[key], clientValue, key);
        } else if (
          pair.type === 'business' &&
          this.returnExists(client.business && client.business[key])
        ) {
          const businessValue = `Business_${key}`;
          await assignObject(
            client.business && client.business[key],
            businessValue,
            key
          );
        } else if (
          pair.type === 'homes' &&
          client.hasOwnProperty('homes') &&
          client.homes.length > 0 &&
          this.returnExists(client.homes[0][key])
        ) {
          const homeValue = `Home_${key}`;
          await assignObject(client.homes[0][key], homeValue, key);
        } else if (
          pair.type === 'drivers' &&
          client.hasOwnProperty('drivers') &&
          client.drivers.length > 0
        ) {
          for (let k = 0; k < client.drivers.length; k++) {
            const driver = client.drivers[k];
            const driverNo = k + 1;
            if (this.returnExists(driver[key])) {
              const driverValue = `Driver_${driverNo}_${key}`;
              await assignObject(driver[key], driverValue, key);
            }
          }
        } else if (
          pair.type === 'vehicles' &&
          client.hasOwnProperty('vehicles') &&
          client.vehicles.length > 0
        ) {
          for (let k = 0; k < client.vehicles.length; k++) {
            const vehicle = client.vehicles[k];
            const vehicleNo = k + 1;
            if (this.returnExists(vehicle[key])) {
              const vehicleValue = `Vehicle_${vehicleNo}_${key}`;
              await assignObject(vehicle[key], vehicleValue, key);
            }
          }
        } else if (
          pair.type === 'locations' &&
          client.hasOwnProperty('locations') &&
          client.locations.length > 0
        ) {
          for (let k = 0; k < client.locations.length; k++) {
            const location = client.locations[k];
            const locationNo = k + 1;
            if (this.returnExists(location[key])) {
              const locationValue = `Location_${locationNo}_${key}`;
              await assignObject(location[key], locationValue, key);
            }
          }
        }
        if (client.agent) {
          const name = `${client.agent.firstName}${
            client.agent.lastName ? ` ${client.agent.lastName}` : ''
          }`;
          await assignObject(name, 'Agent', 'agent');
        }
      }
      dataObj.push(clientObj);
    }

    return { data: dataObj, status: true };
  } catch (error) {
    return { status: false, error: error };
  }
}
function returnExists(value) {
  if (
    (value &&
      value !== 'undefined' &&
      typeof value !== 'undefined' &&
      value !== null &&
      value !== [] &&
      value !== '[]') ||
    value === false
  ) {
    return true;
  }
  return false;
}
function isDate(key) {
  const datesArray = [
    'birthDate',
    'priorPenaltiesDate',
    'spouseBirthdate',
    'priorInsuranceExpirationDate',
    'priorInsuranceStartDate',
    'accidentDate',
    'compLossDate',
    'homeLossDate',
    'entityStartDate',
    'purchaseDate',
    'moveInDate',
    'windMitigationInspectionDate',
    'plumbingUpdateDate',
    'purchaseDate',
    'priorOdometerReadingDate',
    'currentOdometerReadingDate',
    'applicantBirthDt',
    'driverLicensedDt',
    'priorPenaltiesDate',
    'hireDate',
  ];
  return datesArray.includes(key);
}
function returnNewDate(date) {
  if (this.returnExists(date)) {
    return moment(date).format('YYYY-MM-DD');
  } else {
    return null;
  }
}
