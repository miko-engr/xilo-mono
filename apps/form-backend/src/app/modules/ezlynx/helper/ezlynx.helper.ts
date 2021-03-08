import { formatDateYY, } from '../../../helpers/date.helper';
import { parseAddress } from "../../../helpers/address.helper"
import * as set from 'lodash.set';
import * as stringSimilarity from 'string-similarity';
import * as request from 'request-promise';
import { ezLynx, encryption } from '../../../constants/appconstant';
import * as parser from 'xml2js';
import * as simpleencryptor from 'simple-encryptor';
const encryptor = simpleencryptor.createEncryptor(encryption.key);
import { HttpException, HttpStatus } from '@nestjs/common';

export async function returnAutoData(client, company?) {
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

    let dataFile: any = {};
    dataFile.Applicant = {};
    dataFile.Applicant.ApplicantType = 'Applicant';
    dataFile.Applicant.PersonalInfo = {};
    dataFile.Applicant.PersonalInfo.Name = {};

    dataFile.Applicant.PersonalInfo.Name = {};
    const insured = await this.returnInsured(client);
    await assignObject(
      dataFile.Applicant.PersonalInfo.Name,
      'FirstName',
      insured.firstName
    );
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
      await this.returnSSN(client, 'client', 0)
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
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Industry',
      insured.industry
    );
    const bestOccupation = client.occupation
      ? await this.returnClosestValue(
        client.occupation,
        await this.returnArray('occupations'),
        null
      )
      : null;
    const occupation = insured.occupation
      ? insured.occupation
      : await this.returnOccupation(bestOccupation);
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Occupation',
      occupation
    );
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Education',
      await this.returnClosestValue(
        insured.education,
        await this.returnArray('education')
      )
    );
    await assignObject(dataFile.Applicant.PersonalInfo, 'Relation', 'Insured');

    dataFile.Applicant.Address = {};

    const home =
      client.hasOwnProperty('homes') && client.homes.length > 0
        ? client.homes[0]
        : null;

    if (home && home.city) {
      dataFile.Applicant.Address.AddressCode = 'StreetAddress';
      dataFile.Applicant.Address.Addr1 = {};
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'StreetName',
        home.streetName
      );
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'StreetNumber',
        home.streetNumber
      );
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'UnitNumber',
        home.unitNumber
      );
      await assignObject(dataFile.Applicant.Address, 'City', home.city);
      await assignObject(dataFile.Applicant.Address, 'StateCode', home.state);
      await assignObject(dataFile.Applicant.Address, 'Zip5', home.zipCode);
    } else if (returnValueIfExists(client.city)) {
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
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'UnitNumber',
        client.unitNumber
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
    if (client.lengthAtAddress) {
      const lengthAtAddress = await this.returnDurationValue(
        client.lengthAtAddress,
        await this.returnArray('durationYears')
      );
      await assignObject(
        dataFile.Applicant.Address,
        'YearsAtAddress',
        lengthAtAddress
      );
    }
    if (
      (client.hasOwnProperty('drivers') && client.drivers.length > 1) ||
      client.spouseFirstName
    ) {
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
        const gender =
          coApp.applicantGenderCd !== 'Male' &&
            coApp.applicantGenderCd !== 'Female'
            ? null
            : coApp.applicantGenderCd;
        await assignObject(dataFile.CoApplicant.PersonalInfo, 'Gender', gender);
        await assignObject(
          dataFile.Applicant.PersonalInfo,
          'SSN',
          await this.returnSSN(client, 'driver', 1)
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'MaritalStatus',
          coApp.applicantMaritalStatusCd
        );
        const industry = coApp.industry
          ? await this.returnClosestValueIfClose(
            coApp.industry,
            await this.returnArrayByKey('industry'),
            0.5
          )
          : null;
        if (industry) {
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Industry',
            industry
          );
          const occupation = await this.returnClosestValueIfClose(
            coApp.occupation,
            await this.returnArray('occupation'),
            0.5
          );
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Occupation',
            occupation
          );
        } else {
          const bestOccupation = coApp.applicantOccupationClassCd
            ? await this.returnClosestValue(
              coApp.applicantOccupationClassCd,
              await this.returnArray('occupations'),
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
            await this.returnOccupation(bestOccupation)
          );
        }
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Education',
          coApp.educationLevel
            ? await this.returnClosestValue(
              coApp.educationLevel,
              await this.returnArray('education')
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
        const gender =
          client.spouseGender !== 'Male' && client.spouseGender !== 'Female'
            ? null
            : client.spouseGender;
        await assignObject(dataFile.CoApplicant.PersonalInfo, 'Gender', gender);
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'MaritalStatus',
          client.spouseMaritalStatus
        );
        const industry = client.spouseIndustry
          ? await this.returnClosestValueIfClose(
            client.spouseIndustry,
            await this.returnArrayByKey('industry'),
            0.5
          )
          : null;
        if (industry) {
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Industry',
            industry
          );
          const occupation = await this.returnClosestValueIfClose(
            client.spouseOccupation,
            await this.returnArray('occupation'),
            0.5
          );
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Occupation',
            occupation
          );
        } else {
          const bestOccupation = client.spouseOccupation
            ? await this.returnClosestValue(
              client.spouseOccupation,
              await this.returnArray('occupations'),
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
            await this.returnOccupation(bestOccupation)
          );
        }
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Education',
          client.spouseEducationLevel
            ? await this.returnClosestValue(
              client.spouseEducationLevel,
              await this.returnArray('education')
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
    if (
      returnValueIfExists(client.priorInsuranceCompany) ||
      (returnValueIfExists(client.hasPriorInsurance) &&
        client.hasPriorInsurance === 'Yes')
    ) {
      dataFile.PriorPolicyInfo = {};
      const priorInsuranceArray = await this.returnArray(
        'autoInsuranceCompanies'
      );
      await assignObject(
        dataFile.PriorPolicyInfo,
        'PriorCarrier',
        await this.returnClosestValue(
          client.priorInsuranceCompany,
          priorInsuranceArray
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
        bi = await this.returnClosestValue(
          client.vehicles[0].priorLiabilityLimit,
          await this.returnArray('priorLiabilityLimit'),
          null
        );
      } else if (
        returnExistsWithArray('bodilyInjuryCoverage', client.vehicles)
      ) {
        bi = await this.returnClosestValue(
          client.vehicles[0].bodilyInjuryCoverage,
          await this.returnArray('priorLiabilityLimit'),
          null
        );
      } else if (returnValueIfExists(client.liabilityLimits)) {
        bi = await this.returnClosestValue(
          client.liabilityLimits,
          await this.returnArray('priorLiabilityLimit'),
          null
        );
      }
      await assignObject(dataFile.PriorPolicyInfo, 'PriorLiabilityLimit', bi);
      const premium = await this.returnNumber(client.priorInsurancePremium);
      await assignObject(
        dataFile.PriorPolicyInfo,
        'PriorPolicyPremium',
        premium
      );
      const priorPolicyTerm = await this.returnClosestValueIfClose(
        client.priorPolicyTerm,
        this.returnArrayByKey('priorPolicyTerm'),
        0.8
      );
      await assignObject(
        dataFile.PriorPolicyInfo,
        'PriorPolicyTerm',
        priorPolicyTerm
      );
    }
    dataFile.PolicyInfo = {};
    const coverageTerm = await this.returnClosestValueIfClose(
      client.autoCoverageTerm,
      this.returnArrayByKey('autoCoverageTerm'),
      0.8
    );
    dataFile.PolicyInfo.PolicyTerm = coverageTerm || '6 Month';
    await assignObject(
      dataFile.PolicyInfo,
      'Package',
      returnExistsWithArray('hasPackage', client.vehicles)
        ? client.vehicles[0].hasPackage
        : 'No'
    );
    let effDate = null;
    if (client.effectiveDate === 'closeDate') {
      effDate = null;
    } else if (client.effectiveDate === 'empty') {
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
    if (
      returnValueIfExists(client.homeownership) ||
      returnValueIfExists(client.lengthAtAddress) ||
      home ||
      returnValueIfExists(client.previousAddress)
    ) {
      dataFile.ResidenceInfo = {};
      if (
        returnValueIfExists(client.homeownership) ||
        returnValueIfExists(client.lengthAtAddress) ||
        home
      ) {
        dataFile.ResidenceInfo.CurrentAddress = {};
        if (!client.lengthAtAddress && home) {
          dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent = {};
          if (home.isNewPurchase === 'Yes') {
            await assignObject(
              dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent,
              'Years',
              '0'
            );
          } else if (home.isNewPurchase === 'No') {
            await assignObject(
              dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent,
              'Years',
              '5'
            );
          } else if (client.hasPreviousAddress === 'Yes') {
            await assignObject(
              dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent,
              'Years',
              '0'
            );
          } else if (client.hasPreviousAddress === 'No') {
            await assignObject(
              dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent,
              'Years',
              '5'
            );
          } else if (client.hasSecondAddress === 'Yes') {
            await assignObject(
              dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent,
              'Years',
              '0'
            );
          } else if (client.hasSecondAddress === 'No') {
            await assignObject(
              dataFile.ResidenceInfo.CurrentAddress.YearsAtCurrent,
              'Years',
              '5'
            );
          }
        } else if (returnValueIfExists(client.lengthAtAddress)) {
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
        const homeArray = await this.returnArray('homeownership');
        const ownership = await this.returnClosestValue(
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
      if (returnValueIfExists(client.previousAddress)) {
        dataFile.ResidenceInfo.PreviousAddress = {};
        dataFile.ResidenceInfo.PreviousAddress.Address = {};
        await assignObject(
          dataFile.ResidenceInfo.PreviousAddress.Address,
          'AddressCode',
          'StreetAddress'
        );
        dataFile.ResidenceInfo.PreviousAddress.Address.Addr1 = {};
        const addressObj = {};
        const parsedAddress = parseAddress(client.previousAddress);
        if (parsedAddress) {
          function returnWithSpace(value) {
            return value && value !== '' ? ` ${value}` : '';
          }
          addressObj['streetAddress'] = `${
            parsedAddress.number
            }${returnWithSpace(parsedAddress.prefix)}${
            parsedAddress.street
            }${returnWithSpace(parsedAddress.type)}`;
          addressObj['streetNumber'] = parsedAddress.number;
          addressObj['unitNumber'] = null;
          addressObj['streetName'] = `${parsedAddress.street}${returnWithSpace(
            parsedAddress.type
          )}`;
          addressObj['city'] = parsedAddress.city;
          addressObj['state'] = parsedAddress.state;
          addressObj['zipCode'] = parsedAddress.zip;
        }
        await assignObject(
          dataFile.ResidenceInfo.PreviousAddress.Address.Addr1,
          'StreetName',
          addressObj['streetName']
        );
        await assignObject(
          dataFile.ResidenceInfo.PreviousAddress.Address.Addr1,
          'StreetNumber',
          addressObj['streetNumber']
        );
        await assignObject(
          dataFile.ResidenceInfo.PreviousAddress.Address.Addr1,
          'UnitNumber',
          addressObj['unitNumber']
        );
        await assignObject(
          dataFile.ResidenceInfo.PreviousAddress.Address,
          'City',
          addressObj['city']
        );
        await assignObject(
          dataFile.ResidenceInfo.PreviousAddress.Address,
          'StateCode',
          addressObj['state']
        );
        await assignObject(
          dataFile.ResidenceInfo.PreviousAddress.Address,
          'Zip5',
          addressObj['zipCode']
        );
      }
    }
    if (
      client.hasOwnProperty('drivers') &&
      client.drivers.length > 0 &&
      (returnValueIfExists(client.drivers[0].applicantSurname) ||
        returnValueIfExists(client.drivers[0].applicantGivenName) ||
        returnValueIfExists(client.drivers[0].fullName))
    ) {
      dataFile.Drivers = [];
      for (const j in client.drivers) {
        const driver = client.drivers[j];
        if (
          returnValueIfExists(driver.applicantGivenName) ||
          returnValueIfExists(driver.applicantSurname) ||
          returnValueIfExists(driver.fullName)
        ) {
          dataFile.Drivers.push({
            name: 'Driver',
            attrs: { id: j },
            children: [],
          });
          dataFile.Drivers[j].children.push({});
          if (driver.applicantGivenName || driver.applicantSurname) {
            dataFile.Drivers[j].children[0].Name = {};
            await assignObject(
              dataFile.Drivers[j].children[0].Name,
              'FirstName',
              driver.applicantGivenName
            );
            await assignObject(
              dataFile.Drivers[j].children[0].Name,
              'LastName',
              driver.applicantSurname
            );
          } else if (driver.fullName) {
            const names = driver.fullName.split(' ');
            if (names[0]) {
              await assignObject(
                dataFile.Drivers[j].children[0].Name,
                'FirstName',
                names[0]
              );
            }
            if (names[1]) {
              await assignObject(
                dataFile.Drivers[j].children[0].Name,
                'LastName',
                names[1]
              );
            }
          }
          const gender =
            driver.applicantGenderCd !== 'Male' &&
              driver.applicantGenderCd !== 'Female'
              ? null
              : driver.applicantGenderCd;
          await assignObject(dataFile.Drivers[j].children[0], 'Gender', gender);
          await assignObject(
            dataFile.Drivers[j].children[0],
            'DOB',
            returnDateValue(driver.applicantBirthDt, null)
          );
          await assignObject(
            dataFile.Applicant.PersonalInfo,
            'SSN',
            await this.returnSSN(client, 'driver', j)
          );
          await assignObject(
            dataFile.Drivers[j].children[0],
            'DLNumber',
            driver.driverLicenseNumber
          );
          await assignObject(
            dataFile.Drivers[j].children[0],
            'DLState',
            driver.driverLicenseStateCd
          );
          await assignObject(
            dataFile.Drivers[j].children[0],
            'DateLicensed',
            returnDateValue(driver.driverLicensedDt, null)
          );
          dataFile.Drivers[j].children[0].DLStatus = 'Valid';
          await assignObject(
            dataFile.Drivers[j].children[0],
            'AgeLicensed',
            driver.drivingExperience
          );
          await assignObject(
            dataFile.Drivers[j].children[0],
            'MaritalStatus',
            driver.applicantMaritalStatusCd
          );
          await assignObject(
            dataFile.Drivers[j].children[0],
            'Relation',
            driver.relationship
          );
          const industry = driver.industry
            ? await this.returnClosestValueIfClose(
              driver.industry,
              await this.returnArrayByKey('industry'),
              0.5
            )
            : null;
          if (industry) {
            await assignObject(
              dataFile.Drivers[j].children[0],
              'Industry',
              industry
            );
            const occupation = await this.returnClosestValueIfClose(
              driver.applicantOccupationClassCd,
              await this.returnArray('occupation'),
              0.5
            );
            await assignObject(
              dataFile.Drivers[j].children[0],
              'Occupation',
              occupation
            );
          } else {
            const bestOccupation = driver.applicantOccupationClassCd
              ? await this.returnClosestValue(
                driver.applicantOccupationClassCd,
                await this.returnArray('occupations'),
                null
              )
              : null;
            await assignObject(
              dataFile.Drivers[j].children[0],
              'Industry',
              bestOccupation
            );
            await assignObject(
              dataFile.Drivers[j].children[0],
              'Occupation',
              await this.returnOccupation(bestOccupation)
            );
          }
          if (
            client.hasOwnProperty('incidents') &&
            client.incidents.length > 0
          ) {
            for (let incident of client.incidents) {
              if (incident.type) {
                if (incident.type.toLowerCase().includes('accident')) {
                  dataFile.Drivers[0].children[0].Accident = {};
                  await assignObject(
                    dataFile.Drivers[0].children[0].Accident,
                    'Date',
                    returnDateValue(incident.date, null)
                  );
                  await assignObject(
                    dataFile.Drivers[0].children[0].Accident,
                    'Description',
                    await this.returnClosestValueIfClose(
                      incident.description,
                      await this.returnArray('accidentDescription'),
                      0.5
                    )
                  );
                }
                if (incident.type.toLowerCase().includes('violation')) {
                  dataFile.Drivers[0].children[0].Violation = {};
                  await assignObject(
                    dataFile.Drivers[0].children[0].Violation,
                    'Date',
                    returnDateValue(incident.date, null)
                  );
                  await assignObject(
                    dataFile.Drivers[0].children[0].Violation,
                    'Description',
                    await this.returnClosestValueIfClose(
                      incident.description,
                      await this.returnArray('violationDescription'),
                      0.5
                    )
                  );
                }
                if (incident.type.toLowerCase().includes('claim')) {
                  dataFile.Drivers[0].children[0].CompLoss = {};
                  await assignObject(
                    dataFile.Drivers[0].children[0].CompLoss,
                    'Date',
                    returnDateValue(incident.date, null)
                  );
                  await assignObject(
                    dataFile.Drivers[0].children[0].CompLoss,
                    'Description',
                    incident.description
                      ? await this.returnClosestValueIfClose(
                        incident.description,
                        await this.returnArray('damageClaimDescription'),
                        0.5
                      )
                      : null
                  );
                }
              }
            }
          } else {
            if (client.hasAccidents === 'Yes') {
              dataFile.Drivers[0].children[0].Accident = {};
              await assignObject(
                dataFile.Drivers[0].children[0].Accident,
                'Date',
                returnDateValue(client.accidentDate, null)
              );
              await assignObject(
                dataFile.Drivers[0].children[0].Accident,
                'Description',
                await this.returnClosestValueIfClose(
                  client.accidentType,
                  await this.returnArray('accidentDescription'),
                  0.5
                )
              );
            }
            if (client.hasViolations === 'Yes') {
              dataFile.Drivers[0].children[0].Violation = {};
              await assignObject(
                dataFile.Drivers[0].children[0].Violation,
                'Date',
                returnDateValue(client.violationDate, null)
              );
              await assignObject(
                dataFile.Drivers[0].children[0].Violation,
                'Description',
                await this.returnClosestValueIfClose(
                  client.violationType,
                  await this.returnArray('violationDescription'),
                  0.5
                )
              );
            }
            if (client.hasCompLoss === 'Yes') {
              dataFile.Drivers[0].children[0].CompLoss = {};
              await assignObject(
                dataFile.Drivers[0].children[0].CompLoss,
                'Date',
                returnDateValue(client.compLossDate, null)
              );
              await assignObject(
                dataFile.Drivers[0].children[0].CompLoss,
                'Description',
                client.compLossType
                  ? await this.returnClosestValueIfClose(
                    client.compLossType.toUpperCase(),
                    await this.returnArray('damageClaimDescription'),
                    0.5
                  )
                  : null
              );
            }
          }
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
        dataFile.Drivers.push({
          name: 'Driver',
          attrs: { id: index },
          children: [],
        });
        dataFile.Drivers[index].children.push({});
        dataFile.Drivers[index].children[0].Name = {};
        await assignObject(
          dataFile.Drivers[index].children[0].Name,
          'FirstName',
          firstName
        );
        await assignObject(
          dataFile.Drivers[index].children[0].Name,
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
        if (
          (returnExists(vehicle.vehicleModelYear) &&
            returnExists(vehicle.vehicleManufacturer) &&
            returnExists(vehicle.vehicleModel)) ||
          returnExists(vehicle.vehicleVin)
        ) {
          dataFile.Vehicles.push({
            name: 'Vehicle',
            attrs: { id: j },
            children: [],
          });
          dataFile.Vehicles[j].children.push({});
          dataFile.Vehicles[j].children[0].UseVinLookup = 'Yes';
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'Year',
            vehicle.vehicleModelYear
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'Vin',
            vehicle.vehicleVin
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'Make',
            vehicle.vehicleManufacturer
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'Model',
            vehicle.vehicleModel
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'Sub-Model',
            vehicle.vehicleBodyStyle
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'Anti-Theft',
            await this.returnClosestValueIfClose(
              vehicle.antiTheftType,
              await this.returnArrayByKey('antiTheftType'),
              0.5
            )
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'PassiveRestraints',
            await this.returnClosestValueIfClose(
              vehicle.passiveRestraintsType,
              await this.returnArrayByKey('passiveRestraintsType'),
              0.5
            )
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'AntiLockBrake',
            await this.returnClosestValueIfClose(
              vehicle.hasAntiLockBrakes,
              await this.returnArrayByKey('hasAntiLockBrakes'),
              0.9
            )
          );
          await assignObject(
            dataFile.Vehicles[j].children[0],
            'DaytimeRunningLights',
            await this.returnClosestValueIfClose(
              vehicle.hasDaytimeLights,
              await this.returnArrayByKey('hasDaytimeLights'),
              0.9
            )
          );
        }
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
        dataFile.Vehicles.push({
          name: 'Vehicle',
          attrs: { id: index },
          children: [],
        });
        dataFile.Vehicles[index].children.push({});
        dataFile.Vehicles[index].children[0].UseVinLookup = 'Yes';
        let vehicleData = await this.returnEZLynxVehicle(year, make, model);
        if (!vehicleData) {
          vehicleData = {
            year: null,
            make: null,
            model: null,
            vin: null,
          };
        }
        await assignObject(dataFile.Vehicles[index].children[0], 'Year', year);
        await assignObject(
          dataFile.Vehicles[index].children[0],
          'Vin',
          vehicleData.vin
        );
        await assignObject(
          dataFile.Vehicles[index].children[0],
          'Make',
          vehicleData.make
        );
        await assignObject(
          dataFile.Vehicles[index].children[0],
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
        if (
          (returnExists(vehicle.vehicleModelYear) &&
            returnExists(vehicle.vehicleManufacturer) &&
            returnExists(vehicle.vehicleModel)) ||
          returnExists(vehicle.vehicleVin)
        ) {
          dataFile.VehiclesUse.push({
            name: 'VehicleUse',
            attrs: { id: j },
            children: [],
          });
          dataFile.VehiclesUse[j].children.push({});
          const primaryUse = await this.returnClosestValue(
            vehicle.vehicleUseCd,
            await this.returnArray('vehiclePrimaryUse'),
            null
          );
          await assignObject(
            dataFile.VehiclesUse[j].children[0],
            'Useage',
            primaryUse
          );
          await assignObject(
            dataFile.VehiclesUse[j].children[0],
            'OneWayMiles',
            vehicle.vehicleCommuteMilesDrivenOneWay
          );
          await assignObject(
            dataFile.VehiclesUse[j].children[0],
            'DaysPerWeek',
            vehicle.vehicleDaysDrivenPerWeek
          );
          // console.log('WEEKS PER MONTH, ', vehicle.weeksPerMonthDriven);
          await assignObject(
            dataFile.VehiclesUse[j].children[0],
            'WeeksPerMonthType',
            vehicle.weeksPerMonthDriven
          );
          const annualMiles = isNaN(vehicle.vehicleAnnualDistance)
            ? vehicle.vehicleAnnualDistance
            : +vehicle.vehicleAnnualDistance;
          await assignObject(
            dataFile.VehiclesUse[j].children[0],
            'AnnualMiles',
            annualMiles
          );
          await assignObject(
            dataFile.VehiclesUse[j].children[0],
            'Ownership',
            vehicle.ownOrLeaseVehicle
          );
          //   dataFile.VehiclesUse[j].children[0].PrincipalOperator = {};
          //   dataFile.VehiclesUse[j].children[0].UsedForDelivery = {};
          //   dataFile.VehiclesUse[j].children[0].PriorDamagePresent = {};
        }
      }
    }
    if (client.hasOwnProperty('vehicles') && client.vehicles.length > 0) {
      dataFile.Coverages = [];
      dataFile.Coverages.push({ name: 'GeneralCoverage', children: [] });
      dataFile.Coverages[0].children.push({});
      let bi = null;
      if (
        client.vehicles &&
        returnValueIfExists(client.vehicles[0].bodilyInjuryCoverage)
      ) {
        bi = await this.returnClosestValue(
          client.vehicles[0].bodilyInjuryCoverage,
          await this.returnArray('bodilyInjuryCoverage'),
          null
        );
      } else if (
        client.vehicles &&
        client.vehicles.length > 1 &&
        client.vehicles.some((veh) => returnExists(veh.bodilyInjuryCoverage))
      ) {
        const vehIndex = client.vehicles.findIndex((veh) =>
          returnExists(veh.bodilyInjuryCoverage)
        );
        bi = await this.returnClosestValue(
          client.vehicles[vehIndex].bodilyInjuryCoverage,
          await this.returnArray('bodilyInjuryCoverage'),
          null
        );
      } else if (returnValueIfExists(client.liabilityLimits)) {
        bi = await this.returnClosestValue(
          client.liabilityLimits,
          await this.returnArray('bodilyInjuryCoverage'),
          null
        );
      }
      await assignObject(dataFile.Coverages[0].children[0], 'BI', bi);
      await assignObject(
        dataFile.Coverages[0].children[0],
        'PD',
        client.vehicles[0].propertyDamageCoverage
      );
      await assignObject(
        dataFile.Coverages[0].children[0],
        'MP',
        client.vehicles[0].medicalCoverage
      );
      if (returnValueIfExists(client.vehicles[0].uninsuredMotoristCoverage)) {
        await assignObject(
          dataFile.Coverages[0].children[0],
          'UM',
          client.vehicles[0].uninsuredMotoristCoverage
        );
      } else if (bi) {
        await assignObject(dataFile.Coverages[0].children[0], 'UM', bi);
      }
      if (returnValueIfExists(client.vehicles[0].uninsuredMotoristCoverage)) {
        await assignObject(
          dataFile.Coverages[0].children[0],
          'UIM',
          client.vehicles[0].underInsuredMotoristCoverage
        );
      } else if (bi) {
        await assignObject(dataFile.Coverages[0].children[0], 'UIM', bi);
      }
      await assignObject(
        dataFile.Coverages[0].children[0],
        'Multipolicy',
        client.homes &&
          client.homes[0] &&
          client.homes[0].hasMultiPolicyDiscount
          ? client.homes[0].hasMultiPolicyDiscount
          : 'No'
      );
      await assignObject(
        dataFile.Coverages[0].children[0],
        'Multicar',
        client.vehicles.length > 1 ? 'Yes' : 'No'
      );
      if (
        client.vehicles[0].comprehensive ||
        client.vehicles[0].collission ||
        client.vehicles[0].roadsideCoverage ||
        client.vehicles[0].extraTransportationCoverage
      ) {
        for (const j in client.vehicles) {
          const vehicle = client.vehicles[j];
          if (
            (returnExists(vehicle.vehicleModelYear) &&
              returnExists(vehicle.vehicleManufacturer) &&
              returnExists(vehicle.vehicleModel)) ||
            returnExists(vehicle.vehicleVin)
          ) {
            const cov = {};
            function returnData(key) {
              return vehicle[key] ? vehicle[key] : null;
            }
            cov['comprehensive'] = returnData('comprehensive');
            if (cov['comprehensive'] && isNaN(cov['comprehensive'])) {
              cov['comprehensive'] = 'No Coverage';
            } else if (cov['comprehensive']) {
              cov['comprehensive'] = await this.returnClosestNumberValue(
                cov['comprehensive'],
                await this.returnArray('collisionDeductible'),
                null
              );
            }
            cov['collision'] = returnData('collision');
            if (cov['collision'] && isNaN(cov['collision'])) {
              cov['collision'] = 'No Coverage';
            } else if (cov['collision']) {
              cov['collision'] = await this.returnClosestNumberValue(
                cov['collision'],
                await this.returnArray('collisionDeductible'),
                null
              );
            }
            cov['fullGlassCoverage'] = returnData('fullGlassCoverage');
            cov['roadsideCoverage'] = returnData('roadsideCoverage');
            cov['extraTransportationCoverage'] = returnData(
              'extraTransportationCoverage'
            );
            cov['loanAndLeaseCoverage'] = returnData('loanAndLeaseCoverage');
            dataFile.Coverages.push({
              name: 'VehicleCoverage',
              attrs: { id: j },
              children: [],
            });
            dataFile.Coverages[+j + 1].children.push({});
            await assignObject(
              dataFile.Coverages[+j + 1].children[0],
              'OtherCollisionDeductible',
              cov['comprehensive']
            );
            await assignObject(
              dataFile.Coverages[+j + 1].children[0],
              'CollisionDeductible',
              cov['collision']
            );
            await assignObject(
              dataFile.Coverages[+j + 1].children[0],
              'FullGlass',
              cov['fullGlassCoverage']
            );
            await assignObject(
              dataFile.Coverages[+j + 1].children[0],
              'TowingDeductible',
              await this.returnClosestValue(
                cov['roadsideCoverage'],
                await this.returnArray('roadsideCoverage'),
                null
              )
            );
            await assignObject(
              dataFile.Coverages[+j + 1].children[0],
              'RentalDeductible',
              await this.returnClosestValue(
                cov['extraTransportationCoverage'],
                await this.returnArray('rentalDeductible'),
                null
              )
            );
            await assignObject(
              dataFile.Coverages[+j + 1].children[0],
              'LoanLeaseCoverage',
              cov['loanAndLeaseCoverage']
            );
          }
        }
      }
      if (
        (company && company.state === 'TX') ||
        (client && client.stateCd === 'TX')
      ) {
        if (
          client.vehicles[0].personalInjuryCoverage ||
          client.vehicles[0].autoDeathIndemnity ||
          client.vehicles[0].umPd
        ) {
          dataFile.Coverages.push({
            name: 'StateSpecificCoverage',
            children: [],
          });
          const fileLength = dataFile.Coverages.length - 1;
          dataFile.Coverages[fileLength].children.push({});
          dataFile.Coverages[fileLength].children[0]['TX-Coverages'] = {};
          await assignObject(
            dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
            'TX-PIP',
            client.vehicles[0].personalInjuryCoverage
          );
          await assignObject(
            dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
            'TX-AutoDeathIndemnity',
            client.vehicles[0].autoDeathIndemnity
          );
          await assignObject(
            dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
            'TX-UMPD',
            client.vehicles[0].umPd
          );
        }
      }
      if (
        (company && company.state === 'KY') ||
        (client && client.stateCd === 'KY')
      ) {
        dataFile.Coverages.push({
          name: 'StateSpecificCoverage',
          children: [],
        });
        const fileLength = dataFile.Coverages.length - 1;
        dataFile.Coverages[fileLength].children.push({});
        dataFile.Coverages[fileLength].children[0]['KY-Coverages'] = {};
        const pip =
          client.vehicles &&
            client.vehicles[0] &&
            client.vehicles[0].personalInjuryCoverage
            ? await this.returnClosestValueIfClose(
              client.vehicles[0].personalInjuryCoverage,
              await this.returnArray('personalInjuryCoverage-KY'),
              0.8
            )
            : null;
        await assignObject(
          dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
          'KY-PIP',
          pip
        );
        await assignObject(
          dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
          'KY-PIPDeductible',
          'None'
        );
        await assignObject(
          dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
          'KY-TortLimitation',
          'Tort Limitation Not Rejected'
        );
      }
    }
    if (
      client.hasOwnProperty('vehicles') &&
      client.vehicles.length > 0 &&
      client.vehicles.some((vehicle) => vehicle.driverIndex)
    ) {
      dataFile.VehicleAssignments = [];
      for (const j in client.vehicles) {
        const vehicle = client.vehicles[j];
        if (returnExists(vehicle.driverIndex)) {
          const index = +vehicle.driverIndex + 1;
          dataFile.VehicleAssignments.push({
            name: 'VehicleAssigment',
            children: [{}],
          });
          await assignObject(
            dataFile.VehicleAssignments[j].children[0],
            'DriverAssignment',
            index
          );
        }
      }
    }
    if (returnExists(client.stateCd)) {
      dataFile.GeneralInfo = {};
      dataFile.GeneralInfo.RatingStateCode = returnValue(client.stateCd);
    }

    return { status: true, data: dataFile };
  } catch (error) {
    return { status: false, error: error };
  }
}
export async function returnHomeData(client, company?) {
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

    function returnGrade(finish) {
      if (finish === '1') {
        return 'Basic';
      } else if (finish === '2') {
        return 'SemiCustom';
      } else if (finish === '3') {
        return 'Designer';
      }
    }

    function returnExistsWithArray(key, array) {
      if (array && array.length > 0) {
        return returnExists(array[0][key]);
      } else {
        return false;
      }
    }

    const home = client.homes[0];

    const dataFile: any = {};
    dataFile.Applicant = {};
    dataFile.Applicant.ApplicantType = 'Applicant';

    dataFile.Applicant.PersonalInfo = {};
    dataFile.Applicant.PersonalInfo.Name = {};
    const insured = await this.returnInsured(client);
    await assignObject(
      dataFile.Applicant.PersonalInfo.Name,
      'FirstName',
      insured.firstName
    );
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
      await this.returnSSN(client, 'client', 0)
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
    const industry = insured.occupation
      ? await this.returnClosestValueIfClose(
        insured.industry,
        await this.returnArrayByKey('industry'),
        0.5
      )
      : null;
    if (industry) {
      await assignObject(dataFile.Applicant.PersonalInfo, 'Industry', industry);
      const occupation = await this.returnClosestValueIfClose(
        insured.occupation,
        await this.returnArray('occupation'),
        0.5
      );
      await assignObject(
        dataFile.Applicant.PersonalInfo,
        'Occupation',
        occupation
      );
    } else {
      await assignObject(
        dataFile.Applicant.PersonalInfo,
        'Industry',
        insured.industry
      );
      const bestOccupation = insured.industry
        ? await this.returnClosestValue(
          insured.industry,
          await this.returnArray('occupations'),
          null
        )
        : null;
      const occupation = insured.occupation
        ? insured.occupation
        : await this.returnOccupation(bestOccupation);
      await assignObject(
        dataFile.Applicant.PersonalInfo,
        'Occupation',
        occupation
      );
    }
    await assignObject(
      dataFile.Applicant.PersonalInfo,
      'Education',
      await this.returnClosestValue(
        insured.education,
        await this.returnArray('education')
      )
    );
    await assignObject(dataFile.Applicant.PersonalInfo, 'Relation', 'Insured');

    dataFile.Applicant.Address = {};
    if (returnValueIfExists(home.city)) {
      dataFile.Applicant.Address.AddressCode = 'StreetAddress';
      dataFile.Applicant.Address.Addr1 = {};
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'StreetName',
        home.streetName
      );
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'StreetNumber',
        home.streetNumber
      );
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'UnitNumber',
        home.unitNumber
      );
      await assignObject(dataFile.Applicant.Address, 'City', home.city);
      await assignObject(dataFile.Applicant.Address, 'StateCode', home.state);
      await assignObject(dataFile.Applicant.Address, 'Zip5', home.zipCode);
    } else if (returnValueIfExists(client.city)) {
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
      await assignObject(
        dataFile.Applicant.Address.Addr1,
        'UnitNumber',
        client.unitNumber
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
    if (home.lengthAtAddress) {
      await assignObject(
        dataFile.Applicant.Address,
        'YearsAtAddress',
        await this.returnClosestValue(
          home.lengthAtAddress,
          await this.returnArray('lengthAtAddress')
        )
      );
    } else if (!client.lengthAtAddress) {
      if (home.isNewPurchase === 'Yes') {
        await assignObject(
          dataFile.Applicant.Address,
          'YearsAtAddress',
          '6 months or less'
        );
      } else if (home.isNewPurchase === 'No') {
        await assignObject(dataFile.Applicant.Address, 'YearsAtAddress', '5');
      } else if (client.hasPreviousAddress === 'Yes') {
        await assignObject(
          dataFile.Applicant.Address,
          'YearsAtAddress',
          '6 months or less'
        );
      } else if (client.hasPreviousAddress === 'No') {
        await assignObject(dataFile.Applicant.Address, 'YearsAtAddress', '5');
      } else if (client.hasSecondAddress === 'Yes') {
        await assignObject(
          dataFile.Applicant.Address,
          'YearsAtAddress',
          '6 months or less'
        );
      } else if (client.hasSecondAddress === 'No') {
        await assignObject(dataFile.Applicant.Address, 'YearsAtAddress', '5');
      }
    } else {
      await assignObject(
        dataFile.Applicant.Address,
        'YearsAtAddress',
        client.lengthAtAddress
          ? await this.returnClosestValue(
            client.lengthAtAddress,
            await this.returnArray('lengthAtAddress')
          )
          : null
      );
    }
    if (
      client.hasSecondAddress === 'Yes' ||
      client.hasPreviousAddress === 'Yes' ||
      home.isNewPurchase === 'Yes' ||
      returnValueIfExists(client.previousAddress)
    ) {
      if (client.city || client.previousAddress) {
        dataFile.Applicant.PreviousAddress = {};
        await assignObject(
          dataFile.Applicant.PreviousAddress,
          'AddressCode',
          'PreviousAddress'
        );
        dataFile.Applicant.PreviousAddress.Addr1 = {};
        const addressObj = {};
        if (client.previousAddress) {
          const parsedAddress = parseAddress(client.previousAddress);
          if (parsedAddress) {
            function returnWithSpace(value) {
              return value && value !== '' ? ` ${value}` : '';
            }
            addressObj['streetAddress'] = `${
              parsedAddress.number
              }${returnWithSpace(parsedAddress.prefix)}${
              parsedAddress.street
              }${returnWithSpace(parsedAddress.type)}`;
            addressObj['streetNumber'] = parsedAddress.number;
            addressObj['unitNumber'] = client.previousAddressUnit;
            addressObj['streetName'] = `${
              parsedAddress.street
              }${returnWithSpace(parsedAddress.type)}`;
            addressObj['city'] = parsedAddress.city;
            addressObj['state'] = parsedAddress.state;
            addressObj['zipCode'] = parsedAddress.zip;
          }
        } else {
          addressObj['streetAddress'] = client.streetAddress;
          addressObj['unitNumber'] = client.unitNumber;
          addressObj['streetNumber'] = client.streetNumber;
          addressObj['streetName'] = client.streetName;
          addressObj['city'] = client.city;
          addressObj['state'] = client.stateCd;
          addressObj['zipCode'] = client.postalCd;
        }
        await assignObject(
          dataFile.Applicant.PreviousAddress.Addr1,
          'StreetName',
          addressObj['streetName']
        );
        await assignObject(
          dataFile.Applicant.PreviousAddress.Addr1,
          'StreetNumber',
          addressObj['streetNumber']
        );
        await assignObject(
          dataFile.Applicant.PreviousAddress.Addr1,
          'UnitNumber',
          addressObj['unitNumber']
        );
        await assignObject(
          dataFile.Applicant.PreviousAddress,
          'City',
          addressObj['city']
        );
        await assignObject(
          dataFile.Applicant.PreviousAddress,
          'StateCode',
          addressObj['state']
        );
        await assignObject(
          dataFile.Applicant.PreviousAddress,
          'Zip5',
          (addressObj['zipCode'] = client.postalCd)
        );
        const lengthAtAddress = client.lengthAtAddress
          ? client.lengthAtAddress
          : 3;
        await assignObject(
          dataFile.Applicant.PreviousAddress,
          'YearsAtAddress',
          lengthAtAddress
        );
        // dataFile.Applicant[2].children[0].Validation = 'Valid';
      }
    }
    if (home.city) {
      dataFile.AltDwelling = {};
      dataFile.AltDwelling.Address = {};
      await assignObject(
        dataFile.AltDwelling.Address,
        'AddressCode',
        'PhysicalRisk'
      );
      dataFile.AltDwelling.Address.Addr1 = {};
      await assignObject(
        dataFile.AltDwelling.Address.Addr1,
        'StreetName',
        home.streetName
      );
      await assignObject(
        dataFile.AltDwelling.Address.Addr1,
        'StreetNumber',
        home.streetNumber
      );
      await assignObject(
        dataFile.AltDwelling.Address.Addr1,
        'UnitNumber',
        home.unitNumber
      );
      await assignObject(dataFile.AltDwelling.Address, 'City', home.city);
      await assignObject(dataFile.AltDwelling.Address, 'County', home.county);
      await assignObject(dataFile.AltDwelling.Address, 'StateCode', home.state);
      await assignObject(dataFile.AltDwelling.Address, 'Zip5', home.zipCode);
      // dataFile.AltDwelling.Address.Validation = 'Valid';
    }
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
        const gender =
          coApp.applicantGenderCd !== 'Male' &&
            coApp.applicantGenderCd !== 'Female'
            ? null
            : coApp.applicantGenderCd;
        await assignObject(dataFile.CoApplicant.PersonalInfo, 'Gender', gender);
        await assignObject(
          dataFile.Applicant.PersonalInfo,
          'SSN',
          await this.returnSSN(client, 'driver', 1)
        );
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'MaritalStatus',
          coApp.applicantMaritalStatusCd
        );
        const industry = coApp.industry
          ? await this.returnClosestValueIfClose(
            coApp.industry,
            await this.returnArrayByKey('industry'),
            0.5
          )
          : null;
        if (industry) {
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Industry',
            industry
          );
          const occupation = await this.returnClosestValueIfClose(
            coApp.occupation,
            await this.returnArray('occupation'),
            0.5
          );
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Occupation',
            occupation
          );
        } else {
          const bestOccupation = coApp.applicantOccupationClassCd
            ? await this.returnClosestValue(
              coApp.applicantOccupationClassCd,
              await this.returnArray('occupations'),
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
            await this.returnOccupation(bestOccupation)
          );
        }
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Education',
          coApp.educationLevel
            ? await this.returnClosestValue(
              coApp.educationLevel,
              await this.returnArray('education')
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
        const gender =
          client.spouseGender !== 'Male' && client.spouseGender !== 'Female'
            ? null
            : client.spouseGender;
        await assignObject(dataFile.CoApplicant.PersonalInfo, 'Gender', gender);
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'MaritalStatus',
          client.spouseMaritalStatus
        );
        const industry = client.spouseIndustry
          ? await this.returnClosestValueIfClose(
            client.spouseIndustry,
            await this.returnArrayByKey('industry'),
            0.5
          )
          : null;
        if (industry) {
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Industry',
            industry
          );
          const occupation = await this.returnClosestValueIfClose(
            client.spouseOccupation,
            await this.returnArray('occupation'),
            0.5
          );
          await assignObject(
            dataFile.CoApplicant.PersonalInfo,
            'Occupation',
            occupation
          );
        } else {
          const bestOccupation = client.spouseOccupation
            ? await this.returnClosestValue(
              client.spouseOccupation,
              await this.returnArray('occupations'),
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
            await this.returnOccupation(bestOccupation)
          );
        }
        await assignObject(
          dataFile.CoApplicant.PersonalInfo,
          'Education',
          client.spouseEducationLevel
            ? await this.returnClosestValue(
              client.spouseEducationLevel,
              await this.returnArray('education')
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
      if (
        (returnValueIfExists(home.city) && returnValueIfExists(client.city)) ||
        returnValueIfExists(home.city)
      ) {
        dataFile.CoApplicant.Address.AddressCode = 'StreetAddress';
        dataFile.CoApplicant.Address.Addr1 = {};
        await assignObject(
          dataFile.CoApplicant.Address.Addr1,
          'StreetName',
          home.streetName
        );
        await assignObject(
          dataFile.CoApplicant.Address.Addr1,
          'StreetNumber',
          home.streetNumber
        );
        await assignObject(
          dataFile.CoApplicant.Address.Addr1,
          'UnitNumber',
          home.unitNumber
        );
        await assignObject(dataFile.CoApplicant.Address, 'City', home.city);
        await assignObject(
          dataFile.CoApplicant.Address,
          'StateCode',
          home.state
        );
        await assignObject(dataFile.CoApplicant.Address, 'Zip5', home.zipCode);
      } else if (returnValueIfExists(client.city)) {
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
        await assignObject(
          dataFile.CoApplicant.Address.Addr1,
          'UnitNumber',
          client.unitNumber
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
    if (
      returnValueIfExists(home.insuranceCompany) ||
      home.isNewPurchase === 'Yes' ||
      client.isFirstTimeHomeBuyer
    ) {
      dataFile.PriorPolicyInfo = {};
      const array = await this.returnArray('homeInsuranceCompanies');
      let insuranceCarrier = home.insuranceCompany;
      if (
        client.isFirstTimeHomeBuyer === 'Yes' ||
        (home.isNewPurchase === 'Yes' && !home.insuranceCompany)
      ) {
        insuranceCarrier = 'No Prior Insurance';
      }
      await assignObject(
        dataFile.PriorPolicyInfo,
        'PriorCarrier',
        await this.returnClosestValue(
          insuranceCarrier,
          array,
          'No Prior Insurance'
        )
      );
      await assignObject(
        dataFile.PriorPolicyInfo,
        'Expiration',
        returnDateValue(home.coverageExpiration, new Date())
      );
      dataFile.PriorPolicyInfo.YearsWithPriorCarrier = {};
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithPriorCarrier,
        'Years',
        home.yearsWithCompany
      );
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithPriorCarrier,
        'Months',
        home.monthsWithCompany
      );
      dataFile.PriorPolicyInfo.YearsWithContinuousCoverage = {};
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithContinuousCoverage,
        'Years',
        home.yearsWithInsurance
      );
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithContinuousCoverage,
        'Months',
        home.monthsWithCompany
      );
      if (dataFile.PriorPolicyInfo.PriorCarrier === 'No Prior Insurance') {
        dataFile.PriorPolicyInfo.ReasonNoPrior = 'First Time Homeowner';
      } else if (home.isNewPurchase === 'Yes') {
        dataFile.PriorPolicyInfo.ReasonNoPrior = 'First Time Homeowner';
      }
      const premium = await this.returnNumber(home.priorPolicyPremium);
      await assignObject(
        dataFile.PriorPolicyInfo,
        'PriorPolicyPremium',
        premium
      );
    }
    dataFile.PolicyInfo = {};
    const policyTerm = home.policyTerm ? home.policyTerm : '12 Month';
    dataFile.PolicyInfo.PolicyTerm = policyTerm;
    let policyType = 'HO3';
    if (
      client.policyType === 'HO4' ||
      client.policyType === 'HO5' ||
      client.policyType === 'HO6'
    ) {
    } else if (client.policyType) {
      const pType = client.policyType.toLowerCase();
      if (pType.includes('condo')) {
        policyType = 'HO6';
      } else if (pType.includes('rent')) {
        policyType = 'HO4';
      }
    }
    await assignObject(dataFile.PolicyInfo, 'PolicyType', policyType);
    await assignObject(
      dataFile.PolicyInfo,
      'Package',
      returnExistsWithArray('hasPackage', client.homes)
        ? client.homes[0].hasPackage
        : 'No'
    );
    let effDate = null;
    if (
      client.effectiveDate === 'closeDate' ||
      home.effectiveDate === 'closeDate'
    ) {
      effDate = formatDateYY(home.expectedClosingDate);
    } else if (
      home.isNewPurchase === 'Yes' &&
      home.purchaseDate &&
      !client.effectiveDate
    ) {
      effDate = formatDateYY(home.purchaseDate);
    } else if (client.effectiveDate === 'empty') {
      effDate = null;
    } else if (client.effectiveDate) {
      effDate = formatDateYY(client.effectiveDate);
    } else if (home.coverageExpiration) {
      effDate = formatDateYY(home.coverageExpiration);
    } else {
      effDate = formatDateYY(new Date());
    }
    await assignObject(dataFile.PolicyInfo, 'Effective', effDate);
    dataFile.PolicyInfo.CreditCheckAuth = 'Yes';
    dataFile.RatingInfo = {};
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
      await this.returnClosestValue(
        home.residenceType,
        await this.returnArray('dwellingType'),
        'One Family'
      )
    );
    await assignObject(
      dataFile.RatingInfo,
      'DwellingUse',
      await this.returnClosestValue(
        home.primaryUse,
        await this.returnArray('homePrimaryUse'),
        null
      )
    );
    await assignObject(
      dataFile.RatingInfo,
      'DistanceToFireHydrant',
      home.distanceFromFireHydrant
    );
    await assignObject(dataFile.RatingInfo, 'WithinCityLimits', home.isInCity);
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
    if (home.numOfStories) {
      let nStories = home.numOfStories.replace(/[^0-9.]/g, '');
      if (nStories.includes('.')) {
        nStories = Math.round(+nStories);
      }
      await assignObject(dataFile.RatingInfo, 'NumberOfStories', nStories);
    }
    await assignObject(
      dataFile.RatingInfo,
      'Construction',
      await this.returnClosestValue(
        home.exteriorMaterials,
        await this.returnArray('constructionType'),
        null
      )
    );
    await assignObject(
      dataFile.RatingInfo,
      'Structure',
      await this.returnClosestValue(
        home.structureType,
        await this.returnArray('structureType'),
        null
      )
    );
    await assignObject(
      dataFile.RatingInfo,
      'Roof',
      await this.returnClosestValue(
        home.roofType ? home.roofType.toUpperCase() : null,
        await this.returnArray('roofType'),
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
        const poolType = await this.returnClosestValue(
          home.poolType,
          await this.returnArray('poolTypes')
        );
        if (poolType) {
          await assignObject(dataFile.RatingInfo, 'SwimmingPoolType', poolType);
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
      await this.returnClosestValue(
        home.heatType,
        await this.returnArray('heatType'),
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
      home.hasTrampolineHidden ? home.hasTrampolineHidden : home.hasTrampolines
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
    await assignObject(
      dataFile.RatingInfo.ReplacementCostExtended,
      'ConstructionMethod',
      await this.returnClosestValue(
        await this.returnArray('constructionMethod', home.constructionMethod)
      )
    );
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
        if (home.basementFinishPercentage) {
          home.basementFinishPercentage = home.basementFinishPercentage.replace(
            /\D/g,
            ''
          );
        }
        await assignObject(
          dataFile.RatingInfo.ReplacementCostExtended.Foundations
            .BasementInformation,
          'BasementFinish',
          home.basementFinishPercentage
        );
        const basementTypes = ['Daylight/Walkout', 'Below Grade'];
        await assignObject(
          dataFile.RatingInfo.ReplacementCostExtended.Foundations
            .BasementInformation,
          'BasementTypeInfo',
          await this.returnClosestValue(home.basementType, basementTypes, null)
        );
        const basementFinishTypes = ['Custom', 'Standard'];
        await assignObject(
          dataFile.RatingInfo.ReplacementCostExtended.Foundations
            .BasementInformation,
          'BasementFinishedType',
          await this.returnClosestValue(
            home.bsementDescription,
            basementFinishTypes,
            null
          )
        );
      } else {
        const foundation = await this.returnClosestValue(
          home.homeFoundationType,
          await this.returnArray('foundations')
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
    await assignObject(
      dataFile.RatingInfo.ReplacementCostExtended,
      'Kitchens',
      returnGrade(home.levelOfFinishes)
    );
    if (returnValueIfExists(home.coolType)) {
      dataFile.RatingInfo.ReplacementCostExtended.HeatingAndCoolingType = {};
      await assignObject(
        dataFile.RatingInfo.ReplacementCostExtended.HeatingAndCoolingType,
        'AirConditioning',
        await this.returnClosestValue(
          home.coolType,
          await this.returnArray('heatType'),
          'Other'
        )
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
          await this.returnClosestValue(home.garageType, garageTypes)
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
        if (returnValueIfExists(home.numOfBaths)) {
          let halfBaths: any = home.numOfBaths % 1;
          let fullBaths: any = home.numOfBaths - halfBaths;
          if (fullBaths) {
            fullBaths = fullBaths.toString();
          }
          if (halfBaths) {
            halfBaths = halfBaths.toString();
          }
          dataFile.RatingInfo.ReplacementCostExtended.Baths.FullBaths = {};
          dataFile.RatingInfo.ReplacementCostExtended.Baths.HalfBaths = {};
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Baths.FullBaths,
            'SemiCustom',
            fullBaths
          );
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Baths.HalfBaths,
            'SemiCustom',
            halfBaths
          );
        }
        if (returnValueIfExists(home.numOfFullBaths)) {
          if (home.numOfFullBaths) {
            home.numOfFullBaths = home.numOfFullBaths.toString();
          }
          dataFile.RatingInfo.ReplacementCostExtended.Baths.FullBaths = {};
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Baths.FullBaths,
            'SemiCustom',
            home.numOfFullBaths
          );
        }
        if (returnValueIfExists(home.numOfHalfBaths)) {
          if (home.numOfHalfBaths) {
            home.numOfHalfBaths = home.numOfHalfBaths.toString();
          }
          dataFile.RatingInfo.ReplacementCostExtended.Baths.HalfBaths = {};
          await assignObject(
            dataFile.RatingInfo.ReplacementCostExtended.Baths.HalfBaths,
            'SemiCustom',
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
      const bestValue = await this.returnClosestNumberValue(
        home.personalLiabilityCoverage,
        personalLiabilityCoverages
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
      const medicalPaymentsCoverages = ['1000', '2000', '3000', '4000', '5000'];
      const bestValue = await this.returnClosestNumberValue(
        home.medicalPaymentsCoverage,
        medicalPaymentsCoverages
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
        if (home.allPerilsDeductible.includes('%')) {
          let bestValue = null;
          if (
            home.allPerilsDeductible.includes('.5') ||
            home.allPerilsDeductible.includes('1/2')
          ) {
            bestValue = '1/2%';
          } else {
            bestValue = '1%';
          }
          await assignObject(
            dataFile.ReplacementCost.DeductibeInfo,
            'Deductible',
            bestValue
          );
        } else {
          const allPerilsDeductibles = [
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
          const bestValue = await this.returnClosestNumberValue(
            home.allPerilsDeductible,
            allPerilsDeductibles
          );
          if (bestValue) {
            await assignObject(
              dataFile.ReplacementCost.DeductibeInfo,
              'Deductible',
              bestValue
            );
          }
        }
      }
      if (home.windDeductible) {
        if (home.windDeductible.includes('%')) {
          const windDeductibles = ['5%', '4%', '3%', '2%', '1%'];
          if (windDeductibles.includes(home.windDeductible)) {
            const bestValue = windDeductibles.filter(
              (ded) => ded === home.windDeductible
            );
            if (bestValue && bestValue[0]) {
              await assignObject(
                dataFile.ReplacementCost.DeductibeInfo,
                'WindDeductible',
                bestValue
              );
            }
          }
        } else {
          const windDeductibles = [
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
          const bestValue = await this.returnClosestNumberValue(
            home.windDeductible,
            windDeductibles
          );
          if (bestValue) {
            await assignObject(
              dataFile.ReplacementCost.DeductibeInfo,
              'WindDeductible',
              bestValue
            );
          }
        }
      }
      if (home.theftDeductible) {
        const theftDeductibles = ['500', '1500'];
        const bestValue = await this.returnClosestNumberValue(
          home.theftDeductible,
          theftDeductibles
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
      const deviceArray = ['Local', 'Direct', 'Central'];
      await assignObject(
        dataFile.Endorsements.ProtectiveDevices.SmokeDetector,
        'BaseProtectionDevice',
        await this.returnClosestValueIfClose(
          home.smokeDetectorType,
          deviceArray,
          0.5
        )
      );
      await assignObject(
        dataFile.Endorsements.ProtectiveDevices.SmokeDetector,
        'FireExtinguisher',
        home.hasFireExtinguisher
      );
      await assignObject(
        dataFile.Endorsements.ProtectiveDevices,
        'Fire',
        await this.returnClosestValueIfClose(
          home.fireSystemType,
          deviceArray,
          0.5
        )
      );
      dataFile.Endorsements.ProtectiveDevices.BurglarAlarm = {};
      await assignObject(
        dataFile.Endorsements.ProtectiveDevices.BurglarAlarm,
        'BaseProtectionDevice',
        await this.returnClosestValueIfClose(
          home.burglarAlarmType,
          deviceArray,
          0.5
        )
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
        await this.returnClosestValueIfClose(
          home.sprinklerSystemType,
          deviceArray,
          0.5
        )
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
    if (home.increaseReplacementCostPercent) {
      dataFile.Endorsements.ReplacementCostDwelling = {};
      await assignObject(
        dataFile.Endorsements.ReplacementCostDwelling,
        'ReplacementCostDwelling',
        'Yes'
      );

      await assignObject(
        dataFile.Endorsements.ReplacementCostDwelling,
        'ReplacementCostDwellingPercentage',
        home.increaseReplacementCostPercent
      );
    }
    if (home.replacementCostContent == 'Yes') {
      dataFile.Endorsements.ReplacementCostContent = {};
      await assignObject(
        dataFile.Endorsements.ReplacementCostContent,
        'ReplacementCostContent',
        'Yes'
      );
    }
    if (home.waterBackupCoverage) {
      dataFile.Endorsements.WaterBackup = {};
      await assignObject(
        dataFile.Endorsements.WaterBackup,
        'WaterBackup',
        'Yes'
      );
      await assignObject(
        dataFile.Endorsements.WaterBackup,
        'Amount',
        home.waterBackupCoverage
      );
    }
    dataFile.Endorsements['StateSpecificEndorsements'] = {};
    if (
      (company && company.state === 'TX') ||
      (client && client.stateCd === 'TX')
    ) {
      if (
        home.wantsFoundationCoverage === 'Yes' ||
        home.hasExistingDamage === 'Yes' ||
        home.wantsResidenceGlassCoverage === 'Yes' ||
        home.wantsWaterDamageCoverage === 'Yes'
      ) {
        dataFile.Endorsements.StateSpecificEndorsements['TX-Endorsements'] = {};
        await assignObject(
          dataFile.Endorsements.StateSpecificEndorsements['TX-Endorsements'],
          'ResidenceGlass',
          home.wantsResidenceGlassCoverage
        );
        if (
          home.wantsFoundationCoverage === 'Yes' ||
          home.hasExistingDamage === 'Yes'
        ) {
          dataFile.Endorsements.StateSpecificEndorsements['TX-Endorsements'][
            'FoundationCoverage'
          ] = {};
          await assignObject(
            dataFile.Endorsements.StateSpecificEndorsements['TX-Endorsements']
              .FoundationCoverage,
            'FoundationCoverage',
            home.wantsFoundationCoverage
          );
          await assignObject(
            dataFile.Endorsements.StateSpecificEndorsements['TX-Endorsements']
              .FoundationCoverage,
            'ExistingFoundation',
            home.hasExistingDamage
          );
        }
        await assignObject(
          dataFile.Endorsements.StateSpecificEndorsements['TX-Endorsements'],
          'WaterDamage',
          home.wantsWaterDamageCoverage
        );
      }
    }
    if (returnExists(client.hasHomeLoss) && client.hasHomeLoss !== 'No') {
      dataFile.LossInfo = { '@': { id: '0' } };
      await assignObject(
        dataFile.LossInfo,
        'DateOfIncident',
        returnDateValue(client.homeLossDate, null)
      );
      await assignObject(
        dataFile.LossInfo,
        'Description',
        client.homeLossType ? client.homeLossType.toUpperCase() : null
      );
      await assignObject(dataFile.LossInfo, 'Amount', client.homeLossAmount);
    }
    if (
      (company && company.state === 'TX') ||
      (client && client.stateCd === 'TX')
    ) {
      if (client.hasOwnProperty('vehicles') && client.vehicles.length > 0) {
        if (
          client.vehicles[0].personalInjuryCoverage ||
          client.vehicles[0].autoDeathIndemnity ||
          client.vehicles[0].umPd
        ) {
          dataFile.Coverages = [];
          dataFile.Coverages.push({
            name: 'StateSpecificCoverage',
            children: [],
          });
          const fileLength = dataFile.Coverages.length - 1;
          dataFile.Coverages[fileLength].children.push({});
          dataFile.Coverages[fileLength].children[0]['TX-Coverages'] = {};
          await assignObject(
            dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
            'TX-PIP',
            client.vehicles[0].personalInjuryCoverage
          );
          await assignObject(
            dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
            'TX-AutoDeathIndemnity',
            client.vehicles[0].autoDeathIndemnity
          );
          await assignObject(
            dataFile.Coverages[fileLength].children[0]['TX-Coverages'],
            'TX-UMPD',
            client.vehicles[0].umPd
          );
        }
      }
    }
    if (returnExists(client.stateCd)) {
      dataFile.GeneralInfo = {};
      dataFile.GeneralInfo.RatingStateCode = returnValue(client.stateCd);
    }
    return { status: true, data: dataFile };
  } catch (error) {
    return { status: false, error: error };
  }
}
export async function returnDwellingfireData(client) {
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

    function returnGrade(finish) {
      if (finish === '1') {
        return 'Basic';
      } else if (finish === '2') {
        return 'SemiCustom';
      } else if (finish === '3') {
        return 'Designer';
      }
    }

    const home = client.homes[0];

    const dataFile: any = {};
    /*Applicant */
    dataFile.Applicant = {};
    dataFile.Applicant['home:ApplicantType'] = 'Applicant';
    dataFile.Applicant['home:PersonalInfo'] = {};
    dataFile.Applicant['home:PersonalInfo']['home:Name'] = {};
    const name = await this.returnName(client);
    await assignObject(
      dataFile.Applicant['home:PersonalInfo']['home:Name'],
      'home:FirstName',
      name.firstName
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo']['home:Name'],
      'home:MiddleName',
      ''
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo']['home:Name'],
      'home:LastName',
      name.lastName
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo'],
      'home:DOB',
      returnDateValue(client.birthDate, null)
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo'],
      'home:Gender',
      client.gender
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo'],
      'home:MaritalStatus',
      client.maritalStatus
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo'],
      'home:Relation',
      'Insured'
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo'],
      'home:Industry',
      client.occupation
        ? await this.returnClosestValue(
          client.occupation,
          await this.returnArray('occupations'),
          null
        )
        : null
    );
    await assignObject(
      dataFile.Applicant['home:PersonalInfo'],
      'home:Occupation',
      client.occupation && client.occupation.toLowerCase().includes('retire')
        ? 'Retired'
        : client.occupation
          ? 'Other'
          : null
    );

    dataFile.Applicant['home:Address'] = {};
    if (returnValueIfExists(client.city)) {
      dataFile.Applicant['home:Address']['home:AddressCode'] = 'StreetAddress';
      dataFile.Applicant['home:Address']['home:Addr1'] = {};
      await assignObject(
        dataFile.Applicant['home:Address']['home:Addr1'],
        'home:StreetName',
        client.streetName
      );
      await assignObject(
        dataFile.Applicant['home:Address']['home:Addr1'],
        'home:StreetNumber',
        client.streetNumber
      );
      await assignObject(
        dataFile.Applicant['home:Address']['home:Addr1'],
        'home:UnitNumber',
        client.unitNumber
      );
      await assignObject(
        dataFile.Applicant['home:Address'],
        'home:City',
        client.city
      );
      await assignObject(
        dataFile.Applicant['home:Address'],
        'home:StateCode',
        client.stateCd
      );
      await assignObject(
        dataFile.Applicant['home:Address'],
        'home:Zip5',
        client.postalCd
      );
    }
    if (returnValueIfExists(client.phone)) {
      dataFile.Applicant['home:Address']['home:Phone'] = {};
      dataFile.Applicant['home:Address']['home:Phone']['home:PhoneType'] =
        'Mobile';
      await assignObject(
        dataFile.Applicant['home:Address']['home:Phone'],
        'home:PhoneNumber',
        client.phone
      );
    }
    await assignObject(
      dataFile.Applicant['home:Address'],
      'home:Email',
      client.email
    );
    await assignObject(
      dataFile.Applicant['home:Address'],
      'home:YearsAtAddress',
      client.lengthAtAddress
        ? await this.returnClosestValue(
          client.lengthAtAddress,
          await this.returnArray('lengthAtAddress')
        )
        : null
    );

    if (returnValueIfExists(home.insuranceCompany)) {
      dataFile.PriorPolicyInfo = {};
      const array = await this.returnArray('homeInsuranceCompanies');
      await assignObject(
        dataFile.PriorPolicyInfo,
        'PriorCarrier',
        await this.returnClosestValue(
          home.insuranceCompany,
          array,
          'No Prior Insurance'
        )
      );
      await assignObject(
        dataFile.PriorPolicyInfo,
        'Expiration',
        returnDateValue(home.coverageExpiration, new Date())
      );
      dataFile.PriorPolicyInfo.YearsWithPriorCarrier = {};
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithPriorCarrier,
        'home:Years',
        home.yearsWithCompany
      );
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithPriorCarrier,
        'home:Months',
        home.monthsWithCompany
      );
      dataFile.PriorPolicyInfo.YearsWithContinuousCoverage = {};
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithContinuousCoverage,
        'home:Years',
        home.yearsWithInsurance
      );
      await assignObject(
        dataFile.PriorPolicyInfo.YearsWithContinuousCoverage,
        'home:Months',
        home.monthsWithCompany
      );
      if (dataFile.PriorPolicyInfo.PriorCarrier === 'No Prior Insurance') {
        dataFile.PriorPolicyInfo.ReasonNoPrior = 'First Time Homeowner';
      }
    }

    dataFile.PolicyInfo = {};
    dataFile.PolicyInfo.PolicyTerm = '12 Month';
    await assignObject(
      dataFile.PolicyInfo,
      'PolicyType',
      client.policyType ? client.policyType : 'Special - DP3'
    );
    dataFile.PolicyInfo.Package = 'No';
    await assignObject(
      dataFile.PolicyInfo,
      'Effective',
      client.effectiveDate
        ? formatDateYY(client.effectiveDate)
        : client.priorInsuranceExpirationDate
          ? formatDateYY(client.priorInsuranceExpirationDate)
          : formatDateYY(new Date())
    );
    dataFile.PolicyInfo.CreditCheckAuth = 'Yes';

    /*Location */
    dataFile.Location = {};
    dataFile.Location.Address = {};
    if (returnValueIfExists(client.city)) {
      dataFile.Location.Address['home:AddressCode'] = 'PhysicalRisk';
      dataFile.Location.Address['home:Addr1'] = {};
      await assignObject(
        dataFile.Location.Address['home:Addr1'],
        'home:StreetName',
        client.streetName
      );
      await assignObject(
        dataFile.Location.Address['home:Addr1'],
        'home:StreetNumber',
        client.streetNumber
      );
      await assignObject(
        dataFile.Location.Address['home:Addr1'],
        'home:UnitNumber',
        client.unitNumber
      );
      await assignObject(dataFile.Location.Address, 'home:City', client.city);
      await assignObject(
        dataFile.Location.Address,
        'home:StateCode',
        client.stateCd
      );
      await assignObject(
        dataFile.Location.Address,
        'home:Zip5',
        client.postalCd
      );
    }
    /*DwellingInfo */
    dataFile.Location.DwellingInfo = {};
    await assignObject(
      dataFile.Location.DwellingInfo,
      'YearBuilt',
      home.yearBuilt
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'NumberOfFamiliesPerUnit',
      home.residenceType
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'DwellingUse',
      home.primaryUse
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'NumberOfFullTimeDomEmps',
      null
    ); //TODO
    await assignObject(
      dataFile.Location.DwellingInfo,
      'DistanceToFireHydrant',
      home.distanceFromFireHydrant
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'WithinCityLimits',
      home.isInCity
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'DistanceToFireStation',
      home.distanceFromFireStation
    );
    dataFile.Location.DwellingInfo.ProtectionClass = '5';
    await assignObject(
      dataFile.Location.DwellingInfo,
      'Construction',
      await this.returnClosestValue(
        home.exteriorMaterials,
        await this.returnArray('constructionType'),
        null
      )
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'Structure',
      await this.returnClosestValue(
        home.structureType,
        await this.returnArray('structureType'),
        null
      )
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'Roof',
      await this.returnClosestValue(
        home.roofType ? home.roofType.toUpperCase() : null,
        await this.returnArray('roofType'),
        null
      )
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'SwimmingPool',
      home.hasPools
    );
    if (home.hasPools === 'Yes') {
      await assignObject(
        dataFile.Location.DwellingInfo,
        'SwimmingPoolFenced',
        home.poolHasFence
      );
      if (home.poolType) {
        const poolType = await this.returnClosestValue(
          home.poolType,
          await this.returnArray('poolTypes')
        );
        if (poolType) {
          await assignObject(
            dataFile.Location.DwellingInfo,
            'SwimmingPoolType',
            poolType
          );
        }
      }
    }
    await assignObject(
      dataFile.Location.DwellingInfo,
      'DogOnPremises',
      home.hasDogHidden ? home.hasDogHidden : home.hasDogs
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'HeatingType',
      home.heatType
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'ElectricCircuitBreaker',
      null
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'UnderConstruction',
      home.homeUnderConstruction
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'SquareFootage',
      home.totalSquareFootage
    );

    await assignObject(
      dataFile.Location.DwellingInfo,
      'BusinessOnPremises',
      home.hasBusinessConducted ? 'Yes' : 'No'
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'NumberOfEmployees',
      home.numberOfEmployeesWorkingInHome
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'LengthTimeDwellingVacant',
      null
    );
    await assignObject(
      dataFile.Location.DwellingInfo,
      'LengthTimeApplicantPropertyOwned',
      null
    ); //TODO If then Years/Months
    await assignObject(dataFile.Location.DwellingInfo, 'DwellingForSale', null); //TODO
    await assignObject(dataFile.Location.DwellingInfo, 'ResidenceRented', null); //TODO
    await assignObject(
      dataFile.Location.DwellingInfo,
      'NumberOfUnits',
      home.numberOfUnits
    );
    await assignObject(dataFile.Location.DwellingInfo, 'FirstMortgagee', null); //TODO
    await assignObject(dataFile.Location.DwellingInfo, 'SecondMortgagee', null); //TODO
    await assignObject(dataFile.Location.DwellingInfo, 'ThirdMortgagee', null); //TODO
    await assignObject(
      dataFile.Location.DwellingInfo,
      'EquityLineOfCredit',
      null
    ); //TODO
    await assignObject(dataFile.Location.DwellingInfo, 'CoSigner', null); //TODO
    await assignObject(
      dataFile.Location.DwellingInfo,
      'NumberOfOtherInterests',
      null
    ); //TODO

    dataFile.Location.DwellingInfo.ReplacementCostExtended = {};

    /* CoverageInfo */
    dataFile.Location.CoverageInfo = {};
    if (home.estimatedReplacementCost) {
      await assignObject(
        dataFile.Location.CoverageInfo,
        'ReplacementCost',
        home.estimatedReplacementCost
      );
    } else if (home.totalSquareFootage && home.costPerSquareFoot) {
      const replacementCost =
        +home.totalSquareFootage * +home.costPerSquareFoot;
      await assignObject(
        dataFile.Location.CoverageInfo,
        'ReplacementCost',
        replacementCost
      );
    }
    if (home.dwellingCoverage) {
      await assignObject(
        dataFile.Location.CoverageInfo,
        'Dwelling',
        home.dwellingCoverage
      );
    } else if (home.totalSquareFootage && home.costPerSquareFoot) {
      const dwellingCoverage =
        +home.totalSquareFootage * +home.costPerSquareFoot;
      await assignObject(
        dataFile.Location.CoverageInfo,
        'Dwelling',
        dwellingCoverage
      );
    }
    // await assignObject(dataFile.Location.CoverageInfo, 'LossOfUse', home.lossOfUseCoverage);
    await assignObject(
      dataFile.Location.CoverageInfo,
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
      const bestValue = await this.returnClosestValue(
        home.personalLiabilityCoverage,
        personalLiabilityCoverages
      );
      if (bestValue) {
        await assignObject(
          dataFile.Location.CoverageInfo,
          'PersonalLiability',
          bestValue
        );
      }
    }
    if (home.medicalPaymentsCoverage) {
      const medicalPaymentsCoverages = ['1000', '2000', '3000', '4000', '5000'];
      const bestValue = await this.returnClosestValue(
        home.medicalPaymentsCoverage,
        medicalPaymentsCoverages
      );
      if (bestValue) {
        await assignObject(
          dataFile.Location.CoverageInfo,
          'MedicalPayments',
          bestValue
        );
      }
    }
    if (home.allPerilsDeductible || home.theftDeductible) {
      dataFile.Location.CoverageInfo.DeductibeInfo = {};
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
        const bestValue = await this.returnClosestValue(
          home.allPerilsDeductible,
          allPerilsDeductibles
        );
        if (bestValue) {
          await assignObject(
            dataFile.Location.CoverageInfo.DeductibeInfo,
            'Deductible',
            bestValue
          );
        }
      }
    }
    await assignObject(
      dataFile.Location.CoverageInfo,
      'AutomaticIncreaseAtRenewal',
      'None'
    ); // TODO
    dataFile.Location.CoverageInfo.RatingCredits = {};
    // await assignObject(dataFile.Location.CoverageInfo.RatingCredits, 'RetireesCredit', home.retireeDiscount);
    // await assignObject(dataFile.Location.CoverageInfo.RatingCredits, 'MatureDiscount', home.matureDiscount);
    // await assignObject(dataFile.Location.CoverageInfo.RatingCredits, 'RetirementCommunity', home.retirementCommunityDiscount);
    // await assignObject(dataFile.Location.CoverageInfo.RatingCredits, 'LimitedAccessCommunity', home.limitedAccessDiscount);
    await assignObject(
      dataFile.Location.CoverageInfo.RatingCredits,
      'GatedCommunity',
      home.gatedCommunityDiscount
    );
    await assignObject(
      dataFile.Location.CoverageInfo.RatingCredits,
      'Multipolicy',
      home.hasMultiPolicyDiscount
    );
    // await assignObject(dataFile.Location.CoverageInfo.RatingCredits, 'NonSmoker', home.nonSmokerDiscount);

    /*Endorsements*/
    dataFile.Location.Endorsements = {};
    await assignObject(
      dataFile.Location.Endorsements,
      'ExtendedCoverage',
      'Yes'
    ); // TODO

    // if (home.identityTheft == 'Yes') {
    //     dataFile.Location.Endorsements.IdentityTheft = {};
    //     await assignObject(dataFile.Location.Endorsements.IdentityTheft, 'IdentityTheft', 'Yes');
    // }
    // if (home.lossAssessment) {
    //     dataFile.Location.Endorsements.LossAssessment = {};
    //     await assignObject(dataFile.Location.Endorsements.LossAssessment, 'LossAssessment', 'Yes');
    //     await assignObject(dataFile.Location.Endorsements.LossAssessment, 'Amount', home.lossAssessment);
    // }
    if (home.ordinanceOrLaw) {
      dataFile.Location.Endorsements.OrdinanceOrLaw = {};
      await assignObject(
        dataFile.Location.Endorsements.OrdinanceOrLaw,
        'home:OrdinanceOrLaw',
        'Yes'
      );
      await assignObject(
        dataFile.Location.Endorsements.OrdinanceOrLaw,
        'home:Percent',
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
      dataFile.Location.Endorsements.ProtectiveDevices = {};
      dataFile.Endorsements.ProtectiveDevices.SmokeDetector = {};
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices.SmokeDetector,
        'BaseProtectionDevice',
        home.smokeDetectorType
      );
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices.SmokeDetector,
        'FireExtinguisher',
        home.hasFireExtinguisher
      );
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices,
        'Fire',
        home.fireSystemType
      );
      dataFile.Location.Endorsements.ProtectiveDevices.BurglarAlarm = {};
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices.BurglarAlarm,
        'BaseProtectionDevice',
        home.burglarAlarmType
      );
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices.BurglarAlarm,
        'DeadBolt',
        home.hasDeadBoltDiscount
      );
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices.BurglarAlarm,
        'VisibleToNeighbor',
        home.hasVisibleToNeighborDiscount
      );
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices.BurglarAlarm,
        'MannedSecurity',
        home.hasMannedSecurityDiscount
      );
      await assignObject(
        dataFile.Location.Endorsements.ProtectiveDevices,
        'Sprinkler',
        home.sprinklerSystemType
      );
    }

    if (home.increaseReplacementCostPercent) {
      dataFile.Location.Endorsements.ReplacementCostDwelling = {};
      await assignObject(
        dataFile.Location.Endorsements.ReplacementCostDwelling,
        'home:ReplacementCostDwelling',
        'Yes'
      );
      await assignObject(
        dataFile.Location.Endorsements.ReplacementCostDwelling,
        'home:ReplacementCostDwellingPercentage',
        home.increaseReplacementCostPercent
      );
    }
    await assignObject(
      dataFile.Location.Endorsements,
      'VandalismAndMaliciousMischief',
      null
    ); // TODO
    // if (home.replacementCostContent == 'Yes') {
    //     dataFile.Location.Endorsements.ReplacementCostContent = {};
    //     await assignObject(dataFile.Location.Endorsements.ReplacementCostContent, 'ReplacementCostContent', 'Yes');
    // }
    // if (home.waterBackupCoverage) {
    //     dataFile.Location.Endorsements.WaterBackup = {};
    //     await assignObject(dataFile.Location.Endorsements.WaterBackup, 'WaterBackup', 'Yes');
    //     await assignObject(dataFile.Location.Endorsements.WaterBackup, 'Amount', home.waterBackupCoverage);
    // }

    if (returnExists(client.stateCd)) {
      dataFile.GeneralInfo = {};
      dataFile.GeneralInfo['home:RatingStateCode'] = returnValue(
        client.stateCd
      );
    }

    return { status: true, data: dataFile };
  } catch (error) {
    return { status: false, error: error };
  }
}
export async function returnClosestValue(value, array, defaultValue) {
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
          if (isNaN(val)) {
            const bestValue = val
              ? arr[stringSimilarity.findBestMatch(val, arr).bestMatchIndex]
              : null;
            return bestValue;
          } else {
            return null;
          }
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
export async function returnClosestNumberValue(value, array, defaultValue) {
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
          if (isNaN(val)) {
            return null;
          } else {
            const bestValue = arr.reduce(function (prev, curr) {
              return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
            });
            return bestValue ? bestValue.toString() : null;
          }
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
export async function returnDurationValue(value, array) {
  try {
    if (isNaN(value)) {
      return 'More than 15';
    } else {
      return await this.returnClosestNumberValue(value, array);
    }
  } catch (error) {
    return null;
  }
}
export async function returnNumber(value) {
  try {
    if (isNaN(value)) {
      value = value.replace(/\D/g, '');
      if (isNaN(value)) {
        return null;
      }
      return +value;
    }
    return +value;
  } catch (error) {
    return null;
  }
}
export async function returnClosestValueIfClose(value, array, buffer) {
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
    const returnBestValue = async (arr, val) => {
      try {
        if (returnValueIfExists(val)) {
          if (isNaN(val)) {
            const bestMatchIndex =
              stringSimilarity.findBestMatch(val, arr).bestMatch.rating > buffer
                ? stringSimilarity.findBestMatch(val, arr).bestMatchIndex
                : null;
            if (bestMatchIndex === 0 || bestMatchIndex) {
              const bestValue = val
                ? arr[stringSimilarity.findBestMatch(val, arr).bestMatchIndex]
                : null;
              return bestValue;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    };

    const bestValue = await returnBestValue(array, value);

    return bestValue;
  } catch (error) {
    return null;
  }
}
export async function returnArrayByKey(value) {
  switch (value) {
    case 'priorInsuranceCompany':
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
    case 'priorBodilyInjuryLimits':
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
    case 'occupation':
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
    case 'industry':
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
    case 'poolType':
      return [
        'Above Ground with Slide',
        'Above Ground without Slide',
        'In Ground with Slide',
        'In Ground without Slide',
      ];
    case 'homeFoundationType':
      return ['Slab', 'Crawlspace', 'PiersOrPile', 'SuspendedOverHillside'];
    case 'educationLevel':
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
    case 'collision':
      return [
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
    case 'comprehensive':
      return [
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
    case 'residenceType':
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
    case 'vehiclePrimaryUse':
      return [
        'Business',
        'Farming',
        'Pleasure',
        'To/From Work',
        'To/From School',
      ];
    case 'constructionMethod':
      return ['Site Built', 'Modular', 'Manufactured/Mobile', 'Unknown'];
    case 'gender':
      return ['Male', 'Female', 'X - Not Specified'];
    case 'maritalStatus':
      return [
        'Single',
        'Married',
        'Domestic Partner',
        'Widowed',
        'Separated',
        'Divorced',
      ];
    case 'durationYears':
      return [
        '0',
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
        '11',
        '12',
        '13',
        '14',
        '15',
      ];
    case 'accidentDescription':
      return [
        'At Fault With Injury',
        'At Fault With No Injury',
        'Not At Fault',
      ];
    case 'violationDescription':
      return [
        'Careless Driving',
        'Cell Phone',
        'Child Safety Restraint',
        'Defective Equipment',
        'Divided Highways',
        'Double Lines',
        'Driving Left of Center',
        'Driving on Sus. License',
        'Driving too slow',
        'Driving without lights',
        'DUI',
        'Eluding Police',
        'Failure to Obey Signal',
        'Failure to Stop',
        'Failure to Yield',
        'Failure To Observe A Safety Zone',
        'Failure to show documents',
        'False Reporting',
        'Felony',
        'Following too Closely',
        'Homicide',
        'Illegal Turn',
        'Improper Parking',
        'Improper Passing',
        'Improper Loads',
        'Leaving scene of an Accident/Hit and Run',
        'Motorcycle Violation',
        'Other Major',
        'Other Minor',
        'Open Container',
        'Operating Vehicle without Permission',
        'Out of State',
        'Passing School Bus',
        'Racing/Drag Racing',
        'Recreational Vehicle',
        'Refusal to submit to chemical test',
        'Speeding 1-5',
        'Speeding 6-10',
        'Speeding 11-15',
        'Speeding 16-20',
        'Speeding 21+',
        'Speed over 100mph',
        'Speeding Violation-Major',
        'Speeding Violation-Minor',
        'Seat Belt',
        'Suspension',
        'Ticket Violation Not Listed',
        'Towing',
        'Transportation of Hazardous Materials',
        'Unsafe Operation of a Motor Vehicle',
        'Vehicle Theft',
        'Wrong Way/Wrong Lane',
      ];
    case 'damageClaimDescription':
      return [
        'FIRE',
        'HIT ANIMAL',
        'THEFT',
        'TOWING',
        'VANDALISM',
        'GLASS',
        'TORNADO/HURRICANE',
        'FLOOD',
        'WIND/HAIL',
        'ALL OTHER',
      ];
    case 'allPerilsDeductible':
      return [
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
    case 'theftDeductible':
      return [
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
    case 'windDeductible':
      return [
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
    case 'personalLiabilityCoverage':
      return [
        '25000',
        '50000',
        '100000',
        '200000',
        '300000',
        '400000',
        '500000',
      ];
    case 'medicalPaymentsCoverage':
      return ['1000', '2000', '3000', '4000', '5000'];
    case 'policyType':
      return ['HO3', 'HO4', 'HO5', 'HO6'];
    case 'increaseReplacementCostPercent':
      return ['25', '50', '100'];
    case 'waterBackupCoverage':
      return [
        'Full',
        '1000',
        '2000',
        '3000',
        '4000',
        '5000',
        '6000',
        '7000',
        '8000',
        '9000',
        '10000',
        '15000',
        '20000',
        '25000',
        '50000',
      ];
    case 'smokeDetectorType':
      return ['Local', 'Direct', 'Central'];
    case 'burglarAlarmType':
      return ['Local', 'Direct', 'Central'];
    case 'sprinklerSystemType':
      return ['Local', 'Direct', 'Central'];
    case 'fireSystemType':
      return ['Local', 'Direct', 'Central'];
    case 'extraTransportationCoverage':
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
    case 'autoCoverageTerm':
      return ['6 Month', '12 Month'];
    case 'priorPolicyTerm':
      return ['6 Month', '12 Month'];
    case 'hasDaytimeLights':
      return ['Yes', 'No'];
    case 'hasAntiLockBrakes':
      return ['Yes', 'No'];
    case 'passiveRestraintsType':
      return [
        'None',
        'Automatic Seatbelts',
        'Airbag (Drvr Side)',
        'Auto Stbelts/Drvr Airbag',
        'Airbag Both Sides',
        'Auto Stbelts/Airbag Both',
      ];
    case 'antiTheftType':
      return [
        'None',
        'Active',
        'Alarm Only',
        'Passive',
        'Vehicle Recovery System',
        'Both Active and Passive',
        'VIN# Etching',
      ];
  }
}
export async function returnArray(value) {
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
    case 'occupation':
      return [
        'Homemaker/Houseprsn',
        'Retired',
        'Disabled',
        'Unemployed',
        'Graduate Student',
        'High school',
        'Other',
        'Undergraduate',
        'Agr Inspect/Grader',
        'Arborist',
        'Clerk',
        'Equip. Operator',
        'Farm/Ranch Owner',
        'Farm/Ranch Worker',
        'Fisherman',
        'Florist',
        'Laborer/Worker',
        'Landscape/NursryWkr',
        'Landscaper',
        'Logger',
        'Millworker',
        'Other',
        'Ranger',
        'Supervisor',
        'Timber Grader/Scale',
        'Actor',
        'Admin Assist',
        'Announcer/Broadcstr',
        'Artist/Animator',
        'Author/Writer',
        'Choreography/Dancer',
        'Clerk',
        'Composer/Director',
        'Curator',
        'Designer',
        'Editor',
        'Journalist/Reporter',
        'Musician/Singer',
        'Other',
        'Printer',
        'Producer',
        'Production Crew',
        'Projectionist',
        'Receptionist/Sec',
        'Ticket Sales/Usher',
        'Accountant/Auditor',
        'Admin Assist',
        'Analyst/Broker',
        'Bookkeeper',
        'Branch Manager',
        'Clerk',
        'Collections',
        'Consultant',
        'Controller',
        'CSR/Teller',
        'Director/Administr',
        'Executive',
        'Financial Advisor',
        'Investment Banker',
        'Investor',
        'Loan/EscrowProcess',
        'Mgr-Credit/Loan',
        'Mgr-Portfolio/Prod.',
        'Mgr-Property',
        'Other',
        'Realtor',
        'Receptionist/Sec',
        'SalesAgt/Represent.',
        'Trader,Finan Instru',
        'Underwriter',
        'Account Executive',
        'Admin Assist',
        'Buyer',
        'Clerk-Office',
        'Consultant',
        'CSR',
        'Director/Administr',
        'Executive',
        'H.R. Representative',
        'Marketing Researchr',
        'Messenger/Courier',
        'Mgr - District',
        'Mgr - Finance',
        'Mgr-Dept/Store',
        'Mgr-General Opers',
        'Mgr-H.R./PublicRel',
        'Mgr-Mkt/Sales',
        'Mgr/Supervisr-Offic',
        'Other',
        'Receptionist/Sec',
        'Sales-Counter/Rentl',
        'Sales-Home Based',
        'Sales-Mfg Rep',
        'Sales-Retail/Whlsle',
        'Sales-Route/Vendor',
        'Boiler Oper/Maker',
        'Bricklayer/Mason',
        'Carpenter',
        'Carpet Installer',
        'Concrete Worker',
        'Constrct Proj Mgr',
        'Contractor',
        'Crane Operator',
        'Electrician/Linesmn',
        'ElevatorTech/Instl',
        'Equip. Operator',
        'FloorLayer/Finisher',
        'Foreman/Supervisor',
        'Handyman',
        'Heat/Air Technician',
        'Inspector',
        'Laborer/Worker',
        'Metalworker',
        'Miner',
        'Oil/GasDril/RigOpr',
        'Other',
        'Painter',
        'Plstr/Drywall/Stuc',
        'Plumber',
        'Roofer',
        'Admin Assist',
        'Audio-Visual Tech.',
        'Child/DayCare Wrker',
        'Clerk',
        'Counselor',
        'Grad. Teaching/Asst',
        'Instructor-Vocation',
        'Librarian/Curator',
        'Other',
        'Professor, College',
        'Receptionist/Sec',
        'Superintendent',
        'Teacher, College',
        'Teacher, K-12',
        'Teaching Asst/Aide',
        'Tutor',
        'Actuary',
        'Admin Assist',
        'Analyst',
        'Architect',
        'Clerk',
        'Clinical Data Coord.',
        'Drafter',
        'Engineer',
        'Manager-Project',
        'Manager-R&D',
        'Mathematician',
        'Other',
        'Receptionist/Sec',
        'Research Prog. Dir.',
        'Researcher',
        'Scientist',
        'Sociologist',
        'Surveyor/Mapmaker',
        'Technician',
        'Accountant/Auditor',
        'Admin Assist',
        'Analyst',
        'Attorney',
        'Chief Executive',
        'Clerk',
        'Commissioner',
        'Council member',
        'Director/Administr',
        'Enlst Mil Prsnl E1-4',
        'Legislator',
        'Mayor/City Manager',
        'Meter Reader',
        'NCO (E5-9)',
        'Officer-Commissiond',
        'Officer-Warrant',
        'Other',
        'Park Ranger',
        'Planner',
        'Postmaster',
        'Receptionist/Sec',
        'Regulator',
        'US Postal Worker',
        'Admin Assist',
        'Analyst',
        'Clerk',
        'Director/Administr',
        'Engineer-Hardware',
        'Engineer-Software',
        'Engineer-Systems',
        'Executive',
        'Manager-Systems',
        'Network Admin',
        'Other',
        'Programmer',
        'Project Coordinator',
        'Receptionist/Sec',
        'Support Technician',
        'Systems Security',
        'Technical Writer',
        'Web Developer',
        'Accountant/Auditor',
        'Actuarial Clerk',
        'Actuary',
        'Admin Assist',
        'Agent/Broker',
        'Analyst',
        'Attorney',
        'Claims Adjuster',
        'Clerk',
        'Commissioner',
        'CSR',
        'Director/Administr',
        'Executive',
        'Other',
        'Product Manager',
        'Receptionist/Sec',
        'Sales Rep',
        'Underwriter',
        'Airport Sec Ofcr',
        'Animal Control Ofcr',
        'Attorney',
        'Bailiff',
        'Corrections Officer',
        'Court Clrk/Reporter',
        'Deputy Sheriff',
        'Dispatcher',
        'Examiner',
        'Fed Agt/Marshall',
        'Fire Chief',
        'Fire Fighter/Supv.',
        'Gaming Ofcr/Invest',
        'Highway Patrol Ofcr',
        'Judge/Hearing Ofcr',
        'Legal Asst./Sec',
        'Other',
        'Paralegal/Law Clerk',
        'Police Chief',
        'Police Det/Investgr',
        'Police Offcr/Supvr',
        'Process Server',
        'Prvt Invest/Detec.',
        'Security Guard',
        'Sheriff',
        'Bldg Maint Engineer',
        'Custodian/Janitor',
        'Electrician',
        'Field Service Tech.',
        'Handyman',
        'Heat/AirCond Repair',
        'Housekeeper/Maid',
        'Lndscpe/Grnds Maint',
        'Maint Mechanic',
        'Mechanic',
        'Other',
        'Admin Assist',
        'Clerk',
        'Factory Worker',
        'Foreman/Supervisor',
        'Furniture Finisher',
        'Inspector',
        'Jeweler',
        'Machine Operator',
        'Other',
        'Packer',
        'Plant Manager',
        'Printer/Bookbinder',
        'Quality Control',
        'Receptionist/Sec',
        'Refining Operator',
        'Shoemaker',
        'Tailor/Custom Sewer',
        'Textile Worker',
        'Upholsterer',
        'Admin Assist',
        'Assist-Med/Dent/Vet',
        'Clergy',
        'Clerk',
        'Client Care Worker',
        'Dental Hygenist',
        'Dentist',
        'Doctor',
        'Hospice Volunteer',
        'Mortician',
        'Nurse - C.N.A.',
        'Nurse - LPN',
        'Nurse - RN',
        'Nurse Practitioner',
        'Optometrist',
        'Other',
        'Paramedic/EM Tech',
        'Pharmacist',
        'Receptionist/Sec',
        'Social Worker',
        'Support Services',
        'Technician',
        'Therapist',
        'Veterinarian',
        'Caregiver',
        'Dry Cleaner/Laundry',
        'Hair Stylist/Barber',
        'Housekeeper',
        'Manicurist',
        'Masseuse',
        'Nanny',
        'Other',
        'Pet Services',
        'Receptionist/Sec',
        'Baker',
        'Bartender',
        'Bellhop',
        'Bus Person',
        'Caterer',
        'Chef',
        'Concessionaire',
        'Concierge',
        'Cook-Rest/Cafeteria',
        'Cook/Wrkr-Fast Food',
        'Delivery Person',
        'Desk Clerk',
        'Dishwasher',
        'Food Prod/Packing',
        'Host/Maitre d',
        'Housekeeper/Maid',
        'Manager',
        'Other',
        'Valet',
        'Waiter/Waitress',
        'Wine Steward',
        'Activity/Recre.Asst',
        'Admin Assist',
        'Agent',
        'Athlete',
        'CampCounselor/Lead',
        'Clerk',
        'Coach',
        'Concessionaire',
        'Director, Program',
        'Event Mgr/Promoter',
        'Life Guard',
        'Mgr - Fitness Club',
        'Other',
        'Park Ranger',
        'Receptionist/Sec',
        'Sales-Tkt/Mmbrshp',
        'SportsBrdcstr/Journ',
        'Trainer/Instructor',
        'Umpire/Referee',
        'Admin Assist',
        'Air Traffic Control',
        'Airport Ops Crew',
        'Bellhop/Porter',
        'Clerk',
        'Crane Loader/Oper',
        'Dispatcher',
        'Driver-Bus/Strcar',
        'Driver-Taxi/Limo',
        'Driver-Truck/Delvry',
        'Flight Attendant',
        'Forklift Operator',
        'Laborer',
        'Longshoreman',
        'Mate/Sailor',
        'Mgr Warehse/Dist',
        'Other',
        'Parking Lot Attend',
        'Pilot/Capt/Eng',
        'Railroad Worker',
        'Receptionist/Sec',
        'Shipping/RecClk',
        'Subway/LgtRail Oper',
        'Ticket Agent',
        'Transportation Spec',
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
    case 'vehiclePrimaryUse':
      return [
        'Business',
        'Farming',
        'Pleasure',
        'To/From Work',
        'To/From School',
      ];
    case 'constructionMethod':
      return ['Site Built', 'Modular', 'Manufactured/Mobile', 'Unknown'];
    case 'gender':
      return ['Male', 'Female', 'X - Not Specified'];
    case 'maritalStatus':
      return [
        'Single',
        'Married',
        'Domestic Partner',
        'Widowed',
        'Separated',
        'Divorced',
      ];
    case 'durationYears':
      return [
        '0',
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
        '11',
        '12',
        '13',
        '14',
        '15',
      ];
    case 'accidentDescription':
      return [
        'At Fault With Injury',
        'At Fault With No Injury',
        'Not At Fault',
      ];
    case 'violationDescription':
      return [
        'Careless Driving',
        'Cell Phone',
        'Child Safety Restraint',
        'Defective Equipment',
        'Divided Highways',
        'Double Lines',
        'Driving Left of Center',
        'Driving on Sus. License',
        'Driving too slow',
        'Driving without lights',
        'DUI',
        'Eluding Police',
        'Failure to Obey Signal',
        'Failure to Stop',
        'Failure to Yield',
        'Failure To Observe A Safety Zone',
        'Failure to show documents',
        'False Reporting',
        'Felony',
        'Following too Closely',
        'Homicide',
        'Illegal Turn',
        'Improper Parking',
        'Improper Passing',
        'Improper Loads',
        'Leaving scene of an Accident/Hit and Run',
        'Motorcycle Violation',
        'Other Major',
        'Other Minor',
        'Open Container',
        'Operating Vehicle without Permission',
        'Out of State',
        'Passing School Bus',
        'Racing/Drag Racing',
        'Recreational Vehicle',
        'Refusal to submit to chemical test',
        'Speeding 1-5',
        'Speeding 6-10',
        'Speeding 11-15',
        'Speeding 16-20',
        'Speeding 21+',
        'Speed over 100mph',
        'Speeding Violation-Major',
        'Speeding Violation-Minor',
        'Seat Belt',
        'Suspension',
        'Ticket Violation Not Listed',
        'Towing',
        'Transportation of Hazardous Materials',
        'Unsafe Operation of a Motor Vehicle',
        'Vehicle Theft',
        'Wrong Way/Wrong Lane',
      ];
    case 'damageClaimDescription':
      return [
        'FIRE',
        'HIT ANIMAL',
        'THEFT',
        'TOWING',
        'VANDALISM',
        'GLASS',
        'TORNADO/HURRICANE',
        'FLOOD',
        'WIND/HAIL',
        'ALL OTHER',
      ];
    case 'personalInjuryCoverage-KY':
      return [
        'Reject',
        'Basic-10000',
        '20000',
        '30000',
        '40000',
        '50000',
        '75000',
        '100000',
      ];
  }
}
export async function returnOccupation(value) {
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
      occupation: null,
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
    if (!insured.firstName && !insured.lastName) {
      const fullName = await returnValue(client, 'fullName', 'fullName');
      if (fullName) {
        const names = fullName.split(' ');
        if (names[0]) {
          insured.firstName = names[0];
        }
        if (names[1]) {
          insured.lastName = names[1];
        }
      }
    }
    insured.birthday = await returnValue(
      client,
      'birthDate',
      'applicantBirthDt'
    );
    insured.gender = await this.returnClosestValue(
      await returnValue(client, 'gender', 'applicantGenderCd'),
      await this.returnArray('gender')
    );
    if (insured.gender !== 'Male' && insured.gender !== 'Female') {
      insured.gender = null;
    }
    insured.maritalStatus = await this.returnClosestValue(
      await returnValue(client, 'maritalStatus', 'applicantMaritalStatusCd'),
      await this.returnArray('maritalStatus')
    );
    const industry = await returnValue(client, 'industry', 'industry');
    if (industry) {
      const bestIndustry = await this.returnClosestValueIfClose(
        industry,
        await this.returnArrayByKey('industry'),
        0.5
      );
      insured.industry = bestIndustry;
      insured.occupation = await this.returnClosestValueIfClose(
        await returnValue(client, 'occupation', 'applicantOccupationClassCd'),
        await this.returnArray('occupation'),
        0.5
      );
    } else {
      insured.industry = await returnValue(
        client,
        'occupation',
        'applicantOccupationClassCd'
      );
    }
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
export async function returnEZLynxVehicle(
  vehicleYear,
  vehicleMake,
  vehicleModel
) {
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
    ? await this.returnClosestValue(
      vehicleMake.toUpperCase(),
      await getList('getAutoMakes', `<Year>${year}</Year>`),
      null
    )
    : null;
  const model = vehicleModel
    ? await this.returnClosestValue(
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
