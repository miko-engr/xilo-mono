import { v4 as uuid } from 'uuid';
import { questionComponents } from './questions';
import { questionGroupComponents } from './question-groups';

export const customerSections = () => {
  return [
    driver(true),
    vehicle(true),
    insured(),
    coInsured(),
    homeProperty(),
    business(),
    location(),
    policy(),
  ];
};

export const intakeSections = () => {
  return [
    driver(false),
    vehicle(false),
    insured(),
    coInsured(),
    homeProperty(),
    business(),
    location(),
    policy(),
  ];
};

export const driver = (isCustomerForm = false) => {
  let fieldGroup = [];
  if (isCustomerForm) {
    fieldGroup = [
      questionGroupComponents.driverInfo(true),
      questionGroupComponents.driverGender(true),
      questionGroupComponents.driverOccupation(true),
      questionGroupComponents.driverLicense(true),
    ];
  } else {
    fieldGroup = [
      questionComponents.firstName(isCustomerForm),
      questionComponents.lastName(isCustomerForm),
      questionComponents.birthday(isCustomerForm),
      questionComponents.gender(isCustomerForm),
      questionComponents.maritalStatus(isCustomerForm),
      questionComponents.relationship(isCustomerForm),
      questionComponents.industry(isCustomerForm),
      questionComponents.occupation(isCustomerForm),
      questionComponents.educationLevel(isCustomerForm),
      questionComponents.driversLicenseNumber(isCustomerForm),
      questionComponents.licenseState(isCustomerForm),
      questionComponents.ageLicensed(isCustomerForm),
    ];
  }
  return {
    id: 0,
    icon: 'icon_section_driver',
    label: 'Drivers',
    key: uuid(),
    type: isCustomerForm ? 'customer-repeat' : 'intake-repeat',
    fieldArray: {
      type: isCustomerForm ? 'customer-section' : 'intake-section',
      wrappers: ['section-panel'],
      fieldGroup,
      templateOptions: {
        label: 'Driver',
        hasRepeatButtons: true,
      },
    },
    templateOptions: {
      label: 'Driver',
      subIndex: 0,
    },
  };
};

const vehicle = (isCustomerForm = false) => {
  let fieldGroup = [];
  if (isCustomerForm) {
    fieldGroup = [
      questionGroupComponents.vehicleSelection(true),
      questionGroupComponents.vehicleUsage(true),
    ];
  } else {
    fieldGroup = [
      questionComponents.vin(isCustomerForm),
      questionComponents.vehicleYear(isCustomerForm),
      questionComponents.vehicleMake(isCustomerForm),
      questionComponents.vehicleModel(isCustomerForm),
      questionComponents.bodyStyle(isCustomerForm),
      questionComponents.primaryUse(isCustomerForm),
      questionComponents.ownershipType(isCustomerForm),
      questionComponents.purchaseDate(isCustomerForm),
      questionComponents.annualMiles(isCustomerForm),
    ];
  }
  return {
    id: 1,
    label: 'Vehicle',
    icon: 'icon_section_auto',
    key: uuid(),
    type: isCustomerForm ? 'customer-repeat' : 'intake-repeat',
    fieldArray: {
      type: isCustomerForm ? 'customer-section' : 'intake-section',
      wrappers: ['section-panel'],
      fieldGroup,
      templateOptions: {
        label: 'Vehicle',
        hasRepeatButtons: true,
      },
    },
    templateOptions: {
      label: 'Vehicle',
      subIndex: 0,
    },
  };
};

const insured = () => {
  return {
    id: 2,
    label: 'Insured',
    icon: 'icon_section_insured',
  };
};
const coInsured = () => {
  return {
    id: 3,
    label: 'Co-insured',
    icon: 'icon_section_co_insured',
  };
};
const homeProperty = () => {
  return {
    id: 4,
    label: 'Home property',
    icon: 'icon_section_home_property',
  };
};
const business = () => {
  return {
    id: 5,
    label: 'Business',
    icon: 'icon_section_business',
  };
};
const location = () => {
  return {
    id: 6,
    label: 'Location',
    icon: 'icon_section_location',
  };
};
const policy = () => {
  return {
    id: 7,
    label: 'Policy',
    icon: 'icon_section_policy',
  };
};

const incident = (isCustomerForm = false) => {
  return {
    id: 8,
    label: 'Incident',
    icon: 'icon_section_policy',
    key: uuid(),
    type: isCustomerForm ? 'customer-repeat' : 'intake-repeat',
    wrappers: [],
    fieldArray: {
      type: isCustomerForm ? 'customer-section' : 'intake-section',
      wrappers: ['section-panel'],
      fieldGroup: [
        questionComponents.hasIncident(isCustomerForm),
        questionComponents.incidentDescription(isCustomerForm),
        questionComponents.incidentDate(isCustomerForm),
      ],
      templateOptions: {
        label: 'Incident',
        hasRepeatButtons: true,
      },
    },
    templateOptions: {
      label: 'Incident',
      subIndex: 0,
    },
  };
};

const additionalInterest = () => {
  return {
    id: 9,
    label: 'Additional Interest',
    icon: 'icon_section_additional_interest',
  };
};

const priorInsurance = (isCustomerForm = false) => {
  return {
    id: 10,
    label: 'Prior Insurance',
    icon: 'icon_section_additional_interest',
    key: uuid(),
    type: isCustomerForm ? 'customer-section' : 'intake-section',
    wrappers: ['section-panel'],
    fieldGroup: [
      {
        key: uuid(),
        type: 'address',
        templateOptions: {
          label: 'Current Address',
          required: '',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          placeholder: 'Current Address',
        },
      },
      questionComponents.email(isCustomerForm),
      questionComponents.phone(isCustomerForm),
      {
        key: uuid(),
        type: 'checkbox',
        templateOptions: {
          text: 'Has Prior Insurance',
          label: 'Checkbox',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          placeholder: 'Checkbox',
        },
      },
    ],
    templateOptions: {
      label: 'Insurance',
    },
  };
};

export const sectionComponents = {
  driver,
  vehicle,
  insured,
  coInsured,
  homeProperty,
  business,
  location,
  policy,
  incident,
  additionalInterest,
  priorInsurance,
};
