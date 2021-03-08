import { Company } from "./company.model";

export class Template {
    constructor(
        public id?: number,
        public title?: string,
        public body?: string,
        public isText?: boolean,
        public isEmail?: boolean,
        public subject?: string,
        public companyTemplateId?: number,
        public company?: Company,
        public isTask?: boolean,
        public type?: string,
        public description?: string,
        public priority?: string,
    ) {
        this.type = '';
        this.priority = '';
    }
}
