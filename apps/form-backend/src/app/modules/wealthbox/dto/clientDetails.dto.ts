import {
    IsString,
    IsObject,
    IsOptional
} from 'class-validator';

interface ClientData {
    first_name: string;
    last_name: string;
    job_title: string;
    company_name: string | any;
    birth_date: string;
    assigned_to: number;
    referred_by: number;
    gender: string;
    marital_status: any;
    street_addresses: {
        street_line_1: string;
        street_line_2: string;
        city: string;
        state: string;
        zip_code: number;
    }[] | Array<object>;
    email_addresses: Array<object>;
    phone_numbers: Array<object>;
    tag: any;
    visible_to: string;
}

interface TaskData {
    name: string;
    due_date: string;
    description: string;
    assigned_to: number;
    complete: boolean;
    repeats: boolean;
    category: number;
    linked_to: {
        id: any;
        type: string;
        name: string;
    }[];
    priority: string;
    visible_to: string;
}

interface EventData {
    title: string;
    starts_at: string;
    ends_at: string;
    repeats: boolean;
    event_category: number;
    all_day: boolean;
    location: string;
    description: string;
    state: string;
    visible_to: string;
    email_invitees: boolean;
    linked_to: Array<object>;
    invitees: Array<any>;
}

interface ProjectData {
    name: string;
    description: string;
    organizer: number;
    visible_to: string;
}

interface NoteData {
    content: string;
    linked_to: {
        id: any;
        type: string;
        name: string;
    }[];
    visible_to: string;
    tags: string[];
}

interface OpportunityData {
    name: string;
    description: string;
    target_close: string;
    probability: number;
    stage: number;
    amounts: {
        amount: number;
        currency: string;
        kind: string;
    }[];
    linked_to: {
        id: any;
        type: string;
        name: string;
    }[];
    visible_to: string;
}

interface WorkFlowData {
    label: string;
    linked_to: {
        id: any;
        type: string;
        name: string;
    };
    visible_to: string;
    workflow_template: number;
    starts_at: string;
}

export class ClientDetailsDto {
    @IsOptional() @IsObject() clientData?: ClientData;
    @IsOptional() @IsObject() taskData?: TaskData;
    @IsOptional() @IsObject() eventData?: EventData;
    @IsOptional() @IsObject() projectData?: ProjectData;
    @IsOptional() @IsObject() noteData?: NoteData;
    @IsOptional() @IsObject() opportunityData?: OpportunityData;
    @IsOptional() @IsObject() workFlowData?: WorkFlowData;
    @IsOptional() @IsString() vendorName: string;
    @IsOptional() @IsString() wealthboxId?: string;
}
