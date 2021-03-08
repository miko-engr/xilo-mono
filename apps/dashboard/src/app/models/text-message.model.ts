import { Company } from "./company.model";
import { Flow } from "./flow.model";
import { Client } from "./client.model";

export class TextMessage {
    constructor(
        public id?: number,
        public to?: string,
        public body?: string,
        public scheduledDate?: Date,
        public isSchedule?: boolean,
        public isSentNow?: boolean,
        public replySid?: string,
        public replyStatus?: string,
        public replyErrorCode?: string,
        public replyErrorMessage?: string,
        public status?: string,
        public fromClient?: boolean,
        public companyTextMessageId?: number,
        public flowTextMessageId?: number,
        public clientTextMessageId?: number,
        public flow?: Flow,
        public client?: Client,
        public company?: Company
    ) {}
}
