import { Company } from "./company.model";

export class StartPage {
    constructor(
      public id?: string,
      public headerText?: string,
      public subHeaderText?: string,
      public placeholderText?: string,
      public secondaryPlaceholderText?: string,
      public buttonText?: string,
      public formType?: string,
      public companyStartPageId?: number,
      public company?: Company
    ){}
  }
  