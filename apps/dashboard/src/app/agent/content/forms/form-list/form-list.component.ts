import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Company } from '../../../../models/company.model';
import { Form } from '../../../../models/form.model';
import { LogService } from '../../../../services/log.service';
import { FormService } from '../../../../services/form.service';
import { CompanyService } from '../../../../services/company.service';
import { AgentService } from '../../../../services/agent.service';
import { Agent } from '../../../../models/agent.model';

@Component({
    selector: 'app-content-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['../form.component.css']
})
export class ContentFormsListComponent implements OnInit {
    company: Company;
    forms: Form[];
    companyRetrieved = false;
    formsRetrieved = false;
    loading = false;
    agent: Agent;

    constructor(
        private agentService: AgentService,
        private companyService: CompanyService,
        private formService: FormService,
        private logService: LogService,
    ) { }

    ngOnInit() {
      this.getCompany();
      this.getAgent();
      this.getForms();
    }

    getCompany() {
      this.company = new Company(null);
      this.companyService.getByAgent()
      .subscribe(company => {
          this.company = company['obj'];
          this.companyRetrieved = true;
      }, error => {
          this.logService.console(error, true);
      });
    }

    getAgent() {
      this.agentService.get()
        .subscribe(agent => {
            this.agent = agent['obj'];
        }, error => {
            this.logService.console(error, true);
        });
    }

    getForms() {
      this.loading = true;
      this.formService.getByCompany(true)
      .subscribe(forms => {
          this.forms = forms['obj'];
          this.formsRetrieved = true;
          this.loading = false;
      }, error => {
          this.logService.console(error, true);
          this.loading = false;
      });
    }

    returnFormUrl(form: Form, type: string) {
        let url = '';
        if (environment.production) {
          url += form.isV2Form ? 'https://insurance.xilo.io/' : 'https://app.xilo.io/client-app/';
        } else {
          url += 'http://localhost:4200/client-app/';
        }
        if (form.isSimpleForm) {
          url += `simple/form?companyId=${this.company.companyId}`;
        } else if (form.isAuto) {
          url += `auto/${type}?companyId=${this.company.companyId}`;
        } else if (form.isHome) {
          url += `home/${type}?companyId=${this.company.companyId}`;
        } else if (form.isAutoHome) {
          url += `auto-home/${type}?companyId=${this.company.companyId}`;
        } else if (form.isCommercial) {
          url += `commercial/${type}?companyId=${this.company.companyId}`;
        } else {
          url += `form/${type}?companyId=${this.company.companyId}`;
        }
        if (type === 'mobile') {
          url += '&question=0';
        }
        url += `&formId=${form.id}`;
        if (this.agent && this.agent.email) {
          url += `&agent=${this.agent.email}`;
        }
        return url;
    }

    copyLink(form: Form, type: string) {
      const formType = form.isSimpleForm ? 'simple' : form.isAuto ? 'auto' : form.isHome ? 'home' : 'form';
      const val = this.returnFormUrl(form, type);
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.logService.success(`${formType ? formType.toUpperCase() : ''} Link Copied`);
    }

}
