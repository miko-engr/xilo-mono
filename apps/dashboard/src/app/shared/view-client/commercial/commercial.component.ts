import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { Client } from '../../../models/client.model';
import { AgentService } from '../../../services/agent.service';
import { AlertControllerService } from '../../../services/alert.service';
import { uniqBy } from 'lodash';
import { LogService } from '../../../services/log.service';


@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['../view-client.component.css']
})
export class ClientCommercialComponent implements OnInit {
  client = new Client(null);
  company = new Company(null);
  editInputs = false;
  isAgent = false;
  isUser = false;
  loading = false;
  clientRetrieved = false;

  businessRows = [];
  businessRowsCreated = false;
  keysRetrieved = false;
  keys = {};
  locationRows = [];
  locationRowsCreated = false;
  locationKeys = {};
  locationIndex = 0;

  constructor(
    private agentService: AgentService,
    private alertService: AlertControllerService,
    private clientService: ClientService,
    private companyService: CompanyService,
    private logService: LogService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getRoute();
  }

  async createBusinessRows(keys: any) {
    if (this.client.hasOwnProperty('business') && this.client.business) {
        for (const [key, value] of Object.entries(keys)) {
            if (this.client.business[key] || this.client.business[key] === false) {
                const row = {label: this.returnKeyLabel(key), value: this.client.business[key] || 'Not Completed'};
                this.businessRows.push(row);
            }
        }
    }
    this.businessRowsCreated = true;
}

    async createLocationRows(i: any) {
        this.locationRowsCreated = false;
        this.locationRows = [];

        for (const key in this.locationKeys) {
            if (this.client.locations[i][key]) {
                const row = {label: this.returnKeyLabel(key, 'locations'), value: this.client.locations[i][key] ||
                    'Not Completed'};
                this.locationRows.push(row);
            }
        }
        this.locationRows = this.returnUniqRows(this.locationRows);
        this.locationRowsCreated = true;
    }

    changeLocationIndex(j: any) {
        this.locationIndex = j;
    }

    styleLocationTabs(j: any) {
        if (this.locationIndex == j) {
            return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
        }
    }

    getClient(id: string) {
        const client = new Client(id);
        const clientParams = 'business,locations';
        this.clientService.getClientByParams(client, clientParams)
            .subscribe(rClient => {
                this.client = rClient;
                this.getKeys();
            }, error => {
                this.logService.console(error, false);
            });
    }

    getAgentClient(id: string) {
        const client = new Client(id);
        this.clientService.getClientByAgent(client)
            .subscribe(client => {
                this.client = client['obj'];
                this.clientRetrieved = true;
                this.getCompanyAgents();
            }, error => {

            });
    }

    getUserClient(id: string) {
        const client = new Client(id);
        this.clientService.getClientByUser(client)
            .subscribe(client => {
                this.client = client['obj'];
                this.clientRetrieved = true;
                this.getCompany();
            }, error => {

            });

    }

    getRoute() {
        const url = this.router.url;
        const urlArray = url.split('/');
        const urlDirect = urlArray[1];
        const id = urlArray[4];
        if (urlDirect === 'profile') {
            this.getClient(id);
            this.isUser = true;
            this.clientRetrieved = true;
            this.getCompany();
        } else if (urlDirect === 'agent') {
            this.getClient(id);
            this.isAgent = true;
            this.clientRetrieved = true;
            this.getCompanyAgents();
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
                        this.loading = false;
                    }, error => {
                        this.loading = false;
                        this.alertService.serverError(error.error.errorType, error.error.data);

                    });
            }, error => {
                this.alertService.serverError(error.error.errorType, error.error.data);

            });
    }

    styleGroups() {
        if (this.editInputs === true) {
            return {'margin-bottom': '37px'};
        }
    }

    returnUniqRows(rows: any) {
        return uniqBy(rows, 'label');
    }

    async getKeys() {
        try {
            this.keys = await this.companyService.getKeysAsync('all', 'business');
            this.locationKeys = await this.companyService.getKeysAsync('all', 'locations');
            this.keysRetrieved = true;
            this.createBusinessRows(this.keys);
            this.createLocationRows(0);
        } catch (error) {
            this.logService.console(error, false);
        }
      }

    returnKeyLabel(key: string, type?: string) {
        if (type === 'locations') {
            const rKey = this.locationKeys[key];
            return rKey;
        } else {
            const rKey = this.keys[key];
            return rKey;
        }
    }

}
