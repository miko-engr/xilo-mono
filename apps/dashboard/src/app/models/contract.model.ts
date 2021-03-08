import { Company } from './company.model';

export class Contract {
    constructor(
      public customerFullName?: string,
      public customerFirstName?: string,
      public customerLastName?: string,
      public customerTitle?: string,
      public streetNumber?: string,
      public city?: string,
      public state?: string,
      public unitNumber?: number,
      public zip?: number,
      public fullAddress?: string,
      public username?: string,
      public servicesDesc?: string,
      public subscriptionFees?: number,
      public users?: string,
      public ppu?: string,
      public discount?: string,
      public implementationFees?: string,
      public xiloRep?: string,
      public xiloRepTitle?: string,
      public xiloRepEmail?: string,
      public company?: Company,
      public url?: string,
      public payment?: object,
      public phone?: string,
      public forms?: any[],
    ) {}
}
