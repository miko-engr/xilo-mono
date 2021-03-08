export async function returnData(client) {
  const dataObj = {};
  dataObj['FullName'] = client.firstName + ' ' + client.lastName;
  dataObj['FirstName'] = client.firstName;

  //dataObj['MiddleInitial'];
  dataObj['LastName'] = client.lastName;
  //dataObj['Suffix'];
  //dataObj['Prefix'];
  //dataObj['Company'];
  //dataObj['Salutation'];
  dataObj['MailingAddress1'] = client.streetAddress;
  //dataObj['MailingAddress2'];
  dataObj['MailingCity'] = client.city;
  dataObj['MailingState'] = client.stateCd;
  dataObj['MailingZipCode'] = client.postalCd;
  //dataObj['MailingCounty'];
  dataObj['PhysicalAddress1'] = client.streetAddress;
  //dataObj['PhysicalAddress2'];
  dataObj['PhysicalCity'] = client.city;
  dataObj['PhysicalState'] = client.stateCd;
  dataObj['PhyscialZipCode'] = client.postalCd;
  //dataObj['PhysicalCounty'];
  dataObj['PhoneNumber1'] = client.phone;
  //dataObj['PhoneType1'];
  //dataObj['PhoneNumber2'];
  //dataObj['PhoneType2'];
  //dataObj['PhoneNumber3'];
  //dataObj['PhoneType3'];
  //dataObj['PhoneNumber4'];
  //dataObj['PhoneType4'];
  //dataObj['PhoneNumber5'];
  //dataObj['PhoneType5'];
  //dataObj['PhoneNumber6'];
  //dataObj['PhoneType6'];
  dataObj['EmailAddress1'] = client.email;
  //dataObj['EmailType1'];
  //dataObj['EmailAddress2'];
  //dataObj['EmailType2'];
  //dataObj['EmailAddress3'];
  //dataObj['EmailType3'];
  //dataObj['WebSite1'];
  //dataObj['WebSite2'];
  dataObj['DateOfBirth'] = client.birthDate;
  //dataObj['SocialSecurityNumber'];
  dataObj['Gender'] = client.gender;
  if (client.drivers && client.drivers.length && client.drivers.length > 0) {
    dataObj['LicenseNumber'] = client.drivers[0].driverLicenseNumber;
    dataObj['LicenseIssuedDate'] = client.drivers[0].driverLicenseDt;
    dataObj['LicenseState'] = client.drivers[0].driverLicenseStateCd;
  }
  //dataObj['LicenseExpirationDate'];
  if (client.company) {
    dataObj['Agency'] = client.company.name;
    dataObj['AgencyID'] = client.company.xanatekAgencyId;
  }
  if (client.agent) {
    dataObj['Producer'] = client.agent.name;
    dataObj['ProducerID'] = client.agent.xanatekProducerID;
    dataObj['CSR'] = client.agent.xanatekCSRId;
    dataObj['CSRID'] = client.agent.xanatekCSRId;
  }
  dataObj['CustomerTyper'] = 'P';
  dataObj['CustomerLine'] = 'P';
  //dataObj['ReferredBy'];
  //dataObj['Comments'];
  //dataObj['AdditionalField01'];
  //dataObj['AdditionalField02'];
  //dataObj['AdditionalField03'];
  //dataObj['AdditionalField04'];
  //dataObj['AdditionalField05'];
  //dataObj['AdditionalField06'];
  //dataObj['AdditionalField07'];
  //dataObj['AdditionalField08'];
  //dataObj['AdditionalField09'];
  //dataObj['AdditionalField10'];
  //dataObj['AdditionalField11'];
  //dataObj['AdditionalField12'];
  if (client.drivers && client.drivers.length && client.drivers.length > 1) {
    dataObj['SecondaryFullName'] =
      client.drivers[1].applicantGivenName +
      ' ' +
      client.drivers[1].applicantSurname;
    dataObj['SecondaryFirstName'] = client.drivers[1].applicantGivenName;
    dataObj['SecondaryMiddleInitial'] =
      client.drivers[1].applicantMiddleInitial;
    dataObj['SecondaryLastName'] = client.drivers[1].applicantSurname;
    dataObj['SecondarySuffix'] = client.drivers[1].applicantNameSuffix;
    //dataObj['SecondaryPrefix'];
    //dataObj['SecondaryCompany'];
    //dataObj['SecondarySalutation'];
    //dataObj['SecondaryMailingAddress1'];
    //dataObj['SecondaryMailingAddress2'];
    //dataObj['SecondaryMailingCity'];
    //dataObj['SecondaryMailingState'];
    //dataObj['SecondaryMailingZipCode'];
    //dataObj['SecondaryMailingCounty'];
    //dataObj['SecondaryPhysicalAddress1'];
    //dataObj['SecondaryPhysicalAddress2'];
    //dataObj['SecondaryPhysicalCity'];
    //dataObj['SecondaryPhysicalState'];
    //dataObj['SecondaryPhysicalZipCode'];
    //dataObj['SecondaryPhysicalCounty'];
    dataObj['SecondaryPhoneNumber1'] =
      client.drivers[1].applicantCommPhoneNumber;
    //dataObj['SecondaryPhoneType1'];
    //dataObj['SecondaryPhoneNumber2'];
    //dataObj['SecondaryPhoneType2'];
    //dataObj['SecondaryPhoneNumber3'];
    //dataObj['SecondaryPhoneType3'];
    //dataObj['SecondaryPhoneNumber4'];
    //dataObj['SecondaryPhoneType4'];
    //dataObj['SecondaryPhoneNumber5'];
    //dataObj['SecondaryPhoneType5'];
    //dataObj['SecondaryPhoneNumber6'];
    //dataObj['SecondaryPhoneType6'];
    dataObj['SecondaryEmailAddress1'] =
      client.drivers[1].applicantCommEmailAddress;
    //dataObj['SecondaryEmailType1'];
    //dataObj['SecondaryEmailAddress2'];
    //dataObj['SecondaryEmailType2'];
    //dataObj['SecondaryEmailAddress3'];
    //dataObj['SecondaryEmailType3'];
    //dataObj['SecondaryWebsite1'];
    //dataObj['SecondaryWebsite2'];
    dataObj['SecondaryDateofBirth'] = client.drivers[1].applicantBirthDt;
    //dataObj['SecondarySocialSecurityNumber'];
    dataObj['SecondaryGender'] = client.drivers[1].applicantGenderCd;
    dataObj['SecondaryLicenseNumber'] = client.drivers[1].driverLicenseNumber;
    dataObj['SecondaryLicenseIssuedDate'] = client.drivers[1].driverLicensedDt;
    //dataObj['SecondaryLicenseExpirationDate'];
    dataObj['SecondaryLicenseState'] = client.drivers[1].driverLicenseStateCd;
  }

  return dataObj;
}
