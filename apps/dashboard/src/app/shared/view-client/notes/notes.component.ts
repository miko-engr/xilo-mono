import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertControllerService } from '../../../services/alert.service';
import { NoteService } from '../../../services/note.serivce';
import { Note } from '../../../models/note.model';
import { Client } from '../../../models/client.model';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { AgentService } from '../../../services/agent.service';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['../view-client.component.css']
})
export class NotesComponent implements OnInit {
  client = new Client(null);
  note = new Note(null);
  company = new Company(null);
  editInputs = false;
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
          this.getLifecyclesAgents();
          this.isAgent = true;
      }

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
              
              this.alertService.serverError(error.error.errorType, error.error.data);
          });
  }

  onEditInputs() {
    this.note.text = '';
    this.editInputs = !this.editInputs;
  }

  getClient(id: string) {
    const client = new Client(id);
    this.clientService.getClientByParams(client, 'notes')
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

  getLifecyclesAgents() {
      this.agentService.getLifecycles()
          .subscribe(agent => {
              //  this.clientLifecycles = agent['obj'].company.lifecycles;
              this.company = agent['obj'].company;
          }, error => {
              
              this.alertService.serverError(error.error.errorType, error.error.data);
          });
  }
}
