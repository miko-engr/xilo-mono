import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { Client } from '../../../models/client.model';
import { AgentService } from '../../../services/agent.service';
import { AlertControllerService } from '../../../services/alert.service';
import { uniqBy } from 'lodash';
import { LogService } from '../../../services/log.service';
import { RateService } from '../../../services/rate.service';
import { Rate } from '../../../models/rate.model';
import { AnswerService } from '../../../services/answer.service';
import { formatPhoneNumber } from '../../../utils/utils';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['../view-client.component.css']
})
export class ClientComponent implements OnInit {
  client = new Client(null);
  company = new Company(null);
  editInputs = false;
  isAgent = false;
  isUser = false;
  loading = false;

  clientRows = [];
  clientRowsCreated = false;

isClient = true;
isAuto = false;
isHome = false;
isNotes = false;
sub = {};
selectedTag = '';
rates: Rate[] = [];
ratesRetrieved = false;
ratesRows = [];
keys = {};
keysRetrieved = false;
decryptedValue = null;


  constructor(
    private activatedRoute: ActivatedRoute,
    private agentService: AgentService,
    private answerService: AnswerService,

    private alertService: AlertControllerService,
    private clientService: ClientService,
    private companyService: CompanyService,
    private logService: LogService,
    private rateService: RateService,
    private router: Router,
  ) { }

    ngOnInit() {
        this.getRoute();
        this.activatedRoute.data
        .subscribe(v =>
            this.isClient = v.some_data);
    }

     addTag(event: any) {
        if (!this.client.tags || this.client.tags.length < 1) {
            this.client.tags = [];
            this.client.tags.push(event);
        } else {
            if (this.client.tags.indexOf(event) < 0) {
                this.client.tags.push(event);
            }
        }
        this.updateClient(this.client);
    }

    isEncrypted(value: string) {
        return value.includes('Encrypted');
    }

    remove(tag: string): void {
        const index = this.client.tags.indexOf(tag);

        if (index >= 0) {
            this.client.tags.splice(index, 1);
            this.updateClient(this.client);
        }
    }

    async showEncryption(key: string, id: any) {
        const newKey = this.getKeyByValue(this.keys, key);
        this.decryptedValue = await this.answerService.showEncryption('Client', newKey, id);
    }

      getKeyByValue(object: any, value: string) {
        return Object.keys(object).find(key => object[key] === value);
      }

    async createClientRows(keys: any) {
        for (const [key, value] of Object.entries(keys)) {
            if (this.client[key] && this.client[key] !== false) {
                const row = {label: this.returnKeyLabel(key), value: this.client[key] || 'Not Completed'};
                this.clientRows.push(row);
            }
        }
        this.clientRowsCreated = true;
    }


  getAgentClient(id: string) {
      const client = new Client(id);
      this.clientService.getClientByAgent(client)
          .subscribe(client => {
              this.client = client['obj'];
              this.getCompanyAgents();
              this.getRates();
          }, error => {

          });
  }

  getClient(id: string) {
    const client = new Client(id);
    this.clientService.getClientByParams(client, 'drivers')
        .subscribe(rClient => {
            this.client = rClient;
            this.getRates()
            this.getKeys();
        }, error => {
            this.logService.console(error, false);
        });
    }

  getUserClient(id: string) {
      const client = new Client(id);
      this.clientService.getClientByUser(client)
          .subscribe(client => {
              this.client = client['obj'];
              this.getCompany();
              this.getRates();
          }, error => {

          });

  }

  async getRates() {
      this.rates = await this.rateService.getByClientAsync(this.client);
      if (this.rates) {
          this.rates.forEach(rate => {
              this.ratesRows.push({label: rate.type, value: `${rate.title} - $${rate.price} Premium`});
          });
      }
      this.ratesRetrieved = true;
  }

  getRoute() {
      const url = this.router.url;
      const urlArray = url.split('/');
      const urlDirect = urlArray[1];
      const id = urlArray[4];
      if (urlDirect === 'profile') {
          this.getClient(id);
          this.isUser = true;
          this.getCompany();
      } else if (urlDirect === 'agent') {
          this.getClient(id);
          this.getLifecyclesAgents();
          this.isAgent = true;
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

  getLifecyclesAgents() {
      this.agentService.getLifecycles()
          .subscribe(agent => {
              //  this.clientLifecycles = agent['obj'].company.lifecycles;
              this.company = agent['obj'].company;
          }, error => {

              this.alertService.serverError(error.error.errorType, error.error.data);
          });
  }

  styleGroups() {
      if (this.editInputs === true) {
          return {'margin-bottom': '37px'};
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

                      this.alertService.serverError(error.error.errorType, error.error.data);
                  });
            } else if (this.isAgent === true) {
              this.clientService.deleteByAgent(this.client)
                  .subscribe(data => {
                      this.router.navigate(['/profile/prospects']);
                      this.alertService.success('Client Deleted Successfully');
                  }, error => {

                      this.alertService.serverError(error.error.errorType, error.error.data);
                  });
          }
      }
  }

  // Allows the company to edit inputs by clicking edit button
  onEditInputs() {
      this.editInputs = !this.editInputs;
  }

    updateClient(client: Client) {
        this.clientService.updateClientData(this.client)
            .subscribe(updatedClient => {
                this.editInputs = false;
                this.alertService.success('Client Updated Successfully.');
            }, error => {

                this.alertService.serverError(error.error.errorType, error.error.data);
            });
    }

    returnUniqRows(rows: any) {
        return uniqBy(rows, 'label');
    }


    async getKeys() {
        try {
            this.keys = await this.companyService.getKeysAsync('all', 'client');
            this.keysRetrieved = true;
            this.createClientRows(this.keys);
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    returnKeyLabel(key: string) {
        const rKey = this.keys[key];
        return rKey;
    }

    formatText(value) {
        const validatePhone = new RegExp("^[0-9]{10}$");
        const isPhoneNumber = validatePhone.test(value);
        return value = isPhoneNumber ? formatPhoneNumber(value) : value;
    }

}
