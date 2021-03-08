export class IValidation {
    constructor(
        public vendorName?: string,
        public lob?: string,
        public expectedValues?: string[],
        public fieldDataIn?: string,
        public errorType?: string,
        public error?: string,
        public dataIn?: any,
        public createdAt?: number,
        public integrationIds?: number[],
    ) {
    }
}
