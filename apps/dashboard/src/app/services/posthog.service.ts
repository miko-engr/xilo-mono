import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/client.model';
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import {Company} from "../models/company.model";

@Injectable()
export class PosthogService {

  constructor() {}

  captureEvent(eventName: any, properties: any = {}) {
    if (environment.production && typeof (<any>window)['posthog'] != 'undefined') {
      (<any>window)['posthog'].capture(eventName, properties);
    }
  }

  registerUser(email: string, id: number, createdAtDate: any, company: Company) {
    if (environment.production && typeof (<any>window)['posthog'] != 'undefined') {
      const dateInteger = new Date(createdAtDate).getTime();
      const userId = `${id}${dateInteger}`;
      (<any>window)['posthog'].identify(userId);
      (<any>window)['posthog'].people.set({email: email, company_id: company.id, company_name: company.name});
    }
  }

}
