import { Company } from "./company.model";
import { Client } from "./client.model";
import { Email } from './email.model';
import { TextMessage } from './text-message.model';

export class Flow {
    constructor(
        public id?: number,
        public title?: string,
        public isEnabled?: string,
        public isNewClientFlow?: string,
        public position?: number,
        public sequence?: any[],
        public companyFlowId?: number,
        public emails?: Email,
        public texts?: TextMessage,
        public clients?: Client[],
        public company?: Company,
        public daysInFlow?: number,
        public nextStep? : {
          type?: string,
          scheduleDate?: string
        },
        public createdAt?: string,
    ) {}
}
