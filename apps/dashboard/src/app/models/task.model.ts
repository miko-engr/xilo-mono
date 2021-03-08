import { Client } from './client.model';

export class Task {
    constructor(
        public id?: number,
        public createdAt?: Date,
        public updatedAt?: Date,
        public type?: string,
        public description?: string,
        public priority?: string,
        public scheduledDate?: string,
        public isSchedule?: boolean,
        public isSentNow?: boolean,
        public isCompleted?: boolean,
        public completedDate?: Date,
        public companyTaskId?: number,
        public agentTaskId?: number,
        public clientTaskId?: number,
        public client?: Client,
    ) {}
}
