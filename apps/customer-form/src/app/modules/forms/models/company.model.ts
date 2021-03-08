import { Carrier } from './carrier.model';
import { Client } from './client.model';
import { Agent } from './agent.model';
import { Lifecycle } from './lifecycle.model';
import { User } from './user.model';
import { LifecycleAnalytic } from './lifecycle-analytic.model';
import { LandingPage } from './landing-page.model';
import { CTA } from './cta.model';
import { Medium } from './medium.model';
import { Form } from './form.model';
import { Discount } from './discount.model';
import { Driver } from './driver.model';
import { Vehicle } from './vehicle.model';
import { Home } from './home.model';
import { Location } from './location.model';

export class Company {
  constructor(
    public id?: number,
    public name?: string,
    public slogan?: string,
    public contactNumber?: string,
    public contactEmail?: string,
    public mainLocation?: string,
    public logo?: string,
    public customerId?: string,
    public cardId?: string,
    public cardLast4?: string,
    public subscriptionId?: string,
    public addedPayment?: Boolean,
    public hasActiveSubscription?: Boolean,
    public companyId?: string,
    public companyWebsite?: string,
    public navbarBackgroundColorStart?: string,
    public navbarBackgroundColorEnd?: string,
    public navbarFontColor?: string,
    public emailText?: string,
    public navbarFont?: string,
    public resetPasswordLink?: string,
    public rqUid?: string,
    public facebookApiKey?: string,
    public klaviyoApiKey?: string,
    public ageScore?: number,
    public genderScore?: number,
    public maritalScore?: number,
    public rentScore?: number,
    public insuredScore?: number,
    public violationScore?: number,
    public defenseScore?: number,
    public creditScoreScore?: number,
    public vehicleTypeScore?: number,
    public financeScore?: number,
    public locationScore?: number,
    public redirectCompany?: Boolean,
    public redirectUrl?: string,
    public brandColor?: string,
    public hasAppliedRater?: boolean,
    public hasAppliedEpic?: boolean,
    public hasEzlynx?: boolean,
    public pipedriveIntegration?: boolean,
    public pipedriveToken?: string,
    public pipedriveUrl?: string,
    public pipedriveStage?: string,
    public pipedriveStageId?: string,
    public pipedrivePipeline?: string,
    public pipedrivePipelineId?: string,
    public hasEstimations?: boolean,
    public fireFirstEmailAuto?: boolean,
    public fireSecondEmailAuto?: boolean,
    public hasGoogleConversions?: boolean,
    public googleAdwordsCustomerId?: string,
    public googleAnalyticsViewId?: string,
    public googleApiAccessToken?: string,
    public googleApiRefreshToken?: string,
    public logoHeight?: string,
    public hasSalesforce?: boolean,
    public salesforceU?: string,
    public salesforceP?: string,
    public accessToken?: string,
    public hasFollowUpEmail?: boolean,
    public headerText?: string,
    public subHeaderText?: string,
    public placeholderText?: string,
    public secondaryPlaceholderText?: string,
    public buttonText?: string,
    public textNumber?: string,
    public ezlynxRqUid?: string,
    public hasEzlynxIntegration?: boolean,
    public hasInfusionsoftIntegration?: boolean,
    public hasQQIntegration?: boolean,
    public hasOwnNavbar?: boolean,
    public hasPoweredByXilo?: boolean,
    public listClientDetailsOnEmail?: boolean,
    public updatedAt?: Date,
    public createdAt?: Date,
    public platformManagerCompanyId?: number,
    public agents?: Agent[],
    public carriers?: Carrier[],
    public clients?: Client[],
    public ctas?: CTA[],
    public landingPages?: LandingPage[],
    public lifecycles?: Lifecycle[],
    public lifecycleAnalytics?: LifecycleAnalytic[],
    public mediums?: Medium[],
    public discounts?: Discount[],
    public users?: User[],
    public forms?: Form[],
    public drivers?: Driver[],
    public vehicles?: Vehicle[],
    public homes?: Home[],
    public locations?: Location[],
    public hubspotApiKey?: string,
    public hubspotIntegration?: boolean,
    public hasUSDotIntegration?: boolean,
    public hasSalesAutomation?: boolean,
    public hasStyledEmails?: boolean,
    public infusionsoftApiAccessToken?: string,
    public hasGoogleEvents?: boolean,
    public googleAnalyticsId?: string,
    public hasQuoteRushIntegration?: boolean,
    public hasTurboraterIntegration?: boolean,
    public hasNowCertsIntegration?: boolean,
    public hasWealthboxIntegration?: boolean,
    public hasAMS360Integration?: boolean,
    public hasV2Integrations?: boolean,
    public brandSecondaryColor?: string,
    public brandingURL?: string,
    public thankYouPageText?: string,
    public thankYouPageButtonText?: string,
    public thankyouPageLogo?: string
  ) {}
}
