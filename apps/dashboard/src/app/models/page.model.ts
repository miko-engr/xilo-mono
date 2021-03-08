import { Company } from './company.model';
import { Question } from './question.model';
import { Condition } from './condition.model';

export class Page {
    constructor(
      public id?: string,
      public title?: string,
      public position?: number,
      public isDriver?: boolean,
      public isVehicle?: boolean,
      public isHome?: boolean,
      public isOwner?: boolean,
      public isInsurance?: boolean,
      public isStartPage?: boolean,
      public isDiscountsPage?: boolean,
      public isResultsPage?: boolean,
      public isFormCompletedPage?: boolean,
      public formCompletedPageHeader?: string,
      public formCompletedPageText?: string,
      public formCompletedPageIcon?: string,
      public formCompletedPageHasTimer?: boolean,
      public routePath?: string,
      public color?: string,
      public isTemplate?: boolean,
      public templateCategory?: string,
      public templateTitle?: string,
      public formPageId?: number,
      public companyPageId?: number,
      public company?: Company,
      public questions?: Question[],
      public conditions?: Condition[],
      public isEditPageTitle?: boolean,
      public panelIsOpen?: boolean,
    ) {}
}
