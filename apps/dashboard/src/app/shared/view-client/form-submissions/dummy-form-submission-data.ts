// TODO: update these interfaces once real data is being sent
interface IFormlyForm {
  id: string,
  title: string,
  components: any[] //FormlyFieldConfig
}

interface IFormSubmission {
  metadata: object,
  responses: {}
}

interface IFormSubmissionDisplay {
  formTitle: string,
  sections: any[]
}

export const dummyForm: IFormlyForm = {
  id: '123',
  title: 'Auto Form',
  // ... other form fields from previous model
  components: [ //FormlyFieldConfig[] See below for full model
    {
      key: '1', //UUID
      templateOptions: { label: 'Insured' },
      fieldGroup: [ //FormlyFieldConfig[]
        {
          key: 'qg2', //UUID
          templateOptions: { label: 'Are you a current client?' },
          wrappers: ['panel'],
          fieldGroup: [ //FormlyFieldConfig[]
            {
              key: 'q3', //UUID
              type: 'select',
              templateOptions: {
                options: [
                  { label: 'Yea, I am', value: 'Yes' },
                  { label: 'No, I\'m not', value: 'No' }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      key: '4', //UUID
      templateOptions: { label: 'Drivers' },
      fieldGroup: [ //FormlyFieldConfig[]
        {
          key: 'qgr5', //UUID
          templateOptions: { addText: 'Add Another Driver' },
          type: 'repeat',
          fieldArray: {
            fieldGroup: [ //FormlyFieldConfig[]
              {
                key: 'qg6', //UUID
                templateOptions: { label: 'Can you tell us about the driver?' },
                wrappers: ['panel'],
                fieldGroup: [ //FormlyFieldConfig[]
                  {
                    key: 'q7', //UUID
                    type: 'input',
                    className: 'xilo-input',
                    templateOptions: {
                      label: 'First Name',
                      placeholder: 'Enter First Name'
                    }
                  },
                  {
                    key: 'q8', //UUID
                    type: 'input',
                    templateOptions: {
                      label: 'Last Name',
                      placeholder: 'Enter Last Name'
                    }
                  }
                ]
              },
              {
                key: 'qg9', //UUID
                templateOptions: { label: 'What is their marital status?' },
                wrappers: ['panel'],
                fieldGroup: [ //FormlyFieldConfig[]
                  {
                    key: 'q10', //UUID
                    type: 'select',
                    className: 'xilo-input',
                    templateOptions: {
                      options: [
                        { label: 'Single', value: 'Single' },
                        { label: 'Married', value: 'Married' }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ]
};

export const dummyFormSubmission: IFormSubmission = {
  metadata: { clientId: '1234', formId: '123' },
  responses: {
    'qg2': {
      'q3': 'Yes'
    },
    'qgr5': [
      {
        'qg6': {
          'q7': 'Steven',
          'q8': 'Senkus'
        },
        'qg9': {
          'q10': 'Married'
        }
      },
      {
        'qg6': {
          'q7': 'Jon',
          'q8': 'Corrin'
        },
        'qg9': {
          'q10': 'Single'
        }
      }
    ]
  }
};

export const parsedSubmissionDummy: IFormSubmissionDisplay = {
  formTitle: 'Auto Form',
  sections: [{
    title: 'Insured',
    questions: [{ 'questionText': 'Are you a current client?', 'answerText': 'No' }]
  }, {
    title: 'Drivers',
    isMultiple: true,
    selectedQuestionGroupIndex: 0,
    questionGroups: [
      [{
        'questionText': 'First Name',
        'answerText': 'TestFirstName 1'
      }, {
        'questionText': 'Last Name',
        'answerText': 'TestLastName 1'
      }, {
        'questionText': 'What is their marital status?',
        'answerText': 'Single'
      }],
      [{
        'questionText': 'First Name',
        'answerText': 'TestFirstName 2'
      }, {
        'questionText': 'Last Name',
        'answerText': 'TestLastName 2'
      }, {
        'questionText': 'What is their marital status?',
        'answerText': 'Domestic Partner'
      }]
    ]
  },{
    title: 'Vehicles',
    isMultiple: true,
    selectedQuestionGroupIndex: 0,
    questionGroups: [
      [{
        'questionText': 'Test Vehicle Field',
        'answerText': 'Answer 0'
      }],
      [{
        'questionText': 'Test Vehicle Field',
        'answerText': 'Answer 1'
      }],
    ]
  }]
};
