export class Transformation {
    constructor(
        public method?: string,
        public operator?: string,
        public type?: string,
        public valueKey?: string,
        public valueObject?: string,
        public conditionOperator?: string,
        public conditionKey?: string,
        public conditionObject?: string,
        public conditionValue?: string,
        public addedValue?: string,
        public newValue?: string,
        public defaultValue?: string,
    ) {}
}
