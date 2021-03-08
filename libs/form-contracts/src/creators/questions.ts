import { v4 as uuid } from 'uuid';

const statesList = [
  {label: 'AL', value: 'AL'},
  {label: 'AK', value: 'AK'},
  {label: 'AZ', value: 'AZ'},
  {label: 'AR', value: 'AR'},
  {label: 'CA', value: 'CA'},
  {label: 'CO', value: 'CO'},
  {label: 'CT', value: 'CT'},
  {label: 'DE', value: 'DE'},
  {label: 'DC', value: 'DC'},
  {label: 'FL', value: 'FL'},
  {label: 'GA', value: 'GA'},
  {label: 'HI', value: 'HI'},
  {label: 'ID', value: 'ID'},
  {label: 'IL', value: 'IL'},
  {label: 'IN', value: 'IN'},
  {label: 'IA', value: 'IA'},
  {label: 'KS', value: 'KS'},
  {label: 'KY', value: 'KY'},
  {label: 'LA', value: 'LA'},
  {label: 'ME', value: 'ME'},
  {label: 'MD', value: 'MD'},
  {label: 'MA', value: 'MA'},
  {label: 'MI', value: 'MI'},
  {label: 'MN', value: 'MN'},
  {label: 'MS', value: 'MS'},
  {label: 'MO', value: 'MO'},
  {label: 'MT', value: 'MT'},
  {label: 'NE', value: 'NE'},
  {label: 'NV', value: 'NV'},
  {label: 'NH', value: 'NH'},
  {label: 'NJ', value: 'NJ'},
  {label: 'NM', value: 'NM'},
  {label: 'NY', value: 'NY'},
  {label: 'NC', value: 'NC'},
  {label: 'ND', value: 'ND'},
  {label: 'OH', value: 'OH'},
  {label: 'OK', value: 'OK'},
  {label: 'OR', value: 'OR'},
  {label: 'PA', value: 'PA'},
  {label: 'RI', value: 'RI'},
  {label: 'SC', value: 'SC'},
  {label: 'SD', value: 'SD'},
  {label: 'TN', value: 'TN'},
  {label: 'TX', value: 'TX'},
  {label: 'UT', value: 'UT'},
  {label: 'VT', value: 'VT'},
  {label: 'VA', value: 'VA'},
  {label: 'WA', value: 'WA'},
  {label: 'WV', value: 'WV'},
  {label: 'WI', value: 'WI'},
  {label: 'WY', value: 'WY'}
];

const firstName = (isCustomerForm = false, type = 'input', required = true) => {
  return {
    key: uuid(),
    type,
    templateOptions: {
      label: 'First Name',
      required,
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'First Name',
    },
  };
};

const lastName = (isCustomerForm = false, type = 'input', required = true) => {
  return {
    key: uuid(),
    type,
    templateOptions: {
      label: 'Last Name',
      required,
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Last Name',
    },
  };
};

const companyName = (isCustomerForm = false, type = 'input', required = true) => {
  return {
    key: uuid(),
    label: 'Company Name',
    value: 'companyName',
    src: 'assets/icons/input.svg',
    type: 'companyName',
    templateOptions: {
      label: 'Company Name',
      required,
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Company Name',
    },
  };
};

const birthday = (isCustomerForm = false) => {
  return {
    type: 'input',
    key: uuid(),
    templateOptions: {
      type: 'date',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Birthday',
      placeholder: 'Birthday',
    },
  };
};

const gender = (isCustomerForm = false) => {
  return {
    type: 'radio',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'customer-radio' : 'intake-radio',
      label: 'Gender',
      placeholder: 'Radio',
      options: [
        {
          label: 'Male',
          value: 'Male',
        },
        {
          label: 'Female',
          value: 'Female',
        },
      ],
    },
  };
};

const maritalStatus = (isCustomerForm = false) => {
  return {
    type: 'select',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Marital Status',
      placeholder: 'Marital Status',
      options: [
        {
          label: 'Married',
          value: 'Married',
        },
        {
          label: 'Single',
          value: 'Single',
        },
        {
          label: 'Separated',
          value: 'Separated',
        },
        {
          label: 'Divorced',
          value: 'Divorced',
        },
        {
          label: 'Widowed',
          value: 'Widowed',
        },
        {
          label: 'Domestic Partner',
          value: 'Domestic Partner',
        },
      ],
    },
  };
};

const relationship = (isCustomerForm = false) => {
  return {
    type: 'select',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Relationship',
      placeholder: 'Relationship',
      options: [
        {
          label: 'Insured',
          value: 'Insured',
        },
        {
          label: 'Child',
          value: 'Child',
        },
        {
          label: 'Employee',
          value: 'Employee',
        },
        {
          label: 'Other',
          value: 'Other',
        },
        {
          label: 'Parent',
          value: 'Parent',
        },
        {
          label: 'Relative',
          value: 'Relative',
        },
        {
          label: 'Spouse',
          value: 'Spouse',
        },
      ],
    },
  };
};

const industry = (isCustomerForm = false) => {
  return {
    type: 'select',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Industry',
      placeholder: 'Industry',
      dataKey: 'industry'
    },
  };
};

const occupation = (isCustomerForm = false) => {
  return {
    type: 'select',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Occupation',
      placeholder: 'Occupation',
      dataKey: 'occupation'
    },
  };
};

const educationLevel = (isCustomerForm = false) => {
  return {
    type: 'select',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Education Level',
      placeholder: 'Education Level',
      options: [
        {
          label: 'No High School Diploma',
          value: 'No High School Diploma',
        },
        {
          label: 'Some College - No Degree',
          value: 'Some College - No Degree',
        },
        {
          label: 'Vocational/Technical Degree',
          value: 'Vocational/Technical Degree',
        },
        {
          label: 'Associates Degree',
          value: 'Associates Degree',
        },
        {
          label: 'Bachelors',
          value: 'Bachelors',
        },
        {
          label: 'Masters',
          value: 'Masters',
        },
        {
          label: 'Phd',
          value: 'Phd',
        },
        {
          label: 'Medical Degree',
          value: 'Medical Degree',
        },
        {
          label: 'Law Degree',
          value: 'Law Degree',
        },
      ],
    },
  };
};

const driversLicenseNumber = (isCustomerForm = false) => {
  return {
    type: 'input',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: "Driver's License Number",
      placeholder: "Driver's License Number",
      required: '',
    },
  };
};

const licenseState = (isCustomerForm = false) => {
  return {
    type: 'select',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'License State',
      placeholder: 'License State',
      options: statesList,
    },
  };
};

const ageLicensed = (isCustomerForm = false) => {
  return {
    type: 'input',
    key: uuid(),
    templateOptions: {
      type: 'number',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Age Licensed',
      placeholder: 'Age Licensed',
      min: '14',
    },
  };
};

const vin = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'input',
    templateOptions: {
      label: 'VIN',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'VIN',
      dataKey: 'vin'
    },
  };
};

const vehicleYear = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'select',
    templateOptions: {
      label: 'Year',
      options: [],
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Year',
      dataKey: 'vehicleYear'
    },
  };
};

const vehicleMake = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'select',
    templateOptions: {
      label: 'Make',
      options: [],
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Make',
      dataKey: 'vehicleMake'
    },
  };
};

const vehicleModel = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'select',
    templateOptions: {
      label: 'Model',
      options: [],
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Model',
      dataKey: 'vehicleModel'
    },
  };
};

const bodyStyle = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'select',
    templateOptions: {
      label: 'Body Style',
      options: [],
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Body Style',
      dataKey: 'vehicleBodyStyle'
    },
  };
};

const primaryUse = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'radio',
    templateOptions: {
      label: 'Primary Use',
      options: [
        {
          label: 'Business',
          value: 'Business',
        },
        {
          label: 'Pleasure',
          value: 'Pleasure',
        },
        {
          label: 'To/From Work',
          value: 'To/From Work',
        },
        {
          label: 'To/From School',
          value: 'To/From School',
        },
      ],
      className: isCustomerForm ? 'customer-radio' : 'intake-radio',
      placeholder: 'Radio',
    },
  };
};

const ownershipType = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'radio',
    templateOptions: {
      label: 'Ownership Type',
      options: [
        {
          label: 'Owned',
          value: 'Owned',
        },
        {
          label: 'Leased',
          value: 'Leased',
        },
        {
          label: 'Financed',
          value: 'Financed',
        },
      ],
      className: isCustomerForm ? 'customer-radio' : 'intake-radio',
      placeholder: 'Radio',
    },
  };
};

const purchaseDate = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'input',
    templateOptions: {
      type: 'date',
      label: 'Purchase Date',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Purchase Date',
    },
  };
};

const annualMiles = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'input',
    templateOptions: {
      type: 'number',
      label: 'Annual Miles',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Annual Miles',
    },
  };
};

const selectMenu = (isCustomerForm = false) => {
  return {
    id: 0,
    label: 'Select Menu',
    value: 'selectMenu',
    src: 'assets/icons/select-menu.svg',
    type: 'select',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Select menu',
      placeholder: 'Select menu',
      options: [{ label: 'Option 1', value: 'Option 1' }],
    },
  };
};

const selectBox = (isCustomerForm = false) => {
  return {
    id: 0,
    label: 'Select Box',
    value: 'selectBox',
    src: 'assets/icons/select-menu.svg',
    type: 'selectbox',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Select box',
      placeholder: 'Select Box',
      options: [{ label: 'Option 1', value: 'Option 1' }],
    },
  };
};

const text = (isCustomerForm = false) => {
  return {
    id: 1,
    label: 'Text',
    value: 'text',
    src: 'assets/icons/input.svg',
    type: 'input',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Text',
      placeholder: 'Text',
    },
  };
};

const number = (isCustomerForm = false) => {
  return {
    id: 2,
    label: 'Number',
    value: 'number',
    src: 'assets/icons/number.svg',
    type: 'input',
    key: uuid(),
    templateOptions: {
      type: 'number',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Number',
      placeholder: 'Number',
    },
  };
};

const radio = (isCustomerForm = false) => {
  return {
    id: 3,
    label: 'Radio',
    value: 'selectOne',
    src: 'assets/icons/radio.svg',
    type: 'radio',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'customer-radio' : 'intake-radio',
      label: 'Radio',
      placeholder: 'Radio',
      options: [{ label: 'Option 1', value: 'Option 1' }],
    },
  };
};

const checkbox = (isCustomerForm = false) => {
  return {
    id: 4,
    label: 'Checkbox',
    value: 'checkbox',
    src: 'assets/icons/checkbox.svg',
    type: 'checkbox',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Checkbox',
      placeholder: 'Checkbox',
      text: 'Do you agree?',
    },
  };
};

const address = (isCustomerForm = false) => {
  const addressFieldkey = uuid();
  return {
    id: 5,
    label: 'Address',
    value: 'address',
    src: 'assets/icons/location.svg',
    isGroup: true,
    data: [
      {
        type: 'address',
        key: addressFieldkey,
        templateOptions: {
          dataKey: addressFieldkey,
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          label: 'Address',
          placeholder: 'Address',
        },
      },
      {
        type: 'input',
        key: uuid(),
        hide: true,
        templateOptions: {
          dataKey: addressFieldkey + 'streetName',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          label: 'Street Name',
          placeholder: 'Street Name',
        },
      },
      {
        type: 'input',
        key: uuid(),
        hide: true,
        templateOptions: {
          dataKey: addressFieldkey + 'streetNumber',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          label: 'Street Number',
          placeholder: 'Street Number',
        },
      },
      {
        type: 'input',
        key: uuid(),
        hide: true,
        templateOptions: {
          dataKey: addressFieldkey + 'city',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          label: 'City',
          placeholder: 'City',
        },
      },
      {
        type: 'input',
        key: uuid(),
        hide: true,
        templateOptions: {
          dataKey: addressFieldkey + 'county',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          label: 'County',
          placeholder: 'County',
        },
      },
      {
        type: 'select',
        key: uuid(),
        hide: true,
        templateOptions: {
          dataKey: addressFieldkey + 'state',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          label: 'State',
          placeholder: 'State',
          options: statesList
        },
      },
      {
        type: 'input',
        key: uuid(),
        hide: true,
        templateOptions: {
          dataKey: addressFieldkey + 'zipCode',
          className: isCustomerForm ? 'xilo-input' : 'intake-input',
          label: 'Zip Code',
          placeholder: 'Zip Code',
        },
      },
    ],
  };
};

const date = (isCustomerForm = false) => {
  return {
    id: 6,
    label: 'Date',
    value: 'date',
    src: 'assets/icons/date.svg',
    type: 'input',
    key: uuid(),
    templateOptions: {
      type: 'date',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Date',
      placeholder: 'Date',
    },
  };
};

const phone = (isCustomerForm = false) => {
  return {
    id: 7,
    label: 'Phone',
    value: 'phonenumber',
    src: 'assets/icons/phonenumber.svg',
    type: 'phonenumber',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Phone',
      placeholder: 'Phone',
    },
  };
};

const email = (isCustomerForm = false) => {
  return {
    id: 8,
    label: 'Email',
    value: 'email',
    src: 'assets/icons/email.svg',
    type: 'input',
    key: uuid(),
    templateOptions: {
      type: 'email',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Email',
      placeholder: 'Email',
    },
  };
};

const password = (isCustomerForm = false) => {
  return {
    id: 9,
    label: 'Password',
    value: 'password',
    src: 'assets/icons/password.svg',
    type: 'input',
    key: uuid(),
    templateOptions: {
      type: 'password',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Password',
      placeholder: 'Password',
    },
  };
};

const paragraph = (isCustomerForm = false) => {
  return {
    id: 10,
    label: 'Paragraph',
    value: 'textarea',
    src: 'assets/icons/paragraph.svg',
    type: 'textarea',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Paragraph',
      placeholder: 'Paragraph',
    },
  };
};

const name = (isCustomerForm = false) => {
  return {
    id: 11,
    label: 'Name',
    value: 'name',
    src: 'assets/icons/input.svg',
    isGroup: true,
    data: [
      firstName(isCustomerForm, 'firstName', false),
      lastName(isCustomerForm, 'lastName', false),
    ],
  };
};

const industryAndOccupation = (isCustomerForm = false) => {
  return {
    id: 12,
    label: 'Industry & Occupation',
    value: 'industryOccupation',
    src: 'assets/icons/select-menu.svg',
    isGroup: true,
    data: [
      industry(isCustomerForm),
      occupation(isCustomerForm),
    ],
  };
};

const vehicleSelect = (isCustomerForm = false) => {
  return {
    id: 13,
    label: 'Vehicle Select',
    value: 'vehicleSelect',
    src: 'assets/icons/select-menu.svg',
    isGroup: true,
    data: [
      vehicleYear(isCustomerForm),
      vehicleMake(isCustomerForm),
      vehicleModel(isCustomerForm),
      bodyStyle(isCustomerForm),
    ],
  };
};

const vinDecoder = (isCustomerForm = false) => {
  return {
    id: 14,
    label: 'VIN Decoder',
    value: 'vinDecoder',
    src: 'assets/icons/input.svg',
    type: 'input',
    key: uuid(),
    templateOptions: {
      dataKey: 'vin',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'VIN',
      placeholder: 'VIN',
    },
  };
};

const plainText = (isCustomerForm = false) => {
  return {
    id: 15,
    label: 'Plain Text',
    value: 'text',
    src: 'assets/icons/input.svg',
    type: 'text',
    key: uuid(),
    templateOptions: {
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      label: 'Plain text',
    },
  };
};
const hasIncident = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'checkbox',
    templateOptions: {
      text: 'Has Accident, Violation or Claim',
      label: 'Checkbox',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Checkbox',
    },
  };
};
const incidentDescription = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'input',
    templateOptions: {
      label: 'Incident Description',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Incident Description',
    },
  };
};
const incidentDate = (isCustomerForm = false) => {
  return {
    key: uuid(),
    type: 'input',
    templateOptions: {
      type: 'date',
      label: 'Incident Date',
      className: isCustomerForm ? 'xilo-input' : 'intake-input',
      placeholder: 'Incident Date',
    },
  };
};

export const questionComponents = {
  firstName,
  lastName,
  companyName,
  birthday,
  gender,
  maritalStatus,
  relationship,
  industry,
  occupation,
  educationLevel,
  driversLicenseNumber,
  licenseState,
  ageLicensed,
  vin,
  vehicleYear,
  vehicleMake,
  vehicleModel,
  bodyStyle,
  primaryUse,
  ownershipType,
  purchaseDate,
  annualMiles,
  selectMenu,
  text,
  number,
  radio,
  checkbox,
  address,
  date,
  phone,
  email,
  password,
  paragraph,
  name,
  industryAndOccupation,
  vehicleSelect,
  vinDecoder,
  plainText,
  hasIncident,
  incidentDate,
  incidentDescription,
  selectBox,
};
