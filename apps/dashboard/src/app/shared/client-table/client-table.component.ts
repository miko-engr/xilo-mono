import { Component, OnInit, HostListener } from '@angular/core';
import moment from 'moment';

import { CompanyService } from '../../services/company.service';
import { AlertControllerService } from '../../services/alert.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { Agent } from '../../models/agent.model';
import { AgentService } from '../../services/agent.service';
import { Lifecycle } from '../../models/lifecycle.model';
import { Company } from '../../models/company.model';
import { LifecycleAnalytic } from '../../models/lifecycle-analytic.model';
import { LifecycleAnalyticService } from '../../services/lifecycle-analytic.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LogService } from '../../services/log.service';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FileService } from '../../services/file.service';
import { AnswerService } from '../../services/answer.service';
import { IntegrationService } from '../../services/integration.service';
import { EmailService } from '../../services/email.service';
import { Form } from '../../models/form.model';
import { FormService } from '../../services/form.service';
import { environment } from '../../../environments/environment';
import { HawksoftService } from '../../services/hawksoft.service';
import { LifecycleEmailService } from '../../services/lifecycle-email.service';

import { PdfService } from '../../services/pdf.service';
import { Pdf } from '../../models/pdf.model';
import { AgencyMatrixService } from '../../services/agency-matrix.service';
import { AppliedEpicService } from '../../services/applied-epic.service';
import { AgencySoftwareService } from '../../services/agency-software.service';
import { SalesforceService } from '../../services/salesforce.service';
import { MyEvoService } from '../../services/my-evo.service';
import { AMS360Service } from '../../services/ams360.service';
import { AppliedService } from '../../services/applied.service';
import { InfusionsoftService } from '../../services/infusionsoft.service';
import { PipedriveService } from '../../services/pipedrive.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NotesCreateDialogComponent } from '../dialogs/notes-create-dialog/notes-create-dialog.component';
import { AcordService } from '../../services/acord.service';
import { AnalyticsV2Service } from '../../services/analyticsv2.service';
import { LifecycleService } from '../../services/lifecycle.service';
import { FlowService } from '../../services/flow.service';
import { TextMessageService } from '../../services/text-message.service';
import { Flow } from '../../models/flow.model';
import { TextMessage } from '../../models/text-message.model';
import { Email } from '../../models/email.model';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { IntegrationValidatorDialogComponent } from '../dialogs/integration-validator/validator-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EZLynxService } from '../../services/ezlynx.service';
import { PLRaterService } from '../../services/pl-rater.service';
import { IValidation } from '../../models/integration-validation.model';
import { ValidationDialogComponent } from '../dialogs/validation-dialog/validation-dialog.component';
import { XanatekService } from '../../services/xanatek.service';
import { FilterParams } from '../../models/filterParams.model';
import { LoaderModalService } from '../../services/loader-modal.service';
import { ToastService } from '../../services/toast.service';
import { SubmissionService } from '@xilo-mono/form-contracts';
import { switchMap } from 'rxjs/operators';
import { formatPhoneNumber } from '../../utils/utils';

export interface ILifecycleDataPoint {
    id?: string;
    title?: string;
    count?: string;
    color?: string;
    position?: number;
}

@Component({
    selector: 'app-client-table',
    templateUrl: './client-table.component.html',
    styleUrls: ['./client-table.component.css']
})
export class ClientTableComponent implements OnInit {
  actionButtonToggle = false;
  addNote = false;
  lastNameFilter: any = {  lastName: '' };
  clients: Client[] = [];
  clientLifecycles: Lifecycle[] = [];
  clientsRetrieved = false;
  agent = new Agent(null);
  company = new Company(null);
  disableSendButtons = false;
  filterAgentId = null;
  filterCategory = 'agent';
  filterCycleId = null;
  filterDateId = null;
  filterFormId = null;
  tagId = null;
  filterDict = {};
  client = {};
  loading = false;
  lifecycleColor: string[] = [];
  p = 1;
  userRetrieved = false;
  isUser = true;
  user: User;
  test = false;
  pdfs: Pdf[];
  flows: Flow[];
  textMessage: TextMessage;
  email: Email;
  forms: Form[] = null;
  simpleForms: Form[] = null;
  allForms: Form[] = [];
  formsRetrieved = false;
  simpleFormsRetrieved = false;
  selection = [];
  masterToggleSelected = false;
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  origClients: Client[] = [];
  dateFilter = 'allTime';
  fullName = this.queryParams.fullName || '';
  phone = this.queryParams.phone || '';
  agentMenuActive = false;
  agentMenuIndex = null;
  // popup
  show = false;
  lifecycleData = {};
  lifecyclesRetrieved = false;
  lifecycleDataRetrieved = false;
  updatingFilters = false;
  from = null;
  to = null;

  currentSettings: any = null;
  lifecycleDataPoints: ILifecycleDataPoint[] = [];
  todaysDataPoint: ILifecycleDataPoint;
  thisMonthsDataPoint: ILifecycleDataPoint;
  userType = 'agent';
  integrationLoadingList = [];

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler = async ($event: any) => {
      this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: this.queryParams
      }
      );
  }

  constructor(
      private acordService: AcordService,
      private activatedRoute: ActivatedRoute,
      private agencyMatrixService: AgencyMatrixService,
      private appliedEpicService: AppliedEpicService,
      private agencySoftwareService: AgencySoftwareService,
      private alertService: AlertControllerService,
      private analyticsService: AnalyticsV2Service,
      private clientService: ClientService,
      private agentService: AgentService,
      private companyService: CompanyService,
      public dialog: MatDialog,
      private ezlynxService: EZLynxService,
      private hawksoftService: HawksoftService,
      private formService: FormService,
      private fileService: FileService,
      private lifecycleAnalyticService: LifecycleAnalyticService,
      private lifecycleEmailService: LifecycleEmailService,
      private lifecycleService: LifecycleService,
      private loaderModalService: LoaderModalService,
      private integrationService: IntegrationService,
      private logService: LogService,
      private myEvoService: MyEvoService,
      private userService: UserService,
      private pdfService: PdfService,
      private ams360Service: AMS360Service,
      private appliedService: AppliedService,
      private infusionsoftService: InfusionsoftService,
      private flowService: FlowService,
      private emailService: EmailService,
      private textMessageService: TextMessageService,
      private taskService: TaskService,
      private pipedriveService: PipedriveService,
      private plRaterService: PLRaterService,
      private router: Router,
      private route: ActivatedRoute,
      private _bottomSheet: MatBottomSheet,
      private xanatekService: XanatekService,
      private toastService: ToastService,
      private submissionService: SubmissionService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
        this.getRoute();
        this.getQueryParams({});
        this.getForms();
    } else {
        this.router.navigate(['/auth/login']);
    }
  }

  testStuff(stuff) {
  }

  returnMessage(message: string) {
      this.logService.warn(message);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.masterToggleSelected = true;
    this.isAllSelected() ?
        this.selection = [] :
        this.clients.forEach((row, i) => this.selection.push(this.returnIndex(i)));
  }

  integrationsAreLoading(clientId: any) {
      return this.integrationLoadingList.includes(clientId);
  }

  async getForms() {
    const formsObj = await this.formService.getByCompanyAsync();
    if (formsObj) {
        this.allForms = formsObj.allForms;
        this.formsRetrieved = true;
        this.simpleForms = formsObj.simpleForms;
        this.simpleFormsRetrieved = true;
        this.forms = formsObj.customerForms;
        if (this.clientsRetrieved) {
            this.isSimpleForm();
        }
    }
  }

  getRoute() {
      const url = this.router.url;
      const urlArray = url.split('/');
      const urlDirect = urlArray[1];
      if (urlDirect === 'profile') {
          this.isUser = true;
          this.userType = 'user';
          this.getCompany();
          this.getLifecycles();
          this.getPdfs();
      } else if (urlDirect === 'agent') {
          this.userType = 'agent';
          this.isUser = false;
          this.getCompanyAgents();
          this.getLifecycles();
          this.getPdfs();
          this.getAgentsCompany();
      }
  }

  getAgentsCompany() {
    this.company = new Company(null);
    this.companyService.getByAgent()
        .subscribe(company => {
            this.company = company['obj'];
            console.log(this.company)
            this.userRetrieved = true;
        }, error => {
            this.logService.console(error, true);
        });
  }

  deleteAll() {
      if (confirm('Are you sure you want to delete all selected clients?')) {
          this.selection.forEach(i => {
            this.deleteClient(this.clients[i], i, true);
          });
      }
  }

  deleteClient(client: Client, index, dontShowMessage?: boolean) {
    if (dontShowMessage || confirm('Are you sure you want to delete this client?')) {
            if (this.isUser === true) {
                this.clientService.deleteByUser(client)
                    .subscribe(data => {
                        this.clients.splice(index, 1);
                        this.router.navigate(['/profile/prospects']);
                        this.alertService.success('Client Deleted Successfully');
                    }, error => {
                        this.logService.console(error, true);
                    });
            } else if (this.isUser === false) {
                this.clientService.deleteByAgent(client)
                    .subscribe(data => {
                        this.clients.splice(index, 1);
                        this.router.navigate(['/agent/clients-table']);
                        this.alertService.success('Client Deleted Successfully');
                    }, error => {
                        this.logService.console(error, true);
                    });
            }
        }
    }

    companyUpdateClient(client: Client) {
        this.clientService.companyPatch(client)
            .subscribe(updatedClient => {
                this.alertService.success('Client updated successfully');
            }, error => {
                this.logService.console(error, true);
            });
    }

    downloadClient(client: Client) {
        this.clientService.download(client)
            .subscribe(data => {
                this.clientService.deleteDownload(data['fileName'])
                    .subscribe(stats => {
                    }, error => {
                        this.logService.console(error, false);
                    });
            }, error => {
                this.logService.console(error, true);
            });
    }

    filterBy(category: string) {
        this.filterCategory = category;
    }

    getClient(client: Client, i) {
        if (localStorage.getItem('userId') !== null) {
            const flagKeys = Object.keys(this.company.features);
            const hasFormBuilder = flagKeys.includes('formBuilder');
            console.log('Has Form Builder ', hasFormBuilder)
            if (hasFormBuilder) {
                this.router.navigate([`/profile/prospects/view/${client.id}/submission`]);
            } else {
                this.router.navigate(['/profile/prospects/view/', client.id]);
            }
        } else if (localStorage.getItem('agentId') !== null) {
            this.router.navigate(['/agent/clients-table/view/', client.id]);
        }
    }

    getClientForEdit(client: Client, i) {
        if (localStorage.getItem('userId') !== null) {
            localStorage.setItem('showEdit', 'false');
            if (this.company.features) {
                const flagKeys = Object.keys(this.company.features);
                const hasFormBuilder = flagKeys.includes('formBuilder');
                if (hasFormBuilder) {
                    this.router.navigate([`/profile/prospects/view/${client.id}/submissions`]);
                } else {
                    this.router.navigate(['/profile/prospects/view/', client.id]);
                }
            } else {
                this.router.navigate(['/profile/prospects/view/', client.id]);
            }
            // this.router.navigate(['/profile/prospects/view/', client.id]);
        } else if (localStorage.getItem('agentId') !== null) {
            this.router.navigate(['/agent/clients-table/view/', client.id]);
        }
    }

    getCountsByDate() {
        this.clientService.countClients(this.createCopy(this.queryParams), null, '1')
        .subscribe(count => {
            this.todaysDataPoint = { count: count };
        }, error => {
            this.logService.console(error, false);
        });
        this.clientService.countClients(this.createCopy(this.queryParams), null, '30')
        .subscribe(count => {
            this.thisMonthsDataPoint = { count: count };
        }, error => {
            this.logService.console(error, false);
        });
    }

    setLifecycleDataPoints(lifecycles: Lifecycle[]) {
        const lLength = lifecycles.length;
        for (let i=0;i<lLength;i++) {
            const lc = lifecycles[i];
            if (lc.id) {
                this.countClients(this.queryParams, lc);
            }
        }
    }

    getLifecycles() {
        this.lifecycleService.getByCompany()
            .subscribe(lifecycles => {
                this.clientLifecycles = lifecycles;
                this.setLifecycleDataPoints(this.clientLifecycles);
                this.lifecyclesRetrieved = true;
            }, error => {
                this.logService.console(error, true);
            });
    }

    // Retrieves company from userService - User has Clients - Clients have Drivers
    getCompany() {
        this.company = new Company(null);
        this.companyService.get()
            .subscribe(company => {
                this.company = company['obj'];
                if (this.company.hasSalesAutomation) {
                    this.listAllFlowTemplates();
                }
                this.getUser();
                this.userRetrieved = true;
            }, error => {
                this.logService.console(error, true);
            });
    }

    getCompanyAgents() {
        this.agentService.get()
            .subscribe(agent => {
                this.setDataWithSettings(agent);
                this.agent = agent['obj'];
                this.initProfitwell(this.agent.email);
                const tags = this.agent.tags;
                if (!this.agent.canSeeAllClients && this.agent.agentIds && this.agent.agentIds.length && this.agent.agentIds.length > 0) {
                    this.queryParams['agentIds'] = this.agent.agentIds.join(',');
                    const filterParams: FilterParams = { tags: tags, agentIds: this.queryParams['agentIds'] };
                    this.getQueryParams(filterParams);
                } else {
                    this.queryParams['clientAgentId'] = this.agent.canSeeAllClients ? null : this.agent.id.toString();
                    const filterParams: FilterParams = { clientAgentId: this.queryParams['clientAgentId'], tags: tags };
                    this.getQueryParams(filterParams);
                }
            }, error => {
                this.logService.console(error, true);
            });
    }

    initProfitwell(email: string) {
        if (environment.production && this.company.id !== 5 && email && !email.toLowerCase().includes('admin') && this.company.name
            && !(this.company.name.toLowerCase().includes('xilo') || this.company.name.toLowerCase().includes('test')) && window &&
            typeof window['profitwell'] != 'undefined') {
            window['profitwell']('start', {
                'user_id': this.company.id,
                'user_email': email
            });
        }
    }

    getUser() {
        this.userService.get()
            .subscribe(user => {
                this.user = user['obj'];
                this.initProfitwell(this.user.username);
            }, error => {
                this.logService.console(error, true);
            });
    }

    returnClientField(client: Client, field: string) {
        function returnExistsWithArray(array: string, value: string, index?: number) {
            if (client.hasOwnProperty(array)) {
                if (index && client[array] && client[array].length > 0) {
                    const val = client[array][0][value];
                    if (typeof val !== 'undefined' && val) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (!index && client[array] && client[array][value]) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        if (field === 'name') {
            if (client.business && client.business.entityName) {
                return client.business.entityName;
            } else if (client.firstName && client.lastName) {
                return `${client.lastName}, ${client.firstName}`;
            } else if (client.fullName) {
                return `${client.fullName}`;
            } else if (client.firstName) {
                return `--, ${client.firstName}`;
            } else if (client.lastName) {
                return `${client.lastName}, --`;
            } else if (client.drivers && client.drivers[0]) {
                const driver = client.drivers[0];
                if (driver.applicantGivenName && driver.applicantSurname) {
                    return `${driver.applicantSurname}, ${driver.applicantGivenName}`;
                } else if (driver.fullName) {
                    return `${driver.fullName}`;
                } else if (driver.applicantGivenName) {
                    return `--, ${driver.applicantGivenName}`;
                } else if (driver.applicantSurname) {
                    return `${driver.applicantSurname}, --`;
                }
            }
        } else if (field === 'zipCode') {
            if (client && client.postalCd) {
                return client.postalCd;
            } else if (client && client.homes && client.homes[0] && client.homes[0].zipCode) {
                return client.homes[0].zipCode;
            } else if (client && client.business && client.business.zipCode) {
                return client.business.zipCode;
            } else if (client && client.vehicles && client.vehicles[0] && client.vehicles[0].applicantPostalCd) {
                return client.vehicles[0].applicantPostalCd;
            }
        }
    }

    returnForm(client: Client) {
        if (client.formClientId) {
            const formsIndex = this.allForms.findIndex(form => form.id === client.formClientId);
            if (formsIndex > -1) {
                const title = this.allForms[formsIndex] && this.allForms[formsIndex].title;
                if (title) {
                    return title;
                }
            }
            return 'Form'
        } else {
            return 'Form'
        }
    }

    // Automatically sorts the list of clients by last updated
    sortByDate(clients) {
        clients.sort((a, b) => {
            const date1 = +new Date(a.createdAt);
            const date2 = +new Date(b.createdAt);
            return date2 - date1;
        });
    }

    // styles the tab accordingly
    styleTabs(tab: string) {
        if (tab === this.filterCategory) {
            return { 'border-bottom': '4px solid #7c7fff', 'color': '#000' };
        }
    }

    resetPage() {
        this.p = 1;
        this.queryParams.page = 1;
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: this.queryParams
        });
    }

    async getQueryParams(filterParams: FilterParams) {
        if (!this.loaderModalService.dialogRef) {
            this.loaderModalService.openModalLoader('');
        }
        filterParams = this.setFilterParams(filterParams);
        this.getClients(filterParams);
        this.getCountsByDate();
        if (this.clientLifecycles.length > 0) {
            this.setLifecycleDataPoints(this.clientLifecycles);
        }
    }

    setFilterParams(filterParams: FilterParams) {
        if (!this.queryParams['createdAt'] && this.filterDateId !== 'dateRange') {
            this.queryParams['createdAt'] = '30';
        }
        if (filterParams.reset) {
            if (
                this.userType === 'agent' &&
                (
                    this.queryParams.clientAgentId ||
                    filterParams.clientAgentId
                )
            ) {
                const oldAgentId = this.queryParams.clientAgentId || filterParams.clientAgentId;
                this.queryParams = {};
                this.queryParams['clientAgentId'] = oldAgentId;
            } else {
                this.queryParams = { createdAt: '30', };
            }
            filterParams = new FilterParams();
            filterParams.createdAt = '30';
            this.filterDateId = '30';
            this.filterAgentId = null;
            this.filterCycleId = null;
            this.updatingFilters = false;
        }
        for (const key in filterParams) {
            if (key === 'to') {
                this.queryParams[key] = new Date(filterParams[key]).toUTCString();
            }
            if (filterParams[key]) {
                this.queryParams[key] = filterParams[key];
            }
        }

        filterParams = JSON.parse(JSON.stringify(this.queryParams));
        return filterParams;
    }

    returnExists(value: any) {
        if ((typeof value != 'undefined' && value != null && value) || value === false) {
            return true;
        } else {
            return false;
        }
    }

    returnUrl(form: Form, client: Client) {
        const production = environment.production;
        const token = localStorage.getItem('token');
        const prefix = !production ? 'http://localhost:4200/client-app/' : 'https://app.xilo.io/client-app/';
        const formType = 'simple/form';
        const queryParams = `?companyId=${this.company.companyId}&formId=${form.id}&clientId=${client.id}&token=${token}`;
        const fullUrl = prefix + formType + queryParams;
        return fullUrl;
    }

    copyUrl(form: Form, client: Client) {
        this.loaderModalService.openModalLoader('');
        this.clientService.createToken(client)
        .subscribe(token => {
            const production = environment.production;
            let prefix = !production ? 'http://localhost:4200/' : form.isV2Form ? 'https://insurance.xilo.io/' : 'https://app.xilo.io/client-app/';
            const formType = form.isV2Form ? 'form/start' : 'form/page/start';
            const queryParams = `?companyId=${this.company.companyId}&formId=${form.id}&clientId=${client.id}&token=${token}`;
            const fullUrl = prefix + formType + queryParams;
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = fullUrl;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
            this.logService.success(`${form.title ? form.title : ''} Link Copied`);
            this.loaderModalService.closeModal();
        }, error => {
            this.logService.console(error, true);
            this.loaderModalService.closeModal();
        });
    }

    returnTags(client: Client) {
        if (client && client.tags && client.tags.length > 0) {
            if (client.tags.length === 1) {
                return client.tags[0];
            } else {
                return client.tags.join(', ');
            }
        } else {
            return 'None';
        }
    }

    hasTag(client: Client, tag: string) {
        return (client.tags && client.tags.includes(tag));
    }

    addTag(client: Client, tag: string) {
        if (client.tags && client.tags.length > 0) {
            client.tags.push(tag);
        } else {
            client.tags = [tag];
        }
        this.updateClient(client, null);
    }

    removeTag(client: Client, tag: string) {
        if (client.tags.some(ttag => ttag === tag)) {
            const tagIndex = client.tags.findIndex(ttag => ttag === tag);
            client.tags.splice(tagIndex, 1);
            this.updateClient(client, null);
        }
    }

    isWithinPageLimit(i: number, maxLength: number) {
        const pageLow = (this.p - 1) * 10;
        const pageHigh = pageLow + ((pageLow + 10 > maxLength) ?
            (maxLength !== 0 ? (maxLength % 10) : 10) : 10);
        return (i < pageLow || (i > pageHigh && i < maxLength));
    }

    countClients(filterParams: FilterParams, lc: Lifecycle) {
        filterParams = this.setFilterParams(filterParams);
        const dataIndex = this.lifecycleDataPoints.findIndex(life => life.id === lc.id);
        if (!this.queryParams.clientLifecycleId || (+this.queryParams.clientLifecycleId === +lc.id)) {
            this.clientService.countClients(filterParams, lc.id)
            .subscribe(count => {
                if (dataIndex > -1) {
                    this.lifecycleDataPoints[dataIndex].count = count;
                } else {
                    this.lifecycleDataPoints.push({
                        title: lc.name,
                        count: count,
                        color: lc.color,
                        id: lc.id,
                        position: lc.sequenceNumber
                    })
                }
                this.lifecycleDataPoints.sort((a,b) => a.position - b.position);
            }, error => {
                this.logService.console(error, false);
            });
        } else {
            if (dataIndex > -1) {
                this.lifecycleDataPoints[dataIndex].count = '0';
            } else {
                this.lifecycleDataPoints.push({
                    title: lc.name,
                    count: '0',
                    color: lc.color,
                    id: lc.id,
                    position: lc.sequenceNumber
                });
            }
            this.lifecycleDataPoints.sort((a,b) => a.position - b.position);;
        }
    }

    getClients(filterParams: FilterParams) {
        this.clientService.getClientsBy(filterParams, this.p)
            .subscribe(clients => {
                this.clients = clients['obj'];
                if (clients['isCount'] === true) {
                    for (let i = 0; i < clients['count']; i++) {
                        if (this.isWithinPageLimit(i, clients['count'])) {
                            this.clients.splice(i, 0, {});
                        }
                    }
                }
                this.origClients = this.createCopy(this.clients);
                this.clientsRetrieved = true;
                if (this.formsRetrieved) {
                    this.isSimpleForm();
                }
                this.router.navigate([], {
                    relativeTo: this.activatedRoute,
                    queryParams: this.queryParams
                });
                this.loaderModalService.closeModal();
            }, error => {
                this.loaderModalService.closeModal();
                this.logService.console(error, false);
            });
    }

    // Updates client information
    updateClient(client: Client, successMessage: string) {
        this.clientService.agentPatchClient(client)
            .subscribe(updatedClient => {
                if (successMessage) {
                    this.logService.success(successMessage);
                }
                this.loaderModalService.closeModal();
            }, error => {
                this.loaderModalService.closeModal();
                this.logService.console(error, true);
            });
    }

    async updateClientAgent(client: Client) {
        try {
            this.loaderModalService.openModalLoader('');
            if (client.clientAgentId >= 0) {
                const updatedClient = await this.clientService.agentPatchClient(client).toPromise();
                await this.clientService.updateClientAgent(updatedClient['obj']);
                if (this.company.hasEzlynxIntegration && client.ezlynxUrl) {
                    await this.saveFile(client, 'EZLYNX', 'both');
                }
                const email = await this.lifecycleEmailService.sendEmail(client, this.company);
                this.logService.success('Client Assigned To Agent Successfully');
                this.loaderModalService.closeModal();
            }
        } catch (error) {
            this.loaderModalService.closeModal();
            this.logService.console(error, false);
        }
    }

    openNotes(client: Client, edit?: boolean) {
        edit = edit ? true : false;
        const bottomSheetRef = this._bottomSheet.open(NotesCreateDialogComponent, {
            data: {agent: this.agent ? this.agent : null, client: client, isEdit: edit,
                    note: this.hasNote(client) ? this.returnLastNoteObj(client) : null}
        });
        bottomSheetRef.afterDismissed().subscribe(async(results) => {
            if (results) {
                this.getQueryParams({});
            }
        });
    }

    openValidatorDialog(client: any, type: string, vendor: string) {
        const dialogRef = this.dialog.open(IntegrationValidatorDialogComponent, {
            width: '30rem',
            data: {
              type: type,
              vendor: vendor,
              reportType: 'client',
              client: client
            }
        });

        dialogRef.afterClosed().subscribe(report => {
            if (report) {
              const clientName = this.returnName(client);
              const fileName = `${clientName.toLowerCase()}-report.txt`;
              this.fileService.downloadFile(fileName, report, 'application/text');
            }
        });
    }

    openValidationsDialog(client: Client, validations: IValidation[]) {
        const dialogRef = this.dialog.open(ValidationDialogComponent, {
            width: '60rem',
            data: {
              validations: validations,
              clientId: client.id,
              company: this.company
            }
        });

        dialogRef.afterClosed().subscribe(report => {

        });
    }

    updateClientLifecycle(client: Client) {
        if (client.clientLifecycleId >= 0) {
            client.lifecycleUpdatedAt = new Date();
            this.clientService.agentPatchClient(client)
                .subscribe(updatedClient => {
                    const lifecycleAnalytic = new LifecycleAnalytic(null);
                    lifecycleAnalytic.date = new Date();
                    lifecycleAnalytic.month = (new Date().getMonth() + 1).toString();
                    lifecycleAnalytic.day = new Date().getDate().toString();
                    lifecycleAnalytic.year = new Date().getFullYear().toString();
                    lifecycleAnalytic.clientLifecycleAnalyticId = +updatedClient['obj'].id;
                    lifecycleAnalytic.lifecycleLifecycleAnalyticId = +client.clientLifecycleId;
                    lifecycleAnalytic.agentLifecycleAnalyticId = +client.clientAgentId;
                    lifecycleAnalytic.companyLifecycleAnalyticId = +client.companyClientId;
                    this.lifecycleAnalyticService.post(lifecycleAnalytic)
                    .subscribe(la => {
                    }, error4 => {
                        this.logService.console(error4);
                    });
                    const lifecycleIndex = this.clientLifecycles.findIndex(lcycle => +lcycle.id === +client.clientLifecycleId);
                    if (lifecycleIndex) {
                        client.clientLifcycle = this.clientLifecycles[lifecycleIndex];
                    }
                }, error => {
                    this.logService.console(error, true);
                });
        }
    }

    returnLifecycleData(client: Client, i) {
        if (client && client.clientLifecycleId) {
            const lifecycleIndex =
                this.clientLifecycles.findIndex(lc => +lc.id === +client.clientLifecycleId);
            if (lifecycleIndex > -1 && this.clientLifecycles[lifecycleIndex]) {
                const bgColor = this.clientLifecycles[lifecycleIndex].color;
                const rgbPoint = this.getRGBColor(bgColor, i);
                const color = rgbPoint >= 125 ? 'black' : 'white'
                return { background: bgColor, color };
            } else {
                return { background: 'yellow', color: 'black' };
            }
        }
    }

    returnLastNote(client: Client) {
        if (this.hasNote(client)) {
            return client.notes[0].text;
        } else {
            return '';
        }
    }

    returnLastNoteObj(client: Client) {
        if (this.hasNote(client)) {
            return client.notes[0];
        } else {
            return null;
        }
    }

    hasIntegration(vendorKey: string) {
        return (this.company && this.company[vendorKey]);
    }

    hasNote(client: Client) {
        if (client && client.notes && client.notes.length > 0 && client.notes[0].text) {
            return true;
        } else {
            return false;
        }
    }

    handleIntegrate(client: Client) {
        if (client.formViewIds && client.formViewIds.length > 0) {
            const params = {
                clientId: client.id,
                formId: client.formViewIds[client.formViewIds.length - 1],
                isTest: false
            };
            this.integrationService.integrateWithSubmissions(params)
            .subscribe(response => {
                this.integrationLoadingList.push(client.id);
                console.log(response);
                this.toastService.showMessage('EZLynx push loading');
                this.ezlynxService.pollApplicant(client.id)
                .subscribe(job => {
                    this.toastService.showSuccess('EZLynx push successful');
                    client.validations = job['validations'] ? job['validations'] : [];
                    client.validationsPassed = job['passed'];
                    this.integrationLoadingList = this.integrationLoadingList.filter(id => +id !== +client.id);
                }, error => {
                    this.integrationLoadingList = this.integrationLoadingList.filter(id => +id !== +client.id);
                    this.logService.console(error.error, false);
                    const errorJson = JSON.parse(error.error.error.message);
                    client.validations = errorJson.validations ? errorJson.validations : [];
                    client.validationsPassed = false;
                    this.toastService.showError(errorJson && errorJson.error || 'Client data did not pass EZLynx validation')
                });
            }, error => {
                this.toastService.showError(error);
            })
        } 
    }

    // save file using FileSaver.js given string
    async saveFile(client: Client, type: string, formType?: string) {
        try {
            this.loaderModalService.openModalLoader('');
            let clientName = this.returnClientField(client, 'name');
            if (type === 'EZLYNX' && !this.company.hasV2Integrations) {
                this.integrationService.createEZLynxContact(client, formType).subscribe(data => {
                    function handleError(error) {
                        if (error && error.message) {
                            if (error.message.toLowerCase().includes('unauthorized user')) {
                                return 'No EZLynx username added for this agent or agency';
                            } else if (error.message.toLowerCase().includes('http failure response')) {
                                return 'There was an issue pushing to EZLynx. Please contact support';
                            } else {
                                return 'Form data didnt match EZLynx';
                            }
                        } else if (error.fullBody) {
                            if (error.fullBody.toLowerCase().includes('error translating xml to ez data')) {
                                return 'Error with EZ XML formatting. Please contact support';
                            } else {
                                return 'Form data didnt match EZLynx';
                            }
                        } else if (error.error && error.error.stack) {
                            if (error.error.stack.toLowerCase().includes('error: error upserting ezlynx')) {
                                return 'There was an issue pushing to EZLynx. Please contact support';
                            } else {
                                return 'Form data didnt match EZLynx';
                            }
                        } else {
                            return 'Form data didnt match EZLynx';
                        }
                    }
                    if (formType === 'Dwellingfire' && data['data']) {
                        clientName += '-DwellingFire.xml';
                        const file = data['data'];
                        this.fileService.downloadFile(clientName, file, 'application/text');
                    } else if (data['body']) {
                        if (data['body'] === 'Succeeded') {
                            if (formType === 'Dwellingfire') {
                                clientName += '.xml';
                                this.fileService.downloadFile(clientName, data['file'], 'application/xml');
                                this.loaderModalService.closeModal();
                            }
                            this.logService.success('EZLynx Applicant Uploaded');
                        } else {
                            this.logService.error(handleError(data));
                        }
                    } else {
                        this.logService.error(handleError(data));
                    }
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'EZLYNX' && this.company.hasV2Integrations) {
                this.integrationLoadingList.push(client.id);
                this.ezlynxService.createApplicant(client.id, formType)
                .subscribe(data => {
                    console.log(data);
                    this.toastService.showMessage('EZLynx push loading');
                    this.loaderModalService.closeModal();
                    this.ezlynxService.pollApplicant(client.id)
                    .subscribe(job => {
                        this.toastService.showSuccess('EZLynx push successful');
                        client.validations = job['validations'] ? job['validations'] : [];
                        client.validationsPassed = job['passed'];
                        this.integrationLoadingList = this.integrationLoadingList.filter(id => +id !== +client.id);
                    }, error => {
                        this.integrationLoadingList = this.integrationLoadingList.filter(id => +id !== +client.id);
                        this.logService.console(error.error, false);
                        const errorJson = JSON.parse(error.error.error.message);
                        client.validations = errorJson.validations ? errorJson.validations : [];
                        client.validationsPassed = false;
                        this.toastService.showError(errorJson && errorJson.error || 'Client data did not pass EZLynx validation')
                    });
                }, error => {
                    this.toastService.showError('EZLynx push failed')
                    this.logService.console(error.error, false);
                    this.integrationLoadingList = this.integrationLoadingList.filter(id => +id !== +client.id);
                });
            } else if (type === 'QQ') {
                try {
                    const data = await this.integrationService.createQQContact(client);
                        if (data.IsSuccess) {
                            this.logService.success('Contact Added On QQ Catalyst');
                        } else {
                            this.logService.error('Data didnt match with QQ');
                        }
                } catch (error) {
                    if(error.error.error.message === 'Unable to update an existing prospect in QQ Catalyst')
                        this.logService.warn(error.error.error.message);
                    else this.logService.console(error, true);
                }
                this.loaderModalService.closeModal();
            } else if (type === 'QUOTERUSH') {
                this.integrationService.createQuoteRushContact(client, type).subscribe(data => {
                    this.logService.success('Client Added to QuoteRush');
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'TURBORATER') {
                this.integrationService.createTurboraterContact(client, formType).subscribe(data => {
                    this.logService.success('Client Added to Turborater');
                    this.loaderModalService.closeModal();
                }, error => {
                    let errorMsg = 'Adding Client Failed';
                    if (error.error && error.error.error) {
                        errorMsg = error.error.error.message;
                    }
                    this.logService.error(errorMsg);
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'HAWKSOFT') {
                clientName += '.CMSMTF';
                const file = await this.hawksoftService.createFile(client, 'all');
                this.fileService.downloadFile(clientName, file, 'application/text');
                this.loaderModalService.closeModal();
            } else if (type === 'AGENCYMATRIX') {
                clientName += '.csv';
                const file = await this.agencyMatrixService.createFile(client, formType);
                this.fileService.downloadFile(clientName, file, 'application/csv');
                this.loaderModalService.closeModal();
            } else if (type === 'XANATEK') {
                clientName += '.csv';
                const file = await this.xanatekService.createFile(client, formType);
                this.fileService.downloadFile(clientName, file, 'application/csv');
                this.loaderModalService.closeModal();
            } else if (type === 'CABRILLO') {
                this.integrationService.createCabrilloContact(client, formType).subscribe(data => {
                    this.logService.success('Client Added to Cabrillo');
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.error('Error creating contact');
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'APPLIEDEPIC') {
                clientName += '.csv';
                const file = await this.appliedEpicService.createFile(client, formType);
                this.fileService.downloadFile(clientName, file, 'application/csv');
                this.loaderModalService.closeModal();
            } else if (type === 'NOWCERTS') {
                this.integrationService.createNowCerts(client)
                .subscribe(data => {
                    this.logService.success('Client Added to Nowcerts');
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'COMMERCIAL_EZLYNX') {
                if (formType === 'commercial') {
                    this.integrationService.createCommercialEzlynxContact(client, formType)
                    .subscribe(data => {
                        this.logService.success('Commercial Applicant to Sales Center');
                        this.loaderModalService.closeModal();
                    }, error => {
                        if(error?.error?.errorType !== 6) this.alertService.error(error && (error.error.message || error.error.error.message));
                        this.loaderModalService.closeModal();
                    });
                } else {
                    this.ezlynxService.createSalesCenterApplicant(client.id)
                    .subscribe(data => {
                        this.logService.success('Personal Applicant to Sales Center');
                        this.loaderModalService.closeModal();
                    }, error => {
                        this.logService.console(error, true);
                        this.loaderModalService.closeModal();
                    });
                }
            } else if (type === 'AMS360FILE') {
                try {
                    clientName += `-${formType}.csv`;
                    const file = await this.ams360Service.createFile(client, formType);
                    this.fileService.downloadFile(clientName, file, 'application/csv');
                    this.loaderModalService.closeModal();
                } catch (error) {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                }
            } else if (type === 'AMS360') {
                try {
                    const data = await this.integrationService.createAMS360Contact(client);
                    this.logService.success('Prospect Uploaded to AMS360');
                    this.loaderModalService.closeModal();
                } catch (error) {
                    this.loaderModalService.closeModal();
                    if(error?.error?.errorType !== 6) this.alertService.error(error && (error.error.message || error.error.error.message));
                }
            } else if (type === 'APPLIED') {
                clientName += '.quote';
                const file = await this.appliedService.createFile(client);
                this.fileService.downloadFile(clientName, file, 'application/text');
                this.loaderModalService.closeModal();
            } else if (type === 'ACORDXML') {
                clientName += '.xml';
                const file = await this.acordService.createXMLFile(client);
                this.fileService.downloadFile(clientName, file, 'application/xml');
                this.loaderModalService.closeModal();
            } else if (type === 'ACORDAL3') {
                clientName += '.al3';
                this.acordService.createAL3File(client, formType)
                    .subscribe(async (al3File) => {
                        const url = window.URL.createObjectURL(new Blob([al3File]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', clientName);
                        document.body.appendChild(link);
                        link.click();
                        this.logService.success('Al3 File Downloaded');
                        this.loaderModalService.closeModal();
                    }, error => {
                        this.logService.console(error, true);
                        this.loaderModalService.closeModal();
                    });
            } else if (type === 'INFUSIONSOFT') {
                this.infusionsoftService.addContact(client.id, client.companyClientId)
                .subscribe(data => {
                    this.logService.success('Client Added to Infusionsoft');
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'WEALTHBOX') {
                this.integrationService.createWealthboxContact(client)
                .subscribe(data => {
                    if (!client.wealthboxId) {
                        this.integrationService.createWealthboxTask(client)
                        .subscribe(data => {
                        }, error => {
                           this.logService.console(error, true);
                           this.loaderModalService.closeModal();
                        });
                       }
                    this.logService.success('Client Added to Wealthox');
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'RICOCHET') {
                this.integrationService.createRicochetContact(client)
                .subscribe(data => {
                    this.logService.success('Client Added to Ricochet');
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                });
            } else if (type === 'PIPEDRIVE') {
                if (this.company.pipedriveIntegration) {
                    if (!client.pipedriveDealId) {
                        await this.pushNewPipedrivePerson(this.company, client);
                    } else {
                        await this.pushNewPipedriveNote(this.company, client);
                    }
                    this.loaderModalService.closeModal();
                }
            } else if (type === 'PLRATER') {
                if (this.company.hasPLRater) {
                    clientName += '.al3';
                    this.plRaterService.createAL3File(client, formType)
                        .subscribe(async (al3File) => {
                            const url = window.URL.createObjectURL(new Blob([al3File]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', clientName);
                            document.body.appendChild(link);
                            link.click();
                            this.logService.success('PL Rater File Downloaded');
                            this.loaderModalService.closeModal();
                        }, error => {
                            this.logService.console(error, true);
                            this.loaderModalService.closeModal();
                        });
                }
            } else if (type === 'ZAPIER') {
                client.zapStatus = 'Triggered';
                this.updateClient(client, 'Zapped Succesfully');
            }
        } catch (error) {
            this.logService.console(error, true);
            this.loaderModalService.closeModal();
        }
    }

    async pushNewPipedriveDeal(company: Company, client: Client, personId: number) {
        if (company.pipedriveIntegration && !client.pipedriveDealId) {
            const deal = {
                title: `New deal with ${client.firstName} ${client.lastName}`,
                stage_id: company.pipedriveStageId !== null ? company.pipedriveStageId : null,
                person_id: personId
            };
            const newDeal = await this.pipedriveService.createPipedriveDeal(company.pipedriveToken, deal);
            if (newDeal['id']) {
                client.pipedriveDealId = newDeal['id'];
            }
            client.pipedriveDealId = newDeal['obj'].id;
            await this.pushNewPipedriveNote(company, client);
        }
    }

    async pushNewPipedriveNote(company: Company, client: Client) {
        if (company.pipedriveIntegration && !client.pipedriveNoteId) {
            const note = {
                content: '',
                deal_id: client.pipedriveDealId
            };
            const newNote = await this.pipedriveService.createPipedriveNote(company.pipedriveToken, note, client);
            client.pipedriveNoteId = newNote['obj'].id;
            // await this.upsert(company, client, form, queryParams);
            if (newNote['id']) {
                client.pipedriveNoteId = newNote['id'];
            }
        } else if (company.pipedriveIntegration && client.pipedriveNoteId) {
            const note = {
                content: '',
            };
            // tslint:disable-next-line: max-line-length
            const updatedNote = await this.pipedriveService.updatePipedriveNote(company.pipedriveToken, client.pipedriveNoteId, note, client);
        }
    }

    async updateNewPipedriveNote(company: Company, client: Client) {
        try {
            const updatedNote = await this.pipedriveService.updatePipedriveNote(company.pipedriveToken, client.pipedriveNoteId, {}, client);
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    async pushNewPipedrivePerson(company: Company, client: Client) {
        if (company.pipedriveIntegration && !client.pipedriveDealId) {
            const person = {
                name: (client.firstName + ' ' + client.lastName),
                email: client.email,
                phone: client.phone
            };
            const newPerson = await this.pipedriveService.createPipedrivePerson(company.pipedriveToken, person);
            await this.pushNewPipedriveDeal(company, client, newPerson['obj'].id);
        }
    }

    // save file using FileSaver.js given string
    async downloadFiles(client?: Client, type?: string, formType?: string) {
       try {
        this.loaderModalService.openModalLoader('');
        if (type === 'AGENCYSOFTWARE') {
            const fileName = 'xilo-agency_software.csv';
            const file = await this.agencySoftwareService.createFile(this.selection);
            this.fileService.downloadFile(fileName, file, 'application/csv');
            this.loaderModalService.closeModal();
        } else if (type === 'MYEVO') {
            const fileName = 'xilo-my-evo.csv';
            const file = await this.myEvoService.createFile(this.selection);
            this.fileService.downloadFile(fileName, file, 'application/csv');
            this.loaderModalService.closeModal();
        } else if (type === 'PARTNERXE') {
            const fileName = 'xilo-partner-xe.csv';
            const file = await this.integrationService.createPartnerXEFile(this.selection);
            this.fileService.downloadFile(fileName, file, 'application/csv');
            this.loaderModalService.closeModal();
        } else if (type === 'CSV') {
            const fileName = 'xilo.csv';
            const file = await this.fileService.createFile(this.selection);
            this.fileService.downloadFile(fileName, file, 'application/csv');
            this.loaderModalService.closeModal();
        }
       } catch ( error ) {
           this.loaderModalService.closeModal();
           this.logService.console(error, true);
       }
    }

    async saveAppulateFile(pdf: Pdf, clientId: Client) {
        const appulateData = {
            pdfId: pdf.id,
            clientId: clientId,
        };
        this.integrationService.createAppulate(appulateData)
            .subscribe(data => {
                this.logService.success('Client Added to Appulate');
                this.loaderModalService.closeModal();
            }, error => {
                this.logService.console(error, true);
                this.loaderModalService.closeModal();
            });
    }

    returnIsAcordPDF(title: string) {
        return title.toLowerCase().includes('acord');
    }


    getPdfs() {
        this.pdfService.getByList()
            .subscribe(pdf => {
                this.pdfs = pdf['obj'];
            }, error => {
                this.logService.console(error, true);
            });
    }

    downloadPdf(pdfObj, clientId) {
        this.loaderModalService.openModalLoader('');
        const pdfId = pdfObj.id;
        const fileName = `${pdfObj.formName}.pdf`;
        this.pdfService.filledForm(pdfId, clientId)
            .subscribe(async (pdf: Blob) => {
                const url = window.URL.createObjectURL(new Blob([pdf]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                this.loaderModalService.closeModal();
            }, error => {
                this.logService.console(error, true);
                this.loaderModalService.closeModal();
            });
    }

    downloadV2Pdfs(pdfObj, client) {
        this.loaderModalService.openModalLoader('');
        const fileName = `${pdfObj.formName}.pdf`;
        this.pdfService.downloadPDF(pdfObj.id, client.id)
            .subscribe(async (pdf: Blob) => {
                const url = window.URL.createObjectURL(new Blob([pdf]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                this.loaderModalService.closeModal();
            }, error => {
                this.logService.console(error, true);
                this.loaderModalService.closeModal();
            });
    }

    downloadGenericPdf(client:Client) {
      this.loaderModalService.openModalLoader('');
      const fileName = `${this.returnName(client)}.pdf`;
      
      return this.submissionService.isClientHasAnySubmissions(client.id)
        .pipe(
          switchMap(data => {
            const isV2   = data?.hasSubmissions
            const method = 'genericPdf' + (isV2 ? 'V2' : '')
            
            return this.pdfService[method](client.id)
          })
        )
        .subscribe(async (pdf: Blob) => {
        const url = window.URL.createObjectURL(new Blob([pdf]));
        const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          this.loaderModalService.closeModal();
        }, error => {
          this.logService.console(error, true);
          this.loaderModalService.closeModal();
        });
    }

    redirectUrl(url: string) {
        window.open(url, '_blank');
    }

    amsUrl(amsCustomerId: string) {
      if (amsCustomerId && amsCustomerId.length && amsCustomerId.length > 1) {
        return `https://www.ams360.com/v19219336201/NextGen/Customer/Detail/${amsCustomerId}`;
      } else {
        return '#';
      }
    }

    returnAgentName(agent: Agent) {
        if (agent) {
            if (agent.firstName && agent.lastName) {
                return `${agent.firstName} ${agent.lastName}`;
            } else {
                return agent.email;         }
        } else {
            return 'Choose Agent';
        }
    }

    // returns an array of the Users Agents emails
    returnAgentEmailArray(agents: Agent[]) {
        const agentArray: string[] = [];
        agents.forEach(agent => {
            agentArray.push(agent.email);
        });
        return agentArray;
    }


    createCopy(orig) {
        return JSON.parse(JSON.stringify(orig));
    }

    // getTasks() {
    //     this.taskService.getAgentTasks()
    //     .subscribe(tasks => {
    //         this.tasks = tasks;
    //         this.completedTasks = this.createCopy(this.tasks).filter(task => task.isCompleted);
    //         this.origClients = this.createCopy(this.tasks).filter(task => !task.isCompleted);
    //         this.tasks = this.tasks.filter(task => !task.isCompleted);
    //         if (this.queryParams && (this.queryParams['type'] || this.queryParams['date'])) {
    //             this.filterByParams(null, null, this.queryParams);
    //         }
    //         if (this.queryParams['p']) {
    //             this.p = +this.queryParams['p'];
    //         }
    //         this.selection = [];
    //         this.clientsRetrieved = true;
    //         this.loaderModalService.closeModal();
    //     }, error => {
    //         this.logService.console(error, true);
    //         this.clientsRetrieved = true;
    //         this.loaderModalService.closeModal();
    //     });
    // }

    deleteProspects() {
        if (confirm('Are you sure you want to delete these prospects')) {
            this.loaderModalService.openModalLoader('');
            if (this.selection && this.selection.length > 0) {
                this.clientService.deleteProspects(this.selection)
                .subscribe(data => {
                    this.logService.success('Prospects deleted');
                    this.selection = [];
                    this.getQueryParams({});
                    this.loaderModalService.closeModal();
                }, error => {
                    this.logService.console(error, true);
                    this.loaderModalService.closeModal();
                });
            }
        }
    }

    removeDeletedTasks() {
        for (let i = 0; i < this.selection.length; i++) {
            const id = this.selection[i];
            const index = this.origClients.findIndex(task => +task.id === +id);
            if (index && index > -1) {
                this.origClients.splice(index, 1);
            }
            if (!this.selection[i + 1]) {
                this.resetTasks();
                this.selection = [];
            }
        }
    }

    filterDate(date: string) {
        const isDateRange = this.filterDateId === 'dateRange'
        if(isDateRange && (!this.from || !this.to)) return
        if (isDateRange) this.queryParams.to = moment(this.to).format('YYYY/MM/DD')
        this.queryParams.createdAt = isDateRange ? moment(this.to).diff(moment(this.from), 'days') : date
        if(!isDateRange) {
            delete this.queryParams.to
            this.from = null
            this.to = null
        }
        this.getQueryParams(this.queryParams);
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: this.queryParams
        });
    }

    filter(type: string, search: string) {
        this.updatingFilters = true;
        search = search ? search.toString() : null;
        if (search && search.length > 0) {
            if (type === 'fullName') {
                search = search.toLowerCase();
            }
            this.queryParams[type] = search;
        } else {
            delete this.queryParams[type];
            if (!this.queryParams.phone && !this.queryParams.fullName) {
                this.updatingFilters = false;
                this.getQueryParams({});
            }
        }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: this.queryParams
        });
    }

    returnDigits(number: string) {
        return number = formatPhoneNumber(number) || null;
    }

    filterByParams(paramType: string, value: string, params?: any) {
        if (params) {
            if (params['date']) {
                paramType = 'date';
                value = params['date'];
            } else if (params['type']) {
                paramType = 'type';
                value = params['type'];
            }
        }
        if (paramType === 'date' && value) {
            if (value === 'allTime') {
                this.resetTasks();
                return;
            }
            this.clients = this.createCopy(this.origClients);
            const today = new Date();
            const newDate = new Date();
            newDate.setDate(newDate.getDate() - +value);
            this.clients = this.origClients.filter(client => {
                const createdDate = new Date(client.createdAt);
                return (createdDate >= today && createdDate <= newDate);
            });
            this.dateFilter = value;
        } else if (paramType === 'type') {
            // if (value === 'all') {
            //     this.resetTasks();
            //     return;
            // }
            // this.tasks = this.origClients.filter(task => (task.type ? task.type.toLowerCase() === value.toLowerCase() : false));
            // this.typeFilter = value;
        }
    }

    resetTasks() {
        this.clients = this.createCopy(this.origClients).filter(task => !task.isCompleted);
        this.fullName = '';
    }

    nameExists(client: Client, value: string) {
        const name = this.returnName(client) ? this.returnName(client).toLowerCase() : null;
        value = value ? value.toLowerCase() : null;
        if (name && value) {
          return (name.includes(value));
        } else {
          return false;
        }
    }

    setParams(type: string, value: string) {
        this.queryParams[type] = value;
        if (type === 'date') {
            delete this.queryParams['type'];
            this.dateFilter = 'allTime';
        } else if (type === 'type') {
            delete this.queryParams['date'];
            // this.typeFilter = 'all';
        }
        if (type !== 'page') {
            this.filterByParams(type, value);
        } else {
            this.p = +value;
            if (this.clients.length > 30) {
                this.getQueryParams({});
            }
        }
        this.router.navigate([], { relativeTo: this.route, queryParams: this.queryParams });
    }

    activateMenu(type: string, index: number) {
        if (type === 'agent') {
            this.agentMenuIndex = +index;
            this.agentMenuActive = true;
        }
    }

    styleLifecycle(style: object) {
        return style;
    }

    getRGBColor(color, i) {
        const element = document.getElementById('lifecycle' + i);
        element.style.backgroundColor = color;
        const rgb = window.getComputedStyle(element).backgroundColor;
        const points = rgb.substr(4).split(")")[0].split(rgb.indexOf(",") > -1 ? "," : " ");
        return Math.round(((parseInt(points[0]) * 299) + (parseInt(points[1]) * 587) + (parseInt(points[2]) * 114)) / 1000);
    }

    styleActionMenu(index: number) {
        if (this.agentMenuActive && this.agentMenuIndex === +index) {
            return { 'display': 'inline-block' };
        } else {
            return { 'display': 'none' };
        }
    }

    styleDueDate(dueDate: string) {
        if (dueDate.includes('ago')) {
            return { background: 'rgb(250,250,0, .25)' };
        }
    }

    isAllSelected() {
        const numSelected = this.selection.length;
        const numRows = this.clients.length;
        return numSelected === numRows;
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Client, index?: string): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.isSelected(this.returnIndex(index)) ? 'deselect' : 'select'} row ${this.returnIndex(index) + 1}`;
    }

    isSelected(taskId: any) {
        return this.selection.includes(taskId);
    }

    async selectRow(taskId: any) {
        const exists = this.selection.includes(taskId);
        if (exists) {
          const fIndex = this.selection.findIndex(ic => +taskId === +ic);
          this.selection.splice(fIndex, 1);
        } else {
          this.selection.push(taskId);
        }
    }

    returnIndex(i: any) {
        if (+i >= 0)  {
            if (this.p > 1) {
              return ((this.p * 10) + +i );
            } else {
                return +i;
            }
        } else {
            return null;
        }
    }

    returnZip(client: Client) {
        if (client && client.homes && client.homes.length > 0 && client.homes[0].zipCode) {
            return client.homes[0].zipCode;
        } else if (client && client.business && client.business.zipCode) {
            return client.business.zipCode;
        } else if (client && client.postalCd) {
            return client.postalCd;
        } else {
            return '';
        }
    }

    hasZip(client: Client) {
        if (client && client.homes && client.homes.length > 0 && client.homes[0].zipCode) {
            return true;
        } else if (client && client.business && client.business.zipCode) {
            return true;
        } else if (client && client.postalCd) {
            return true;
        } else {
            return false;
        }
    }

    returnName(client: Client) {
        if (client.companyName) {
            return client.companyName;
        } else if (client.business && client.business.entityName) {
            return client.business.entityName;
        } else if (client.firstName && client.lastName) {
            return `${client.firstName} ${client.lastName}`;
        } else if (client.fullName) {
            return `${client.fullName}`;
        } else if (client.firstName) {
            return `${client.firstName} --`;
        } else if (client.lastName) {
            return `-- ${client.lastName}`;
        } else if (client.drivers && client.drivers[0]) {
            const driver = client.drivers[0];
            if (driver.applicantGivenName && driver.applicantSurname) {
                return `${driver.applicantGivenName} ${driver.applicantSurname}`;
            } else if (driver.fullName) {
                return `${driver.fullName}`;
            } else if (driver.applicantGivenName) {
                return `${driver.applicantGivenName} --`;
            } else if (driver.applicantSurname) {
                return `-- ${driver.applicantSurname}`;
            }
        } else {
            return 'No Name';
        }
    }

    returnDueDays(schedDate: any) {
        const today = new Date();
        const scheduled = new Date(schedDate);
        const msInDay = 24 * 60 * 60 * 1000;
        if (Math.abs(+today - +scheduled) <= msInDay) {
            const diff = Math.round((+today - +scheduled) / 36e5);
            if (diff === 0) {
                return 'Now';
            }
            const message = (+today > +scheduled) ?
                `${diff === 0 ? '' : ` ${diff}`} ${this.returnHourString(diff)}${diff === 0 ? '' : ' ago'}` : 'Today';
            return message;
        } else {
            scheduled.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diff = Math.round((+today - +scheduled) / msInDay);
            let message = 'Today';
            if (+today > +scheduled) {
                if (diff >= 8) {
                    message = new Date(schedDate).toLocaleDateString();
                } else {
                    message = `${diff} ${this.returnDayString(diff)} ago`;
                }
            }
            return message;
        }
    }

    returnDayString(value) {
        if (value === 1) {
            return 'day';
        } else {
            return 'days';
        }
    }

    returnHourString(value) {
        if (value === 1) {
            return 'hour';
        } else if (value === 0) {
            return 'Now';
        } else {
            return 'hours';
        }
    }

    truncatedText(input: string, max: number) {
        if (input && input.length > max) {
            return input.substring(0, max) + '...';
        } else {
            return input;
        }
     }

     returnAnalytics(type: string, lifecycleId?: string) {
         if (this.clientsRetrieved && this.lifecycleDataRetrieved && this.origClients && this.origClients.length > 0) {
             if (type === 'total') {
                return this.lifecycleData['total'];
             } else if (type === 'today') {
                 return this.lifecycleData['today'];
             } else if (type === 'lifecycle') {
                 return this.lifecycleData[lifecycleId];
             }
         } else if (this.clientsRetrieved && (this.origClients && this.origClients.length === 0)) {
                return '0';
         } else {
             return 'XX';
         }
     }
     isSimpleForm() {
         this.clients.map(item => {
            item['isSimpleForm'] = false;
             if (item.formClientId) {
                for (let i = 0; i < this.simpleForms.length; i++) {
                    if (this.simpleForms[i].id == item.formClientId) {
                        item['isSimpleForm'] = true;
                            break;
                    }
                 }
             }
         });
     }

     listAllFlowTemplates() {
        this.flowService.getList()
            .subscribe(data => {
                this.flows = data['obj'];
                return data;
            }, error => {
                this.logService.console(error, false);
            });
    }

    addToFlow(client: Client, flow) {
        if (!flow.isNewClientFlow) {
            this.flowService.get(flow.id)
            .subscribe((flow) => {
                this.alertService.success('Flow added succcessfully');
                this.processLead(client, flow['obj']);
            }, error => {
                this.alertService.warn('Something went wrong');
                this.logService.console(error, true);
            });
        } else {
            this.flowService.getNewLeadFlow()
                .subscribe(flow => {
                    this.alertService.success('Flow added succcessfully');
                    this.processLead(client, flow['obj']);
                }, error => {
                    this.alertService.warn('Something went wrong');
                    this.logService.console(error, true);
                });
            }

        }

     setDataWithSettings(agent: any) {
        if (agent && agent.obj && agent.obj.settings) {

        }
     }

    updateClientData(client) {
        this.clients.filter((item) => {
            if (item.id === client.id) {
                item['customText'] = client.customText || '';
            }
        });
    }

    processLead(client, flow) {
        const ncFlow = flow;
            const sequence = ncFlow.sequence;
            sequence.sort((a, b) => b.position - a.position);
            const date = new Date();
            let dMilliseconds = date.valueOf();
            const startMilli = dMilliseconds;
            for (let i = 0; i < sequence.length; i++) {
                const item = sequence[i];
                if (item.isTimeDelay) {
                    const mSeconds = +item.secondsDelay * 1000;
                    const mMinutes = +item.minutesDelay * 60000;
                    const mHour = +item.hoursDelay * 3600000;
                    const mDay = +item.daysDelay * 86400000;
                    const milliseconds = mSeconds + mMinutes + mHour + mDay;
                    dMilliseconds += milliseconds;
                }
                if (item.isEmail) {
                    const newEmail = new Email();
                    newEmail.recipient = client.email;
                    newEmail.sender = 'customer-success@xilo.io';
                    newEmail.subject = item.title;
                    newEmail.body = item.body;
                    newEmail.companyEmailId = this.company.id;
                    newEmail.clientEmailId = +client.id;
                    newEmail.flowEmailId = ncFlow.id;
                    if (startMilli !== dMilliseconds) {
                        newEmail.scheduledDate = (new Date(dMilliseconds));
                        newEmail.isSchedule = true;
                        newEmail.isSentNow = false;
                    } else {
                        newEmail.isSchedule = false;
                        newEmail.isSentNow = true;
                    }
                    this.emailService.scheduleEmail(newEmail)
                        .subscribe(email => {
                        }, error => {
                            this.logService.console(error);
                        });
                }
                if (item.isText) {
                    const newText = new TextMessage();
                    newText.to = client.phone;
                    newText.body = item.body;
                    newText.clientTextMessageId = +client.id;
                    newText.companyTextMessageId = this.company.id;
                    newText.flowTextMessageId = ncFlow.id;
                    newText.scheduledDate = new Date(dMilliseconds);
                    if (startMilli !== dMilliseconds) {
                        newText.scheduledDate = new Date(dMilliseconds);
                        newText.isSchedule = true;
                        newText.isSentNow = false;
                    } else {
                        newText.isSchedule = false;
                        newText.isSentNow = true;
                    }
                    this.textMessageService.scheduleText(newText)
                        .subscribe(text => {
                        }, error => {
                            this.logService.console(error);
                        });
                }
                if (item.isTask) {
                    const newTask = new Task();
                    newTask.priority = item.priority;
                    newTask.type = item.type;
                    newTask.description = item.description;
                    newTask.clientTaskId = +client.id;
                    newTask.companyTaskId = this.company.id;
                    newTask.scheduledDate = new Date(dMilliseconds).toString();
                    newTask.agentTaskId = client.clientAgentId;
                    if (startMilli !== dMilliseconds) {
                        newTask.scheduledDate = new Date(dMilliseconds).toString();
                        newTask.agentTaskId = client.clientAgentId;
                        newTask.isSchedule = true;
                        newTask.isSentNow = false;
                    } else {
                        newTask.isSchedule = false;
                        newTask.isSentNow = true;
                    }
                    this.taskService.createTask(newTask)
                        .subscribe(task => {
                        }, error => {
                            this.logService.console(error);
                        });
                    }
            }
    }
}
