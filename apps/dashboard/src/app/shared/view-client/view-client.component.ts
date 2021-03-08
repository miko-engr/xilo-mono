import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CompanyService } from '../../services/company.service';
import { Client } from '../../models/client.model';
import { Driver } from '../../models/driver.model';
import { Vehicle } from '../../models/vehicle.model';
import { Lifecycle } from '../../models/lifecycle.model';
import { Agent } from '../../models/agent.model';
import { LifecycleService } from '../../services/lifecycle.service';
import { AgentService } from '../../services/agent.service';
import { DriverService } from '../../services/driver.services';
import { VehicleService } from '../../services/vehicle.service';
import { AlertControllerService } from '../../services/alert.service';
import { NoteService } from '../../services/note.serivce';
import { Note } from '../../models/note.model';
import { HomeService } from '../../services/home.services';
import { Company } from '../../models/company.model';
import { LogService } from '../../services/log.service';
import { FeatureFlags } from '../enums/featureFlags.enum';

@Component({
  selector: 'app-client-view',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ClientViewComponent implements OnInit {
  agents: Agent[] = [];
  autoTabActive = false;
  client = new Client(null);
  clientTabActive = true;
  commercialTabActive = false;
  formSubmissionTabActive = false;
  homeTabActive = false;
  company = new Company(null);
  driver = new Driver(null);
  driverIndex = 0;
  drivers: Driver[] = [];
  editInputs = false;
  isAgent = false;
  isUser = false;
  lifecycles: Lifecycle[] = [];
  loading = false;
  notesTabActive = false;
  note = new Note(null);
  vehicles: Vehicle[] = [];
  vehicle = new Vehicle(null);
  vehicleIndex = 0;
  urlDirect = '';
  tab = 'client';
  activeLink = '';


  constructor(
    private activatedRoute: ActivatedRoute,
    private agentService: AgentService,
    private alertService: AlertControllerService,
    private clientService: ClientService,
    private companyService: CompanyService,
    private driverService: DriverService,
    private lifecycleService: LifecycleService,
    private logService: LogService,
    private noteService: NoteService,
    private router: Router,
    private vehicleService: VehicleService,
    private homeService: HomeService
  ) {
  }

  ngOnInit() {
    this.getRoute();
    this.checkFormSubmissionTabActiveByFeatureFlag();
  }

  checkFormSubmissionTabActiveByFeatureFlag() {
    this.companyService.hasFlags(FeatureFlags.FORM_SUBMISSIONS, false).then((res) => {
      this.formSubmissionTabActive = res;
    });
  }

  addNote() {
    this.note.clientNoteId = +this.client.id;
    this.note.companyNoteId = +this.client.companyClientId;
    this.noteService.post(this.note)
      .subscribe(newNote => {
        this.client.notes.push(newNote['obj']);
        this.alertService.success('Note Created Successfully');
        this.editInputs = false;
      }, error => {
        this.logService.console(error, true);
      });
  }

  changeRoutes(route: string) {
    this.tab = route;
    if (route === 'client') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'client';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/client`]);
      } else {
        this.activeLink = 'client';
        this.router.navigate([`/agent/clients-table/view/${this.client.id}/client`]);
      }
    } else if (route === 'submissions') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'submissions';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/submissions`]);
      } else {
        this.activeLink = 'submissions';
        this.router.navigate([`/agent/clients-table/view/${this.client.id}/submissions`]);
      }
    } else if (route === 'auto') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'auto';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/auto`]);
      } else {
        this.activeLink = 'auto';
        this.router.navigate([`/agent/clients-table/view/${this.client.id}/auto`]);
      }
    } else if (route === 'notes') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'notes';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/notes`]);
      } else {
        this.activeLink = 'notes';
        this.router.navigate([`/agent/clients-table/view/${this.client.id}/notes`]);
      }
    } else if (route === 'home') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'home';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/home`]);
      } else {
        this.activeLink = 'home';
        this.router.navigate([`/agent/clients-table/view/${this.client.id}/home`]);
      }
    } else if (route === 'documents') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'documents';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/documents`]);
      } else {
        this.router.navigate([`/agent/clients-table/view/${this.client.id}/documents`]);
      }
    } else if (route === 'commercial') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'commercial';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/commercial`]);
      } else {
        this.activeLink = 'commercial';
        this.router.navigate([`/agent/clients-table/view/${this.client.id}/commercial`]);
      }
    } else if (route === 'flow') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'flow';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/flow`]);
      }
    } else if (route === 'rates') {
      if (this.urlDirect === 'profile') {
        this.activeLink = 'rates';
        this.router.navigate([`/profile/prospects/view/${this.client.id}/rates`]);
      }
    }
  }

  deleteClient() {
    if (confirm('Are you sure you want to delete this client?')) {
      if (this.isUser === true) {
        this.clientService.deleteByUser(this.client)
          .subscribe(data => {
            this.router.navigate(['/profile/prospects']);
            this.alertService.success('Client Deleted Successfully');
          }, error => {
            this.logService.console(error, true);
          });
      } else if (this.isAgent === true) {
        this.clientService.deleteByAgent(this.client)
          .subscribe(data => {
            this.router.navigate(['/agent/clients-table-table']);
            this.alertService.success('Client Deleted Successfully');
          }, error => {
            this.logService.console(error, true);
          });
      }
    }
  }

  getAgentsForAgent() {
    this.agentService.getByCompanyForAgent()
      .subscribe(agents => {
        this.agents = agents['obj'];
      }, error => {
        this.logService.console(error, false);
      });
  }

  getAgentsForUser() {
    this.agentService.getByCompanyForUser()
      .subscribe(agents => {
        this.agents = agents['obj'];
      }, error => {
        this.logService.console(error, false);
      });
  }

  getAgentClient(id: string) {
    const client = new Client(id);
    this.clientService.getClientByAgent(client)
      .subscribe(client => {
        this.client = client['obj'];
      }, error => {
        this.logService.console(error, false);
      });
  }

  getLifecyclesForAgent() {
    this.lifecycleService.getByCompanyForAgent()
      .subscribe(lifecycles => {
        this.lifecycles = lifecycles['obj'];
      }, error => {
        this.logService.console(error, false);
      });
  }

  getLifecyclesForUser() {
    this.lifecycleService.getByCompanyForUser()
      .subscribe(lifecycles => {
        this.lifecycles = lifecycles['obj'];
      }, error => {
        this.logService.console(error, false);
      });
  }

  getUserClient(id: string) {
    const client = new Client(id);
    this.clientService.getClientByUser(client)
      .subscribe(client => {
        this.client = client['obj'];
        this.onBlurBirthday();
      }, error => {
        this.logService.console(error, false);
      });

  }

  getClient(id: string) {
    const client = new Client(id);
    this.clientService.getClientByParams(client, 'drivers')
      .subscribe(rClient => {
        this.client = rClient;
      }, error => {
        this.logService.console(error, false);
      });

  }

  getRoute() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const url = this.router.url;
    const urlArray = url.split('/');
    this.urlDirect = urlArray[1];
    this.activeLink = urlArray[5];
    const token = localStorage.getItem('token');
    const decoded: any = atob(token.split('.')[1]);
    const isAgent = JSON.parse(decoded).hasOwnProperty('agent')
    if (this.urlDirect === 'profile' && !isAgent) {
      this.getClient(id);
      this.getCompany();
      this.isUser = true;
    } else if (this.urlDirect === 'agent' && isAgent) {
      this.getClient(id);
      this.getCompanyAgents();
      this.getLifecyclesAgents();
      this.isAgent = true;
    } else {
      localStorage.removeItem('token');
    }
  }

  returnToTable() {
    if (this.isAgent) {
      this.router.navigate(['/agent/clients-table']);
    } else {
      this.router.navigate(['/profile/prospects']);
    }
  }

  getCompany() {
    this.company = new Company(null);
    this.loading = true;
    this.companyService.get()
      .subscribe(company => {
        this.company = company['obj'];
        this.loading = false;
      }, error => {
        this.loading = false;
        this.logService.console(error, true);
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
            this.loading = false;
          }, error => {
            this.loading = false;
            this.logService.console(error, true);
          });
      }, error => {
        this.logService.console(error, true);
      });
  }

  getLifecyclesAgents() {
    this.agentService.getLifecycles()
      .subscribe(agent => {
        //  this.clientLifecycles = agent['obj'].company.lifecycles;
        this.company = agent['obj'].company;
      }, error => {
        this.logService.console(error, true);
      });
  }

  // Allows the company to edit inputs by clicking edit button
  onEditInputs() {
    this.editInputs = !this.editInputs;
  }

  onBlurBirthday() {
    const localDate = new Date(this.client.birthDate);
    const localTime = localDate.getTime();
    const localOffset = localDate.getTimezoneOffset() * 60000;
    this.client.birthDate = new Date(localTime + localOffset);
  }

  returnClientField(client: Client, field: string) {
    if (field === 'name') {
      if (client.firstName && client.lastName) {
        return `${client.lastName}, ${client.firstName}`;
      } else if (client.firstName) {
        return `--, ${client.firstName}`;
      } else if (client.lastName) {
        return `${client.lastName}, --`;
      } else if (client.drivers && client.drivers[0]) {
        const driver = client.drivers[0];
        if (driver.applicantGivenName && driver.applicantSurname) {
          return `${driver.applicantSurname}, ${driver.applicantGivenName}`;
        } else if (driver.applicantGivenName) {
          return `--, ${driver.applicantGivenName}`;
        } else if (driver.applicantSurname) {
          return `${driver.applicantSurname}, --`;
        }
      }
    }
  }

  styleGroups() {
    if (this.editInputs === true) {
      return { 'margin-bottom': '37px' };
    }
  }

  styleDriverTabs(i: any) {
    if (this.driverIndex == i) {
      return { 'border-bottom': '4px solid #7c7fff', 'color': '#000' };
    }
  }

  styleVehicleTabs(j: any) {
    if (this.vehicleIndex == j) {
      return { 'border-bottom': '4px solid #7c7fff', 'color': '#000' };
    }
  }

  // Styles the tabs with a border bottom
  styleTabs(tab: string) {
    if (this.tab === 'client' && tab === 'client') {
      return { 'border-bottom': '4px solid #7c7fff', 'color': '#000' };
    } else if (this.tab === 'auto' && tab === 'auto') {
      return { 'border-bottom': '4px solid #7c7fff', 'color': '#000' };
    } else if (this.tab === 'notes' && tab === 'notes') {
      return { 'border-bottom': '4px solid #7c7fff', 'color': '#000' };
    } else if (this.tab === 'home' && tab === 'home') {
      return { 'border-bottom': '4px solid #7c7fff', 'color': '#000' };
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
        this.logService.console(error, true);
      });
  }

  updateDriverAndVehicle() {
    this.updateDriver();
    this.updateVehicle();
  }

  updateHome() {
    if (this.client.homes[0].id === undefined || this.client.homes[0].id == null) {
      this.homeService.createHome(this.client.homes[0]).subscribe(home => {
        this.client.homes[0] = home;
      }, error => {
        this.logService.console(error, false);
      });
    } else {
      this.homeService.update(this.client.homes[0]).subscribe(home => {
      }, error => {
        this.logService.console(error, false);
      });
    }
  }

  updateDriver() {
    this.driverService.updateDriver(this.client.drivers[this.driverIndex])
      .subscribe(driver => {
        this.editInputs = false;
        this.alertService.success('Driver Updated Successfully');
      }, error => {
        this.logService.console(error, true);
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
        this.logService.console(error, true);
      });
  }

}
