import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { AlertControllerService } from "./alert.service";

@Injectable()
export class LogService {
isProduction = (environment.production === true);

  constructor(private alertService: AlertControllerService) {}

  console(error: any, alert?: boolean) {
      if (this.isProduction === true) {
        if (alert === true) {
            this.alertService.serverError(error.error.errorType, error.error.data);
        }
      } else {
        
        if (alert === true) {
            this.alertService.serverError(error.error.errorType, error.error.data);
        }
      }
  }

  error(message: string) {
    this.alertService.error(message);
  }

  success(message: string) {
    this.alertService.success(message);
  }

  warn(message: string, showConsole?: boolean, error?: any) {
    if (this.isProduction === true) {
      if (showConsole) {
      }
      this.alertService.warn(message);
    } else {
      if (showConsole) {
        
      }
      this.alertService.warn(message);
    }
  }

}
