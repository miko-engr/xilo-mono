import { Company } from "./company.model";
import { Flow } from "./flow.model";
import { Client } from "./client.model";

export class Email {
    constructor(
        public id?: number,
        public recipient?: string,
        public sender?: string,
        public subject?: string,
        public body?: string,
        public scheduledDate?: Date,
        public isSchedule?: boolean,
        public isSentNow?: boolean,
        public replyStatus?: string,
        public replyErrorMessage?: string,
        public status?: string,
        public fromClient?: boolean,
        public companyEmailId?: number,
        public flowEmailId?: number,
        public clientEmailId?: number,
        public flow?: Flow,
        public client?: Client,
        public company?: Company
    ) {}
}
