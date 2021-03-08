export class Discount {
    constructor(
        public id?: string,
        public title?: string,
        public moreInformation?: string,
        public position?: number,
        public hasMoreInfo?: boolean,
        public hasExternalUrl?: boolean,
        public externalUrl?: string,
        public mobileUrl?: string,
        public propertyKey?: string,
        public object?: string,
        public expectedValue?: string,
        public discount?: string,
        public formDiscountId?: number,
        public companyDiscountId?: number
    ){}
}
