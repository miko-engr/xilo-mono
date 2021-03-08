import {Component, OnInit} from '@angular/core';
import { AgentService } from '../../../services/agent.service';
import { Agent } from '../../../models/agent.model';
import {MatTableDataSource} from '@angular/material/table';
import { Company } from '../../../models/company.model';
import { LogService } from '../../../services/log.service';
import { CompanyService } from '../../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { VendorDialog } from '../../../shared/dialogs/vendor/vendor.component';
import { VendorService } from '../../../services/vendor.service';
import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';
import { AMS360Service } from '../../../services/ams360.service';

@Component({
    selector: 'app-team-agent',
    templateUrl: './agent.component.html',
    styleUrls: ['../team.component.css', './agent.component.css']
})
export class TeamAgentComponent implements OnInit {
    agents: Agent[] = [];
    agent: Agent = new Agent(null, null, null, null, null, null, null, null, null, null, null, null, null);
    newAgent: Agent = new Agent(null, null, null, null, null, null, null, null, null, null, null, null, null);
    vendor = {carrier: null, vendorName: null, state: null, username: null, password: null, accessToken: null};
    passwordConfirmation = '';
    addAgent = false;
    editAgent = false;
    dataSource = new MatTableDataSource();
    loading = false;
    company: Company = new Company();
    companyRetrieved = false;
    selectedTag = '';
    selectedAgentId = '';
    amsSettings = {
        executives: [],
        reps: []
      };
      amsDetailsLoaded = false;

    columnsToDisplay = ['name', 'email', 'action', 'primary', 'view', 'viewTags', 'isActive'];

    constructor(
        private ams360Service: AMS360Service,
        private companyService: CompanyService,
        private emailService: EmailService,
        private logService: LogService,
        private agentService: AgentService,
        private vendorService: VendorService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.getAgents();
        this.getCompany();
    }

    addTag(event: any) {
         if (this.editAgent) {
            if (!this.agent.tags || this.agent.tags.length < 1) {
                this.agent.tags = [];
                this.agent.tags.push(event);
            } else {
                if (this.agent.tags.indexOf(event) < 0) {
                    this.agent.tags.push(event);
                }
            }
        }
    }

    remove(tag: string): void {
        const index = this.agent.tags.indexOf(tag);

        if (index >= 0) {
            this.agent.tags.splice(index, 1);
        }
    }

    returnAgent(id: any) {
        const agents = this.company.agents.filter(agent => agent.id == id);
        if (agents && agents[0]) {
            return `${agents[0].firstName} ${agents[0].lastName}`
        }
    }

    addAgentId(event: any) {
         if (this.editAgent) {
            if (!this.agent.agentIds || this.agent.agentIds.length < 1) {
                this.agent.agentIds = [];
                this.agent.agentIds.push(event);
            } else {
                if (this.agent.agentIds.indexOf(event) < 0) {
                    this.agent.agentIds.push(event);
                }
            }
        }
    }

    removeAgentId(agentId: number): void {
        const index = this.agent.agentIds.indexOf(agentId);

        if (index >= 0) {
            this.agent.agentIds.splice(index, 1);
        }
    }

    getCompany() {
        this.loading = true;
        this.companyService.get()
        .subscribe(company => {
            this.company = company['obj'];
            this.companyRetrieved = true;
            if (this.company.hasAMS360Integration) {
                this.setAmsSettings();
            }
            this.loading = false;
        }, error => {
            this.logService.console(error, true);
            this.loading = false;
        });

    }

    setAmsSettings() {
        this.ams360Service.getAms360Details()
        .subscribe(data => {
          this.amsSettings.executives = data['executives'] ? data['executives'].sort((a, b) => {
            return a.name.localeCompare(b.name);
          }) : [];
          this.amsSettings.reps = data['reps'] ? data['reps'].sort((a, b) => {
            return a.name.localeCompare(b.name);
          }) : [];
          this.amsDetailsLoaded = true;
        }, error => {
          this.logService.console(error, false);
        });
      }

    // Deletes an user and removes from current array of users
    deleteAgent(agent: Agent) {
      if (confirm('Are you sure you want to delete this agent?')) {
        this.agentService.delete(agent)
            .subscribe(user => {
                this.agents.splice(this.agents.indexOf(this.agent), 0);
                this.resetAgents();
                this.getAgents();
                this.logService.success('Agent Removed Successfully');
                this.dataSource.data = this.agents;
            }, error => {

                this.logService.console(error, true);
            });
      }
    }

    getAgentById(agent) {
        this.editAgent = true;
        this.agentService.getById(agent)
            .subscribe(agent => {
                this.agent = agent['obj'];
            }, error => {

            });
    }

    getAgents() {
        this.agentService.getUserAgents()
            .subscribe(agents => {
                this.agents = agents['obj'];
                this.dataSource.data = this.agents;
            }, error => {

                this.logService.console(error, true);
            });
    }

    resetAgents() {
        this.addAgent = false;
        this.editAgent = false;
        if (this.agent.id !== null) {
            this.agent = new Agent(null, null, null, null, null, null, null, null, null, null, null, null);
        } else if (this.newAgent.email !== null) {
            this.newAgent = new Agent(null, null, null, null, null, null, null, null, null, null, null, null);
        }
        this.passwordConfirmation = '';
    }

    updateAgent(agent) {
        this.loading = true;
        if (this.editAgent) {
            if (this.passwordConfirmation !== this.agent.password && typeof this.agent.password != 'undefined') {
                this.logService.warn('Password Do Not Match! Please Try Again');
                this.loading = false;
            } else {
                this.update(this.agent, true)
            }
        } else if (this.addAgent) {
            if (this.passwordConfirmation !== this.newAgent.password) {
                this.logService.warn('Passwords Do Not Match! Please Try Again');
                this.loading = false;
            } else {
                this.agentService.post(this.newAgent)
                    .subscribe(agent => {
                        this.sendNewAgentEmail();
                        this.agents.push(agent['obj']);
                        this.resetAgents();
                        this.getAgents();
                        this.dataSource.data = this.agents;
                    }, error => {
                        this.loading = false;
                        this.logService.console(error, true);
                    });
            }
        } else {
            agent.isActive = !agent.isActive;
            this.update(agent, false)
        }
    }

    update(agent, isEditAgent) {
        this.agentService.patch(agent)
            .subscribe(agent => {
                this.logService.success('Agent Updated Successfully');
                this.dataSource.data = this.agents
                if (isEditAgent) {
                    this.resetAgents();
                }
                this.getAgents();
                this.loading = false;
            }, error => {
                this.loading = false;
                this.logService.console(error, true);
            });
    }

    sendNewAgentEmail() {
        const newEmail = new Email();
        newEmail.body =
        `Hi, ${this.newAgent.firstName}.<br>
        <br>
        Welcome to XILO! XILO offers unique quoting experiences (web forms) that your team can use to make quoting easier for the insured and<br>
        faster for your agency. Login using the credentials below on the <a href="https://dashboard.xilo.io/auth/agent-login" target="_blank">XILO Dashboard</a>.<br>
        <br>
        Login Credentials:<br>
        ${this.newAgent.email}<br>
        ${this.newAgent.password}<br>
        <br>
        With XILO you'll now be able to send forms to prospects that they'll actually fill out. Every question is tailored to your agency<br>
        and your sales process. Those submissions are then either integrated into your existing systems, making your life easier! You'll be<br> 
        able to pick up where they left off with XILO Simple Forms and even manage your pipeline coming in with the XILO Dashboard. <br>
        <br>
        We look forward to working with you and can't wait for you to start utilizing XILO as a resource for your agency.<br>
        <br>
        <small>Note: The web forms do not work well with older versions of IE. 95% of prospects will use Chrome, Safari, Edge so this isn’t an issue.<br>
        Microsoft gave up support for IE in 2016 and its now become a huge security risk to use the browser. I’d suggest moving to Edge if you use IE<br>
        to keep your information secure. Here’s a supporting article on it:<br>
        https://www.telegraph.co.uk/technology/2019/02/08/stop-using-internet-explorer-warns-microsofts-security-chief/</small><br>
        <br>
        Sincerely,<br>
        Team XILO <br>
        619-488-6476 <br>
        customer-success@xilo.io <br>
        San Diego, CA`;

        newEmail.isSentNow = true;
        newEmail.recipient = this.newAgent.email;
        newEmail.subject = 'Your New XILO Agent Account';

        this.emailService.post(newEmail)
        .subscribe(data => {
            this.loading = false;
            this.logService.success('New Agent Created Successfully');
        }, error => {
            this.loading = false;
            this.logService.console(error, false);
        });
    }

    styleGroups() {
        return {'margin-bottom': '37px'};
    }

    openDialog(vendor: string) {
         this.vendorService.getVendorByCompanyId(vendor, this.agent.id).subscribe((result: any) => {
            const dialogRef = this.dialog.open(VendorDialog, {
                width: 'auto',
                data: {
                    vendorName: vendor,
                    username: result.username
                }
            });
            dialogRef.afterClosed().subscribe(result => {
              result.agentId = this.agent.id;
              this.upsertVendor(result);
            });
        });
      }


      upsertVendor(vendor: any) {
        this.loading = true;
          if (typeof vendor !== 'undefined' && vendor.completed) {
              this.vendor = vendor;
              if (this.vendor.vendorName && this.vendor.carrier) {
                this.vendor.vendorName = (this.vendor.carrier).toUpperCase();
              }
            this.vendorService.upsertVendor(vendor)
                .subscribe((data: any) => {
                    this.loading = false;
                    this.logService.success('Credentials Added Successfully');
                    this.vendor = {carrier: null, vendorName: null, username: null, state: null, password: null, accessToken: null};
                    if (vendor.vendorName === 'QUOTERUSH' && data.status === 'create') {
                        this.company.quoteRushIntegrationId = data.newVendorID;
                    }
                }, error => {
                    this.loading = false;
                    this.logService.console(error, true);
                });
        }
        this.loading = false;
      }

}