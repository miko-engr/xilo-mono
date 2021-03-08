import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute} from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { Client } from '../../../models/client.model';
import { AgentService } from '../../../services/agent.service';
import { AlertControllerService } from '../../../services/alert.service';
import { DriverService } from '../../../services/driver.services';
import { VehicleService } from '../../../services/vehicle.service';
import { Driver } from '../../../models/driver.model';
import { Vehicle } from '../../../models/vehicle.model';
import { uniqBy } from 'lodash';
import { LogService } from '../../../services/log.service';
import { AnswerService } from '../../../services/answer.service';
import { Answer } from '../../../models/answer.model';



@Component({
  selector: 'app-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['../view-client.component.css']
})
export class AutoComponent implements OnInit {
    client = new Client(null);
    company = new Company(null);
    driver = new Driver(null);
    driverIndex = 0;
    drivers: Driver[] = [];
    editInputs = false;
    isAgent = false;
    isUser = false;
    loading = false;
    vehicles: Vehicle[] = [];
    vehicle = new Vehicle(null);
    vehicleIndex = 0;
    clientRetrieved = false;
    driverRows = [];
    vehicleRows = [];

    driverRowsCreated = false;
    vehicleRowsCreated = false;
    keysRetrieved = false;
    keys = {};
    driverKeys = {};
    vehicleKeys = {};
    decryptedValue = null;

    answersRetrieved = false;
    answers: Answer[] = [];
    params: Params = Object.assign({}, this.route.snapshot.params);

  constructor(
    private agentService: AgentService,
    private alertService: AlertControllerService,
    private answerService: AnswerService,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private companyService: CompanyService,
    private driverService: DriverService,
    private logService: LogService,
    private router: Router,
    private vehicleService: VehicleService
  ) { }

  ngOnInit() {
    this.getRoute();
  }

  getAnswers(formId: any) {
    if (!formId) {
      return this.router.navigate(['/profile/prospects']);
    }
    this.answerService.getAnswersByFormId(formId)
    .subscribe(data => {
      this.answers = data['obj'];
      this.answersRetrieved = true;
      this.getCompany();
      this.loading = false;
    }, error => {
      this.logService.console(error, true);
      this.loading = false;
    });
  }

    async createDriverRows(i: any) {
        this.driverRowsCreated = false;
        this.driverRows = [];
        if (this.client.hasOwnProperty('drivers') && this.client.drivers.length > 0) {
            for (const key in this.driverKeys) {
                if (this.client.drivers[i][key]) {
                    const row = {label: this.returnKeyLabel(key, 'drivers'), value: this.client.drivers[i][key] ||
                        'Not Completed'};
                    this.driverRows.push(row);
                }
            }
        }
        this.driverRows = this.returnUniqRows(this.driverRows);
        this.driverRowsCreated = true;
    }

    async createVehicleRows(i: any) {
        this.vehicleRowsCreated = false;
        this.vehicleRows = [];

        if (this.client.hasOwnProperty('vehicles') && this.client.vehicles.length > 0) {
            for (const key in this.vehicleKeys) {
                if (this.client.vehicles[+i][key]) {
                    const row = {label: this.returnKeyLabel(key, 'vehicles'), value: this.client.vehicles[+i][key] ||
                        'Not Completed'};
                    this.vehicleRows.push(row);
                }
            }
        }
        this.vehicleRowsCreated = true;
    }

  getAgentClient(id: string) {
      const client = new Client(id);
      this.clientService.getClientByAgent(client)
          .subscribe(rClient => {
              this.client = rClient['obj'];
              this.getCompanyAgents();
              this.clientRetrieved = true;
          }, error => {

          });
  }

  getRoute() {
      const url = this.router.url;
      const urlArray = url.split('/');
      const urlDirect = urlArray[1];
      const id = urlArray[4];
      if (urlDirect === 'profile') {
          this.getUserClient(id);
          this.isUser = true;
      } else if (urlDirect === 'agent') {
          this.getAgentClient(id);
          this.getLifecyclesAgents();
          this.isAgent = true;
      }

  }

  getUserClient(id: string) {
      const lient = new Client(id);
      this.clientService.getClientByUser(lient)
          .subscribe(client => {
            if (client != null || client !== undefined) {
                this.client = client['obj'];
                this.getCompany();
                this.clientRetrieved = true;
            }
          }, error => {

          });

  }

  getCompany() {
      this.company = new Company(null);
      this.loading = true;
      this.companyService.get()
          .subscribe(company => {
              this.company = company['obj'];
              this.getAnswers(this.client.formClientId);
              this.getKeys();
              this.loading = false;
          }, error => {
              this.loading = false;
              this.alertService.serverError(error.error.errorType, error.error.data);

          });
  }

  getCompanyAgents() {
      this.agentService.get()
          .subscribe(agent => {
              this.company = new Company(null);
              this.loading = false;
              this.companyService.getByAgent()
                  .subscribe(company => {
                      this.company = company['obj'];
                      this.getKeys();
                      this.loading = false;
                  }, error => {
                      this.loading = false;
                      this.alertService.serverError(error.error.errorType, error.error.data);

                  });
          }, error => {
              this.alertService.serverError(error.error.errorType, error.error.data);

          });
  }

  getLifecyclesAgents() {
      this.agentService.getLifecycles()
          .subscribe(agent => {
              //  this.clientLifecycles = agent['obj'].company.lifecycles;
              this.company = agent['obj'].company;
          }, error => {

              this.alertService.serverError(error.error.errorType, error.error.data);
          });
  }

  changeDriverIndex(i: any) {
      this.driverIndex = i;
  }

  changeVehicleIndex(j: any) {
      this.vehicleIndex = j;
  }

  returnUniqRows(rows: any) {
    return uniqBy(rows, 'label');
  }

  styleGroups() {
      if (this.editInputs === true) {
          return {'margin-bottom': '37px'};
      }
  }

  styleDriverTabs(i: any) {
      if (+this.driverIndex === +i) {
          return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
      }
  }

  styleVehicleTabs(j: any) {
      if (+this.vehicleIndex === +j) {
          return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
      }
  }

  updateClient() {
      this.clientService.agentPatchClient(this.client)
          .subscribe(updatedClient => {
              this.editInputs = false;
              this.alertService.success('Client Updated Successfully');
              if (this.isAgent) {
                  this.getAgentClient(this.client.id);
              } else {
                  this.getUserClient(this.client.id);
              }
          }, error => {

              this.alertService.serverError(error.error.errorType, error.error.data);
          });
  }

  updateDriverAndVehicle() {
      this.updateDriver();
      this.updateVehicle();
  }

  updateDriver() {
      this.driverService.updateDriver(this.client.drivers[this.driverIndex])
          .subscribe(driver => {
              this.editInputs = false;
              this.alertService.success('Driver Updated Successfully');
          }, error => {

              this.alertService.serverError(error.error.errorType, error.error.data);
          });
      if (this.driverIndex === 0) {
          this.updateClient();
      }
  }

  updateVehicle() {
      this.vehicleService.updateVehicle(this.client.vehicles[this.vehicleIndex])
          .subscribe(vehicle => {
              this.editInputs = false;
              this.alertService.success('Vehicle Updated Successfully');
          }, error => {

              this.alertService.serverError(error.error.errorType, error.error.data);
          });
  }

  // Allows the company to edit inputs by clicking edit button
  onEditInputs() {
      this.editInputs = !this.editInputs;
  }

  async getKeys() {
    try {
        this.driverKeys = await this.companyService.getKeysAsync('all', 'drivers');
        this.vehicleKeys = await this.companyService.getKeysAsync('all', 'vehicles');
        this.changeDriverIndex(0);
        this.changeVehicleIndex(0);
        this.createDriverRows(0);
        this.createVehicleRows(0);
        this.keysRetrieved = true;
    } catch (error) {
        this.logService.console(error, false);
    }
  }

  returnKeyLabel(key: string, type: string) {
    if (type === 'vehicles') {
        return this.vehicleKeys[key];
    } else {
        return this.driverKeys[key];
    }
  }

  isEncrypted(value: string) {
      return value.includes('Encrypted');
  }

  getKeyByValue(object: any, value: string) {
    return Object.keys(object).find(key => object[key] === value);
  }

  async showEncryption(key: string, id: any) {
    const newKey = this.getKeyByValue(this.driverKeys, key);
    this.decryptedValue = await this.answerService.showEncryption('Driver', newKey, id);
  }


}
