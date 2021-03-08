export const fieldGroups = [
  {
    type: 'content',
    include: [],
    exclude: [],
    fields: [
      // {
      //     label: 'Placeholder',
      //     key: 'placeholder',
      //     type: 'text',
      //     include: [],
      //     exclude: [
      //         'checkbox', 'radio', 'intake-section',
      //         'intake-repeat'
      //     ]
      // },
      {
        label: 'Label',
        key: 'label',
        type: 'text',
        include: [],
        exclude: [],
      },
      {
        label: 'Title',
        key: 'text',
        type: 'text',
        include: ['checkbox'],
        exclude: [],
      },
      {
        label: 'Default Value',
        key: 'defaultValue',
        type: 'text',
        include: [],
        exclude: ['email', 'phonenumber'],
      },
      {
        label: 'Description',
        key: 'description',
        type: 'text',
        include: ['question-group'],
        exclude: [],
      },
      {
        label: 'Options',
        key: 'options',
        type: 'select',
        include: ['select', 'radio'],
        exclude: [],
      },
      {
        label: 'Required',
        key: 'required',
        type: 'checkbox',
        include: [],
        exclude: [
          'intake-section',
          'intake-repeat',
          'customer-section',
          'customer-repeat',
          'question-group',
        ],
      },

      {
        label: 'Single Column',
        key: 'singleColumn',
        type: 'checkbox',
        include: ['text'],
        exclude: [],
      },
      // {
      //     label: 'Disabled',
      //     key: 'disabled',
      //     type: 'checkbox',
      //     include: [
      //         'input', 'textarea'
      //     ],
      //     exclude: []
      // },
      {
        label: 'Hide',
        key: 'hide',
        type: 'checkbox',
        include: ['input', 'select'],
        exclude: [],
      },
    ],
  },
  {
    type: 'validations',
    label: 'Validation',
    include: ['number', 'input', 'textarea', 'password'],
    exclude: [],
    fields: [
      {
        label: 'Max Value',
        key: 'max',
        type: 'number',
        include: ['number'],
        exclude: [],
      },
      {
        label: 'Min Value',
        key: 'min',
        type: 'number',
        include: ['number'],
        exclude: [],
      },
      {
        label: 'Max Length',
        key: 'maxLength',
        type: 'number',
        include: ['input', 'textarea', 'password'],
        exclude: [],
      },
      {
        label: 'Min Length',
        key: 'minLength',
        type: 'number',
        include: ['input', 'textarea', 'password'],
        exclude: [],
      },
    ],
  },
  {
    type: 'icon',
    label: 'Icon',
    include: ['question-group'],
    exclude: [],
    fields: [],
  },
];
