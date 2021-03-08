import { formatDate } from "../../../helpers/date.helper"
import { encryption } from '../../../constants/appconstant';
import * as simpleencryptor from 'simple-encryptor';
const encryptor = simpleencryptor.createEncryptor(encryption.key);
export async function returnData(client) {
  try {
    const dataObj = {};
    function returnIfExists(value, label, index?, indexLabel?) {
      return (typeof value != 'undefined' && value) || value === false
        ? index && indexLabel
          ? `${indexLabel + index} - ${label}: ${value} | `
          : `${label}: ${value} | `
        : '';
    }
    function returnExists(key) {
      return typeof key !== 'undefined' && key && key !== null;
    }
    function assignObject(hsKey, xiloKey) {
      if (returnExists(xiloKey)) {
        dataObj[hsKey] = xiloKey;
      }
    }
    assignObject('gen_sCMSPolicyType', 'AUTO');

    assignObject('gen_sCustType', 'Personal');
    assignObject('gen_sClientSource', 'XILO');
    assignObject('gen_nClientStatus', 'New Client');
    assignObject('gen_tProductionDate', formatDate(new Date()));
    assignObject('gen_sStatus', 'New');
    assignObject('gen_sLastName', client.lastName);
    assignObject('gen_sFirstName', client.firstName);
    assignObject('gen_sAddress1', client.streetAddress);
    assignObject('gen_sCity', client.city);
    assignObject('gen_sState', client.stateCd);
    assignObject('gen_sZip', client.postalCd);
    // assignObject('gen_sPhone', ) client.phone;
    // assignObject('gen_sWorkPhone', ) client.phone;
    assignObject('gen_sCellPhone', client.phone);
    // assignObject('gen_sMsgPhone', ) client.phone;
    assignObject('gen_sEmail', client.email);
    assignObject('gen_sTypeOfPolicy', 'Regular');
    assignObject('drv_sRelationship', 'Insured');
    // assignObject('gen_sGAddress', client.streetAddress);
    // assignObject('gen_sGCity', client.city)
    // assignObject('gen_sGState', client.stateCd)
    // assignObject('gen_sGZip', client.postalCd)
    if (client.hasOwnProperty('vehicles') && client.vehicles.length > 0) {
      assignObject('gen_sGZip', client.vehicles[0].applicantPostalCd);
      // assignObject('gen_sGAddress', )(client.streetNumber && client.streetName) ? `${client.streetNumber} ${client.streetName}` : null;
      // assignObject('gen_sGCity', ) client.city;
      // assignObject('gen_sGState', ) client.stateCd;
      for (const j in client.vehicles) {
        const vehicle = client.vehicles[j];
        assignObject(`veh_sMake[${j}]`, vehicle.vehicleManufacturer);
        assignObject(`veh_sModel[${j}]`, vehicle.vehicleModel);
        assignObject(`veh_sYr[${j}]`, vehicle.vehicleModelYear);
        // assignObject(`veh_sSymb[${j}]`, ) '';
        // assignObject(`veh_sTerr[${j}]`, )'';
        // assignObject(`veh_lAddOnEquip[${j}]`, )'';
        // assignObject(`veh_nDriver[${j}]`, )'';
        assignObject(`veh_sUse[${j}]`, vehicle.vehicleUseCd);
        assignObject(
          `veh_nCommuteMileage[${j}]`,
          vehicle.vehicleCommuteMilesDrivenOneWay
        );
        assignObject(`veh_lMileage[${j}]`, vehicle.vehicleAnnualDistance);
        // assignObject(`veh_nGVW[${j}]`, )'';
        // assignObject(`veh_sTowing[${j}]`, )'';
        // assignObject(`veh_sRentRemb[${j}]`, )'';
        assignObject(`veh_sVehicleType[${j}]`, vehicle.vehicleBodyStyle);
        // assignObject(`veh_bFourWD[${j}]`, )'';
        assignObject(`veh_sComp[${j}]`, vehicle.comp);
        assignObject(`veh_sColl[${j}]`, vehicle.collision);
        // assignObject(`veh_sUmPd[${j}]`, )'';
        // assignObject(`veh_bUmPd[${j}]`, )'';
        // assignObject(`veh_sUimPd[${j}]`, )'';
        // assignObject(`veh_bUimPd[${j}]`, )'';
        assignObject(`veh_sVIN[${j}]`, vehicle.vehicleVin);
        assignObject(`veh_sGaragingZip[${j}]`, vehicle.applicantPostalCd);
        dataObj[`gen_sClientNotes`] += returnIfExists(
          vehicle.value,
          'Value',
          j,
          'V'
        );
        dataObj[`gen_sClientNotes`] += returnIfExists(
          vehicle.collision,
          'Collision',
          j,
          'V'
        );
        // assignObject(`veh_bLossPayee[${j}]`, )'';
        // assignObject(`veh_bAdditionalInterest[${j}]`, )'';
        // assignObject(`veh_sLossPayeeName[${j}]`, )'';
        // assignObject(`veh_sLossPayeeAddress[${j}]`, )'';
        // assignObject(`veh_sLossPayeeAddr2[${j}]`, )'';
        // assignObject(`veh_sLossPayeeCity[${j}]`, )'';
        // assignObject(`veh_sLossPayeeState[${j}]`, )'';
        // assignObject(`veh_sLossPayeeZip[${j}]`, )'';
        // assignObject(`prm_sClass[${j}]`, )'';
      }
    }
    if (client.hasOwnProperty('drivers') && client.drivers.length > 0) {
      for (const j in client.drivers) {
        const driver = client.drivers[j];
        assignObject(`drv_sLastName[${j}]`, driver.applicantSurname);
        assignObject(`drv_sFirstName[${j}]`, driver.applicantGivenName);
        // assignObject(`drv_cInitial[${j}]`, ) '';
        assignObject(
          `drv_tBirthDate[${j}]`,
          formatDate(driver.applicantBirthDt)
        );
        // assignObject(`drv_sEmployer[${j}]`, ) '';
        // assignObject(`drv_nPoints[${j}]`, ) '';
        assignObject(`drv_sLicensingState[${j}]`, driver.driverLicenseStateCd);
        assignObject(`drv_sLicenseNum[${j}]`, driver.driverLicenseNumber);
        // assignObject(`drv_bExcluded[${j}]`, ) '';
        // assignObject(`drv_bPrincipleOperator[${j}]`, ) '';
        // assignObject(`drv_bOnlyOperator[${j}]`, ) '';
        // assignObject(`drv_bNonDriver[${j}]`, ) '';
        assignObject(
          `drv_sDriversOccupation[${j}]`,
          driver.applicantOccupationClassCd
        );
        assignObject(
          `drv_sSex[${j}]`,
          driver.applicantGenderCd ? driver.applicantGenderCd.charAt(0) : null
        );
        assignObject(
          `drv_sMaritalStatus[${j}]`,
          driver.applicantMaritalStatusCd
        );
        assignObject(`drv_bFiling[${j}]`, driver.needsSR22);
        // assignObject(`drv_sFilingState[${j}]`, ) '';
        // assignObject(`drv_sFilingReason[${j}]`, ) '';
        assignObject(
          `drv_tDateLicensed[${j}]`,
          formatDate(driver.driverLicensedDt)
        );
        // assignObject(`drv_tHiredDate[${j}]`, ) '';
        // assignObject(`drv_tDateOfCDL[${j}]`, ) '';
        assignObject(`drv_bGoodStudent[${j}]`, driver.hasGoodStudentDiscount);
        // assignObject(`drv_bDriverTraining[${j}]`, ) '';
        assignObject(`drv_bDefDrvr[${j}]`, driver.hasDefensiveDriverDiscount);
        assignObject(
          `drv_sSSNum[${j}]`,
          await this.returnSSN(driver.ssnU, 'driver', j)
        );
      }
    }

    dataObj[`gen_sClientNotes`] += returnIfExists(
      client.wantsLiabilityCoverage,
      'Wants $100K Liability Or Less'
    );
    dataObj[`gen_sClientNotes`] += returnIfExists(
      client.hasViolations,
      'Has Violations'
    );
    dataObj[`gen_sClientNotes`] += returnIfExists(
      client.hasOtherLicensedDrivers,
      'Has Other Drivers'
    );
    dataObj[`gen_sClientNotes`] += returnIfExists(
      client.timeToQuote,
      'Wants Quote'
    );

    // HOME INSURANCE
    if (
      client.hasOwnProperty('homes') &&
      client.homes.length > 0 &&
      returnExists(client.homes[0].yearBuilt)
    ) {
      assignObject('gen_sForm', 'HOME');
      assignObject('gen_sCMSPolicyType', 'HOME');
      assignObject('gen_sGAddress', client.homes[0].streetAddress);
      assignObject('gen_sGCity', client.homes[0].city);
      assignObject('gen_sGState', client.homes[0].stateCd);
      assignObject('gen_sGZip', client.homes[0].postalCd);
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.timeToQuote,
        'Wants Quote'
      );
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.maritalStatus,
        'Marital Status'
      );
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.homes[0].numberOfFamilies,
        'Number Of Families'
      );
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.homes[0].typeOfBusiness,
        'Business Type'
      );
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.homes[0].ownerOrTenants,
        'Resides In Home'
      );
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.homes[0].hasWildPets,
        'Wild Pets'
      );
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.homes[0].hasPool,
        'Pool'
      );
      dataObj[`gen_sClientNotes`] += returnIfExists(
        client.homes[0].hasBasement,
        'Basement'
      );
      assignObject('gen_nYearBuilt', client.homes[0].yearBuilt);
      assignObject('gen_sConstruction', client.homes[0].homeType);
      assignObject('gen_sBurgAlarm', client.homes[0].hasAlarmSystem);
      assignObject('gen_sFireAlarm', client.homes[0].hasFireAlarmDiscount);
      assignObject('gen_lJewelry', client.homes[0].jewleryAmount);
      assignObject('gen_lFurs', client.homes[0].fursAmount);
      assignObject('gen_lGuns', client.homes[0].gunsAmount);
      assignObject('gen_lFineArt', client.homes[0].fineArtsAmount);
    }

    // COMMERCIAL
    if (client && client.business) {
      assignObject('gen_sCustType', 'Commercial');
      assignObject('gen_sACORDTypeCode', 'BOP');
      assignObject('gen_sCMSPolicyType', 'NONE');
      assignObject('gen_sTypeOfPolicy', 'Regular');
      assignObject('gen_sCompany', client.business.entityName);
      assignObject('gen_bBusinessType', client.business.entityType);
      assignObject('gen_sBusinessName', client.business.entityName);
      assignObject('gen_sDBAName', client.business.dba);
      // assignObject('gen_sBusinessLicense', ) '';
      assignObject('gen_sWebsite', client.business.website);
      assignObject('gen_lClientOffice', client.phone);
      // assignObject('gen_sPolicyType', ) 'XXXXX';
      assignObject('gen_sAddress1', client.business.streetAddress);
      assignObject('gen_sCity', client.business.city);
      assignObject('gen_sState', client.business.state);
      assignObject('gen_sZip', client.business.zipCode);
    }
    // assignObject('gen_sLOBCode', ) 'XXXXX';

    return { status: true, data: dataObj };
  } catch (error) {
    return { status: false, error: error };
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
