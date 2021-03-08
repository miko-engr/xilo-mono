import { Driver } from './driver.model';
import { Agent } from './agent.model';
import { Lifecycle } from './lifecycle.model';
import { Company } from './company.model';
import { LifecycleAnalytic } from './lifecycle-analytic.model';
import { Home } from './home.model';
import { Rate } from './rate.model';
import { Vehicle } from './vehicle.model';
import { Business } from './business.model';
import { Location } from './location.model';
import { Incident } from './incident.model';
import { RecreationalVehicle } from './recreational-vehicle.model';
import { Policy } from './policy.model';

export class Client {
  constructor(
    public id?: string,
    public clientDt?: string,
    public transactionRqDt?: Date,
    public contractEffectiveDt?: Date,
    public premiumTotal?: number,
    public premiumMonths?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
    public companyClientId?: number,
    public clientAgentId?: number,
    public clientLifecycleId?: number,
    public clientDriverId?: number,
    public clientLifecycleAnalyticId?: number,
    public agent?: Agent,
    public company?: Company,
    public lifecycleAnalytics?: LifecycleAnalytic[],
    public drivers: Driver[] = [],
    public vehicles: Vehicle[] = [],
    public clientLifcycle?: Lifecycle,
    public pipedriveDealId?: string,
    public pipedriveNoteId?: string,
    public sfAccountId?: string,
    public sfContactId?: string,
    public sfInsuranceId?: string,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public email?: string,
    public streetName?: string,
    public streetNumber?: string,
    public city?: string,
    public stateCd?: string,
    public postalCd?: string,
    public latitude?: number,
    public longitude?: number,
    public tag?: string,
    public completedAutoForm?: boolean,
    public gender?: string,
    public birthDate?: Date,
    public hasCancelled?: boolean,
    public educationLevel?: string,
    public creditScore?: string,
    public numOfLosses?: string,
    public priorClient?: boolean,
    public maritalStatus?: string,
    public occupation?: string,
    public qqContactId?: string,
    public qqPolicyId?: string,
    public newLeadFired?: boolean,
    public ezlynxUrl?: string,
    public hasPriorInsurance?: string,
    public priorInsuranceCompany?: string,
    public priorInsuranceDuration?: string,
    public priorInsuranceYears?: string,
    public priorInsuranceMonths?: string,
    public yearsWithCarrier?: string,
    public monthsWithCarrier?: string,
    public priorInsuranceExpirationDate?: string,
    public homeownership?: string,
    public hasAccidents?: string,
    public accidentDate?: string,
    public accidentType?: string,
    public hasViolations?: string,
    public violationDate?: string,
    public violationType?: string,
    public hasCompLoss?: string,
    public compLossDate?: string,
    public compLossType?: string,
    public fullAddress?: string,
    public isFirstTimeHomeBuyer?: string,
    public homeInsurancePreviouslyCancelled?: string,
    public hasSecondAddress?: string,
    public hasHomeLoss?: string,
    public homeLossDate?: string,
    public homeLossType?: string,
    public homeLossAmount?: string,
    public priorPenalties?: string,
    public priorPenaltiesCode?: string,
    public priorPenaltiesDate?: string,
    public unitNumber?: string,
    public hasUnitNumber?: string,
    public referredBy?: string,
    public preferredAgent?: string,
    public permissionToContact?: string,
    public marriedOrHasCoBorrower?: string,
    public spouseName?: string,
    public spouseBirthdate?: string,
    public referrersFirstName?: string,
    public referrersLastName?: string,
    public referrersEmail?: string,
    public referrersPhone?: string,
    public reasonForShopping?: string,
    public tags?: string[],
    public amsCustomerId?: string,
    public amsPolicyId?: string,
    public customerType?: string,
    public fullName?: string,
    public ezlynxId?: string,
    public homes: Home[] = [],
    public rates: Rate[] = [],
    public business: Business = {},
    public locations: Location[] = [],
    public incidents: Incident[] = [],
    public recreationalVehicles: RecreationalVehicle[] = [],
    public policies: Policy[] = [],
    public sequenceNumber?: number,
    public flowClientId?: number,
    public finishedFormEmailFired?: boolean,
    public formClientId?: number,
    public infusionsoftClientId?: string,
    public infusionsoftTagId?: number,
    public streetAddress?: string,
    public county?: string,
    public wealthboxId?: string,
    public formStatus?: string,
    public industry?: string,
    public validationsPassed?: boolean,
  ) {}
}