import { Company } from './company.model';
import { Page } from './page.model';
import { Discount } from './discount.model';
import { DynamicRate } from './dynamic-rate.model';
import { Agent } from './agent.model';

export class Form {
    constructor(
      public id?: number,
      public type?: string,
      public title?: string,
      public isAuto?: boolean,
      public isSimpleForm?: boolean,
      public isHome?: boolean,
      public isDyanmic?: boolean,
      public isTemplate?: boolean,
      public companyFormId?: number,
      public dynamicRaterFormId?: number,
      public hasDRates?: boolean,
      public resultsIsEnabled?: boolean,
      public discountsIsEnabled?: boolean,
      public externalLink?: string,
      public hasFilterByState?: boolean,
      public isAutoHome?: boolean,
      public isCommercial?: boolean,
      public hasDefaultAssignedAgent?: boolean,
      public emailDefaultAgentOnly?: boolean,
      public states?: string[],
      public tags?: string[],
      public logo?: string,
      public icon?: string,
      public agentFormId?: number,
      public isEnabled?: boolean,
      public customType?: string,
      public customHtml?: string,
      public isFireOnComplete?: boolean,
      public integrations?: string[],
      public pdfId?: number,
      public infusionsoftTagId?: number,
      public hasRoundRobinAssignment?: boolean,
      public roundRobinAgents?: number[],
      public hasDownloadPdf?: boolean,
      public isV2Form?: boolean,
      public company?: Company,
      public pages?: Page[],
      public discounts?: Discount[],
      public dynamicRates?: DynamicRate[],
      public assignedAgent?: Agent,
      public companyAddress?: string,
      public thankYouPageText?: string,
      public thankYouPageButtonText?: string,
      public thankyouPageLogo?: string,
    ) {}
}
