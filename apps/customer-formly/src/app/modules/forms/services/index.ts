import { DynamicFormControlService } from './dynamic-form-control.service';
import { FormService } from './form.service';
import { ClientService } from './client.service';
import { PageService } from './page.service';
import { ApiService } from './api.service';
import { AnswerService } from './answer.service';
import {AnalyticsService} from "./analytics.service";
import { 
  CompanyService, 
  FormViewService, 
  NoteService,
  NotificationService, 
  VehicleService,
  VehicleListService, 
} from '@xilo-mono/form-contracts';
import { AgentService } from './agent.service';

export * from './form.service';
export * from './dynamic-form-control.service';
export * from './vehicle-list.service';
export * from './client.service';
export * from './page.service';
export * from './agent.service';
export * from './api.service';
export * from './answer.service';
export * from './applicationState.service';
export * from './analytics.service';

// export all services for adding it to provider easily
export const SERVICES = [
  DynamicFormControlService,
  FormService,
  VehicleListService,
  ClientService,
  PageService,
  ApiService,
  AnswerService,
  AnalyticsService,
  FormViewService,
  NotificationService,
  CompanyService,
  FormViewService,
  AgentService,
  NoteService,
  VehicleService,
  NotificationService,
  VehicleListService
];
