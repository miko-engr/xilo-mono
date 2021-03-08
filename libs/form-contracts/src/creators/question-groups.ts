import { v4 as uuid } from 'uuid';
import { questionComponents } from './questions';

const vehicleSelection = (isCustomerForm = false) => {
  return {
    id: 0,
    label: 'Vehicle Selection',
    value: 'vehicleSelection',
    src: 'assets/icons/select-menu.svg',
    type: 'question-group',
    wrappers: ['question-panel'],
    key: uuid(),
    templateOptions: {
      label: "Can you tell us which vehicle you're insuring?",
    },
    fieldGroup: [
      questionComponents.vin(isCustomerForm),
      questionComponents.vehicleYear(isCustomerForm),
      questionComponents.vehicleMake(isCustomerForm),
      questionComponents.vehicleModel(isCustomerForm),
      questionComponents.bodyStyle(isCustomerForm),
    ],
  };
};

const vehicleUsage = (isCustomerForm = false) => {
  return {
    id: 1,
    label: 'Vehicle Usage',
    value: 'vehicleUsage',
    src: 'assets/icons/select-menu.svg',
    type: 'question-group',
    wrappers: ['question-panel'],
    key: uuid(),
    templateOptions: {
      label: 'How do you primarily use the vehicle',
    },
    fieldGroup: [
      questionComponents.primaryUse(isCustomerForm),
      questionComponents.ownershipType(isCustomerForm),
      questionComponents.purchaseDate(isCustomerForm),
      questionComponents.annualMiles(isCustomerForm),
    ],
  };
};

const driverInfo = (isCustomerForm = false) => {
  return {
    id: 2,
    label: 'Driver Info',
    value: 'driverInfo',
    src: 'assets/icons/select-menu.svg',
    type: 'question-group',
    wrappers: ['question-panel'],
    key: uuid(),
    templateOptions: {
      label: 'Can you tell us about yourself?',
    },
    fieldGroup: [
      questionComponents.firstName(isCustomerForm),
      questionComponents.lastName(isCustomerForm),
      questionComponents.birthday(isCustomerForm),
    ],
  };
};

const driverGender = (isCustomerForm = false) => {
  return {
    id: 3,
    label: 'Driver Gender',
    value: 'driverGender',
    src: 'assets/icons/select-menu.svg',
    type: 'question-group',
    wrappers: ['question-panel'],
    key: uuid(),
    templateOptions: {
      label: 'What is your gender?',
    },
    fieldGroup: [questionComponents.gender(isCustomerForm)],
  };
};
const driverOccupation = (isCustomerForm = false) => {
  return {
    id: 4,
    label: 'Driver Occupation',
    value: 'driverOccupation',
    src: 'assets/icons/select-menu.svg',
    type: 'question-group',
    wrappers: ['question-panel'],
    key: uuid(),
    templateOptions: {
      label: 'What do you do for a living?',
    },
    fieldGroup: [
      questionComponents.educationLevel(isCustomerForm),
      questionComponents.industry(isCustomerForm),
      questionComponents.occupation(isCustomerForm),
    ],
  };
};
const driverLicense = (isCustomerForm = false) => {
  return {
    id: 4,
    label: 'Driver License',
    value: 'driverLicense',
    src: 'assets/icons/select-menu.svg',
    type: 'question-group',
    wrappers: ['question-panel'],
    key: uuid(),
    templateOptions: {
      label: 'What about your license information?',
    },
    fieldGroup: [
      questionComponents.driversLicenseNumber(isCustomerForm),
      questionComponents.licenseState(isCustomerForm),
      questionComponents.ageLicensed(isCustomerForm),
    ],
  };
};

export const questionGroupComponents = {
  vehicleSelection,
  vehicleUsage,
  driverInfo,
  driverGender,
  driverOccupation,
  driverLicense,
};
