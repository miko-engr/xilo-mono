import { v4 } from 'uuid';

export class IntakeComponents {
  data: any;
  constructor() {
    const addressFieldKey = v4();
    this.data = [
      {
        title: 'Add Section',
        id: 0,
        items: [
          {
            id: 0,
            icon: 'icon_section_driver',
            label: 'Drivers',
            key: v4(),
            type: 'intake-repeat',
            templateOptions: {
              label: 'Driver',
              subIndex: 0,
            },
            fieldArray: {
              type: 'intake-section',
              wrappers: ['section-panel'],
              templateOptions: {
                label: 'Driver',
                hasRepeatButtons: true,
              },
              fieldGroup: [
                {
                  key: v4(),
                  type: 'input',
                  templateOptions: {
                    className: 'intake-input',
                    label: 'First Name',
                    placeholder: 'First Name',
                    required: true,
                  },
                },
                {
                  key: v4(),
                  type: 'input',
                  templateOptions: {
                    className: 'intake-input',
                    label: 'Last Name',
                    placeholder: 'Last Name',
                    required: true,
                  },
                },
              ],
            },
          },
          {
            id: 1,
            label: 'Vehicle',
            icon: 'icon_section_auto',
          },
          {
            id: 2,
            label: 'Insured',
            icon: 'icon_section_insured',
          },
          {
            id: 3,
            label: 'Co-insured',
            icon: 'icon_section_co_insured',
          },
          {
            id: 4,
            label: 'Home property',
            icon: 'icon_section_home_property',
          },
          {
            id: 5,
            label: 'Business',
            icon: 'icon_section_business',
          },
          {
            id: 6,
            label: 'Location',
            icon: 'icon_section_location',
          },
          {
            id: 7,
            label: 'Policy',
            icon: 'icon_section_policy',
          },
          {
            id: 8,
            label: 'Additional Interest',
            icon: 'icon_section_additional_interest',
          },
        ],
      },
      {
        title: 'Add Question',
        id: 1,
        items: [
          {
            id: 0,
            label: 'Select Menu',
            value: 'selectMenu',
            icon: 'icon_question_select_menu',
            type: 'select',
            key: v4(),
            templateOptions: {
              className: 'intake-input',
              label: 'Select menu',
              placeholder: 'Select menu',
              options: [{ label: 'Option 1', value: 'Option 1' }],
            },
          },
          {
            id: 1,
            label: 'Text',
            value: 'text',
            icon: 'icon_section_driver',
            type: 'input',
            key: v4(),
            templateOptions: {
              className: 'intake-input',
              label: 'Text',
              placeholder: 'Text',
            },
          },
          {
            id: 2,
            label: 'Number',
            value: 'number',
            icon: 'icon_section_auto',
            type: 'input',
            key: v4(),
            templateOptions: {
              type: 'number',
              className: 'intake-input',
              label: 'Number',
              placeholder: 'Number',
            },
          },
          {
            id: 3,
            label: 'Radio',
            value: 'selectOne',
            icon: 'icon_section_insured',
            type: 'radio',
            key: v4(),
            templateOptions: {
              className: 'intake-radio',
              label: 'Radio',
              placeholder: 'Radio',
              options: [{ label: 'Option 1', value: 'Option 1' }],
            },
          },
          {
            id: 4,
            label: 'Checkbox',
            value: 'checkbox',
            icon: 'icon_section_insured',
            type: 'checkbox',
            key: v4(),
            templateOptions: {
              className: 'intake-input',
              label: 'Checkbox',
              placeholder: 'Checkbox',
              text: 'Do you agree?',
            },
          },
          // {
          //   id: 4,
          //   label: 'Select Multiple',
          //   value: 'selectMultiple',
          //   icon: 'icon_section_co_insured',
          // },
          // {
          //   id: 5,
          //   label: 'Scale',
          //   value: 'scale',
          //   icon: 'icon_section_home_property',
          // },
          // {
          //   id: 6,
          //   label: 'Educational dropdown',
          //   value: 'educationalDropdown',
          //   icon: 'icon_section_business',
          // },
          {
            id: 5,
            label: 'Address',
            value: 'address',
            icon: 'icon_section_location',
            type: 'address',
            key: v4(),
            templateOptions: {
              className: 'intake-input',
              label: 'Address',
              placeholder: 'Address',
            },
          },
          {
            id: 6,
            label: 'Date',
            value: 'date',
            icon: 'icon_section_location',
            type: 'input',
            key: v4(),
            templateOptions: {
              type: 'date',
              className: 'intake-input',
              label: 'Date',
              placeholder: 'Date',
            },
          },
          {
            id: 7,
            label: 'Phone',
            value: 'phonenumber',
            icon: 'icon_section_location',
            type: 'phonenumber',
            key: v4(),
            templateOptions: {
              className: 'intake-input',
              label: 'Phone',
              placeholder: 'Phone',
            },
          },
          {
            id: 8,
            label: 'Email',
            value: 'email',
            icon: 'icon_section_location',
            type: 'input',
            key: v4(),
            templateOptions: {
              type: 'email',
              className: 'intake-input',
              label: 'Email',
              placeholder: 'Email',
            },
          },
          {
            id: 9,
            label: 'Password',
            value: 'password',
            icon: 'icon_section_location',
            type: 'input',
            key: v4(),
            templateOptions: {
              type: 'password',
              className: 'intake-input',
              label: 'Password',
              placeholder: 'Password',
            },
          },
          {
            id: 10,
            label: 'Paragraph',
            value: 'textarea',
            icon: 'icon_section_location',
            type: 'tetarea',
            key: v4(),
            templateOptions: {
              className: 'intake-input',
              label: 'Paragraph',
              placeholder: 'Paragraph',
            },
          },
        ],
      },
    ];
  }
  get getIntakeComponents() {
    return this.data;
  }
}
