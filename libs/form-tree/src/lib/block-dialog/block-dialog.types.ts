import {
  questionComponents,
  questionGroupComponents,
  sectionComponents,
} from '@xilo-mono/form-contracts';
export class FormComponents {
  private intakeData: any;

  private customerData: any;

  constructor() {
    this.intakeData = [
      {
        title: 'Add Section',
        id: 0,
        items: [
          // commented sections need to have content added
          sectionComponents.driver(false),
          sectionComponents.vehicle(false),
          // sectionComponents.insured(),
          // sectionComponents.coInsured(),
          // sectionComponents.homeProperty(),
          // sectionComponents.business(),
          // sectionComponents.location(),
          // sectionComponents.policy(),
          sectionComponents.incident(false),
          // sectionComponents.additionalInterest(),
          sectionComponents.priorInsurance(false),
        ],
      },
      {
        title: 'Add Question',
        id: 1,
        items: [
          questionComponents.selectMenu(false),
          questionComponents.text(false),
          questionComponents.number(false),
          questionComponents.radio(false),
          questionComponents.checkbox(false),
          questionComponents.address(false),
          questionComponents.date(false),
          questionComponents.phone(false),
          questionComponents.email(false),
          questionComponents.password(false),
          questionComponents.paragraph(false),
          questionComponents.name(false),
          questionComponents.companyName(false),
          questionComponents.industryAndOccupation(false),
          questionComponents.vehicleSelect(false),
          questionComponents.vinDecoder(false),
          questionComponents.plainText(false),
        ],
      },
      {
        title: 'Add Question Group',
        id: 2,
        items: [questionGroupComponents.vehicleSelection(false)],
      },
    ];

    this.customerData = [
      {
        title: 'Add Section',
        id: 0,
        items: [
          // commented sections need to have content added
          sectionComponents.driver(true),
          sectionComponents.vehicle(true),
          // sectionComponents.insured(),
          // sectionComponents.coInsured(),
          // sectionComponents.homeProperty(),
          // sectionComponents.business(),
          // sectionComponents.location(),
          // sectionComponents.policy(),
          sectionComponents.incident(true),
          // sectionComponents.additionalInterest(),
          sectionComponents.priorInsurance(true),
        ],
      },
      {
        title: 'Add Question',
        id: 1,
        items: [
          questionComponents.selectMenu(true),
          questionComponents.selectBox(true),
          questionComponents.text(true),
          questionComponents.number(true),
          questionComponents.radio(true),
          questionComponents.checkbox(true),
          questionComponents.address(true),
          questionComponents.date(true),
          questionComponents.phone(true),
          questionComponents.email(true),
          questionComponents.password(true),
          questionComponents.paragraph(true),
          questionComponents.name(true),
          questionComponents.industryAndOccupation(true),
          questionComponents.vehicleSelect(true),
          questionComponents.vinDecoder(true),
          questionComponents.plainText(true),
          questionComponents.companyName(true),
        ],
      },
      {
        title: 'Add Question Group',
        id: 2,
        items: [questionGroupComponents.vehicleSelection(true)],
      },
    ];
  }

  get getIntakeComponents() {
    return this.intakeData;
  }

  get getCustomerComponents() {
    return this.customerData;
  }
}
