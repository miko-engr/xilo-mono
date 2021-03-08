import { formatDateYY } from '../../../helpers/date.helper';
import { encryption } from '../../../constants/appconstant';
import * as simpleencryptor from 'simple-encryptor';
const encryptor = simpleencryptor.createEncryptor(encryption.key);

export async function returnClientData(clients) {
  try {
    const dataObj = [];
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      async function assignObject(value, label) {
        if (value && typeof value != 'undefined') {
          clientObj[label] = value;
        }
        return null;
      }
      const clientObj = {};
      const insured = await returnInsured(client);

      await assignObject(client.email, 'Email');
      await assignObject(`${insured.firstName} ${insured.lastName}`, 'Name');
      if (client.business && client.business.zipCode) {
        await assignObject('Business Address', 'Other Address Description');
        await assignObject(
          client.business.streetAddress,
          'Other Address Line 1'
        );
        await assignObject(client.business.unitNumber, 'Other Address Line 2');
        await assignObject(client.business.city, 'Other City');
        await assignObject(client.business.county, 'Other County');
        await assignObject(client.business.state, 'Other State');
        await assignObject(client.business.zipCode, 'Other Zip Code');
      }
      if (client.postalCd) {
        await assignObject(client.streetAddress, 'Primary Address Line 1');
        await assignObject(client.unitNumber, 'Primary Address Line 2');
        await assignObject(client.city, 'Primary City');
        await assignObject(client.county, 'Primary County');
        await assignObject(client.stateCd, 'Primary State');
        await assignObject(client.postalCd, 'Primary Zip Code');
        await assignObject(client.streetAddress, 'Mailing Address Line 1');
        await assignObject(client.unitNumber, 'Mailing Address Line 2');
        await assignObject(client.city, 'Mailing City');
        await assignObject(client.county, 'Mailing County');
        await assignObject(client.stateCd, 'Mailing State');
        await assignObject(client.postalCd, 'Mailing Zip Code');
      }
      await assignObject(client.phone, 'Primary Phone Number');
      await assignObject(formatDateYY(client.createdAt), 'Since');
      if (client.business) {
        await assignObject(client.phone, 'Business Phone Number');
        await assignObject(client.business.entityName, 'Company');
        await assignObject(client.business.website, 'Website');
      }
      dataObj.push(clientObj);
    }

    return { data: dataObj, status: true };
  } catch (error) {
    return { status: false, error: error };
  }
}

export async function returnDriverData(clients) {
  try {
    const dataObj = [];
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const driverObj = {};
      async function assignObject(value, label) {
        if (value && typeof value != 'undefined') {
          driverObj[label] = value;
        }
        return null;
      }
      if (client.drivers && client.drivers.length > 0) {
        for (let j = 0; j < client.drivers.length; j++) {
          const driver = client.drivers[j];
          await assignObject(client.email, 'Email');
          await assignObject(driver.applicantBirthDt, 'DOB');
          await assignObject(driver.employer, 'Employer');
          await assignObject(driver.applicantGivenName, 'First Name');
          await assignObject(driver.applicantGenderCd, 'Gender');
          await assignObject(driver.applicantSurname, 'Last Name');
          await assignObject(driver.driverLicenseNumber, 'License #');
          await assignObject(driver.applicantMaritalStatusCd, 'Marital Status');
          if (client.business && client.business.zipCode) {
            await assignObject('Business Address', 'Other Address Description');
            await assignObject(
              client.business.streetAddress,
              'Other Address Line 1'
            );
            await assignObject(
              client.business.unitNumber,
              'Other Address Line 2'
            );
            await assignObject(client.business.city, 'Other City');
            await assignObject(client.business.county, 'Other County');
            await assignObject(client.business.state, 'Other State');
            await assignObject(client.business.zipCode, 'Other Zip Code');
          }
          if (client.postalCd) {
            await assignObject(client.streetAddress, 'Primary Address Line 1');
            await assignObject(client.unitNumber, 'Primary Address Line 2');
            await assignObject(client.city, 'Primary City');
            await assignObject(client.county, 'Primary County');
            await assignObject(client.stateCd, 'Primary State');
            await assignObject(client.postalCd, 'Primary Zip Code');
            await assignObject(client.streetAddress, 'Mailing Address Line 1');
            await assignObject(client.unitNumber, 'Mailing Address Line 2');
            await assignObject(client.city, 'Mailing City');
            await assignObject(client.county, 'Mailing County');
            await assignObject(client.stateCd, 'Mailing State');
            await assignObject(client.postalCd, 'Mailing Zip Code');
          }
          await assignObject(client.phone, 'Primary Phone Number');
          await assignObject(await returnSSN(client, 'driver', j), 'SSN');
          if (client.business) {
            await assignObject(client.phone, 'Business Phone Number');
            await assignObject(client.business.entityName, 'Company');
            await assignObject(client.business.website, 'Website');
          }
          dataObj.push(driverObj);
        }
      }
    }
    return { data: dataObj, status: true };
  } catch (error) {
    return { status: false, error: error };
  }
}

export async function returnInsured(client) {
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

export async function returnSSN(client, type, index) {
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
