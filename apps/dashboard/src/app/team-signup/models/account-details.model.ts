import { PaymentDetails } from '../../models/payment.model';

export class ContractCompany {
    id?: string;
    name?: string;
    contactNumber?: string;
    companyWebsite?: string;
    brandColor?: string;
    streetNumber?: string;
    streetName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    fullAddress?: string;
    county?: string;
    logo?: string;
    preselectedIntegrations?: string[] = [];
}

export class ContractDetails {
    customerFullName?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerTitle?: string;
    streetNumber?: string;
    city?: string;
    state?: string;
    zip?: string;
    username?: string;
    servicesDesc?: string;
    users?: string;
    ppu?: string;
    xiloRep?: string;
    xiloRepTitle?: string;
    xiloRepEmail?: string;
    payment?: PaymentDetails;
    company?: ContractCompany;
    phone?: string;
    implementationFees?: string;
    subscriptionFees?: number;
    discount?: string;
    forms?: number[]
    integrations?: string[]
    interval?: string
}

export class AccountDetails {
    company: ContractCompany;
    contract: ContractDetails;
    payment: PaymentDetails;
    selectedApis: string[];
    selectedForms: number[];
}