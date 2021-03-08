import { v4 } from 'uuid';

export const newIntakeFormTemplate = {
  title: 'New Form',
  metadata: {
    version: 0,
    key: v4(),
  },
  components: [
    {
      type: 'intake-form',
      fieldGroup: [
        {
          key: v4(),
          type: 'intake-section',
          wrappers: ['section-panel'],
          fieldGroup: [
            {
              key: v4(),
              type: 'input',
              templateOptions: {
                className: 'intake-input',
                label: 'New Input',
                placeholder: 'New Input',
              },
            },
          ],
          templateOptions: {
            label: 'New Section',
          },
        },
      ],
    },
  ],
};

export const newCustomerFormTemplate = {
  title: 'New Form',
  metadata: {
    version: 0,
    key: v4(),
  },
  components: [
    {
      type: 'customer-form',
      fieldGroup: [
        {
          key: v4(),
          type: 'customer-section',
          wrappers: ['section-panel'],
          templateOptions: {
            label: 'New Section',
          },
          fieldGroup: [
            {
              type: 'question-group',
              wrappers: ['question-panel'],
              key: v4(),
              templateOptions: {
                label: 'New Question Group',
              },
              fieldGroup: [
                {
                  key: v4(),
                  type: 'input',
                  templateOptions: {
                    className: 'xilo-input',
                    label: 'New Input',
                    placeholder: 'New Input',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
