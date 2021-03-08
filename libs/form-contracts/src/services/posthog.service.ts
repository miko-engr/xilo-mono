import { Injectable } from '@angular/core';
import {Company} from "../models/company.model";

@Injectable()
export class PosthogService {
    hasFired = false;

    constructor() {}

    captureEvent(eventName: any, properties?: any) {
        if (!this.hasFired && typeof (<any>window)['posthog'] != 'undefined') {
            let obj = eventName;
            if (properties) {
              obj = { event: eventName, properties: properties }
            }
            (<any>window)['posthog'].capture(obj);
            this.hasFired = true;
            // (<any>window)['posthog'].capture(eventName, {
            //     company_id: company.id,
            //     company_name: company.name,
            //     event_type: 'Form',
            //     form_id: form.id,
            //     form_title: form.title
            // });
        }
    }

    registerUser(email: string, id: number, createdAtDate: any, company: Company) {
        if (typeof (<any>window)['posthog'] != 'undefined') {
          const dateInteger = new Date(createdAtDate).getTime();
          const userId = `${id}${dateInteger}`;
          (<any>window)['posthog'].identify(userId);
          (<any>window)['posthog'].people.set({email: email, company_id: company.id, company_name: company.name});
        }
      }


}
