export class FilterParams {
    constructor(
        public createdAt?: string,
        public clientAgentId?: string,
        public clientLifecycleId?: string,
        public email?: string,
        public phone?: string,
        public postalCd?: string,
        public tags?: string[],
        public formClientId?: string,
        public agentIds?: string[],
        public fullName?: string,
        public tag?: string,
        public reset?: boolean,
    ) {}
}
