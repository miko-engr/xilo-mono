
export const returnAutoData = async (client) => {
  try {
    const data = {
      insured: returnClientJSON(client),
      driversList: returnDrivers(client),
      vehicleList: returnVehicles(client),
      propertyData: returnPropertyJSON(client)
    }

    return { status: true, data }
  } catch (error) {
    return { status: false, error }
  }
}

const returnExists = async (value) => {
  if ((value && value !== 'undefined' && typeof value !== 'undefined' && value !== null) || value === false) {
    return true
  }
  return false
}

const returnVehicles = async (client) => {
  const vehicleObj = client.vehicles.map((item) => ({
    // "database_id": "1f603b0f-64c7-4f86-b080-68d60139b56d",
    type: '',
    year: item.vehicleModelYear || 1,
    make: item.vehicleModel,
    model: item.vehicleModel,
    vin: item.vehicleVin,
    description: item.vehicleBodyStyle,
    type_of_use: item.vehicleUseCd,
    typeOfUseAsFlag: 1,
    value: item.value,
    deductible_comprehensive: 1,
    deductible_collision: item.collision,
    visible: true,
    // "policy_numbers": [
    //     "sample string 1",
    //     "sample string 2"
    // ],
    insured_email: client.email,
    insured_first_name: client.firstName,
    insured_last_name: client.lastName,
    insured_commercial_name: '',
  }))
  return vehicleObj
}

const returnDrivers = async (client) => {
  const driverObj = client.drivers.map((item) => ({
    // "database_id": "862793ee-9da1-43ac-98dc-27f8902d683e",
    first_name: item.applicantGivenName,
    middle_name: item.applicantMiddleInitial,
    last_name: item.applicantSurname,
    date_of_birth: returnExists(item.applicantBirthDt) ? returnNewDate(new Date(item.applicantBirthDt), 0) : null,
    ssn: item.ssnU,
    excluded: true,
    license_number: item.driverLicenseNumber,
    license_state: item.driverLicenseStateCd,
    license_year: item.yearLicenseIssued || 1,
    hire_date: item.hireDate || '2019-09-25T03:40:50.80533-05:00',
    termination_date: '2019-09-25T03:40:50.80533-05:00',
    // "policy_numbers": [
    //     "sample string 1",
    //     "sample string 2"
    // ],
    insured_email: client.email,
    insured_first_name: client.firstName,
    insured_last_name: client.lastName,
    insured_commercial_name: ''
  }))
  return driverObj
}

export const returnNewDate = async (date, daysAfter) => {
  const newDate = new Date(date)
  const dd = newDate.getDate() + daysAfter
  const mm = newDate.getMonth() + 1
  const y = newDate.getFullYear()
  return (`${y}-${mm}-${dd}`)
}

const returnClientJSON = async (client) => ({
  commercialName: '',
  firstName: client.firstName,
  lastName: client.lastName,
  type: 0,
  addressLine1: client.fullAddress,
  addressLine2: client.hasSecondAddress,
  state: client.stateCd,
  city: client.city,
  zipCode: client.postalCd,
  eMail: client.email,
  eMail2: '',
  eMail3: '',
  fax: '',
  phone: client.phone,
  cellPhone: client.referrersPhone,
  smsPhone: '',
  description: '',
  active: true,
  website: '',
  fein: '',
  customerId: '',
  insuredId: '',
  referralSourceCompanyName: '',
  primaryAgencyOfficeLocationName: '',
  tagName: client.tag,
  tagDescription: ''
})

const returnPropertyJSON = async (client) => {
  const homeData = client.homes
  const property = {
    // "databaseId": "a4af4770-c40e-4ce5-8493-9112d1fc5885",
    propertyUse: '',
    locationNumber: '',
    buildingNumber: homeData.streetNumber,
    addressLine1: homeData.streetName || '394 Kiger Hill Rd',
    addressLine2: '',
    city: homeData.city || 'Mount Morris',
    county: '',
    zip: homeData.zipCode || 15349,
    descriptionOfOperations: '',
    description: '',
    state: homeData.state || 'Pennsylvania',
    insuredEmail: client.email,
    insuredFirstName: client.firstName,
    insuredLastName: client.lastName,
    insuredCommercialName: '',
    attachToPolicyNumber: '',
    coverage: {
      propertyTypeCd: 0,
      dwelling_A: {
        limit: 1.0,
        premium: 1.0
      },
      otherStructures_B: {
        limit: 1.0,
        premium: 1.0
      },
      personalProperty_C: {
        limit: 1.0,
        premium: 1.0
      },
      lossOfUse_D: {
        limit: 1.0,
        premium: 1.0
      },
      personalLiability_E: {
        limit: 1.0,
        premium: 1.0
      },
      medicalPayments_F: {
        limit: 1.0,
        premium: 1.0
      },
      allOtherPerils: {
        deductible: 1.0,
        deductiblePct: 1.0
      },
      hurricane: {
        premium: 1.0,
        deductible: 1.0,
        deductiblePct: 1.0
      },
      incOrdinanceOrLaw: {
        yesNo: 0,
        premium: 1.0
      },
      coverageCs: [
        {
          name: '',
          description: '',
          limitCsl: 1.0,
          limit1: 1.0,
          limit2: 1.0,
          premium: 1.0,
          deductible: 1.0,
          deductiblePct: 1.0
        },
        {
          name: '',
          description: '',
          limitCsl: 1.0,
          limit1: 1.0,
          limit2: 1.0,
          premium: 1.0,
          deductible: 1.0,
          deductiblePct: 1.0
        }
      ]
    }
  }
  return property
}
