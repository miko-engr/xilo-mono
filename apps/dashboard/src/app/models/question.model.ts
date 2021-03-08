import { Company } from './company.model';
import { Answer } from './answer.model';
import { Page } from './page.model';
import { DynamicRateCondition } from './dynamic-rate-condition.model';
import { Condition } from './condition.model';
import { questionFeedbackList as QuestionFeedbackList } from './feedBack';

export class Question {
    constructor(
      public id?: string,
      public headerText?: string,
      public subHeaderText?: string,
      public nextButtonText?: string,
      public prevButtonText?: string,
      public image?: string,
      public position?: number,
      public errorText?: string,
      public hasPrevNextButtons?: boolean,
      public isRequired?: boolean,
      public hasCustomHtml?: boolean,
      public customInputHtml?: string,
      public isTemplate?: boolean,
      public templateCategory?: string,
      public templateTitle?: string,
      public scrollBuffer?: number,
      public pageQuestionId?: number,
      public companyQuestionId?: number,
      public formQuestionId?: number,
      public company?: Company,
      public page?: Page,
      public answers?: Answer[],
      public questionConditions?: Condition[],
      public conditions?: DynamicRateCondition[],
      public panelIsOpen?: boolean,
      public editHeaderIsOpen?: boolean,
      public editSubheaderIsOpen?: boolean,
      public questionFeedbackList?: QuestionFeedbackList,
      public imageUrl?: string,
      public imageIsSVG?: boolean
    ) {}
}
