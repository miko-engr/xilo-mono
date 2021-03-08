import * as moment from 'moment';
import { getNextXHours } from '../../helpers/date.helper';
import { returnAssignedLeadEmail } from '../lifecycle-email/lifecycle-email.helper';
import { ClientDto } from './dto/client.dto';
import { CompanyDto } from '../company/dto/company.dto';

export const returnContactData = async (client: ClientDto) => {
  try {
    const data = {
      first_name: client.firstName,
      last_name: client.lastName,
      // 'suffix': 'M.D.',
      job_title: client.occupation,
      company_name: client.business.entityName,
      birth_date: moment(client.birthDate).format('YYYY-MM-DD'),
      assigned_to: 1,
      referred_by: 1,
      // 'type': 'Person',
      gender: client.gender,
      // 'contact_source': 'Referral',
      // 'contact_type': 'Client',
      // 'status: 'Active'',
      marital_status: client.maritalStatus,
      street_addresses: [
        {
          street_line_1:
            client.streetAddress ||
            client.streetNumber + ' ' + client.streetName,
          street_line_2: client.unitNumber,
          city: client.city,
          state: client.stateCd,
          zip_code: client.postalCd,
        },
      ],
      email_addresses: [
        {
          address: client.email,
          principal: true,
        },
      ],
      phone_numbers: [
        {
          address: client.phone,
          principal: true,
          kind: 'Work',
        },
      ],
      tag: client.tags,
      visible_to: 'Everyone',
    };
    return { status: true, data };
  } catch (error) {
    console.log(error);
    return { status: false, error };
  }
};

export const returnTaskData = async (client: ClientDto) => {
  try {
    const data = {
      name: 'New XILO Lead',
      due_date: await getNextXHours(24),
      description: 'Work this new lead from XILO',
      assigned_to: 1,
      complete: false,
      repeats: false,
      category: 1,
      linked_to: [
        {
          id: client.wealthboxId,
          type: 'Contact',
          name: client.firstName || client.lastName,
        },
      ],
      priority: 'Low',
      visible_to: 'Everyone',
    };
    return { status: true, data };
  } catch (error) {
    return { status: false, error };
  }
};

export const returnEventData = async (client: ClientDto) => {
  try {
    const data = {
      title: 'Client Meeting',
      starts_at: '2015-05-24 10:00 AM -500',
      ends_at: '2015-05-24 11:00 AM -500',
      repeats: true,
      event_category: 2,
      all_day: true,
      location: 'Conference Room',
      description: 'Review meeting for Kevin...',
      state: 'unconfirmed',
      visible_to: 'Everyone',
      email_invitees: true,
      linked_to: [
        {
          id: client.wealthboxId,
          type: 'Contact',
          name: client.firstName || client.lastName,
        },
      ],
      invitees: [],
    };
    return { status: true, data };
  } catch (error) {
    return { status: false, error };
  }
};

export const returnProjectData = async () => {
  try {
    const data = {
      name: 'Client Seminar',
      description: 'Project to plan spring seminar.',
      organizer: 1,
      visible_to: 'Everyone',
    };
    return { status: true, data };
  } catch (error) {
    return { status: false, error };
  }
};

export const returnNoteData = async (
  client: ClientDto,
  company: CompanyDto
) => {
  try {
    const data = {
      content: await returnAssignedLeadEmail(client, company, null),
      linked_to: [
        {
          id: client.wealthboxId,
          type: 'Contact',
          name: client.firstName || client.lastName,
        },
      ],
      visible_to: 'Everyone',
      tags: ['Inactive Client'],
    };
    return { status: true, data };
  } catch (error) {
    return { status: false, error };
  }
};

export const returnOpportunityData = async (client: ClientDto) => {
  try {
    const data = {
      name: 'Financial Plan',
      description: 'Opportunity to plan for...',
      target_close: '2015-11-12 11:00 AM -500',
      probability: 70,
      stage: 145450,
      // 'manager': 1,
      amounts: [
        {
          amount: 56.76,
          currency: '$',
          kind: 'Fee',
        },
      ],
      linked_to: [
        {
          id: client.wealthboxId,
          type: 'Contact',
          name: client.firstName || client.lastName,
        },
      ],
      visible_to: 'Everyone',
    };
    return { status: true, data };
  } catch (error) {
    return { status: false, error };
  }
};

export const returnWorkFlowData = async (client: ClientDto) => {
  try {
    const data = {
      label: 'Onboard a new client to the firm',
      linked_to: {
        id: client.wealthboxId,
        type: 'Contact',
        name: client.firstName || client.lastName,
      },
      visible_to: 'Everyone',
      workflow_template: 21377,
      starts_at: '2019-12-12 3:00pm',
    };
    return { status: true, data };
  } catch (error) {
    return { status: false, error };
  }
};
