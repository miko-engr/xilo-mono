import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertControllerService } from '../../../services/alert.service';
import { NoteService } from '../../../services/note.serivce';
import { Document } from '../../../models/document.model';
import { Client } from '../../../models/client.model';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { AgentService } from '../../../services/agent.service';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['../view-client.component.css']
})
export class DocumentsComponent implements OnInit {
  client = new Client(null);
  document = new Document(null);
  company = new Company(null);
//   editInputs = false;
  isAgent = false;
  isUser = false;
  loading = false;


  constructor(
    private noteService: NoteService,
    private router: Router,
    private alertService: AlertControllerService,
    private companyService: CompanyService,
    private clientService: ClientService,
    private agentService: AgentService
  ) { }

  ngOnInit() {
    this.getRoute();
  }

  openDocument(id: string) {
    this.clientService.getSignedDocumentUrl(id)
    .subscribe((data: any) => {
            window.open(data.url, '_blank')
        }, error => {
            console.log(error)
        });

    return false;
  }

  getRoute() {
      let url = this.router.url;
      let urlArray = url.split('/');
      let urlDirect = urlArray[1];
      let id = urlArray[4];
      if (urlDirect === 'profile') {
          this.getClient(id);
          this.getCompany();
          this.isUser = true;
      } else if (urlDirect === 'agent') {
          this.getClient(id);
          this.getCompanyAgents();
          this.isAgent = true;
      }

  }

  getClient(id: string) {
    const client = new Client(id);
    this.clientService.getClientByParams(client, 'documents')
        .subscribe(rClient => {
            this.client = rClient;
        }, error => {
        });
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
  
}
